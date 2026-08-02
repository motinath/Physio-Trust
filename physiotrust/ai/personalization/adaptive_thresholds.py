import numpy as np
from dataclasses import dataclass, asdict
from typing import Dict, Any


@dataclass
class DynamicThresholdBounds:
    lower_bound: float
    upper_bound: float
    baseline_mean: float
    baseline_std: float

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class AdaptiveThresholds:
    """
    Computes personalized dynamic thresholds (mean +/- 2*std) for a given metric.
    """

    @staticmethod
    def calculate_bounds(baseline_mean: float, baseline_std: float, n_sigma: float = 2.0) -> DynamicThresholdBounds:
        std = max(baseline_std, 0.05 * baseline_mean)
        lower = max(0.0, baseline_mean - n_sigma * std)
        upper = baseline_mean + n_sigma * std
        return DynamicThresholdBounds(
            lower_bound=round(lower, 2),
            upper_bound=round(upper, 2),
            baseline_mean=round(baseline_mean, 2),
            baseline_std=round(std, 2)
        )
