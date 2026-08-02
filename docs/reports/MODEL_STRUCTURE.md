# PhysioTrust Model Structure & Ensemble Catalog

This document specifies the organization of physiological machine learning models and thresholding rules.

---

## 1. Thresholding & Rules Organization

Instead of black-box heuristics, physiological thresholds are dynamically configured per activity context:

| Activity Context | Upper Heart Rate Bound | Lower Heart Rate Bound | Trust Threshold |
|---|---|---|---|
| **Rest** | 85.0 BPM | 55.0 BPM | 0.85 |
| **Sleep** | 75.0 BPM | 45.0 BPM | 0.90 |
| **Walking** | 120.0 BPM | 60.0 BPM | 0.80 |
| **Running** | 160.0 BPM | 80.0 BPM | 0.70 |

---

## 2. Ensemble Weights Mapping

The multi-sensor trust scores and confidence weights are calculated based on sensor quality indices:

$$\mathbf{W}_{\text{sensor}} = \text{SQI}_{\text{sensor}} \times (1 - \text{Motion}_{\text{interference}})$$

$$\text{Fused Trust Score} = \sum (\mathbf{W}_{i} \times \text{Metric}_{i})$$
