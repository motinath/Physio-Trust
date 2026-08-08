import React from 'react';
import { Row, Col, Card, Typography, Tag } from 'antd';
import {
  SafetyCertificateOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  RiseOutlined,
  AimOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import type { HealthStateResponse, RecoveryResponse, StressForecastResponse } from '../../types/api';

const { Text } = Typography;

interface HeroStatusBarProps {
  scorePct: number | string;
  healthStateData?: HealthStateResponse | null;
  recoveryData?: RecoveryResponse | null;
  stressForecastData?: StressForecastResponse | null;
  context?: string | null;
  threshold?: number | null;
  aiConfidencePct?: number | null;
}

export default function HeroStatusBar({
  scorePct,
  healthStateData,
  recoveryData,
  stressForecastData,
  context,
  threshold,
  aiConfidencePct,
}: HeroStatusBarProps) {
  const healthState = healthStateData?.overall_state || '--';
  const recoveryVal = recoveryData?.predicted_tomorrow_recovery_pct !== undefined && recoveryData?.predicted_tomorrow_recovery_pct !== null ? `${Math.round(recoveryData.predicted_tomorrow_recovery_pct)}%` : '--';
  const stressVal = stressForecastData?.predicted_stress_3h_pct !== undefined && stressForecastData?.predicted_stress_3h_pct !== null ? `${Math.round(stressForecastData.predicted_stress_3h_pct)}%` : '--';
  const confidenceVal = aiConfidencePct !== null && aiConfidencePct !== undefined ? `${Math.round(aiConfidencePct)}%` : '--';
  const contextVal = context ? context.toUpperCase() : '--';
  const thresholdVal = threshold !== null && threshold !== undefined ? threshold : '--';

  return (
    <Row gutter={[16, 16]}>
      <Col xs={12} sm={8} md={4}>
        <Card size="small" bordered style={{ borderRadius: 14, textAlign: 'center' }}>
          <SafetyCertificateOutlined style={{ fontSize: 20, color: '#10b981', marginBottom: 4 }} />
          <div>
            <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, display: 'block' }}>
              TRUST SCORE
            </Text>
            <Text strong style={{ fontSize: 18, color: '#10b981' }}>
              {typeof scorePct === 'number' ? `${scorePct}%` : scorePct}
            </Text>
          </div>
        </Card>
      </Col>

      <Col xs={12} sm={8} md={4}>
        <Card size="small" bordered style={{ borderRadius: 14, textAlign: 'center' }}>
          <HeartOutlined style={{ fontSize: 20, color: '#3b82f6', marginBottom: 4 }} />
          <div>
            <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, display: 'block' }}>
              HEALTH STATE
            </Text>
            <Tag color={healthState === 'OPTIMAL' ? 'green' : 'blue'} style={{ marginTop: 2, margin: 0 }}>
              {healthState}
            </Tag>
          </div>
        </Card>
      </Col>

      <Col xs={12} sm={8} md={4}>
        <Card size="small" bordered style={{ borderRadius: 14, textAlign: 'center' }}>
          <RiseOutlined style={{ fontSize: 20, color: '#8b5cf6', marginBottom: 4 }} />
          <div>
            <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, display: 'block' }}>
              RECOVERY
            </Text>
            <Text strong style={{ fontSize: 18, color: '#8b5cf6' }}>
              {recoveryVal}
            </Text>
          </div>
        </Card>
      </Col>

      <Col xs={12} sm={8} md={4}>
        <Card size="small" bordered style={{ borderRadius: 14, textAlign: 'center' }}>
          <ThunderboltOutlined style={{ fontSize: 20, color: '#f59e0b', marginBottom: 4 }} />
          <div>
            <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, display: 'block' }}>
              STRESS (3H)
            </Text>
            <Text strong style={{ fontSize: 18, color: '#f59e0b' }}>
              {stressVal}
            </Text>
          </div>
        </Card>
      </Col>

      <Col xs={12} sm={8} md={4}>
        <Card size="small" bordered style={{ borderRadius: 14, textAlign: 'center' }}>
          <AimOutlined style={{ fontSize: 20, color: '#06b6d4', marginBottom: 4 }} />
          <div>
            <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, display: 'block' }}>
              CONTEXT / THRESHOLD
            </Text>
            <Text strong style={{ fontSize: 13, color: '#06b6d4' }}>
              {contextVal} ({thresholdVal})
            </Text>
          </div>
        </Card>
      </Col>

      <Col xs={12} sm={8} md={4}>
        <Card size="small" bordered style={{ borderRadius: 14, textAlign: 'center' }}>
          <RobotOutlined style={{ fontSize: 20, color: '#ec4899', marginBottom: 4 }} />
          <div>
            <Text type="secondary" style={{ fontSize: 11, fontWeight: 600, display: 'block' }}>
              AI CONFIDENCE
            </Text>
            <Text strong style={{ fontSize: 18, color: '#ec4899' }}>
              {confidenceVal}
            </Text>
          </div>
        </Card>
      </Col>
    </Row>
  );
}
