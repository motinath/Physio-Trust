import React from 'react';
import { FlaskConical, Activity, HeartPulse, Lock, ShieldCheck } from 'lucide-react';

export default function LoginGateway({ username, setUsername, userRole, setUserRole, handleLogin }) {
  return (
    <div className="login-gateway-container">
      <div className="login-card">
        <div className="login-header">
          <div className="brand-logo">
            <div className="logo-pulse-dot"></div>
            <span className="logo-title">PHYSIOTRUST</span>
            <span className="version-tag">v1.0.0-RC1</span>
          </div>
          <h2>AI Trust Layer for Physiological Intelligence</h2>
          <p>Select your authorized workspace role to access tailored physiological intelligence</p>
        </div>

        <div className="user-input-group">
          <label>USER / SUBJECT NAME</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. Motinath"
            className="username-input"
          />
        </div>

        <div className="role-selection-grid">
          <div className={`role-card ${userRole === 'Researcher' ? 'selected' : ''}`} onClick={() => setUserRole('Researcher')}>
            <FlaskConical size={24} className="role-card-icon" />
            <h4>RESEARCHER</h4>
            <p>Full research lab, dataset benchmarks, SHAP attributions & model validation suite.</p>
          </div>

          <div className={`role-card ${userRole === 'Clinician' ? 'selected' : ''}`} onClick={() => setUserRole('Clinician')}>
            <Activity size={24} className="role-card-icon" />
            <h4>CLINICIAN / SUPERVISOR</h4>
            <p>Real-time clinical oscilloscope, trust verification, motion detection & patient risk radar.</p>
          </div>

          <div className={`role-card ${userRole === 'Patient' ? 'selected' : ''}`} onClick={() => setUserRole('Patient')}>
            <HeartPulse size={24} className="role-card-icon" />
            <h4>PATIENT / SUBJECT</h4>
            <p>Personal physiology, baseline comparisons, circadian rhythms & daily health advice.</p>
          </div>

          <div className={`role-card ${userRole === 'Administrator' ? 'selected' : ''}`} onClick={() => setUserRole('Administrator')}>
            <Lock size={24} className="role-card-icon" />
            <h4>ADMINISTRATOR</h4>
            <p>SUPERUSER: Complete access to ALL tools, all user account views, DB records & RBAC control.</p>
          </div>
        </div>

        <button className="btn btn-primary login-btn" onClick={handleLogin}>
          <ShieldCheck size={18} />
          <span>LOGIN TO PHYSIOTRUST AS {userRole.toUpperCase()}</span>
        </button>
      </div>
    </div>
  );
}
