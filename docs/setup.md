# PhysioTrust Developer Setup Guide

## Quick Start

```powershell
# 1. Install dependencies
python -m pip install -r requirements.txt
python -m pip install -e .

# 2. Run backend & dashboard
python -m uvicorn backend.app.main:app --reload --port 8000

# 3. Run test suite
python -m pytest tests/ -v
```

Access **`http://localhost:8000`** in your browser.
