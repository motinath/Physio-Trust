from pydantic import BaseModel
from typing import List


class DashboardSummary(BaseModel):
    active_users: int
    total_signals_ingested: int
    average_trust_score: float
    current_activity: str
    heart_rate_bpm: float
    signal_quality_pct: float
    baseline_variance: float
    system_status: str


class HealthResponse(BaseModel):
    status: str
    version: str
    engine: str
    available_records: List[str]
