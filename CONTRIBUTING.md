# Contributing to PhysioTrust

Thank you for your interest in contributing to **PhysioTrust: AI Trust Layer for Physiological Intelligence**.

---

## 1. Code Guidelines

- **Python**: Follow PEP 8 style guidelines. Ensure all new functions have clear type annotations and Google-style docstrings.
- **Frontend (React)**: Use functional components with hooks. Keep styling consistent with the Nothing Tech minimalist monochrome design system.
- **Testing**: Every new feature or API endpoint MUST include unit/integration tests in `tests/`.

---

## 2. Development Workflow

1. Fork & clone the repository.
2. Install Python dependencies:
   ```powershell
   python -m pip install -r requirements.txt
   python -m pip install -e .
   ```
3. Run tests locally before opening a Pull Request:
   ```powershell
   python -m pytest tests/ -v
   ```
4. Submit Pull Requests targeting the `main` branch.
