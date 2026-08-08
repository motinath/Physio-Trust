import React, { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Activity } from 'lucide-react';
import { FullscreenExitOutlined } from '@ant-design/icons';

interface ECGViewerProps {
  theme?: 'dark' | 'light';
  rawBufferRef: React.MutableRefObject<number[]>;
  cleanBufferRef: React.MutableRefObject<number[]>;
  maxBufferLen?: number;
  timeWindowSec?: number;
  showRaw?: boolean;
  showClean?: boolean;
  showRPeaks?: boolean;
  showMotionArtifacts?: boolean;
  showNoiseRegions?: boolean;
  selectedChannels?: string[];
  selectedLead?: string;
  zoomLevel?: number;
  panOffset?: number;
  isPlaying?: boolean;
  isFullScreen?: boolean;
  highPrecisionTimestamp?: string;
  datasetName?: string;
  subjectId?: string;
  onToggleRaw?: () => void;
  onToggleClean?: () => void;
  onToggleRPeaks?: () => void;
  onExitFullScreen?: () => void;
  canvasRefOut?: React.RefObject<HTMLCanvasElement | null>;
}

export function ECGViewer({
  theme = 'light',
  rawBufferRef,
  cleanBufferRef,
  maxBufferLen = 600,
  timeWindowSec = 5,
  showRaw = true,
  showClean = true,
  showRPeaks = true,
  showMotionArtifacts = false,
  showNoiseRegions = false,
  selectedChannels = ['ecg', 'ppg'],
  selectedLead = 'Lead II',
  zoomLevel = 1.0,
  panOffset = 0,
  isPlaying = true,
  isFullScreen = false,
  highPrecisionTimestamp = '--:--:--.---',
  datasetName = '--',
  subjectId = '--',
  onToggleRaw,
  onToggleClean,
  onToggleRPeaks,
  onExitFullScreen,
  canvasRefOut,
}: ECGViewerProps) {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = canvasRefOut || internalCanvasRef;

  const drawOscilloscope = () => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement.clientWidth);
    const height = (canvas.height = canvas.parentElement.clientHeight || (isFullScreen ? window.innerHeight - 100 : 340));

    const canvasBg = '#ffffff';
    const gridColor = '#f1f5f9';
    const rawTraceColor = '#94a3b8';
    const cleanTraceColor = '#059669';

    // Canvas Background
    ctx.fillStyle = canvasBg;
    ctx.fillRect(0, 0, width, height);

    // Draw Subtle Clinical Grid Lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    const gridStep = Math.max(15, Math.round(30 * zoomLevel));
    for (let x = 0; x < width; x += gridStep) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridStep) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const rawBuf = rawBufferRef.current || [];
    const cleanBuf = cleanBufferRef.current || [];

    const midY = height / 2;

    // Empty Buffer State Message
    if ((!showRaw || rawBuf.length === 0) && (!showClean || cleanBuf.length === 0)) {
      ctx.fillStyle = '#64748b';
      ctx.font = '600 12px Inter, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('NO ACTIVE TELEMETRY SESSION', width / 2, midY - 6);
      ctx.font = '400 11px Inter, system-ui, sans-serif';
      ctx.fillText('Select a dataset and click "Run Pipeline" on Dashboard to start session', width / 2, midY + 14);
      ctx.textAlign = 'start';
      return;
    }

    // Auto-center and Auto-scale waveform dynamically based on visible min/max bounds
    let minVal = -1.0;
    let maxVal = 1.0;

    const activeBuf = (showClean && cleanBuf.length > 0) ? cleanBuf : rawBuf;
    if (activeBuf.length > 0) {
      const startIdx = Math.max(0, activeBuf.length - maxBufferLen + Math.floor(panOffset));
      minVal = activeBuf[startIdx];
      maxVal = activeBuf[startIdx];
      for (let i = startIdx; i < activeBuf.length; i++) {
        const v = activeBuf[i];
        if (!isNaN(v) && isFinite(v)) {
          if (v < minVal) minVal = v;
          if (v > maxVal) maxVal = v;
        }
      }
    }

    const range = Math.max(0.5, maxVal - minVal);
    const centerVal = (maxVal + minVal) / 2;
    const scaleY = ((height * 0.70) / range) * zoomLevel;

    // 1. SLEEK LOW-PROMINENCE NOISE HAIRLINE PIN
    if (showNoiseRegions) {
      const noiseX = width * 0.68;

      ctx.save();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 0.5;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(noiseX, 0);
      ctx.lineTo(noiseX, height);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
      ctx.font = '500 8px Inter, monospace';
      ctx.fillText('⚠ Noise (00:06:45)', noiseX + 3, 12);
    }

    // 2. SLEEK LOW-PROMINENCE MOTION HAIRLINE PIN
    if (showMotionArtifacts) {
      const motionX = width * 0.32;

      ctx.save();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 0.5;
      ctx.setLineDash([2, 4]);
      ctx.beginPath();
      ctx.moveTo(motionX, 0);
      ctx.lineTo(motionX, height);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = 'rgba(245, 158, 11, 0.7)';
      ctx.font = '500 8px Inter, monospace';
      ctx.fillText('▲ Motion (00:03:12)', motionX + 3, 24);
    }

    // Render Raw Trace
    if (showRaw && rawBuf.length > 1) {
      ctx.strokeStyle = rawTraceColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      const step = width / (maxBufferLen - 1);
      const startIdx = Math.max(0, rawBuf.length - maxBufferLen + Math.floor(panOffset));

      for (let i = startIdx; i < rawBuf.length; i++) {
        const x = (i - startIdx) * step;
        const val = rawBuf[i];
        const y = midY - (val - centerVal) * scaleY;

        if (i === startIdx) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Render Filtered Clean Trace
    if (showClean && cleanBuf.length > 1) {
      ctx.strokeStyle = cleanTraceColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      const step = width / (maxBufferLen - 1);
      const startIdx = Math.max(0, cleanBuf.length - maxBufferLen + Math.floor(panOffset));

      for (let i = startIdx; i < cleanBuf.length; i++) {
        const x = (i - startIdx) * step;
        const val = cleanBuf[i];
        const y = midY - (val - centerVal) * scaleY;

        if (i === startIdx) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Render R-Peaks Marker Pins
      if (showRPeaks && cleanBuf.length > 5) {
        ctx.fillStyle = '#ef4444';
        for (let i = startIdx + 2; i < cleanBuf.length - 2; i++) {
          const val = cleanBuf[i];
          if (
            val > 0.4 &&
            val > cleanBuf[i - 1] &&
            val > cleanBuf[i - 2] &&
            val > cleanBuf[i + 1] &&
            val > cleanBuf[i + 2]
          ) {
            const x = (i - startIdx) * step;
            const y = midY - (val - centerVal) * scaleY;

            ctx.beginPath();
            ctx.arc(x, y - 5, 3.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
  };

  useEffect(() => {
    let animId: number;

    const renderLoop = () => {
      drawOscilloscope();
      if (isPlaying) {
        animId = requestAnimationFrame(renderLoop);
      }
    };

    renderLoop();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [
    rawBufferRef.current?.length,
    cleanBufferRef.current?.length,
    showRaw,
    showClean,
    showRPeaks,
    showMotionArtifacts,
    showNoiseRegions,
    zoomLevel,
    panOffset,
    isPlaying,
    timeWindowSec,
    isFullScreen,
  ]);

  const viewContent = (
    <div
      className={
        isFullScreen
          ? 'fixed inset-0 z-50 bg-white p-6 flex flex-col justify-between font-sans'
          : 'w-full flex flex-col gap-3 font-sans'
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
          <Activity className="w-4 h-4 text-emerald-600" />
          <span className="font-extrabold text-slate-900">REAL-TIME ECG &amp; PPG OSCILLOSCOPE MONITOR</span>
          <span className="text-[11px] font-mono text-slate-500">
            ({selectedLead} &bull; {timeWindowSec}s Window &bull; Zoom {zoomLevel.toFixed(1)}x)
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
            Dataset: {datasetName} &bull; Subject #{subjectId}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Interactive Clickable Legend Toggles */}
          <div className="flex items-center gap-2 text-[11px] font-mono font-semibold">
            <span className="text-emerald-700 font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mr-1">
              {highPrecisionTimestamp}
            </span>

            <button
              onClick={onToggleRaw}
              className={`px-2 py-0.5 rounded text-[11px] font-medium border cursor-pointer transition-all ${
                showRaw
                  ? 'bg-slate-100 text-slate-800 border-slate-300'
                  : 'bg-transparent text-slate-400 border-transparent opacity-60'
              }`}
            >
              {showRaw ? '☑' : '☐'} RAW
            </button>

            <button
              onClick={onToggleClean}
              className={`px-2 py-0.5 rounded text-[11px] font-medium border cursor-pointer transition-all ${
                showClean
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-transparent text-slate-400 border-transparent opacity-60'
              }`}
            >
              {showClean ? '☑' : '☐'} PREPROCESSED (0.5-50Hz)
            </button>

            <button
              onClick={onToggleRPeaks}
              className={`px-2 py-0.5 rounded text-[11px] font-medium border cursor-pointer transition-all ${
                showRPeaks
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-transparent text-slate-400 border-transparent opacity-60'
              }`}
            >
              {showRPeaks ? '☑' : '☐'} R PEAKS
            </button>
          </div>

          {isFullScreen && onExitFullScreen && (
            <button
              onClick={onExitFullScreen}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md cursor-pointer"
            >
              <FullscreenExitOutlined />
              <span>Exit Full Screen (ESC)</span>
            </button>
          )}
        </div>
      </div>

      <div
        className={
          isFullScreen
            ? 'w-full flex-1 rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white mt-3'
            : 'w-full h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white'
        }
      >
        <canvas ref={canvasRef} className="w-full h-full block"></canvas>
      </div>
    </div>
  );

  if (isFullScreen) {
    return createPortal(viewContent, document.body);
  }

  return viewContent;
}
