import React, { useState, useEffect, useRef } from 'react';
import { Activity, ShieldCheck, Download, Play, Radio, Users as UsersIcon, Database, BarChart2, Settings as SettingsIcon, Layers, Sun, Moon, Cpu, Zap, Compass, Heart, HeartPulse, BatteryCharging, CheckCircle2, Info, Clock, Thermometer, Flame, HelpCircle, FileText, Check, AlertTriangle, TrendingUp, Sliders, ShieldAlert, FlaskConical, Lock } from 'lucide-react';

export default function App() {
  // Navigation, Theme & Role State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [userRole, setUserRole] = useState('Researcher');
  const [authToken, setAuthToken] = useState(null);
  const [demoMode, setDemoMode] = useState(true);

  // Selector States
  const [trendHorizon, setTrendHorizon] = useState('30d');
  const [explanationLevel, setExplanationLevel] = useState('level3');
  const [nlgAudience, setNlgAudience] = useState('technical');

  // Dashboard Data State
  const [context, setContext] = useState('rest');
  const [availableRecords, setAvailableRecords] = useState(['100']);
  const [selectedRecord, setSelectedRecord] = useState('100');
  const [streamConnected, setStreamConnected] = useState(false);

  const [trustScore, setTrustScore] = useState(null);
  const [isReliable, setIsReliable] = useState(true);
  const [explanation, setExplanation] = useState('Connecting to live telemetry...');
  const [qualityMetrics, setQualityMetrics] = useState({ entropy_score: 0, kurtosis_score: 0, variance_score: 0 });
  const [threshold, setThreshold] = useState(0.60);
  const [acceptanceRate, setAcceptanceRate] = useState('--');
  const [baselineVariance, setBaselineVariance] = useState('--');
  
  // Phase 2 - 6 Telemetry State
  const [qualityData, setQualityData] = useState(null);
  const [motionData, setMotionData] = useState(null);
  const [fusionData, setFusionData] = useState(null);
  const [healthStateData, setHealthStateData] = useState(null);
  const [recommendationsData, setRecommendationsData] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const [trendData, setTrendData] = useState(null);
  const [circadianData, setCircadianData] = useState(null);

  // Phase 5 XAI Telemetry State
  const [confidenceData, setConfidenceData] = useState(null);
  const [featureAttributions, setFeatureAttributions] = useState([]);
  const [reasoningChain, setReasoningChain] = useState([]);
  const [multiLevelData, setMultiLevelData] = useState(null);
  const [nlgData, setNlgData] = useState(null);

  // Phase 6 Predictive Telemetry State
  const [forecastsData, setForecastsData] = useState([]);
  const [fatigueData, setFatigueData] = useState(null);
  const [recoveryData, setRecoveryData] = useState(null);
  const [stressForecastData, setStressForecastData] = useState(null);
  const [risksData, setRisksData] = useState([]);
  const [warningsData, setWarningsData] = useState([]);
  const [simulationsData, setSimulationsData] = useState([]);
  const [predictiveAdvice, setPredictiveAdvice] = useState([]);

  // Phase 8 Platform State
  const [systemHealth, setSystemHealth] = useState(null);
  const [researchExperiments, setResearchExperiments] = useState([]);
  const [fullAnalysis, setFullAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Database Records State
  const [usersList, setUsersList] = useState([]);
  const [signalsList, setSignalsList] = useState([]);
  const [dashboardSummary, setDashboardSummary] = useState(null);

  // References
  const canvasRef = useRef(null);
  const wsRef = useRef(null);
  const rawBufferRef = useRef([]);
  const cleanBufferRef = useRef([]);
  const maxBufferLen = 600;

  const threshMap = { rest: 0.60, sleep: 0.70, walking: 0.40, running: 0.30 };

  // Theme Switcher Effect
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Authenticate Internal User
  useEffect(() => {
    fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject_id: selectedRecord, role: userRole })
    })
      .then(res => res.json())
      .then(data => {
        if (data.access_token) setAuthToken(data.access_token);
      }).catch(err => console.error(err));
  }, [userRole, selectedRecord]);

  // Initial Data Ingestion & Fetch
  useEffect(() => {
    fetchData();
  }, [selectedRecord]);

  const fetchData = () => {
    fetch('/api/v1/health')
      .then(res => res.json())
      .then(data => {
        if (data.available_records && data.available_records.length > 0) {
          setAvailableRecords(data.available_records);
        }
      }).catch(err => console.error(err));

    fetch('/api/v1/monitoring/health')
      .then(res => res.json())
      .then(data => setSystemHealth(data))
      .catch(err => console.error(err));

    fetch('/api/v1/research/experiments')
      .then(res => res.json())
      .then(data => setResearchExperiments(data.experiments || []))
      .catch(err => console.error(err));

    fetch(`/api/v1/quality?subject_id=${selectedRecord}`)
      .then(res => res.json())
      .then(data => setQualityData(data))
      .catch(err => console.error(err));

    fetch(`/api/v1/motion?subject_id=${selectedRecord}`)
      .then(res => res.json())
      .then(data => setMotionData(data))
      .catch(err => console.error(err));

    fetch(`/api/v1/fusion?subject_id=${selectedRecord}`)
      .then(res => res.json())
      .then(data => setFusionData(data))
      .catch(err => console.error(err));

    fetch(`/api/v1/health-state?subject_id=${selectedRecord}`)
      .then(res => res.json())
      .then(data => setHealthStateData(data))
      .catch(err => console.error(err));

    fetch(`/api/v1/recommendations?subject_id=${selectedRecord}`)
      .then(res => res.json())
      .then(data => setRecommendationsData(data.recommendations || []))
      .catch(err => console.error(err));

    fetch(`/api/v1/profile?subject_id=${selectedRecord}`)
      .then(res => res.json())
      .then(data => setProfileData(data))
      .catch(err => console.error(err));

    fetch(`/api/v1/trend?subject_id=${selectedRecord}`)
      .then(res => res.json())
      .then(data => setTrendData(data))
      .catch(err => console.error(err));

    fetch(`/api/v1/circadian?subject_id=${selectedRecord}`)
      .then(res => res.json())
      .then(data => setCircadianData(data.circadian_profile))
      .catch(err => console.error(err));

    // Phase 5 XAI Telemetry Fetches
    fetch(`/api/v1/confidence?subject_id=${selectedRecord}`)
      .then(res => res.json())
      .then(data => setConfidenceData(data.confidence))
      .catch(err => console.error(err));

    fetch(`/api/v1/feature-importance?subject_id=${selectedRecord}`)
      .then(res => res.json())
      .then(data => setFeatureAttributions(data.feature_attributions || []))
      .catch(err => console.error(err));

    fetch(`/api/v1/reasoning?subject_id=${selectedRecord}`)
      .then(res => res.json())
      .then(data => setReasoningChain(data.reasoning_chain || []))
      .catch(err => console.error(err));

    fetch(`/api/v1/explanation?subject_id=${selectedRecord}`)
      .then(res => res.json())
      .then(data => {
        setMultiLevelData(data.explanation_levels);
        setNlgData(data.nlg_modes);
      })
      .catch(err => console.error(err));

    // Phase 6 Predictive Telemetry Fetches
    fetch(`/api/v1/prediction?subject_id=${selectedRecord}`)
      .then(res => res.json())
      .then(data => setForecastsData(data.forecasts || []))
      .catch(err => console.error(err));

    fetch(`/api/v1/fatigue?subject_id=${selectedRecord}`)
      .then(res => res.json())
      .then(data => setFatigueData(data.fatigue))
      .catch(err => console.error(err));

    fetch(`/api/v1/recovery?subject_id=${selectedRecord}`)
      .then(res => res.json())
      .then(data => setRecoveryData(data.recovery))
      .catch(err => console.error(err));

    fetch(`/api/v1/stress?subject_id=${selectedRecord}`)
      .then(res => res.json())
      .then(data => setStressForecastData(data.stress_forecast))
      .catch(err => console.error(err));

    fetch(`/api/v1/risk?subject_id=${selectedRecord}`)
      .then(res => res.json())
      .then(data => setRisksData(data.risks || []))
      .catch(err => console.error(err));

    fetch(`/api/v1/warnings?subject_id=${selectedRecord}`)
      .then(res => res.json())
      .then(data => setWarningsData(data.warnings || []))
      .catch(err => console.error(err));

    fetch(`/api/v1/simulation?subject_id=${selectedRecord}`)
      .then(res => res.json())
      .then(data => setSimulationsData(data.simulations || []))
      .catch(err => console.error(err));

    fetch(`/api/v1/predictive-recommendation?subject_id=${selectedRecord}`)
      .then(res => res.json())
      .then(data => setPredictiveAdvice(data.predictive_advice || []))
      .catch(err => console.error(err));

    fetch('/api/v1/users')
      .then(res => res.json())
      .then(data => setUsersList(data))
      .catch(err => console.error(err));

    fetch('/api/v1/signals')
      .then(res => res.json())
      .then(data => setSignalsList(data))
      .catch(err => console.error(err));

    fetch(`/api/v1/dashboard?subject_id=${selectedRecord}`)
      .then(res => res.json())
      .then(data => {
        setDashboardSummary(data);
        if (data.baseline_variance) setBaselineVariance(data.baseline_variance.toFixed(4));
      })
      .catch(err => console.error(err));
  };

  // Context & Record Change Handlers
  const handleContextChange = (ctxKey) => {
    setContext(ctxKey);
    setThreshold(threshMap[ctxKey] || 0.50);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ context: ctxKey, subject_id: selectedRecord }));
    }
  };

  const handleRecordChange = (e) => {
    const val = e.target.value;
    setSelectedRecord(val);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ context, subject_id: val }));
    }
  };

  // WebSocket Setup for Live Oscilloscope
  useEffect(() => {
    let ws;
    const connectWS = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host || 'localhost:8000';
      const wsUrl = `${protocol}//${host}/ws/ecg-stream`;

      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setStreamConnected(true);
        ws.send(JSON.stringify({ context, subject_id: selectedRecord }));
      };

      ws.onmessage = (event) => {
        try {
          const packet = JSON.parse(event.data);
          
          if (packet.raw_chunk) rawBufferRef.current.push(...packet.raw_chunk);
          if (packet.clean_chunk) cleanBufferRef.current.push(...packet.clean_chunk);

          if (rawBufferRef.current.length > maxBufferLen) {
            rawBufferRef.current = rawBufferRef.current.slice(-maxBufferLen);
          }
          if (cleanBufferRef.current.length > maxBufferLen) {
            cleanBufferRef.current = cleanBufferRef.current.slice(-maxBufferLen);
          }

          setTrustScore(packet.trust_score);
          setIsReliable(packet.is_reliable);
          if (packet.explanation) setExplanation(packet.explanation.human_readable);
          if (packet.quality) setQualityMetrics(packet.quality);
          if (packet.motion) setMotionData(packet.motion);
          if (packet.fusion) setFusionData(packet.fusion);

          if (activeTab === 'dashboard') drawOscilloscope();
        } catch (e) {
          console.error(e);
        }
      };

      ws.onclose = () => {
        setStreamConnected(false);
        setTimeout(connectWS, 3000);
      };
    };

    connectWS();
    return () => {
      if (ws) ws.close();
    };
  }, [activeTab, theme, selectedRecord]);

  // Oscilloscope Canvas Rendering
  const drawOscilloscope = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.parentElement.clientWidth;
    const height = canvas.height = canvas.parentElement.clientHeight || 300;

    const isLight = theme === 'light';
    const gridColor = isLight ? '#e4e4e7' : '#18181b';
    const rawTraceColor = isLight ? '#a1a1aa' : '#52525b';
    const cleanTraceColor = isLight ? '#09090b' : '#ffffff';

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    const midY = height / 2;
    const scaleY = height / 4;

    const rawBuf = rawBufferRef.current;
    if (rawBuf.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = rawTraceColor;
      ctx.lineWidth = 1;
      const step = width / maxBufferLen;
      let x = 0;
      for (let i = 0; i < rawBuf.length; i++) {
        const y = midY - (rawBuf[i] * scaleY * 0.4);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        x += step;
      }
      ctx.stroke();
    }

    const cleanBuf = cleanBufferRef.current;
    if (cleanBuf.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = cleanTraceColor;
      ctx.lineWidth = 2;
      const step = width / maxBufferLen;
      let x = 0;
      for (let i = 0; i < cleanBuf.length; i++) {
        const y = midY - (cleanBuf[i] * scaleY * 0.8);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        x += step;
      }
      ctx.stroke();
    }
  };

  // Run Full Analysis
  const runFullAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/v1/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject_id: selectedRecord,
          context: context,
          window_sec: 5.0
        })
      });

      if (!res.ok) throw new Error('Analysis failed');
      const data = await res.json();
      setFullAnalysis(data);
      setAcceptanceRate(`${data.acceptance_rate.toFixed(1)}%`);
      setBaselineVariance(data.personalized_variance_baseline.toFixed(4));
      fetchData();
    } catch (err) {
      alert(`Error analyzing signal: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Export CSV
  const exportCsv = () => {
    if (!fullAnalysis || !fullAnalysis.windows) {
      alert('Please click "RUN FULL RECORD ANALYSIS" first to generate batch export results.');
      return;
    }
    let csv = 'Window_Index,Reliability_Score,Accepted,Context,Threshold,Reason\n';
    fullAnalysis.windows.forEach(w => {
      csv += `${w.window_index},${w.reliability_score},${w.is_reliable},${w.context},${w.threshold},"${w.reason}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `physiotrust_reliability_${fullAnalysis.subject_id}_${context}.csv`;
    a.click();
  };

  const scorePct = trustScore !== null ? Math.round(trustScore * 100) : '--';
  const strokeDashoffset = trustScore !== null ? 314 - (314 * trustScore) : 314;
  const strokeColor = isReliable ? (theme === 'light' ? '#09090b' : '#ffffff') : '#ef4444';

  return (
    <div className="app-container">
      {/* Top Header & Navigation */}
      <header className="header">
        <div className="brand">
          <div className="logo-dot"></div>
          <div className="brand-text">
            <h1>PHYSIOTRUST</h1>
            <span className="sub-text">PHASE 8 — HARDENED INTERNAL RELEASE & RESEARCH PLATFORM</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="context-toggle-group">
          <button className={`ctx-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            DASHBOARD
          </button>
          <button className={`ctx-btn ${activeTab === 'research' ? 'active' : ''}`} onClick={() => setActiveTab('research')}>
            RESEARCH LAB
          </button>
          <button className={`ctx-btn ${activeTab === 'predictions' ? 'active' : ''}`} onClick={() => setActiveTab('predictions')}>
            PREDICTIONS
          </button>
          <button className={`ctx-btn ${activeTab === 'xai' ? 'active' : ''}`} onClick={() => setActiveTab('xai')}>
            EXPLAINABILITY (XAI)
          </button>
          <button className={`ctx-btn ${activeTab === 'physiology' ? 'active' : ''}`} onClick={() => setActiveTab('physiology')}>
            MY PHYSIOLOGY
          </button>
          <button className={`ctx-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            USERS
          </button>
          <button className={`ctx-btn ${activeTab === 'signals' ? 'active' : ''}`} onClick={() => setActiveTab('signals')}>
            SIGNALS
          </button>
          <button className={`ctx-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
            TRENDS
          </button>
          <button className={`ctx-btn ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            SETTINGS
          </button>
        </nav>

        <div className="status-group">
          {/* User Role Selector */}
          <select value={userRole} onChange={(e) => setUserRole(e.target.value)} style={{ padding: '0.2rem 0.4rem', fontSize: '0.7rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-panel)', color: 'var(--text-primary)', borderRadius: '4px' }}>
            <option value="Researcher">ROLE: RESEARCHER</option>
            <option value="Developer">ROLE: DEVELOPER</option>
            <option value="Supervisor">ROLE: SUPERVISOR</option>
            <option value="Administrator">ROLE: ADMIN</option>
          </select>

          {/* Theme Toggle Button */}
          <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode">
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            <span>{theme.toUpperCase()}</span>
          </button>

          <div className="stream-badge" style={{ borderColor: streamConnected ? (theme === 'light' ? '#09090b' : '#ffffff') : '#ef4444' }}>
            <span className="status-indicator" style={{ backgroundColor: streamConnected ? (theme === 'light' ? '#09090b' : '#ffffff') : '#ef4444' }}></span>
            <span>{streamConnected ? 'DEMO TELEMETRY' : 'OFFLINE'}</span>
          </div>
        </div>
      </header>

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && (
        <main className="dashboard-grid">
          {/* Controls */}
          <section className="panel control-panel full-width">
            <div className="control-group">
              <label>MIT-BIH SUBJECT RECORD</label>
              <select value={selectedRecord} onChange={handleRecordChange}>
                {availableRecords.map(rec => (
                  <option key={rec} value={rec}>MIT-BIH Subject Record {rec}</option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label>ACTIVITY CONTEXT</label>
              <div className="context-toggle-group">
                {['rest', 'sleep', 'walking', 'running'].map(ctxKey => (
                  <button
                    key={ctxKey}
                    className={`ctx-btn ${context === ctxKey ? 'active' : ''}`}
                    onClick={() => handleContextChange(ctxKey)}
                  >
                    {ctxKey.toUpperCase()} ({threshMap[ctxKey].toFixed(2)})
                  </button>
                ))}
              </div>
            </div>

            <div className="control-group action-group">
              <button className="btn btn-primary" onClick={runFullAnalysis} disabled={isAnalyzing}>
                {isAnalyzing ? 'ANALYZING...' : 'RUN FULL RECORD ANALYSIS'}
              </button>
              <button className="btn btn-secondary" onClick={exportCsv}>
                EXPORT CSV
              </button>
            </div>
          </section>

          {/* Oscilloscope */}
          <section className="panel main-chart-panel">
            <div className="panel-header">
              <h2>PHYSIOLOGICAL SIGNAL OSCILLOSCOPE (360 Hz)</h2>
              <div className="legend">
                <span className="legend-item raw"><span className="line-sample"></span> RAW ECG/PPG</span>
                <span className="legend-item clean"><span className="line-sample"></span> PREPROCESSED (0.5-50Hz)</span>
              </div>
            </div>
            <div className="canvas-wrapper">
              <canvas ref={canvasRef}></canvas>
            </div>
          </section>

          {/* Trust Score AI Ring Gauge */}
          <section className="panel trust-panel">
            <div className="panel-header">
              <h2>TRUST SCORE AI ENGINE</h2>
              <span className={`badge ${isReliable ? 'reliable' : 'unreliable'}`}>
                {isReliable ? 'RELIABLE SIGNAL' : 'UNRELIABLE - DISCARDED'}
              </span>
            </div>

            <div className="gauge-container">
              <div className="score-ring">
                <svg viewBox="0 0 120 120">
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
                <div className="score-display">
                  <span className="score-value">{scorePct}{trustScore !== null ? '%' : ''}</span>
                  <span className="score-label">TRUST SCORE</span>
                </div>
              </div>
            </div>

            <div className="metric-row-grid">
              <div className="metric-box">
                <span className="m-label">SIGNAL QUALITY (SQI)</span>
                <span className="m-val">
                  {qualityData && qualityData.overall_quality_score !== undefined ? `${qualityData.overall_quality_score}/100` : '--'}
                </span>
              </div>
              <div className="metric-box">
                <span className="m-label">MOTION ARTIFACT LEVEL</span>
                <span className="m-val">
                  {motionData && motionData.motion_level ? motionData.motion_level : '--'}
                </span>
              </div>
              <div className="metric-box">
                <span className="m-label">CROSS-SENSOR FUSION</span>
                <span className="m-val">
                  {fusionData && fusionData.confidence_pct !== undefined ? `${fusionData.confidence_pct.toFixed(1)}%` : '--'}
                </span>
              </div>
            </div>
          </section>

          {/* Phase 6 Predictions Summary Row */}
          <section className="panel full-width" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', padding: '1.25rem' }}>
            <div className="metric-box" style={{ textAlign: 'left', borderRight: '1px solid var(--border-color)', paddingRight: '1rem' }}>
              <span className="m-label" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <TrendingUp size={14} /> PREDICTED FATIGUE (6H)
              </span>
              <span className="m-val" style={{ fontSize: '1.6rem', marginTop: '0.4rem' }}>
                {fatigueData ? `${fatigueData.predicted_fatigue_6h_pct}%` : '--'}
              </span>
            </div>

            <div className="metric-box" style={{ textAlign: 'left', borderRight: '1px solid var(--border-color)', paddingRight: '1rem' }}>
              <span className="m-label" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <BatteryCharging size={14} /> TOMORROW RECOVERY
              </span>
              <span className="m-val" style={{ fontSize: '1.6rem', marginTop: '0.4rem' }}>
                {recoveryData ? `${recoveryData.predicted_tomorrow_recovery_pct}%` : '--'}
              </span>
            </div>

            <div className="metric-box" style={{ textAlign: 'left', borderRight: '1px solid var(--border-color)', paddingRight: '1rem' }}>
              <span className="m-label" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Activity size={14} /> PREDICTED STRESS (3H)
              </span>
              <span className="m-val" style={{ fontSize: '1.6rem', marginTop: '0.4rem' }}>
                {stressForecastData ? `${stressForecastData.predicted_stress_3h_pct}%` : '--'}
              </span>
            </div>

            <div className="metric-box" style={{ textAlign: 'left' }}>
              <span className="m-label" style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldAlert size={14} /> WELLNESS RISK RADAR
              </span>
              <span className="m-val" style={{ fontSize: '1.6rem', marginTop: '0.4rem' }}>
                {risksData && risksData.length > 0 ? risksData[0].risk_level : 'LOW'}
              </span>
            </div>
          </section>
        </main>
      )}

      {/* RESEARCH LAB TAB */}
      {activeTab === 'research' && (
        <main className="dashboard-grid">
          <section className="panel full-width">
            <div className="panel-header">
              <h2>RESEARCH WORKSPACE & EXPERIMENT LOGS</h2>
            </div>
            <div className="table-scroll" style={{ padding: '1rem' }}>
              <table>
                <thead>
                  <tr>
                    <th>EXPERIMENT ID</th>
                    <th>DATASET NAME</th>
                    <th>MODEL VERSION</th>
                    <th>TRUST ROC-AUC</th>
                    <th>HR MAE (BPM)</th>
                    <th>TIMESTAMP</th>
                  </tr>
                </thead>
                <tbody>
                  {researchExperiments.map((exp) => (
                    <tr key={exp.experiment_id}>
                      <td><strong>{exp.experiment_id}</strong></td>
                      <td>{exp.dataset_name}</td>
                      <td>{exp.model_version}</td>
                      <td><span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{exp.trust_roc_auc}</span></td>
                      <td>{exp.mae_bpm} BPM</td>
                      <td>{exp.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* System Health Monitoring Panel */}
          <section className="panel full-width">
            <div className="panel-header">
              <h2>HARDENED PLATFORM SYSTEM MONITORING</h2>
            </div>
            <div className="explanation-box" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              <div><strong>System Status:</strong> {systemHealth ? systemHealth.system_health_status : 'OPTIMAL'}</div>
              <div><strong>Memory Footprint:</strong> {systemHealth ? `${systemHealth.memory_usage_mb} MB` : '--'}</div>
              <div><strong>API Latency:</strong> {systemHealth ? `${systemHealth.average_api_latency_ms} ms` : '--'}</div>
              <div><strong>Inference Throughput:</strong> {systemHealth ? `${systemHealth.inference_throughput_fps} FPS` : '--'}</div>
            </div>
          </section>
        </main>
      )}

      {/* PREDICTIONS TAB */}
      {activeTab === 'predictions' && (
        <main className="dashboard-grid">
          <section className="panel full-width">
            <div className="panel-header">
              <h2>MULTI-HORIZON PHYSIOLOGICAL FORECASTS</h2>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>TARGET METRIC</th>
                    <th>TIME HORIZON</th>
                    <th>CURRENT VALUE</th>
                    <th>PREDICTED VALUE</th>
                    <th>CONFIDENCE</th>
                  </tr>
                </thead>
                <tbody>
                  {forecastsData.map((f, i) => (
                    <tr key={i}>
                      <td><strong>{f.target_metric}</strong></td>
                      <td>{f.horizon}</td>
                      <td>{f.current_value} {f.unit}</td>
                      <td><strong style={{ color: 'var(--text-primary)' }}>{f.predicted_value} {f.unit}</strong></td>
                      <td>{f.confidence_pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      )}

      {/* EXPLAINABILITY (XAI) TAB */}
      {activeTab === 'xai' && (
        <main className="dashboard-grid">
          <section className="panel full-width">
            <div className="panel-header">
              <h2>FEATURE ATTRIBUTION BREAKDOWN (SHAP VALUES)</h2>
            </div>
            <div className="feature-meters" style={{ padding: '1rem' }}>
              {featureAttributions.map((fa, i) => (
                <div key={i} className="f-bar-group" style={{ marginBottom: '0.75rem' }}>
                  <div className="f-info">
                    <span>{fa.feature_name.toUpperCase()}</span>
                    <span>{fa.contribution_pct}% ({fa.impact_direction})</span>
                  </div>
                  <div className="bar-bg">
                    <div className="bar-fill" style={{ width: `${fa.contribution_pct}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* MY PHYSIOLOGY TAB */}
      {activeTab === 'physiology' && (
        <main className="dashboard-grid">
          <section className="panel full-width">
            <div className="panel-header">
              <h2>CIRCADIAN DIURNAL RHYTHM MODEL</h2>
            </div>
            <div className="explanation-box" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
              <div><strong>Morning HR:</strong> {circadianData ? `${circadianData.morning_hr_bpm} BPM` : '--'}</div>
              <div><strong>Afternoon Peak:</strong> {circadianData ? `${circadianData.afternoon_hr_bpm} BPM` : '--'}</div>
              <div><strong>Night Dip:</strong> {circadianData ? `${circadianData.night_hr_bpm} BPM` : '--'}</div>
              <div><strong>Sleep Window:</strong> {circadianData ? circadianData.typical_sleep_time : '--'}</div>
            </div>
          </section>
        </main>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <main className="dashboard-grid">
          <section className="panel full-width">
            <div className="panel-header">
              <h2>REGISTERED SUBJECT PROFILES & BASELINES (DATABASE)</h2>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>DB ID</th>
                    <th>SUBJECT ID</th>
                    <th>NAME</th>
                    <th>AGE</th>
                    <th>GENDER</th>
                    <th>PERSONALIZED BASELINE VARIANCE</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map(u => (
                    <tr key={u.id}>
                      <td>#{u.id}</td>
                      <td>{u.subject_id}</td>
                      <td>{u.name}</td>
                      <td>{u.age} yrs</td>
                      <td>{u.gender.toUpperCase()}</td>
                      <td>{u.baseline_variance.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      )}

      {/* SIGNALS TAB */}
      {activeTab === 'signals' && (
        <main className="dashboard-grid">
          <section className="panel full-width">
            <div className="panel-header">
              <h2>INGESTED SIGNAL RECORDS (DATABASE)</h2>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>SIGNAL ID</th>
                    <th>USER ID</th>
                    <th>SIGNAL TYPE</th>
                    <th>SAMPLING RATE</th>
                    <th>INGESTION TIMESTAMP</th>
                  </tr>
                </thead>
                <tbody>
                  {signalsList.map(s => (
                    <tr key={s.signal_id}>
                      <td>#{s.signal_id}</td>
                      <td>User #{s.user_id}</td>
                      <td>{s.signal_type}</td>
                      <td>{s.sampling_rate} Hz</td>
                      <td>{s.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      )}

      {/* TRENDS TAB */}
      {activeTab === 'analytics' && (
        <main className="dashboard-grid">
          <section className="panel full-width">
            <div className="panel-header">
              <h2>LONGITUDINAL TREND ANALYTICS & HORIZON SELECTOR</h2>
            </div>
            <div className="explanation-box" style={{ minHeight: '180px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                <div><strong>Recovery Trend:</strong> {trendData ? trendData.recovery_trend : '--'}</div>
                <div><strong>HRV Trend:</strong> {trendData ? trendData.hrv_trend : '--'}</div>
                <div><strong>Sleep Trend:</strong> {trendData ? trendData.sleep_trend : '--'}</div>
                <div><strong>Stress Trend:</strong> {trendData ? trendData.stress_trend : '--'}</div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <main className="dashboard-grid">
          <section className="panel full-width">
            <div className="panel-header">
              <h2>HARDENED PLATFORM CONFIGURATIONS</h2>
            </div>
            <div className="explanation-box">
              <p><strong>Active Engine:</strong> PhysioTrust v8.0 Hardened Internal Platform</p>
              <p><strong>Active Role:</strong> {userRole}</p>
              <p><strong>JWT Authorization:</strong> {authToken ? 'ACTIVE (Bearer Token Issued)' : 'INACTIVE'}</p>
              <p><strong>Offline Demo Mode:</strong> {demoMode ? 'ENABLED (Standalone Presentation)' : 'DISABLED'}</p>
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
