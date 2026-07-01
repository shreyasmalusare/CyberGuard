import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Shield,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { toast } from '../hooks/use-toast';
import theme from '../config/theme';

/**
 * InspectorPanel Component
 * 
 * Right-side detailed vulnerability inspector with:
 * - Full vulnerability details
 * - CVE references with external links
 * - Remediation steps
 * - Risk impact analysis
 * - Request/Response snippets
 * - Mark as mitigated toggle
 * - Export individual report
 */
const InspectorPanel = ({ vulnerability, onClose }) => {
  const [isMitigated, setIsMitigated] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!vulnerability) return null;

  const severityConfig = theme.severity[vulnerability.severity] || theme.severity.info;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast({
      title: 'Copied!',
      description: 'Content copied to clipboard',
    });
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleMarkMitigated = () => {
    setIsMitigated(!isMitigated);
    toast({
      title: isMitigated ? 'Marked as Active' : 'Marked as Mitigated',
      description: isMitigated
        ? 'Vulnerability marked as active'
        : 'Vulnerability marked as mitigated',
    });
  };

  const handleExportReport = () => {
    const blob = new Blob([JSON.stringify(vulnerability, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vuln-${vulnerability.id}.json`;
    a.click();
    toast({
      title: 'Exported',
      description: 'Vulnerability report exported',
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 z-50 h-screen w-full md:w-[600px] glass-panel border-l border-cyan-500/20 shadow-2xl"
        style={{ backdropFilter: 'blur(20px)' }}
      >
        <ScrollArea className="h-full">
          <div className="p-6">
            {/* Header */}
            <div className="mb-6 flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
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
                    <Badge className="border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 font-mono">
                      CVSS {vulnerability.cvss}
                    </Badge>
                  )}
                  {isMitigated && (
                    <Badge className="border border-green-500/30 bg-green-500/10 text-green-400">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Mitigated
                    </Badge>
                  )}
                </div>
                <h2 className="font-heading text-2xl font-bold text-white">
                  {vulnerability.title}
                </h2>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Actions */}
            <div className="mb-6 flex gap-2">
              <Button
                onClick={handleMarkMitigated}
                variant="outline"
                size="sm"
                className={`flex-1 ${
                  isMitigated
                    ? 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                    : 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
                }`}
              >
                {isMitigated ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mitigated
                  </>
                ) : (
                  <>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Mark as Mitigated
                  </>
                )}
              </Button>
              <Button
                onClick={handleExportReport}
                variant="outline"
                size="sm"
                className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
              >
                <FileText className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>

            <Separator className="my-6 bg-gray-700" />

            {/* Description */}
            <section className="mb-6">
              <h3 className="mb-2 font-heading text-lg font-semibold text-white">Description</h3>
              <p className="text-gray-300 leading-relaxed">{vulnerability.description}</p>
            </section>

            <Separator className="my-6 bg-gray-700" />

            {/* Affected Component */}
            <section className="mb-6">
              <h3 className="mb-2 font-heading text-lg font-semibold text-white">
                Affected Component
              </h3>
              <div className="rounded-lg bg-black/60 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-400">Endpoint:</span>
                  <code className="text-cyan-400">
                    {vulnerability.method} {vulnerability.affectedEndpoint}
                  </code>
                </div>
                {vulnerability.parameter && vulnerability.parameter !== 'N/A' && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-400">Parameter:</span>
                    <code className="text-purple-400">{vulnerability.parameter}</code>
                  </div>
                )}
              </div>
            </section>

            <Separator className="my-6 bg-gray-700" />

            {/* Risk Impact */}
            <section className="mb-6">
              <h3 className="mb-2 font-heading text-lg font-semibold text-white">Risk Impact</h3>
              <div
                className="rounded-lg border p-4"
                style={{
                  backgroundColor: severityConfig.bgColor,
                  borderColor: severityConfig.borderColor,
                }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Shield className="h-5 w-5" style={{ color: severityConfig.color }} />
                  <span className="font-medium" style={{ color: severityConfig.color }}>
                    {vulnerability.exploitability} Exploitability
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{vulnerability.impact}</p>
              </div>
            </section>

            <Separator className="my-6 bg-gray-700" />

            {/* Remediation */}
            <section className="mb-6">
              <h3 className="mb-2 font-heading text-lg font-semibold text-white">
                Remediation Steps
              </h3>
              <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-4">
                <p className="text-gray-300 text-sm leading-relaxed">
                  {vulnerability.remediation}
                </p>
              </div>
            </section>

            <Separator className="my-6 bg-gray-700" />

            {/* Proof of Concept */}
            {vulnerability.proofOfConcept && (
              <section className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-heading text-lg font-semibold text-white">
                    Proof of Concept
                  </h3>
                  <button
                    onClick={() => handleCopy(vulnerability.proofOfConcept)}
                    className="rounded p-1.5 hover:bg-gray-700 transition-colors"
                    aria-label="Copy proof of concept"
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <pre className="overflow-x-auto rounded-lg bg-black/60 p-4 text-xs text-gray-300 font-mono">
                  {vulnerability.proofOfConcept}
                </pre>
              </section>
            )}

            {/* CVE References */}
            {vulnerability.cve && vulnerability.cve.length > 0 && (
              <section className="mb-6">
                <h3 className="mb-2 font-heading text-lg font-semibold text-white">
                  CVE References
                </h3>
                <div className="space-y-2">
                  {vulnerability.cve.map((cve) => (
                    <a
                      key={cve}
                      href={`https://cve.mitre.org/cgi-bin/cvename.cgi?name=${cve}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg bg-black/60 p-3 text-cyan-400 hover:bg-black/80 transition-colors"
                    >
                      <span className="font-mono">{cve}</span>
                      <ExternalLink className="ml-auto h-4 w-4" />
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* External References */}
            {vulnerability.references && vulnerability.references.length > 0 && (
              <section className="mb-6">
                <h3 className="mb-2 font-heading text-lg font-semibold text-white">
                  External References
                </h3>
                <div className="space-y-2">
                  {vulnerability.references.map((ref, index) => (
                    <a
                      key={index}
                      href={ref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg bg-black/60 p-3 text-purple-400 hover:bg-black/80 transition-colors text-sm"
                    >
                      <span className="flex-1 truncate">{ref}</span>
                      <ExternalLink className="h-4 w-4 flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Metadata */}
            <section>
              <h3 className="mb-2 font-heading text-lg font-semibold text-white">Metadata</h3>
              <div className="rounded-lg bg-black/60 p-4 text-sm">
                <div className="mb-2 flex justify-between">
                  <span className="text-gray-400">Vulnerability ID:</span>
                  <code className="text-gray-300">{vulnerability.id}</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Detected:</span>
                  <span className="text-gray-300">
                    {new Date(vulnerability.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
      </motion.div>
    </AnimatePresence>
  );
};

export default InspectorPanel;