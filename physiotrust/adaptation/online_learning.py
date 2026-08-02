import numpy as np


class OnlineAdaptiveLearningEngine:
    """
    Long-term personalization engine continuously adapting user baseline models over days and months.
    """

    def __init__(self, learning_rate: float = 0.02):
        self.eta = learning_rate

    def adapt_user_model(self, historical_baseline: float, daily_observations: list) -> float:
        if not daily_observations:
            return historical_baseline
        mean_obs = float(np.mean(daily_observations))
        adapted = (1.0 - self.eta) * historical_baseline + self.eta * mean_obs
        return float(adapted)
