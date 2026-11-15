import React from 'react';
import { useEngine } from '../context/EngineContext';
import { TabType } from '../types';
import { ShieldAlert, Zap, Server, Activity } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, autoScaling, threats, runBatchStressTest, isProcessingBatch } = useEngine();
  const quarantinedCount = threats.filter(t => t.actionTaken === 'QUARANTINED').length;

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">
      {/* Zone 1: Brand Wordmark (Single text element) */}
      <div className="flex items-center gap-6">
        <a 
          href="#dashboard" 
          onClick={(e) => { e.preventDefault(); setActiveTab('overview'); }}
          className="text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors whitespace-nowrap"
        >
          ZeroLabz Sentinel
        </a>
        
        {/* Subtle status indicator with text - no pill container */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
          <span>Serverless Xero Core</span>
          <span aria-hidden="true">·</span>
          <span className="text-slate-300 font-mono tabular-nums">{autoScaling.currentRps.toLocaleString()} req/s</span>
          <span aria-hidden="true">·</span>
          <span className="text-slate-300 font-mono tabular-nums">{autoScaling.activeWorkers} active pods</span>
        </div>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-400" aria-label="Main Navigation">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-slate-800 text-white'
              : 'hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          Analytics & Engine
        </button>
        <button
          onClick={() => setActiveTab('data-entry')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'data-entry'
              ? 'bg-slate-800 text-white'
              : 'hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          Automated Entry & Ingest
        </button>
        <button
          onClick={() => setActiveTab('etl-pipeline')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'etl-pipeline'
              ? 'bg-slate-800 text-white'
              : 'hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          ETL Normalizer
        </button>
        <button
          onClick={() => setActiveTab('public-records')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'public-records'
              ? 'bg-slate-800 text-white'
              : 'hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          Public Records Registry
        </button>
        <button
          onClick={() => setActiveTab('sentinel-security')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap relative ${
            activeTab === 'sentinel-security'
              ? 'bg-slate-800 text-white'
              : 'hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <span>Sentinel Threat Center</span>
          {quarantinedCount > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[10px] font-mono tabular-nums">
              {quarantinedCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('cloud-scaling')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'cloud-scaling'
              ? 'bg-slate-800 text-white'
              : 'hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          Auto-Scale Topology
        </button>
        <button
          onClick={() => setActiveTab('audit-logs')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'audit-logs'
              ? 'bg-slate-800 text-white'
              : 'hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          Audit Ledger
        </button>
      </nav>

      {/* Zone 3: Primary Actions & User Profile */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => runBatchStressTest()}
          disabled={isProcessingBatch}
          title="Simulate high traffic burst to trigger automatic cloud scaling"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 rounded-lg hover:bg-cyan-600/30 transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer"
        >
          <Zap className={`w-3.5 h-3.5 ${isProcessingBatch ? 'animate-spin' : ''}`} />
          <span>{isProcessingBatch ? 'Surging Traffic...' : 'Spike Test'}</span>
        </button>

        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-700 bg-slate-800 shrink-0">
            <img
              src="/src/assets/images/avatar_security_lead_1791289452936.jpg"
              alt="Security Lead"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // styled fallback container if image load errors
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-medium text-slate-200 leading-none">Security Ops</p>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-none">ZeroLabz Cloud</p>
          </div>
        </div>
      </div>
    </header>
  );
};
