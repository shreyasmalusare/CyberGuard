import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * ScanLogStream Component
 * 
 * Displays real-time scanning logs with:
 * - Socket-like streaming animation
 * - Color-coded log types (info, success, warning, critical)
 * - Auto-scroll to latest log
 * - Timestamps
 */
const ScanLogStream = ({ logs = [], isScanning }) => {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case 'critical':
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Info className="h-4 w-4 text-cyan-400" />;
    }
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'warning':
        return 'text-amber-400';
      case 'critical':
      case 'high':
        return 'text-red-400';
      default:
        return 'text-cyan-400';
    }
  };

  return (
    <div className="glass-panel neon-glow-purple rounded-lg p-4">
      <div className="mb-3 flex items-center gap-2">
        <Terminal className="h-5 w-5 text-purple-400" />
        <h3 className="font-heading text-lg font-semibold text-white">Scan Log</h3>
        {isScanning && (
          <div className="ml-auto flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            <span className="text-sm text-gray-400">Scanning...</span>
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        className="h-80 overflow-y-auto rounded bg-black/60 p-3 font-mono text-sm"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0, 229, 255, 0.3) transparent',
        }}
      >
        <AnimatePresence initial={false}>
          {logs.length === 0 ? (
            <div className="flex h-full items-center justify-center text-gray-500">
              Waiting to start scan...
            </div>
          ) : (
            logs.map((log, index) => (
              <motion.div
                key={`${log.timestamp}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-2 flex items-start gap-2"
              >
                {getLogIcon(log.type)}
                <span className="text-gray-500">[{log.timestamp}]</span>
                <span className={`flex-1 ${getLogColor(log.type)}`}>{log.message}</span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ScanLogStream;