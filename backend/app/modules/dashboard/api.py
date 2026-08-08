import os
import numpy as np
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.core.baseline_store import baseline_store
from backend.app.modules.dashboard.schema import DashboardSummary, HealthResponse
from backend.app.modules.patients.service import list_users
from backend.app.modules.ecg.service import list_signal_records
from backend.app.modules.trust_engine.model import TrustRecord

from physiotrust.datasets.loaders import load_ecg, get_available_mitbih_records
from physiotrust.ai.signal_processing.preprocessing import preprocess_ecg_pipeline
from physiotrust.ai.features.ecg import extract_ecg_features
from physiotrust.ai.quality.quality_score import SignalQualityEngine
from physiotrust.ai.personalization.baseline import PersonalizedBaseline

from physiotrust.research.workspace import ResearchWorkspace
from physiotrust.demo.demo_environment import DemoEnvironment
from physiotrust.monitoring.health import SystemHealthMonitor

router = APIRouter()
research_ws = ResearchWorkspace()


@router.get("/health", response_model=HealthResponse)
def get_health():
    records = ["100", "101", "200"]
    return HealthResponse(
        status="healthy",
        version="0.8.0",
        engine="PhysioTrust v8.0 Hardened Internal Platform",
        available_records=records
    )




@router.get("/monitoring/health")
def get_system_health():
    report = SystemHealthMonitor.get_system_metrics()
    return report.to_dict()


@router.get("/demo/status")
def get_demo_status():
    status = DemoEnvironment.get_demo_status()
    records = DemoEnvironment.get_sample_demo_records()
    return {"status": status.to_dict(), "available_demo_records": records}


@router.get("/research/experiments")
def get_research_experiments():
    return {"experiments": research_ws.list_experiments()}


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
