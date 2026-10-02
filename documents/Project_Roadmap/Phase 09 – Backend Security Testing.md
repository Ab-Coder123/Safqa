# Phase 09 – Backend Security Testing & Hardening

## Status
ACTIVE / IN PROGRESS

## Previous Phase
Phase 08 – Product & Marketplace Capability

## Objective

Phase 09 focuses exclusively on end-to-end **Backend Security Testing, Vulnerability Verification, and Hardening** for the Safqa NestJS + Prisma + PostgreSQL API.

The goal is to test the platform against real-world attack vectors, simulate malicious actors across all system layers, enforce the OWASP API Security Top 10 standards, and produce detailed audit reports upon the completion of every tier.

---

# 1. Mandatory Workflow & Governance Rules

Before starting any Tier, the agent MUST review:

1. `agent/SKILL.md`
2. `documents/WorkFlows/System/Backend_Architecture_Workflow.md`
3. `documents/WorkFlows/System/Error_Handling_Workflow.md`
4. `documents/WorkFlows/System/Permission_Workflow.md`
5. `documents/WorkFlows/User/Authentication_Workflow.md`
6. `documents/WorkFlows/System/File_Upload_Workflow.md`

### ⚠️ MANDATORY RULE ACROSS ALL TIERS:
> **For EVERY completed Tier, the agent MUST deliver a comprehensive Security Audit & Test Report directly to the user before proceeding to the next Tier.**
> The report must detail:
> - Tests executed & scenarios simulated
> - Discovered vulnerabilities or risks
> - Applied code hardening & patches
> - Verification status (PASS / FAIL)

---

