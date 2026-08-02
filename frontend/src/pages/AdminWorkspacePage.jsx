import React from 'react';

export default function AdminWorkspacePage({ activeTab }) {
  if (activeTab === 'users') {
    return (
      <main className="dashboard-grid">
        <section className="panel full-width">
          <div className="panel-header">
            <h2>USER ACCOUNTS & IMPERSONATION VIEW</h2>
          </div>
          <div className="explanation-box">
            <p><strong>Admin View</strong>: Full access to all registered user accounts and workspace privileges.</p>
          </div>
        </section>
      </main>
    );
  }

  if (activeTab === 'roles') {
    return (
      <main className="dashboard-grid">
        <section className="panel full-width">
          <div className="panel-header">
            <h2>ROLE-BASED ACCESS CONTROL (RBAC) CONFIGURATION</h2>
          </div>
          <div className="explanation-box">
            <p>Manage workspace permissions for Research, Personal, Clinical, and Administrator roles.</p>
          </div>
        </section>
      </main>
    );
  }

  if (activeTab === 'datasets') {
    return (
      <main className="dashboard-grid">
        <section className="panel full-width">
          <div className="panel-header">
            <h2>DATASET STORAGE & INGESTION MANAGEMENT</h2>
          </div>
          <div className="explanation-box">
            <p>Database Records: PhysioTrust SQLite/PostgreSQL signals, baselines, and user tables.</p>
          </div>
        </section>
      </main>
    );
  }

  if (activeTab === 'system') {
    return (
      <main className="dashboard-grid">
        <section className="panel full-width">
          <div className="panel-header">
            <h2>SYSTEM HEALTH & MONITORING</h2>
          </div>
          <div className="explanation-box">
            <p>Server Status: <strong>HEALTHY</strong> • Active Connections: 1 WebSocket Stream.</p>
          </div>
        </section>
      </main>
    );
  }

  if (activeTab === 'logs') {
    return (
      <main className="dashboard-grid">
        <section className="panel full-width">
          <div className="panel-header">
            <h2>PLATFORM SECURITY & AUDIT LOGS</h2>
          </div>
          <div className="explanation-box">
            <p>JWT Authorization logs, API route invocation history, and system diagnostic logs.</p>
          </div>
        </section>
      </main>
    );
  }

  return null;
}
