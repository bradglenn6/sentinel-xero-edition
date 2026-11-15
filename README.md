# ZeroLabz Sentinel: Xero Edition

> **Sub-millisecond AI guardrail reverse proxy, WAF invariant engine, and real-time telemetry built specifically for Xero and financial ledgers.**

[![npm version](https://img.shields.io/npm/v/@zerolabz/sentinel-xero.svg)](https://www.npmjs.com/package/@zerolabz/sentinel-xero)
[![License: BUSL-1.1](https://img.shields.io/badge/License-BUSL--1.1-blue.svg)](LICENSE)
[![CI/CD Pipeline](https://github.com/bradglenn6/zerolabz-sentinel-xero/actions/workflows/ci.yml/badge.svg)](https://github.com/bradglenn6/zerolabz-sentinel-xero/actions)

---

## Overview

**ZeroLabz Sentinel: Xero Edition** is a specialized serverless security and compliance proxy engineered to safeguard accounting ETL pipelines, automated data entry, and financial ledgers against zero-day exploits, Business Email Compromise (BEC), IBAN routing drift, and OFAC sanctions violations. 

Built as an extension of the ZeroLabz core threat engine, it intercepts incoming API transactions and invoice payloads in sub-millisecond timeframes, enforcing strict stateful security invariants before they hit your core accounting workflows.

---

## Key Features

* **Ledger Invariant Enforcement:** Inspects journal entries, bills, and invoices for anomalies, double-spending patterns, and unauthorized account modifications.
* **BEC & IBAN Fraud Detection:** Real-time heuristic scanning to prevent fraudulent vendor payout reroutes.
* **OFAC Sanctions Screening:** Automated screening of counterparty names, addresses, and tax identifiers against restricted lists.
* **Real-Time D3 Threat Telemetry:** Live geospatial map visualization and dashboard monitoring for anomalous IP traffic and failed authentication attempts.
* **Cloud-Native & Serverless:** Designed for seamless deployment on Google Cloud Run with secret management via Google Secret Manager.

---

## Installation

Install the package via npm into your Node.js / TypeScript environment:

```bash
npm install @zerolabz/sentinel-xero
