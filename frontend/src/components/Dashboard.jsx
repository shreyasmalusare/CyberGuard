import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Filter,
  SortAsc,
  Download,
  Clock,
  Target,
  Shield,
  AlertCircle,
  X,
} from 'lucide-react';
import VulnCard from './VulnCard';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from '../hooks/use-toast';

const Dashboard = ({ scanResults, onVulnClick }) => {
  const [severityFilter, setSeverityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('severity');
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * ✅ NORMALIZE BACKEND DATA (MOST IMPORTANT FIX)
   */
  const vulnerabilities = useMemo(() => {
    const raw =
      scanResults?.vulnerabilities ||
      scanResults?.report?.findings ||
      [];

    return raw.map((v, index) => ({
      id: v.id || index,
      title: v.title || v.type || 'Unknown Issue',
      description: v.description || `Detected via ${v.source || 'scanner'}`,
      severity: (v.severity || 'low').toLowerCase(),
      affectedEndpoint: v.affectedEndpoint || v.source || scanResults?.targetUrl || '',
      cvss: v.weight || v.cvss || 0,
      timestamp: v.timestamp || new Date().toISOString(),
    }));
  }, [scanResults]);

  /**
   * SUMMARY SAFE FIX
   */
  const summary = useMemo(() => {
    const findings =
      scanResults?.summary ||
      scanResults?.report?.summary ||
      {};

    return {
      critical: findings.critical || 0,
      high: findings.high || 0,
      medium: findings.medium || 0,
      low: findings.low || 0,
      info: findings.info || 0,
    };
  }, [scanResults]);

  /**
   * FILTER + SORT FIXED
   */
  const filteredVulns = useMemo(() => {
    let filtered = [...vulnerabilities];

    if (severityFilter !== 'all') {
      filtered = filtered.filter(
        (v) => v.severity === severityFilter
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.affectedEndpoint.toLowerCase().includes(q)
      );
    }

    const severityOrder = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
      info: 4,
    };

    filtered.sort((a, b) => {
      if (sortBy === 'severity') {
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      if (sortBy === 'cvss') {
        return (b.cvss || 0) - (a.cvss || 0);
      }
      if (sortBy === 'date') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
      return 0;
    });

    return filtered;
  }, [vulnerabilities, severityFilter, sortBy, searchQuery]);

  const handleExport = (format) => {
    if (!scanResults) return;

    const blob = new Blob(
      [JSON.stringify(scanResults, null, 2)],
      { type: 'application/json' }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scan-report.json`;
    a.click();

    toast({
      title: 'Exported',
      description: 'Scan results exported as JSON',
    });
  };

  const formatDuration = (seconds = 0) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (!scanResults) return null;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">

      {/* HEADER */}
      <motion.div className="mb-8 glass-panel neon-glow-cyan rounded-2xl p-6">
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Scan Results
            </h2>
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <Target className="h-4 w-4" />
              {scanResults?.targetUrl || scanResults?.target}
            </div>
          </div>

          <Button onClick={() => handleExport('json')}>
            Export JSON
          </Button>
        </div>

        {/* SUMMARY SAFE */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Stat label="Total" value={vulnerabilities.length} />
          <Stat label="Critical" value={summary.critical} />
          <Stat label="High" value={summary.high} />
          <Stat label="Medium" value={summary.medium} />
          <Stat label="Low" value={summary.low} />
        </div>

        <div className="mt-4 text-sm text-gray-400 flex gap-4">
          <span>
            Risk Score: {scanResults?.riskScore || scanResults?.report?.risk_score || 0}
          </span>
        </div>
      </motion.div>

      {/* FILTERS */}
      <div className="flex gap-4 mb-6">
        <input
          className="bg-black/40 p-2 rounded"
          placeholder="Search vulnerabilities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* COUNT */}
      <div className="text-sm text-gray-400 mb-4">
        Showing {filteredVulns.length} vulnerabilities
      </div>

      {/* CARDS */}
      <div className="grid gap-4">
        {filteredVulns.map((vuln, i) => (
          <motion.div key={vuln.id}>
            <VulnCard
              vulnerability={vuln}
              onClick={() => onVulnClick(vuln)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

/**
 * Small helper component
 */
const Stat = ({ label, value }) => (
  <div className="bg-black/40 p-3 rounded">
    <div className="text-xl text-white font-bold">{value}</div>
    <div className="text-xs text-gray-400">{label}</div>
  </div>
);

export default Dashboard;