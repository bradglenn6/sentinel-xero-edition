import React, { useState } from 'react';
import { useEngine } from '../../context/EngineContext';
import { IngestionRecord } from '../../types';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowRight, 
  Sparkles, 
  Copy, 
  RefreshCw,
  FileCheck
} from 'lucide-react';

export const DataEntryStudio: React.FC = () => {
  const { runDataIngestion } = useEngine();

  const [formData, setFormData] = useState({
    type: 'invoice' as IngestionRecord['type'],
    entityName: 'OmniNet Cloud Technologies Inc',
    entityTaxId: 'US-991823719',
    referenceNumber: 'INV-2026-7741',
    amount: 18450.00,
    currency: 'USD',
    source: 'OCR Upload' as IngestionRecord['source'],
    iban: 'US89CHAS12345678901234',
    memo: 'Enterprise serverless compute cluster hosting and data replication fees.'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastProcessed, setLastProcessed] = useState<IngestionRecord | null>(null);

  const presets = [
    {
      title: 'Clean Vendor Invoice (Nominal)',
      subtitle: 'Verified vendor, valid tax ID, matches Xero chart',
      type: 'invoice' as const,
      entityName: 'Stripe Global Services UK',
      entityTaxId: 'GB-198273645',
      referenceNumber: `INV-STRIPE-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: 4320.00,
      currency: 'GBP',
      source: 'OCR Upload' as const,
      iban: 'GB29NWBK60161331926819',
      memo: 'Payment gateway API processing and dispute handling fees for September 2026.'
    },
    {
      title: 'BEC Fraud Simulation (Altered IBAN)',
      subtitle: 'Vendor routing swapped to offshore Cyprus account',
      type: 'bill' as const,
      entityName: 'Apex Data Telemetry AG',
      entityTaxId: 'DE-491029388',
      referenceNumber: `BILL-URGENT-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: 38900.00,
      currency: 'EUR',
      source: 'Webhook' as const,
      iban: 'CY28002001950000357001234567',
      memo: 'URGENT: Please notice our banking destination has been updated to new overseas treasury.'
    },
    {
      title: 'SQLi Malicious Payload',
      subtitle: 'Hostile SQL syntax inside unstructured memo line',
      type: 'bill' as const,
      entityName: 'DevNull Systems',
      entityTaxId: 'US-000000000',
      referenceNumber: `EXPLOIT-TEST-${Math.floor(100 + Math.random() * 900)}`,
      amount: 150000.00,
      currency: 'USD',
      source: 'Webhook' as const,
      iban: 'US000000000000000000',
      memo: "'; DROP TABLE xero_journal_entries; SELECT * FROM audit_logs; --"
    },
    {
      title: 'SEC Statutory Public Record',
      subtitle: 'Form 10-Q filing ingestion for automated entity ledger sync',
      type: 'public_filing' as const,
      entityName: 'Nvidia Corp (Corporate Filing)',
      entityTaxId: 'US-943008949',
      referenceNumber: 'SEC-10Q-NVDA-2026',
      amount: 280000000.00,
      currency: 'USD',
      source: 'Public Records API' as const,
      iban: 'US12FEDWIRE998811',
      memo: 'Quarterly statutory balance sheet and capitalization disclosure.'
    }
  ];

  const handleApplyPreset = (p: typeof presets[0]) => {
    setFormData({
      type: p.type,
      entityName: p.entityName,
      entityTaxId: p.entityTaxId,
      referenceNumber: p.referenceNumber,
      amount: p.amount,
      currency: p.currency,
      source: p.source,
      iban: p.iban,
      memo: p.memo
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await runDataIngestion(formData);
      setLastProcessed(result);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
          <span>ZeroLabz Serverless Xero Engine</span>
          <span aria-hidden="true">/</span>
          <span className="text-cyan-400">Automated Data Entry & Ingestion</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Automated Data Entry & Intelligent Document Processing
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Ingest financial documents, OCR receipts, webhook feeds, and public filings into the ZeroLabz pipeline. The Sentinel security layer inspects every byte in real-time before syncing to Xero ledgers.
        </p>
      </div>

      {/* Preset Quick Selectors */}
      <div>
        <div className="text-xs font-semibold text-slate-400 mb-3">
          QUICK TEST PRESETS & THREAT SIMULATIONS
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="p-3 text-left bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-lg transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-white group-hover:text-cyan-400 transition-colors">
                  {preset.title}
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  {preset.currency}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">
                {preset.subtitle}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Ingestion Studio Form & Live Execution Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column (7 Cols) */}
        <div className="lg:col-span-7 p-5 bg-slate-900/40 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-cyan-400" />
              <span>Data Ingress Parameters</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Source: {formData.source}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Document / Record Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="invoice">Customer Invoice (Accounts Receivable)</option>
                  <option value="bill">Supplier Bill (Accounts Payable)</option>
                  <option value="bank_tx">Bank Transaction Feed</option>
                  <option value="public_filing">Public Record Regulatory Filing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Ingestion Source Channel
                </label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="OCR Upload">OCR Upload (Automated Document Scanner)</option>
                  <option value="Webhook">Webhook API (ERP / CRM Integration)</option>
                  <option value="Bank Feed">Live Bank Feed (Open Banking API)</option>
                  <option value="Public Records API">Public Records Ingestion Harvester</option>
                  <option value="Manual Feed">Manual Portal Entry</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Counterparty Entity Name
                </label>
                <input
                  type="text"
                  value={formData.entityName}
                  onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-sans"
                  placeholder="e.g. Apex Data Telemetry AG"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tax Registration / VAT / EIN
                </label>
                <input
                  type="text"
                  value={formData.entityTaxId}
                  onChange={(e) => setFormData({ ...formData, entityTaxId: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                  placeholder="e.g. DE-491029388"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Reference / Invoice #
                </label>
                <input
                  type="text"
                  value={formData.referenceNumber}
                  onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="SGD">SGD (S$)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Banking Routing / IBAN
              </label>
              <input
                type="text"
                value={formData.iban}
                onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                placeholder="IBAN or wire instruction"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Line Items / Unstructured Memo Field (Sentinel Inspected)
              </label>
              <textarea
                rows={3}
                value={formData.memo}
                onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                placeholder="Description, notes, or raw payload text..."
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Ingestion & Sentinel Scan...</span>
                  </>
                ) : (
                  <>
                    <span>Execute Automated Ingestion Pipeline</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Execution Output & Pipeline Stage Tracer (5 Cols) */}
        <div className="lg:col-span-5 p-5 bg-slate-900/40 border border-slate-800 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>ZeroLabz Pipeline Tracer</span>
              </h2>
              <span className="text-xs text-slate-400">Real-time Hook</span>
            </div>

            {/* Stages Visual Progression */}
            <div className="space-y-3 mb-5">
              <div className="flex items-start gap-3 p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Extract & Ingress Normalization</div>
                  <div className="text-[11px] text-slate-400">
                    Schema verification, OCR parsing, character sanitization
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Sentinel Threat & Fraud Mesh</div>
                  <div className="text-[11px] text-slate-400">
                    SQLi check, IBAN account drift, sanctions screening
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Xero Ledger ETL & Posting</div>
                  <div className="text-[11px] text-slate-400">
                    Automatic tax calculation, chart-of-accounts journal sync
                  </div>
                </div>
              </div>
            </div>

            {/* Ingestion Result Box */}
            {lastProcessed ? (
              <div className={`p-4 rounded-xl border ${
                lastProcessed.status === 'loaded'
                  ? 'bg-emerald-950/30 border-emerald-800/80'
                  : lastProcessed.status === 'quarantined'
                    ? 'bg-amber-950/30 border-amber-800/80'
                    : 'bg-rose-950/30 border-rose-800/80'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {lastProcessed.status === 'loaded' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : lastProcessed.status === 'quarantined' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    ) : (
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                    )}
                    <span className="text-xs font-bold text-white uppercase tracking-wide">
                      {lastProcessed.status === 'loaded' ? 'Ingestion Complete' : lastProcessed.status.toUpperCase()}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-slate-300">
                    {lastProcessed.latencyMs}ms
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="text-slate-300">
                    Record ID: <strong className="font-mono text-cyan-300">{lastProcessed.id}</strong>
                  </div>
                  <div className="text-slate-300">
                    Entity: <strong>{lastProcessed.entityName}</strong>
                  </div>

                  {lastProcessed.xeroMapping && (
                    <div className="mt-2 pt-2 border-t border-emerald-900/60 text-[11px] text-emerald-200">
                      Sync to Xero Account: <strong>#{lastProcessed.xeroMapping.accountCode} ({lastProcessed.xeroMapping.accountName})</strong>
                    </div>
                  )}

                  {lastProcessed.threatDetails && (
                    <div className="mt-2 pt-2 border-t border-amber-900/60 text-[11px] text-amber-200">
                      <strong>Sentinel Alert:</strong> {lastProcessed.threatDetails.description}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl text-center text-xs text-slate-400 py-6">
                Click <strong>"Execute Automated Ingestion Pipeline"</strong> to run an automated batch or choose a threat simulation preset above.
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Serverless Ingestion Engine</span>
            <span>Zero Data Loss SLA · 99.99%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
