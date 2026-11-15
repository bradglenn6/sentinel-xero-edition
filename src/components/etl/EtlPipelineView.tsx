import React, { useState } from 'react';
import { useEngine } from '../../context/EngineContext';
import { 
  Workflow, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  Database, 
  ArrowRight,
  Filter,
  RefreshCw,
  Search,
  Code
} from 'lucide-react';

export const EtlPipelineView: React.FC = () => {
  const { records, setActiveTab } = useEngine();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string>(records[0]?.id || '');

  const filteredRecords = records.filter(r => {
    const matchesFilter = filterStatus === 'all' ? true : r.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      r.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const selectedRecord = records.find(r => r.id === selectedJobId) || records[0];

  const mappingRules = [
    {
      sourceField: 'document.subtotal',
      rule: 'Multi-Currency FX API Normalization to Base Ledger',
      targetField: 'Xero.LineItems.UnitAmount',
      status: 'Active'
    },
    {
      sourceField: 'document.tax',
      rule: 'Autonomous Tax Jurisdiction Code Resolver (VAT / GST / Sales Tax)',
      targetField: 'Xero.LineItems.TaxType',
      status: 'Active'
    },
    {
      sourceField: 'document.vendor',
      rule: 'Public Registry CIK / Companies House Entity Reconciliation',
      targetField: 'Xero.Contact.ContactID',
      status: 'Active'
    },
    {
      sourceField: 'document.description',
      rule: 'Sentinel Invariant Sanitizer + PII Masking Engine',
      targetField: 'Xero.LineItems.Description',
      status: 'Active'
    },
    {
      sourceField: 'document.accountCode',
      rule: 'Chart-of-Accounts Automatic Category ML Predictor',
      targetField: 'Xero.LineItems.AccountCode',
      status: 'Active'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <span>ZeroLabz Serverless Core</span>
          <span aria-hidden="true">/</span>
          <span className="text-cyan-400">ETL Pipeline & Ledgers</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Automated ETL Pipeline & Xero Normalizer
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Automates the end-to-end data integration lifecycle: Extracting unstructured financial feeds, validating schemas against Sentinel invariants, transforming currency & tax types, and loading reconciled journals directly into Xero.
        </p>
      </div>

      {/* Field Mapping Transformation Matrix */}
      <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">
              ZeroLabz Xero Transformation & Normalization Matrix
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            5 Invariant Rules Loaded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-medium">
                <th className="py-2.5 px-3">Ingested Source Field</th>
                <th className="py-2.5 px-3">ETL Transformation Logic</th>
                <th className="py-2.5 px-3">Destination Xero Schema</th>
                <th className="py-2.5 px-3 text-right">Pipeline Gate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {mappingRules.map((rule, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-mono text-cyan-400">
                    {rule.sourceField}
                  </td>
                  <td className="py-2.5 px-3 text-slate-200">
                    <span className="inline-flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-slate-400" />
                      <span>{rule.rule}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-emerald-400">
                    {rule.targetField}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="text-[11px] font-mono text-emerald-400">
                      {rule.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Jobs Table & Job Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Jobs List (7 cols) */}
        <div className="lg:col-span-7 p-5 bg-slate-900/40 border border-slate-800 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Workflow className="w-4 h-4 text-cyan-400" />
              <span>ETL Ingestion Batches ({filteredRecords.length})</span>
            </h2>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                  filterStatus === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('loaded')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                  filterStatus === 'loaded' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Loaded
              </button>
              <button
                onClick={() => setFilterStatus('quarantined')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                  filterStatus === 'quarantined' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Quarantined
              </button>
              <button
                onClick={() => setFilterStatus('rejected')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                  filterStatus === 'rejected' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Rejected
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search batch by entity, record ID, or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Records list */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredRecords.map((rec) => {
              const isSelected = rec.id === selectedJobId;
              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedJobId(rec.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-slate-800/80 border-cyan-500/50 shadow-sm' 
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">{rec.id}</span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs font-semibold text-white">{rec.entityName}</span>
                    </div>
                    <span className="font-mono text-xs text-slate-200 tabular-nums">
                      {rec.currency} {rec.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="capitalize">{rec.type.replace('_', ' ')}</span>
                      <span aria-hidden="true">·</span>
                      <span>Ref: {rec.referenceNumber}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {rec.status === 'loaded' && (
                        <span className="text-emerald-400 font-medium inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Reconciled</span>
                        </span>
                      )}
                      {rec.status === 'quarantined' && (
                        <span className="text-amber-400 font-medium inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Quarantined</span>
                        </span>
                      )}
                      {rec.status === 'rejected' && (
                        <span className="text-rose-400 font-medium inline-flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" />
                          <span>Blocked</span>
                        </span>
                      )}
                      <span className="font-mono text-slate-400 tabular-nums">{rec.latencyMs}ms</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected ETL Pipeline Trace View (5 cols) */}
        <div className="lg:col-span-5 p-5 bg-slate-900/40 border border-slate-800 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-sm font-semibold text-white">
                ETL Pipeline Detailed Execution Graph
              </h2>
              <span className="font-mono text-xs text-cyan-400">
                {selectedRecord?.id}
              </span>
            </div>

            {selectedRecord ? (
              <div className="space-y-4">
                {/* Stage 1: Extraction */}
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">Phase 1: Extract (Ingress)</span>
                    <span className="text-[11px] font-mono text-emerald-400">COMPLETED</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Ingested from {selectedRecord.source} with source reference {selectedRecord.referenceNumber}.
                  </p>
                </div>

                {/* Stage 2: Sentinel Inspection */}
                <div className={`p-3 rounded-lg border ${
                  selectedRecord.threatDetails 
                    ? 'bg-amber-950/20 border-amber-800/80' 
                    : 'bg-slate-950/80 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">Phase 2: Sentinel Threat Scan</span>
                    <span className={`text-[11px] font-mono ${
                      selectedRecord.threatDetails ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {selectedRecord.threatDetails ? 'FLAGGED' : 'PASSED'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {selectedRecord.threatDetails 
                      ? selectedRecord.threatDetails.description 
                      : 'Zero-day SQLi, schema anomaly, and OFAC sanctions screening nominal.'}
                  </p>
                </div>

                {/* Stage 3: Transformation */}
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">Phase 3: Transform (Schema)</span>
                    <span className="text-[11px] font-mono text-emerald-400">
                      {selectedRecord.transformedData ? 'NORMALIZED' : 'BYPASSED'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2">
                    Normalized against ISO-4217 currency specifications and statutory tax codes.
                  </p>
                  {selectedRecord.transformedData && (
                    <pre className="font-mono text-[10px] text-cyan-300 bg-slate-900 p-2 rounded max-h-24 overflow-x-auto">
                      {JSON.stringify(selectedRecord.transformedData, null, 2)}
                    </pre>
                  )}
                </div>

                {/* Stage 4: Load to Xero */}
                <div className={`p-3 rounded-lg border ${
                  selectedRecord.status === 'loaded' 
                    ? 'bg-slate-950/80 border-slate-800' 
                    : 'bg-slate-950/40 border-slate-800/60 opacity-70'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">Phase 4: Load (Xero Sync)</span>
                    <span className={`text-[11px] font-mono ${
                      selectedRecord.status === 'loaded' ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                      {selectedRecord.status === 'loaded' ? 'COMMITTED' : 'HELD'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {selectedRecord.xeroMapping ? (
                      <>Mapped to Xero Chart Account <strong>#{selectedRecord.xeroMapping.accountCode}</strong> with tax code <strong>{selectedRecord.xeroMapping.taxType}</strong>.</>
                    ) : (
                      'Record not posted to ledger due to pending Sentinel security clearance.'
                    )}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <button
              onClick={() => setActiveTab('data-entry')}
              className="w-full py-2 px-3 text-xs font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-800/60 rounded-lg transition-colors text-center cursor-pointer"
            >
              Feed New Document into Pipeline →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
