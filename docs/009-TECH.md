# Task 0.9 — Technology Stack Selection (`docs/009-TECH.md`)

# Technology Stack & Tooling Architecture

---

## 1. Core Technology Matrix

| Layer | Technology | Version | Rationale |
| :--- | :--- | :--- | :--- |
| **Language** | Python | `>= 3.9, 3.12` | Industry standard for signal processing, scientific computing, and ML. |
| **Backend Framework**| FastAPI | `>= 0.100` | High-performance async ASGI web framework with native Pydantic validation & WebSockets. |
| **ASGI Server** | Uvicorn | `>= 0.22` | Lightning-fast async server implementation for real-time WebSocket streaming. |
| **Signal Processing** | NumPy, SciPy | `>= 1.24`, `>= 1.10` | High-speed vectorized signal operations, digital Butterworth filters, spectral transforms. |
| **Dataset Ingestion** | Native Pure NumPy | `Format 212` | Pure NumPy binary unpacker for MIT-BIH records bypassing external C-extension DLL policy blocks. |
| **Machine Learning** | Scikit-Learn, PyTorch | `>= 1.2`, `>= 2.0` | Feature extraction, linear regression trends, ONNX deep learning runtime readiness. |
| **Frontend Framework**| React JS | `19.x` (Vite) | Component-driven UI framework for reactive real-time dashboard rendering. |
| **Frontend Build Tool**| Vite | `8.x` | Ultra-fast frontend bundling and HMR dev environment. |
| **UI Design System** | Vanilla CSS | CSS3 | Custom Nothing Tech minimalist monochrome design system (high-contrast black/white/gray). |
| **Icons** | Lucide React | `0.4x` | Minimalist clean vector icon set. |
| **Testing** | Pytest | `>= 7.3` | Comprehensive automated unit and integration test runner. |
| **Containerization** | Docker, Compose | `3.8+` | Isolated multi-platform container deployment. |
| **CI/CD** | GitHub Actions | `v3` | Automated linting, test suite execution, and docker build pipeline. |

---

## 2. Rationale & Architecture Trade-offs

1. **Why FastAPI over Flask / Django?**
   FastAPI provides native asynchronous WebSocket support (`/ws/ecg-stream`) out of the box with zero third-party socket plugins. Pydantic models automatically validate incoming REST request bodies and generate interactive OpenAPI / Swagger documentation at `/docs`.

2. **Why Pure NumPy Format 212 Parser over WFDB Dependency?**
   While WFDB is a standard bio-signal package, its reliance on Pandas C-extensions causes DLL load failures on corporate Windows machines enforced by AppLocker / Application Control policies. The pure NumPy reader provides 100% native binary parsing with zero C-extension risks.

3. **Why Vite + React over Vanilla JS?**
   Vite + React provides component state isolation for complex multi-widget interfaces (Canvas Oscilloscope, SVG Ring Gauge, Context Switcher, Explainable AI Cards, Paginated Summary Tables) while compiling down to static bundle assets served seamlessly by FastAPI.
