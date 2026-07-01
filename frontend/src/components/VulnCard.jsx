import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Copy, Check, Shield, AlertTriangle } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { toast } from '../hooks/use-toast';
import theme from '../config/theme';

/**
 * VulnCard Component
 * 
 * Displays a single vulnerability with:
 * - Color-coded severity badge with glow animation
 * - Collapsible proof-of-concept section
 * - Copy-to-clipboard functionality with feedback
 * - CVSS score badge
 * - Affected endpoint info
 * - Click to open in inspector panel
 */
const VulnCard = ({ vulnerability, onClick }) => {
  const [isPoCExpanded, setIsPoCExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const severityConfig = theme.severity[vulnerability.severity] || theme.severity.info;

  const handleCopy = (text, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast({
      title: 'Copied!',
      description: 'Content copied to clipboard',
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getCVSSColor = (cvss) => {
    if (cvss >= 9.0) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (cvss >= 7.0) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    if (cvss >= 4.0) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="cursor-pointer rounded-lg border p-4 transition-all hover:shadow-lg"
      style={{
        backgroundColor: severityConfig.bgColor,
        borderColor: severityConfig.borderColor,
        boxShadow:
          vulnerability.severity === 'critical'
            ? `0 0 20px ${severityConfig.color}40`
            : undefined,
      }}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">{vulnerability.title}</h3>
          <div className="flex flex-wrap gap-2">
            <Badge
              className="border font-medium"
              style={{
                backgroundColor: severityConfig.bgColor,
                borderColor: severityConfig.borderColor,
                color: severityConfig.color,
              }}
            >
              {vulnerability.severity.toUpperCase()}
            </Badge>
            {vulnerability.cvss && (
              <Badge className={`border font-mono ${getCVSSColor(vulnerability.cvss)}`}>
                CVSS {vulnerability.cvss}
              </Badge>
            )}
            {vulnerability.exploitability && (
              <Badge variant="outline" className="border-gray-600 text-gray-300">
                {vulnerability.exploitability} Exploitability
              </Badge>
            )}
          </div>
        </div>
        {vulnerability.severity === 'critical' && (
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [1, 0.8, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </motion.div>
        )}
      </div>

      {/* Description */}
      <p className="mb-3 text-sm text-gray-300 leading-relaxed">{vulnerability.description}</p>

      {/* Affected Endpoint */}
      <div className="mb-3 rounded bg-black/40 p-2">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="font-medium">Endpoint:</span>
          <code className="rounded bg-black/60 px-2 py-1 text-cyan-400">
            {vulnerability.method} {vulnerability.affectedEndpoint}
          </code>
        </div>
        {vulnerability.parameter && vulnerability.parameter !== 'N/A' && (
          <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
            <span className="font-medium">Parameter:</span>
            <code className="rounded bg-black/60 px-2 py-1 text-purple-400">
              {vulnerability.parameter}
            </code>
          </div>
        )}
      </div>

      {/* CVE Links */}
      {vulnerability.cve && vulnerability.cve.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-400">CVE:</span>
          {vulnerability.cve.map((cve) => (
            <a
              key={cve}
              href={`https://cve.mitre.org/cgi-bin/cvename.cgi?name=${cve}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-cyan-400 hover:text-cyan-300 underline"
            >
              {cve}
            </a>
          ))}
        </div>
      )}

      {/* Proof of Concept (Collapsible) */}
      {vulnerability.proofOfConcept && (
        <div className="mt-3 border-t border-gray-700 pt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPoCExpanded(!isPoCExpanded);
            }}
            className="flex w-full items-center justify-between text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            <span>Proof of Concept</span>
            {isPoCExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {isPoCExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-2 overflow-hidden"
            >
              <div className="relative">
                <pre className="overflow-x-auto rounded bg-black/60 p-3 text-xs text-gray-300 font-mono">
                  {vulnerability.proofOfConcept}
                </pre>
                <button
                  onClick={(e) => handleCopy(vulnerability.proofOfConcept, e)}
                  className="absolute top-2 right-2 rounded bg-gray-700 p-1.5 hover:bg-gray-600 transition-colors"
                  aria-label="Copy proof of concept"
                >
                  {isCopied ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Action Hint */}
      <div className="mt-3 text-xs text-gray-500 text-center">
        Click for detailed analysis and remediation steps
      </div>
    </motion.div>
  );
};

export default VulnCard;