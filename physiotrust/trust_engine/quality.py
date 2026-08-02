import numpy as np
from dataclasses import dataclass, asdict
from typing import Dict, Any
from physiotrust.signal_processing.features import SignalFeatures, extract_quality_features


@dataclass
class QualityMetrics:
    entropy_score: float
    kurtosis_score: float
    variance_score: float
    raw_features: SignalFeatures

    def to_dict(self) -> Dict[str, Any]:
        d = asdict(self)
        d['raw_features'] = self.raw_features.to_dict()
        return d


def sigmoid(x: float) -> float:
    return float(1.0 / (1.0 + np.exp(-x)))


class SignalQualityEngine:
    """
    Evaluates individual signal metrics and maps extracted statistical features
    to sub-scores normalized between 0.0 and 1.0.
    """

    @staticmethod
    def evaluate(signal_window: np.ndarray) -> QualityMetrics:
        features = extract_quality_features(signal_window)

        # 1. Entropy Score (Lower entropy -> structured ECG -> higher score)
        entropy_score = float(1.0 / (1.0 + features.entropy))

        # 2. Kurtosis Score (Higher kurtosis -> prominent QRS peaks -> higher score)
        kurtosis_score = sigmoid((features.kurtosis - 3.0) / 2.0)

        # 3. Variance Score (Penalty for flatlines)
        variance_score = sigmoid((features.variance - 0.1) * 10.0)

        return QualityMetrics(
            entropy_score=entropy_score,
            kurtosis_score=kurtosis_score,
            variance_score=variance_score,
            raw_features=features
        )
