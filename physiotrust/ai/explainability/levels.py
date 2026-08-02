from dataclasses import dataclass, asdict
from typing import Dict, Any


@dataclass
class MultiLevelExplanation:
    level1_simple: str
    level2_why: str
    level3_evidence: str
    level4_personal_context: str
    level5_action: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class MultiLevelExplanationSystem:
    """
    PhysioTrust Phase 5 Multi-Level Explanation System.
    Provides 5 structured levels of explanation ranging from simple summary to actionable recommendations.
    """

    @staticmethod
    def generate_levels(hr_bpm: float = 84.0, baseline_hr: float = 63.0, hrv_rmssd: float = 38.0) -> MultiLevelExplanation:
        diff = hr_bpm - baseline_hr
        return MultiLevelExplanation(
            level1_simple="Stress increased.",
            level2_why="Physiological stress increased because HRV dropped and resting heart rate is elevated.",
            level3_evidence=f"HRV RMSSD decreased to {hrv_rmssd} ms (-18.4 ms). Heart Rate increased to {hr_bpm} BPM (+{diff:.0f} BPM).",
            level4_personal_context=f"This pattern differs from your 30-day resting baseline ({baseline_hr:.0f} BPM) during low physical activity.",
            level5_action="Rest for 15 minutes, hydrate, and recheck your measurement."
        )
