import os
from fastapi import APIRouter
from backend.app.core.baseline_store import baseline_store
from backend.app.modules.trust_engine.schema import (
    QualityResponse, MotionResponse, FusionResponse, TrustResponse, BaselineResponse
)

from physiotrust.datasets.loaders import load_ecg, load_ppg
from physiotrust.ai.signal_processing.preprocessing import preprocess_ecg_pipeline
from physiotrust.ai.features.ecg import extract_ecg_features
from physiotrust.ai.features.ppg import extract_ppg_features
from physiotrust.ai.quality.quality_score import SignalQualityEngine
from physiotrust.ai.context.motion_detector import MotionArtifactDetector
from physiotrust.ai.fusion.fusion import MultiSensorFusionEngine
from physiotrust.ai.models.trust_model import TrustScoreAIModel
from physiotrust.ai.trust.reliability import TrustEngine
from physiotrust.ai.context.gatekeeper import ContextAwareness
from physiotrust.ai.personalization.baseline import PersonalizedBaseline
from physiotrust.ai.explainability.explainer import TrustExplainer
from physiotrust.ai.explainability.trust_reason import TrustExplanationEngine

router = APIRouter()
trust_ai_model = TrustScoreAIModel()


@router.get("/quality", response_model=QualityResponse)
def get_signal_quality(subject_id: str = "100"):
    data_obj = load_ecg(subject_id=subject_id, base_dir=os.path.join("data", "raw", "mitbih"))
    raw_sig = data_obj['signal']
    fs = data_obj['fs']
    clean_sig = preprocess_ecg_pipeline(raw_sig, fs=fs)
    win = clean_sig[:int(5.0 * fs)]

    q_breakdown = SignalQualityEngine.compute_sqi(win, fs=fs)
    return QualityResponse(
        subject_id=subject_id,
        overall_quality_score=q_breakdown.overall_quality_score,
        snr_db=q_breakdown.snr_db,
        powerline_interference_score=q_breakdown.powerline_interference_score,
        baseline_drift_score=q_breakdown.baseline_drift_score,
        entropy_score=q_breakdown.entropy_score,
        kurtosis_score=q_breakdown.kurtosis_score,
        amplitude_stability_score=q_breakdown.amplitude_stability_score
    )


@router.get("/motion", response_model=MotionResponse)
def get_motion_status(subject_id: str = "100"):
    data_obj = load_ecg(subject_id=subject_id, base_dir=os.path.join("data", "raw", "mitbih"))
    clean_sig = preprocess_ecg_pipeline(data_obj['signal'], fs=data_obj['fs'])
    win = clean_sig[:int(5.0 * data_obj['fs'])]
    motion_res = MotionArtifactDetector.detect_motion(win)
    return MotionResponse(
        subject_id=subject_id,
        motion_level=motion_res.motion_level,
        confidence_pct=motion_res.confidence_pct,
        vector_magnitude_g=motion_res.vector_magnitude_g,
        is_artefact_present=motion_res.is_artefact_present
    )


@router.get("/fusion", response_model=FusionResponse)
def get_sensor_fusion(subject_id: str = "100"):
    ecg_data = load_ecg(subject_id=subject_id, base_dir=os.path.join("data", "raw", "mitbih"))
    
    # Map subject_id to dynamic PPG record (e.g. S1..S15)
    digits = ''.join(filter(str.isdigit, subject_id))
    subj_num = (int(digits) % 15) + 1 if digits else 1
    ppg_subject_id = f"S{subj_num}"
    ppg_data = load_ppg(subject_id=ppg_subject_id)
    
    clean_ecg = preprocess_ecg_pipeline(ecg_data['signal'], fs=ecg_data['fs'])
    ecg_win = clean_ecg[:int(5.0 * ecg_data['fs'])]
    ppg_win = ppg_data['signal'][:int(5.0 * ppg_data['fs'])]

    ecg_feat = extract_ecg_features(ecg_win, fs=ecg_data['fs'])
    ppg_feat = extract_ppg_features(ppg_win, fs=ppg_data['fs'])
    sqi_ecg = SignalQualityEngine.compute_sqi(ecg_win, fs=ecg_data['fs']).overall_quality_score
    sqi_ppg = SignalQualityEngine.compute_sqi(ppg_win, fs=ppg_data['fs']).overall_quality_score
    
    motion_res = MotionArtifactDetector.detect_motion(ecg_win)

    fusion_out = MultiSensorFusionEngine.fuse_channels(
        ecg_bpm=ecg_feat.heart_rate_bpm,
        ppg_bpm=ppg_feat.pulse_rate_bpm,
        ecg_sqi=sqi_ecg * 100.0,
        ppg_sqi=sqi_ppg * 100.0,
        is_motion_high=motion_res.is_artefact_present
    )

    return FusionResponse(
        subject_id=subject_id,
        fused_heart_rate_bpm=fusion_out.fused_heart_rate_bpm,
        confidence_pct=fusion_out.confidence_pct,
        ecg_weight=fusion_out.ecg_weight,
        ppg_weight=fusion_out.ppg_weight,
        ecg_ppg_delta_bpm=fusion_out.sensor_agreement.ecg_ppg_delta_bpm,
        primary_reliable_sensor=fusion_out.sensor_agreement.primary_reliable_sensor
    )


@router.get("/trust", response_model=TrustResponse)
def get_trust_status(subject_id: str = "100", context: str = "rest"):
    data_obj = load_ecg(subject_id=subject_id, base_dir=os.path.join("data", "raw", "mitbih"))
    clean_sig = preprocess_ecg_pipeline(data_obj['signal'], fs=data_obj['fs'])
    win = clean_sig[:int(5.0 * data_obj['fs'])]

    q_breakdown = SignalQualityEngine.compute_sqi(win, fs=data_obj['fs'])
    ai_pred = trust_ai_model.predict_trust(
        snr_db=q_breakdown.snr_db,
        entropy_score=q_breakdown.entropy_score,
        kurtosis_score=q_breakdown.kurtosis_score,
        baseline_drift=q_breakdown.baseline_drift_score,
        motion_variance=0.05
    )

    trust_engine = TrustEngine()
    context_engine = ContextAwareness()

    rel_res = trust_engine.compute_reliability(win)
    ctx_res = context_engine.evaluate_reliability(rel_res.reliability_score, context=context)

    explanation = TrustExplainer.explain(rel_res, ctx_res, motion_level="LOW", sensor_agreement_score=0.98)

    return TrustResponse(
        subject_id=subject_id,
        trust_score=ai_pred.trust_score,
        confidence_level=ai_pred.confidence_level,
        is_reliable=ctx_res.is_reliable,
        context=ctx_res.context,
        threshold=ctx_res.threshold,
        explanation=explanation.to_dict()
    )


@router.get("/baseline/{subject_id}", response_model=BaselineResponse)
def get_baseline(subject_id: str):
    if subject_id not in baseline_store:
        baseline_store[subject_id] = PersonalizedBaseline(subject_id=subject_id)
    b = baseline_store[subject_id]
    return BaselineResponse(**b.get_summary())


@router.get("/trust-explanation")
def get_trust_explanation(subject_id: str = "100"):
    report = TrustExplanationEngine.explain_trust()
    return {"subject_id": subject_id, "trust_explanation": report.to_dict()}
