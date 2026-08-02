# PhysioTrust Bug Tracker & Issue Resolution Log

| Issue ID | Module | Description | Resolution Status |
| :--- | :--- | :--- | :---: |
| **BUG-001** | `auth/jwt.py` | Token delimiter colon `:` caused parsing failure when timestamp had floating point | **FIXED**: Replaced delimiter with `|` |
| **BUG-002** | `api/routes.py` | Missing import for `Session` caused endpoint startup exception | **FIXED**: Added `from sqlalchemy.orm import Session` |
| **BUG-003** | `frontend/App.jsx` | Dark/light theme variable missing in stylesheet | **FIXED**: Enforced CSS variables in `index.css` |
