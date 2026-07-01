import React, { useState, useEffect } from 'react';
import './App.css';
import './styles/cyberpunk.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MagicCursor from './components/MagicCursor';
import NetworkBackground from './components/NetworkBackground';
import ScanHero from './components/ScanHero';
import Dashboard from './components/Dashboard';
import InspectorPanel from './components/InspectorPanel';
import ScanLogStream from './components/ScanLogStream';
import ThreatMeter from './components/ThreatMeter';
import { Toaster } from './components/ui/toaster';


/**
 * Main App Component
 * 
 * Features:
 * - Magic cursor with particle trail
 * - Animated network background
 * - Scan hero with URL input
 * - Live scan log streaming
 * - Animated threat meter
 * - Dashboard with vulnerability cards
 * - Inspector panel for detailed view
 * 
 * DEMO-ONLY: Uses mock data. In production, replace with actual backend API calls.
 */
function App() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [scanLogs, setScanLogs] = useState([]);
  const [selectedVuln, setSelectedVuln] = useState(null);
  const [currentRiskScore, setCurrentRiskScore] = useState(0);

  // Real: Simulate scanning process
  const handleScanStart = async (scanConfig) => {
  setIsScanning(true);
  setScanResults(null);
  setScanLogs([]);
  setCurrentRiskScore(0);

  const url = scanConfig.url;

  try {
    // optional initial UI logs (keeps your UI alive)
    setScanLogs([
      { message: "Connecting to scanner engine...", type: "info" },
      { message: `Target locked: ${url}`, type: "info" }
    ]);

    const response = await fetch("http://127.0.0.1:8000/api/v1/scan/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: url,
        profile: scanConfig.scanType
      })
    });

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Scan failed");
    }

    const data = result.data;

    // ----------------------------
    // 1. LIVE LOGS FROM BACKEND
    // ----------------------------
    const findings = data.report?.findings || [];

    const logs = [];

    logs.push({
      message: `Scan completed in ${data.scan_summary?.response_time_ms}ms`,
      type: "success"
    });

    logs.push({
      message: `Status Code: ${data.scan_summary?.status_code}`,
      type: "info"
    });

    findings.forEach((f) => {
      logs.push({
        message: `${f.source} detected ${f.type}`,
        type: f.severity?.toLowerCase() || "warning"
      });
    });

    setScanLogs(logs);

    // ----------------------------
    // 2. RISK SCORE (REAL)
    // ----------------------------
    setCurrentRiskScore(data.report?.risk_score || 0);

    // ----------------------------
    // 3. DIRECT MAP TO UI (NO CHANGES TO UI NEEDED)
    // ----------------------------
    setScanResults({
      riskScore: data.report?.risk_score,
      vulnerabilities: findings,
      targetUrl: data.target,
      scanSummary: data.scan_summary,
      technologies: data.analysis?.technologies || [],
      raw: data.raw
    });

    setIsScanning(false);

  } catch (err) {
    setScanLogs([
      { message: "Scan failed: " + err.message, type: "error" }
    ]);
    setIsScanning(false);
  }
};

  return (
    <BrowserRouter>
      <div className="relative min-h-screen overflow-x-hidden bg-[#07070A] text-white font-ui">
        {/* Magic Cursor */}
        <MagicCursor />

        {/* Animated Network Background */}
        <NetworkBackground isScanning={isScanning} />

        {/* Toast Notifications */}
        <Toaster />

        <Routes>
          <Route
            path="/"
            element={
              <div className="relative z-10">
                {/* Hero Section */}
                {!scanResults && (
                  <ScanHero onScanStart={handleScanStart} isScanning={isScanning} />
                )}

                {/* Scanning State */}
                {isScanning && (
                  <div className="mx-auto max-w-7xl px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <ScanLogStream logs={scanLogs} isScanning={isScanning} />
                      <ThreatMeter riskScore={currentRiskScore} isScanning={isScanning} />
                    </div>
                  </div>
                )}

                {/* Results Dashboard */}
                {scanResults && !isScanning && (
                  <>
                    <Dashboard scanResults={scanResults} onVulnClick={setSelectedVuln} />
                    
                    {/* Inspector Panel */}
                    {selectedVuln && (
                      <InspectorPanel
                        vulnerability={selectedVuln}
                        onClose={() => setSelectedVuln(null)}
                      />
                    )}
                  </>
                )}
              </div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
