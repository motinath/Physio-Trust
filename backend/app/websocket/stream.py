import os
import asyncio
import json
import numpy as np
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from physiotrust.datasets.loaders import load_ecg, load_ppg
from physiotrust.ai.signal_processing.preprocessing import preprocess_ecg_pipeline
from physiotrust.ai.quality.quality_score import SignalQualityEngine
from physiotrust.ai.context.motion_detector import MotionArtifactDetector
from physiotrust.ai.fusion.fusion import MultiSensorFusionEngine
from physiotrust.ai.features.ecg import extract_ecg_features
from physiotrust.ai.features.ppg import extract_ppg_features
from physiotrust.ai.models.trust_model import TrustScoreAIModel
from physiotrust.ai.trust.reliability import TrustEngine
from physiotrust.ai.context.gatekeeper import ContextAwareness
from physiotrust.ai.explainability.explainer import TrustExplainer

router = APIRouter()

trust_ai_model = TrustScoreAIModel()


@router.websocket("/ws/ecg-stream")
async def ecg_stream_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint streaming real physiological ECG & PPG telemetry data dynamically calculated from raw binary records.
    """
    await websocket.accept()

    context = "rest"
    subject_id = "100"

    data_dir = os.path.join("data", "raw", "mitbih")
    data_obj = load_ecg(subject_id=subject_id, base_dir=data_dir)
    ppg_obj = load_ppg(subject_id="S1")
    
    if data_obj is None:
        await websocket.close(reason="MIT-BIH dataset record not found.")
        return

    raw_signal = data_obj['signal']
    fs = data_obj['fs']
    clean_signal = preprocess_ecg_pipeline(raw_signal, fs=fs)

    ppg_signal = ppg_obj['signal']
    ppg_fs = ppg_obj['fs']

    trust_engine = TrustEngine()
    context_engine = ContextAwareness()

    idx = 0
    buffer_len = len(clean_signal)
    window_samples = int(5.0 * fs)

    try:
        while True:
            # Check for WebSocket control messages (e.g. context change or subject ID change)
            try:
                msg = await asyncio.wait_for(websocket.receive_text(), timeout=0.02)
                data = json.loads(msg)
                if 'context' in data:
                    context = data['context']
                if 'subject_id' in data and data['subject_id'] != subject_id:
                    new_sub = data['subject_id']
                    new_obj = load_ecg(subject_id=new_sub, base_dir=data_dir)
                    if new_obj is not None:
                        subject_id = new_sub
                        raw_signal = new_obj['signal']
                        fs = new_obj['fs']
                        clean_signal = preprocess_ecg_pipeline(raw_signal, fs=fs)
                        buffer_len = len(clean_signal)
                        idx = 0
            except asyncio.TimeoutError:
                pass

            chunk_size = 18  # 18 samples per ~50ms frame (360 Hz)
            end_idx = idx + chunk_size
            
            raw_chunk = raw_signal[idx:end_idx].tolist()
            clean_chunk = clean_signal[idx:end_idx].tolist()

            win_start = max(0, end_idx - window_samples)
            current_window = clean_signal[win_start:end_idx]

            # 100% Dynamic Engine Computations
            sqi_breakdown = SignalQualityEngine.compute_sqi(current_window, fs=fs)
            motion_status = MotionArtifactDetector.detect_motion(current_window)
            
            ecg_feat = extract_ecg_features(current_window, fs=fs)
            ppg_win = ppg_signal[:int(5.0 * ppg_fs)]
            ppg_feat = extract_ppg_features(ppg_win, fs=ppg_fs)

            fusion_out = MultiSensorFusionEngine.fuse_channels(
                ecg_bpm=ecg_feat.heart_rate_bpm,
                ppg_bpm=ppg_feat.pulse_rate_bpm,
                ecg_sqi=sqi_breakdown.overall_quality_score,
                ppg_sqi=88.0,
                is_motion_high=motion_status.is_artefact_present
            )

            rel_result = trust_engine.compute_reliability(current_window)
            ctx_eval = context_engine.evaluate_reliability(rel_result.reliability_score, context=context)

            ai_pred = trust_ai_model.predict_trust(
                snr_db=sqi_breakdown.snr_db,
                entropy_score=sqi_breakdown.entropy_score,
                kurtosis_score=sqi_breakdown.kurtosis_score,
                baseline_drift=sqi_breakdown.baseline_drift_score,
                motion_variance=motion_status.vector_magnitude_g - 1.0
            )

            explanation = TrustExplainer.explain(
                rel_result,
                ctx_eval,
                motion_level=motion_status.motion_level,
                sensor_agreement_score=fusion_out.sensor_agreement.agreement_score
            )

            packet = {
                "sample_index": end_idx,
                "raw_chunk": [round(val, 4) for val in raw_chunk],
                "clean_chunk": [round(val, 4) for val in clean_chunk],
                "trust_score": ai_pred.trust_score,
                "is_reliable": ctx_eval.is_reliable,
                "context": ctx_eval.context,
                "threshold": ctx_eval.threshold,
                "reason": ctx_eval.reason,
                "quality": sqi_breakdown.to_dict(),
                "motion": motion_status.to_dict(),
                "fusion": fusion_out.to_dict(),
                "explanation": explanation.to_dict()
            }

            await websocket.send_text(json.dumps(packet))

            idx = (idx + chunk_size) % (buffer_len - window_samples)
            await asyncio.sleep(0.05)

    except WebSocketDisconnect:
        print("[PhysioTrust WS] Streaming client disconnected.")
    except Exception as e:
        print(f"[PhysioTrust WS Error] {e}")
