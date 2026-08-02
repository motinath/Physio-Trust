import pytest
from physiotrust.ai.explainability.confidence_engine import ConfidenceEngine
from physiotrust.ai.explainability.feature_importance import FeatureAttributionEngine
from physiotrust.ai.explainability.reasoning_engine import DecisionReasoningEngine
from physiotrust.ai.explainability.trust_reason import TrustExplanationEngine
from physiotrust.ai.explainability.recommendation_reason import RecommendationExplanationEngine
from physiotrust.ai.explainability.levels import MultiLevelExplanationSystem
from physiotrust.ai.explainability.nlg.summary_generator import NaturalLanguageGenerator


def test_confidence_engine():
    conf = ConfidenceEngine.compute_confidence(sqi_score=95.0, trust_score=0.98)
    assert conf.overall_confidence_pct >= 90.0
    assert conf.confidence_level == "HIGH"
    assert len(conf.qualifying_reasons) >= 2


def test_feature_attribution_engine():
    attributions = FeatureAttributionEngine.compute_attributions()
    assert len(attributions) == 5
    assert attributions[0].feature_name == "Heart Rate Variability (HRV)"
    assert attributions[0].contribution_pct == 42.0


def test_decision_reasoning_engine():
    chain = DecisionReasoningEngine.build_reasoning_chain(hr_bpm=84.0, baseline_hr=63.0)
    assert len(chain) == 5
    assert chain[0].title == "Signal Processing"
    assert chain[4].title == "Final Assessment"


def test_trust_explanation_engine():
    exp = TrustExplanationEngine.explain_trust(trust_score=0.97)
    assert exp.is_trusted is True
    assert exp.trust_score_pct == 97.0
    assert len(exp.reasons) >= 3


def test_recommendation_explanation_engine():
    exp = RecommendationExplanationEngine.explain_recommendation()
    assert exp.confidence_pct == 94.0
    assert exp.trigger_metrics["current_hr_bpm"] == 84.0


def test_multilevel_explanation_system():
    levels = MultiLevelExplanationSystem.generate_levels()
    assert levels.level1_simple == "Stress increased."
    assert "HRV RMSSD" in levels.level3_evidence
    assert "Rest for 15 minutes" in levels.level5_action


def test_natural_language_generator():
    nlg = NaturalLanguageGenerator.generate_summary()
    assert "RMSSD" in nlg.technical_mode
    assert "sympathetic autonomic activity" in nlg.clinical_mode
    assert "stressed" in nlg.consumer_mode
