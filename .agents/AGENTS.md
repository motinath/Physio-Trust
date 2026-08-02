# PhysioTrust Project Rules & Directives

## CRITICAL DIRECTIVE: NO FAKE, MOCK, SYNTHETIC, OR HARDCODED DATA

- **Zero Fake / Mock Data**: Under NO circumstances should any module, script, service, API endpoint, or UI component use fake, mock, synthetic, placeholder, or hardcoded dummy values.
- **Pure Dynamic Computations**: All physiological signal data (ECG, PPG, HRV, SpO2, Motion) must be parsed directly from real binary dataset files (such as MIT-BIH, PPG-DaLiA, WESAD) or computed dynamically using pure mathematical signal processing algorithms and database queries.
- **Strict Verification**: Every data point presented in the frontend dashboard or returned by backend APIs must originate from genuine live calculations or database records.
