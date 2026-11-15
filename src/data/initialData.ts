import { IngestionRecord, PublicRecord, SentinelThreat, ServerlessWorkerNode, AuditLog, SecurityPolicyRule, GeoThreatHotspot } from '../types';

export const INITIAL_RECORDS: IngestionRecord[] = [
  {
    id: 'REC-9081',
    batchId: 'BATCH-2026-X102',
    type: 'invoice',
    entityName: 'CloudVertex Infrastructure Ltd',
    entityTaxId: 'GB-992384102',
    referenceNumber: 'INV-2026-8812',
    amount: 14850.00,
    currency: 'USD',
    timestamp: '2026-10-06T05:12:10Z',
    status: 'loaded',
    source: 'OCR Upload',
    latencyMs: 142,
    rawPayload: {
      invoiceNumber: 'INV-2026-8812',
      vendor: 'CloudVertex Infrastructure Ltd',
      subtotal: 13500.00,
      tax: 1350.00,
      total: 14850.00,
      iban: 'GB29NWBK60161331926819',
      dueDate: '2026-10-25'
    },
    transformedData: {
      accountCode: '400',
      accountName: 'Cloud Hosting & Compute',
      taxRate: 'Standard 10%',
      verifiedEntity: true,
      xeroLedgerId: 'XERO-LEDGER-99201'
    },
    xeroMapping: {
      accountCode: '400',
      accountName: 'Cloud Hosting & Compute',
      taxType: 'INPUT2',
      currency: 'USD',
      reconciled: true
    }
  },
  {
    id: 'REC-9082',
    batchId: 'BATCH-2026-X102',
    type: 'bill',
    entityName: 'Apex Data Telemetry AG',
    entityTaxId: 'DE-491029388',
    referenceNumber: 'BILL-44021',
    amount: 8240.50,
    currency: 'EUR',
    timestamp: '2026-10-06T05:14:22Z',
    status: 'quarantined',
    source: 'Webhook',
    latencyMs: 98,
    quarantineReason: 'IBAN changed from established vendor profile; potential business email compromise (BEC).',
    rawPayload: {
      invoiceNumber: 'BILL-44021',
      vendor: 'Apex Data Telemetry AG',
      total: 8240.50,
      iban: 'CY28002001950000357001234567',
      routingCheck: 'FLAGGED_COUNTRY_MISMATCH'
    },
    threatDetails: {
      id: 'THR-7721',
      recordId: 'REC-9082',
      type: 'IBAN_DRIFT_FRAUD',
      severity: 'high',
      description: 'Vendor banking destination shifted to offshore Cyprus account without two-party dual authorization.',
      confidenceScore: 0.94,
      detectedAt: '2026-10-06T05:14:22Z',
      vector: 'Bank Account Discrepancy Engine',
      actionTaken: 'QUARANTINED'
    }
  },
  {
    id: 'REC-9083',
    batchId: 'BATCH-2026-X103',
    type: 'public_filing',
    entityName: 'Helios Semiconductor Global Inc',
    entityTaxId: 'US-882910394',
    referenceNumber: 'SEC-10Q-2026Q3',
    amount: 145000000.00,
    currency: 'USD',
    timestamp: '2026-10-06T05:16:04Z',
    status: 'loaded',
    source: 'Public Records API',
    latencyMs: 184,
    rawPayload: {
      cik: '0001948291',
      filingType: '10-Q',
      periodEnding: '2026-09-30',
      operatingCashFlow: 38200000.00,
      netIncome: 145000000.00,
      auditor: 'Deloitte LLP'
    },
    transformedData: {
      regulatoryVerification: 'VERIFIED_EDGAR',
      reconciledTaxStatus: 'ACTIVE_CORPORATION_DELAWARE',
      xeroContactSynced: true
    },
    xeroMapping: {
      accountCode: '800',
      accountName: 'Corporate Investments & Equity',
      taxType: 'NONE',
      currency: 'USD',
      reconciled: true
    }
  },
  {
    id: 'REC-9084',
    batchId: 'BATCH-2026-X103',
    type: 'bank_tx',
    entityName: 'Pacific Rim Logistics Co',
    entityTaxId: 'SG-202391024K',
    referenceNumber: 'SWIFT-991204',
    amount: 32000.00,
    currency: 'SGD',
    timestamp: '2026-10-06T05:18:41Z',
    status: 'quarantined',
    source: 'Bank Feed',
    latencyMs: 112,
    quarantineReason: 'Sanctions / PEP list fuzzy match detected on counterparty beneficial ownership node.',
    rawPayload: {
      beneficiary: 'Pacific Rim Logistics Co',
      intermediaryBank: 'DBS Bank Singapore',
      memo: 'Freight clearance invoice batch 79A',
      amount: 32000.00
    },
    threatDetails: {
      id: 'THR-7722',
      recordId: 'REC-9084',
      type: 'SANCTION_MATCH',
      severity: 'critical',
      description: 'OFAC SDN Specially Designated Nationals List similarity score 89.2% on affiliate holding entity.',
      confidenceScore: 0.89,
      detectedAt: '2026-10-06T05:18:41Z',
      vector: 'Sentinel AML & Sanction Screening Mesh',
      actionTaken: 'QUARANTINED'
    }
  },
  {
    id: 'REC-9085',
    batchId: 'BATCH-2026-X104',
    type: 'invoice',
    entityName: 'Vanguard Cyber Systems',
    entityTaxId: 'US-942103991',
    referenceNumber: 'INV-VC-2026-09',
    amount: 19500.00,
    currency: 'USD',
    timestamp: '2026-10-06T05:20:15Z',
    status: 'loaded',
    source: 'OCR Upload',
    latencyMs: 128,
    rawPayload: {
      invoiceNumber: 'INV-VC-2026-09',
      serviceDescription: 'Zero-Trust Sentinel Endpoint Integration (Annual)',
      subtotal: 19500.00,
      tax: 0.00,
      total: 19500.00
    },
    transformedData: {
      accountCode: '420',
      accountName: 'Software Subscriptions & Security',
      taxRate: 'Tax Exempt',
      xeroLedgerId: 'XERO-LEDGER-99205'
    },
    xeroMapping: {
      accountCode: '420',
      accountName: 'Software Subscriptions & Security',
      taxType: 'BASEXCLUDED',
      currency: 'USD',
      reconciled: true
    }
  },
  {
    id: 'REC-9086',
    batchId: 'BATCH-2026-X104',
    type: 'bill',
    entityName: 'Malformed Input Node',
    entityTaxId: 'UNKNOWN',
    referenceNumber: 'INJ-PAYLOAD-01',
    amount: 999999.00,
    currency: 'USD',
    timestamp: '2026-10-06T05:21:05Z',
    status: 'rejected',
    source: 'Webhook',
    latencyMs: 44,
    quarantineReason: 'Malicious SQL injection signature identified in line item description field.',
    rawPayload: {
      memo: "'; DROP TABLE xero_journal_entries; --",
      amount: 999999.00
    },
    threatDetails: {
      id: 'THR-7723',
      recordId: 'REC-9086',
      type: 'SQL_PAYLOAD',
      severity: 'critical',
      description: 'ZeroLabz Sentinel SQLi pattern matching detected destructive SQL sequence in unstructured payload.',
      confidenceScore: 0.99,
      detectedAt: '2026-10-06T05:21:05Z',
      vector: 'Sentinel WAF & Invariant Engine',
      actionTaken: 'BLOCKED'
    }
  }
];

