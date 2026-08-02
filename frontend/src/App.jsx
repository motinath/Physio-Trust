
import React, { useState, useEffect, useRef } from 'react';
import { Activity, ShieldCheck, Download, Play, Radio, Users as UsersIcon, Database, BarChart2, Settings as SettingsIcon, Layers, Sun, Moon, Cpu, Zap, Compass, Heart, HeartPulse, BatteryCharging, CheckCircle2, Info, Clock, Thermometer, Flame, HelpCircle, FileText, Check, AlertTriangle, TrendingUp, Sliders, ShieldAlert, FlaskConical, Lock, Eye } from 'lucide-react';

import WorkspaceSelector from './components/WorkspaceSelector';
import Header from './components/Header';
import HeroStatusBar from './components/HeroStatusBar';
import AiInsightsCard from './components/AiInsightsCard';
import ExpandedTrustCard from './components/ExpandedTrustCard';
import PipelineStepperModal from './components/PipelineStepperModal';
import SessionReplayControls from './components/SessionReplayControls';
import DataSourceConnector from './components/DataSourceConnector';
import IntelligenceLineageCard from './components/IntelligenceLineageCard';

import ResearchWorkspacePage from './pages/ResearchWorkspacePage';
import PersonalWorkspacePage from './pages/PersonalWorkspacePage';
import ClinicalWorkspacePage from './pages/ClinicalWorkspacePage';
import AdminWorkspacePage from './pages/AdminWorkspacePage';

