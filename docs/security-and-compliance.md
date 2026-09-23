# Security, Privacy & Compliance Architecture

This document specifies the security controls, data protection mechanisms, and compliance workflows implemented across RideDriveAhead, specifically addressing sensitive driver government IDs (Aadhaar, PAN, Driving License) and digital personal data protection laws (DPDP Act).

---

## 1. KYC Document Vault Architecture (AES-256-GCM)

Sensitive government identity documents are **never stored in raw plaintext** within transactional database tables.

```
[ Driver Uploads Document (Aadhaar/PAN/DL) ]
                    │
                    ▼
[ PBKDF2 Key Derivation (HMAC-SHA256, 65,536 iterations) ]
                    │
                    ▼
[ AES-256-GCM Authenticated Encryption ] ── 12-byte random IV + 128-bit GCM tag
                    │
                    ▼
┌──────────────────────────────────────────────┐
│ KYC Vault Database Record                    │
│ - masked_number: "XXXX-XXXX-3019"            │
│ - vault_document_id: "VAULT-AADHAAR-uuid"    │
│ - encrypted_payload: [salt + iv + ciphertext]│
└──────────────────────────────────────────────┘
```

### Key Derivation & Cryptographic Specifications:
- **Cipher**: `AES/GCM/NoPadding` (Galois/Counter Mode provides both confidentiality and tamper-resistant cryptographic authenticity).
- **Key Length**: 256 bits.
- **Salt**: 16 cryptographically secure random bytes generated per encryption.
- **IV (Initialization Vector)**: 12 random bytes per encryption.
- **KDF**: PBKDF2 with HMAC-SHA256 and 65,536 iterations.

---

## 2. PII Field-Level Masking & Tokenization

Across all public APIs, logs, and frontend interfaces, sensitive driver and rider PII is masked:
- **Aadhaar**: Masked to only the last 4 digits: `XXXX-XXXX-3019`.
- **PAN**: Masked characters 6–9: `ABCDE****F`.
- **Driving License**: Middle numbers masked: `DL-04********921`.
- **Phone Numbers**: Masked in in-app calls and chats: `+91 98****3210`.

---

## 3. Tamper-Evident KYC Access Audit Logging

Every time a compliance officer or system process views, decrypts, or reviews a driver's KYC document, an immutable audit log record is created in the `kyc_audit_logs` table:

```sql
CREATE TABLE kyc_audit_logs (
    id UUID PRIMARY KEY,
    kyc_document_id UUID NOT NULL,
    actor_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL, -- "VIEW_DECRYPTED", "UPLOAD_ENCRYPTED", "APPROVE", "REJECT"
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. Role-Based Access Control (RBAC)

- **`ROLE_RIDER`**: Permitted to request rides, view upfront fares, track assigned driver, submit ratings, and trigger SOS.
- **`ROLE_DRIVER`**: Permitted to manage vehicle availability, upload encrypted KYC, view and claim scheduled pool rides, verify rider OTP, and complete trips.
- **`ROLE_ADMIN` / Compliance Officer**: Permitted to access audit-logged decrypted documents for regulatory verification.
