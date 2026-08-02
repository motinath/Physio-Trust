import pytest
from physiotrust.ai.personalization.adaptive_thresholds import AdaptiveThresholds
from physiotrust.ai.personalization.learning import BaselineOnlineLearner


def test_adaptive_thresholds():
    bounds = AdaptiveThresholds.calculate_bounds(baseline_mean=64.0, baseline_std=4.0, n_sigma=2.0)
    assert bounds.lower_bound == 56.0
    assert bounds.upper_bound == 72.0


def test_online_baseline_learner():
    learner = BaselineOnlineLearner(alpha=0.1)
    updated = learner.update_baseline(current_baseline=60.0, new_observation=70.0)
    assert updated == 61.0
