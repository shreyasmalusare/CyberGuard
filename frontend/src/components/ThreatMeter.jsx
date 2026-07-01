import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle } from 'lucide-react';

/**
 * ThreatMeter Component
 * 
 * Animated gauge showing risk score (0-100)
 * Color changes based on severity:
 * - 0-30: Green (Low risk)
 * - 31-60: Amber (Medium risk)
 * - 61-85: Orange (High risk)
 * - 86-100: Red (Critical risk)
 */
const ThreatMeter = ({ riskScore = 0, isScanning = false }) => {
  const getColor = () => {
    if (riskScore <= 30) return '#4ade80'; // green
    if (riskScore <= 60) return '#FFC857'; // amber
    if (riskScore <= 85) return '#fb923c'; // orange
    return '#FF3366'; // red
  };

  const getLabel = () => {
    if (riskScore <= 30) return 'Low Risk';
    if (riskScore <= 60) return 'Medium Risk';
    if (riskScore <= 85) return 'High Risk';
    return 'Critical Risk';
  };

  const color = getColor();
  const label = getLabel();

  return (
    <div className="glass-panel neon-glow-cyan rounded-lg p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold text-white">Risk Score</h3>
        {isScanning ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-amber-400" />
        )}
      </div>

      {/* Circular Gauge */}
      <div className="relative mx-auto flex h-48 w-48 items-center justify-center">
        {/* Background Circle */}
        <svg className="absolute inset-0 h-full w-full -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="80"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="12"
            fill="none"
          />
          {/* Animated Progress Circle */}
          <motion.circle
            cx="96"
            cy="96"
            r="80"
            stroke={color}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: '0 502' }}
            animate={{
              strokeDasharray: `${(riskScore / 100) * 502} 502`,
            }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{
              filter: `drop-shadow(0 0 10px ${color})`,
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="relative text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-2"
          >
            {riskScore <= 30 ? (
              <Shield className="mx-auto h-10 w-10 text-green-400" />
            ) : (
              <AlertTriangle className="mx-auto h-10 w-10" style={{ color }} />
            )}
          </motion.div>
          <motion.div
            className="text-4xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            style={{ textShadow: `0 0 20px ${color}` }}
          >
            {isScanning ? '--' : riskScore}
          </motion.div>
          <div className="mt-1 text-sm" style={{ color }}>
            {isScanning ? 'Calculating...' : label}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-400" />
          <span className="text-gray-400">0-30: Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#FFC857]" />
          <span className="text-gray-400">31-60: Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-orange-400" />
          <span className="text-gray-400">61-85: High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#FF3366]" />
          <span className="text-gray-400">86-100: Critical</span>
        </div>
      </div>
    </div>
  );
};

export default ThreatMeter;