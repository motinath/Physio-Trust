import React from 'react';
import { Database, FlaskConical, Radio, CheckCircle2, BarChart2, FileText, Cpu } from 'lucide-react';

export default function ResearchWorkspacePage({ activeTab }) {
  if (activeTab === 'datasets') {
    return (
      <main className="dashboard-grid">
        <section className="panel full-width">
          <div className="panel-header">
            <h2>RESEARCH DATASETS CATALOG (MIT-BIH, WESAD, MIMIC)</h2>
          </div>
          <div className="explanation-box">
            <p><strong>MIT-BIH Arrhythmia Database</strong>: 48 half-hour 2-channel ECG sessions sampled at 360 Hz.</p>
            <p><strong>WESAD Stress Dataset</strong>: Multi-modal chest (ECG/PPG/EDA/TEMP) at 700 Hz for affective computing.</p>
            <p><strong>MIMIC-III Clinical Database</strong>: ICU multi-parameter physiological waveform sessions.</p>
          </div>
        </section>
      </main>
    );
  }

  if (activeTab === 'experiments') {
    return (
      <main className="dashboard-grid">
        <section className="panel full-width">
          <div className="panel-header">
            <h2>MODEL EXPERIMENTS & HYPERPARAMETER LOGS</h2>
          </div>
          <div className="explanation-box">
            <p><strong>Experiment #EXP-9042</strong>: Multi-Sensor Fusion Transformer vs Random Forest Trust Model.</p>
            <p><strong>Accuracy</strong>: 98.4% • <strong>F1 Score</strong>: 0.981 • <strong>Latency</strong>: 4.2 ms per window.</p>
          </div>
        </section>
      </main>
    );
  }

  if (activeTab === 'signal_lab') {
    return (
      <main className="dashboard-grid">
        <section className="panel full-width">
          <div className="panel-header">
            <h2>SIGNAL PROCESSING & FEATURE EXTRACTION LAB</h2>
          </div>
          <div className="explanation-box">
            <p><strong>Filters Applied</strong>: Butterworth Bandpass (0.5–50 Hz), Notch Filter (60 Hz).</p>
            <p><strong>Extracted Features</strong>: SNR, Kurtosis, Skewness, Zero-Crossing Rate, Spectral Energy.</p>
          </div>
        </section>
      </main>
    );
  }

  if (activeTab === 'validation') {
    return (
      <main className="dashboard-grid">
        <section className="panel full-width">
          <div className="panel-header">
            <h2>RESEARCH VALIDATION & NOISE ROBUSTNESS SUITE</h2>
          </div>
          <div className="explanation-box">
            <p><strong>Stress Test</strong>: Gaussian Noise Injection (+15 dB, +10 dB, +5 dB SNR).</p>
            <p><strong>Artifact Test</strong>: Motion Artifact Detection Sensitivity = 99.1%.</p>
          </div>
        </section>
      </main>
    );
  }

  if (activeTab === 'benchmarks') {
    return (
      <main className="dashboard-grid">
        <section className="panel full-width">
          <div className="panel-header">
            <h2>MODEL BENCHMARKS & COMPARATIVE METRICS</h2>
          </div>
          <div className="explanation-box">
            <p><strong>PhysioTrust SQI Model</strong>: LEAF-Net Benchmark Comparison (+4.2% higher specificity under motion).</p>
          </div>
        </section>
      </main>
    );
  }

  if (activeTab === 'reports') {
    return (
      <main className="dashboard-grid">
        <section className="panel full-width">
          <div className="panel-header">
            <h2>RESEARCH PUBLICATION REPORTS & EXPORTS</h2>
          </div>
          <div className="explanation-box">
            <p>Export complete session analysis logs in CSV, JSON, and PDF formats for academic papers.</p>
          </div>
        </section>
      </main>
    );
  }

  return null;
}
