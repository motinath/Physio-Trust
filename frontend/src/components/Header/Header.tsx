import React from 'react';
import { Button, Tag, Space, Typography } from 'antd';
import {
  DashboardOutlined,
  AreaChartOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  BarChartOutlined,
  FileTextOutlined,
  ApiOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;

interface HeaderProps {
  username?: string;
  theme?: string;
  toggleTheme?: () => void;
  streamConnected?: boolean;
  handleLogout?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
  { id: 'monitoring', label: 'Monitoring', icon: <AreaChartOutlined /> },
  { id: 'ai_intelligence', label: 'AI Intelligence', icon: <RobotOutlined /> },
  { id: 'trust_engine', label: 'Trust Engine', icon: <SafetyCertificateOutlined /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChartOutlined /> },
  { id: 'reports', label: 'Reports', icon: <FileTextOutlined /> },
];

export default function Header({
  theme = 'light',
  activeTab,
  setActiveTab,
}: HeaderProps) {
  const isDark = theme === 'dark';

  return (
    <div className="w-full flex flex-col gap-3 mb-2 print:hidden no-print">
      {/* Top Header Control Bar */}
      <div
        className={`w-full flex items-center justify-between px-6 py-3 rounded-2xl border backdrop-blur-md transition-all shadow-sm ${
          isDark
            ? 'bg-slate-900/90 border-slate-800'
            : 'bg-white/90 border-slate-200'
        }`}
      >
        <Space size="middle">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
            <ApiOutlined style={{ fontSize: 18 }} />
          </div>
          <div>
            <Space align="center" size={8}>
              <Title level={5} style={{ margin: 0, fontWeight: 800 }}>
                PhysioTrust
              </Title>
              <Tag className="tag-emerald" style={{ margin: 0 }}>
                v1.0.0-RC1
              </Tag>
            </Space>
            <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>
              Enterprise Physiological Intelligence Platform
            </Text>
          </div>
        </Space>
      </div>

      {/* Navigation Tab Bar */}
      <div
        className={`w-full p-1.5 rounded-2xl border shadow-sm transition-all overflow-x-auto ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between min-w-max gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <Button
                key={item.id}
                type={isActive ? 'primary' : 'text'}
                icon={item.icon}
                onClick={() => setActiveTab(item.id)}
                style={{
                  borderRadius: 12,
                  height: 40,
                  flex: 1,
                  minWidth: 120,
                  fontWeight: isActive ? 700 : 500,
                  background: isActive ? '#10b981' : 'transparent',
                  color: isActive ? '#ffffff' : undefined,
                  boxShadow: isActive ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