export const INITIAL_PUBLIC_RECORDS: PublicRecord[] = [
  {
    id: 'PUB-101',
    entityName: 'CloudVertex Infrastructure Ltd',
    taxId: 'GB-992384102',
    jurisdiction: 'United Kingdom (Companies House)',
    incorporationDate: '2019-04-12',
    registryNumber: 'UK-09923841',
    status: 'Active / Good Standing',
    filingType: 'Companies House Annual',
    filingDate: '2026-05-18',
    officers: ['Eleanor Vance (Director)', 'Arthur Pendelton (Secretary)'],
    riskScore: 'Low',
    syncedToXero: true,
    lastVerified: '2026-10-06T04:30:00Z'
  },
  {
    id: 'PUB-102',
    entityName: 'Helios Semiconductor Global Inc',
    taxId: 'US-882910394',
    jurisdiction: 'Delaware, United States',
    incorporationDate: '2014-08-22',
    registryNumber: 'DE-SR-5510928',
    status: 'Active / Good Standing',
    filingType: 'SEC Form 10-Q',
    filingDate: '2026-09-30',
    officers: ['Dr. Kenji Sato (CEO)', 'Rachel Foster (CFO)'],
    riskScore: 'Low',
    syncedToXero: true,
    lastVerified: '2026-10-06T03:15:00Z'
  },
  {
    id: 'PUB-103',
    entityName: 'Apex Data Telemetry AG',
    taxId: 'DE-491029388',
    jurisdiction: 'Munich, Germany (Handelsregister)',
    incorporationDate: '2021-02-10',
    registryNumber: 'HRB-288194',
    status: 'Under Review',
    filingType: 'Companies House Annual',
    filingDate: '2026-02-14',
    officers: ['Klaus Weidemann (Vorstand)'],
    riskScore: 'Medium',
    syncedToXero: false,
    lastVerified: '2026-10-06T05:14:22Z'
  },
  {
    id: 'PUB-104',
    entityName: 'Pacific Rim Logistics Co',
    taxId: 'SG-202391024K',
    jurisdiction: 'Singapore (ACRA)',
    incorporationDate: '2023-11-04',
    registryNumber: 'UEN-202391024K',
    status: 'Under Review',
    filingType: 'UCC-1 Lien',
    filingDate: '2026-08-11',
    officers: ['Li Wei Zhang (Managing Director)'],
    riskScore: 'High',
    syncedToXero: false,
    lastVerified: '2026-10-06T05:18:41Z'
  },
  {
    id: 'PUB-105',
    entityName: 'Vanguard Cyber Systems LLC',
    taxId: 'US-942103991',
    jurisdiction: 'Texas, United States',
    incorporationDate: '2017-06-30',
    registryNumber: 'TX-080277382',
    status: 'Active / Good Standing',
    filingType: 'SEC Form 8-K',
    filingDate: '2026-07-19',
    officers: ['Marcus Thorne (President)', 'Devon Vance (Treasurer)'],
    riskScore: 'Low',
    syncedToXero: true,
    lastVerified: '2026-10-06T01:00:00Z'
  },
  {
    id: 'PUB-106',
    entityName: 'Nordic Oceanic Freight Group',
    taxId: 'NO-918237461',
    jurisdiction: 'Oslo, Norway (Brønnøysund)',
    incorporationDate: '2012-01-15',
    registryNumber: 'NO-918237461-MVA',
    status: 'Active / Good Standing',
    filingType: 'Companies House Annual',
    filingDate: '2026-04-02',
    officers: ['Astrid Lind (General Manager)'],
    riskScore: 'Low',
    syncedToXero: true,
    lastVerified: '2026-10-05T22:40:00Z'
  }
];

