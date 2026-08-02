# PhysioTrust Model Cards

## Model 1: TrustScoreAIModel (Random Forest Ensemble)
- **Model Type**: Random Forest Classifier (100 estimators, max depth 12).
- **Intended Use**: Classify 5-second physiological signal windows as reliable ($1$) vs unreliable ($0$).
- **Input Features**: SNR (dB), Powerline Noise Score, Baseline Drift Score, Entropy, Kurtosis, Motion Variance.
- **Training Data**: MIT-BIH Arrhythmia & PPG-DaLiA datasets.
- **Metrics**: ROC-AUC: 0.984, F1-Score: 0.971, Latency: 1.4 ms.
- **Limitations**: Requires at least 3.0 seconds of contiguous sampling for stable entropy calculation.

---

## Model 2: PersonalizedBaselineLearner
- **Model Type**: Online Bayesian Normal Update Engine.
- **Intended Use**: Dynamically adapt individual resting heart rate and HRV bounds ($\mu \pm 2\sigma$).
- **Metrics**: Adaptation convergence: 3.5 days, False Personalization Rate: 1.2%.
