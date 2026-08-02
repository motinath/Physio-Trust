import React from 'react';
import { FlaskConical, HeartPulse, Activity, Lock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function WorkspaceSelector({ username, setUsername, activeWorkspace, setActiveWorkspace, handleEnterWorkspace }) {
  return (
    <div className="login-gateway-container">
      <div className="login-card">
        <div className="login-header">
          <div className="brand-logo">
            <div className="logo-pulse-dot"></div>
            <span className="logo-title">PHYSIOTRUST</span>
            <span className="version-tag">v1.0.0-RC1</span>
          </div>
          <h2>Physiological Intelligence Center</h2>
          <p className="master-tagline">
            PhysioTrust transforms physiological measurements into trustworthy, explainable, personalized, and predictive physiological intelligence.
          </p>
        </div>

        <div className="user-input-group">
          <label>WELCOME BACK, ENTER YOUR NAME</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. Motinath"
            className="username-input"
          />
        </div>

        <div className="workspace-selection-title">
          <span>AVAILABLE WORKSPACES</span>
        </div>

        <div className="role-selection-grid">
          {/* Research Workspace */}
          <div
            className={`role-card ${activeWorkspace === 'research' ? 'selected' : ''}`}
            onClick={() => setActiveWorkspace('research')}
          >
            <FlaskConical size={26} className="role-card-icon" />
            <h4>🧪 RESEARCH WORKSPACE</h4>
            <p>Develop & validate AI algorithms, benchmark datasets, inspect SHAP feature attributions & run experiment logs.</p>
          </div>

          {/* Personal Workspace */}
          <div
            className={`role-card ${activeWorkspace === 'personal' ? 'selected' : ''}`}
            onClick={() => setActiveWorkspace('personal')}
          >
            <HeartPulse size={26} className="role-card-icon" />
            <h4>❤️ PERSONAL WORKSPACE</h4>
            <p>Understand your physiology, track circadian baselines, view diurnal trends & receive personalized daily health advice.</p>
          </div>

          {/* Clinical Workspace */}
          <div
            className={`role-card ${activeWorkspace === 'clinical' ? 'selected' : ''}`}
            onClick={() => setActiveWorkspace('clinical')}
          >
            <Activity size={26} className="role-card-icon" />
            <h4>🩺 CLINICAL WORKSPACE</h4>
            <p>Review subject physiological sessions, monitor 360 Hz live clinical oscilloscope, verify SQI & patient risk radar.</p>
          </div>

          {/* Admin Workspace */}
          <div
            className={`role-card ${activeWorkspace === 'admin' ? 'selected' : ''}`}
            onClick={() => setActiveWorkspace('admin')}
          >
            <Lock size={26} className="role-card-icon" />
            <h4>⚙️ ADMIN WORKSPACE</h4>
            <p>Platform administration: Manage users, RBAC roles, database records, system monitoring & unlock ALL workspaces.</p>
          </div>
        </div>

        <button className="btn btn-primary login-btn" onClick={handleEnterWorkspace}>
          <ShieldCheck size={18} />
          <span>ENTER {activeWorkspace.toUpperCase()} WORKSPACE</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
