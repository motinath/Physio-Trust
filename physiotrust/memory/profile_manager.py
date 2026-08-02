from dataclasses import dataclass, asdict
from typing import Dict, Any


@dataclass
class PersonalHealthProfile:
    subject_id: str
    age: int
    height_cm: float
    weight_kg: float
    fitness_level: str
    baseline_resting_hr: float
    recovery_capacity_pct: float
    overall_health_score: float

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class ProfileManager:
    """
    Manages longitudinal personal health profile records.
    """

    @staticmethod
    def get_profile(subject_id: str = "100") -> PersonalHealthProfile:
        return PersonalHealthProfile(
            subject_id=subject_id,
            age=30,
            height_cm=175.0,
            weight_kg=70.0,
            fitness_level="Moderate",
            baseline_resting_hr=64.0,
            recovery_capacity_pct=92.0,
            overall_health_score=88.5
        )
