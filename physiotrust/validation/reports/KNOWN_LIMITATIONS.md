# PhysioTrust Known Limitations & Safety Guardrails

## 1. Non-Diagnostic Guardrail
PhysioTrust is an AI-powered Physiological Intelligence Platform designed for research, wellness tracking, and data reliability estimation. **It does NOT provide clinical medical diagnoses.** Users are explicitly instructed to consult healthcare professionals for medical conditions.

## 2. Technical Limitations
- **Extreme Physical Motion ($>2.5\text{g}$)**: Wrist PPG accuracy degrades during high-intensity sprint bursts; the system automatically falls back to ECG or marks segments as unreliable.
- **Cold Peripheral Vasoconstriction**: Low PPG optical perfusion may reduce signal amplitude stability.
