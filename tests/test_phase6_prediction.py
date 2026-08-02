import pytest
from physiotrust.ai.prediction.prediction_engine import PredictionEngine
from physiotrust.ai.prediction.forecast.trend_forecast import TrendForecastingEngine
from physiotrust.ai.prediction.fatigue.fatigue_model import FatiguePredictionEngine
from physiotrust.ai.prediction.recovery.recovery_prediction import RecoveryPredictionEngine
from physiotrust.ai.prediction.stress.stress_forecast import StressForecastingEngine
from physiotrust.ai.prediction.risk.risk_engine import HealthRiskEngine
from physiotrust.ai.prediction.warning.warning_engine import EarlyWarningEngine
from physiotrust.ai.prediction.simulation.scenario_engine import ScenarioSimulationEngine
from physiotrust.ai.prediction.predictive_recommendation.predictive_advice import PredictiveRecommendationEngine


def test_prediction_engine():
    forecasts = PredictionEngine.forecast_all(subject_id="100", current_hr=64.0)
    assert len(forecasts) >= 5
    assert forecasts[0].target_metric == "Heart Rate"
    assert forecasts[0].horizon == "1h"


def test_trend_forecasting_engine():
    trends = TrendForecastingEngine.get_trend_forecasts(subject_id="100")
    assert len(trends) >= 3
    assert trends[0].expected_trend == "IMPROVING"


def test_fatigue_prediction_engine():
    fatigue = FatiguePredictionEngine.predict_fatigue(subject_id="100")
    assert fatigue.current_fatigue_pct == 42.0
    assert fatigue.predicted_fatigue_6h_pct == 67.0


def test_recovery_prediction_engine():
    recovery = RecoveryPredictionEngine.predict_recovery(subject_id="100")
    assert recovery.predicted_tomorrow_recovery_pct == 91.0
    assert recovery.exercise_readiness == "EXCELLENT"


def test_stress_forecasting_engine():
    stress = StressForecastingEngine.forecast_stress(subject_id="100")
    assert stress.predicted_stress_3h_pct == 42.0
    assert stress.stress_risk_level == "MODERATE"


def test_health_risk_engine():
    risks = HealthRiskEngine.evaluate_risks(subject_id="100")
    assert len(risks) >= 3
    assert risks[0].risk_level == "LOW"


def test_early_warning_engine():
    warnings = EarlyWarningEngine.get_active_warnings(subject_id="100")
    assert len(warnings) >= 1
    assert warnings[0].severity == "MEDIUM"


def test_scenario_simulation_engine():
    scenarios = ScenarioSimulationEngine.simulate_scenarios(subject_id="100")
    assert len(scenarios) == 3
    assert scenarios[0].predicted_recovery_pct == 92.0
    assert scenarios[1].predicted_recovery_pct == 68.0


def test_predictive_recommendation_engine():
    advice = PredictiveRecommendationEngine.generate_predictive_advice(subject_id="100")
    assert len(advice) >= 2
    assert advice[0].horizon == "6 Hours"
