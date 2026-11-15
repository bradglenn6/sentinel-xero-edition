import React, { useState } from 'react';
import { useEngine } from '../../context/EngineContext';
import { ThreatHeatmapVisualizer } from './ThreatHeatmapVisualizer';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  Sliders, 
  CheckCircle2, 
  XCircle, 
  FileWarning, 
  Eye, 
  RefreshCw,
  Terminal,
  Filter
} from 'lucide-react';

export const SentinelSecurityCenter: React.FC = () => {
  const { threats, records, policies, togglePolicy, resolveQuarantine } = useEngine();

  const [selectedThreatId, setSelectedThreatId] = useState<string | null>(
    threats.find(t => t.actionTaken === 'QUARANTINED')?.id || threats[0]?.id || null
  );

  const [overrideNotes, setOverrideNotes] = useState('');
  const [resolutionAction, setResolutionAction] = useState<'approve' | 'sanitize' | 'block'>('approve');

  const selectedThreat = threats.find(t => t.id === selectedThreatId) || threats[0];
  const associatedRecord = records.find(r => r.threatDetails?.id === selectedThreat?.id);

  const quarantinedThreats = threats.filter(t => t.actionTaken === 'QUARANTINED');
  const resolvedThreats = threats.filter(t => t.actionTaken !== 'QUARANTINED');

  const handleResolve = (action: 'approve' | 'sanitize' | 'block') => {
    if (!selectedThreat) return;
    resolveQuarantine(selectedThreat.id, action, overrideNotes);
    setOverrideNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <span>ZeroLabz Serverless Core</span>
          <span aria-hidden="true">/</span>
          <span className="text-cyan-400">Sentinel Security Mesh</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Sentinel Threat & Error Inspection Center
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Real-time deterministic inspection of all inbound financial streams, OCR payloads, and public registries. Sentinel neutralizes injection vectors, detects bank routing deviation (BEC fraud), and prevents sanctioned entities from penetrating Xero ledgers.
        </p>
      </div>

      {/* Security Engine Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Quarantine Desk Queue</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-300 font-mono tabular-nums">
              {quarantinedThreats.length}
            </span>
            <span className="text-xs text-slate-400">cases awaiting dual sign-off</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Active Firewall Invariants</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">
              {policies.filter(p => p.enabled).length} / {policies.length}
            </span>
            <span className="text-xs text-emerald-400">rules enforcing</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Threat Interception Rate</span>
            <Lock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">
              100.0%
            </span>
            <span className="text-xs text-cyan-400">zero ledger leaks</span>
          </div>
        </div>
      </div>

      {/* Real-time Threat Detection D3 Heatmap Visualizer */}
      <ThreatHeatmapVisualizer />

      {/* Quarantine Desk & Threat Resolution Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Threat Queue (5 cols) */}
        <div className="lg:col-span-5 p-5 bg-slate-900/40 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Sentinel Interceptions ({threats.length})</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Live Feed
            </span>
          </div>

          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {threats.map((threat) => {
              const isSelected = threat.id === selectedThreat?.id;
              const isPending = threat.actionTaken === 'QUARANTINED';
              return (
                <div
                  key={threat.id}
                  onClick={() => setSelectedThreatId(threat.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-slate-800/90 border-amber-500/60 shadow-sm' 
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-amber-400">{threat.id}</span>
                    <span className={`text-[11px] font-mono font-medium ${
                      threat.severity === 'critical' ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {threat.severity.toUpperCase()}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-white mb-1">
                    {threat.type.replace('_', ' ')}
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">
                    {threat.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/60">
                    <span>Vector: {threat.vector}</span>
                    <span className={`font-mono font-semibold ${
                      isPending ? 'text-amber-400' : 'text-slate-400'
                    }`}>
                      {threat.actionTaken}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Threat Inspection & Resolution Console (7 cols) */}
        <div className="lg:col-span-7 p-5 bg-slate-900/40 border border-slate-800 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Sentinel Deep Threat Inspector
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Detailed packet payload analysis and mitigation workflow
                </p>
              </div>
              {selectedThreat && (
                <span className="font-mono text-xs text-amber-400 font-bold">
                  {selectedThreat.id}
                </span>
              )}
            </div>

            {selectedThreat ? (
              <div className="space-y-4">
                {/* Threat Summary banner */}
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Detection Signature:</span>
                    <span className="font-mono text-amber-300 font-semibold">{selectedThreat.type}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Confidence Score:</span>
                    <span className="font-mono text-white tabular-nums">
                      {Math.round(selectedThreat.confidenceScore * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Detected Vector:</span>
                    <span className="text-slate-200">{selectedThreat.vector}</span>
                  </div>
                  <div className="text-xs text-slate-300 pt-2 border-t border-slate-800">
                    {selectedThreat.description}
                  </div>
                </div>

                {/* Counterparty & Record context */}
                {associatedRecord && (
                  <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs space-y-1.5">
                    <div className="text-slate-400 font-medium">Associated Ingestion Record:</div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Entity:</span>
                      <strong className="text-white">{associatedRecord.entityName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Claimed Amount:</span>
                      <span className="font-mono text-slate-200 tabular-nums">
                        {associatedRecord.currency} {associatedRecord.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Reference:</span>
                      <span className="font-mono text-slate-300">{associatedRecord.referenceNumber}</span>
                    </div>
                  </div>
                )}

                {/* Raw Payload Inspection Terminal */}
                <div>
                  <div className="text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Raw Packet Payload & Discrepancy Tokens</span>
                  </div>
                  <pre className="font-mono text-[11px] text-cyan-300 bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-x-auto max-h-36">
                    {JSON.stringify(associatedRecord?.rawPayload || {}, null, 2)}
                  </pre>
                </div>

                {/* Resolution Action Panel */}
                {selectedThreat.actionTaken === 'QUARANTINED' ? (
                  <div className="p-4 bg-amber-950/20 border border-amber-800/60 rounded-xl space-y-3">
                    <div className="text-xs font-bold text-amber-200">
                      Sentinel Quarantine Resolution Authority
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Compliance Audit Notes (Recorded into Immutable Ledger):
                      </label>
                      <input
                        type="text"
                        value={overrideNotes}
                        onChange={(e) => setOverrideNotes(e.target.value)}
                        placeholder="e.g. Verified with supplier CFO via recorded line; routing change approved."
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <button
                        onClick={() => handleResolve('approve')}
                        className="py-2 px-3 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer text-center"
                      >
                        Approve & Post to Xero
                      </button>
                      <button
                        onClick={() => handleResolve('sanitize')}
                        className="py-2 px-3 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors cursor-pointer text-center"
                      >
                        Sanitize & Load
                      </button>
                      <button
                        onClick={() => handleResolve('block')}
                        className="py-2 px-3 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors cursor-pointer text-center"
                      >
                        Permanently Block
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-400">
                    This security interception has been resolved with action: <strong className="text-white uppercase">{selectedThreat.actionTaken}</strong>. Verified by: {selectedThreat.reviewedBy || 'Sentinel Automated Security Daemon'}.
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Sentinel Core Security</span>
            <span>Zero-Trust Architecture</span>
          </div>
        </div>
      </div>

      {/* Configurable Security Policy Rules */}
      <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Sentinel Security Invariant Policies</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Configurable firewall rules applied to all incoming data streams in real-time
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {policies.filter(p => p.enabled).length} Active Rules
          </span>
        </div>

        <div className="space-y-3">
          {policies.map((policy) => (
            <div
              key={policy.id}
              className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">{policy.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    [{policy.category}]
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Threshold: <span className="font-mono text-slate-300">{policy.thresholdValue}</span> · Action: <strong className="text-amber-400">{policy.actionOnTrigger}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs font-mono font-medium ${policy.enabled ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {policy.enabled ? 'ENFORCING' : 'DISABLED'}
                </span>
                <button
                  onClick={() => togglePolicy(policy.id)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    policy.enabled ? 'bg-cyan-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      policy.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
