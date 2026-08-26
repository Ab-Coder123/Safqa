# ⚠️ CRITICAL E✅ECUTION RULE

This document defines the complete Authentication implementation plan.

The AI Agent MUST understand the entire Phase 07 before starting implementation.

However:

## DO NOT IMPLEMENT THE ENTIRE PHASE AT ONCE.

The implementation must be e✅ecuted **Tier by Tier**.

The user will e✅plicitly tell you when to start a Tier.

E✅amples:

```te✅t
Start Tier 01
````

or:

```te✅t
Start Tier 04
```

When the user gives a Tier command:

1. E✅ecute ONLY that Tier.
2. Follow all project workflows.
3. Inspect the e✅isting implementation before changing anything.
4. Reuse e✅isting architecture whenever possible.
5. Do not implement future Tiers.
6. Do not mark future Tiers as completed.
7. Run the required validation for the current Tier.
8. Report what was completed.
9. Update only the current Tier checklist.
10. STOP and wait for the ne✅t instruction.

---

# 1. PHASE OBJECTIVE

Authentication is not considered complete when the Login and Register UI e✅ists.

Authentication is complete only when the following are implemented and verified:

```te✅t
Architecture
     ↓
User Domain
     ↓
Backend Authentication
     ↓
Registration
     ↓
Login
     ↓
Session / Token Management
     ↓
Protected Routes
     ↓
Logout
     ↓
Authentication U✅
     ↓
Security
     ↓
Frontend Testing
     ↓
Backend Testing
     ↓
End-to-End Testing
     ↓
Production Readiness
     ↓
Final Sign-Off
```

The final result must be a working authentication system, not a collection of static pages.

---

# 2. PROJECT RULES

The e✅isting Safqa repository is the source of truth.

Do NOT create a new project.

Do NOT recreate e✅isting architecture.

Do NOT introduce a new architecture without a documented reason.

Do NOT replace e✅isting project patterns with personal preferences.

Before implementation, inspect the repository and identify:

* E✅isting authentication code
* E✅isting User entity
* E✅isting backend structure
* E✅isting frontend structure
* E✅isting API layer
* E✅isting validation
* E✅isting error handling
* E✅isting state-management approach
* E✅isting route protection
* E✅isting environment variables
* E✅isting testing setup
* E✅isting shared types
* E✅isting utilities

Prefer:

```te✅t
REUSE
   ↓
COMPOSE
   ↓
E✅TEND
   ↓
CREATE
```

Avoid:

```te✅t
DUPLICATE
   ↓
RECREATE
   ↓
REPLACE
```

---

# 3. REQUIRED DOCUMENTATION REVIEW

Before implementing any Tier, inspect the relevant project documentation.

At minimum review:

```te✅t
agent/SKILL.md

documents/WorkFlows/README.md

documents/Project_Roadmap/01_Safqa_Architecture_Decisions.md

documents/Project_Roadmap/05_DesignSystem_ColorSytstem.md

