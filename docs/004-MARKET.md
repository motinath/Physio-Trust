# Task 0.4 — Market Research & Competitor Analysis (`docs/004-MARKET.md`)

# Market Landscape & Competitor Gap Analysis

## 1. Executive Summary

The global digital health and wearable technology market exceeds **$70 Billion** as of 2026. However, major commercial players treat physiological measurements as end-user black boxes. None of the dominant consumer wearables expose an open, verifiable **Trust Protocol** or **Signal Quality Index (SQI)** to clinicians, researchers, or third-party developers.

PhysioTrust addresses this structural gap by acting as a universal **AI Trust Protocol** that enhances existing hardware and digital health applications.

---

## 2. Deep-Dive Competitor Analysis

### 1. Apple Health / Apple Watch
- **Features**: Single-lead ECG app, High/Low HR alerts, AFib history tracking, Sleep stages, Wrist temperature.
- **Strengths**: FDA-cleared ECG & AFib detection; massive consumer adoption; sleek hardware integration.
- **Weaknesses**: Closed ecosystem; outputs binary alerts without quantitative confidence scores; raw signal data inaccessible to third-party Web APIs; static HR thresholds.
- **Missing Trust Layer**: Apple Watch suppresses ECG recordings when noise is high, but outputs plain text *"Inconclusive"* without explaining what specific noise factor (motion, dry electrodes, high heart rate) caused the rejection.

### 2. WHOOP (WHOOP Strap 4.0)
- **Features**: Continuous strain tracking, Recovery Score (0–100%), Sleep Need, HRV tracking.
- **Strengths**: Popular among elite athletes; strong focus on HRV recovery modeling and daily strain guidance.
- **Weaknesses**: High monthly subscription fee; recovery algorithm is a black box; PPG sensor prone to severe wrist-motion artifacts during lifting or arm movement.
- **Missing Trust Layer**: If a user's wrist strap is loose during sleep, WHOOP's algorithm may output an erroneously low HRV score and tank the user's "Recovery Score" without flagging poor PPG signal quality.

### 3. Oura (Oura Ring Gen 3)
- **Features**: Sleep Score, Readiness Score, Activity Tracking, Nightly HRV & Temperature.
- **Strengths**: Finger PPG provides superior capillary pulse signal during sleep compared to wrist devices.
- **Weaknesses**: Highly susceptible to hand movement and ring rotation; limited daytime continuous monitoring capability due to battery and motion constraints.
- **Missing Trust Layer**: Does not provide real-time confidence scores or developer WebSocket streams for live telemetry applications.

### 4. Garmin (Garmin Connect / Sports Watches)
- **Features**: Body Battery™, Stress Score, VO2 Max estimation, Pulse Ox (SpO2), Multi-sport tracking.
- **Strengths**: Robust GPS hardware; trusted by endurance athletes; multi-day battery life.
- **Weaknesses**: Complex, cluttered user UI; proprietary metrics (e.g. Body Battery) lack clinical peer review or factor attribution.
- **Missing Trust Layer**: Lacks real-time signal quality breakdown and offers no API for clinical EHR telemetry integration.

### 5. Fitbit / Google Pixel Watch
- **Features**: Daily Readiness Score, Irregular Heart Rhythm Notifications, ECG App, Stress Management.
- **Strengths**: Broad consumer market reach; strong Google Cloud AI integration.
- **Weaknesses**: High false-positive rate during non-stationary movement; data locked within consumer mobile application APIs.
- **Missing Trust Layer**: No open REST/WebSocket trust score pipeline for third-party medical software developers.

---

## 3. Feature Comparison Matrix

| Feature / Metric | Apple Watch | WHOOP | Oura Ring | Garmin | Fitbit | **PhysioTrust** |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Raw ECG / PPG Ingestion** | Partial | ❌ | ❌ | ❌ | ❌ | ✅ **Native** |
| **Signal Quality Index (0-100%)**| ❌ | ❌ | ❌ | ❌ | ❌ | ✅ **Native** |
| **Activity-Aware Gatekeeper** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ **Native** |
| **Personalized Baseline Memory** | Partial | Partial | Partial | ❌ | ❌ | ✅ **Bayesian Memory** |
| **Explainable AI Attributions** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ **Natural Language** |
| **Open REST & WebSocket APIs** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ **Native** |
| **Multi-Vendor Hardware Agnostic**| ❌ | ❌ | ❌ | ❌ | ❌ | ✅ **Universal** |

---

## 4. Why PhysioTrust Exists

PhysioTrust does not compete with hardware manufacturers; **it empowers them**.

By offering an open, hardware-agnostic AI Trust Layer, PhysioTrust enables:
1. **Wearable OEMs**: Upgrade raw sensor accuracy and reduce customer return rates caused by inaccurate metrics.
2. **Clinical RPM Platforms**: Integrate high-confidence remote patient monitoring while reducing physician alarm fatigue.
3. **Health App Developers**: Instantly add real-time ECG/PPG trust verification, activity context gatekeeping, and explainable AI insights via clean Python, REST, and WebSocket APIs.
