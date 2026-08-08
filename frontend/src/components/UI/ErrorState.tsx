import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Unable to Connect to Server',
  message = 'The backend API service is currently unreachable or returned an error. Please verify server status.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center bg-red-950/20 border border-red-900/40 rounded-lg my-2">
      <AlertCircle className="w-8 h-8 text-red-400 mb-2" />
      <h3 className="text-sm font-semibold text-red-200 mb-1">{title}</h3>
      <p className="text-xs text-red-300/80 max-w-md mb-3">{message}</p>
      {onRetry && (
        <button
          className="btn btn-secondary text-xs flex items-center gap-1.5"
          onClick={onRetry}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
}
