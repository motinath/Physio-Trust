from pydantic import BaseModel
from typing import List, Dict, Any


class HealthStateResponse(BaseModel):
    subject_id: str
    overall_state: str = "OPTIMAL"
    recovery_score_pct: float
    stress_score_pct: float
    fatigue_score_pct: float
    readiness_score_pct: float
    sleep_quality: str
    cardiovascular_load: str


class RecommendationResponse(BaseModel):
    subject_id: str
    recommendations: List[Dict[str, Any]]


class TrendResponse(BaseModel):
    subject_id: str
    recovery_trend: str
    hrv_trend: str
    sleep_trend: str
    stress_trend: str
    heart_rate_trend: str
