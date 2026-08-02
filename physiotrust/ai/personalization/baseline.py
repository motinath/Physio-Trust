import numpy as np
from typing import List, Dict, Any


class PersonalizedBaseline:
    """
    Learns and tracks individual baseline metrics (e.g. signal variance, mean HRV).
    Only updates when signal window is marked 'Reliable' by the Context Gatekeeper.
    """

    def __init__(self, subject_id: str = "100"):
        self.subject_id = subject_id
        self.variance_history: List[float] = []

    def update(self, metric_val: float, is_reliable: bool):
        if is_reliable:
            self.variance_history.append(float(metric_val))

    def get_baseline_mean(self) -> float:
        if not self.variance_history:
            return 0.0
        return float(np.mean(self.variance_history))

    def get_baseline_std(self) -> float:
        if not self.variance_history:
            return 0.0
        return float(np.std(self.variance_history))

    def get_summary(self) -> Dict[str, Any]:
        return {
            "subject_id": self.subject_id,
            "sample_count": len(self.variance_history),
            "baseline_mean_variance": self.get_baseline_mean(),
            "baseline_std_variance": self.get_baseline_std(),
        }
