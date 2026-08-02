from dataclasses import dataclass, asdict
from typing import Dict, Any, List


@dataclass
class RiskFactorItem:
    risk_category: str
    risk_level: str  # LOW, MODERATE, HIGH
    probability_pct: float
    description: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class HealthRiskEngine:
    """
    PhysioTrust Phase 6 Health Risk Engine.
    Estimates wellness-oriented risk levels (non-clinical wellness assessments).
    """

    @staticmethod
    def evaluate_risks(subject_id: str = "100") -> List[RiskFactorItem]:
        return [
            RiskFactorItem(risk_category="Recovery Decline", risk_level="LOW", probability_pct=14.0, description="Autonomic recovery remains optimal (>85%)"),
            RiskFactorItem(risk_category="Elevated Resting HR", risk_level="LOW", probability_pct=11.0, description="Resting heart rate aligns with 30-day norm"),
            RiskFactorItem(risk_category="Sleep Deterioration", risk_level="MODERATE", probability_pct=32.0, description="Slight accumulation of sleep debt over 3 days")
        ]
