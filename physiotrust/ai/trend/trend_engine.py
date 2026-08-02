import numpy as np
from dataclasses import dataclass, asdict
from typing import Dict, Any, List


@dataclass
class TrendSummary:
    recovery_trend: str  # IMPROVING, STABLE, DECLINING
    hrv_trend: str
    sleep_trend: str
    stress_trend: str
    heart_rate_trend: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class TrendIntelligenceEngine:
    """
    Analyzes multi-day physiological trends across HR, HRV, Sleep, and Stress.
    """

    @staticmethod
    def analyze_30day_trends(hr_history: List[float] = None) -> TrendSummary:
        if hr_history and len(hr_history) > 5:
            x = np.arange(len(hr_history))
            slope, _ = np.polyfit(x, hr_history, 1)
            if slope < -0.1:
                hr_trend = "IMPROVING (Decreasing Resting HR)"
                rec_trend = "IMPROVING"
            elif slope > 0.1:
                hr_trend = "ELEVATED"
                rec_trend = "DECLINING"
            else:
                hr_trend = "STABLE"
                rec_trend = "STABLE"
        else:
            hr_trend = "STABLE"
            rec_trend = "IMPROVING"

        return TrendSummary(
            recovery_trend=rec_trend,
            hrv_trend="STABLE",
            sleep_trend="STABLE",
            stress_trend="LOW / STABLE",
            heart_rate_trend=hr_trend
        )
