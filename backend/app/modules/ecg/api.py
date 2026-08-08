import os
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.app.db.session import get_db
from backend.app.modules.ecg.schema import SignalCreate, SignalResponse
from backend.app.modules.ecg.service import list_signal_records, create_signal_record
from backend.app.modules.patients.service import get_or_create_user

from physiotrust.datasets.loaders import load_ecg
from physiotrust.ai.signal_processing.preprocessing import preprocess_ecg_pipeline

router = APIRouter()


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
    record = create_signal_record(
        db,
        user_id=user.id,
        signal_type=sig_in.signal_type or "ECG",
        raw_signal=sig_in.raw_signal,
        sampling_rate=sig_in.sampling_rate or 360.0
    )
    return SignalResponse(
        signal_id=record.signal_id,
        user_id=record.user_id,
        timestamp=record.timestamp.isoformat(),
        signal_type=record.signal_type,
        sampling_rate=record.sampling_rate
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
