from dataclasses import dataclass, asdict
from typing import Dict, Any, List


@dataclass
class RecommendationItem:
    category: str  # REST, HYDRATION, RECOVERY, SENSOR
    headline: str
    action_text: str
    priority: str  # HIGH, MEDIUM, LOW

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class RecommendationEngine:
    """
    Generates personalized, non-diagnostic wellness recommendations based on trusted signal deviations.
    """

    @staticmethod
    def generate_recommendations(
        hr_bpm: float,
        baseline_hr: float = 64.0,
        readiness_pct: float = 90.0,
        trust_score: float = 0.97
    ) -> List[RecommendationItem]:
        recs = []

        diff = hr_bpm - baseline_hr

        if diff >= 15.0:
            recs.append(RecommendationItem(
                category="REST",
                headline="Elevated Heart Rate Detected",
                action_text=f"Your heart rate is {diff:.0f} BPM above your resting baseline ({baseline_hr:.0f} BPM). Rest and hydrate. Recheck in 20 minutes.",
                priority="HIGH"
            ))
        elif readiness_pct < 60.0:
            recs.append(RecommendationItem(
                category="RECOVERY",
                headline="Lower Readiness Score",
                action_text="Your autonomic recovery is sub-optimal today. Consider light stretching or restorative rest.",
                priority="MEDIUM"
            ))
        else:
            recs.append(RecommendationItem(
                category="OPTIMAL",
                headline="Physiology Aligned",
                action_text="Your heart rate and HRV align with your normal resting baseline. Great autonomic balance.",
                priority="LOW"
            ))

        if trust_score < 0.60:
            recs.append(RecommendationItem(
                category="SENSOR",
                headline="Adjust Wearable Contact",
                action_text="Signal quality dropped. Ensure wearable band is snug against your wrist.",
                priority="HIGH"
            ))

        return recs
