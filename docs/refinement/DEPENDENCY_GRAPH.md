# PhysioTrust Complete Dependency Graph

| Source Package | Dependent Modules | Target Unified Package |
| :--- | :--- | :--- |
| `physiotrust/signal_processing/` | `backend/app/api/routes.py`, `tests/` | `physiotrust/ai/signal_processing/` |
| `physiotrust/quality_engine/` | `backend/app/api/routes.py`, `tests/` | `physiotrust/ai/quality/` |
| `physiotrust/trust_engine/` | `backend/app/api/routes.py`, `tests/` | `physiotrust/ai/trust/` |
| `physiotrust/context_engine/` | `backend/app/api/routes.py`, `tests/` | `physiotrust/ai/context/` |
| `physiotrust/motion_engine/` | `backend/app/api/routes.py`, `tests/` | `physiotrust/ai/context/` |
| `physiotrust/fusion_engine/` | `backend/app/api/routes.py`, `tests/` | `physiotrust/ai/fusion/` |
