import numpy as np
from dataclasses import dataclass, asdict
from typing import Dict, Any, Optional
from .quality import SignalQualityEngine, QualityMetrics


@dataclass
class ReliabilityResult:
    reliability_score: float
    quality_metrics: QualityMetrics

    def to_dict(self) -> Dict[str, Any]:
        return {
            'reliability_score': self.reliability_score,
            'quality_metrics': self.quality_metrics.to_dict()
        }


class TrustEngine:
    """
    Core PhysioTrust Reliability Engine.
    Combines sub-scores (entropy, kurtosis, variance) into a final weighted score (0.0 to 1.0).
    """

    def __init__(self, weights: Optional[Dict[str, float]] = None):
        self.weights = weights or {
            'entropy': 0.4,
            'kurtosis': 0.4,
            'variance': 0.2
        }

    def compute_reliability(self, signal_window: np.ndarray) -> ReliabilityResult:
        metrics = SignalQualityEngine.evaluate(signal_window)

        weighted_score = (
            self.weights['entropy'] * metrics.entropy_score +
            self.weights['kurtosis'] * metrics.kurtosis_score +
            self.weights['variance'] * metrics.variance_score
        )

        reliability = float(np.clip(weighted_score, 0.0, 1.0))

        return ReliabilityResult(
            reliability_score=reliability,
            quality_metrics=metrics
        )
