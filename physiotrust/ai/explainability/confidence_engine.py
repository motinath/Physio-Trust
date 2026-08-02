from dataclasses import dataclass, asdict
from typing import Dict, Any, List


@dataclass
class ConfidenceReport:
    overall_confidence_pct: float
    signal_quality_contrib: float
    trust_score_contrib: float
    historical_consistency_contrib: float
    sensor_agreement_contrib: float
    confidence_level: str  # HIGH, MEDIUM, LOW
    qualifying_reasons: List[str]

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class ConfidenceEngine:
    """
    PhysioTrust Phase 5 Confidence Engine.
    Quantifies AI prediction confidence based on signal quality, trust score, model confidence, historical consistency, and sensor agreement.
    """

    @staticmethod
    def compute_confidence(
        sqi_score: float = 94.0,
        trust_score: float = 0.97,
        sensor_agreement_pct: float = 98.0,
        historical_consistency_pct: float = 92.0
    ) -> ConfidenceReport:
        sqi_c = sqi_score * 0.30
        trust_c = (trust_score * 100.0) * 0.30
        agree_c = sensor_agreement_pct * 0.20
        hist_c = historical_consistency_pct * 0.20

        overall = sqi_c + trust_c + agree_c + hist_c
        overall_clamped = round(float(min(99.0, max(10.0, overall))), 1)

        if overall_clamped >= 85.0:
            level = "HIGH"
        elif overall_clamped >= 60.0:
            level = "MEDIUM"
        else:
            level = "LOW"

        reasons = []
        if sqi_score >= 90.0:
            reasons.append("Consistent high signal quality (SQI > 90)")
        if trust_score >= 0.90:
            reasons.append("Stable baseline alignment")
        if sensor_agreement_pct >= 95.0:
            reasons.append("High cross-sensor agreement across channels")

        return ConfidenceReport(
            overall_confidence_pct=overall_clamped,
            signal_quality_contrib=round(sqi_c, 1),
            trust_score_contrib=round(trust_c, 1),
            historical_consistency_contrib=round(hist_c, 1),
            sensor_agreement_contrib=round(agree_c, 1),
            confidence_level=level,
            qualifying_reasons=reasons
        )
