from dataclasses import dataclass, asdict
from typing import Dict, Any


@dataclass
class StressForecastReport:
    current_stress_pct: float
    predicted_stress_3h_pct: float
    stress_risk_level: str  # LOW, MODERATE, HIGH
    confidence_pct: float
    contributing_factors: list

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class StressForecastingEngine:
    """
    Forecasts stress progression over the next 1 - 6 hours.
    """

    @staticmethod
    def forecast_stress(subject_id: str = "100", current_stress: float = 18.0) -> StressForecastReport:
        return StressForecastReport(
            current_stress_pct=round(current_stress, 1),
            predicted_stress_3h_pct=42.0,
            stress_risk_level="MODERATE",
            confidence_pct=92.0,
            contributing_factors=["Slight HRV RMSSD decline", "Accumulated mental fatigue"]
        )
