import numpy as np
import pytest
from physiotrust.trust_engine.quality import SignalQualityEngine
from physiotrust.trust_engine.reliability import TrustEngine
from physiotrust.context_engine.gatekeeper import ContextAwareness
from physiotrust.personalization.baseline import PersonalizedBaseline
from physiotrust.explainability.explainer import TrustExplainer


def test_trust_engine_clean_vs_flatline():
    trust_engine = TrustEngine()

    # Clean signal window
    t = np.linspace(0, 5, 1800)
    clean_win = np.sin(2 * np.pi * 1.2 * t)
    res_clean = trust_engine.compute_reliability(clean_win)

    # Flatline window
    flat_win = np.zeros(1800) + 0.0001
    res_flat = trust_engine.compute_reliability(flat_win)

    # Clean signal trust score should be higher than flatline trust score
    assert res_clean.reliability_score > res_flat.reliability_score
    assert 0.0 <= res_clean.reliability_score <= 1.0
    assert 0.0 <= res_flat.reliability_score <= 1.0


def test_context_awareness():
    context_engine = ContextAwareness()

    # Score 0.65 is reliable for 'rest' (threshold 0.60), but unreliable for 'sleep' (threshold 0.70)
    eval_rest = context_engine.evaluate_reliability(0.65, context='rest')
    assert eval_rest.is_reliable is True

    eval_sleep = context_engine.evaluate_reliability(0.65, context='sleep')
    assert eval_sleep.is_reliable is False

    eval_run = context_engine.evaluate_reliability(0.35, context='running')
    assert eval_run.is_reliable is True  # Running threshold is 0.30


def test_personalized_baseline():
    baseline = PersonalizedBaseline(subject_id='test_subj')
    baseline.update(1.2, is_reliable=True)
    baseline.update(0.8, is_reliable=True)
    baseline.update(0.5, is_reliable=False)  # Should be ignored

    assert pytest.approx(baseline.get_baseline_mean(), abs=1e-4) == 1.0
    assert baseline.get_summary()['sample_count'] == 2


def test_trust_explainer():
    trust_engine = TrustEngine()
    context_engine = ContextAwareness()
    t = np.linspace(0, 5, 1800)
    clean_win = np.sin(2 * np.pi * 1.2 * t)

    rel_res = trust_engine.compute_reliability(clean_win)
    ctx_res = context_engine.evaluate_reliability(rel_res.reliability_score, context='rest')

    explanation = TrustExplainer.explain(rel_res, ctx_res, subject_baseline_mean=1.0)
    assert isinstance(explanation.human_readable, str)
    assert len(explanation.human_readable) > 10
