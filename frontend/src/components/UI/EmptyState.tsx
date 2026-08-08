import React from 'react';
import { Database } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = 'No Physiological Data Available',
  message = 'No records found for the selected dataset. Connect a wearable device or load a valid recording to begin monitoring.',
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-zinc-950/40 border border-zinc-800 rounded-lg my-2">
      <Database className="w-10 h-10 text-zinc-500 mb-3" />
      <h3 className="text-base font-semibold text-zinc-200 mb-1">{title}</h3>
      <p className="text-xs text-zinc-400 max-w-md mb-4">{message}</p>
      {actionText && onAction && (
        <button className="btn btn-primary text-xs" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
}