# 2. Security Testing Matrix (10 Tiers)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SAFQA BACKEND SECURITY MATRIX                   │
├─────────┬──────────────────────────────────────────────────────────────┤
│ Tier 01 │ JWT Authentication & Session Hardening                       │
│ Tier 02 │ Authorization, Broken Object Level Auth (BOLA/IDOR) & RBAC   │
│ Tier 03 │ Input Validation, Sanitization & Injection Defense           │
│ Tier 04 │ Rate Limiting, Throttling & Brute-Force Mitigation           │
│ Tier 05 │ Password Hashing, Credentials Lifecycle & OTP Flow Security  │
│ Tier 06 │ File Upload, Media Processing & Path Traversal Defense       │
│ Tier 07 │ Data Exposure, PII Protection & Error Response Scrubbing     │
│ Tier 08 │ CORS, HTTP Security Headers & Network Defense                │
│ Tier 09 │ Business Logic Abuse, Race Conditions & State Integrity      │
│ Tier 10 │ Database Layer, Prisma Security & Mass Assignment Defense    │
└─────────┴──────────────────────────────────────────────────────────────┘
```

---

## Tier 01: JWT Authentication & Session Hardening

### Objective
Ensure that authentication tokens cannot be forged, bypassed, tampered with, or reused after expiration.

### Attack Scenarios & Workflow Steps:
1. **Scenario 1.1: None-Algorithm & Signature Tampering**
   - Attempt sending a JWT with `"alg": "none"` header to bypass verification.
   - Attempt modifying payload (e.g. changing `sub` or `role`) without updating the HMAC signature.
   - Expected: `401 Unauthorized` with signature verification failure.

2. **Scenario 1.2: Expired Access Token Rejection**
   - Attempt accessing protected endpoints (`/users/me/profile`, `/products`, `/conversations`) with an expired access token (`exp` < current time).
   - Expected: `401 Unauthorized` with structured error response.

3. **Scenario 1.3: Token Secret Separation & Type Confusion**
   - Attempt using a `RefreshToken` to authenticate against an endpoint guarded by `JwtAuthGuard` (Access Token guard).
   - Attempt using an `AccessToken` on the `/auth/refresh` endpoint.
   - Expected: `401 Unauthorized` due to distinct signing secrets and token type claims.

4. **Scenario 1.4: Revoked / Invalidated Refresh Token Flow**
   - Refresh tokens must be single-use or rotate properly upon session logout.
   - Test sending malformed or randomly generated tokens.

### Tasks:
- [ ] Create automated security test suite `apps/backend/test/security/tier01-jwt-auth.security-spec.ts`.
- [ ] Verify `JwtAuthGuard` strict secret separation.
- [ ] **MANDATORY FINAL TASK:** Deliver Tier 01 Security Audit Report to the user.

---

## Tier 02: Authorization, BOLA / IDOR & RBAC Controls

### Objective
Prevent Broken Object Level Authorization (IDOR) where User A accesses, modifies, or deletes resources belonging to User B. Enforce strict Role-Based Access Control (RBAC).

### Attack Scenarios & Workflow Steps:
1. **Scenario 2.1: Horizontal Privilege Escalation (Product Modification / Deletion)**
   - User A creates Product #1.
   - User B sends `PATCH /products/:product1_id` or `DELETE /products/:product1_id` with valid User B JWT.
   - Expected: `403 Forbidden` with ownership violation error.

2. **Scenario 2.2: Conversation & Private Message Eavesdropping**
   - User A and User B have a conversation.
   - User C attempts `GET /conversations/:id/messages` or `POST /conversations/:id/messages`.
   - Expected: `403 Forbidden` or `404 Not Found` (non-participant isolation).

3. **Scenario 2.3: Vertical Privilege Escalation (Admin Route Breach)**
   - Standard user attempts accessing `/admin/users`, `/admin/stats`, `/categories` (POST/PATCH/DELETE), `/reports/admin`.
   - Expected: `403 Forbidden` enforced by `RolesGuard(UserRole.SUPER_ADMIN)`.

4. **Scenario 2.4: Favorites & User Settings Boundary Test**
   - User A attempts removing or querying User B's private notification stream or favorites.

### Tasks:
- [ ] Create automated security test suite `apps/backend/test/security/tier02-authorization-idor.security-spec.ts`.
- [ ] Verify ownership guards across Products, Conversations, Media, and Reports.
- [ ] **MANDATORY FINAL TASK:** Deliver Tier 02 Security Audit Report to the user.

---

## Tier 03: Input Validation, Sanitization & Injection Defense

### Objective
Guarantee that all inputs across endpoints are strictly typed, whitelisted, sanitized, and immune to SQL/NoSQL injections and XSS payloads.

### Attack Scenarios & Workflow Steps:
1. **Scenario 3.1: Strict Whitelist & Malicious Field Stripping**
   - Send unexpected or malicious fields in DTO payloads (e.g., `{ "title": "Car", "role": "SUPER_ADMIN", "is_verified": true }`).
   - Expected: ValidationPipe (`whitelist: true`, `forbidNonWhitelisted: true`) immediately rejects with `400 Bad Request`.

2. **Scenario 3.2: SQL / Query Injection in Search & Filter Parameters**
   - Test endpoints (`GET /products?q=' OR 1=1 --`, `GET /products?category='; DROP TABLE products;--`).
   - Expected: Safe parameterized Prisma queries prevent any injection; returns clean empty list or valid results.

3. **Scenario 3.3: Stored XSS & Script Injection in Text Fields**
   - Send `<script>alert('XSS')</script>`, `<img src=x onerror=alert(1)>`, and JavaScript URLs in `title`, `description`, `message.content`.
   - Expected: Backend safely stores string without code execution; output escaping prevents HTML execution on clients.

4. **Scenario 3.4: Extreme Payload & Boundary Values**
   - Test negative numbers for `price`, astronomical integers, null bytes (`%00`), extremely long strings (100k characters).

### Tasks:
- [ ] Create automated security test suite `apps/backend/test/security/tier03-injection-validation.security-spec.ts`.
- [ ] Verify global `ValidationPipe` configuration and DTO constraints (`class-validator`).
- [ ] **MANDATORY FINAL TASK:** Deliver Tier 03 Security Audit Report to the user.

---

## Tier 04: Rate Limiting, Throttling & Brute-Force Mitigation

### Objective
Prevent Denial of Service (DoS), automated endpoint scraping, credential stuffing, and brute-force password/OTP guessing.

### Attack Scenarios & Workflow Steps:
1. **Scenario 4.1: Login Endpoint Brute-Force Defense**
   - Fire 50 rapid `POST /auth/login` requests with incorrect credentials within 10 seconds.
   - Expected: `429 Too Many Requests` triggered by rate-limiting middleware (`ThrottlerGuard`).

2. **Scenario 4.2: Registration & Account Creation Flooding**
   - Fire high-frequency `POST /auth/register` calls to exhaust DB connections or storage.
   - Expected: Rate limiter throttles excess requests.

3. **Scenario 4.3: Password Reset & OTP Generation Spam**
   - Rapidly request OTPs via `POST /auth/forgot-password` for the same email/phone.
   - Expected: Rate limiting and cooldown windows prevent SMS/Email abuse.

4. **Scenario 4.4: Chat Message Flooding**
   - Send 50 messages per second in a conversation.
   - Expected: Rate limiting protects DB from chat spam.

### Tasks:
- [ ] Create automated security test suite `apps/backend/test/security/tier04-rate-limiting.security-spec.ts`.
- [ ] Implement and verify `@nestjs/throttler` with specific route configurations.
- [ ] **MANDATORY FINAL TASK:** Deliver Tier 04 Security Audit Report to the user.

---

## Tier 05: Password Hashing, Credentials Lifecycle & OTP Security

### Objective
Ensure secure password hashing, secure storage, non-reusable OTPs, and strict verification during credential lifecycle changes.

### Attack Scenarios & Workflow Steps:
1. **Scenario 5.1: Strong Hashing Algorithm & Salt Verification**
   - Verify that passwords are hashed using Argon2id or Bcrypt with appropriate work factors.
   - Confirm plaintext passwords are never logged or stored.

2. **Scenario 5.2: OTP Expiration & Single-Use Enforcement**
   - Request OTP -> Wait past TTL (e.g., > 10 minutes) -> Attempt verification.
   - Expected: `400 Bad Request` (OTP expired).
   - Use valid OTP once -> Attempt reusing the same OTP code again.
   - Expected: `400 Bad Request` (OTP invalidated upon first use).

3. **Scenario 5.3: OTP Brute-Force Resistance**
   - Attempt guessing a 6-digit OTP code with multiple concurrent requests.
   - Expected: Account/session temporary lockout after 5 failed attempts.

4. **Scenario 5.4: Reset Password Token Hijack Prevention**
   - Attempt resetting password without completing OTP verification.
   - Attempt setting a weak password (e.g., 3 characters, missing complexity).

### Tasks:
- [ ] Create automated security test suite `apps/backend/test/security/tier05-password-otp.security-spec.ts`.
- [ ] Audit OTP storage, expiration timestamps, and retry counter limits.
- [ ] **MANDATORY FINAL TASK:** Deliver Tier 05 Security Audit Report to the user.

---

## Tier 06: File Upload, Media Processing & Path Traversal Defense

### Objective
Prevent malicious file execution (webshells, polyglot files, executable binaries), storage exhaustion, and directory traversal vulnerabilities.

### Attack Scenarios & Workflow Steps:
1. **Scenario 6.1: Executable & Script Upload Blocking**
   - Attempt uploading `.php`, `.exe`, `.sh`, `.js`, `.svg` (with embedded scripts), `.html` files disguised as images.
   - Expected: `400 Bad Request` (strict MIME and extension whitelist: JPEG, PNG, WEBP).

2. **Scenario 6.2: File Size Enforcement (Max 5MB)**
   - Upload a 6MB image file.
   - Expected: Immediate `400 Bad Request` before consuming server memory.

3. **Scenario 6.3: Directory Traversal via Filename Manipulation**
   - Send upload with filename `../../../../etc/passwd` or `..\\..\\main.js`.
   - Expected: Server completely discards client filename and assigns a cryptographically secure UUID (`randomUUID()`).

4. **Scenario 6.4: Maximum Media Limits per Entity**
   - Attempt attaching > 5 images to a single product.
   - Expected: `400 Bad Request` enforcing business constraints.

### Tasks:
- [ ] Create automated security test suite `apps/backend/test/security/tier06-file-upload.security-spec.ts`.
- [ ] Audit `MediaService` upload sanitization, UUID generation, and static file serving boundaries.
- [ ] **MANDATORY FINAL TASK:** Deliver Tier 06 Security Audit Report to the user.

---

## Tier 07: Data Exposure, PII Protection & Error Response Scrubbing

### Objective
Ensure no sensitive data (PII, hashed credentials, internal tokens, server infrastructure details) leaks in API responses or logs.

### Attack Scenarios & Workflow Steps:
1. **Scenario 7.1: Password Hash & Secret Exclusion**
   - Inspect responses of `GET /users/me/profile`, `GET /users/:id/profile`, `GET /auth/login`, `GET /products/:id`.
   - Verify `password_hash`, `refresh_token`, `otp_code` are NEVER present in JSON response bodies.

2. **Scenario 7.2: Production Error Scrubbing (No Stack Traces)**
   - Trigger unhandled database errors or 500 exceptions in `NODE_ENV=production`.
   - Expected: Generic message (`"Internal server error"`), zero stack traces, no internal database schema leakage in HTTP responses.

3. **Scenario 7.3: User Privacy (PII Protection)**
   - Verify that other users querying a seller profile cannot see private fields (e.g. email, verification codes, internal IDs).

### Tasks:
- [ ] Create automated security test suite `apps/backend/test/security/tier07-data-exposure.security-spec.ts`.
- [ ] Audit `HttpExceptionFilter`, logging interceptors, and Prisma select/exclude schemas.
- [ ] **MANDATORY FINAL TASK:** Deliver Tier 07 Security Audit Report to the user.

---

## Tier 08: CORS, HTTP Security Headers & Network Defense

### Objective
Enforce strict browser-level security policies, restrict cross-origin access, and prevent clickjacking, MIME-sniffing, and protocol downgrade attacks.

### Attack Scenarios & Workflow Steps:
1. **Scenario 8.1: CORS Whitelist Verification**
   - Send `OPTIONS` preflight request with unauthorized `Origin` (e.g., `https://evil-attacker.com`).
   - Expected: Rejection or exclusion of `Access-Control-Allow-Origin: *` for authenticated state-changing endpoints.

