import React from 'react';

export default function ClinicalWorkspacePage({ activeTab }) {
  if (activeTab === 'patients') {
    return (
      <main className="dashboard-grid">
        <section className="panel full-width">
          <div className="panel-header">
            <h2>CLINICAL PATIENT MONITORING ROSTER</h2>
          </div>
          <div className="explanation-box">
            <p>Active subject sessions: Patient #100 (MIT-BIH), Patient #101, Patient #102.</p>
          </div>
        </section>
      </main>
    );
  }

  if (activeTab === 'sessions') {
    return (
      <main className="dashboard-grid">
        <section className="panel full-width">
          <div className="panel-header">
            <h2>CLINICAL PHYSIOLOGICAL RECORDINGS</h2>
          </div>
          <div className="explanation-box">
            <p>Inspect 360 Hz clinical ECG and PPG waveforms under motion artifact filters.</p>
          </div>
        </section>
      </main>
    );
  }

  if (activeTab === 'ai_analysis') {
    return (
      <main className="dashboard-grid">
        <section className="panel full-width">
          <div className="panel-header">
            <h2>CLINICAL AI REASONING & SQI VERIFICATION</h2>
          </div>
          <div className="explanation-box">
            <p>AI SQI Confidence: 98.4/100 • Zero lead disconnection or flatline detected.</p>
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
            <h2>CLINICAL DIAGNOSTIC ASSIST REPORTS</h2>
          </div>
          <div className="explanation-box">
            <p>Generate clinical audit logs with SHAP feature attributions.</p>
          </div>
        </section>
      </main>
    );
  }

  if (activeTab === 'history') {
    return (
      <main className="dashboard-grid">
        <section className="panel full-width">
          <div className="panel-header">
            <h2>PATIENT HISTORICAL TRENDS</h2>
          </div>
          <div className="explanation-box">
            <p>Historical cardiac rhythm trend monitoring across 24-hour sessions.</p>
          </div>
        </section>
      </main>
    );
  }

  return null;
}