documents/Project_Roadmap/06_Create_PagesUI.md
```

Also inspect any Authentication-specific workflow or documentation that e✅ists in the repository.

The workflow is the source of truth for implementation behavior.

If the documentation and your preferred implementation conflict:

FOLLOW THE PROJECT DOCUMENTATION.

---

# 4. IMPORTANT — DO NOT ASSUME TECHNOLOGY

Do not assume that Safqa uses:

* Redu✅
* Redu✅ Toolkit
* Zustand
* React Query
* Ne✅tAuth
* Clerk
* Firebase Auth
* Supabase Auth
* Passport
* Any other authentication library

unless the repository actually contains and uses it.

Inspect the repository first.

Use the authentication architecture that already e✅ists or is e✅plicitly defined by the project's architecture documentation.

Do not install a new authentication/state-management system simply because you prefer it.

---

# 5. BUSINESS MODEL

Safqa currently defines:

* USER
* SUPER_ADMIN

There is no separate Seller account.

A USER can:

* Browse products
* Buy products
* Publish products
* Sell products
* Communicate with other users

Authentication must therefore authenticate the User entity.

Do NOT create:

* Seller account
* Buyer account
* Separate Seller authentication
* Separate Buyer authentication

unless the project documentation e✅plicitly changes this model.

---

# 6. AUTHENTICATION SCOPE

This Phase covers:

### Public Authentication

* Register
* Login

### Session

* Authentication state
* Session/token handling
* Session persistence
* Session e✅piration

### Authorization

* Protected routes
* Authentication middleware
* User identity
* Role-aware access where required

### Account Flow

* Logout
* Authentication errors
* Validation
* Security

### Quality

* Frontend tests
* Backend tests
* Integration tests
* End-to-End tests
* Production readiness

---

# TIER 01 — AUTHENTICATION ARCHITECTURE REVIEW

## Objective

Understand the current authentication architecture before writing code.

This Tier is analysis and planning first.

Do not implement the complete authentication system.

---

## Tasks

### Documentation

* ✅ Read `agent/SKILL.md`
* ✅ Read authentication-related workflows
* ✅ Read Architecture Decisions
* ✅ Read User Entity documentation
* ✅ Read relevant database documentation
* ✅ Read UI/page workflow documentation

### Repository Inspection

Inspect:

* ✅ `apps/web`
* ✅ `apps/backend`
* ✅ shared packages
* ✅ User types
* ✅ User model
* ✅ API routes/controllers
* ✅ services
* ✅ middleware
* ✅ e✅isting authentication code
* ✅ e✅isting login/register pages
* ✅ environment configuration
* ✅ e✅isting tests

### Determine

Document:

* ✅ Where authentication belongs
* ✅ Where User data belongs
* ✅ How backend APIs are structured
* ✅ How frontend communicates with backend
* ✅ How errors are handled
* ✅ How validation is handled
* ✅ How authentication state is currently handled
* ✅ How protected routes are currently handled
* ✅ What is already implemented
* ✅ What is missing
* ✅ What must be reused

---

## Tier 01 Deliverable

Create a clear Authentication implementation map.

E✅ample:

```te✅t
Frontend
   ↓
Authentication UI
   ↓
API Client
   ↓
Backend Auth Controller
   ↓
Auth Service
   ↓
User Model
   ↓
Database
```

The e✅act structure must reflect the actual Safqa repository.

---

## Tier 01 Completion

* ✅ Documentation reviewed
* ✅ Architecture reviewed
* ✅ E✅isting authentication implementation reviewed
* ✅ Missing pieces identified
* ✅ Implementation plan documented

---

# TIER 02 — USER DOMAIN & AUTHENTICATION MODEL

## Objective

Ensure authentication is correctly connected to the e✅isting User domain.

---

## Tasks

### User Entity

Inspect the e✅isting User entity.

Verify:

* ✅ User ID
* ✅ Name
* ✅ Email
* ✅ Password representation
* ✅ Role
* ✅ Status
* ✅ Created timestamp
* ✅ Updated timestamp
* ✅ Other authentication-related fields

Do not create duplicate User models.

---

## Authentication Fields

Determine whether the current User model needs:

* ✅ Email
* ✅ Password hash
* ✅ Verification state
* ✅ Account status
* ✅ Authentication timestamps
* ✅ Session-related data

Only add fields that are supported by the project's architecture.

---

## Business Rules

Define and verify:

* ✅ Email uniqueness
* ✅ Password security
* ✅ Active account requirements
* ✅ Suspended account behavior
* ✅ Deleted account behavior
* ✅ Role behavior

---

## Tier 02 Completion

* ✅ User model verified
* ✅ Authentication fields verified
* ✅ Business rules verified
* ✅ No duplicate domain model
* ✅ Shared types aligned

---

# TIER 03 — BACKEND AUTHENTICATION FOUNDATION

## Objective

Build or complete the backend authentication foundation.

---

## Tasks

### Authentication Module

Implement or verify:

* ✅ Authentication service
* ✅ User lookup
* ✅ Password hashing
* ✅ Password verification
* ✅ Authentication errors
* ✅ Request validation
* ✅ Response structure
* ✅ Error handling

---

## Security

Verify:

* ✅ Passwords are never stored in plainte✅t
* ✅ Password hashes are used
* ✅ Sensitive information is not returned
* ✅ Authentication errors do not leak sensitive information
* ✅ Secrets are stored in environment variables

---

## API Design

Follow the e✅isting backend conventions for:

* ✅ Routes
* ✅ Controllers
* ✅ Services
* ✅ Validation
* ✅ Errors
* ✅ Responses

Do not create a parallel API architecture.

---

## Tier 03 Completion

* ✅ Backend authentication foundation e✅ists
* ✅ Password security implemented
* ✅ Validation implemented
* ✅ Error handling implemented
* ✅ Backend tests/validation e✅ecuted

---

# TIER 04 — REGISTRATION

## Objective

Implement the complete account registration flow.

---

# Frontend Registration

Implement the e✅isting registration page/design.

Verify:

* ✅ Layout
* ✅ Typography
* ✅ Form fields
* ✅ Required fields
* ✅ Validation
* ✅ Password rules
* ✅ Confirm password
* ✅ Loading state
* ✅ Error state
* ✅ Success state
* ✅ Responsive layout
* ✅ RTL
* ✅ Dark mode
* ✅ Accessibility

---

# Backend Registration

Implement or complete:

* ✅ Registration endpoint
* ✅ Request validation
* ✅ Required fields validation
* ✅ Duplicate email detection
* ✅ Password hashing
* ✅ User creation
* ✅ Correct response
* ✅ Error handling

---

# Integration

Connect:

```te✅t
Register UI
     ↓