2. **Scenario 8.2: Security Headers (Helmet Inspection)**
   - Inspect HTTP response headers for:
     - `X-Content-Type-Options: nosniff`
     - `X-Frame-Options: DENY` (Clickjacking defense)
     - `Strict-Transport-Security` (HSTS enforcement)
     - `Content-Security-Policy` (CSP headers)
     - `X-XSS-Protection: 0`

3. **Scenario 8.3: HTTP Methods Restriction**
   - Test sending unexpected HTTP methods (`TRACE`, `TRACK`, `CONNECT`) against API routes.
   - Expected: `405 Method Not Allowed` or `404 Not Found`.

### Tasks:
- [ ] Create automated security test suite `apps/backend/test/security/tier08-cors-headers.security-spec.ts`.
- [ ] Configure `helmet` and fine-tuned CORS configuration in `apps/backend/src/main.ts`.
- [ ] **MANDATORY FINAL TASK:** Deliver Tier 08 Security Audit Report to the user.

---

## Tier 09: Business Logic Abuse, Race Conditions & State Integrity

### Objective
Defend against flaws in business rules, race conditions (double spending/actions), and unauthorized entity state transitions.

### Attack Scenarios & Workflow Steps:
1. **Scenario 9.1: Self-Interaction Restrictions**
   - User attempts to create a chat conversation with themselves (`user_one_id === user_two_id`).
   - User attempts to buy/favorite/report their own listing.
   - Expected: `400 Bad Request` preventing self-trading and fraud.

