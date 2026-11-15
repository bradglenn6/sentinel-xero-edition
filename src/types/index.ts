export type TabType = 
  | 'overview' 
  | 'data-entry' 
  | 'etl-pipeline' 
  | 'public-records' 
  | 'sentinel-security' 
  | 'cloud-scaling' 
  | 'audit-logs';

export type RecordType = 'invoice' | 'bill' | 'bank_tx' | 'public_filing' | 'tax_entry';

export type EtlStatus = 'queued' | 'extracting' | 'sentinel_inspecting' | 'transforming' | 'loaded' | 'quarantined' | 'rejected';

export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low' | 'nominal';

export interface XeroLedgerMapping {
  accountCode: string;
  accountName: string;
  taxType: string;
  currency: string;
  reconciled: boolean;
}

export interface IngestionRecord {
  id: string;
  batchId: string;
  type: RecordType;
  entityName: string;
  entityTaxId: string;
  referenceNumber: string;
  amount: number;
  currency: string;
  timestamp: string;
  status: EtlStatus;
  source: 'OCR Upload' | 'Webhook' | 'Public Records API' | 'Bank Feed' | 'Manual Feed';
  rawPayload: Record<string, any>;
  transformedData?: Record<string, any>;
  xeroMapping?: XeroLedgerMapping;
  threatDetails?: SentinelThreat;
  quarantineReason?: string;
  latencyMs: number;
}

export interface SentinelThreat {
  id: string;
  recordId: string;
  type: 'SQL_PAYLOAD' | 'IBAN_DRIFT_FRAUD' | 'SANCTION_MATCH' | 'SCHEMA_CORRUPTION' | 'DUPLICATE_PAYMENT' | 'ANOMALOUS_VELOCITY';
  severity: ThreatSeverity;
  description: string;
  confidenceScore: number;
  detectedAt: string;
  vector: string;
  actionTaken: 'QUARANTINED' | 'BLOCKED' | 'SANITIZED' | 'FLAGGED';
  reviewedBy?: string;
  geo?: {
    country: string;
    countryCode: string;
    city: string;
    lat: number;
    lng: number;
    ip: string;
  };
}

export interface GeoThreatHotspot {
  id: string;
  country: string;
  countryCode: string;
  city: string;
  latitude: number;
  longitude: number;
  threatCount: number;
  severity: ThreatSeverity;
  primaryVector: string;
  sourceIp: string;
  lastEventTime: string;
  threatTypes: string[];
  recentEvents: {
    id: string;
    timestamp: string;
    type: string;
    severity: ThreatSeverity;
    ip: string;
    description: string;
  }[];
}

export interface PublicRecord {
  id: string;
  entityName: string;
  taxId: string;
  jurisdiction: string;
  incorporationDate: string;
  registryNumber: string;
  status: 'Active / Good Standing' | 'Dissolved' | 'Delinquent' | 'Under Review';
  filingType: 'SEC Form 10-Q' | 'SEC Form 8-K' | 'Companies House Annual' | 'UCC-1 Lien' | 'IRS 990';
  filingDate: string;
  officers: string[];
  riskScore: 'Low' | 'Medium' | 'High';
  syncedToXero: boolean;
  lastVerified: string;
}

export interface ServerlessWorkerNode {
  id: string;
  region: 'us-east-1' | 'eu-west-1' | 'ap-southeast-1';
  cpuUtilization: number;
  memoryUsageMb: number;
  activeRequests: number;
  status: 'active' | 'scaling_up' | 'idle' | 'terminating';
  uptimeSeconds: number;
}

export interface AutoScalingState {
  trafficMode: 'normal' | 'surge' | 'extreme';
  currentRps: number;
  targetRps: number;
  activeWorkers: number;
  minWorkers: number;
  maxWorkers: number;
  queueDepth: number;
  p95LatencyMs: number;
  successRate: number;
  nodes: ServerlessWorkerNode[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  targetResource: string;
  severity: 'info' | 'warning' | 'security' | 'critical';
  details: string;
  checksum: string;
  ipAddress: string;
}

export interface SecurityPolicyRule {
  id: string;
  name: string;
  category: 'Schema Invariant' | 'Financial Fraud' | 'Threat Detection' | 'Compliance';
  enabled: boolean;
  thresholdValue: string;
  actionOnTrigger: 'Quarantine' | 'Block' | 'Sanitize';
}
