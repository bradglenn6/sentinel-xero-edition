import React from 'react';
import { useEngine } from '../../context/EngineContext';
import { 
  Cpu, 
  Server, 
  Zap, 
  Activity, 
  Layers, 
  Globe, 
  Gauge, 
  RefreshCw,
  HardDrive,
  BarChart2
} from 'lucide-react';

export const CloudTopologyView: React.FC = () => {
  const { autoScaling, setTrafficMode, runBatchStressTest, isProcessingBatch } = useEngine();

  const regions = [
    { id: 'us-east-1', name: 'US East (N. Virginia)', status: 'Optimal' },
    { id: 'eu-west-1', name: 'Europe (Ireland)', status: 'Optimal' },
    { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', status: 'Optimal' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>ZeroLabz Serverless Core</span>
            <span aria-hidden="true">/</span>
            <span className="text-cyan-400">Auto-Scaling Cloud Infrastructure</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Elastic Auto-Scaling Cloud Topology
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Multi-region serverless cluster engineered to absorb high traffic surges and large ETL batches with zero cold-start dropouts and sub-second scale-out reaction.
          </p>
        </div>

        {/* Spike test trigger */}
        <button
          onClick={() => runBatchStressTest()}
          disabled={isProcessingBatch}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors cursor-pointer disabled:opacity-50 shadow-md self-start sm:self-auto"
        >
          <Zap className={`w-4 h-4 ${isProcessingBatch ? 'animate-spin' : ''}`} />
          <span>{isProcessingBatch ? 'Traffic Burst Active...' : 'Simulate Traffic Spike (Surge)'}</span>
        </button>
      </div>

      {/* Traffic Profile Selector & Telemetry Banner */}
      <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Current Cloud Traffic Profile & Replicas
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select or simulate traffic spikes to observe real-time Kubernetes/Serverless horizontal pod autoscaling (HPA)
            </p>
          </div>

          <div className="flex items-center gap-2 p-1.5 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              onClick={() => setTrafficMode('normal')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                autoScaling.trafficMode === 'normal'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Normal (450 RPS)
            </button>
            <button
              onClick={() => setTrafficMode('surge')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                autoScaling.trafficMode === 'surge'
                  ? 'bg-cyan-900/60 text-cyan-200 border border-cyan-700/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Surge Spike (4.8k RPS)
            </button>
            <button
              onClick={() => setTrafficMode('extreme')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
                autoScaling.trafficMode === 'extreme'
                  ? 'bg-amber-900/60 text-amber-200 border border-amber-700/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Extreme Burst (24.8k RPS)
            </button>
          </div>
        </div>

        {/* Cluster Vital Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
            <div className="text-[11px] text-slate-400 mb-1">Active Replicas</div>
            <div className="text-xl font-bold text-white font-mono tabular-nums">
              {autoScaling.activeWorkers} / {autoScaling.maxWorkers}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1">Scale-Out Ready</div>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
            <div className="text-[11px] text-slate-400 mb-1">Total Throughput</div>
            <div className="text-xl font-bold text-cyan-400 font-mono tabular-nums">
              {autoScaling.currentRps.toLocaleString()} <span className="text-xs font-normal text-slate-400">req/s</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Target: {autoScaling.targetRps.toLocaleString()}</div>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
            <div className="text-[11px] text-slate-400 mb-1">Queue Buffer Lag</div>
            <div className="text-xl font-bold text-amber-400 font-mono tabular-nums">
              {autoScaling.queueDepth} <span className="text-xs font-normal text-slate-400">msgs</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Kafka Ingestion Lag</div>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg">
            <div className="text-[11px] text-slate-400 mb-1">P95 End-to-End Latency</div>
            <div className="text-xl font-bold text-white font-mono tabular-nums">
              {autoScaling.p95LatencyMs} <span className="text-xs font-normal text-slate-400">ms</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1">Within &lt;500ms SLA</div>
          </div>
        </div>
      </div>

      {/* Regional Pod Cluster Map */}
      <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">
              Multi-Region Serverless Execution Mesh
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            3 Active Regions · 100% Availability
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {regions.map((reg) => {
            const regionalNodes = autoScaling.nodes.filter(n => n.region === reg.id);
            const avgCpu = regionalNodes.length > 0 
              ? Math.round(regionalNodes.reduce((acc, n) => acc + n.cpuUtilization, 0) / regionalNodes.length)
              : 0;

            return (
              <div key={reg.id} className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-semibold text-white">{reg.name}</h3>
                    <span className="text-[10px] font-mono text-cyan-400">{reg.id}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">
                    {reg.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Replicas in Zone:</span>
                    <strong className="text-white font-mono tabular-nums">{regionalNodes.length} pods</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Zone Mean CPU:</span>
                    <strong className="text-slate-200 font-mono tabular-nums">{avgCpu}%</strong>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${avgCpu > 70 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                      style={{ width: `${avgCpu}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Serverless Pod Grid */}
      <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">
              Individual Worker Replicas ({autoScaling.nodes.length} Instances)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Real-time Pod Health & Memory Allocation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[440px] overflow-y-auto pr-1">
          {autoScaling.nodes.map((node) => (
            <div
              key={node.id}
              className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg space-y-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-cyan-300 truncate">
                  {node.id}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="space-y-1 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Region:</span>
                  <span className="font-mono text-slate-300">{node.region}</span>
                </div>
                <div className="flex justify-between">
                  <span>CPU Usage:</span>
                  <span className="font-mono text-slate-200 tabular-nums">{node.cpuUtilization}%</span>
                </div>
                <div className="flex justify-between">
                  <span>RAM Used:</span>
                  <span className="font-mono text-slate-200 tabular-nums">{node.memoryUsageMb} MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Req:</span>
                  <span className="font-mono text-cyan-400 tabular-nums">{node.activeRequests} / s</span>
                </div>
              </div>

              <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-cyan-500 h-full"
                  style={{ width: `${Math.min(100, node.cpuUtilization)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