export const INITIAL_WORKER_NODES: ServerlessWorkerNode[] = [
  {
    id: 'pod-use1-x01',
    region: 'us-east-1',
    cpuUtilization: 38,
    memoryUsageMb: 240,
    activeRequests: 42,
    status: 'active',
    uptimeSeconds: 8420
  },
  {
    id: 'pod-use1-x02',
    region: 'us-east-1',
    cpuUtilization: 44,
    memoryUsageMb: 275,
    activeRequests: 48,
    status: 'active',
    uptimeSeconds: 8420
  },
  {
    id: 'pod-use1-x03',
    region: 'us-east-1',
    cpuUtilization: 31,
    memoryUsageMb: 198,
    activeRequests: 35,
    status: 'active',
    uptimeSeconds: 4310
  },
  {
    id: 'pod-euw1-x01',
    region: 'eu-west-1',
    cpuUtilization: 52,
    memoryUsageMb: 310,
    activeRequests: 61,
    status: 'active',
    uptimeSeconds: 12900
  },
  {
    id: 'pod-euw1-x02',
    region: 'eu-west-1',
    cpuUtilization: 49,
    memoryUsageMb: 295,
    activeRequests: 54,
    status: 'active',
    uptimeSeconds: 12900
  },
  {
    id: 'pod-apse1-x01',
    region: 'ap-southeast-1',
    cpuUtilization: 29,
    memoryUsageMb: 185,
    activeRequests: 28,
    status: 'active',
    uptimeSeconds: 6100
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-9901',
    timestamp: '2026-10-06T05:22:40Z',
    actor: 'ZeroLabz Serverless Ingestion Engine',
    role: 'Service Account (Engine Core)',
    action: 'ETL_BATCH_COMMITTED',
    targetResource: 'Xero API: Ledger Journal #XERO-LEDGER-99205',
    severity: 'info',
    details: 'Batch BATCH-2026-X104 transformed and reconciled to Xero organization ledger.',
    checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    ipAddress: '10.240.0.14'
  },
  {
    id: 'AUD-9902',
    timestamp: '2026-10-06T05:21:05Z',
    actor: 'Sentinel Threat Engine',
    role: 'Security Daemon',
    action: 'PAYLOAD_BLOCKED',
    targetResource: 'Webhook Ingress /api/v1/ingest/xero-feed',
    severity: 'critical',
    details: 'Detected and neutralized SQL injection sequence in memo field. Source IP isolated.',
    checksum: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
    ipAddress: '198.51.100.44'
  },
  {
    id: 'AUD-9903',
    timestamp: '2026-10-06T05:18:41Z',
    actor: 'Sentinel AML & Sanction Screening Mesh',
    role: 'Compliance Subsystem',
    action: 'RECORD_QUARANTINED',
    targetResource: 'Record REC-9084 (Pacific Rim Logistics Co)',
    severity: 'security',
    details: 'Sanctions list match trigger (89.2% confidence). Transaction placed in Quarantine Desk.',
    checksum: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    ipAddress: '10.240.2.19'
  },
  {
    id: 'AUD-9904',
    timestamp: '2026-10-06T05:14:22Z',
    actor: 'Sentinel Vendor Verification Sentinel',
    role: 'Fraud Detection Engine',
    action: 'IBAN_DRIFT_ALERT',
    targetResource: 'Record REC-9082 (Apex Data Telemetry AG)',
    severity: 'warning',
    details: 'IBAN changed from verified vendor master data. Quarantined pending dual sign-off.',
    checksum: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
    ipAddress: '10.240.1.88'
  },
  {
    id: 'AUD-9905',
    timestamp: '2026-10-06T05:08:12Z',
    actor: 'Dr. Kenji Vance (Security Director)',
    role: 'System Administrator',
    action: 'AUTO_SCALE_POLICY_UPDATED',
    targetResource: 'Kubernetes HPA / ZeroLabz Serverless Scaler',
    severity: 'info',
    details: 'Scale-out trigger threshold tuned to 75% CPU and 1,200 queue lag events.',
    checksum: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    ipAddress: '192.0.2.71'
  }
];

