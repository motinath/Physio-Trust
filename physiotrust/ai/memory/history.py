import numpy as np
from typing import Dict, Any, List


class PhysiologicalHistoryService:
    """
    Computes daily, weekly, and monthly aggregate statistics from historical timeline snapshots.
    """

    @staticmethod
    def compute_daily_averages(snapshots: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not snapshots:
            return {
                "avg_heart_rate_bpm": 68.0,
                "avg_hrv_rmssd": 42.5,
                "avg_trust_score": 0.96,
                "sample_count": 0
            }

        hrs = [s['heart_rate_bpm'] for s in snapshots if 'heart_rate_bpm' in s]
        hrvs = [s['hrv_rmssd'] for s in snapshots if 'hrv_rmssd' in s]
        trusts = [s['trust_score'] for s in snapshots if 'trust_score' in s]

        return {
            "avg_heart_rate_bpm": round(float(np.mean(hrs)), 1) if hrs else 68.0,
            "avg_hrv_rmssd": round(float(np.mean(hrvs)), 2) if hrvs else 42.5,
            "avg_trust_score": round(float(np.mean(trusts)), 4) if trusts else 0.96,
            "sample_count": len(snapshots)
        }
