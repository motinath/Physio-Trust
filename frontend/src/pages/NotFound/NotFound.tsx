import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export default function NotFound() {
  const { setActiveTab } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <AlertCircle className="w-12 h-12 text-zinc-500 mb-3" />
      <h2 className="text-lg font-bold font-mono text-zinc-200 mb-1">404 - Page Not Found</h2>
      <p className="text-xs text-zinc-400 max-w-sm mb-4">
        The requested telemetry view or route does not exist in the PhysioTrust system.
      </p>
      <button
        className="btn btn-primary text-xs"
        onClick={() => setActiveTab('dashboard')}
      >
        Return to Dashboard
      </button>
    </motion.div>
  );
}
