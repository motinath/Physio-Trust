# PhysioTrust Detailed File Inventory

This inventory documents every file and folder in the PhysioTrust repository, identifying its purpose, usage, dependencies, activity status, duplication, and architectural recommendation.

---

## Inventory Matrix

| Relative Path | Purpose | Usage | Dependencies | Active? | Duplicated? | Action Recommendation |
|---|---|---|---|---|---|---|
| `backend/app/main.py` | FastAPI Entrypoint | REST Server | FastAPI, Starlette | ✅ Yes | ❌ No | **KEEP** |
| `backend/app/api/routes.py` | API Route Controllers | `/api/v1/*` HTTP handlers | FastAPI, PhysioTrust Core | ✅ Yes | ❌ No | **KEEP** |
| `backend/app/core/config.py` | Settings & Config | Env management | Pydantic Settings | ✅ Yes | ❌ No | **KEEP** |
| `backend/app/db/database.py` | SQLAlchemy Connection | DB Sessions | SQLAlchemy | ✅ Yes | ❌ No | **KEEP** |
| `backend/app/db/models.py` | ORM Entities | Database Schema | SQLAlchemy | ✅ Yes | ❌ No | **KEEP** |
| `backend/app/dependencies/auth.py` | Security Dependency | JWT validation | PyJWT, FastAPI | ✅ Yes | ❌ No | **KEEP** |
| `backend/app/repositories/` | Data Access Layer | DB CRUD operations | SQLAlchemy, Models | ✅ Yes | ❌ No | **KEEP** |
| `backend/app/schemas/models.py` | Data Contracts | Request/Response validation | Pydantic | ✅ Yes | ❌ No | **KEEP** |
| `backend/app/services/` | DB Business Services | High-level DB tasks | Repositories | ✅ Yes | ❌ No | **KEEP** |
| `backend/app/websocket/stream.py` | Live Telemetry Stream | 360 Hz WS server | FastAPI WebSockets | ✅ Yes | ❌ No | **KEEP** |
| `frontend/src/App.jsx` | React SPA Entry | Main router & layout | React, Components | ✅ Yes | ❌ No | **KEEP** |
| `frontend/src/components/WorkspaceSelector.jsx` | Workspace Choice | Landing screen | React, Lucide Icons | ✅ Yes | ❌ No | **KEEP** |
| `frontend/src/components/Header.jsx` | Navigation Header | Workspace navigation | React, Lucide Icons | ✅ Yes | ❌ No | **KEEP** |
| `frontend/src/components/HeroStatusBar.jsx` | Key Metric Bar | Health summary | React | ✅ Yes | ❌ No | **KEEP** |
| `frontend/src/components/IntelligenceLineageCard.jsx` | Lineage Visualizer | Core novelty view | React, Lucide Icons | ✅ Yes | ❌ No | **KEEP** |
| `frontend/src/components/SessionReplayControls.jsx` | Replay Engine | Time controls | React, Lucide Icons | ✅ Yes | ❌ No | **KEEP** |
| `frontend/src/components/DataSourceConnector.jsx` | Source Connector | Device connector | React, Lucide Icons | ✅ Yes | ❌ No | **KEEP** |
| `frontend/src/components/OscilloscopeCanvas.jsx` | Waveform Oscilloscope | 60 FPS renderer | Canvas HTML5 | ✅ Yes | ❌ No | **KEEP** |
| `frontend/src/components/AiInsightsCard.jsx` | Reasoning Panel | Signature AI reasoning | React, Lucide Icons | ✅ Yes | ❌ No | **KEEP** |
| `frontend/src/components/ExpandedTrustCard.jsx` | Trust Ring Gauge | Interactive gauge | React, SVG | ✅ Yes | ❌ No | **KEEP** |
| `frontend/src/components/PipelineStepperModal.jsx` | Pipeline Visualizer | Stepper overlay | React, Lucide Icons | ✅ Yes | ❌ No | **KEEP** |
| `frontend/src/pages/ResearchWorkspacePage.jsx` | Research Views | Research tab | React | ✅ Yes | ❌ No | **KEEP** |
| `frontend/src/pages/PersonalWorkspacePage.jsx` | Personal Views | Personal tab | React | ✅ Yes | ❌ No | **KEEP** |
| `frontend/src/pages/ClinicalWorkspacePage.jsx` | Clinical Views | Clinical tab | React | ✅ Yes | ❌ No | **KEEP** |
| `frontend/src/pages/AdminWorkspacePage.jsx` | Admin Views | Admin tab | React | ✅ Yes | ❌ No | **KEEP** |
| `physiotrust/ai/signal_processing/` | DSP Math Core | Bandpass, R-peaks, SQI | SciPy, NumPy | ✅ Yes | ❌ No | **KEEP** |
| `physiotrust/ai/quality/` | Quality Engine | SNR, Kurtosis, Drift | SciPy, NumPy | ✅ Yes | ❌ No | **KEEP** |
| `physiotrust/ai/trust/` | Trust Engine | Decision reasoning | NumPy, SciPy | ✅ Yes | ❌ No | **KEEP** |
| `physiotrust/ai/context/` | Context Engine | Motion & activity | NumPy | ✅ Yes | ❌ No | **KEEP** |
| `physiotrust/ai/personalization/` | Baseline Learner | Diurnal baselines | NumPy | ✅ Yes | ❌ No | **KEEP** |
| `physiotrust/ai/explainability/` | XAI Attributions | SHAP & NL Generator | NumPy | ✅ Yes | ❌ No | **KEEP** |
| `physiotrust/ai/prediction/` | Multi-Horizon Forecast | Fatigue, Stress, Risk | NumPy | ✅ Yes | ❌ No | **KEEP** |
| `physiotrust/ai/recommendation/` | Proactive Advice | Health advice | NumPy | ✅ Yes | ❌ No | **KEEP** |
| `physiotrust/ai/health_state/` | State Classifier | Overall state | NumPy | ✅ Yes | ❌ No | **KEEP** |
| `physiotrust/ai/memory/` | Timeline Engine | Longitudinal memory | SQLite, NumPy | ✅ Yes | ❌ No | **KEEP** |
| `physiotrust/ai/fusion/` | Weight Fusion | Sensor fusion | NumPy | ✅ Yes | ❌ No | **KEEP** |
| `datasets/raw/` | Raw Dataset Storage | MIT-BIH, WESAD | Binary WFDB files | ✅ Yes | ❌ No | **KEEP** |
| `datasets/processed/` | Processed Storage | Feature arrays | NumPy `.npy` | ✅ Yes | ❌ No | **KEEP** |
| `datasets/metadata/dataset_manifest.json` | Dataset Catalog | Catalog metadata | JSON | ✅ Yes | ❌ No | **KEEP** |
| `archive/.gitkeep` | Archival Staging | Staging directory | Git | ✅ Yes | ❌ No | **KEEP** |
| `deployment/Dockerfile` | Docker Spec | Containerization | Docker | ✅ Yes | ❌ No | **KEEP** |
| `tests/` (15 files) | Test Suite | 61 Test cases | pytest | ✅ Yes | ❌ No | **KEEP** |
