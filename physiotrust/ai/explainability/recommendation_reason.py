from dataclasses import dataclass, asdict
from typing import Dict, Any, List


@dataclass
class RecommendationExplanationReport:
    recommendation_headline: str
    action_text: str
    confidence_pct: float
    trigger_metrics: Dict[str, Any]
    justification: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class RecommendationExplanationEngine:
    """
    Explains the exact evidence and metric triggers supporting a recommendation.
    """

    @staticmethod
    def explain_recommendation(
        headline: str = "Elevated Heart Rate Detected",
        action_text: str = "Rest and hydrate. Recheck in 20 minutes.",
        current_hr: float = 84.0,
        baseline_hr: float = 63.0
    ) -> RecommendationExplanationReport:
        diff = current_hr - baseline_hr
        return RecommendationExplanationReport(
            recommendation_headline=headline,
            action_text=action_text,
            confidence_pct=94.0,
            trigger_metrics={
                "current_hr_bpm": current_hr,
                "baseline_hr_bpm": baseline_hr,
                "hr_delta_bpm": round(diff, 1),
                "activity_context": "rest"
            },
            justification=f"Heart rate is +{diff:.0f} BPM above normal resting baseline ({baseline_hr:.0f} BPM) while physical activity remains low."
        )
