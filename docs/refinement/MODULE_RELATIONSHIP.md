# PhysioTrust Module Relationship Matrix

| Source Module | Target Module | Data Contract / Payload | Communication Type |
| :--- | :--- | :--- | :--- |
| `datasets/` | `signal_processing/` | `np.ndarray` 1D signal arrays & $f_s$ | In-process function call |
| `signal_processing/` | `quality_engine/` | Filtered signal window array | `SQIBreakdown` dataclass |
| `quality_engine/` | `trust_engine/` | Quality metrics dict | `ReliabilityResult` dataclass |
| `trust_engine/` | `context_engine/` | Reliability score & context | `ContextEvaluation` dataclass |
| `ai/explainability/` | `backend/app/api/` | `MultiLevelExplanation`, `SHAP` | REST JSON Response |
| `ai/prediction/` | `backend/app/api/` | `ForecastItem`, `RiskFactor` | REST JSON Response |
