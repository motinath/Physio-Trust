import React, { useState } from 'react';
import { Database, Radio, CheckCircle2, Lock, Cpu, Wifi } from 'lucide-react';

export default function DataSourceConnector({ selectedRecord, handleRecordChange }) {
  const [sourceType, setSourceType] = useState('dataset');

  return (
    <section className="panel data-source-connector-panel">
      <div className="panel-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Database size={16} /> DEVICE-AGNOSTIC DATA SOURCE CONNECTOR
        </h2>
        <span className="source-badge">UNIFIED AI PIPELINE INTEGRATION</span>
      </div>

      <div className="source-type-grid">
        {/* Active Version 1 Dataset Sessions */}
        <div
          className={`source-card ${sourceType === 'dataset' ? 'active' : ''}`}
          onClick={() => setSourceType('dataset')}
        >
          <div className="source-card-header">
            <Database size={20} className="card-icon" />
            <span className="version-pill active">VERSION 1 (ACTIVE)</span>
          </div>
          <h4>Physiological Session Datasets</h4>
          <p>Replay recorded binary sessions from MIT-BIH Arrhythmia, WESAD Stress, or MIMIC Clinical datasets through the AI Pipeline.</p>
        </div>

        {/* Future Version 2 Wearables */}
        <div
          className={`source-card disabled ${sourceType === 'wearable' ? 'active' : ''}`}
          onClick={() => setSourceType('wearable')}
        >
          <div className="source-card-header">
            <Radio size={20} className="card-icon" />
            <span className="version-pill future">VERSION 2 CONNECTORS</span>
          </div>
          <h4>Wearables & Hardware Monitors</h4>
          <p>Direct real-time BLE & Web API telemetry connectors for Apple Watch, Garmin, Fitbit, ESP32 BLE, and Hospital HL7 Monitors.</p>
        </div>
      </div>
    </section>
  );
}
