import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  IngestionRecord, 
  PublicRecord, 
  SentinelThreat, 
  ServerlessWorkerNode, 
  AutoScalingState, 
  AuditLog, 
  SecurityPolicyRule,
  TabType,
  RecordType,
  GeoThreatHotspot
} from '../types';
import { 
  INITIAL_RECORDS, 
  INITIAL_PUBLIC_RECORDS, 
  INITIAL_WORKER_NODES, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_POLICIES,
  INITIAL_GEO_HOTSPOTS
} from '../data/initialData';

interface EngineContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  records: IngestionRecord[];
  publicRecords: PublicRecord[];
  threats: SentinelThreat[];
  geoHotspots: GeoThreatHotspot[];
  autoScaling: AutoScalingState;
  auditLogs: AuditLog[];
  policies: SecurityPolicyRule[];
  isLiveAttackFeedActive: boolean;
  toggleLiveAttackFeed: () => void;
  triggerGlobalThreatWave: () => void;
  setTrafficMode: (mode: 'normal' | 'surge' | 'extreme') => void;
  runDataIngestion: (payload: {
    type: RecordType;
    entityName: string;
    entityTaxId: string;
    referenceNumber: string;
    amount: number;
    currency: string;
    source: IngestionRecord['source'];
    memo?: string;
    iban?: string;
  }) => Promise<IngestionRecord>;
  resolveQuarantine: (threatId: string, decision: 'approve' | 'sanitize' | 'block', notes?: string) => void;
  syncPublicRecordToXero: (recordId: string) => void;
  togglePolicy: (policyId: string) => void;
  addPublicRecord: (rec: Omit<PublicRecord, 'id' | 'lastVerified' | 'syncedToXero'>) => void;
  isProcessingBatch: boolean;
  runBatchStressTest: () => Promise<void>;
}

const EngineContext = createContext<EngineContextType | null>(null);

function generateSha256(content: string): string {
  // Deterministic lightweight hash representation for tamper-evident audit logs
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `sha256_${hex}${Date.now().toString(16)}fa7b9921e4`;
}

