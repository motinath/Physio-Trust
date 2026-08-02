import numpy as np
from dataclasses import dataclass, asdict
from typing import Dict, Any


@dataclass
class HealthStateMetrics:
    recovery_score_pct: float
    stress_score_pct: float
    fatigue_score_pct: float
    readiness_score_pct: float
    sleep_quality: str  # Excellent, Good, Fair, Poor
    cardiovascular_load: str  # Optimal, Moderate, High

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class HealthStateEstimator:
    """
    Estimates user readiness, recovery, fatigue, and stress scores from trusted physiological signals.
    """

    @staticmethod
    def estimate_state(
        hr_bpm: float,
        hrv_rmssd: float,
        baseline_hr: float = 64.0,
        baseline_hrv: float = 48.0
    ) -> HealthStateMetrics:
        hr_diff = hr_bpm - baseline_hr
        hrv_diff = hrv_rmssd - baseline_hrv

        # Recovery calculation
        rec = 85.0 + (hrv_diff * 0.5) - (hr_diff * 1.0)
        rec_clamped = float(np.clip(rec, 10.0, 99.0))

        # Stress calculation
        stress = 20.0 + (hr_diff * 1.5) - (hrv_diff * 0.3)
        stress_clamped = float(np.clip(stress, 5.0, 95.0))

        # Fatigue calculation
        fatigue = 100.0 - rec_clamped
        readiness = (rec_clamped * 0.7) + ((100.0 - stress_clamped) * 0.3)

        if readiness >= 80.0:
            sleep_q = "Good"
            cardio_l = "Optimal"
        elif readiness >= 50.0:
            sleep_q = "Fair"
            cardio_l = "Moderate"
        else:
            sleep_q = "Poor"
            cardio_l = "High"

        return HealthStateMetrics(
            recovery_score_pct=round(rec_clamped, 1),
            stress_score_pct=round(stress_clamped, 1),
            fatigue_score_pct=round(fatigue, 1),
            readiness_score_pct=round(readiness, 1),
            sleep_quality=sleep_q,
            cardiovascular_load=cardio_l
        )
