from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


class UserCreate(BaseModel):
    subject_id: str = Field(..., description="Subject unique identifier (e.g. '100')")
    name: Optional[str] = Field("Anonymous Subject", description="Subject display name")
    age: Optional[int] = Field(30, description="Subject age")
    gender: Optional[str] = Field("unspecified", description="Subject gender")


class UserResponse(BaseModel):
    id: int
    subject_id: str
    name: str
    age: int
    gender: str
    baseline_variance: float

    class Config:
        from_attributes = True


class SignalCreate(BaseModel):
    subject_id: Optional[str] = Field("100", description="Subject ID")
    signal_type: Optional[str] = Field("ECG", description="Signal type: ECG, PPG, HRV")
    raw_signal: List[float] = Field(..., description="Raw numerical signal array")
    sampling_rate: Optional[float] = Field(360.0, description="Sampling rate in Hz")


class SignalResponse(BaseModel):
    signal_id: int
    user_id: Optional[int]
    timestamp: str
    signal_type: str
    sampling_rate: float

    class Config:
        from_attributes = True


class DashboardSummary(BaseModel):
    active_users: int
    total_signals_ingested: int
    average_trust_score: float
    current_activity: str
    heart_rate_bpm: float
    signal_quality_pct: float
    baseline_variance: float
    system_status: str


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


class HealthStateResponse(BaseModel):
    subject_id: str
    recovery_score_pct: float
    stress_score_pct: float
    fatigue_score_pct: float
    readiness_score_pct: float
    sleep_quality: str
    cardiovascular_load: str


class RecommendationResponse(BaseModel):
    subject_id: str
    recommendations: List[Dict[str, Any]]


class ProfileResponse(BaseModel):
    subject_id: str
    resting_hr_bpm: float
    resting_hrv_rmssd: float
    normal_hr_range_min: float
    normal_hr_range_max: float
    recovery_rate_bpm_per_min: float
    total_monitored_days: int


class TrendResponse(BaseModel):
    subject_id: str
    recovery_trend: str
    hrv_trend: str
    sleep_trend: str
    stress_trend: str
    heart_rate_trend: str


class ProcessRequest(BaseModel):
    subject_id: Optional[str] = Field("100", description="MIT-BIH subject record ID (e.g., '100')")
    context: Optional[str] = Field("rest", description="Context activity: rest, sleep, walking, running")
    window_sec: float = Field(5.0, description="Window duration in seconds")
    custom_signal: Optional[List[float]] = Field(None, description="Optional raw signal array")


class WindowSummary(BaseModel):
    window_index: int
    reliability_score: float
    is_reliable: bool
    context: str
    threshold: float
    reason: str
    quality_metrics: Dict[str, Any]
    explanation: Dict[str, Any]


class ProcessResponse(BaseModel):
    subject_id: str
    total_windows: int
    accepted_windows: int
    acceptance_rate: float
    personalized_variance_baseline: float
    context: str
    windows: List[WindowSummary]
    trend_summary: Dict[str, Any]


class HealthResponse(BaseModel):
    status: str
    version: str
    engine: str
    available_records: List[str]


class BaselineResponse(BaseModel):
    subject_id: str
    sample_count: int
    baseline_mean_variance: float
    baseline_std_variance: float
