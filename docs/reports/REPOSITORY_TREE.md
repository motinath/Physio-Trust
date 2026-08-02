# PhysioTrust Complete Repository Tree

Below is the complete directory and file hierarchy of the PhysioTrust repository.

```
physiotrust/
│
├── archive/
│   └── .gitkeep                               # Safe archival staging directory
│
├── backend/
│   ├── __init__.py                            # Package marker
│   └── app/
│       ├── __init__.py                        # Package marker
│       ├── main.py                            # FastAPI Application Entrypoint & Static Server
│       ├── api/
│       │   └── routes.py                      # REST API Endpoints (/api/v1/*)
│       ├── core/
│       │   └── config.py                      # Application Configuration Settings
│       ├── db/
│       │   ├── database.py                    # SQLAlchemy DB Session & Engine setup
│       │   └── models.py                      # ORM Database Models (User, Signal)
│       ├── dependencies/
│       │   └── auth.py                        # Authentication & Security Dependency Injection
│       ├── repositories/
│       │   ├── signal_repository.py           # Database Signal Data Access Layer
│       │   └── user_repository.py             # Database User Data Access Layer
│       ├── schemas/
│       │   └── models.py                      # Pydantic Schemas & Data Contracts
│       ├── services/
│       │   ├── signal_service.py              # Signal Database Business Logic
│       │   └── user_service.py                # User Database Business Logic
│       └── websocket/
│           └── stream.py                      # Real-time WebSocket Telemetry Server
│
├── datasets/
│   ├── raw/
│   │   └── .gitkeep                           # Raw dataset storage (MIT-BIH, WESAD, MIMIC)
│   ├── processed/
│   │   └── .gitkeep                           # Processed feature arrays storage
│   └── metadata/
│       └── dataset_manifest.json              # Dataset Metadata Catalog
│
├── deployment/
│   └── Dockerfile                             # Production Container Build Specification
│
├── docs/
│   ├── architecture.md                        # High-level System Architecture Documentation
│   └── roadmap.md                             # Platform Roadmap & Milestones
│
├── frontend/
│   ├── index.html                             # Single Page Application Entry HTML
│   ├── package.json                           # React Node Dependencies & Scripts
│   ├── vite.config.js                         # Vite Build & Development Server Config
│   └── src/
│       ├── App.jsx                            # Main SPA Component Orchestration & Layout
│       ├── index.css                          # Nothing Tech OS Design Tokens & Styling
│       ├── main.jsx                           # React DOM Entrypoint
│       ├── components/
│       │   ├── WorkspaceSelector.jsx          # 4 Workspace Landing & Choice Component
│       │   ├── Header.jsx                     # Top Navigation Bar & Workspace Switcher
│       │   ├── HeroStatusBar.jsx              # Real-Time Key Metric Bar
│       │   ├── IntelligenceLineageCard.jsx    # Enhanced Intelligence Lineage Visualizer
│       │   ├── SessionReplayControls.jsx      # Live Session Replay Engine Controls
│       │   ├── DataSourceConnector.jsx        # Device-Agnostic Source Connector
│       │   ├── OscilloscopeCanvas.jsx         # 60 FPS Clinical Signal Oscilloscope
│       │   ├── AiInsightsCard.jsx             # Signature AI Reasoning & Confidence Card
│       │   ├── ExpandedTrustCard.jsx          # Interactive Trust Gauge & Score Breakdown
│       │   └── PipelineStepperModal.jsx       # 10-Stage AI Execution Visualizer
│       └── pages/
│           ├── ResearchWorkspacePage.jsx      # Research Workspace Tab Views
│           ├── PersonalWorkspacePage.jsx      # Personal Physiology Tab Views
│           ├── ClinicalWorkspacePage.jsx      # Clinical Telemetry Tab Views
│           └── AdminWorkspacePage.jsx         # Superuser Admin Tab Views
│
├── notebooks/
│   └── exploratory_analysis.ipynb            # Jupyter Research Notebook
│
├── physiotrust/                               # Core AI Intelligence Package (Single Center of Gravity)
│   ├── __init__.py                            # Package Exports & Version (1.0.0-RC1)
│   ├── ai/                                    # AI Intelligence Layer Modules
│   │   ├── signal_processing/                 # DSP Filtering, R-Peak Detection, SQI Features
│   │   ├── quality/                           # SNR Estimation, Noise & Drift Detection
│   │   ├── trust/                             # Multi-Sensor Trust Score & Decision Reasoning
│   │   ├── context/                           # Motion Artifact & Context Engine
│   │   ├── personalization/                   # Personalized Baselines & Diurnal Learner
│   │   ├── explainability/                    # SHAP Attributions & Natural Language Generator
│   │   ├── prediction/                        # Fatigue, Recovery, Stress & Risk Forecasting
│   │   ├── recommendation/                    # Proactive AI Health Advice
│   │   ├── health_state/                      # Physiological State Classifier
│   │   ├── memory/                            # Longitudinal Timeline Engine
│   │   └── fusion/                            # Multi-Sensor Trust & Weight Fusion
│   ├── auth/                                  # Security JWT & RBAC Manager
│   ├── demo/                                  # Standalone Presentation Environment
│   ├── models/                                # Model Storage & Ensembles
│   ├── monitoring/                            # System Health Monitor
│   ├── research/                              # Research Workspace Engine
│   ├── sdk/                                   # Internal SDK Client
│   └── validation/                            # Benchmark & Validation Suite
│
├── tests/                                     # 61 Test Suite Cases (100% Passing)
│   ├── test_backend.py
│   ├── test_db.py
│   ├── test_fusion.py
│   ├── test_health_state.py
│   ├── test_memory.py
│   ├── test_motion.py
│   ├── test_personalization.py
│   ├── test_phase4_personalization.py
│   ├── test_phase5_explainability.py
│   ├── test_phase6_prediction.py
│   ├── test_phase7_validation.py
│   ├── test_phase8_platform.py
│   ├── test_quality.py
│   ├── test_signal_processing.py
│   └── test_trust_engine.py
│
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── RELEASE_NOTES_v1.0.0-RC1.md
├── physiotrust.db                             # Production SQLite Database
├── pytest.ini
├── requirements.txt                           # Core Dependencies
└── setup.py                                   # Python Package Setup
```