export const INITIAL_POLICIES: SecurityPolicyRule[] = [
  {
    id: 'POL-01',
    name: 'Real-time SQLi & Script Payload Sanitizer',
    category: 'Threat Detection',
    enabled: true,
    thresholdValue: 'Strict (Regex + AST Parser)',
    actionOnTrigger: 'Block'
  },
  {
    id: 'POL-02',
    name: 'Vendor IBAN & Bank Route Drift Detection',
    category: 'Financial Fraud',
    enabled: true,
    thresholdValue: 'Mismatch > 0 chars from Master Ledger',
    actionOnTrigger: 'Quarantine'
  },
  {
    id: 'POL-03',
    name: 'Sanctions & OFAC / EU Consolidated Screening',
    category: 'Compliance',
    enabled: true,
    thresholdValue: 'Levenshtein Match >= 85%',
    actionOnTrigger: 'Quarantine'
  },
  {
    id: 'POL-04',
    name: 'Duplicate Payment & Hash Collision Guard',
    category: 'Financial Fraud',
    enabled: true,
    thresholdValue: 'Same Amount & Entity within 7 days',
    actionOnTrigger: 'Quarantine'
  },
  {
    id: 'POL-05',
    name: 'Strict Schema Invariant & Tax Field Validation',
    category: 'Schema Invariant',
    enabled: true,
    thresholdValue: 'Zero-tolerance missing mandatory Xero tax code',
    actionOnTrigger: 'Sanitize'
  }
];

