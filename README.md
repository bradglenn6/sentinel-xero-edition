# ZeroLabz Sentinel — Xero Edition

[![Deploy Sentinel Xero Edition](https://github.com/bradglenn6/sentinel-xero-edition/actions/workflows/deploy.yml/badge.svg)](https://github.com/bradglenn6/sentinel-xero-edition/actions/workflows/deploy.yml)
[![Live Production](https://img.shields.io/badge/Production-xero.zrolabz.com-00e5ff?style=flat&logo=googlecloud)](https://xero.zrolabz.com)
[![Control Plane](https://img.shields.io/badge/Control_Plane-us--west2_Dual--Mesh-10b981?style=flat&logo=rust)](https://sentinel-proxy-798917645637.us-west2.run.app/v1/healthz)
[![ORCID](https://img.shields.io/badge/ORCID-0000--0002--5071--9051-a6ce39?style=flat&logo=orcid)](https://orcid.org/0000-0002-5071-9051)

**ZeroLabz Sentinel (Xero Edition)** is an enterprise serverless ETL, financial ledger reconciliation, and real-time zero-trust security command platform. It inspects incoming OCR invoices, supplier bank feeds, and statutory public filings before payloads reach the Xero accounting API—blocking SQL injection payloads, IBAN routing drift (Business Email Compromise), and OFAC sanctions matches at sub-millisecond to low-millisecond edge latency.

---

## Live Endpoints

| Environment | URL | Region | Role |
| :--- | :--- | :--- | :--- |
| **Production Dashboard (Custom Domain)** | [`https://xero.zrolabz.com`](https://xero.zrolabz.com) | `us-central1` | Primary Frontend Command Center |
| **Cloud Run Service URL** | [`https://sentinel-xero-service-ssqdynq7cq-uc.a.run.app`](https://sentinel-xero-service-ssqdynq7cq-uc.a.run.app) | `us-central1` | Containerized Static Edge Ingress |
| **Sentinel Dual-Mesh Control Plane** | [`https://sentinel-proxy-798917645637.us-west2.run.app`](https://sentinel-proxy-798917645637.us-west2.run.app) | `us-west2` | Rust Axum Telemetry, SIEM & Recovery Proxy |

---

## Core Architecture & Capabilities

* **Real-Time Dual-Mesh Control Plane Integration:** Actively polls the Rust `sentinel-xero-dual-mesh` backend (`/api/mesh`, `/api/siem/logs`, `/v1/healthz`) to synchronize live worker telemetry (`agent-alpha-01`, `agent-beta-02`), CPU/memory utilization, token velocity, and round-trip P95 latency.
* **Inline Financial Threat Invariant Engine (`/api/telemetry/evaluate`):**
  * **SQLi & Hostile Payload Filtering:** Detects and blocks destructive SQL/script sequences in unstructured invoice memos prior to ledger transformation.
  * **Vendor IBAN Drift Detection:** Quarantines unverified offshore routing shifts (`CY`, `KY`, urgent wire overrides) against historical supplier ledgers.
  * **OFAC & High-Velocity Screening:** Flags sanctioned entities and high-value anomalies for dual compliance sign-off.
* **Autonomous Quarantine & Recovery Orchestration (`/api/recovery/trigger`):** Dispatches compliance review decisions (`approve`, `sanitize`, `block`) to the `us-west2` recovery orchestrator while recording tamper-evident SHA-256 checksums in the immutable Audit Ledger.
* **Statutory Public Records Connector:** Cross-references SEC EDGAR and Companies House filings against Xero vendor directories.
* **Zero-Trust CI/CD Pipeline:** Automated GitHub Actions deployment authenticating via Google Cloud Workload Identity Federation (OIDC) -> Cloud Build -> Artifact Registry -> Cloud Run.

---

## Local Development

### Prerequisites
* **Node.js** >= 20.x
* **npm** >= 10.x

### Setup & Run
```bash
# Install dependencies
npm install

# Start Vite development server with hot reload
npm run dev

# Compile TypeScript & production bundle
npm run build