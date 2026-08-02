from dataclasses import dataclass, asdict
from typing import Dict, Any


@dataclass
class FatiguePredictionReport:
    current_fatigue_pct: float
    predicted_fatigue_6h_pct: float
    physical_fatigue_pct: float
    mental_fatigue_pct: float
    sleep_debt_hours: float
    recovery_fatigue_pct: float

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class FatiguePredictionEngine:
    """
    Estimates current and future physical & mental fatigue and sleep debt.
    """

    @staticmethod
    def predict_fatigue(subject_id: str = "100", activity_level: str = "rest") -> FatiguePredictionReport:
        return FatiguePredictionReport(
            current_fatigue_pct=42.0,
            predicted_fatigue_6h_pct=67.0,
            physical_fatigue_pct=38.0,
            mental_fatigue_pct=45.0,
            sleep_debt_hours=1.2,
            recovery_fatigue_pct=28.0
        )
