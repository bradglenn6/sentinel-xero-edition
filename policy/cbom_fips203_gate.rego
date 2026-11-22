package main

import rego.v1

weak_primitives := {"MD5", "SHA-1", "SHA1", "DES", "3DES", "RC4"}

# Deny broken/legacy symmetric or hash primitives in CBOM
deny contains msg if {
	input.bomFormat == "CycloneDX"
	some comp in input.components
	comp.type == "cryptographic-asset"
	some bad in weak_primitives
	contains(upper(comp.name), bad)
	msg := sprintf("CBOM-GATE-001: Broken cryptographic primitive '%s' detected in CycloneDX CBOM.", [comp.name])
}

# Warn on quantum-vulnerable classical asymmetric algorithms (NIST Quantum Level 0)
warn contains msg if {
	input.bomFormat == "CycloneDX"
	some comp in input.components
	comp.type == "cryptographic-asset"
	comp.cryptoProperties.assetType == "algorithm"
	prim := lower(object.get(comp.cryptoProperties.algorithmProperties, "primitive", ""))
	prim in {"pke", "kem", "key-agree", "signature"}
	qlevel := object.get(comp.cryptoProperties.algorithmProperties, "nistQuantumSecurityLevel", 0)
	qlevel == 0
	msg := sprintf("CBOM-GATE-002: Quantum-vulnerable asymmetric algorithm '%s' (%s) flagged for FIPS 203/204 migration.", [comp.name, prim])
}
