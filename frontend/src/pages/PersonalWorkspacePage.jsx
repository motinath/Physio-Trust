import React from 'react';

export default function PersonalWorkspacePage({ activeTab }) {
  if (activeTab === 'sessions') {
    return (
      <main className="dashboard-grid">
        <section className="panel full-width">
          <div className="panel-header">
            <h2>MY PERSONAL PHYSIOLOGICAL SESSIONS</h2>
          </div>
          <div className="explanation-box">
            <p>Review past recorded sessions, daily activity windows, and sleep quality streams.</p>
          </div>
        </section>
      </main>
    );
  }

  if (activeTab === 'insights') {
    return (
      <main className="dashboard-grid">
        <section className="panel full-width">
          <div className="panel-header">
            <h2>PERSONAL AI INSIGHTS & CIRCADIAN BASELINE TRENDS</h2>
          </div>
          <div className="explanation-box">
            <p>Your resting heart rate matches optimal baseline curves with +4.2% diurnal stability.</p>
          </div>
        </section>
      </main>
    );
  }

  if (activeTab === 'timeline') {
    return (
      <main className="dashboard-grid">
        <section className="panel full-width">
          <div className="panel-header">
            <h2>MY PHYSIOLOGICAL TIMELINE & HISTORY</h2>
          </div>
          <div className="explanation-box">
            <p>Interactive 7-day and 30-day historical timeline of recovery readiness and stress elevation.</p>
          </div>
        </section>
      </main>
    );
  }

  if (activeTab === 'predictions') {
    return (
      <main className="dashboard-grid">
        <section className="panel full-width">
          <div className="panel-header">
            <h2>PERSONAL HEALTH PREDICTIONS & RECOVERY READINESS</h2>
          </div>
          <div className="explanation-box">
            <p>Tomorrow's predicted recovery readiness score: <strong>92% (Optimal)</strong>.</p>
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
            <h2>MY HEALTH REPORTS</h2>
          </div>
          <div className="explanation-box">
            <p>Download personal summary reports for physician consultations.</p>
          </div>
        </section>
      </main>
    );
  }

  return null;
}
