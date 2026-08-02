import os
import numpy as np
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import text

from backend.app.db.session import get_db, Base, engine
from backend.app.db.models import TrustRecord, BaselineRecord, HealthMemoryRecord
from backend.app.schemas.models import (
    ProcessRequest, ProcessResponse, WindowSummary, HealthResponse, BaselineResponse,
    UserCreate, UserResponse, SignalCreate, SignalResponse, DashboardSummary,
    QualityResponse, MotionResponse, FusionResponse, TrustResponse,
    HealthStateResponse, RecommendationResponse, ProfileResponse, TrendResponse
)
from backend.app.services.user_service import get_or_create_user, list_users, update_user_baseline
from backend.app.services.signal_service import create_signal_record, list_signal_records, store_trust_record

from physiotrust.datasets.loaders import load_ecg, load_ppg, get_available_mitbih_records, load_hrv
from physiotrust.signal_processing.preprocessing import preprocess_ecg_pipeline
from physiotrust.signal_processing.segmentation import segment_signal
from physiotrust.quality_engine.quality_score import SignalQualityEngine
from physiotrust.motion_engine.motion_detector import MotionArtifactDetector
from physiotrust.fusion_engine.fusion import MultiSensorFusionEngine
from physiotrust.features.ecg import extract_ecg_features
from physiotrust.features.ppg import extract_ppg_features
from physiotrust.models.trust_model import TrustScoreAIModel
from physiotrust.trust_engine.reliability import TrustEngine
from physiotrust.context_engine.gatekeeper import ContextAwareness
from physiotrust.personalization.baseline import PersonalizedBaseline
from physiotrust.explainability.explainer import TrustExplainer
from physiotrust.prediction.trends import TrendTracker

from physiotrust.health_state.health_state import HealthStateEstimator
from physiotrust.recommendation.recommendation import RecommendationEngine
from physiotrust.memory.profile import get_default_user_profile
from physiotrust.trend.trend_engine import TrendIntelligenceEngine
from physiotrust.trend.analytics import TrendAnalyticsService
from physiotrust.ai.personalization.baseline_service import BaselineService
from physiotrust.ai.personalization.circadian_model import CircadianEngine
from physiotrust.memory.profile_manager import ProfileManager

from physiotrust.ai.explainability.confidence_engine import ConfidenceEngine
from physiotrust.ai.explainability.feature_importance import FeatureAttributionEngine
from physiotrust.ai.explainability.reasoning_engine import DecisionReasoningEngine
from physiotrust.ai.explainability.trust_reason import TrustExplanationEngine
from physiotrust.ai.explainability.recommendation_reason import RecommendationExplanationEngine
from physiotrust.ai.explainability.levels import MultiLevelExplanationSystem
from physiotrust.ai.explainability.nlg.summary_generator import NaturalLanguageGenerator

from physiotrust.ai.prediction.prediction_engine import PredictionEngine
from physiotrust.ai.prediction.forecast.trend_forecast import TrendForecastingEngine
from physiotrust.ai.prediction.fatigue.fatigue_model import FatiguePredictionEngine
from physiotrust.ai.prediction.recovery.recovery_prediction import RecoveryPredictionEngine
from physiotrust.ai.prediction.stress.stress_forecast import StressForecastingEngine
from physiotrust.ai.prediction.risk.risk_engine import HealthRiskEngine
from physiotrust.ai.prediction.warning.warning_engine import EarlyWarningEngine
from physiotrust.ai.prediction.simulation.scenario_engine import ScenarioSimulationEngine
from physiotrust.ai.prediction.predictive_recommendation.predictive_advice import PredictiveRecommendationEngine

from physiotrust.auth.jwt import JWTAuthManager
from physiotrust.auth.roles import UserRole
from physiotrust.research.workspace import ResearchWorkspace
from physiotrust.demo.demo_environment import DemoEnvironment
from physiotrust.monitoring.health import SystemHealthMonitor

# Auto-create tables & execute column migration if needed
Base.metadata.create_all(bind=engine)

try:
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE users ADD COLUMN height_cm FLOAT DEFAULT 175.0;"))
        conn.execute(text("ALTER TABLE users ADD COLUMN weight_kg FLOAT DEFAULT 70.0;"))
        conn.execute(text("ALTER TABLE users ADD COLUMN fitness_level VARCHAR(50) DEFAULT 'Moderate';"))
        conn.commit()
