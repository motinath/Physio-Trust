from dataclasses import dataclass, asdict
from typing import Dict, Any, Tuple


@dataclass
class ContextEvaluationResult:
    is_reliable: bool
    context: str
    threshold: float
    score: float
    reason: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class ContextAwareness:
    """
    Context Engine: Dynamically evaluates trust scores against activity-dependent thresholds.
      - Rest: 0.60
      - Sleep: 0.70
      - Walking: 0.40
      - Running: 0.30 (permits noisier signals during dynamic movement)
    """

    DEFAULT_THRESHOLDS = {
        'rest': 0.60,
        'sleep': 0.70,
        'walking': 0.40,
        'running': 0.30
    }

    def __init__(self, thresholds: Dict[str, float] = None):
        self.context_thresholds = thresholds or self.DEFAULT_THRESHOLDS.copy()

    def evaluate_reliability(self, score: float, context: str = 'rest') -> ContextEvaluationResult:
        context_clean = context.lower()
        threshold = self.context_thresholds.get(context_clean, 0.50)
        is_reliable = bool(score >= threshold)
        status = "Reliable" if is_reliable else "Unreliable"
        reason = f"{status} (Score {score:.2f} vs Threshold {threshold:.2f} for {context_clean})"

        return ContextEvaluationResult(
            is_reliable=is_reliable,
            context=context_clean,
            threshold=threshold,
            score=score,
            reason=reason
        )
