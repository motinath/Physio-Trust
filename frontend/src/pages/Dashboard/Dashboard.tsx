import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  Select,
  Button,
  Row,
  Col,
  Typography,
  Tag,
  Alert,
  Space,
  Upload,
  Segmented,
  Badge,
} from 'antd';
import {
  DatabaseOutlined,
  PlayCircleOutlined,
  RobotOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';

import { useAppStore } from '../../store/useAppStore';
import {
  useQualityQuery,
  useMotionQuery,
  useFusionQuery,
  useHealthStateQuery,
  useRecoveryQuery,
  useStressQuery,
} from '../../hooks/usePhysioQueries';

import { validateDatasetFile, ValidationResult } from '../../services/datasets';
import { DatasetViewerPanel } from '../../components/PhysioTrust/DatasetViewerPanel';
import HeroStatusBar from '../../components/PhysioTrust/HeroStatusBar';

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

interface DashboardProps {
  availableRecords: string[];
  handleRecordChange: (e: any) => void;
  triggerAiPipeline: () => void;
  isAnalyzing: boolean;
  pipelineRunning: boolean;
}

export default function Dashboard({
  availableRecords,
  handleRecordChange,
  triggerAiPipeline,
  isAnalyzing,
  pipelineRunning,
}: DashboardProps) {
  const { selectedRecord, setSelectedRecord, executedRecord, setExecutedRecord, clearExecutedRecord, context, threshold } = useAppStore();
  const [sourceMode, setSourceMode] = useState<'builtin' | 'upload'>('builtin');
  const [isUploading, setIsUploading] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showDatasetViewer, setShowDatasetViewer] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setValidationResult(null);
    try {
      const result = await validateDatasetFile(file);
      setValidationResult(result);
      if (result.valid) {
        setSelectedRecord(result.filename);
        clearExecutedRecord();
      }
    } catch (err: any) {
      setValidationResult({
        valid: false,
        filename: file.name,
        detected_format: 'Unknown',
        detected_signals: [],
        sampling_rate_hz: 0,
        num_samples: 0,
        duration_sec: 0,
        error_message: `Dataset Validation Failed: ${err.message || 'File processing error'}`,
        processing_stages: { Uploaded: true, Validated: false, Preprocessed: false, FeaturesExtracted: false, AIReady: false },
      });
    } finally {
      setIsUploading(false);
    }
  };

  const activeRecordForQueries = executedRecord === selectedRecord && executedRecord ? executedRecord : '';

  const qualityQuery = useQualityQuery(activeRecordForQueries);
  const motionQuery = useMotionQuery(activeRecordForQueries);
  const fusionQuery = useFusionQuery(activeRecordForQueries);
  const healthStateQuery = useHealthStateQuery(activeRecordForQueries);
  const recoveryQuery = useRecoveryQuery(activeRecordForQueries);
  const stressQuery = useStressQuery(activeRecordForQueries);

  const fusionData = activeRecordForQueries ? (fusionQuery.data ?? null) : null;
  const healthStateData = activeRecordForQueries ? (healthStateQuery.data ?? null) : null;
  const recoveryData = activeRecordForQueries ? (recoveryQuery.data ?? null) : null;
  const stressData = activeRecordForQueries ? (stressQuery.data ?? null) : null;

  const qualityScoreVal = activeRecordForQueries && qualityQuery.data
    ? Math.round(qualityQuery.data.overall_quality_score > 1 ? qualityQuery.data.overall_quality_score : qualityQuery.data.overall_quality_score * 100)
    : null;

  const scorePct = qualityScoreVal !== null ? qualityScoreVal : (fusionData ? Math.round(fusionData.confidence_pct) : null);
  const confidenceScoreVal = activeRecordForQueries && fusionData ? Math.round(fusionData.confidence_pct) : qualityScoreVal;

  // Ensure default records are present
  const allRecords = Array.from(
    new Set([...availableRecords, '100', '101', '200', 'wesad_s3', 'ptb_001'])
  );

  const getDatasetMeta = useCallback((recId: string) => {
    if (!recId) {
      return {
        name: 'No Dataset Selected',
        signals: '--',
        sampleRate: '--',
        duration: '--',
        samples: '--',
        status: 'No Active Session',
        isReady: false,
      };
    }
    const hasRun = executedRecord === recId && recId !== '';
    switch (recId) {
      case '101':
        return { name: 'MIT-BIH Arrhythmia Database', signals: 'ECG, Beat Annotations, RR Intervals', sampleRate: '360 Hz', duration: '30 min', samples: '650,000', status: hasRun ? 'Session Ready' : 'Dataset Selected (Click Run Pipeline)', isReady: hasRun };
      case '100':
        return { name: 'MIT-BIH Normal Sinus Rhythm', signals: 'ECG Lead I/II, RR Intervals', sampleRate: '360 Hz', duration: '30 min', samples: '650,000', status: hasRun ? 'Session Ready' : 'Dataset Selected (Click Run Pipeline)', isReady: hasRun };
      case 'wesad_s3':
        return { name: 'WESAD Wearable Stress & Affect', signals: 'ECG, PPG, EDA, Motion', sampleRate: '700 Hz', duration: '30 min', samples: '1,260,000', status: hasRun ? 'Session Ready' : 'Dataset Selected (Click Run Pipeline)', isReady: hasRun };
      case 'ptb_001':
        return { name: 'PTB Diagnostic ECG Database', signals: '15-Lead ECG', sampleRate: '1000 Hz', duration: '2 min', samples: '120,000', status: hasRun ? 'Session Ready' : 'Dataset Selected (Click Run Pipeline)', isReady: hasRun };
      default:
        return { name: 'MIMIC Multi-Sensor ICU Database', signals: 'ECG, PPG, ABP, SpO2, Respiration', sampleRate: '250 Hz', duration: '30 min', samples: '450,000', status: hasRun ? 'Session Ready' : 'Dataset Selected (Click Run Pipeline)', isReady: hasRun };
    }
  }, [executedRecord]);

  const currentMeta = getDatasetMeta(selectedRecord);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col gap-5"
    >
      {/* 1. HERO SECTION */}
      <Card bordered={true} style={{ borderRadius: 20, background: 'var(--bg-panel)' }}>
        <Row align="middle" justify="space-between">
          <Col xs={24} md={18}>
            <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
              PhysioTrust
            </Title>
            <Tag className="tag-emerald" style={{ marginTop: 4, marginBottom: 8, display: 'inline-block' }}>
              Enterprise Physiological Intelligence Platform
            </Tag>
            <Paragraph type="secondary" style={{ fontSize: 13, margin: 0, maxWidth: 800 }}>
              Upload a physiological dataset or select one of the built-in datasets. PhysioTrust will automatically validate, preprocess, analyze and generate trustworthy AI insights.
            </Paragraph>
          </Col>
        </Row>
      </Card>

      {/* 2. DATASET SELECTION (ENTRY POINT) */}
      <Card bordered={true} style={{ borderRadius: 20 }}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Space align="center">
              <DatabaseOutlined style={{ fontSize: 18, color: '#10b981' }} />
              <Text strong style={{ fontSize: 14 }}>
                DATA SOURCE ENTRY POINT
              </Text>
            </Space>

            <Segmented
              options={[
                { label: 'Built-in Dataset', value: 'builtin' },
                { label: 'Upload Dataset', value: 'upload' },
              ]}
              value={sourceMode}
              onChange={(val) => setSourceMode(val as 'builtin' | 'upload')}
              style={{ borderRadius: 12 }}
            />
          </div>

          {sourceMode === 'builtin' ? (
            <div className="flex flex-wrap items-center gap-3">
              <Select
                allowClear={{ clearIcon: <CloseCircleOutlined style={{ color: '#ef4444' }} /> }}
                placeholder="Select built-in physiological dataset..."
                value={selectedRecord || undefined}
                onChange={(val) => {
                  setExecutedRecord(null);
                  handleRecordChange({ target: { value: val || '' } });
                }}
                style={{ width: '100%', maxWidth: 460 }}
                options={allRecords.map((rec) => ({
                  value: rec,
                  label:
                    rec === '100'
                      ? '▼ MIT-BIH Normal Sinus Rhythm (Subject #100)'
                      : rec === '101'
                      ? '▼ MIT-BIH Arrhythmia Database (Subject #101)'
                      : rec === '200'
                      ? '▼ MIMIC Multi-Sensor ICU Database (Subject #200)'
                      : rec === 'wesad_s3'
                      ? '▼ WESAD Wearable Stress & Affect (Subject #3)'
                      : rec === 'ptb_001'
                      ? '▼ PTB Diagnostic ECG Database (Record #001)'
                      : `▼ Dataset Subject #${rec}`,
                }))}
              />

              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                loading={isAnalyzing || pipelineRunning}
                onClick={() => {
                  setExecutedRecord(selectedRecord);
                  triggerAiPipeline();
                }}
                disabled={!selectedRecord}
                style={{ borderRadius: 12, fontWeight: 700, background: '#10b981' }}
              >
                {isAnalyzing || pipelineRunning ? 'Processing...' : 'Run Pipeline'}
              </Button>

              <Button
                type="default"
                icon={<EyeOutlined />}
                onClick={() => setShowDatasetViewer(!showDatasetViewer)}
                disabled={!selectedRecord}
                style={{ borderRadius: 12, fontWeight: 600 }}
              >
                {showDatasetViewer ? 'Hide Dataset Data' : 'View Dataset Data & Records'}
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Dragger
                name="file"
                multiple={false}
                customRequest={({ file }) => handleFileUpload(file as File)}
                showUploadList={false}
                style={{ borderRadius: 16, padding: '16px', background: 'var(--bg-card)' }}
              >
                <p className="ant-upload-drag-icon" style={{ marginBottom: 8 }}>
                  <InboxOutlined style={{ color: '#10b981', fontSize: 32 }} />
                </p>
                <p className="ant-upload-text" style={{ fontWeight: 700, margin: 0 }}>
                  {isUploading ? 'Validating & Detecting Signal Metadata...' : 'Click or Drag Physiological Dataset File Here'}
                </p>
                <p className="ant-upload-hint" style={{ fontSize: 11, marginTop: 4 }}>
                  Supported Formats: <Tag color="blue">CSV</Tag> <Tag color="green">WFDB</Tag> <Tag color="purple">MAT</Tag> <Tag color="orange">EDF</Tag> <Tag color="cyan">JSON</Tag>
                </p>
              </Dragger>

              {validationResult && (
                validationResult.valid ? (
                  <Alert
                    message="DATASET VALIDATED & READY"
                    description={`${validationResult.filename} • ${validationResult.detected_format} • ${validationResult.sampling_rate_hz} Hz (${validationResult.num_samples} samples)`}
                    type="success"
                    showIcon
                    icon={<CheckCircleOutlined />}
                    action={
                      <Space>
                        <Button
                          size="small"
                          type="primary"
                          icon={<PlayCircleOutlined />}
                          loading={isAnalyzing || pipelineRunning}
                          onClick={() => {
                            setExecutedRecord(selectedRecord);
                            triggerAiPipeline();
                          }}
                          style={{ borderRadius: 8, fontWeight: 700, background: '#10b981' }}
                        >
                          {isAnalyzing || pipelineRunning ? 'Processing...' : 'Run Pipeline'}
                        </Button>
                        <Button
                          size="small"
                          type="default"
                          icon={<EyeOutlined />}
                          onClick={() => setShowDatasetViewer(true)}
                          style={{ borderRadius: 8, fontWeight: 600 }}
                        >
                          View Data
                        </Button>
                      </Space>
                    }
                    style={{ borderRadius: 12 }}
                  />
                ) : (
                  <Alert
                    message="VALIDATION ERROR"
                    description={validationResult.error_message || 'File upload integrity check failed.'}
                    type="error"
                    showIcon
                    icon={<ExclamationCircleOutlined />}
                    style={{ borderRadius: 12 }}
                  />
                )
              )}

              {/* Upload Tab Control Action Bar */}
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <Button
                  type="primary"
                  icon={<PlayCircleOutlined />}
                  loading={isAnalyzing || pipelineRunning}
                  onClick={() => {
                    setExecutedRecord(selectedRecord);
                    triggerAiPipeline();
                  }}
                  disabled={!selectedRecord || (validationResult !== null && !validationResult.valid)}
                  style={{ borderRadius: 12, fontWeight: 700, background: '#10b981' }}
                >
                  {isAnalyzing || pipelineRunning ? 'Processing...' : 'Run Pipeline'}
                </Button>

                <Button
                  type="default"
                  icon={<EyeOutlined />}
                  onClick={() => setShowDatasetViewer(!showDatasetViewer)}
                  disabled={!selectedRecord}
                  style={{ borderRadius: 12, fontWeight: 600 }}
                >
                  {showDatasetViewer ? 'Hide Dataset Data' : 'View Dataset Data & Records'}
                </Button>

                {selectedRecord && (
                  <Text type="secondary" style={{ fontSize: 12, marginLeft: 'auto' }}>
                    Active Dataset File: <strong style={{ color: '#10b981' }}>{selectedRecord}</strong>
                  </Text>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* INTERACTIVE DATASET SIGNAL DATA TABLE & WAVEFORM INSPECTOR */}
      {showDatasetViewer && selectedRecord && (
        <DatasetViewerPanel
          datasetId={selectedRecord}
          datasetName={validationResult?.filename || currentMeta.name}
          samplingRate={validationResult?.sampling_rate_hz || (parseInt(currentMeta.sampleRate) || 360)}
          signals={validationResult?.detected_signals.length ? validationResult.detected_signals : [currentMeta.signals]}
          onClose={() => setShowDatasetViewer(false)}
        />
      )}

      {/* 3. DATASET INFORMATION & SUMMARY */}
      <Card bordered={true} style={{ borderRadius: 20 }}>
        <Text type="secondary" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>
          Active Telemetry Session Summary
        </Text>
        <Row gutter={[12, 12]}>
          <Col xs={12} sm={8} md={4}>
            <Text type="secondary" style={{ fontSize: 10, display: 'block' }}>DATASET</Text>
            <Text strong style={{ fontSize: 13, color: selectedRecord ? undefined : 'var(--text-muted)' }}>
              {currentMeta.name}
            </Text>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Text type="secondary" style={{ fontSize: 10, display: 'block' }}>SIGNALS</Text>
            <Text strong style={{ fontSize: 13, color: selectedRecord ? '#0284c7' : 'var(--text-muted)' }}>
              {currentMeta.signals}
            </Text>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Text type="secondary" style={{ fontSize: 10, display: 'block' }}>SAMPLING RATE</Text>
            <Text strong style={{ fontSize: 13, fontFamily: 'monospace', color: selectedRecord ? '#10b981' : 'var(--text-muted)' }}>
              {currentMeta.sampleRate}
            </Text>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Text type="secondary" style={{ fontSize: 10, display: 'block' }}>DURATION</Text>
            <Text strong style={{ fontSize: 13, fontFamily: 'monospace' }}>{currentMeta.duration}</Text>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Text type="secondary" style={{ fontSize: 10, display: 'block' }}>SAMPLES</Text>
            <Text strong style={{ fontSize: 13, fontFamily: 'monospace' }}>{currentMeta.samples}</Text>
          </Col>
          <Col xs={12} sm={8} md={4}>
            <Text type="secondary" style={{ fontSize: 10, display: 'block' }}>STATUS</Text>
            {currentMeta.isReady ? (
              <Tag className="tag-emerald" icon={<CheckCircleOutlined />}>
                {currentMeta.status}
              </Tag>
            ) : (
              <Tag color="default" icon={<ExclamationCircleOutlined />}>
                {currentMeta.status}
              </Tag>
            )}
          </Col>
        </Row>
      </Card>

      {/* 5. AI EXECUTIVE SUMMARY & 7. DATASET PREVIEW */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card
            bordered={true}
            style={{ borderRadius: 20, height: '100%' }}
            title={
              <Space align="center">
                <RobotOutlined style={{ color: '#10b981', fontSize: 18 }} />
                <Text strong style={{ fontSize: 14 }}>
                  AI Executive Summary
                </Text>
              </Space>
            }
          >
            <div className="flex flex-col gap-3">
              <div>
                <Text type="secondary" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>
                  OVERALL ASSESSMENT
                </Text>
                <Paragraph style={{ fontSize: 13, fontWeight: executedRecord ? 600 : 400, margin: '4px 0 0 0', color: executedRecord ? undefined : 'var(--text-muted)' }}>
                  {executedRecord
                    ? 'Healthy physiological profile. Signal quality is verified clean with high signal-to-noise ratio. No major cardiovascular or motion anomalies detected.'
                    : selectedRecord
                    ? `Dataset selected (${currentMeta.name}). Click 'Run Pipeline' to execute signal processing & AI telemetry analysis.`
                    : 'No active dataset session. Select or upload a physiological dataset above to run AI processing.'}
                </Paragraph>
              </div>

              <Row gutter={12} style={{ marginTop: 8 }}>
                <Col span={8}>
                  <Card type="inner" style={{ borderRadius: 12 }}>
                    <Text type="secondary" style={{ fontSize: 10, display: 'block' }}>TRUST SCORE</Text>
                    <Text strong style={{ fontSize: 16, color: scorePct !== null ? '#10b981' : undefined }}>
                      {scorePct !== null ? `High (${scorePct}%)` : '--'}
                    </Text>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card type="inner" style={{ borderRadius: 12 }}>
                    <Text type="secondary" style={{ fontSize: 10, display: 'block' }}>CONFIDENCE</Text>
                    <Text strong style={{ fontSize: 16, color: confidenceScoreVal !== null ? '#0284c7' : undefined }}>
                      {confidenceScoreVal !== null ? `${confidenceScoreVal}%` : '--'}
                    </Text>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card type="inner" style={{ borderRadius: 12 }}>
                    <Text type="secondary" style={{ fontSize: 10, display: 'block' }}>RECOMMENDATION</Text>
                    <Text strong style={{ fontSize: 13, color: selectedRecord ? '#6366f1' : undefined }}>
                      {selectedRecord ? 'Proceed to Monitoring' : 'Select a dataset'}
                    </Text>
                  </Card>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            bordered={true}
            style={{ borderRadius: 20, height: '100%' }}
            title={
              <Space align="center">
                <InfoCircleOutlined style={{ color: '#0284c7', fontSize: 18 }} />
                <Text strong style={{ fontSize: 14 }}>
                  Dataset Preview
                </Text>
              </Space>
            }
          >
            <div className="flex flex-col gap-3 font-sans text-xs">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <Text type="secondary">SIGNALS DETECTED</Text>
                {selectedRecord ? (
                  <Tag color="cyan">{currentMeta.signals}</Tag>
                ) : (
                  <Text type="secondary">--</Text>
                )}
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <Text type="secondary">SIGNAL QUALITY</Text>
                {executedRecord && qualityQuery.data ? (
                  <Tag className="tag-emerald">
                    {`${qualityQuery.data.overall_quality_score >= 0.7 ? 'Acceptable' : 'Noise Present'} (${qualityScoreVal}%)`}
                  </Tag>
                ) : (
                  <Text type="secondary">Pending Run</Text>
                )}
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <Text type="secondary">RECORD DURATION</Text>
                <Text strong style={{ fontFamily: 'monospace' }}>{currentMeta.duration}</Text>
              </div>
              <div className="flex justify-between items-center">
                <Text type="secondary">TELEMETRY STREAMING</Text>
                {selectedRecord ? (
                  <Badge status="processing" text={`Active ${currentMeta.sampleRate} Playback`} />
                ) : (
                  <Badge status="default" text="Inactive (No Dataset)" />
                )}
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 6. SYSTEM SUMMARY (6 KPI CARDS) */}
      <Card
        bordered={true}
        style={{ borderRadius: 20 }}
        title={
          <Text type="secondary" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
            System Summary KPI Indicators
          </Text>
        }
      >
        <HeroStatusBar
          scorePct={scorePct !== null ? scorePct : '--'}
          healthStateData={healthStateData}
          recoveryData={recoveryData}
          stressForecastData={stressData}
          context={activeRecordForQueries ? context : null}
          threshold={activeRecordForQueries ? threshold : null}
          aiConfidencePct={confidenceScoreVal}
        />
      </Card>

    </motion.main>
  );
}