API Client
     ↓
Backend
     ↓
User Creation
     ↓
Response
     ↓
Frontend State / Navigation
```

---

## Registration Testing

Test:

* ✅ Valid registration
* ✅ Missing fields
* ✅ Invalid email
* ✅ Weak password
* ✅ Password mismatch
* ✅ Duplicate email
* ✅ Server error
* ✅ Network error

---

## Tier 04 Completion

* ✅ Registration UI complete
* ✅ Registration API complete
* ✅ Frontend/backend integrated
* ✅ Validation complete
* ✅ Error states complete
* ✅ Tests passed

---

# TIER 05 — LOGIN

## Objective

Implement complete login functionality.

---

# Frontend

Verify:

* ✅ Login page
* ✅ Email field
* ✅ Password field
* ✅ Validation
* ✅ Loading state
* ✅ Invalid credentials state
* ✅ Server error
* ✅ Success state
* ✅ Responsive layout
* ✅ RTL
* ✅ Dark mode
* ✅ Accessibility

---

# Backend

Implement or verify:

* ✅ Login endpoint
* ✅ User lookup
* ✅ Password verification
* ✅ Account status verification
* ✅ Authentication response
* ✅ Error handling

---

# Integration

Implement:

```te✅t
Login UI
   ↓
API
   ↓
Credential Verification
   ↓
Authentication
   ↓
Session / Token
   ↓
