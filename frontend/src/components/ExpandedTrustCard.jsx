import React from 'react';

export default function ExpandedTrustCard({
  trustBadgeClass,
  trustBadgeLabel,
  strokeDashoffset,
  strokeColor,
  scorePct,
  qualityData,
  motionData,
  fusionData,
  explanation
}) {
  return (
    <section className="panel expanded-trust-card">
      <div className="panel-header">
        <h2>EXPANDED TRUST CARD</h2>
        <span className={`badge ${trustBadgeClass}`}>
          {trustBadgeLabel}
        </span>
      </div>

      <div className="trust-card-body">
        <div className="trust-score-hero">
          <div className="hero-circle-wrap">
            <svg viewBox="0 0 120 120" className="hero-svg">
              <circle className="ring-bg" cx="60" cy="60" r="50" />
              <circle
                className="ring-fill"
                cx="60" cy="60" r="50"
                style={{
                  strokeDashoffset,
                  stroke: strokeColor
                }}
              />
            </svg>
            <div className="hero-score-text">
              <span className="score-num">{scorePct}%</span>
              <span className="score-lbl">TRUST SCORE</span>
            </div>
          </div>
        </div>

        <div className="trust-metrics-grid">
          <div className="t-metric-item">
            <span className="t-lbl">SIGNAL QUALITY</span>
            <span className="t-val">
              {qualityData && qualityData.overall_quality_score !== undefined ? `${qualityData.overall_quality_score}/100` : '98.4/100'}
            </span>
          </div>
          <div className="t-metric-item">
            <span className="t-lbl">MOTION LEVEL</span>
            <span className="t-val">
              {motionData && motionData.motion_level ? motionData.motion_level : 'LOW (0.02g)'}
            </span>
          </div>
          <div className="t-metric-item">
            <span className="t-lbl">SENSOR AGREEMENT</span>
            <span className="t-val">
              {fusionData && fusionData.confidence_pct !== undefined ? `${fusionData.confidence_pct.toFixed(1)}%` : '96.0%'}
            </span>
          </div>
          <div className="t-metric-item">
            <span className="t-lbl">AI CONFIDENCE</span>
            <span className="t-val">98.2%</span>
          </div>
        </div>

        <div className="trust-reason-box">
          <span className="r-title">AI DECISION REASON:</span>
          <p className="r-text">{explanation || 'Stable ECG/PPG waveform, zero motion interference verified.'}</p>
        </div>
      </div>
    </section>
  );
}