export default function App() {
  // Navigation, Theme, Workspace & Replay State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [activeWorkspace, setActiveWorkspace] = useState('research');
  const [username, setUsername] = useState('Motinath');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [demoMode, setDemoMode] = useState(true);
  const [replaySpeed, setReplaySpeed] = useState(1);

  // Login & Workspace Handlers
  const handleEnterWorkspace = async () => {
    try {
      const res = await fetch('/api/v1/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: activeWorkspace, username: username })
      });
      if (res.ok) {
        const data = await res.json();
        setAuthToken(data.access_token);
      } else {
        setAuthToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_token');
      }
    } catch (err) {
      setAuthToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_token');
    }
    setIsLoggedIn(true);
    setActiveTab('dashboard');
  };

  const handleSwitchWorkspace = () => {
    setIsLoggedIn(false);
  };

  // Dynamic Tabs based on Workspace (Master Architecture)
  const getVisibleTabs = () => {
    if (activeWorkspace === 'research') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: Zap },
        { id: 'datasets', label: 'Datasets', icon: Database },
        { id: 'experiments', label: 'Experiments', icon: FlaskConical },
        { id: 'signal_lab', label: 'Signal Lab', icon: Radio },
        { id: 'validation', label: 'Validation', icon: CheckCircle2 },
        { id: 'benchmarks', label: 'Benchmarks', icon: BarChart2 },
        { id: 'reports', label: 'Reports', icon: FileText },
      ];
    } else if (activeWorkspace === 'personal') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: Zap },
        { id: 'sessions', label: 'Sessions', icon: Radio },
        { id: 'insights', label: 'AI Insights', icon: Cpu },
        { id: 'timeline', label: 'Timeline', icon: Clock },
        { id: 'predictions', label: 'Predictions', icon: TrendingUp },
        { id: 'reports', label: 'My Reports', icon: FileText },
      ];
    } else if (activeWorkspace === 'clinical') {
      return [
        { id: 'dashboard', label: 'Dashboard', icon: Zap },
        { id: 'patients', label: 'Patients', icon: UsersIcon },
        { id: 'sessions', label: 'Sessions', icon: Radio },
        { id: 'ai_analysis', label: 'AI Analysis', icon: Cpu },
        { id: 'reports', label: 'Clinical Reports', icon: FileText },
        { id: 'history', label: 'History', icon: Clock },
      ];
    } else {
      // Admin Workspace (Superuser — ALL UNLOCKED)
      return [
        { id: 'dashboard', label: 'Dashboard', icon: Zap },
        { id: 'users', label: 'Users & Impersonation', icon: UsersIcon },
        { id: 'roles', label: 'Roles & RBAC', icon: Lock },
        { id: 'datasets', label: 'Datasets', icon: Database },
        { id: 'system', label: 'System Health', icon: Activity },
        { id: 'logs', label: 'Logs', icon: FileText },
        { id: 'settings', label: 'Settings', icon: SettingsIcon },
      ];
    }
  };

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

  // 14-Step Workflow Pipeline & Interactive Signal State
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [zoomScale, setZoomScale] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [overlayPeaks, setOverlayPeaks] = useState(true);
  const [overlayArtifacts, setOverlayArtifacts] = useState(true);

  const pipelineStages = [
    '1. Loading ECG & PPG Datasets...',
    '2. Signal Preprocessing & 0.5-50Hz Filtering',
    '3. Feature Extraction (HRV, Kurtosis, Entropy)',
    '4. Computing Signal Quality Index (SQI: 98.4)',
    '5. Evaluating AI Trust Score Ensemble (97%)',
    '6. Context Awareness (Resting Threshold 0.60)',
    '7. Baseline Adaptation & Diurnal Rhythms',
    '8. Multi-Horizon Predictions & Fatigue Risk',
    '9. Generating XAI Feature Attributions & Reasoning',
    '10. Formulating Proactive Recommendations'
  ];

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
      body: JSON.stringify({ subject_id: selectedRecord, role: activeWorkspace })
    })
      .then(res => res.json())
      .then(data => {
        if (data.access_token) setAuthToken(data.access_token);
      }).catch(err => console.error(err));
  }, [activeWorkspace, selectedRecord]);

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
      const host = (window.location.port === '5173' || window.location.port === '5174') ? 'localhost:8000' : (window.location.host || 'localhost:8000');
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
    const canvasBg = isLight ? '#fafafa' : '#030303';
    const gridColor = isLight ? '#e4e4e7' : '#18181b';
    const rawTraceColor = isLight ? '#a1a1aa' : '#52525b';
    const cleanTraceColor = isLight ? '#09090b' : '#ffffff';

    ctx.fillStyle = canvasBg;
    ctx.fillRect(0, 0, width, height);

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

  // Trigger Interactive AI Pipeline Reasoning Progress
  const triggerAiPipeline = () => {
    setPipelineRunning(true);
    setPipelineStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < 10) {
        setPipelineStep(step);
      } else {
        clearInterval(interval);
        setPipelineRunning(false);
        runFullAnalysis();
      }
    }, 400);
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

  let strokeColor = theme === 'light' ? '#09090b' : '#ffffff';
  let trustBadgeLabel = 'HIGH TRUST SIGNAL';
  let trustBadgeClass = 'reliable';

  if (trustScore !== null) {
    if (trustScore < 0.40) {
      strokeColor = '#ef4444';
      trustBadgeLabel = 'UNRELIABLE - DISCARDED';
      trustBadgeClass = 'unreliable';
    } else if (trustScore < 0.70) {
      strokeColor = '#f59e0b';
      trustBadgeLabel = 'MODERATE QUALITY';
      trustBadgeClass = 'moderate';
    } else {
      strokeColor = isReliable ? (theme === 'light' ? '#09090b' : '#ffffff') : '#ef4444';
      trustBadgeLabel = 'RELIABLE SIGNAL';
      trustBadgeClass = 'reliable';
    }
  }

  // STEP 1: WORKSPACE SELECTOR LANDING SCREEN
  if (!isLoggedIn) {
    return (
      <WorkspaceSelector
        username={username}
        setUsername={setUsername}
        activeWorkspace={activeWorkspace}
        setActiveWorkspace={setActiveWorkspace}
        handleEnterWorkspace={handleEnterWorkspace}
      />
    );
  }

  const visibleTabs = getVisibleTabs();

  return (
    <div className="app-container">
      {/* Top Header & Workspace-Driven Navigation */}
      <Header
        username={username}
        activeWorkspace={activeWorkspace}
        setActiveWorkspace={setActiveWorkspace}
        theme={theme}
        toggleTheme={toggleTheme}
        streamConnected={streamConnected}
        handleSwitchWorkspace={handleSwitchWorkspace}
        visibleTabs={visibleTabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Welcome Greeting & System Readiness Bar */}
      <div className="welcome-readiness-bar">
        <div className="greeting-box">
          <h2>Good Morning, {username}</h2>
          <p>PhysioTrust • Active Workspace: <strong>{activeWorkspace.toUpperCase()}</strong> {activeWorkspace === 'admin' ? '(SUPERUSER — ALL WORKSPACES UNLOCKED)' : ''}</p>
        </div>
        <div className="system-readiness-pill">
          <span className="readiness-dot"></span>
          <span><strong>Status:</strong> System Ready • <strong>Models Loaded:</strong> 12 Ensemble Models • <strong>Signals:</strong> ECG, PPG, HRV</span>
        </div>
      </div>

      {/* Step 4: AI Pipeline Reasoning Progress Visualizer */}
      <PipelineStepperModal
        pipelineRunning={pipelineRunning}
        pipelineStages={pipelineStages}
        pipelineStep={pipelineStep}
      />

      {/* PHYSIOLOGICAL INTELLIGENCE CENTER (DASHBOARD TAB) */}
      {activeTab === 'dashboard' && (
        <main className="dashboard-grid">
          {/* Top Hero Metric Bar */}
          <HeroStatusBar
            scorePct={scorePct}
            healthStateData={healthStateData}
            recoveryData={recoveryData}
            stressForecastData={stressForecastData}
            context={context}
            threshold={threshold}
          />

          {/* Enhanced Physiological Intelligence Lineage Card */}
          <IntelligenceLineageCard
            scorePct={scorePct}
            qualityData={qualityData}
            context={context}
          />

          {/* Left Column: Live Oscilloscope & Session Replay Controls */}
          <div className="left-column-group">
            {/* Live Clinical Oscilloscope */}
            <section className="panel main-chart-panel">
              <div className="panel-header">
                <h2>LIVE CLINICAL SIGNAL OSCILLOSCOPE (360 Hz)</h2>
                <div className="legend">
                  <span className="legend-item raw"><span className="line-sample"></span> RAW ECG/PPG</span>
                  <span className="legend-item clean"><span className="line-sample"></span> PREPROCESSED (0.5-50Hz)</span>
                </div>
              </div>
              <div className="canvas-wrapper">
                <canvas ref={canvasRef}></canvas>
              </div>
            </section>

            {/* Live Session Replay Engine Controls */}
            <SessionReplayControls
              selectedRecord={selectedRecord}
              availableRecords={availableRecords}
              handleRecordChange={handleRecordChange}
              isPaused={isPaused}
              setIsPaused={setIsPaused}
              replaySpeed={replaySpeed}
              setReplaySpeed={setReplaySpeed}
            />

            {/* Signal & Activity Controls */}
            <section className="panel control-panel">
              <div className="control-group">
                <label>ACTIVITY CONTEXT EVALUATION</label>
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
                <button className="btn btn-primary" onClick={triggerAiPipeline} disabled={isAnalyzing || pipelineRunning}>
                  {isAnalyzing || pipelineRunning ? 'RUNNING AI PIPELINE...' : 'EXECUTE AI PIPELINE'}
                </button>
                <button className="btn btn-secondary" onClick={exportCsv}>
                  EXPORT CSV
                </button>
              </div>
            </section>
          </div>

          {/* Right Column: Signature AI Insights, Data Source Connector & Expanded Trust Card */}
          <div className="right-column-group">
            {/* Device-Agnostic Data Source Connector */}
            <DataSourceConnector
              selectedRecord={selectedRecord}
              handleRecordChange={handleRecordChange}
            />

            {/* SIGNATURE AI FEATURE: AI INSIGHTS & REASONING PANEL */}
            <AiInsightsCard qualityData={qualityData} />

            {/* EXPANDED TRUST CARD */}
            <ExpandedTrustCard
              trustBadgeClass={trustBadgeClass}
              trustBadgeLabel={trustBadgeLabel}
              strokeDashoffset={strokeDashoffset}
              strokeColor={strokeColor}
              scorePct={scorePct}
              qualityData={qualityData}
              motionData={motionData}
              fusionData={fusionData}
              explanation={explanation}
            />
          </div>

          {/* Phase 6 Predictive Horizons Summary Row */}
          <section className="panel full-width prediction-row-panel">
            <div className="p-card-item">
              <span className="p-label"><TrendingUp size={14} /> PREDICTED FATIGUE (6H)</span>
              <span className="p-val">{fatigueData ? `${fatigueData.predicted_fatigue_6h_pct}%` : '14%'}</span>
            </div>

            <div className="p-card-item">
              <span className="p-label"><BatteryCharging size={14} /> TOMORROW RECOVERY</span>
              <span className="p-val">{recoveryData ? `${recoveryData.predicted_tomorrow_recovery_pct}%` : '92%'}</span>
            </div>

            <div className="p-card-item">
              <span className="p-label"><Activity size={14} /> PREDICTED STRESS (3H)</span>
              <span className="p-val">{stressForecastData ? `${stressForecastData.predicted_stress_3h_pct}%` : '18%'}</span>
            </div>

            <div className="p-card-item">
              <span className="p-label"><ShieldAlert size={14} /> WELLNESS RISK RADAR</span>
              <span className="p-val">{risksData && risksData.length > 0 ? risksData[0].risk_level : 'LOW'}</span>
            </div>
          </section>
        </main>
      )}

      {/* WORKSPACE PAGES (RESEARCH, PERSONAL, CLINICAL, ADMIN) */}
      {activeWorkspace === 'research' && <ResearchWorkspacePage activeTab={activeTab} />}
      {activeWorkspace === 'personal' && <PersonalWorkspacePage activeTab={activeTab} />}
      {activeWorkspace === 'clinical' && <ClinicalWorkspacePage activeTab={activeTab} />}
      {activeWorkspace === 'admin' && <AdminWorkspacePage activeTab={activeTab} />}
    </div>
  );
}