2. **Scenario 9.2: Illegal State Transitions**
   - Attempt to start a conversation or modify a product marked as `SOLD` or `ARCHIVED`.
   - Expected: Rejection per `Messaging_Workflow.md` & `Product_Lifecycle_Workflow.md`.

3. **Scenario 9.3: Concurrent Action / Race Condition Testing**
   - Send 10 parallel requests to favorite/unfavorite or mark a product sold at the exact same millisecond.
   - Expected: Database transactions (`$transaction`) and idempotent logic maintain consistent state without deadlocks or duplicated rows.

4. **Scenario 9.4: Price & Numeric Manipulation**
   - Test floating point inaccuracies, negative prices, NaN, and string inputs in price calculations.

### Tasks:
- [ ] Create automated security test suite `apps/backend/test/security/tier09-business-logic.security-spec.ts`.
- [ ] Verify Prisma transactions and state validation logic.
- [ ] **MANDATORY FINAL TASK:** Deliver Tier 09 Security Audit Report to the user.

---

## Tier 10: Database Layer, Prisma Security & Mass Assignment Defense

### Objective
Ensure the persistence layer is secured, Prisma queries are leak-proof, database connections use TLS/SSL, and Mass Assignment attacks cannot tamper with database entities.

### Attack Scenarios & Workflow Steps:
1. **Scenario 10.1: Mass Assignment & Privilege Tampering**
   - Attempt modifying user role from `USER` to `SUPER_ADMIN` via `PATCH /users/me/profile`.
   - Expected: DTO forbids and discards `role` mutations from standard users.

2. **Scenario 10.2: Prisma Connection Security & SSL**
   - Verify cloud Neon PostgreSQL connection requires `sslmode=require`.
   - Verify connection pooling limits prevent database connection starvation.

3. **Scenario 10.3: Database Cascade & Orphaned Records Prevention**
   - Test deleting an entity (User/Product) and ensure proper cascading or archiving per business rules without orphan dangling foreign keys.

4. **Scenario 10.4: Final Comprehensive Vulnerability Scan & Audit Summary**
   - Run all 10 security test suites concurrently.
   - Verify zero security regressions.

### Tasks:
- [ ] Create automated security test suite `apps/backend/test/security/tier10-database-mass-assignment.security-spec.ts`.
- [ ] Execute full 10-tier security regression run.
- [ ] **MANDATORY FINAL TASK:** Deliver Final Phase 09 Comprehensive Security Audit Report to the user.

---

# 3. Execution Plan & Definition of Done

Each Tier follows a strict 4-step cycle:
1. **Analyze:** Review relevant workflow and identify attack vectors.
2. **Implement Tests:** Write automated security test scenarios in `apps/backend/test/security/`.
3. **Harden & Patch:** Address any vulnerabilities found in guards, DTOs, pipes, or services.
4. **Report & Validate:** Execute test suite, produce detailed Security Audit Report, and deliver to user.
