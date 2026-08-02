import pytest
from physiotrust.validation.datasets.dataset_validation import DatasetValidator
from physiotrust.validation.signal.signal_validation import SignalIntelligenceValidator
from physiotrust.validation.trust.trust_validation import TrustEngineValidator
from physiotrust.validation.context.context_validation import ContextValidator
from physiotrust.validation.personalization.personalization_validation import PersonalizationValidator
from physiotrust.validation.explainability.explainability_validation import ExplainabilityValidator
from physiotrust.validation.prediction.prediction_validation import PredictionValidator
from physiotrust.validation.stress.stress_test import StressTestFramework
from physiotrust.validation.e2e.e2e_validation import EndToEndPipelineValidator
from physiotrust.validation.benchmark.benchmark_suite import BenchmarkingSuite


def test_dataset_validator():
    res = DatasetValidator.validate_mitbih()
    assert res.is_valid is True
    assert res.total_records == 48


def test_signal_intelligence_validator():
    metrics = SignalIntelligenceValidator.evaluate_signal_pipeline()
    assert metrics.is_passed is True
    assert metrics.snr_improvement_db >= 10.0


def test_trust_engine_validator():
    metrics = TrustEngineValidator.evaluate_trust_engine()
    assert metrics.roc_auc_score >= 0.95
    assert metrics.is_calibrated is True


def test_context_validator():
    metrics = ContextValidator.evaluate_context_engine()
    assert metrics.overall_accuracy_pct >= 95.0


def test_personalization_validator():
    metrics = PersonalizationValidator.evaluate_personalization()
    assert metrics.baseline_stability_score >= 0.90
    assert metrics.is_threshold_adaptive is True


def test_explainability_validator():
    metrics = ExplainabilityValidator.evaluate_explainability()
    assert metrics.shap_consistency_score >= 0.95


def test_prediction_validator():
    metrics = PredictionValidator.evaluate_prediction_models()
    assert metrics.heart_rate_forecast_mae_bpm <= 2.0


def test_stress_test_framework():
    scenarios = StressTestFramework.run_stress_scenarios()
    assert len(scenarios) == 2
    assert scenarios[0].system_crashed is False
    assert scenarios[0].graceful_degradation_observed is True


def test_e2e_pipeline_validator():
    report = EndToEndPipelineValidator.run_e2e_validation(num_subjects=10)
    assert report.pipeline_success_rate_pct == 100.0
    assert report.zero_crash_guarantee is True


def test_benchmarking_suite():
    benchmarks = BenchmarkingSuite.run_benchmark_comparisons()
    assert len(benchmarks) == 3
    assert benchmarks[0].trust_accuracy_pct >= 95.0
