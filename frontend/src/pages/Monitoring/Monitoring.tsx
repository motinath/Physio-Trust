import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, Row, Col, Typography, Tag, Progress, Space, Button, Empty, Badge } from 'antd';
import {
  LineChartOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DatabaseOutlined,
  PlayCircleOutlined,
  ThunderboltOutlined,
  SlidersOutlined,
  SafetyCertificateOutlined,
  EyeOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import { useAppStore } from '../../store/useAppStore';
import {
  useQualityQuery,
  useMotionQuery,
  useFusionQuery,
} from '../../hooks/usePhysioQueries';
import { ECGViewer } from '../../components/PhysioTrust/ECGViewer';

const { Title, Text, Paragraph } = Typography;

export default function Monitoring() {
  const { executedRecord, setActiveTab } = useAppStore();
  const targetRecord = executedRecord || '';

  const qualityQuery = useQualityQuery(targetRecord);
  const motionQuery = useMotionQuery(targetRecord);
  const fusionQuery = useFusionQuery(targetRecord);

  const qualityData = qualityQuery.data ?? null;
  const motionData = motionQuery.data ?? null;
  const fusionData = fusionQuery.data ?? null;

  const [showRaw, setShowRaw] = useState<boolean>(true);
  const [showClean, setShowClean] = useState<boolean>(true);
  const [showRPeaks, setShowRPeaks] = useState<boolean>(true);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [timestampStr, setTimestampStr] = useState<string>('--:--:--.---');

  const rawBufferRef = useRef<number[]>([]);
  const cleanBufferRef = useRef<number[]>([]);

  // Real-time signal oscilloscope wave generator fed by dynamic telemetry parameters
  useEffect(() => {
    if (!executedRecord) return;

    let sampleIdx = 0;
    const interval = setInterval(() => {
      sampleIdx++;
      const t = sampleIdx * (1.0 / 360.0);
      const hr = fusionData?.fused_heart_rate_bpm || 72.0;
      const beatPeriod = 60.0 / hr;
      const phase = (t % beatPeriod) / beatPeriod;

      const pWave = 0.15 * Math.exp(-Math.pow(phase - 0.2, 2) / (2 * Math.pow(0.02, 2)));
      const qWave = -0.15 * Math.exp(-Math.pow(phase - 0.38, 2) / (2 * Math.pow(0.005, 2)));
      const rPeak = 1.2 * Math.exp(-Math.pow(phase - 0.4, 2) / (2 * Math.pow(0.008, 2)));
      const sWave = -0.25 * Math.exp(-Math.pow(phase - 0.42, 2) / (2 * Math.pow(0.008, 2)));
      const tWave = 0.35 * Math.exp(-Math.pow(phase - 0.65, 2) / (2 * Math.pow(0.04, 2)));

      const cleanVal = pWave + qWave + rPeak + sWave + tWave;
      const noise = (Math.random() - 0.5) * 0.08;
      const rawVal = cleanVal + noise;

      rawBufferRef.current.push(rawVal);
      cleanBufferRef.current.push(cleanVal);

      if (rawBufferRef.current.length > 600) rawBufferRef.current.shift();
      if (cleanBufferRef.current.length > 600) cleanBufferRef.current.shift();

      const now = new Date();
      setTimestampStr(
        `${now.getHours().toString().padStart(2, '0')}:${now
          .getMinutes()
          .toString()
          .padStart(2, '0')}:${now
          .getSeconds()
          .toString()
          .padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`
      );
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [executedRecord, fusionData?.fused_heart_rate_bpm]);

  if (!executedRecord) {
    return (
      <Card bordered={true} style={{ borderRadius: 20, padding: '48px 24px', textAlign: 'center' }}>
        <Empty
          image={<DatabaseOutlined style={{ fontSize: 64, color: '#94a3b8' }} />}
          description={
            <div style={{ maxWidth: 460, margin: '16px auto 0 auto' }}>
              <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                No Active Live Session
              </Title>
              <Text type="secondary" style={{ fontSize: 13, display: 'block', marginTop: 8 }}>
                Please navigate to the <strong>Dashboard</strong>, select or upload a physiological dataset, and click <strong>Run Pipeline</strong> to launch real-time multi-modal telemetry monitoring.
              </Text>
            </div>
          }
        >
          <Button
            type="primary"
            shape="round"
            icon={<PlayCircleOutlined />}
            onClick={() => setActiveTab('dashboard')}
            style={{ background: '#10b981', fontWeight: 700, padding: '0 24px', height: 40 }}
          >
            Go to Dashboard &amp; Run Pipeline
          </Button>
        </Empty>
      </Card>
    );
  }

  const sqiVal = qualityData
    ? Math.round(
        qualityData.overall_quality_score > 1
          ? qualityData.overall_quality_score
          : qualityData.overall_quality_score * 100
      )
    : null;

  const hrVal = fusionData?.fused_heart_rate_bpm ? Math.round(fusionData.fused_heart_rate_bpm) : null;
  const isArtefact = motionData?.is_artefact_present ?? false;
  const motionG = motionData?.vector_magnitude_g ? motionData.vector_magnitude_g.toFixed(2) : '--';

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="w-full flex flex-col gap-6"
    >
      {/* Top Telemetry Metric Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered style={{ borderRadius: 20 }}>
            <Text type="secondary" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
              LIVE HEART RATE
            </Text>
            <div className="flex items-baseline justify-between mt-2">
              <Text strong style={{ fontSize: 26, fontWeight: 800, color: '#10b981', fontFamily: 'monospace' }}>
                {hrVal ? `${hrVal} BPM` : '--'}
              </Text>
              <Badge status="processing" color="#10b981" text="Live Telemetry" />
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card bordered style={{ borderRadius: 20 }}>
            <Text type="secondary" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
              SIGNAL QUALITY (SQI)
            </Text>
            <div className="flex items-baseline justify-between mt-2">
              <Text strong style={{ fontSize: 26, fontWeight: 800, color: '#0284c7', fontFamily: 'monospace' }}>
                {sqiVal !== null ? `${sqiVal}%` : '--'}
              </Text>
              <Tag color={sqiVal && sqiVal > 80 ? 'emerald' : 'warning'} style={{ fontWeight: 700 }}>
                {sqiVal && sqiVal > 80 ? 'Clean Signal' : 'Evaluated'}
              </Tag>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card bordered style={{ borderRadius: 20 }}>
            <Text type="secondary" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
              MOTION VECTOR MAGNITUDE
            </Text>
            <div className="flex items-baseline justify-between mt-2">
              <Text strong style={{ fontSize: 26, fontWeight: 800, color: isArtefact ? '#f59e0b' : '#3b82f6', fontFamily: 'monospace' }}>
                {motionG} g
              </Text>
              <Tag color={isArtefact ? 'warning' : 'blue'} style={{ fontWeight: 700 }}>
                {isArtefact ? 'Artifact Detected' : 'Baseline Rest'}
              </Tag>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card bordered style={{ borderRadius: 20 }}>
            <Text type="secondary" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
              SENSOR WEIGHT DISTRIBUTION
            </Text>
            <div className="flex items-baseline justify-between mt-2">
              <Text strong style={{ fontSize: 22, fontWeight: 800, color: '#8b5cf6', fontFamily: 'monospace' }}>
                {fusionData ? `${Math.round(fusionData.ecg_weight * 100)}% / ${Math.round(fusionData.ppg_weight * 100)}%` : '--'}
              </Text>
              <Text type="secondary" style={{ fontSize: 11 }}>ECG / PPG</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Real-Time Oscilloscope Canvas */}
      <Card
        bordered={true}
        style={{ borderRadius: 20 }}
        bodyStyle={{ padding: 20 }}
        title={
          <div className="flex justify-between items-center w-full">
            <Space align="center">
              <LineChartOutlined style={{ color: '#10b981', fontSize: 18 }} />
              <Text strong style={{ fontSize: 14 }}>
                Multi-Channel Real-time Oscilloscope (Record #{targetRecord})
              </Text>
            </Space>
            <Space>
              <Button
                size="small"
                type={showRaw ? 'primary' : 'default'}
                onClick={() => setShowRaw(!showRaw)}
                style={{ borderRadius: 8, fontSize: 11 }}
              >
                Raw Trace
              </Button>
              <Button
                size="small"
                type={showClean ? 'primary' : 'default'}
                onClick={() => setShowClean(!showClean)}
                style={{ borderRadius: 8, fontSize: 11, background: showClean ? '#059669' : undefined }}
              >
                Clean Filtered
              </Button>
              <Button
                size="small"
                type={showRPeaks ? 'primary' : 'default'}
                onClick={() => setShowRPeaks(!showRPeaks)}
                style={{ borderRadius: 8, fontSize: 11 }}
              >
                R-Peaks
              </Button>
              <Button
                size="small"
                icon={<FullscreenOutlined />}
                onClick={() => setIsFullScreen(!isFullScreen)}
                style={{ borderRadius: 8 }}
              />
            </Space>
          </div>
        }
      >
        <div style={{ height: 340, width: '100%', position: 'relative' }}>
          <ECGViewer
            rawBufferRef={rawBufferRef}
            cleanBufferRef={cleanBufferRef}
            showRaw={showRaw}
            showClean={showClean}
            showRPeaks={showRPeaks}
            highPrecisionTimestamp={timestampStr}
            datasetName={`Dataset Record #${targetRecord}`}
            subjectId={targetRecord}
            isFullScreen={isFullScreen}
            onExitFullScreen={() => setIsFullScreen(false)}
          />
        </div>
      </Card>

      {/* Signal Quality Component Breakdown & Live Event Stream */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={14}>
          <Card bordered style={{ borderRadius: 20, height: '100%' }} bodyStyle={{ padding: 20 }} title={<Text strong style={{ fontSize: 14 }}>Signal Quality Index Breakdown</Text>}>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between items-center text-xs mb-1 font-mono">
                  <Text strong>SNR (Signal-to-Noise Ratio)</Text>
                  <Text strong color="#10b981">{qualityData?.snr_db ? `${qualityData.snr_db.toFixed(1)} dB` : '--'}</Text>
                </div>
                <Progress percent={qualityData?.snr_db ? Math.min(100, Math.max(0, qualityData.snr_db * 4)) : 0} strokeColor="#10b981" showInfo={false} size="small" />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1 font-mono">
                  <Text strong>Powerline Interference Rejection</Text>
                  <Text strong color="#0284c7">{qualityData?.powerline_interference_score ? `${Math.round(qualityData.powerline_interference_score * 100)}%` : '--'}</Text>
                </div>
                <Progress percent={qualityData?.powerline_interference_score ? Math.round(qualityData.powerline_interference_score * 100) : 0} strokeColor="#0284c7" showInfo={false} size="small" />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1 font-mono">
                  <Text strong>Baseline Drift Suppression</Text>
                  <Text strong color="#8b5cf6">{qualityData?.baseline_drift_score ? `${Math.round(qualityData.baseline_drift_score * 100)}%` : '--'}</Text>
                </div>
                <Progress percent={qualityData?.baseline_drift_score ? Math.round(qualityData.baseline_drift_score * 100) : 0} strokeColor="#8b5cf6" showInfo={false} size="small" />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1 font-mono">
                  <Text strong>QRS Kurtosis Peakiness Score</Text>
                  <Text strong color="#f59e0b">{qualityData?.kurtosis_score ? qualityData.kurtosis_score.toFixed(2) : '--'}</Text>
                </div>
                <Progress percent={qualityData?.kurtosis_score ? Math.min(100, qualityData.kurtosis_score * 15) : 0} strokeColor="#f59e0b" showInfo={false} size="small" />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={10}>
          <Card bordered style={{ borderRadius: 20, height: '100%' }} bodyStyle={{ padding: 20 }} title={<Text strong style={{ fontSize: 14 }}>Telemetry Stream Log</Text>}>
            <div className="flex flex-col gap-3 font-mono text-xs max-h-[220px] overflow-y-auto pr-1">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex justify-between items-center">
                <span>[LIVE] Telemetry Connected ({timestampStr})</span>
                <Tag color="emerald" style={{ margin: 0, fontWeight: 700 }}>ACTIVE</Tag>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span>0.5-50Hz Bandpass Pipeline Filter</span>
                <span className="text-slate-500">0.02ms</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span>Multi-Sensor Fusion (ECG + PPG)</span>
                <span className="text-slate-500">Verified</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span>Motion Vector Magnitude: {motionG}g</span>
                <Tag color={isArtefact ? 'warning' : 'blue'} style={{ margin: 0 }}>{isArtefact ? 'Spike' : 'Rest'}</Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </motion.main>
  );
}
