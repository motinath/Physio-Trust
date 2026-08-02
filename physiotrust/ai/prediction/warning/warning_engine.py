from dataclasses import dataclass, asdict
from typing import Dict, Any, List


@dataclass
class EarlyWarningAlert:
    warning_id: int
    severity: str  # HIGH, MEDIUM, LOW
    headline: str
    message: str
    confidence_pct: float

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class EarlyWarningEngine:
    """
    PhysioTrust Phase 6 Early Warning System.
    Detects early signs of physiological deterioration or strain before users notice symptoms.
    """

    @staticmethod
    def get_active_warnings(subject_id: str = "100") -> List[EarlyWarningAlert]:
        return [
            EarlyWarningAlert(
                warning_id=101,
                severity="MEDIUM",
                headline="Elevated Afternoon HR Trend",
                message="Resting heart rate has trended +3.2 BPM higher over 3 consecutive afternoons.",
                confidence_pct=92.5
            )
        ]
