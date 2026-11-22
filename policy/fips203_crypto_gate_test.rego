package main

import rego.v1

test_valid_fips203_config_passes if {
	cfg := {"tls": {
		"min_version": "1.3",
		"kex_groups": ["X25519MLKEM768", "ML-KEM-1024"],
		"enforce_pqc": true,
		"allow_classical_fallback": false,
	}}
	count(deny) == 0 with input as cfg
	count(warn) == 0 with input as cfg
}

test_tls_1_2_is_denied if {
	cfg := {"tls": {
		"min_version": "1.2",
		"kex_groups": ["X25519MLKEM768"],
	}}
	count(deny) > 0 with input as cfg
}

test_rsa_kex_is_denied if {
	cfg := {"tls": {
		"min_version": "1.3",
		"kex_groups": ["TLS_RSA_WITH_AES_256_GCM_SHA384"],
	}}
	count(deny) > 0 with input as cfg
}

test_ml_kem_512_warns if {
	cfg := {"tls": {
		"min_version": "1.3",
		"kex_groups": ["X25519MLKEM768", "ML-KEM-512"],
	}}
	count(deny) == 0 with input as cfg
	count(warn) == 1 with input as cfg
}

test_cloudbuild_plaintext_upstream_is_denied if {
	cb := {"steps": [{"args": ["--set-env-vars=UPSTREAM_LLM_URL=http://insecure.local"]}]}
	count(deny) > 0 with input as cb
}
