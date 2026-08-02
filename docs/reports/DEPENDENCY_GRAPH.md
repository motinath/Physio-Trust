# PhysioTrust Complete Dependency Graph

This document details the architectural dependency graph across frontend components, backend controllers, and the AI Intelligence Layer.

---

## 1. System Dependency Flow

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               FRONTEND LAYER (REACT SPA)                               │
│ WorkspaceSelector  ──>  Header  ──>  HeroStatusBar  ──>  IntelligenceLineageCard      │
│ SessionReplayControls ──> DataSourceConnector ──> OscilloscopeCanvas (60 FPS)           │
│ Workspaces: ResearchWorkspacePage | PersonalWorkspacePage | ClinicalWorkspacePage | Admin │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │  HTTP REST / WebSocket Protocol
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND LAYER (FASTAPI)                                   │
│ backend.app.main ──> backend.app.api.routes ──> backend.app.dependencies.auth           │
│ WebSocket: backend.app.websocket.stream ──> DB: backend.app.repositories                │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │  Pure Python Call Interface
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        AI INTELLIGENCE LAYER (PHYSIOTRUST CORE)                        │
│                                                                                        │
│ Signal Processing (DSP) ──> Signal Quality (SQI) ──> Multi-Sensor Trust Engine        │
│          │                           │                           │                     │
│          ▼                           ▼                           ▼                     │
│ Motion & Context Engine ──> Baseline Personalization ──> Explainability (SHAP & XAI) │
│          │                           │                           │                     │
│          ▼                           ▼                           ▼                     │
│ Multi-Horizon Prediction ──> Proactive Recommendation ──> Longitudinal Memory Timeline │
└──────────────────────────────────────────┬─────────────────────────────────────────────┘
                                           │
                                           ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                           DATASETS & PERSISTENCE LAYER                                 │
│ datasets/raw/ (MIT-BIH, WESAD)  ──>  datasets/processed/  ──>  physiotrust.db (SQLite)  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Dependency List

### A. Core External Python Libraries (`requirements.txt`)
- **`fastapi` / `uvicorn`**: Web framework & ASGI server for HTTP & WebSocket endpoints.
- **`scipy` / `numpy`**: Pure mathematical signal processing, DSP filtering, matrix operations, statistical moments.
- **`sqlalchemy`**: Database ORM and persistent session management.
- **`pyjwt` / `passlib`**: Security token authentication & password hashing.
- **`pytest`**: Automated testing framework (61 test cases).

### B. Core External Frontend Libraries (`package.json`)
- **`react` / `react-dom`**: UI component rendering and reactive state management.
- **`lucide-react`**: Vector icons for glassmorphism design system.
- **`vite`**: High-performance development server and bundle compiler.
