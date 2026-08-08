from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any, Optional


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

    model_config = ConfigDict(from_attributes=True)


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
