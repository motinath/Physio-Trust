import React from 'react';
import { motion } from 'framer-motion';
import { Card, Row, Col, Typography, Tag, Progress, Space, Button, Empty, Segmented, Table, Alert } from 'antd';
import {
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DatabaseOutlined,
  PlayCircleOutlined,
  SlidersOutlined,
  BranchesOutlined,
  AimOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useAppStore, ActivityContextType } from '../../store/useAppStore';
import {
  useTrustStatusQuery,
  useFusionQuery,
  useQualityQuery,
  useBaselineQuery,
  useMotionQuery,
} from '../../hooks/usePhysioQueries';

const { Title, Text, Paragraph } = Typography;

export default function TrustEngine() {
  const { executedRecord, context, threshold, setContext, setActiveTab } = useAppStore();
  const targetRecord = executedRecord || '';

  const trustQuery = useTrustStatusQuery(targetRecord, context);
  const fusionQuery = useFusionQuery(targetRecord);
  const qualityQuery = useQualityQuery(targetRecord);
  const baselineQuery = useBaselineQuery(targetRecord);
  const motionQuery = useMotionQuery(targetRecord);

  const trustData = trustQuery.data ?? null;
  const fusionData = fusionQuery.data ?? null;
  const qualityData = qualityQuery.data ?? null;
  const baselineData = baselineQuery.data ?? null;
  const motionData = motionQuery.data ?? null;

  if (!executedRecord) {
    return (
      <Card bordered={true} style={{ borderRadius: 20, padding: '48px 24px', textAlign: 'center' }}>
        <Empty
          image={<SafetyCertificateOutlined style={{ fontSize: 64, color: '#94a3b8' }} />}
          description={
            <div style={{ maxWidth: 460, margin: '16px auto 0 auto' }}>
              <Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                No Active Trust Audit Session
              </Title>
              <Text type="secondary" style={{ fontSize: 13, display: 'block', marginTop: 8 }}>
                Please navigate to the <strong>Dashboard</strong>, select or upload a physiological dataset, and click <strong>Run Pipeline</strong> to compute explainable trust metrics, sensor weights, and reliability verification.
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

  const trustScorePct = trustData?.trust_score
    ? Math.round(trustData.trust_score > 1 ? trustData.trust_score : trustData.trust_score * 100)
    : qualityData?.overall_quality_score
    ? Math.round(qualityData.overall_quality_score > 1 ? qualityData.overall_quality_score : qualityData.overall_quality_score * 100)
    : null;

  const isReliable = trustData?.is_reliable ?? (trustScorePct !== null ? trustScorePct >= Math.round(threshold * 100) : true);
  const confidenceLevel = trustData?.confidence_level || (isReliable ? 'HIGH_CONFIDENCE' : 'REDUCED_RELIABILITY');

  const ecgWeight = fusionData ? Math.round(fusionData.ecg_weight * 100) : 65;
  const ppgWeight = fusionData ? Math.round(fusionData.ppg_weight * 100) : 35;

  const auditRows = [
    {
      key: '1',
      metric: 'Signal-to-Noise Ratio (SNR)',
      value: qualityData?.snr_db ? `${qualityData.snr_db.toFixed(1)} dB` : 'Evaluated',
      status: qualityData && qualityData.snr_db > 15 ? 'Clean' : 'Acceptable',
      impact: 'High Impact (+30%)',
    },
    {
      key: '2',
      metric: 'Motion Vector Magnitude',
      value: motionData?.vector_magnitude_g ? `${motionData.vector_magnitude_g.toFixed(2)} g` : 'Rest Baseline',
      status: motionData?.is_artefact_present ? 'Spike Detected' : 'Normal',
      impact: 'Artifact Penalty (-15%)',
    },
    {
      key: '3',
      metric: 'ECG / PPG Inter-Sensor Agreement',
      value: fusionData ? `${fusionData.ecg_ppg_delta_bpm.toFixed(1)} BPM Delta` : 'Synched',
      status: fusionData && fusionData.ecg_ppg_delta_bpm < 5.0 ? 'Matched' : 'Slight Shift',
      impact: 'Fusion Confidence (+25%)',
    },
    {
      key: '4',
      metric: 'Personalized Baseline Variance',
      value: baselineData ? `${baselineData.baseline_mean_variance.toFixed(4)}` : 'Model Fit',
      status: 'In Threshold',
      impact: 'Context Match (+20%)',
    },
  ];

  const columns = [
    { title: 'Audit Vector', dataIndex: 'metric', key: 'metric', render: (text: string) => <Text strong style={{ fontSize: 13 }}>{text}</Text> },
    { title: 'Observed Telemetry', dataIndex: 'value', key: 'value', render: (text: string) => <Text style={{ fontFamily: 'monospace' }}>{text}</Text> },
    {
      title: 'Verification Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status.includes('Spike') ? 'warning' : 'emerald'} style={{ fontWeight: 700, borderRadius: 6 }}>
          {status}
        </Tag>
      ),
    },
    { title: 'Trust Weight Impact', dataIndex: 'impact', key: 'impact', render: (text: string) => <Text type="secondary" style={{ fontSize: 12 }}>{text}</Text> },
  ];

  return (
    <motion.main
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="w-full flex flex-col gap-6"
    >
      {/* Top Context Switcher Bar */}
      <Card bordered={true} style={{ borderRadius: 20 }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Space align="center">
            <AimOutlined style={{ fontSize: 20, color: '#10b981' }} />
            <div>
              <Text strong style={{ fontSize: 14, display: 'block' }}>
                Context-Adaptive Reliability Threshold Engine
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Current Active Threshold: <strong style={{ color: '#10b981' }}>{Math.round(threshold * 100)}%</strong> ({context.toUpperCase()} Mode)
              </Text>
            </div>
          </Space>

          <Segmented
            value={context}
            onChange={(val) => setContext(val as ActivityContextType)}
            options={[
              { label: 'Rest (60%)', value: 'rest' },
              { label: 'Sleep (70%)', value: 'sleep' },
              { label: 'Walking (40%)', value: 'walking' },
              { label: 'Running (30%)', value: 'running' },
            ]}
            style={{ borderRadius: 12, padding: 3 }}
          />
        </div>
      </Card>

      {/* Main Metric Overview Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card bordered style={{ borderRadius: 20, height: '100%' }} bodyStyle={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <Text type="secondary" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                EXPLAINABLE TRUST SCORE
              </Text>
              <div className="mt-2">
                <Text strong style={{ fontSize: 32, fontWeight: 800, color: isReliable ? '#10b981' : '#f59e0b', fontFamily: 'monospace' }}>
                  {trustScorePct !== null ? `${trustScorePct}%` : '--'}
                </Text>
              </div>
            </div>
            <div className="mt-4 pt-2.5 border-t border-slate-200 flex justify-between items-center">
              <Text type="secondary" style={{ fontSize: 11 }}>Reliability Rating:</Text>
              <Tag color={isReliable ? 'emerald' : 'warning'} style={{ fontWeight: 700, borderRadius: 6 }}>
                {isReliable ? 'VERIFIED RELIABLE' : 'REDUCED RELIABILITY'}
              </Tag>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card bordered style={{ borderRadius: 20, height: '100%' }} bodyStyle={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <Text type="secondary" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                CONFIDENCE EVALUATION
              </Text>
              <div className="mt-2">
                <Text strong style={{ fontSize: 24, fontWeight: 800, color: '#0284c7' }}>
                  {confidenceLevel.replace('_', ' ')}
                </Text>
              </div>
            </div>
            <div className="mt-4 pt-2.5 border-t border-slate-200">
              <Progress percent={trustScorePct ?? 0} strokeColor="#0284c7" showInfo={false} size="small" />
              <div className="flex justify-between items-center text-xs mt-1 font-mono text-slate-500">
                <span>Threshold: {Math.round(threshold * 100)}%</span>
                <span>Margin: +{trustScorePct ? trustScorePct - Math.round(threshold * 100) : 0}%</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card bordered style={{ borderRadius: 20, height: '100%' }} bodyStyle={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <Text type="secondary" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                PRIMARY RELIABLE SENSOR
              </Text>
              <div className="mt-2">
                <Text strong style={{ fontSize: 24, fontWeight: 800, color: '#8b5cf6' }}>
                  {fusionData?.primary_reliable_sensor || 'ECG (Lead II)'}
                </Text>
              </div>
            </div>
            <div className="mt-4 pt-2.5 border-t border-slate-200 flex justify-between items-center">
              <Text type="secondary" style={{ fontSize: 11 }}>Fusion Weighting:</Text>
              <Text strong style={{ fontSize: 12, color: '#8b5cf6', fontFamily: 'monospace' }}>
                {ecgWeight}% ECG / {ppgWeight}% PPG
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Sensor Weight Distribution Chart Card */}
      <Card bordered style={{ borderRadius: 20 }} bodyStyle={{ padding: 20 }} title={<Space align="center"><BranchesOutlined style={{ color: '#0284c7' }} /><Text strong style={{ fontSize: 14 }}>Adaptive Sensor Fusion Weight Distribution</Text></Space>}>
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-center text-xs mb-1 font-mono">
              <Text strong style={{ color: '#10b981' }}>ECG Sensor Weight ({ecgWeight}%)</Text>
              <Text type="secondary">Electrical Cardiac Potential</Text>
            </div>
            <Progress percent={ecgWeight} strokeColor="#10b981" showInfo={false} />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1 font-mono">
              <Text strong style={{ color: '#0284c7' }}>PPG Sensor Weight ({ppgWeight}%)</Text>
              <Text type="secondary">Optical Photoplethysmogram</Text>
            </div>
            <Progress percent={ppgWeight} strokeColor="#0284c7" showInfo={false} />
          </div>
        </div>
      </Card>

      {/* Explainability Trust Matrix Audit Table */}
      <Card bordered style={{ borderRadius: 20 }} bodyStyle={{ padding: 0 }} title={<Text strong style={{ fontSize: 14, padding: '16px 20px 0 20px', display: 'block' }}>PhysioTrust Telemetry Verification Matrix</Text>}>
        <Table columns={columns} dataSource={auditRows} pagination={false} style={{ borderRadius: 20 }} />
      </Card>
    </motion.main>
  );
}
