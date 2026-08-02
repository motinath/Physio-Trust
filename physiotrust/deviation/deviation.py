import numpy as np
from dataclasses import dataclass, asdict
from typing import Dict, Any


@dataclass
class DeviationResult:
    current_value: float
    baseline_value: float
    difference_bpm: float
    z_score: float
    significance: str  # NORMAL, MODERATE, HIGH
    duration_minutes: int

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class DeviationDetector:
    """
    Detects personal physiological deviations from user baseline.
    """

    @staticmethod
    def evaluate_deviation(
        current_val: float,
        baseline_val: float,
        baseline_std: float = 5.0,
        duration_minutes: int = 15
    ) -> DeviationResult:
        diff = current_val - baseline_val
        std = max(baseline_std, 1.0)
        z = diff / std

        if abs(z) >= 3.0 or abs(diff) >= 20.0:
            sig = "HIGH"
        elif abs(z) >= 1.5 or abs(diff) >= 10.0:
            sig = "MODERATE"
        else:
            sig = "NORMAL"

        return DeviationResult(
            current_value=round(current_val, 1),
            baseline_value=round(baseline_val, 1),
            difference_bpm=round(diff, 1),
            z_score=round(z, 2),
            significance=sig,
            duration_minutes=duration_minutes
        )
