import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Zap, Shield, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from '../hooks/use-toast';

/**
 * ScanHero Component
 * 
 * Main scan interface with:
 * - URL input with validation
 * - Scan type preset selection
 * - Animated scan button with 3 states (idle, scanning, completed)
 * - Legal disclaimer
 * 
 * Security: Input validation prevents local/private IP scanning
 */
const ScanHero = ({ onScanStart, isScanning }) => {
  const [url, setUrl] = useState('');
  const [scanType, setScanType] = useState('full');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  // Validate URL input
  useEffect(() => {
    if (!url) {
      setIsValidUrl(false);
      return;
    }

    try {
      const urlObj = new URL(url.trim());
      
      // Must be http or https
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        setIsValidUrl(false);
        return;
      }

      // SECURITY: Block localhost and private IPs
      const hostname = urlObj.hostname.toLowerCase();
      const privatePatterns = [
        /^localhost$/,
        /^127\.\d+\.\d+\.\d+$/,
        /^10\.\d+\.\d+\.\d+$/,
        /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/,
        /^192\.168\.\d+\.\d+$/,
        /^::1$/,
        /^fe80:/,
      ];

      const isPrivate = privatePatterns.some((pattern) => pattern.test(hostname));
      if (isPrivate) {
        setIsValidUrl(false);
        toast({
          title: 'Private IP Blocked',
          description: 'Scanning private IPs and localhost is not allowed for security.',
          variant: 'destructive',
        });
        return;
      }

      setIsValidUrl(true);
    } catch {
      setIsValidUrl(false);
    }
  }, [url]);

  const handleScan = () => {
    if (!isValidUrl) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL (e.g., https://example.com)',
        variant: 'destructive',
      });
      return;
    }

    onScanStart({ url: url.trim(), scanType });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isValidUrl && !isScanning) {
      handleScan();
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pt-20 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <div className="mb-4 flex items-center justify-center gap-3">
          <Shield className="h-12 w-12 text-[#00E5FF]" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 229, 255, 0.8))' }} />
          <h1 className="font-heading text-5xl font-bold tracking-wide text-white text-glow-cyan">
            CYBERGUARD
          </h1>
        </div>
        <p className="text-xl text-gray-300 tracking-wide">
          Advanced Vulnerability Scanner
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Detect critical security vulnerabilities in real-time
        </p>
      </motion.div>

      {/* Scan Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-panel neon-glow-cyan rounded-2xl p-8"
      >
        {/* Legal Disclaimer */}
        {showDisclaimer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4"
          >
            <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-amber-200">
                <strong>Legal Notice:</strong> Only scan websites you own or have explicit
                permission to test. Unauthorized scanning may be illegal in your jurisdiction.
              </p>
            </div>
            <button
              onClick={() => setShowDisclaimer(false)}
              className="text-amber-400 hover:text-amber-300 text-sm font-medium"
            >
              Got it
            </button>
          </motion.div>
        )}

        {/* Scan Type Selector */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Scan Type
          </label>
          <Select value={scanType} onValueChange={setScanType} disabled={isScanning}>
            <SelectTrigger className="w-full bg-black/40 border-cyan-500/30 text-white focus-neon">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0f0f14] border-cyan-500/30">
              <SelectItem value="quick" className="text-white hover:bg-cyan-500/10">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-cyan-400" />
                  <div>
                    <div className="font-medium">Quick Scan</div>
                    <div className="text-xs text-gray-400">~1-2 min • Basic vulnerabilities</div>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="full" className="text-white hover:bg-cyan-500/10">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-400" />
                  <div>
                    <div className="font-medium">Full Scan</div>
                    <div className="text-xs text-gray-400">~5-10 min • Comprehensive analysis</div>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="authenticated" className="text-white hover:bg-cyan-500/10">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-red-400" />
                  <div>
                    <div className="font-medium">Authenticated Scan</div>
                    <div className="text-xs text-gray-400">~10-15 min • Deep dive with credentials</div>
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* URL Input */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Target URL
          </label>
          <div className="relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="https://example.com"
              disabled={isScanning}
              className="w-full rounded-lg border border-cyan-500/30 bg-black/40 px-4 py-4 pr-12 text-lg text-white placeholder-gray-500 focus-neon transition-all"
              aria-label="Target URL input"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {isValidUrl && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="h-3 w-3 rounded-full bg-green-400"
                  style={{ boxShadow: '0 0 10px rgba(74, 222, 128, 0.8)' }}
                />
              )}
            </div>
          </div>
          {url && !isValidUrl && (
            <p className="mt-2 text-sm text-red-400">Please enter a valid public URL</p>
          )}
        </div>

        {/* Scan Button */}
        <Button
          onClick={handleScan}
          disabled={!isValidUrl || isScanning}
          className="group relative w-full overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 py-6 text-lg font-bold tracking-wide transition-all hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            boxShadow: isValidUrl
              ? '0 0 20px rgba(0, 229, 255, 0.5), 0 0 40px rgba(0, 229, 255, 0.3)'
              : 'none',
          }}
        >
          {isScanning ? (
            <span className="flex items-center justify-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Scanning...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-3">
              <Search className="h-5 w-5" />
              Start Security Scan
            </span>
          )}
          {/* Ripple effect on hover */}
          {!isScanning && (
            <motion.div
              className="absolute inset-0 bg-white/20"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </Button>

        {/* Info Text */}
        <p className="mt-4 text-center text-xs text-gray-500">
          This scanner performs client-side validation only. All scans are executed on
          secure backend servers.
        </p>
      </motion.div>
    </div>
  );
};

export default ScanHero;