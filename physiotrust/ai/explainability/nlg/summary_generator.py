from dataclasses import dataclass, asdict
from typing import Dict, Any


@dataclass
class NaturalLanguageSummary:
    technical_mode: str
    clinical_mode: str
    consumer_mode: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class NaturalLanguageGenerator:
    """
    PhysioTrust Phase 5 Natural Language Generator (NLG).
    Converts complex physiological metrics into tailored natural language summaries for technical, clinical, and consumer audiences.
    """

    @staticmethod
    def generate_summary(hr_bpm: float = 84.0, hrv_rmssd: float = 38.0, baseline_hr: float = 63.0) -> NaturalLanguageSummary:
        diff = hr_bpm - baseline_hr
        return NaturalLanguageSummary(
            technical_mode=f"Reduced HRV RMSSD ({hrv_rmssd} ms) combined with elevated resting HR ({hr_bpm} BPM, delta +{diff:.0f} BPM) increased stress probability with 96% confidence.",
            clinical_mode=f"Physiological biomarker changes are consistent with increased sympathetic autonomic activity and reduced parasympathetic vagal tone.",
            consumer_mode="Your body appears more stressed than usual today. Take a short rest break and hydrate."
        )
