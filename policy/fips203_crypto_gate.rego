package main

import rego.v1

approved_kex_groups := {
	"X25519MLKEM768",
	"SecP256r1MLKEM768",
	"ML-KEM-768",
	"ML-KEM-1024",
}

forbidden_kex_patterns := [
	"RSA",
	"DHE_RSA",
	"ECDH_RSA",
	"DH_ANON",
	"TLS_RSA_",
	"STATIC_DH",
]

# 1. Service Config Checks (sentinel.toml / *.json / *.yaml)
deny contains msg if {
	min_tls := input.tls.min_version
	min_tls != "1.3"
	msg := sprintf("FIPS-203-GATE-001: tls.min_version is '%s'; must be '1.3'.", [min_tls])
}

deny contains msg if {
	some group in input.tls.kex_groups
	some bad in forbidden_kex_patterns
	contains(upper(group), bad)
	msg := sprintf("FIPS-203-GATE-002: Forbidden classical KEX '%s' detected in tls.kex_groups.", [group])
}

deny contains msg if {
	groups := input.tls.kex_groups
	count(groups) > 0
	approved := {g | some g in groups; g in approved_kex_groups}
	count(approved) == 0
	msg := sprintf("FIPS-203-GATE-003: tls.kex_groups %v contains no approved FIPS 203 / hybrid group (%v).", [groups, approved_kex_groups])
}

deny contains msg if {
	some group in input.tls.kex_groups
	startswith(upper(group), "KYBER")
	msg := sprintf("FIPS-203-GATE-004: Draft Kyber identifier '%s' is disallowed; migrate to final FIPS 203 ML-KEM-768 or ML-KEM-1024.", [group])
}

warn contains msg if {
	some group in input.tls.kex_groups
	upper(group) == "ML-KEM-512"
	msg := "FIPS-203-GATE-005: ML-KEM-512 (Category 1) is deprecated for general workloads; target ML-KEM-768 or ML-KEM-1024 in Phase 2."
}

deny contains msg if {
	input.tls.allow_classical_fallback == true
	input.tls.enforce_pqc == true
	msg := "FIPS-203-GATE-006: allow_classical_fallback cannot be true when enforce_pqc is enabled."
}

# 2. Cloud Build / Cloud Run Checks (cloudbuild.yaml)
deny contains msg if {
	some step in input.steps
	some arg in step.args
	contains(arg, "UPSTREAM_LLM_URL=http://")
	msg := sprintf("FIPS-203-GATE-007: Plaintext HTTP upstream detected in cloudbuild.yaml arg '%s'; HTTPS is required.", [arg])
}

deny contains msg if {
	some step in input.steps
	some arg in step.args
	contains(arg, "NODE_TLS_REJECT_UNAUTHORIZED=0")
	msg := "FIPS-203-GATE-008: NODE_TLS_REJECT_UNAUTHORIZED=0 is forbidden in Cloud Run deployments."
}

warn contains msg if {
	input.steps
	not input.options.logging
	msg := "FIPS-203-GATE-009: cloudbuild.yaml is missing options.logging (recommended: CLOUD_LOGGING_ONLY)."
}

# 3. Dockerfile Checks
deny contains msg if {
	some cmd in input
	lower(cmd.Cmd) == "env"
	some val in cmd.Value
	contains(upper(val), "NODE_TLS_REJECT_UNAUTHORIZED=0")
	msg := "FIPS-203-GATE-010: Dockerfile sets NODE_TLS_REJECT_UNAUTHORIZED=0."
}

warn contains msg if {
	some cmd in input
	lower(cmd.Cmd) == "run"
	some val in cmd.Value
	contains(val, "curl ")
	contains(val, "http://")
	not contains(val, "http://localhost")
	not contains(val, "http://127.0.0.1")
	msg := sprintf("FIPS-203-GATE-011: Unencrypted curl over HTTP detected in Dockerfile RUN instruction: %s", [val])
}
