import React from 'react';

export default function HeroStatusBar({ scorePct, healthStateData, recoveryData, stressForecastData, context, threshold }) {
  return (
    <section className="panel hero-status-panel full-width">
      <div className="hero-metric-item">
        <span className="hero-label">TRUST SCORE</span>
        <span className="hero-val trust">{scorePct}%</span>
      </div>
      <div className="hero-metric-item">
        <span className="hero-label">HEALTH STATE</span>
        <span className="hero-val state">{healthStateData ? healthStateData.overall_state : 'STABLE'}</span>
      </div>
      <div className="hero-metric-item">
        <span className="hero-label">RECOVERY READINESS</span>
        <span className="hero-val recovery">{recoveryData ? `${recoveryData.predicted_tomorrow_recovery_pct}%` : '92%'}</span>
      </div>
      <div className="hero-metric-item">
        <span className="hero-label">STRESS ELEVATION</span>
        <span className="hero-val stress">{stressForecastData ? `${stressForecastData.predicted_stress_3h_pct}%` : '18%'}</span>
      </div>
      <div className="hero-metric-item">
        <span className="hero-label">ACTIVITY CONTEXT</span>
        <span className="hero-val context">{context.toUpperCase()} ({threshold.toFixed(2)})</span>
      </div>
    </section>
  );
}