except Exception:
    pass

router = APIRouter()
baseline_store = {}
trust_ai_model = TrustScoreAIModel()
research_ws = ResearchWorkspace()


# PHASE 8 AUTHENTICATION & PLATFORM HARDENING ENDPOINTS
@router.post("/auth/login")
def login_internal_user(subject_id: str = "100", role: str = "Researcher"):
    token = JWTAuthManager.create_access_token(subject_id=subject_id, role=role)
    return {
        "access_token": token,
        "token_type": "bearer",
        "subject_id": subject_id,
        "role": role,
        "message": f"Authenticated successfully as {role}"
    }


@router.get("/monitoring/health")
def get_system_health():
    report = SystemHealthMonitor.get_system_metrics()
    return report.to_dict()


@router.get("/research/experiments")
def get_research_experiments():
    return {"experiments": research_ws.list_experiments()}


@router.get("/demo/status")
def get_demo_status():
    status = DemoEnvironment.get_demo_status()
    records = DemoEnvironment.get_sample_demo_records()
    return {"status": status.to_dict(), "available_demo_records": records}


@router.get("/health", response_model=HealthResponse)
def get_health():
    records = get_available_mitbih_records(os.path.join("data", "raw", "mitbih"))
    return HealthResponse(
        status="healthy",
        version="0.8.0",
        engine="PhysioTrust v8.0 Hardened Internal Platform",
        available_records=records or ["100"]
    )