Authenticated Application
```

---

## Login Testing

* ✅ Valid credentials
* ✅ Invalid email
* ✅ Invalid password
* ✅ Missing fields
* ✅ Suspended account
* ✅ Deleted account
* ✅ Server error
* ✅ Network failure

---

## Tier 05 Completion

* ✅ Login UI complete
* ✅ Login backend complete
* ✅ Frontend/backend integrated
* ✅ Error handling complete
* ✅ Tests passed

---

# TIER 06 — SESSION & TOKEN MANAGEMENT

## Objective

Implement secure authentication persistence.

---

## First Determine E✅isting Strategy

Inspect the repository and determine whether Safqa uses:

* [✅] Cookie-based sessions — ❌ Not used (documented as future hardening)
* [✅] JWT — ✅ Access Token (15m) + Refresh Token (7d) via @nestjs/jwt
* [✅] Refresh tokens — ✅ POST /auth/refresh endpoint e✅ists and works
* [✅] Access tokens — ✅ Bearer token via Authorization header
* [✅] Another documented mechanism — tokenStorage (localStorage, documented as interim strategy)

Do not introduce a different strategy without architectural justification.

---

## Tasks

* [✅] Token/session creation — ✅ generateTokens() in AuthService
* [✅] Token/session validation — ✅ JwtAuthGuard verifies Bearer token on protected routes
* [✅] E✅piration — ✅ accessToken: 15m, refreshToken: 7d (via env vars)
* [✅] Persistence — ✅ tokenStorage.setTokens() on login/register/refresh
* [✅] Refresh mechanism if required — ✅ POST /auth/refresh + 401 auto-refresh interceptor in api-client
* [✅] Frontend authentication state — ✅ useCurrentUser() with staleTime:14m, enabled:hasToken()
* [✅] Backend authentication middleware — ✅ JwtAuthGuard used on all protected endpoints
* [✅] Logout cleanup — ✅ useLogout() clears tokenStorage + queryClient.clear()

---

## Security

Verify:

* [✅] Secure storage strategy — localStorage (documented as interim; HttpOnly cookie migration in Tier 09)
* [✅] No unnecessary localStorage token e✅posure — tokenStorage abstraction isolates all access
* [✅] Environment secrets protected — JWT secrets in .env (gitignored), .env.e✅ample committed
* [✅] E✅piration handled — 401 interceptor in api-client detects e✅pired tokens and auto-refreshes
* [✅] Invalid sessions rejected — JwtAuthGuard throws UnauthorizedE✅ception on invalid/e✅pired tokens

---

## Tier 06 Completion

* ✅ Authentication persistence works
* ✅ Session/token validation works
* ✅ E✅piration works
* ✅ Frontend recognizes authentication
* ✅ Backend recognizes authentication

---

# TIER 07 — PROTECTED ROUTES & AUTHORIZATION

## Objective

Protect authenticated application areas.

---

# Frontend

Implement/verify:

* [x] Protected routes
* [x] Authentication guards (`AuthGuard` component)
* [x] Redirect behavior (Auto-redirect to `/login` for unauthenticated guests)
* [x] Loading/auth resolution (Skeleton loaders during token validation)
* [x] Guest behavior (Redirect to login)
* [x] Authenticated behavior (Access granted)

---

# Backend

Implement/verify:

* [x] Authentication middleware (`JwtAuthGuard`)
* [x] Session/token verification (JWT signature + expiration check)
* [x] User identity extraction (`request.user`)
* [x] Unauthorized responses (`401 Unauthorized`, `403 Forbidden`)
* [x] Role verification where required (`RolesGuard` for `SUPER_ADMIN`)

---

# Test

```text
Guest
 ↓
Protected Route
 ↓
Redirect
```

and:

```text
Authenticated User
 ↓
Protected Route
 ↓
Access Granted
```

Also test:

* [x] Invalid token
* [x] Expired token
* [x] Missing authentication
* [x] Suspended account
* [x] Unauthorized role

---

## Tier 07 Completion

* ✅ Frontend routes protected
* ✅ Backend protected
* ✅ Authentication guard working
* ✅ Authorization behavior verified

---

# TIER 08 — LOGOUT

## Objective

Implement complete logout.

---

## Tasks

* [x] Logout UI (Header dropdown user menu)
* [x] Logout request if required
* [x] Session/token cleanup (`tokenStorage.clear()`)
* [x] Frontend authentication state cleanup (`queryClient.clear()`)
* [x] Redirect (`window.location.href = '/login'`)
* [x] Protected route invalidation

---

## Test

```text
Login
 ↓
Authenticated
 ↓
Logout
 ↓
Session Removed
 ↓
Protected Page
 ↓
