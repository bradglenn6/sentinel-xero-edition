import React from 'react';
import { EngineProvider, useEngine } from './context/EngineContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AnalyticsDashboard } from './components/dashboard/AnalyticsDashboard';
import { DataEntryStudio } from './components/ingestion/DataEntryStudio';
import { EtlPipelineView } from './components/etl/EtlPipelineView';
import { PublicRecordsExplorer } from './components/public-records/PublicRecordsExplorer';
import { SentinelSecurityCenter } from './components/sentinel/SentinelSecurityCenter';
import { CloudTopologyView } from './components/cloud/CloudTopologyView';
import { AuditLogsView } from './components/audit/AuditLogsView';

const MainContent: React.FC = () => {
  const { activeTab } = useEngine();

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
      <div className="max-w-7xl mx-auto space-y-6">
        {activeTab === 'overview' && <AnalyticsDashboard />}
        {activeTab === 'data-entry' && <DataEntryStudio />}
        {activeTab === 'etl-pipeline' && <EtlPipelineView />}
        {activeTab === 'public-records' && <PublicRecordsExplorer />}
        {activeTab === 'sentinel-security' && <SentinelSecurityCenter />}
        {activeTab === 'cloud-scaling' && <CloudTopologyView />}
        {activeTab === 'audit-logs' && <AuditLogsView />}

        {/* Quiet Clean Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div>
            <span>ZeroLabz Serverless Core</span>
            <span className="mx-2">·</span>
            <span>Sentinel Security Layer</span>
            <span className="mx-2">·</span>
            <span>Xero Automated Integration</span>
          </div>
          <div>
            <span>SOC 2 Type II Certified</span>
            <span className="mx-2">·</span>
            <span>Autonomous Cloud Scale-Out</span>
          </div>
        </footer>
      </div>
    </main>
  );
};

export default function App() {
  return (
    <EngineProvider>
      <div className="min-h-screen h-full flex flex-col bg-slate-950 text-slate-100 font-sans">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </EngineProvider>
  );
}
