import React from 'react';
import { ShieldCheck, Sun, Moon, ArrowLeftRight } from 'lucide-react';

export default function Header({
  username,
  activeWorkspace,
  setActiveWorkspace,
  theme,
  toggleTheme,
  streamConnected,
  handleSwitchWorkspace,
  visibleTabs,
  activeTab,
  setActiveTab
}) {
  const getWorkspaceTitle = () => {
    switch (activeWorkspace) {
      case 'research': return '🧪 RESEARCH WORKSPACE';
      case 'personal': return '❤️ PERSONAL WORKSPACE';
      case 'clinical': return '🩺 CLINICAL WORKSPACE';
      case 'admin': return '⚙️ ADMIN WORKSPACE (SUPERUSER)';
      default: return 'PHYSIOLOGICAL INTELLIGENCE CENTER';
    }
  };

  return (
    <header className="main-app-header">
      <div className="header-top-bar">
        <div className="brand-container">
          <div className="brand-logo">
            <div className="logo-pulse-dot"></div>
            <span className="logo-title">PHYSIOTRUST</span>
            <span className="version-tag">v1.0.0-RC1</span>
          </div>
          <span className="brand-subtitle">
            {getWorkspaceTitle()} • Logged in as <strong>{username}</strong>
          </span>
        </div>

        <div className="header-right-controls">
          {/* Workspace Switcher Pill */}
          <div className="role-selector-wrapper">
            <ShieldCheck size={14} className="role-icon" />
            <select value={activeWorkspace} onChange={(e) => setActiveWorkspace(e.target.value)} className="role-select">
              <option value="research">WORKSPACE: 🧪 RESEARCH</option>
              <option value="personal">WORKSPACE: ❤️ PERSONAL</option>
              <option value="clinical">WORKSPACE: 🩺 CLINICAL</option>
              <option value="admin">WORKSPACE: ⚙️ ADMIN (ALL UNLOCKED)</option>
            </select>
          </div>

          {/* Theme Toggle Button */}
          <button className="theme-toggle-pill" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            <span>{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
          </button>

          {/* Stream Status Badge */}
          <div className={`status-badge-pill ${streamConnected ? 'connected' : 'offline'}`}>
            <span className="pulse-dot"></span>
            <span>{streamConnected ? 'DEMO TELEMETRY' : 'OFFLINE'}</span>
          </div>

          {/* Switch Workspace Button */}
          <button className="btn btn-secondary logout-btn" onClick={handleSwitchWorkspace} style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ArrowLeftRight size={12} />
            <span>SWITCH WORKSPACE</span>
          </button>
        </div>
      </div>

      {/* Dynamic Workspace Navigation Tabs */}
      <nav className="nav-tab-container">
        <div className="nav-tabs-wrapper">
          {visibleTabs.map((tb) => {
            const IconComp = tb.icon;
            return (
              <button
                key={tb.id}
                className={`nav-tab-item ${activeTab === tb.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tb.id)}
              >
                <IconComp size={15} />
                <span>{tb.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
