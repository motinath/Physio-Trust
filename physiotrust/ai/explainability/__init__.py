"""Layer 5 — Explainable Intelligence Package."""
from physiotrust.explainability import TrustExplainer, ExplanationSummary
from physiotrust.ai.explainability.confidence_engine import ConfidenceEngine, ConfidenceReport
from physiotrust.ai.explainability.feature_importance import FeatureAttributionEngine, FeatureContribution
from physiotrust.ai.explainability.reasoning_engine import DecisionReasoningEngine, ReasoningStep
from physiotrust.ai.explainability.trust_reason import TrustExplanationEngine, TrustExplanationReport
from physiotrust.ai.explainability.recommendation_reason import RecommendationExplanationEngine, RecommendationExplanationReport
from physiotrust.ai.explainability.levels import MultiLevelExplanationSystem, MultiLevelExplanation
from physiotrust.ai.explainability.nlg.summary_generator import NaturalLanguageGenerator, NaturalLanguageSummary

__all__ = [
    "TrustExplainer",
    "ExplanationSummary",
    "ConfidenceEngine",
    "ConfidenceReport",
    "FeatureAttributionEngine",
    "FeatureContribution",
    "DecisionReasoningEngine",
    "ReasoningStep",
    "TrustExplanationEngine",
    "TrustExplanationReport",
    "RecommendationExplanationEngine",
    "RecommendationExplanationReport",
    "MultiLevelExplanationSystem",
    "MultiLevelExplanation",
    "NaturalLanguageGenerator",
    "NaturalLanguageSummary"
]
