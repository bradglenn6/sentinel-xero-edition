import React, { useState } from 'react';
import { useEngine } from '../../context/EngineContext';
import { PublicRecord } from '../../types';
import { 
  Building2, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  RefreshCw, 
  Plus, 
  ShieldCheck, 
  FileText,
  UserCheck
} from 'lucide-react';

export const PublicRecordsExplorer: React.FC = () => {
  const { publicRecords, syncPublicRecordToXero, addPublicRecord } = useEngine();

  const [searchQuery, setSearchQuery] = useState('');
  const [jurisdictionFilter, setJurisdictionFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New record form state
  const [newRecordForm, setNewRecordForm] = useState({
    entityName: '',
    taxId: '',
    jurisdiction: 'United States (SEC EDGAR)',
    incorporationDate: '2020-01-01',
    registryNumber: '',
    status: 'Active / Good Standing' as PublicRecord['status'],
    filingType: 'SEC Form 10-Q' as PublicRecord['filingType'],
    filingDate: new Date().toISOString().split('T')[0],
    officers: 'Jane Doe (Director)',
    riskScore: 'Low' as PublicRecord['riskScore']
  });

  const filteredRecords = publicRecords.filter(rec => {
    const matchesSearch = 
      rec.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.taxId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.registryNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesJur = jurisdictionFilter === 'all' ? true : rec.jurisdiction.includes(jurisdictionFilter);
    return matchesSearch && matchesJur;
  });

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    addPublicRecord({
      entityName: newRecordForm.entityName,
      taxId: newRecordForm.taxId,
      jurisdiction: newRecordForm.jurisdiction,
      incorporationDate: newRecordForm.incorporationDate,
      registryNumber: newRecordForm.registryNumber,
      status: newRecordForm.status,
      filingType: newRecordForm.filingType,
      filingDate: newRecordForm.filingDate,
      officers: newRecordForm.officers.split(',').map(s => s.trim()),
      riskScore: newRecordForm.riskScore
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>ZeroLabz Serverless Core</span>
            <span aria-hidden="true">/</span>
            <span className="text-cyan-400">Public Records & Entity Verification</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Corporate Public Records & Entity Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Live ingestion from SEC EDGAR, UK Companies House, EU Business Registers, and UCC lien databases. Cross-references counterparties to prevent billing fraud and syncs verified vendor profiles to Xero.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ingest Public Filing</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by company name, Tax ID, SEC CIK, or registration number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={jurisdictionFilter}
            onChange={(e) => setJurisdictionFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Jurisdictions</option>
            <option value="United States">United States (SEC / Delaware)</option>
            <option value="United Kingdom">United Kingdom (Companies House)</option>
            <option value="Germany">Germany (Handelsregister)</option>
            <option value="Singapore">Singapore (ACRA)</option>
            <option value="Norway">Norway (Brønnøysund)</option>
          </select>
        </div>
      </div>

      {/* Public Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecords.map((rec) => (
          <div
            key={rec.id}
            className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="font-mono text-[10px] text-cyan-400 tracking-wider">
                    {rec.id}
                  </span>
                  <h3 className="text-sm font-semibold text-white leading-snug mt-0.5">
                    {rec.entityName}
                  </h3>
                </div>
                
                {/* Risk Score Indicator (unboxed text style) */}
                <div className="text-right shrink-0">
                  <div className={`text-[11px] font-mono font-medium ${
                    rec.riskScore === 'Low'
                      ? 'text-emerald-400'
                      : rec.riskScore === 'Medium'
                        ? 'text-amber-400'
                        : 'text-rose-400'
                  }`}>
                    {rec.riskScore} Risk
                  </div>
                </div>
              </div>

              {/* Entity metadata */}
              <div className="space-y-1.5 text-xs text-slate-400 my-3">
                <div className="flex justify-between">
                  <span>Jurisdiction:</span>
                  <span className="text-slate-200 font-medium text-right truncate max-w-[170px]">
                    {rec.jurisdiction}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Registration #:</span>
                  <span className="font-mono text-slate-300">{rec.registryNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Registration:</span>
                  <span className="font-mono text-slate-300">{rec.taxId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Statutory Filing:</span>
                  <span className="text-slate-200">{rec.filingType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Legal Status:</span>
                  <span className={`font-medium ${
                    rec.status === 'Active / Good Standing' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {rec.status}
                  </span>
                </div>
              </div>

              {/* Registered Officers preview */}
              <div className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Verified Legal Officers:</span>
                </div>
                <ul className="text-slate-300 space-y-0.5 pl-4 list-disc">
                  {rec.officers.slice(0, 2).map((off, idx) => (
                    <li key={idx} className="truncate">{off}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sync to Xero Action */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div className="text-[11px] text-slate-400">
                {rec.syncedToXero ? (
                  <span className="text-emerald-400 font-medium inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Synced to Xero</span>
                  </span>
                ) : (
                  <span className="text-slate-400">Not in Xero Contact Book</span>
                )}
              </div>

              {!rec.syncedToXero ? (
                <button
                  onClick={() => syncPublicRecordToXero(rec.id)}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium rounded-md transition-colors cursor-pointer"
                >
                  Sync to Xero
                </button>
              ) : (
                <span className="text-[11px] font-mono text-slate-400">
                  Verified
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Public Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-sm font-bold text-white">Ingest New Statutory Public Record</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Entity Name</label>
                <input
                  type="text"
                  required
                  value={newRecordForm.entityName}
                  onChange={(e) => setNewRecordForm({ ...newRecordForm, entityName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  placeholder="e.g. Apex Global Engineering Inc"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tax ID / VAT</label>
                  <input
                    type="text"
                    required
                    value={newRecordForm.taxId}
                    onChange={(e) => setNewRecordForm({ ...newRecordForm, taxId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono"
                    placeholder="US-12345678"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Registry / CIK #</label>
                  <input
                    type="text"
                    required
                    value={newRecordForm.registryNumber}
                    onChange={(e) => setNewRecordForm({ ...newRecordForm, registryNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white font-mono"
                    placeholder="CIK-00019283"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Jurisdiction</label>
                  <input
                    type="text"
                    required
                    value={newRecordForm.jurisdiction}
                    onChange={(e) => setNewRecordForm({ ...newRecordForm, jurisdiction: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Filing Type</label>
                  <select
                    value={newRecordForm.filingType}
                    onChange={(e) => setNewRecordForm({ ...newRecordForm, filingType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  >
                    <option value="SEC Form 10-Q">SEC Form 10-Q</option>
                    <option value="SEC Form 8-K">SEC Form 8-K</option>
                    <option value="Companies House Annual">Companies House Annual</option>
                    <option value="UCC-1 Lien">UCC-1 Lien</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Verified Officers (comma separated)</label>
                <input
                  type="text"
                  value={newRecordForm.officers}
                  onChange={(e) => setNewRecordForm({ ...newRecordForm, officers: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  placeholder="e.g. John Doe (CEO), Alice Vance (CFO)"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg"
                >
                  Save & Ingest Public Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
