from dataclasses import dataclass, asdict
from typing import Dict, Any, List


@dataclass
class ScenarioOutcome:
    scenario_name: str
    input_parameter: str
    predicted_recovery_pct: float
    predicted_readiness_pct: float
    predicted_stress_pct: float

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class ScenarioSimulationEngine:
    """
    PhysioTrust Phase 6 Scenario Simulation Engine.
    Executes 'What If' physiological simulations (e.g. 8h Sleep vs 5h Sleep, Hydration boost).
    """

    @staticmethod
    def simulate_scenarios(subject_id: str = "100") -> List[ScenarioOutcome]:
        return [
            ScenarioOutcome(scenario_name="Optimal Sleep (8.0 Hours)", input_parameter="8.0h sleep", predicted_recovery_pct=92.0, predicted_readiness_pct=90.0, predicted_stress_pct=15.0),
            ScenarioOutcome(scenario_name="Restricted Sleep (5.0 Hours)", input_parameter="5.0h sleep", predicted_recovery_pct=68.0, predicted_readiness_pct=64.0, predicted_stress_pct=42.0),
            ScenarioOutcome(scenario_name="Hydration Protocol (+1.5L Water)", input_parameter="Hydration", predicted_recovery_pct=94.5, predicted_readiness_pct=92.0, predicted_stress_pct=12.0)
        ]
