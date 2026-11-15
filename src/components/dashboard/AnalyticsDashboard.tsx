import React, { useState } from 'react';
import { useEngine } from '../../context/EngineContext';
import { 
  BarChart3, 
  ArrowUpRight, 
  ShieldCheck, 
  ShieldAlert, 
  Cpu, 
  Zap, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Server,
  FileText,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const { 
    records, 
    publicRecords, 
    threats, 
    autoScaling, 
    setTrafficMode, 
    setActiveTab, 
    runBatchStressTest, 
    isProcessingBatch 
  } = useEngine();

  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const totalRecords = records.length;
  const loadedCount = records.filter(r => r.status === 'loaded').length;
  const quarantinedCount = threats.filter(t => t.actionTaken === 'QUARANTINED').length;
  const blockedCount = threats.filter(t => t.actionTaken === 'BLOCKED').length;
  const successPercent = totalRecords > 0 ? ((loadedCount / totalRecords) * 100).toFixed(1) : '100.0';

  const selectedRecord = records.find(r => r.id === selectedRecordId) || records[0];

  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>ZeroLabz Serverless Core</span>
            <span aria-hidden="true">/</span>
            <span>Real-time Sentinel Mesh</span>
            <span aria-hidden="true">/</span>
            <span className="text-cyan-400">Telemetry & Analytics</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Xero ETL Engine & Sentinel Security Command
          </h1>
        </div>

        {/* Traffic Spike & Scaling Control Bar */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-lg">
          <span className="text-xs font-medium text-slate-400 px-2">Traffic Load:</span>
          <button
            onClick={() => setTrafficMode('normal')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
              autoScaling.trafficMode === 'normal'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Baseline (450 req/s)
          </button>
          <button
            onClick={() => setTrafficMode('surge')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
              autoScaling.trafficMode === 'surge'
                ? 'bg-cyan-900/60 text-cyan-200 border border-cyan-700/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Surge Spike (4.8k req/s)
          </button>
          <button
            onClick={() => setTrafficMode('extreme')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
              autoScaling.trafficMode === 'extreme'
                ? 'bg-amber-900/60 text-amber-200 border border-amber-700/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Extreme Peak (24.8k req/s)
          </button>
        </div>
      </div>

      {/* KPI Grid (Single-Elevation Flat Surfaces) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Throughput & Ingestion</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">
              {autoScaling.currentRps.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">req / sec</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Serverless Pods</span>
            <span className="text-slate-200 font-mono tabular-nums">{autoScaling.activeWorkers} active replicas</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Xero ETL Reconciliation</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">
              {successPercent}%
            </span>
            <span className="text-xs text-emerald-400">verified</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Ledger Postings</span>
            <span className="text-slate-200 font-mono tabular-nums">{loadedCount} / {totalRecords} records</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Sentinel Interceptions</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-300 font-mono tabular-nums">
              {quarantinedCount + blockedCount}
            </span>
            <span className="text-xs text-amber-400">threats neutralised</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Quarantine Desk</span>
            <button 
              onClick={() => setActiveTab('sentinel-security')}
              className="text-cyan-400 hover:underline font-mono tabular-nums cursor-pointer"
            >
              {quarantinedCount} pending review →
            </button>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>P95 Pipeline Latency</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">
              {autoScaling.p95LatencyMs}
            </span>
            <span className="text-xs text-slate-400">ms (E2E)</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
            <span>Kafka Ingestion Buffer</span>
            <span className="text-slate-200 font-mono tabular-nums">{autoScaling.queueDepth} queued</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Telemetry Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Ingestion & Auto-Scaling Curve (2 Cols) */}
        <div className="lg:col-span-2 p-5 bg-slate-900/40 border border-slate-800 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Real-time Ingestion Velocity & Cloud Capacity
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dynamic auto-scaling engine response across multi-region serverless nodes
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-cyan-400" />
                  <span>Throughput (RPS)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 bg-emerald-400 border-dashed border-b" />
                  <span>Replicas Scale</span>
                </div>
              </div>
            </div>

            {/* SVG Visual Waveform / Scaler Chart */}
            <div className="h-52 w-full bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 relative flex flex-col justify-between overflow-hidden">
              {/* Grid Lines */}
              <div className="absolute inset-0 grid grid-rows-4 grid-cols-6 pointer-events-none opacity-10">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="border-b border-r border-slate-500" />
                ))}
              </div>

              {/* Dynamic SVG Curves */}
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 160">
                <defs>
                  <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Simulated wave based on traffic mode */}
                {autoScaling.trafficMode === 'normal' && (
                  <>
                    <path
                      d="M0,120 Q50,115 100,125 T200,118 T300,122 T400,115 T500,120 L500,160 L0,160 Z"
                      fill="url(#cyanGrad)"
                    />
                    <path
                      d="M0,120 Q50,115 100,125 T200,118 T300,122 T400,115 T500,120"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M0,130 Q100,130 250,130 T500,130"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                  </>
                )}
                {autoScaling.trafficMode === 'surge' && (
                  <>
                    <path
                      d="M0,120 Q60,110 120,70 T240,55 T360,65 T480,50 L500,50 L500,160 L0,160 Z"
                      fill="url(#cyanGrad)"
                    />
                    <path
                      d="M0,120 Q60,110 120,70 T240,55 T360,65 T480,50 L500,50"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M0,130 Q100,120 180,75 T320,68 T500,60"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                  </>
                )}
                {autoScaling.trafficMode === 'extreme' && (
                  <>
                    <path
                      d="M0,110 Q40,90 90,30 T180,20 T300,18 T420,24 T500,20 L500,160 L0,160 Z"
                      fill="url(#cyanGrad)"
                    />
                    <path
                      d="M0,110 Q40,90 90,30 T180,20 T300,18 T420,24 T500,20"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3"
                    />
                    <path
                      d="M0,125 Q50,100 120,38 T260,25 T400,22 T500,22"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                    />
                  </>
                )}
              </svg>

              {/* Real-time Annotations */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-900 z-10">
                <span>T-30m</span>
                <span>T-20m</span>
                <span>T-10m</span>
                <span>T-5m</span>
                <span className="text-cyan-400">Live (Now)</span>
              </div>
            </div>
          </div>

          {/* Cloud Auto-Scaling Summary Bar */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
            <div className="flex items-center gap-4">
              <span>Cluster Status: <strong className="text-emerald-400 font-medium">Nominal</strong></span>
              <span>Regional Replicas: <strong className="text-white font-mono tabular-nums">{autoScaling.activeWorkers} / {autoScaling.maxWorkers}</strong></span>
              <span>Memory Footprint: <strong className="text-slate-300 font-mono tabular-nums">{(autoScaling.activeWorkers * 240 / 1024).toFixed(2)} GB</strong></span>
            </div>
            <button
              onClick={() => setActiveTab('cloud-scaling')}
              className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              View Cloud Topology <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sentinel Real-Time Threat Vector Radar (1 Col) */}
        <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Sentinel Threat Radar
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Inspection breakdown of incoming data packets
                </p>
              </div>
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>

            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Clean & Auto-Reconciled</span>
                  <span className="font-mono text-emerald-400 tabular-nums">96.8%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: '96.8%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">IBAN Drift / Bank Account Deviation</span>
                  <span className="font-mono text-amber-400 tabular-nums">1.8%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full" style={{ width: '1.8%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">Sanctions / PEP Match</span>
                  <span className="font-mono text-rose-400 tabular-nums">0.9%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full" style={{ width: '0.9%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300">SQLi / Hostile Payload Injection</span>
                  <span className="font-mono text-purple-400 tabular-nums">0.5%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full" style={{ width: '0.5%' }} />
                </div>
              </div>
            </div>

            <div className="mt-5 p-3 bg-slate-950/80 border border-slate-800/80 rounded-lg text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Active Protection Invariant</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Sentinel blocks schema drift and bank routing shifts before payloads reach the Xero accounting API or public databases.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <button
              onClick={() => setActiveTab('sentinel-security')}
              className="w-full py-2 px-3 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-center cursor-pointer"
            >
              Manage Security Policies & Quarantined Items
            </button>
          </div>
        </div>
      </div>

      {/* Live Pipeline Activity Table & Record Inspector */}
      <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Live Ingestion & ETL Activity Stream
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Inspecting incoming transactions, OCR parsed bills, and statutory public filings
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('data-entry')}
              className="px-3 py-1.5 text-xs font-medium bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 transition-colors whitespace-nowrap cursor-pointer"
            >
              + Ingest New Record
            </button>
            <button
              onClick={() => setActiveTab('etl-pipeline')}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              Inspect ETL Stages
            </button>
          </div>
        </div>

        {/* Dense Data Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="py-2.5 px-3">Record ID</th>
                <th className="py-2.5 px-3">Entity & Tax ID</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Source</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3">Sentinel Security Status</th>
                <th className="py-2.5 px-3">Latency</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {records.slice(0, 6).map((rec) => {
                const isSelected = rec.id === selectedRecord.id;
                return (
                  <tr 
                    key={rec.id}
                    onClick={() => setSelectedRecordId(rec.id)}
                    className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                      isSelected ? 'bg-slate-800/60' : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-mono text-cyan-400 whitespace-nowrap">
                      {rec.id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-200">{rec.entityName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{rec.entityTaxId}</div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-slate-300 capitalize">
                      {rec.type.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-slate-400">
                      {rec.source}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-medium text-slate-100 tabular-nums whitespace-nowrap">
                      {rec.currency} {rec.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {rec.status === 'loaded' && (
                        <span className="text-emerald-400 font-medium inline-flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Reconciled into Xero</span>
                        </span>
                      )}
                      {rec.status === 'quarantined' && (
                        <span className="text-amber-400 font-medium inline-flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Quarantined by Sentinel</span>
                        </span>
                      )}
                      {rec.status === 'rejected' && (
                        <span className="text-rose-400 font-medium inline-flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Blocked (Threat)</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400 tabular-nums">
                      {rec.latencyMs}ms
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecordId(rec.id);
                        }}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Record Drawer / Detail View */}
        {selectedRecord && (
          <div className="mt-4 p-4 bg-slate-950/80 border border-slate-800 rounded-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-cyan-400 font-bold">{selectedRecord.id}</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-200 font-medium">{selectedRecord.entityName}</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-400">{selectedRecord.referenceNumber}</span>
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Batch: {selectedRecord.batchId}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Raw Payload Section */}
              <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-md">
                <div className="text-slate-400 font-medium mb-1.5">Stage 1: Raw Ingress Payload</div>
                <pre className="font-mono text-[11px] text-slate-300 bg-slate-950 p-2 rounded overflow-x-auto max-h-36">
                  {JSON.stringify(selectedRecord.rawPayload, null, 2)}
                </pre>
              </div>

              {/* Sentinel Security Scan */}
              <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-md">
                <div className="text-slate-400 font-medium mb-1.5">Stage 2: Sentinel Security Evaluation</div>
                {selectedRecord.threatDetails ? (
                  <div className="space-y-1.5 text-[11px]">
                    <div className="text-rose-400 font-medium">
                      Vector: {selectedRecord.threatDetails.type}
                    </div>
                    <p className="text-slate-300 leading-snug">
                      {selectedRecord.threatDetails.description}
                    </p>
                    <div className="pt-1 text-slate-400">
                      Confidence: <strong className="text-white font-mono">{Math.round(selectedRecord.threatDetails.confidenceScore * 100)}%</strong>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-emerald-400 space-y-1">
                    <div className="flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Security Invariants Passed</span>
                    </div>
                    <p className="text-slate-400">
                      No SQLi, IBAN deviation, or OFAC sanctions detected. Passed Sentinel WAF.
                    </p>
                  </div>
                )}
              </div>

              {/* Xero Ledger Mapping */}
              <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-md">
                <div className="text-slate-400 font-medium mb-1.5">Stage 3: Xero Ledger Mapping</div>
                {selectedRecord.xeroMapping ? (
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Account Code:</span>
                      <span className="font-mono text-cyan-300">{selectedRecord.xeroMapping.accountCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Account Name:</span>
                      <span className="text-slate-200">{selectedRecord.xeroMapping.accountName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tax Type:</span>
                      <span className="font-mono text-slate-300">{selectedRecord.xeroMapping.taxType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Reconciled:</span>
                      <span className="text-emerald-400 font-medium">True</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400">
                    Not loaded into Xero ledger (Status: {selectedRecord.status}). {selectedRecord.quarantineReason}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
