import React from 'react';
import { Cpu, Check } from 'lucide-react';

export default function PipelineStepperModal({ pipelineRunning, pipelineStages, pipelineStep }) {
  if (!pipelineRunning) return null;

  return (
    <div className="ai-pipeline-progress-modal">
      <div className="pipeline-modal-card">
        <h3><Cpu size={18} /> PhysioTrust AI Reasoning Pipeline</h3>
        <p className="pipeline-sub">Executing 10-Stage Intelligence Inference across Signal Quality, Trust, Context & Predictions...</p>
        <div className="pipeline-stepper-grid">
          {pipelineStages.map((stg, idx) => (
            <div key={idx} className={`stepper-item ${idx === pipelineStep ? 'active' : (idx < pipelineStep ? 'completed' : '')}`}>
              <div className="step-badge">{idx < pipelineStep ? <Check size={12} /> : idx + 1}</div>
              <span className="step-text">{stg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
