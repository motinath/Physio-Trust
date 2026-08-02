import numpy as np
from typing import List, Dict, Any


class TrendTracker:
    """
    Tracks multi-window historical physiological trends (trust score drift, SNR trends, signal quality stability).
    """

    def __init__(self):
        self.scores: List[float] = []

    def record(self, trust_score: float):
        self.scores.append(float(trust_score))

    def get_trend_summary(self) -> Dict[str, Any]:
        if not self.scores:
            return {"status": "insufficient_data", "average_trust": 0.0, "drift_slope": 0.0}

        avg_trust = float(np.mean(self.scores))
        if len(self.scores) > 1:
            x = np.arange(len(self.scores))
            slope, _ = np.polyfit(x, self.scores, 1)
        else:
            slope = 0.0

        if slope > 0.01:
            trend_direction = "improving"
        elif slope < -0.01:
            trend_direction = "degrading"
        else:
            trend_direction = "stable"

        return {
            "total_windows": len(self.scores),
            "average_trust": round(avg_trust, 4),
            "trend_direction": trend_direction,
            "drift_slope": round(float(slope), 5)
        }
