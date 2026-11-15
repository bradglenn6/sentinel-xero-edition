import React, { useState } from 'react';
import { useEngine } from '../../context/EngineContext';
import { 
  History, 
  Search, 
  Filter, 
  ShieldCheck, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Info,
  Copy,
  Check
} from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useEngine();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLogs = auditLogs.filter(log => {
    const matchesSev = severityFilter === 'all' ? true : log.severity === severityFilter;
    const matchesSearch = 
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.targetResource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.checksum.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesSearch;
  });

  const handleCopyChecksum = (logId: string, checksum: string) => {
    navigator.clipboard.writeText(checksum);
    setCopiedId(logId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(auditLogs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zerolabz_audit_ledger_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>ZeroLabz Serverless Core</span>
            <span aria-hidden="true">/</span>
            <span className="text-cyan-400">Activity Logging & Compliance</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Immutable Audit Ledger & Activity History
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Cryptographically sealed SHA-256 audit trail documenting every user interaction, automated ETL transformation, security quarantine decision, and auto-scaling adjustment.
          </p>
        </div>

        <button
          onClick={handleExportJson}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Audit Log (JSON)</span>
        </button>
      </div>

      {/* Trust & Invariant Banner */}
      <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="font-semibold text-white">Cryptographic Chain of Custody Active</div>
            <div className="text-slate-400">Zero-knowledge tamper detection: all state mutations verified with HMAC/SHA-256 checksums.</div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px] shrink-0">
          <span>Total Log Entries: <strong className="text-white tabular-nums">{auditLogs.length}</strong></span>
          <span>Hash Algorithm: <strong className="text-cyan-400">SHA-256</strong></span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by actor, action type, resource, or SHA-256 checksum..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Severities</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="security">Security</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Detailed Activity Logs Table */}
      <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="py-2.5 px-3">Timestamp (UTC)</th>
                <th className="py-2.5 px-3">Actor & Role</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Target Resource</th>
                <th className="py-2.5 px-3">Details</th>
                <th className="py-2.5 px-3 font-mono">SHA-256 Checksum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredLogs.map((log) => {
                const isCopied = copiedId === log.id;
                return (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-400 whitespace-nowrap tabular-nums">
                      {log.timestamp.replace('T', ' ').replace('Z', '')}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-200">{log.actor}</div>
                      <div className="text-[11px] text-slate-400">{log.role}</div>
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`font-mono text-[11px] font-semibold ${
                        log.severity === 'critical' 
                          ? 'text-rose-400' 
                          : log.severity === 'security'
                            ? 'text-amber-400'
                            : log.severity === 'warning'
                              ? 'text-amber-300'
                              : 'text-cyan-400'
                      }`}>
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-300 whitespace-nowrap max-w-[200px] truncate">
                      {log.targetResource}
                    </td>

                    <td className="py-3 px-3 text-slate-400 max-w-[320px] leading-relaxed">
                      {log.details}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                        <span className="truncate max-w-[110px]" title={log.checksum}>
                          {log.checksum.slice(0, 14)}...
                        </span>
                        <button
                          onClick={() => handleCopyChecksum(log.id, log.checksum)}
                          title="Copy full cryptographic checksum"
                          className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
