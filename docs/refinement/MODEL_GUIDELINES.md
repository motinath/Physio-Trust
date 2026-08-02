# PhysioTrust AI Model Interface Guidelines

Every model component in `physiotrust/` must implement standard object methods:
- `load_data()` or `preprocess()`
- `predict()` or `evaluate()`
- `to_dict()` for clean JSON serialization