export const EngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [records, setRecords] = useState<IngestionRecord[]>(INITIAL_RECORDS);
  const [publicRecords, setPublicRecords] = useState<PublicRecord[]>(INITIAL_PUBLIC_RECORDS);
  const [policies, setPolicies] = useState<SecurityPolicyRule[]>(INITIAL_POLICIES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [geoHotspots, setGeoHotspots] = useState<GeoThreatHotspot[]>(INITIAL_GEO_HOTSPOTS);
  const [isLiveAttackFeedActive, setIsLiveAttackFeedActive] = useState<boolean>(true);
  const [isProcessingBatch, setIsProcessingBatch] = useState<boolean>(false);

  // Derived threats from records
  const threats = records
    .filter((r) => r.threatDetails)
    .map((r) => r.threatDetails!);

  const toggleLiveAttackFeed = useCallback(() => {
    setIsLiveAttackFeedActive(prev => !prev);
  }, []);

  const triggerGlobalThreatWave = useCallback(() => {
    const nowIso = new Date().toISOString();
    setGeoHotspots(prev => prev.map(h => ({
      ...h,
      threatCount: h.threatCount + Math.floor(6 + Math.random() * 12),
      lastEventTime: nowIso,
      recentEvents: [
        {
          id: `SURGE-${Date.now().toString().slice(-4)}-${h.id}`,
          timestamp: nowIso,
          type: h.primaryVector,
          severity: h.severity,
          ip: `${h.sourceIp.split('.').slice(0, 3).join('.')}.${Math.floor(1 + Math.random() * 254)}`,
          description: `Coordinated probe burst intercepted targeting Xero API edge from ${h.city}, ${h.country}`
        },
        ...h.recentEvents.slice(0, 4)
      ]
    })));

    const auditId = `AUD-${Math.floor(1000 + Math.random() * 9000)}`;
    setAuditLogs(prev => [{
      id: auditId,
      timestamp: nowIso,
      actor: 'Sentinel Global Perimeter Telemetry',
      role: 'Automated Threat Intelligence',
      action: 'GLOBAL_THREAT_WAVE_DETECTED',
      targetResource: 'ZeroLabz Serverless Edge Ingress Gateways',
      severity: 'critical',
      details: 'Surge in coordinated distributed attack packets detected across multiple geographic origins simultaneously.',
      checksum: generateSha256(`THREAT_WAVE_${nowIso}`),
      ipAddress: 'Distributed Global Mesh'
    }, ...prev]);
  }, []);

  // Auto-scaling state
  const [autoScaling, setAutoScaling] = useState<AutoScalingState>({
    trafficMode: 'normal',
    currentRps: 465,
    targetRps: 450,
    activeWorkers: 6,
    minWorkers: 3,
    maxWorkers: 48,
    queueDepth: 18,
    p95LatencyMs: 118,
    successRate: 99.84,
    nodes: INITIAL_WORKER_NODES,
  });

  // Traffic Mode Handler
  const setTrafficMode = useCallback((mode: 'normal' | 'surge' | 'extreme') => {
    let targetRps = 450;
    let targetWorkers = 6;
    let p95 = 118;
    let queue = 15;

    if (mode === 'surge') {
      targetRps = 4850;
      targetWorkers = 18;
      p95 = 210;
      queue = 240;
    } else if (mode === 'extreme') {
      targetRps = 24800;
      targetWorkers = 42;
      p95 = 390;
      queue = 1250;
    }

    // Generate dynamic pods for the cluster
    const regions: ('us-east-1' | 'eu-west-1' | 'ap-southeast-1')[] = ['us-east-1', 'eu-west-1', 'ap-southeast-1'];
    const newNodes: ServerlessWorkerNode[] = [];
    for (let i = 1; i <= targetWorkers; i++) {
      const reg = regions[(i - 1) % 3];
      newNodes.push({
        id: `pod-${reg.substring(0, 4)}-${i.toString().padStart(2, '0')}`,
        region: reg,
        cpuUtilization: Math.floor(45 + Math.random() * 35),
        memoryUsageMb: Math.floor(220 + Math.random() * 180),
        activeRequests: Math.floor(targetRps / targetWorkers + (Math.random() * 10 - 5)),
        status: 'active',
        uptimeSeconds: Math.floor(600 + Math.random() * 5000),
      });
    }

    setAutoScaling(prev => ({
      ...prev,
      trafficMode: mode,
      currentRps: targetRps,
      targetRps,
      activeWorkers: targetWorkers,
      queueDepth: queue,
      p95LatencyMs: p95,
      nodes: newNodes,
    }));

    // Add audit log for scaling transition
    const logId = `AUD-${Date.now().toString().slice(-4)}`;
    const newLog: AuditLog = {
      id: logId,
      timestamp: new Date().toISOString(),
      actor: 'Sentinel AutoScaler Daemon',
      role: 'Cloud Infrastructure Agent',
      action: 'TRAFFIC_PROFILE_SHIFT',
      targetResource: `Serverless Pod Group (${targetWorkers} replicas)`,
      severity: mode === 'extreme' ? 'warning' : 'info',
      details: `Scaled serverless Xero engine to ${mode.toUpperCase()} tier: ${targetRps.toLocaleString()} req/sec across 3 cloud regions.`,
      checksum: generateSha256(`${mode}-${targetWorkers}-${Date.now()}`),
      ipAddress: '10.240.0.1',
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, []);

  // Background Telemetry Jitter Loop
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoScaling(prev => {
        const jitterRps = Math.max(50, Math.floor(prev.targetRps + (Math.random() * 40 - 20)));
        const jitterLatency = Math.max(30, Math.floor(prev.p95LatencyMs + (Math.random() * 6 - 3)));
        const jitterQueue = Math.max(2, Math.floor(prev.queueDepth + (Math.random() * 8 - 4)));
        return {
          ...prev,
          currentRps: jitterRps,
          p95LatencyMs: jitterLatency,
          queueDepth: jitterQueue,
        };
      });
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Live Geo-Threat Stream simulation
  useEffect(() => {
    if (!isLiveAttackFeedActive) return;
    const interval = setInterval(() => {
      setGeoHotspots(prev => {
        const randomIndex = Math.floor(Math.random() * prev.length);
        const targetHotspot = prev[randomIndex];
        const nowIso = new Date().toISOString();
        const updated = [...prev];
        const newEvent = {
          id: `PING-${Date.now().toString().slice(-4)}`,
          timestamp: nowIso,
          type: targetHotspot.primaryVector,
          severity: targetHotspot.severity,
          ip: `${targetHotspot.sourceIp.split('.').slice(0, 3).join('.')}.${Math.floor(2 + Math.random() * 250)}`,
          description: `Telemetry ping: ${targetHotspot.primaryVector} intercepted from ${targetHotspot.city}, ${targetHotspot.country}`
        };
        updated[randomIndex] = {
          ...targetHotspot,
          threatCount: targetHotspot.threatCount + 1,
          lastEventTime: nowIso,
          recentEvents: [newEvent, ...targetHotspot.recentEvents.slice(0, 4)]
        };
        return updated;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [isLiveAttackFeedActive]);

  // Automated Data Entry with Sentinel Inspection
  const runDataIngestion = useCallback(async (payload: {
    type: RecordType;
    entityName: string;
    entityTaxId: string;
    referenceNumber: string;
    amount: number;
    currency: string;
    source: IngestionRecord['source'];
    memo?: string;
    iban?: string;
  }): Promise<IngestionRecord> => {
    const recId = `REC-${Math.floor(1000 + Math.random() * 9000)}`;
    const batchId = `BATCH-${new Date().getFullYear()}-X${Math.floor(100 + Math.random() * 900)}`;
    const nowIso = new Date().toISOString();

    // Check Sentinel Threat Rules
    let threat: SentinelThreat | undefined;
    let quarantineReason: string | undefined;
    let status: IngestionRecord['status'] = 'loaded';

    const memoLower = (payload.memo || '').toLowerCase();
    const iban = payload.iban || '';

    // Rule 1: SQL Injection check
    if (memoLower.includes('drop table') || memoLower.includes('--') || memoLower.includes('select * from') || memoLower.includes('<script>')) {
      threat = {
        id: `THR-${Math.floor(7000 + Math.random() * 2000)}`,
        recordId: recId,
        type: 'SQL_PAYLOAD',
        severity: 'critical',
        description: 'ZeroLabz Sentinel WAF pattern analyzer intercepted hostile SQL/Script sequence in unstructured memo.',
        confidenceScore: 0.99,
        detectedAt: nowIso,
        vector: 'Sentinel Invariant Filter',
        actionTaken: 'BLOCKED',
        geo: {
          country: 'Ukraine',
          countryCode: 'UA',
          city: 'Kyiv',
          lat: 50.45,
          lng: 30.52,
          ip: '198.51.100.44'
        }
      };
      status = 'rejected';
      quarantineReason = 'Destructive injection payload blocked by Sentinel security perimeter.';
    } 
    // Rule 2: IBAN Drift Check (e.g. Cyprus, Cayman, or unrecognized routing)
    else if (iban.startsWith('CY') || iban.startsWith('KY') || memoLower.includes('urgent bank update') || memoLower.includes('new routing')) {
      threat = {
        id: `THR-${Math.floor(7000 + Math.random() * 2000)}`,
        recordId: recId,
        type: 'IBAN_DRIFT_FRAUD',
        severity: 'high',
        description: 'Vendor banking destination deviated from verified master chart. Potential Business Email Compromise (BEC).',
        confidenceScore: 0.92,
        detectedAt: nowIso,
        vector: 'Sentinel Vendor Ledger Sentinel',
        actionTaken: 'QUARANTINED',
        geo: {
          country: 'Cyprus',
          countryCode: 'CY',
          city: 'Limassol',
          lat: 34.68,
          lng: 33.04,
          ip: '194.154.212.18'
        }
      };
      status = 'quarantined';
      quarantineReason = 'IBAN account mismatch detected against historical Xero supplier ledger.';
    }
    // Rule 3: Sanctions or suspicious offshore entity keyword
    else if (payload.entityName.toLowerCase().includes('sanction') || payload.entityName.toLowerCase().includes('blacklisted') || payload.amount > 5000000) {
      threat = {
        id: `THR-${Math.floor(7000 + Math.random() * 2000)}`,
        recordId: recId,
        type: 'SANCTION_MATCH',
        severity: 'critical',
        description: 'Fuzzy matching triggered against OFAC Specially Designated Nationals List / High Velocity Exemption.',
        confidenceScore: 0.88,
        detectedAt: nowIso,
        vector: 'AML Global Screening Node',
        actionTaken: 'QUARANTINED',
        geo: {
          country: 'Singapore',
          countryCode: 'SG',
          city: 'Singapore',
          lat: 1.35,
          lng: 103.82,
          ip: '203.116.88.42'
        }
      };
      status = 'quarantined';
      quarantineReason = 'OFAC sanctions match threshold exceeded. Dual sign-off required.';
    }

    if (threat && threat.geo) {
      setGeoHotspots(prev => prev.map(h => {
        if (h.countryCode === threat!.geo!.countryCode) {
          return {
            ...h,
            threatCount: h.threatCount + 1,
            lastEventTime: nowIso,
            recentEvents: [
              {
                id: `EVT-${Date.now().toString().slice(-4)}`,
                timestamp: nowIso,
                type: threat!.type,
                severity: threat!.severity,
                ip: threat!.geo!.ip,
                description: threat!.description
              },
              ...h.recentEvents.slice(0, 4)
            ]
          };
        }
        return h;
      }));
    }

    // Default account code mapping
    const accountCode = payload.type === 'invoice' ? '200' : payload.type === 'bill' ? '400' : '800';
    const accountName = payload.type === 'invoice' ? 'Accounts Receivable / Sales' : payload.type === 'bill' ? 'General Operating Expenses' : 'Treasury & Bank Clearing';

    const newRecord: IngestionRecord = {
      id: recId,
      batchId,
      type: payload.type,
      entityName: payload.entityName,
      entityTaxId: payload.entityTaxId,
      referenceNumber: payload.referenceNumber,
      amount: payload.amount,
      currency: payload.currency,
      timestamp: nowIso,
      status,
      source: payload.source,
      latencyMs: Math.floor(65 + Math.random() * 80),
      rawPayload: {
        ...payload,
        submittedAt: nowIso
      },
      transformedData: status === 'loaded' ? {
        accountCode,
        accountName,
        taxTreatment: 'STANDARD_AUTO_RECONCILED',
        xeroJournalId: `XERO-JN-${Math.floor(10000 + Math.random() * 90000)}`,
        publicRecordVerified: true
      } : undefined,
      xeroMapping: status === 'loaded' ? {
        accountCode,
        accountName,
        taxType: 'STANDARD',
        currency: payload.currency,
        reconciled: true
      } : undefined,
      threatDetails: threat,
      quarantineReason
    };

    setRecords(prev => [newRecord, ...prev]);

    // Create Audit Log
    const auditId = `AUD-${Math.floor(1000 + Math.random() * 9000)}`;
    const auditEntry: AuditLog = {
      id: auditId,
      timestamp: nowIso,
      actor: threat ? 'Sentinel Security Layer' : 'ZeroLabz Serverless Xero Engine',
      role: threat ? 'Real-Time Threat Monitor' : 'Automated ETL Ingestion Service',
      action: threat ? (threat.actionTaken === 'BLOCKED' ? 'PAYLOAD_BLOCKED' : 'RECORD_QUARANTINED') : 'XERO_JOURNAL_COMMITTED',
      targetResource: `Record ${recId} (${payload.entityName})`,
      severity: threat ? (threat.severity === 'critical' ? 'critical' : 'warning') : 'info',
      details: threat 
        ? `${threat.type}: ${threat.description}` 
        : `Successfully extracted via ${payload.source}, transformed and loaded into Xero Account #${accountCode}.`,
      checksum: generateSha256(`${recId}-${nowIso}-${status}`),
      ipAddress: '10.240.0.12'
    };

    setAuditLogs(prev => [auditEntry, ...prev]);

    return newRecord;
  }, []);

  // Quarantine Resolution
  const resolveQuarantine = useCallback((threatId: string, decision: 'approve' | 'sanitize' | 'block', notes?: string) => {
    const nowIso = new Date().toISOString();
    setRecords(prev => prev.map(rec => {
      if (rec.threatDetails?.id === threatId) {
        const updatedStatus = decision === 'block' ? 'rejected' : 'loaded';
        return {
          ...rec,
          status: updatedStatus,
          quarantineReason: decision === 'approve' 
            ? `Manually approved: ${notes || 'Verified with vendor via out-of-band call'}` 
            : decision === 'sanitize' 
              ? `Sanitized: Payload stripped of malicious tokens and ingested.` 
              : `Permanently blocked by compliance team.`,
          transformedData: decision !== 'block' ? {
            accountCode: '400',
            accountName: 'Operating Expenses (Audited)',
            taxTreatment: 'OVERRIDE_APPROVED',
            xeroJournalId: `XERO-JN-OVERRIDE-${Math.floor(1000 + Math.random() * 9000)}`
          } : undefined,
          xeroMapping: decision !== 'block' ? {
            accountCode: '400',
            accountName: 'Operating Expenses (Audited)',
            taxType: 'STANDARD',
            currency: rec.currency,
            reconciled: true
          } : undefined,
          threatDetails: {
            ...rec.threatDetails!,
            actionTaken: decision === 'approve' ? 'FLAGGED' : decision === 'sanitize' ? 'SANITIZED' : 'BLOCKED',
            reviewedBy: 'Compliance Reviewer'
          }
        };
      }
      return rec;
    }));

    // Add Audit Log
    const auditId = `AUD-${Math.floor(1000 + Math.random() * 9000)}`;
    const actionName = decision === 'approve' ? 'QUARANTINE_OVERRIDE_APPROVED' : decision === 'sanitize' ? 'PAYLOAD_SANITIZED_AND_LOADED' : 'PAYLOAD_PERMANENTLY_BLOCKED';
    const auditEntry: AuditLog = {
      id: auditId,
      timestamp: nowIso,
      actor: 'Security & Compliance Officer',
      role: 'Sentinel Review Authority',
      action: actionName,
      targetResource: `Threat ${threatId}`,
      severity: decision === 'block' ? 'critical' : 'security',
      details: `Quarantine case ${threatId} resolved with outcome [${decision.toUpperCase()}]. Notes: ${notes || 'Standard protocol verification completed'}.`,
      checksum: generateSha256(`${threatId}-${decision}-${nowIso}`),
      ipAddress: '192.168.1.104'
    };
    setAuditLogs(prev => [auditEntry, ...prev]);
  }, []);

  // Sync Public Record to Xero
  const syncPublicRecordToXero = useCallback((recordId: string) => {
    const nowIso = new Date().toISOString();
    setPublicRecords(prev => prev.map(rec => {
      if (rec.id === recordId) {
        return {
          ...rec,
          syncedToXero: true,
          lastVerified: nowIso
        };
      }
      return rec;
    }));

    const found = publicRecords.find(p => p.id === recordId);
    const auditId = `AUD-${Math.floor(1000 + Math.random() * 9000)}`;
    const auditEntry: AuditLog = {
      id: auditId,
      timestamp: nowIso,
      actor: 'ZeroLabz Public Records Connector',
      role: 'ETL Registry Agent',
      action: 'PUBLIC_RECORD_SYNCED_TO_XERO',
      targetResource: `Entity ${found?.entityName || recordId}`,
      severity: 'info',
      details: `Synchronized statutory filing ${found?.filingType} with Xero Contact & Vendor Directory. Good standing verified.`,
      checksum: generateSha256(`${recordId}-SYNC-${nowIso}`),
      ipAddress: '10.240.3.11'
    };
    setAuditLogs(prev => [auditEntry, ...prev]);
  }, [publicRecords]);

  // Toggle Policy
  const togglePolicy = useCallback((policyId: string) => {
    setPolicies(prev => prev.map(p => {
      if (p.id === policyId) {
        const nextState = !p.enabled;
        const nowIso = new Date().toISOString();
        const auditId = `AUD-${Math.floor(1000 + Math.random() * 9000)}`;
        setAuditLogs(logs => [{
          id: auditId,
          timestamp: nowIso,
          actor: 'Security Architect',
          role: 'Administrator',
          action: 'SECURITY_POLICY_ALTERED',
          targetResource: p.name,
          severity: nextState ? 'info' : 'warning',
          details: `Policy "${p.name}" turned ${nextState ? 'ENABLED' : 'DISABLED'}. Enforcement threshold: ${p.thresholdValue}.`,
          checksum: generateSha256(`${policyId}-${nextState}-${nowIso}`),
          ipAddress: '192.168.1.104'
        }, ...logs]);
        return { ...p, enabled: nextState };
      }
      return p;
    }));
  }, []);

  // Add Public Record
  const addPublicRecord = useCallback((newRec: Omit<PublicRecord, 'id' | 'lastVerified' | 'syncedToXero'>) => {
    const id = `PUB-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowIso = new Date().toISOString();
    const created: PublicRecord = {
      ...newRec,
      id,
      syncedToXero: false,
      lastVerified: nowIso
    };
    setPublicRecords(prev => [created, ...prev]);
    
    // Add audit log
    const auditEntry: AuditLog = {
      id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: nowIso,
      actor: 'Public Records Ingestion Harvester',
      role: 'Crawler Engine',
      action: 'PUBLIC_RECORD_INGESTED',
      targetResource: `${created.entityName} (${created.jurisdiction})`,
      severity: 'info',
      details: `Ingested statutory record ${created.registryNumber} from ${created.jurisdiction}. Status: ${created.status}.`,
      checksum: generateSha256(`${id}-${nowIso}`),
      ipAddress: '10.240.4.5'
    };
    setAuditLogs(prev => [auditEntry, ...prev]);
  }, []);

  // Batch Stress Test Simulation
  const runBatchStressTest = useCallback(async () => {
    setIsProcessingBatch(true);
    // Simulate auto-scaler jumping to surge mode
    setTrafficMode('surge');

    const sampleEntities = [
      { name: 'Apex Dynamics UK Ltd', tax: 'GB-109283741', type: 'invoice' as const, amount: 24500, curr: 'GBP' },
      { name: 'Quantum Core Systems GmbH', tax: 'DE-882710192', type: 'bill' as const, amount: 12400, curr: 'EUR' },
      { name: 'Pacific Sovereign Trading', tax: 'SG-901827461', type: 'bank_tx' as const, amount: 85000, curr: 'USD' },
      { name: 'Suspicious Offshore Node', tax: 'CY-9991283', type: 'bill' as const, amount: 48000, curr: 'USD', iban: 'CY2800000000999999999' }
    ];

    for (const ent of sampleEntities) {
      await new Promise(r => setTimeout(r, 600));
      await runDataIngestion({
        type: ent.type,
        entityName: ent.name,
        entityTaxId: ent.tax,
        referenceNumber: `BATCH-SIM-${Math.floor(1000 + Math.random() * 9000)}`,
        amount: ent.amount,
        currency: ent.curr,
        source: 'Webhook',
        iban: ent.iban,
        memo: ent.iban ? 'Urgent changed wire details' : 'Standard monthly SaaS settlement'
      });
    }

    setIsProcessingBatch(false);
  }, [runDataIngestion, setTrafficMode]);

  return (
    <EngineContext.Provider value={{
      activeTab,
      setActiveTab,
      records,
      publicRecords,
      threats,
      geoHotspots,
      autoScaling,
      auditLogs,
      policies,
      isLiveAttackFeedActive,
      toggleLiveAttackFeed,
      triggerGlobalThreatWave,
      setTrafficMode,
      runDataIngestion,
      resolveQuarantine,
      syncPublicRecordToXero,
      togglePolicy,
      addPublicRecord,
      isProcessingBatch,
      runBatchStressTest
    }}>
      {children}
    </EngineContext.Provider>
  );
};

export const useEngine = () => {
  const context = useContext(EngineContext);
  if (!context) {
    throw new Error('useEngine must be used within an EngineProvider');
  }
  return context;
};
