# PhysioTrust Coding & Naming Guidelines

This document outlines the coding standards, naming conventions, and file naming conventions enforced across the PhysioTrust platform.

---

## 1. Directory & File Naming Conventions

- **Python Source Files**: Always snake_case (e.g. `signal_service.py`, `quality_score.py`).
- **React Components**: PascalCase / camelCase (e.g. `WorkspaceSelector.jsx`, `Header.jsx`).
- **Tests**: Prefixed with `test_` (e.g. `test_backend.py`).
- **Documentation**: UPPERCASE or descriptive snake_case Markdown (e.g. `README.md`, `TECHNICAL_DEBT.md`).

---

## 2. Code Element Naming Standards

### A. Python (Core & Backend)
- **Classes**: PascalCase (e.g. `SignalQualityEngine`).
- **Functions**: snake_case (e.g. `estimate_snr_db`).
- **Variables**: snake_case (e.g. `overall_quality_score`).
- **Environment Variables**: UPPERCASE (e.g. `JWT_SECRET`).

### B. JavaScript / React (Frontend)
- **Components**: PascalCase (e.g. `DataSourceConnector`).
- **Functions**: camelCase (e.g. `handleEnterWorkspace`).
- **Variables**: camelCase (e.g. `activeWorkspace`).

---

## 3. Database & REST API Schemas

- **Table Names**: snake_case plural (e.g. `users`, `signals`).
- **API Endpoints**: Plural nouns and lowercase paths (e.g. `/api/v1/process`, `/api/v1/prediction`).