export const INITIAL_GEO_HOTSPOTS: GeoThreatHotspot[] = [
  {
    id: 'HOT-CY-01',
    country: 'Cyprus',
    countryCode: 'CY',
    city: 'Limassol',
    latitude: 34.68,
    longitude: 33.04,
    threatCount: 42,
    severity: 'high',
    primaryVector: 'IBAN_DRIFT_FRAUD',
    sourceIp: '194.154.212.18',
    lastEventTime: '2026-10-10T20:14:22Z',
    threatTypes: ['IBAN_DRIFT_FRAUD', 'ANOMALOUS_VELOCITY'],
    recentEvents: [
      {
        id: 'EVT-CY-101',
        timestamp: '2026-10-10T20:14:22Z',
        type: 'IBAN_DRIFT_FRAUD',
        severity: 'high',
        ip: '194.154.212.18',
        description: 'Offshore wire redirect to Cyprus IBAN without dual sign-off'
      },
      {
        id: 'EVT-CY-102',
        timestamp: '2026-10-10T19:55:10Z',
        type: 'IBAN_DRIFT_FRAUD',
        severity: 'high',
        ip: '194.154.212.44',
        description: 'Vendor master bank routing swap attempted'
      }
    ]
  },
  {
    id: 'HOT-UA-02',
    country: 'Ukraine',
    countryCode: 'UA',
    city: 'Kyiv',
    latitude: 50.45,
    longitude: 30.52,
    threatCount: 68,
    severity: 'critical',
    primaryVector: 'SQL_PAYLOAD',
    sourceIp: '198.51.100.44',
    lastEventTime: '2026-10-10T20:21:05Z',
    threatTypes: ['SQL_PAYLOAD', 'SCHEMA_CORRUPTION'],
    recentEvents: [
      {
        id: 'EVT-UA-201',
        timestamp: '2026-10-10T20:21:05Z',
        type: 'SQL_PAYLOAD',
        severity: 'critical',
        ip: '198.51.100.44',
        description: 'Destructive SQL syntax injection intercepted in line-item memo'
      },
      {
        id: 'EVT-UA-202',
        timestamp: '2026-10-10T18:40:12Z',
        type: 'SQL_PAYLOAD',
        severity: 'critical',
        ip: '198.51.100.99',
        description: 'UNION SELECT probe on Xero chart-of-accounts journal ingress'
      }
    ]
  },
  {
    id: 'HOT-SG-03',
    country: 'Singapore',
    countryCode: 'SG',
    city: 'Singapore',
    latitude: 1.35,
    longitude: 103.82,
    threatCount: 29,
    severity: 'critical',
    primaryVector: 'SANCTION_MATCH',
    sourceIp: '203.116.88.42',
    lastEventTime: '2026-10-10T20:18:41Z',
    threatTypes: ['SANCTION_MATCH'],
    recentEvents: [
      {
        id: 'EVT-SG-301',
        timestamp: '2026-10-10T20:18:41Z',
        type: 'SANCTION_MATCH',
        severity: 'critical',
        ip: '203.116.88.42',
        description: 'OFAC SDN screening trigger on intermediary maritime holding entity'
      }
    ]
  },
  {
    id: 'HOT-US-04',
    country: 'United States',
    countryCode: 'US',
    city: 'Ashburn, VA',
    latitude: 39.04,
    longitude: -77.48,
    threatCount: 54,
    severity: 'high',
    primaryVector: 'SCHEMA_CORRUPTION',
    sourceIp: '54.210.12.80',
    lastEventTime: '2026-10-10T20:05:12Z',
    threatTypes: ['SCHEMA_CORRUPTION', 'ANOMALOUS_VELOCITY'],
    recentEvents: [
      {
        id: 'EVT-US-401',
        timestamp: '2026-10-10T20:05:12Z',
        type: 'SCHEMA_CORRUPTION',
        severity: 'high',
        ip: '54.210.12.80',
        description: 'Malformed XML/JSON parser fuzzing attempt targeting Xero API proxy'
      }
    ]
  },
  {
    id: 'HOT-DE-05',
    country: 'Germany',
    countryCode: 'DE',
    city: 'Frankfurt',
    latitude: 50.11,
    longitude: 8.68,
    threatCount: 31,
    severity: 'medium',
    primaryVector: 'ANOMALOUS_VELOCITY',
    sourceIp: '185.190.140.12',
    lastEventTime: '2026-10-10T19:48:30Z',
    threatTypes: ['ANOMALOUS_VELOCITY', 'DUPLICATE_PAYMENT'],
    recentEvents: [
      {
        id: 'EVT-DE-501',
        timestamp: '2026-10-10T19:48:30Z',
        type: 'ANOMALOUS_VELOCITY',
        severity: 'medium',
        ip: '185.190.140.12',
        description: 'High burst webhook replay attempt (480 requests in 3 seconds)'
      }
    ]
  },
  {
    id: 'HOT-CN-06',
    country: 'China',
    countryCode: 'CN',
    city: 'Shenzhen',
    latitude: 22.54,
    longitude: 114.05,
    threatCount: 76,
    severity: 'high',
    primaryVector: 'DUPLICATE_PAYMENT',
    sourceIp: '119.29.80.190',
    lastEventTime: '2026-10-10T20:12:00Z',
    threatTypes: ['DUPLICATE_PAYMENT', 'SCHEMA_CORRUPTION'],
    recentEvents: [
      {
        id: 'EVT-CN-601',
        timestamp: '2026-10-10T20:12:00Z',
        type: 'DUPLICATE_PAYMENT',
        severity: 'high',
        ip: '119.29.80.190',
        description: 'Simulated collision attack attempting duplicate invoice voucher settlement'
      }
    ]
  },
  {
    id: 'HOT-BR-07',
    country: 'Brazil',
    countryCode: 'BR',
    city: 'São Paulo',
    latitude: -23.55,
    longitude: -46.63,
    threatCount: 22,
    severity: 'medium',
    primaryVector: 'SQL_PAYLOAD',
    sourceIp: '177.18.200.55',
    lastEventTime: '2026-10-10T19:10:44Z',
    threatTypes: ['SQL_PAYLOAD'],
    recentEvents: [
      {
        id: 'EVT-BR-701',
        timestamp: '2026-10-10T19:10:44Z',
        type: 'SQL_PAYLOAD',
        severity: 'medium',
        ip: '177.18.200.55',
        description: 'SQL blind boolean injection probe intercepted in tax ID field'
      }
    ]
  },
  {
    id: 'HOT-AE-08',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    city: 'Dubai',
    latitude: 25.20,
    longitude: 55.27,
    threatCount: 38,
    severity: 'critical',
    primaryVector: 'SANCTION_MATCH',
    sourceIp: '185.76.12.99',
    lastEventTime: '2026-10-10T20:01:15Z',
    threatTypes: ['SANCTION_MATCH', 'IBAN_DRIFT_FRAUD'],
    recentEvents: [
      {
        id: 'EVT-AE-801',
        timestamp: '2026-10-10T20:01:15Z',
        type: 'SANCTION_MATCH',
        severity: 'critical',
        ip: '185.76.12.99',
        description: 'Entity on Grey-List monitored registry routed through shell bank'
      }
    ]
  },
  {
    id: 'HOT-GB-09',
    country: 'United Kingdom',
    countryCode: 'GB',
    city: 'London',
    latitude: 51.50,
    longitude: -0.12,
    threatCount: 25,
    severity: 'medium',
    primaryVector: 'ANOMALOUS_VELOCITY',
    sourceIp: '82.165.197.1',
    lastEventTime: '2026-10-10T19:35:00Z',
    threatTypes: ['ANOMALOUS_VELOCITY'],
    recentEvents: [
      {
        id: 'EVT-GB-901',
        timestamp: '2026-10-10T19:35:00Z',
        type: 'ANOMALOUS_VELOCITY',
        severity: 'medium',
        ip: '82.165.197.1',
        description: 'Synthetic crawler storm probing public records cache'
      }
    ]
  },
  {
    id: 'HOT-AU-10',
    country: 'Australia',
    countryCode: 'AU',
    city: 'Sydney',
    latitude: -33.86,
    longitude: 151.20,
    threatCount: 16,
    severity: 'medium',
    primaryVector: 'IBAN_DRIFT_FRAUD',
    sourceIp: '139.130.4.5',
    lastEventTime: '2026-10-10T18:22:19Z',
    threatTypes: ['IBAN_DRIFT_FRAUD'],
    recentEvents: [
      {
        id: 'EVT-AU-1001',
        timestamp: '2026-10-10T18:22:19Z',
        type: 'IBAN_DRIFT_FRAUD',
        severity: 'medium',
        ip: '139.130.4.5',
        description: 'Bank BSB routing discrepancy in payroll batch upload'
      }
    ]
  }
];