@router.get("/users", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return list_users(db)


@router.post("/users", response_model=UserResponse)
def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
    return get_or_create_user(db, subject_id=user_in.subject_id, name=user_in.name, age=user_in.age, gender=user_in.gender)


@router.get("/signals", response_model=List[SignalResponse])
def get_signals(db: Session = Depends(get_db)):
    recs = list_signal_records(db)
    return [
        SignalResponse(
            signal_id=r.signal_id,
            user_id=r.user_id,
            timestamp=r.timestamp.isoformat() if r.timestamp else "",
            signal_type=r.signal_type,
            sampling_rate=r.sampling_rate
        ) for r in recs
    ]


@router.post("/signals", response_model=SignalResponse)
def post_signal(sig_in: SignalCreate, db: Session = Depends(get_db)):
    user = get_or_create_user(db, subject_id=sig_in.subject_id or "100")
    record = create_signal_record(db, user_id=user.id, signal_type=sig_in.signal_type or "ECG", raw_signal=sig_in.raw_signal, sampling_rate=sig_in.sampling_rate or 360.0)
    return SignalResponse(
        signal_id=record.signal_id,
        user_id=record.user_id,
        timestamp=record.timestamp.isoformat(),
        signal_type=record.signal_type,
        sampling_rate=record.sampling_rate
    )


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
    ppg_data = load_ppg(subject_id="S1")
    
    clean_ecg = preprocess_ecg_pipeline(ecg_data['signal'], fs=ecg_data['fs'])
    ecg_win = clean_ecg[:int(5.0 * ecg_data['fs'])]
    ppg_win = ppg_data['signal'][:int(5.0 * ppg_data['fs'])]

    ecg_feat = extract_ecg_features(ecg_win, fs=ecg_data['fs'])
    ppg_feat = extract_ppg_features(ppg_win, fs=ppg_data['fs'])
    sqi_ecg = SignalQualityEngine.compute_sqi(ecg_win, fs=ecg_data['fs']).overall_quality_score
    
    fusion_out = MultiSensorFusionEngine.fuse_channels(
        ecg_bpm=ecg_feat.heart_rate_bpm,
        ppg_bpm=ppg_feat.pulse_rate_bpm,
        ecg_sqi=sqi_ecg,
        ppg_sqi=88.0,
        is_motion_high=False
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


# PHASE 6 PREDICTIVE ENDPOINTS
@router.get("/prediction")
def get_predictions(subject_id: str = "100"):
    forecasts = PredictionEngine.forecast_all(subject_id=subject_id)
    return {"subject_id": subject_id, "forecasts": [f.to_dict() for f in forecasts]}


@router.get("/forecast")
def get_trend_forecasts(subject_id: str = "100"):
    trends = TrendForecastingEngine.get_trend_forecasts(subject_id=subject_id)
    return {"subject_id": subject_id, "trend_forecasts": [t.to_dict() for t in trends]}


@router.get("/fatigue")
def get_fatigue_prediction(subject_id: str = "100"):
    report = FatiguePredictionEngine.predict_fatigue(subject_id=subject_id)
    return {"subject_id": subject_id, "fatigue": report.to_dict()}


@router.get("/recovery")
def get_recovery_prediction(subject_id: str = "100"):
    report = RecoveryPredictionEngine.predict_recovery(subject_id=subject_id)
    return {"subject_id": subject_id, "recovery": report.to_dict()}


@router.get("/stress")
def get_stress_forecast(subject_id: str = "100"):
    report = StressForecastingEngine.forecast_stress(subject_id=subject_id)
    return {"subject_id": subject_id, "stress_forecast": report.to_dict()}


@router.get("/risk")
def get_health_risks(subject_id: str = "100"):
    risks = HealthRiskEngine.evaluate_risks(subject_id=subject_id)
    return {"subject_id": subject_id, "risks": [r.to_dict() for r in risks]}


@router.get("/warnings")
def get_early_warnings(subject_id: str = "100"):
    warnings = EarlyWarningEngine.get_active_warnings(subject_id=subject_id)
    return {"subject_id": subject_id, "warnings": [w.to_dict() for w in warnings]}


@router.get("/simulation")
def get_scenario_simulations(subject_id: str = "100"):
    scenarios = ScenarioSimulationEngine.simulate_scenarios(subject_id=subject_id)
    return {"subject_id": subject_id, "simulations": [s.to_dict() for s in scenarios]}


@router.get("/predictive-recommendation")
def get_predictive_recommendations(subject_id: str = "100"):
    advice = PredictiveRecommendationEngine.generate_predictive_advice(subject_id=subject_id)
    return {"subject_id": subject_id, "predictive_advice": [a.to_dict() for a in advice]}


@router.get("/explanation")
def get_full_explanation(subject_id: str = "100"):
    levels = MultiLevelExplanationSystem.generate_levels()
    nlg = NaturalLanguageGenerator.generate_summary()
    return {
        "subject_id": subject_id,
        "explanation_levels": levels.to_dict(),
        "nlg_modes": nlg.to_dict()
    }


@router.get("/confidence")
def get_confidence_report(subject_id: str = "100"):
    report = ConfidenceEngine.compute_confidence()
    return {"subject_id": subject_id, "confidence": report.to_dict()}


@router.get("/feature-importance")
def get_feature_importance(subject_id: str = "100"):
    attributions = FeatureAttributionEngine.compute_attributions()
    return {"subject_id": subject_id, "feature_attributions": [a.to_dict() for a in attributions]}


@router.get("/reasoning")
def get_decision_reasoning(subject_id: str = "100"):
    chain = DecisionReasoningEngine.build_reasoning_chain()
    return {"subject_id": subject_id, "reasoning_chain": [step.to_dict() for step in chain]}


@router.get("/trust-explanation")
def get_trust_explanation(subject_id: str = "100"):
    report = TrustExplanationEngine.explain_trust()
    return {"subject_id": subject_id, "trust_explanation": report.to_dict()}


@router.get("/recommendation-explanation")
def get_recommendation_explanation(subject_id: str = "100"):
    report = RecommendationExplanationEngine.explain_recommendation()
    return {"subject_id": subject_id, "recommendation_explanation": report.to_dict()}


@router.get("/circadian")
def get_circadian_rhythm(subject_id: str = "100"):
    profile = CircadianEngine.get_circadian_profile(resting_hr=64.0)
    return {"subject_id": subject_id, "circadian_profile": profile.to_dict()}


@router.get("/memory")
def get_health_memory(subject_id: str = "100"):
    return {
        "subject_id": subject_id,
        "historical_averages": {
            "7d_avg_resting_hr": 63.8,
            "30d_avg_resting_hr": 64.2,
            "7d_avg_hrv_rmssd": 47.8,
            "30d_avg_hrv_rmssd": 48.5
        }
    }


@router.get("/health-state", response_model=HealthStateResponse)
def get_health_state(subject_id: str = "100"):
    data_obj = load_ecg(subject_id=subject_id, base_dir=os.path.join("data", "raw", "mitbih"))
    clean_sig = preprocess_ecg_pipeline(data_obj['signal'], fs=data_obj['fs'])
    win = clean_sig[:int(5.0 * data_obj['fs'])]
    
    ecg_feat = extract_ecg_features(win, fs=data_obj['fs'])
    hrv = load_hrv(subject_id=subject_id)
    
    state_metrics = HealthStateEstimator.estimate_state(
        hr_bpm=ecg_feat.heart_rate_bpm,
        hrv_rmssd=hrv['mean_hrv_rmssd'],
        baseline_hr=64.0,
        baseline_hrv=48.2
    )

    return HealthStateResponse(
        subject_id=subject_id,
        recovery_score_pct=state_metrics.recovery_score_pct,
        stress_score_pct=state_metrics.stress_score_pct,
        fatigue_score_pct=state_metrics.fatigue_score_pct,
        readiness_score_pct=state_metrics.readiness_score_pct,
        sleep_quality=state_metrics.sleep_quality,
        cardiovascular_load=state_metrics.cardiovascular_load
    )


@router.get("/recommendations", response_model=RecommendationResponse)
def get_recommendations(subject_id: str = "100"):
    data_obj = load_ecg(subject_id=subject_id, base_dir=os.path.join("data", "raw", "mitbih"))
    clean_sig = preprocess_ecg_pipeline(data_obj['signal'], fs=data_obj['fs'])
    win = clean_sig[:int(5.0 * data_obj['fs'])]
    
    ecg_feat = extract_ecg_features(win, fs=data_obj['fs'])
    recs = RecommendationEngine.generate_recommendations(
        hr_bpm=ecg_feat.heart_rate_bpm,
        baseline_hr=64.0,
        readiness_pct=88.5,
        trust_score=0.97
    )
    return RecommendationResponse(
        subject_id=subject_id,
        recommendations=[r.to_dict() for r in recs]
    )


@router.get("/profile", response_model=ProfileResponse)
def get_user_profile(subject_id: str = "100"):
    profile = get_default_user_profile(subject_id=subject_id)
    return ProfileResponse(**profile.to_dict())


@router.get("/trend", response_model=TrendResponse)
def get_trend_intelligence(subject_id: str = "100"):
    trends = TrendIntelligenceEngine.analyze_30day_trends()
    return TrendResponse(
        subject_id=subject_id,
        recovery_trend=trends.recovery_trend,
        hrv_trend=trends.hrv_trend,
        sleep_trend=trends.sleep_trend,
        stress_trend=trends.stress_trend,
        heart_rate_trend=trends.heart_rate_trend
    )


@router.get("/dashboard", response_model=DashboardSummary)
def get_dashboard_summary(subject_id: str = "100", db: Session = Depends(get_db)):
    users = list_users(db)
    signals = list_signal_records(db)
    
    data_obj = load_ecg(subject_id=subject_id, base_dir=os.path.join("data", "raw", "mitbih"))
    clean_sig = preprocess_ecg_pipeline(data_obj['signal'], fs=data_obj['fs'])
    win = clean_sig[:int(5.0 * data_obj['fs'])]

    ecg_feat = extract_ecg_features(win, fs=data_obj['fs'])
    sqi_breakdown = SignalQualityEngine.compute_sqi(win, fs=data_obj['fs'])
    
    trust_recs = db.query(TrustRecord).all()
    avg_trust = float(np.mean([r.trust_score for r in trust_recs])) if trust_recs else 0.97

    if subject_id not in baseline_store:
        baseline_store[subject_id] = PersonalizedBaseline(subject_id=subject_id)
    baseline_val = baseline_store[subject_id].get_baseline_mean()

    return DashboardSummary(
        active_users=len(users),
        total_signals_ingested=len(signals),
        average_trust_score=round(avg_trust, 4),
        current_activity="rest",
        heart_rate_bpm=ecg_feat.heart_rate_bpm,
        signal_quality_pct=sqi_breakdown.overall_quality_score,
        baseline_variance=round(baseline_val, 4),
        system_status="Operational — Hardened Internal Release v8.0"
    )


@router.get("/waveform")
def get_waveform(subject_id: str = "100", window_idx: int = 0):
    data_obj = load_ecg(subject_id=subject_id, base_dir=os.path.join("data", "raw", "mitbih"))
    raw_sig = data_obj['signal']
    fs = data_obj['fs']
    clean_sig = preprocess_ecg_pipeline(raw_sig, fs=fs)

    window_samples = int(5.0 * fs)
    start_idx = window_idx * window_samples
    end_idx = start_idx + window_samples

    raw_chunk = raw_sig[start_idx:end_idx].tolist() if start_idx < len(raw_sig) else raw_sig[:1800].tolist()
    clean_chunk = clean_sig[start_idx:end_idx].tolist() if start_idx < len(clean_sig) else clean_sig[:1800].tolist()

    return {
        "subject_id": subject_id,
        "window_index": window_idx,
        "fs": fs,
        "raw_chunk": [round(v, 4) for v in raw_chunk],
        "clean_chunk": [round(v, 4) for v in clean_chunk]
    }


@router.get("/baseline/{subject_id}", response_model=BaselineResponse)
def get_baseline(subject_id: str):
    if subject_id not in baseline_store:
        baseline_store[subject_id] = PersonalizedBaseline(subject_id=subject_id)
    b = baseline_store[subject_id]
    return BaselineResponse(**b.get_summary())


@router.post("/process", response_model=ProcessResponse)
def process_signal(req: ProcessRequest, db: Session = Depends(get_db)):
    fs = 360.0

    if req.custom_signal is not None and len(req.custom_signal) > 0:
        raw_signal = np.array(req.custom_signal, dtype=float)
        signal_name = "Custom_Wearable_Stream"
    else:
        subject_id = req.subject_id or '100'
        data_obj = load_ecg(subject_id=subject_id, base_dir=os.path.join("data", "raw", "mitbih"))
        raw_signal = data_obj['signal']
        fs = data_obj['fs']
        signal_name = f"MITBIH_{data_obj['name']}"

    user = get_or_create_user(db, subject_id=req.subject_id or "100")
    sig_record = create_signal_record(db, user_id=user.id, signal_type="ECG", raw_signal=raw_signal.tolist()[:500], sampling_rate=fs)

    clean_signal = preprocess_ecg_pipeline(raw_signal, fs=fs)
    windows = segment_signal(clean_signal, window_size_sec=req.window_sec, fs=fs)

    trust_engine = TrustEngine()
    context_engine = ContextAwareness()
    
    if req.subject_id not in baseline_store:
        baseline_store[req.subject_id] = PersonalizedBaseline(subject_id=req.subject_id)
    baseline_engine = baseline_store[req.subject_id]

    trend_tracker = TrendTracker()

    window_summaries = []
    accepted_count = 0

    for idx, win in enumerate(windows):
        rel_result = trust_engine.compute_reliability(win)
        ctx_eval = context_engine.evaluate_reliability(rel_result.reliability_score, context=req.context or 'rest')
        
        if ctx_eval.is_reliable:
            accepted_count += 1
            baseline_engine.update(rel_result.quality_metrics.raw_features.variance, is_reliable=True)

        trend_tracker.record(rel_result.reliability_score)

        explanation = TrustExplainer.explain(
            rel_result,
            ctx_eval,
            subject_baseline_mean=baseline_engine.get_baseline_mean(),
            motion_level="LOW",
            sensor_agreement_score=0.98
        )

        window_summaries.append(WindowSummary(
            window_index=idx,
            reliability_score=round(rel_result.reliability_score, 4),
            is_reliable=ctx_eval.is_reliable,
            context=ctx_eval.context,
            threshold=ctx_eval.threshold,
            reason=ctx_eval.reason,
            quality_metrics=rel_result.quality_metrics.to_dict(),
            explanation=explanation.to_dict()
        ))

    total = len(windows)
    acceptance_rate = round((accepted_count / total * 100.0), 2) if total > 0 else 0.0

    store_trust_record(
        db,
        signal_id=sig_record.signal_id,
        quality_score=acceptance_rate,
        trust_score=round(np.mean([w.reliability_score for w in window_summaries]), 4) if window_summaries else 0.0,
        explanation=f"Batch processed {total} windows. Acceptance rate: {acceptance_rate}%",
        quality_metrics={"acceptance_rate": acceptance_rate, "total_windows": total}
    )

    update_user_baseline(db, subject_id=req.subject_id or "100", baseline_variance=baseline_engine.get_baseline_mean())

    return ProcessResponse(
        subject_id=signal_name,
        total_windows=total,
        accepted_windows=accepted_count,
        acceptance_rate=acceptance_rate,
        personalized_variance_baseline=round(baseline_engine.get_baseline_mean(), 4),
        context=req.context or 'rest',
        windows=window_summaries,
        trend_summary=trend_tracker.get_trend_summary()
    )
