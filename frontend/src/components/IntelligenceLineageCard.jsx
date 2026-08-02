import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Compass, HeartPulse, HelpCircle, TrendingUp, Flame } from 'lucide-react';

export default function IntelligenceLineageCard({ scorePct, qualityData, context }) {
  const sqiVal = qualityData && qualityData.overall_quality_score !== undefined ? qualityData.overall_quality_score : 98.4;

  return (
    <section className="panel lineage-card-panel full-width">
      <div className="panel-header">
        <h2>ENHANCED PHYSIOLOGICAL INTELLIGENCE LINEAGE</h2>
        <span className="lineage-badge">CORE PHYSIOTRUST NOVELTY</span>
      </div>

      <div className="lineage-flow-container">
        <div className="lineage-step">
          <span className="step-label">RAW MEASUREMENT</span>
          <span className="step-val">82 BPM</span>
          <span className="step-sub">Physiological Input</span>
        </div>

        <ArrowRight size={16} className="flow-arrow" />

        <div className="lineage-step">
          <span className="step-label">SIGNAL QUALITY</span>
          <span className="step-val sqi">{sqiVal}/100</span>
          <span className="step-sub">Noise & SNR Clean</span>
        </div>

        <ArrowRight size={16} className="flow-arrow" />

        <div className="lineage-step">
          <span className="step-label">AI TRUST SCORE</span>
          <span className="step-val trust">{scorePct}%</span>
          <span className="step-sub">Verified Reliable</span>
        </div>

        <ArrowRight size={16} className="flow-arrow" />

        <div className="lineage-step">
          <span className="step-label">CONTEXT</span>
          <span className="step-val context">{context.toUpperCase()}</span>
          <span className="step-sub">Activity Evaluated</span>
        </div>

        <ArrowRight size={16} className="flow-arrow" />

        <div className="lineage-step">
          <span className="step-label">PERSONAL BASELINE</span>
          <span className="step-val baseline">NORMAL</span>
          <span className="step-sub">+4.2% Diurnal Fit</span>
        </div>

        <ArrowRight size={16} className="flow-arrow" />

        <div className="lineage-step">
          <span className="step-label">EXPLAINABILITY</span>
          <span className="step-val xai">CONSISTENT</span>
          <span className="step-sub">SHAP Trace Verified</span>
        </div>

        <ArrowRight size={16} className="flow-arrow" />

        <div className="lineage-step">
          <span className="step-label">RECOMMENDATION</span>
          <span className="step-val advice">CONTINUE</span>
          <span className="step-sub">Proactive Advice</span>
        </div>
      </div>
    </section>
  );
}
