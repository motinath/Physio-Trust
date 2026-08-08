import os
import numpy as np
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.core.baseline_store import baseline_store
from backend.app.modules.ecg.schema import ProcessRequest, ProcessResponse, WindowSummary
from backend.app.modules.ecg.service import create_signal_record, store_trust_record
from backend.app.modules.patients.service import get_or_create_user, update_user_baseline

from physiotrust.datasets.loaders import load_ecg
from physiotrust.ai.signal_processing.preprocessing import preprocess_ecg_pipeline
from physiotrust.ai.signal_processing.segmentation import segment_signal
from physiotrust.ai.trust.reliability import TrustEngine
from physiotrust.ai.context.gatekeeper import ContextAwareness
from physiotrust.ai.personalization.baseline import PersonalizedBaseline
from physiotrust.ai.prediction.trends import TrendTracker
from physiotrust.ai.explainability.explainer import TrustExplainer

router = APIRouter()


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