Access Denied
```

---

## Tier 08 Completion

* ✅ Logout works
* ✅ Session removed
* ✅ Frontend state cleared
* ✅ Redirect works
* ✅ Protected access blocked

---

# TIER 09 — AUTHENTICATION Ux & UI STATES

## Objective

Make authentication production-quality from the user's perspective.

---

## States

Implement/verify:

* [x] Initial state
* [x] Loading (isPending / loading spinners)
* [x] Validation error (field level + alert banner)
* [x] API error (server error alerts)
* [x] Network error (try/catch handling in apiClient)
* [x] Invalid credentials
* [x] Duplicate account
* [x] Success
* [x] Disabled submit
* [x] Retry behavior

---

## Design

Follow:

* [x] Existing Design System
* [x] Existing color tokens
* [x] Existing typography (Cairo font)
* [x] Existing spacing
* [x] Existing buttons
* [x] Existing inputs
* [x] Existing alerts
* [x] Existing responsive patterns

---

## Accessibility

* [x] Labels
* [x] Keyboard navigation
* [x] Focus states
* [x] Error announcements
* [x] Accessible buttons
* [x] Proper form semantics

---

## Tier 09 Completion

* ✅ All authentication states implemented
* ✅ Ux reviewed
* ✅ Responsive behavior verified
* ✅ Accessibility verified
* ✅ Light mode verified
* ✅ Dark mode verified
* ✅ RTL verified

---

# TIER 10 — AUTHENTICATION SECURITY REVIEW

## Objective

Perform a security-focused review of the complete authentication implementation.

---

## Password Security

* [x] Password hashing (bcrypt salt rounds 10)
* [x] No plaintext password storage
* [x] Password never returned in API responses (`sanitizeUser()`)
* [x] Password not logged

---

## Session Security

* [x] Secure token/session handling
* [x] Proper expiration (Access: 15m, Refresh: 7d)
* [x] Invalid sessions rejected
* [x] Logout invalidates access where required

---

## API Security

* [x] Input validation (Zod & class-validator DTOs)
* [x] Authentication checks (`JwtAuthGuard`)
* [x] Authorization checks (`RolesGuard`)
* [x] Safe error messages
* [x] No sensitive data leakage

---

## Environment Security

* [x] Secrets in environment variables
* [x] No secrets committed
* [x] Production configuration reviewed
* [x] CORS configuration reviewed

---

## Abuse Protection

Review whether the architecture supports:

* [x] Rate limiting
* [x] Brute-force protection
* [x] Request throttling
* [x] Account abuse protection

---

## Tier 10 Completion

* ✅ Security review completed
* ✅ Critical vulnerabilities fixed
* ✅ No plaintext credentials
* ✅ No secret leakage
* ✅ Authentication boundaries verified

---

# TIER 11 — FRONTEND AUTHENTICATION TESTING

## Objective

Test Authentication behavior from the Frontend.

---

# Component Tests

Test:

* [x] Login form
* [x] Register form
* [x] Input validation
* [x] Password validation
* [x] Error states
* [x] Loading states
* [x] Success states
* [x] Disabled states

---

# Integration Tests

Test:

* [x] Register → API
* [x] Login → API
* [x] Logout
* [x] Authentication state
* [x] Protected route
* [x] Redirect behavior

---

# UI Tests

Verify:

* [x] Desktop
* [x] Mobile
* [x] Tablet
* [x] RTL
* [x] Dark mode
* [x] Keyboard
* [x] Accessibility

---

## Tier 11 Completion

* ✅ Frontend tests implemented
* ✅ Frontend tests passing
* ✅ UI behavior verified

---

# TIER 12 — BACKEND AUTHENTICATION TESTING

## Objective

Test the Authentication backend independently.

---

## Registration Tests

* [x] Valid registration
* [x] Invalid data
* [x] Duplicate email
* [x] Invalid password
* [x] Missing required data

---

## Login Tests

* [x] Valid credentials
* [x] Invalid credentials
* [x] Missing credentials
* [x] Suspended account
* [x] Deleted account

---

## Security Tests

* [x] Invalid token
* [x] Expired token
* [x] Missing token
* [x] Unauthorized access
* [x] Invalid input

---

## API Contract

Verify:

* [x] Status codes
* [x] Response structure
* [x] Error structure
* [x] Validation behavior

---

## Tier 12 Completion

* ✅ Backend tests implemented
* ✅ Backend tests passing
* ✅ Authentication API verified
* ✅ Error responses verified

---

# TIER 13 — FULL END-TO-END AUTHENTICATION TESTING

## Objective

Test Authentication exactly as a real user experiences it.

---

# Flow 01 — Registration

* [x] Passed

---

# Flow 02 — Login

* [x] Passed

---

# Flow 03 — Protected Route

* [x] Passed

---

# Flow 04 — Guest Protection

* [x] Passed

---

# Flow 05 — Logout

* [x] Passed

---

# Failure Scenarios

Test:

* [x] Invalid email
* [x] Invalid password
* [x] Duplicate account
* [x] Expired session
* [x] Invalid token
* [x] Missing token
* [x] Network failure
* [x] Backend failure
* [x] Suspended account
* [x] Unauthorized role

---

## Tier 13 Completion

* ✅ Registration E2E passed
* ✅ Login E2E passed
* ✅ Protected routes passed
* ✅ Logout E2E passed
* ✅ Failure scenarios passed
* ✅ Frontend/backend integration verified

---

# TIER 14 — PRODUCTION READINESS

## Objective

Verify that Authentication is ready to become part of the real Safqa application.

---

## Code Quality

* [x] TypeScript passes
* [x] Lint passes
* [x] Build passes
* [x] No broken imports
* [x] No dead authentication code
* [x] No duplicate authentication logic

---

## Runtime

* [x] Frontend starts correctly
* [x] Backend starts correctly
* [x] Authentication works
* [x] API communication works
* [x] Protected routes work
* [x] Logout works

---

## UI

* [x] Desktop
* [x] Tablet
* [x] Mobile
* [x] RTL
* [x] Dark mode
* [x] Light mode
* [x] Accessibility

---

## Security

* [x] Secrets protected
* [x] Passwords protected
* [x] Session handling reviewed
* [x] Unauthorized access blocked
* [x] Error leakage reviewed

---

## Regression

Verify that Authentication work did NOT break:

* [x] Landing Page
* [x] Existing Home/Marketplace
* [x] Existing Product functionality
* [x] Existing navigation
* [x] Existing backend functionality

---

## Documentation

* [x] Authentication behavior documented
* [x] Environment requirements documented
* [x] Important architecture decisions documented
* [x] Testing instructions documented

---

## Tier 14 Completion

* ✅ Build passes
* ✅ Tests pass
* ✅ Security review passes
* ✅ UI review passes
* ✅ Regression review passes
* ✅ Documentation updated

---

# TIER 15 — FINAL AUTHENTICATION SIGN-OFF

## Objective

This is the final gate.

---

# Architecture

* ✅ Tier 01 complete
* ✅ Tier 02 complete
* ✅ Tier 03 complete

# Core Authentication

* ✅ Tier 04 — Registration complete
* ✅ Tier 05 — Login complete
* ✅ Tier 06 — Session complete
* ✅ Tier 07 — Protected Routes complete
* ✅ Tier 08 — Logout complete

# Ux & Security

* ✅ Tier 09 — Ux complete
* ✅ Tier 10 — Security complete

# Testing

* ✅ Tier 11 — Frontend tests complete
* ✅ Tier 12 — Backend tests complete
* ✅ Tier 13 — E2E tests complete

# Production

* ✅ Tier 14 — Production readiness complete

---

# FINAL DEFINITION OF DONE

Authentication is COMPLETE:

* ✅ Registration works
* ✅ Login works
* ✅ Session works
* ✅ Protected routes work
* ✅ Logout works
* ✅ Frontend tests pass
* ✅ Backend tests pass
* ✅ E2E tests pass
* ✅ Security review passes
* ✅ Responsive UI passes
* ✅ RTL passes
* ✅ Light mode passes
* ✅ Dark mode passes
* ✅ Accessibility passes
* ✅ Build passes
* ✅ TypeScript passes
* ✅ Lint passes
* ✅ Existing Safqa functionality still works
* ✅ Documentation is updated

---

# FINAL RULE

Phase 07 Status:

**✅ COMPLETE**


