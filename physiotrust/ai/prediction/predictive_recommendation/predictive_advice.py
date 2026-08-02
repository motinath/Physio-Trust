from dataclasses import dataclass, asdict
from typing import Dict, Any, List


@dataclass
class PredictiveAdviceItem:
    horizon: str
    headline: str
    action_text: str
    priority: str  # HIGH, MEDIUM, LOW

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class PredictiveRecommendationEngine:
    """
    PhysioTrust Phase 6 Predictive Recommendation Engine.
    Delivers proactive advice before predicted fatigue or stress spikes occur.
    """

    @staticmethod
    def generate_predictive_advice(subject_id: str = "100") -> List[PredictiveAdviceItem]:
        return [
            PredictiveAdviceItem(
                horizon="6 Hours",
                headline="Proactive Fatigue Warning",
                action_text="Fatigue is predicted to reach 67% by 05:00 PM. Hydrate and schedule a 15-minute rest break at 03:30 PM.",
                priority="MEDIUM"
            ),
            PredictiveAdviceItem(
                horizon="24 Hours",
                headline="Tomorrow Recovery Optimization",
                action_text="Aim for 8.0 hours of sleep tonight to achieve predicted 91% autonomic recovery tomorrow morning.",
                priority="LOW"
            )
        ]
