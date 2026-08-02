import numpy as np


class BaselineOnlineLearner:
    """
    Online Bayesian learning for continuous user physiological baseline adaptation.
    """

    def __init__(self, alpha: float = 0.05):
        self.alpha = alpha

    def update_baseline(self, current_baseline: float, new_observation: float) -> float:
        if current_baseline <= 0:
            return float(new_observation)
        updated = (1.0 - self.alpha) * current_baseline + self.alpha * new_observation
        return float(updated)
