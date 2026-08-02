# PhysioTrust Core Module Relationships

This document outlines the interfaces and caller relationships across the internal Python modules and frontend Javascript views.

---

## 1. Internal AI Engine Module Call Graph

The pipeline executes sequentially inside the core platform during each analysis cycle:

```
[Raw Signal Data]
       │
       ▼
1. physiotrust.signal_processing.preprocess_signal()
       │
       ▼
2. physiotrust.quality_engine.assess_signal_quality()
       │
       ▼
3. physiotrust.fusion_engine.calculate_sensor_trust()
       │
       ▼
4. physiotrust.context_engine.evaluate_context()
       │
       ▼
5. physiotrust.personalization.baseline_learner.update_baseline()
       │
       ▼
6. physiotrust.prediction.prediction_engine.forecast_horizons()
       │
       ▼
7. physiotrust.explainability.attribution.calculate_shap_values()
       │
       ▼
8. physiotrust.recommendation.proactive_advice.get_advice()
       │
       ▼
9. physiotrust.memory.timeline.append_timeline_event()
```

---

## 2. API-to-Module Mappings

| API Endpoint | Core Module Target | Data Schema Input |
|---|---|---|
| `/api/v1/process` | `physiotrust.signal_processing` / `physiotrust.quality_engine` | `SignalRequest` |
| `/api/v1/baseline` | `physiotrust.personalization.baseline_service` | `BaselineRequest` |
| `/api/v1/prediction` | `physiotrust.prediction.prediction_engine` | Query Params (`subject_id`) |
| `/api/v1/explain` | `physiotrust.explainability` | Query Params (`subject_id`) |
| `/api/v1/auth/token` | `physiotrust.auth.jwt_manager` | `UserLogin` |
