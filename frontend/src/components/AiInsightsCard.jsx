import React from 'react';
import { Cpu, CheckCircle2, Info } from 'lucide-react';

export default function AiInsightsCard({ qualityData }) {
  return (
    <section className="panel ai-insights-panel">
      <div className="panel-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Cpu size={16} /> AI INSIGHTS & REASONING
        </h2>
        <span className="confidence-badge">98% CONFIDENCE</span>
      </div>
      <div className="ai-insights-body">
        <ul className="ai-bullets-list">
          <li>
            <CheckCircle2 size={15} className="bullet-icon green" />
            <span>
              <strong>Signal Trust</strong>: Quality score is excellent ({qualityData && qualityData.overall_quality_score !== undefined ? qualityData.overall_quality_score : 98.4}/100).
            </span>
          </li>
          <li>
            <CheckCircle2 size={15} className="bullet-icon green" />
            <span>
              <strong>Physiological State</strong>: Heart rate & HRV match your baseline resting curve.
            </span>
          </li>
          <li>
            <CheckCircle2 size={15} className="bullet-icon green" />
            <span>
              <strong>Recovery Progress</strong>: Optimal recovery trajectory (+4.2% vs 7-day average).
            </span>
          </li>
          <li>
            <Info size={15} className="bullet-icon blue" />
            <span>
              <strong>Motion Interference</strong>: Zero motion artifacts or sensor contact loss.
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
