from dataclasses import dataclass, asdict
from typing import Dict, Any, List


@dataclass
class DemoEnvironmentStatus:
    is_offline_demo_active: bool
    preloaded_records_count: int
    environment_name: str
    presentation_mode: bool

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class DemoEnvironment:
    """
    PhysioTrust Phase 8 Demonstration Environment.
    Manages offline presentation mode and sample datasets for academic demonstrations and internet-free offline presentations.
    """

    @staticmethod
    def get_demo_status() -> DemoEnvironmentStatus:
        return DemoEnvironmentStatus(
            is_offline_demo_active=True,
            preloaded_records_count=48,
            environment_name="Internal Academic Research Demo Standalone",
            presentation_mode=True
        )

    @staticmethod
    def get_sample_demo_records() -> List[str]:
        return ["100", "101", "102", "103", "104", "105"]
