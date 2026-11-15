import React from 'react';
import { useEngine } from '../context/EngineContext';
import { TabType } from '../types';
import { 
  BarChart3, 
  FileSpreadsheet, 
  Workflow, 
  Building2, 
  ShieldCheck, 
  Cpu, 
  History,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, autoScaling, threats, records } = useEngine();

  const quarantinedCount = threats.filter(t => t.actionTaken === 'QUARANTINED').length;
  const loadedCount = records.filter(r => r.status === 'loaded').length;

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    {
      id: 'overview',
      label: 'Analytics & Overview',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'data-entry',
      label: 'Automated Data Entry',
      icon: <FileSpreadsheet className="w-4 h-4" />,
      badge: 'OCR & API'
    },
    {
      id: 'etl-pipeline',
      label: 'ETL Pipeline & Ledgers',
      icon: <Workflow className="w-4 h-4" />,
      badge: `${loadedCount} synced`
    },
    {
      id: 'public-records',
      label: 'Public Records Registry',
      icon: <Building2 className="w-4 h-4" />,
      badge: 'SEC / Cos House'
    },
    {
      id: 'sentinel-security',
      label: 'Sentinel Threat Center',
      icon: <ShieldCheck className="w-4 h-4" />,
      badge: quarantinedCount > 0 ? `${quarantinedCount} alert` : undefined
    },
    {
      id: 'cloud-scaling',
      label: 'Auto-Scaling Cloud',
      icon: <Cpu className="w-4 h-4" />,
      badge: `${autoScaling.activeWorkers} pods`
    },
    {
      id: 'audit-logs',
      label: 'Audit & Activity Logs',
      icon: <History className="w-4 h-4" />,
      badge: 'SHA-256'
    }
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col justify-between shrink-0 hidden md:flex">
      <div className="p-4 space-y-6">
        {/* Navigation Category */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 tracking-wider">
            CORE PLATFORM
          </div>
          <nav className="space-y-1" aria-label="Sidebar Navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'bg-slate-800/90 text-white border border-slate-700/60'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
                      item.id === 'sentinel-security' && quarantinedCount > 0
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800/80 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Live System Architecture Mini-HUD */}
        <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">ZeroLabz Architecture</span>
            <span className="text-emerald-400 font-mono text-[11px]">ACTIVE</span>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between text-slate-400">
              <span>Cloud Region Mesh</span>
              <span className="text-slate-300 font-mono">3 Multi-Zone</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Sentinel Security</span>
              <span className="text-emerald-300 font-mono">Real-time WAF</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Xero Ledger Connector</span>
              <span className="text-cyan-300 font-mono">Sync Nominal</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>Auto-Scale Load Buffer</span>
              <span className="font-mono text-slate-300 tabular-nums">
                {Math.round((autoScaling.activeWorkers / autoScaling.maxWorkers) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  autoScaling.trafficMode === 'extreme' 
                    ? 'bg-amber-400' 
                    : autoScaling.trafficMode === 'surge' 
                      ? 'bg-cyan-400' 
                      : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.max(10, Math.round((autoScaling.activeWorkers / autoScaling.maxWorkers) * 100))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Footer info */}
      <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>ZeroLabz Enterprise Standard</span>
        </div>
        <p className="leading-relaxed text-slate-400">
          SOC 2 Type II Certified · Immutable SHA-256 Ledger Audit
        </p>
      </div>
    </aside>
  );
};
