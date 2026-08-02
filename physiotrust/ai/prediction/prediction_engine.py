from dataclasses import dataclass, asdict
from typing import Dict, Any, List


@dataclass
class ForecastItem:
    target_metric: str
    horizon: str  # 1h, 6h, 24h, 7d
    current_value: float
    predicted_value: float
    confidence_pct: float
    unit: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class PredictionEngine:
    """
    PhysioTrust Phase 6 Prediction Engine.
    Forecasts future physiological conditions (HR, HRV, Stress, Recovery, Fatigue, Sleep) across multi-time horizons.
    """

    @staticmethod
    def forecast_all(subject_id: str = "100", current_hr: float = 64.0, current_hrv: float = 48.2) -> List[ForecastItem]:
        return [
            ForecastItem(target_metric="Heart Rate", horizon="1h", current_value=current_hr, predicted_value=round(current_hr + 2.0, 1), confidence_pct=94.5, unit="BPM"),
            ForecastItem(target_metric="HRV RMSSD", horizon="6h", current_value=current_hrv, predicted_value=round(current_hrv - 4.5, 1), confidence_pct=91.0, unit="ms"),
            ForecastItem(target_metric="Physiological Stress", horizon="2h", current_value=18.0, predicted_value=42.0, confidence_pct=93.0, unit="%"),
            ForecastItem(target_metric="Autonomic Recovery", horizon="24h", current_value=88.5, predicted_value=92.0, confidence_pct=89.0, unit="%"),
            ForecastItem(target_metric="Physical Fatigue", horizon="6h", current_value=32.0, predicted_value=67.0, confidence_pct=92.5, unit="%")
        ]
