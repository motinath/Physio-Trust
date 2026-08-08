from pydantic import BaseModel
from typing import Dict, Any


class QualityResponse(BaseModel):
    subject_id: str
    overall_quality_score: float
    snr_db: float
    powerline_interference_score: float
    baseline_drift_score: float
    entropy_score: float
    kurtosis_score: float
    amplitude_stability_score: float


class MotionResponse(BaseModel):
    subject_id: str
    motion_level: str
    confidence_pct: float
    vector_magnitude_g: float
    is_artefact_present: bool


class FusionResponse(BaseModel):
    subject_id: str
    fused_heart_rate_bpm: float
    confidence_pct: float
    ecg_weight: float
    ppg_weight: float
    ecg_ppg_delta_bpm: float
    primary_reliable_sensor: str


class TrustResponse(BaseModel):
    subject_id: str
    trust_score: float
    confidence_level: str
    is_reliable: bool
    context: str
    threshold: float
    explanation: Dict[str, Any]


class BaselineResponse(BaseModel):
    subject_id: str
    sample_count: int
    baseline_mean_variance: float
    baseline_std_variance: float
