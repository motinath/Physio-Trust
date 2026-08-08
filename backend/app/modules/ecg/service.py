import json
from sqlalchemy.orm import Session
from backend.app.modules.ecg.model import SignalRecord
from backend.app.modules.trust_engine.model import TrustRecord
from typing import List, Dict, Any, Optional


def create_signal_record(db: Session, user_id: Optional[int], signal_type: str, raw_signal: List[float], sampling_rate: float) -> SignalRecord:
    raw_str = json.dumps(raw_signal[:1000])  # Store snippet sample
    record = SignalRecord(
        user_id=user_id,
        signal_type=signal_type,
        raw_signal=raw_str,
        sampling_rate=sampling_rate
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def list_signal_records(db: Session) -> List[SignalRecord]:
    return db.query(SignalRecord).order_by(SignalRecord.timestamp.desc()).limit(50).all()


def store_trust_record(db: Session, signal_id: Optional[int], quality_score: float, trust_score: float, explanation: str, quality_metrics: Dict[str, Any]) -> TrustRecord:
    record = TrustRecord(
        signal_id=signal_id,
        quality_score=quality_score,
        trust_score=trust_score,
        explanation=explanation,
        quality_metrics_json=quality_metrics
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record
