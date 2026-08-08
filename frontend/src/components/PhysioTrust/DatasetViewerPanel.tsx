
import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, Typography, Row, Col, Tabs, InputNumber, Pagination, Tooltip as AntTooltip } from 'antd';
import {
  EyeOutlined,
  TableOutlined,
  AreaChartOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  DownloadOutlined,
  FileTextOutlined,
  SlidersOutlined,
} from '@ant-design/icons';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import * as datasetsService from '../../services/datasets';

const { Text, Title } = Typography;

interface DatasetViewerPanelProps {
  datasetId: string;
  datasetName?: string;
  samplingRate?: number;
  signals?: string[];
  onClose?: () => void;
}

interface SignalSampleRow {
  key: number;
  sampleIdx: number;
  timeSec: string;
  rawSignal: number;
  cleanSignal: number;
  sqi: number;
  status: string;
}

export function DatasetViewerPanel({
  datasetId,
  datasetName = 'MIT-BIH Normal Sinus Rhythm (Subject #100)',
  samplingRate = 360,
  signals = ['ECG Lead II', 'RR Intervals'],
  onClose,
}: DatasetViewerPanelProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<SignalSampleRow[]>([]);
  const [totalSamples, setTotalSamples] = useState<number>(650000);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [jumpSampleIdx, setJumpSampleIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'table' | 'waveform'>('table');
  const [fs, setFs] = useState<number>(samplingRate);

  const fetchFullDatasetChunk = async (recId: string, page: number, size: number) => {
    setLoading(true);
    const offset = (page - 1) * size;
    try {
      const res = await datasetsService.getDatasetFullData(recId, offset, size);
      setTotalSamples(res.total_samples || 650000);
      setFs(res.sampling_rate_hz || samplingRate);

      const rows: SignalSampleRow[] = (res.rows || []).map((r, idx) => ({
        key: idx,
        sampleIdx: r.sample_idx,
        timeSec: r.time_sec.toFixed(4),
        rawSignal: r.raw_ecg,
        cleanSignal: r.clean_ecg,
        sqi: r.sqi,
        status: r.status === 'VALID_CLEAN' ? 'Valid (Clean)' : 'Artifact',
      }));

      setTableData(rows);
    } catch (err) {
      console.error('Failed to fetch full dataset endpoint:', err);
      // No synthetic fake data fallback per project directive
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFullDatasetChunk(datasetId, currentPage, pageSize);
  }, [datasetId, currentPage, pageSize]);

  const handlePageChange = (page: number, newSize?: number) => {
    setCurrentPage(page);
    if (newSize && newSize !== pageSize) {
      setPageSize(newSize);
    }
  };

  const handleJumpToSample = () => {
    const targetPage = Math.max(1, Math.floor(jumpSampleIdx / pageSize) + 1);
    setCurrentPage(targetPage);
  };

  const downloadDatasetCsv = () => {
    // Triggers full backend stream download of ALL 650,000+ sample rows in complete CSV
    const exportUrl = `/api/v1/datasets/${datasetId}/export-csv`;
    const link = document.createElement('a');
    link.href = exportUrl;
    link.setAttribute('download', `${datasetId}_complete_full_dataset.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      title: 'Sample Index',
      dataIndex: 'sampleIdx',
      key: 'sampleIdx',
      render: (val: number) => <Text strong style={{ fontFamily: 'monospace' }}>#{val.toLocaleString()}</Text>,
    },
    {
      title: 'Time (s)',
      dataIndex: 'timeSec',
      key: 'timeSec',
      render: (val: string) => <Text style={{ fontFamily: 'monospace', color: '#0284c7' }}>{val}s</Text>,
    },
    {
      title: `Raw Signal (${signals[0] || 'ECG'})`,
      dataIndex: 'rawSignal',
      key: 'rawSignal',
      render: (val: number) => (
        <Text style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>
          {val >= 0 ? `+${val.toFixed(4)}` : val.toFixed(4)} mV
        </Text>
      ),
    },
    {
      title: 'Preprocessed Signal (0.5-50Hz)',
      dataIndex: 'cleanSignal',
      key: 'cleanSignal',
      render: (val: number) => (
        <Text strong style={{ fontFamily: 'monospace', color: '#10b981' }}>
          {val >= 0 ? `+${val.toFixed(4)}` : val.toFixed(4)} mV
        </Text>
      ),
    },
    {
      title: 'Signal Quality Index (SQI)',
      dataIndex: 'sqi',
      key: 'sqi',
      render: (val: number) => (
        <Text strong style={{ fontFamily: 'monospace', color: val >= 80 ? '#10b981' : '#f59e0b' }}>
          {val.toFixed(1)}%
        </Text>
      ),
    },
    {
      title: 'Signal Status',
      dataIndex: 'status',
      key: 'status',
      render: (val: string) => (
        <Tag color={val.includes('Valid') ? 'green' : 'orange'} icon={<CheckCircleOutlined />}>
          {val}
        </Tag>
      ),
    },
  ];

  const chartData = tableData.map((row) => ({
    sample: row.sampleIdx,
    time: row.timeSec,
    raw: row.rawSignal,
    clean: row.cleanSignal,
  }));

  return (
    <Card
      bordered={true}
      style={{
        borderRadius: 24,
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-panel)',
      }}
      className="w-full my-4"
    >
      {/* 1. HEADER SECTION */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 mb-4">
        <Space align="center" size="middle">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-sm">
            <SlidersOutlined style={{ fontSize: 20 }} />
          </div>
          <div>
            <Space align="center" size={8}>
              <Title level={4} style={{ margin: 0, fontWeight: 800 }}>
                Full Dataset Explorer & Exact Signal Inspector
              </Title>
              <Tag className="tag-emerald">
                {totalSamples.toLocaleString()} TOTAL SAMPLES
              </Tag>
            </Space>
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 2 }}>
              Dataset: <strong className="text-emerald-500">{datasetName}</strong> (#{datasetId}) • {fs} Hz Sampling Rate • Range: Samples #{((currentPage - 1) * pageSize).toLocaleString()} to #{Math.min(currentPage * pageSize, totalSamples).toLocaleString()}
            </Text>
          </div>
        </Space>

        <Space wrap size="small">
          <Button
            type="default"
            icon={<DownloadOutlined />}
            onClick={downloadDatasetCsv}
            style={{ borderRadius: 10, fontWeight: 600 }}
          >
            Export CSV
          </Button>

          <Button
            type="default"
            icon={<ReloadOutlined />}
            onClick={() => fetchFullDatasetChunk(datasetId, currentPage, pageSize)}
            loading={loading}
            style={{ borderRadius: 10 }}
          >
            Refresh
          </Button>

          {onClose && (
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={onClose}
              style={{ borderRadius: 10 }}
            />
          )}
        </Space>
      </div>

      {/* 2. JUMP TO SAMPLE & PAGINATION CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 mb-4 rounded-xl bg-slate-50 border border-slate-200">
        <Space align="center" wrap size="middle">
          <Space align="center" size={8}>
            <Text strong style={{ fontSize: 12 }}>Jump to Sample #:</Text>
            <InputNumber
              min={0}
              max={totalSamples}
              value={jumpSampleIdx}
              onChange={(val) => setJumpSampleIdx(val || 0)}
              placeholder="e.g. 150000"
              style={{ width: 140, borderRadius: 8 }}
            />
            <Button type="primary" size="small" onClick={handleJumpToSample} style={{ borderRadius: 8, fontWeight: 600 }}>
              Jump
            </Button>
          </Space>
        </Space>

        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={totalSamples}
          onChange={handlePageChange}
          showSizeChanger
          pageSizeOptions={['20', '50', '100', '250']}
          size="small"
        />
      </div>

      {/* 3. TABS: FULL DATASET TABLE / WAVEFORM */}
      <Tabs
        activeKey={activeTab}
        onChange={(k) => setActiveTab(k as 'table' | 'waveform')}
        items={[
          {
            key: 'table',
            label: (
              <Space align="center">
                <TableOutlined />
                <span>Full Numerical Data Table ({tableData.length} Rows)</span>
              </Space>
            ),
            children: (
              <div className="flex flex-col gap-3">
                <Table
                  dataSource={tableData}
                  columns={columns}
                  loading={loading}
                  pagination={false}
                  size="small"
                  bordered
                  style={{ borderRadius: 12, overflow: 'hidden' }}
                />
              </div>
            ),
          },
          {
            key: 'waveform',
            label: (
              <Space align="center">
                <AreaChartOutlined />
                <span>Exact Signal Waveform Trace</span>
              </Space>
            ),
            children: (
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <Text type="secondary">Signal Lead Amplitude (Samples #{((currentPage - 1) * pageSize).toLocaleString()} - #{Math.min(currentPage * pageSize, totalSamples).toLocaleString()})</Text>
                  <Space size="middle">
                    <span className="flex items-center gap-1 text-slate-500">
                      <span className="w-3 h-0.5 bg-slate-400 inline-block"></span> Raw Signal
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <span className="w-3 h-0.5 bg-emerald-600 inline-block"></span> Preprocessed Signal (0.5-50Hz)
                    </span>
                  </Space>
                </div>

                <div className="h-72 w-full p-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10 }} unit="s" />
                      <YAxis stroke="#64748b" tick={{ fontSize: 10 }} unit="mV" />
                      <Tooltip
                        contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: 12, fontSize: 11 }}
                      />
                      <Line type="monotone" dataKey="raw" stroke="#94a3b8" strokeWidth={1} dot={false} name="Raw Signal" />
                      <Line type="monotone" dataKey="clean" stroke="#10b981" strokeWidth={2} dot={false} name="Preprocessed Signal" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ),
          },
        ]}
      />
    </Card>
  );
}
