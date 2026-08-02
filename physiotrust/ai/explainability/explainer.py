from dataclasses import dataclass, asdict
from typing import Dict, Any, Optional
from physiotrust.ai.trust.reliability import ReliabilityResult
from physiotrust.ai.context.gatekeeper import ContextEvaluationResult


@dataclass
class ExplanationSummary:
    headline: str
    confidence_percentage: float
    factors: Dict[str, str]
    human_readable: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class TrustExplainer:
    """
    Explainable AI Engine.
    Converts raw feature scores, motion levels, sensor fusion agreement, and trust metrics into natural language explanations.
    """

    @staticmethod
    def explain(
        reliability: ReliabilityResult,
        context_eval: ContextEvaluationResult,
        subject_baseline_mean: float = 0.0,
        motion_level: str = "LOW",
        sensor_agreement_score: float = 1.0
    ) -> ExplanationSummary:
        score = reliability.reliability_score
        confidence_pct = round(score * 100.0, 1)
        q = reliability.quality_metrics
        raw = q.raw_features

        factors = {}
        if q.entropy_score > 0.6:
            factors['entropy'] = "Low signal noise & high structural regularity"
        else:
            factors['entropy'] = "High signal disorder / potential muscle noise"

        if q.kurtosis_score > 0.5:
            factors['kurtosis'] = "Clear, sharp QRS complexes detected"
        else:
            factors['kurtosis'] = "Blunted QRS peaks or attenuated waveform"

        if q.variance_score > 0.6:
            factors['variance'] = "Stable signal amplitude without flatlines"
        else:
            factors['variance'] = "Signal dropout or flatline detected"

        if motion_level != "LOW":
            factors['motion'] = f"Motion Artifact Detected (Level: {motion_level})"

        if sensor_agreement_score < 0.70:
            factors['sensor_fusion'] = "Cross-sensor discrepancy detected (ECG vs PPG)"

        # Headline synthesis
        if context_eval.is_reliable:
            headline = f"Trust Score {confidence_pct}% — High Confidence ({context_eval.context.capitalize()})"
            summary = (
                f"Signal passed reliability check for '{context_eval.context}' context (Score {score:.2f} >= Threshold {context_eval.threshold:.2f}). "
                f"ECG demonstrates clean QRS kurtosis ({raw.kurtosis:.2f}) and low motion level ({motion_level})."
            )
        else:
            headline = f"Trust Score {confidence_pct}% — Low Confidence Signal Discarded"
            summary = (
                f"Signal failed reliability gate for '{context_eval.context}' (Score {score:.2f} < Threshold {context_eval.threshold:.2f}). "
                f"Primary factor: {factors.get('motion', factors['entropy'])} and low QRS peakiness."
            )

        if subject_baseline_mean > 0:
            var_diff = abs(raw.variance - subject_baseline_mean) / subject_baseline_mean
            if var_diff < 0.2:
                summary += " Signal variance aligns with user's baseline memory."
            else:
                summary += f" Signal variance deviates {var_diff*100:.1f}% from historical user baseline."

        return ExplanationSummary(
            headline=headline,
            confidence_percentage=confidence_pct,
            factors=factors,
            human_readable=summary
        )
