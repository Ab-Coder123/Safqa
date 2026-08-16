# ⚠️ CRITICAL EXECUTION RULE

This document defines the complete Authentication implementation plan.

The AI Agent MUST understand the entire Phase 07 before starting implementation.

However:

## DO NOT IMPLEMENT THE ENTIRE PHASE AT ONCE.

The implementation must be executed **Tier by Tier**.

The user will explicitly tell you when to start a Tier.

Examples:

```text
Start Tier 01
````

or:

```text
Start Tier 04
```

When the user gives a Tier command:

1. Execute ONLY that Tier.
2. Follow all project workflows.
3. Inspect the existing implementation before changing anything.
4. Reuse existing architecture whenever possible.
5. Do not implement future Tiers.
6. Do not mark future Tiers as completed.
7. Run the required validation for the current Tier.
8. Report what was completed.
9. Update only the current Tier checklist.
10. STOP and wait for the next instruction.

---

# 1. PHASE OBJECTIVE

Authentication is not considered complete when the Login and Register UI exists.

Authentication is complete only when the following are implemented and verified:

```text
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
Authentication UX
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

The existing Safqa repository is the source of truth.

Do NOT create a new project.

Do NOT recreate existing architecture.

Do NOT introduce a new architecture without a documented reason.

Do NOT replace existing project patterns with personal preferences.

Before implementation, inspect the repository and identify:

* Existing authentication code
* Existing User entity
* Existing backend structure
* Existing frontend structure
* Existing API layer
* Existing validation
* Existing error handling
* Existing state-management approach
* Existing route protection
* Existing environment variables
* Existing testing setup
* Existing shared types
* Existing utilities

Prefer:

```text
REUSE
   ↓
COMPOSE
   ↓
EXTEND
   ↓
CREATE
```

Avoid:

```text
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

```text
agent/SKILL.md

documents/WorkFlows/README.md

documents/Project_Roadmap/01_Safqa_Architecture_Decisions.md

documents/Project_Roadmap/05_DesignSystem_ColorSytstem.md

documents/Project_Roadmap/06_Create_PagesUI.md
```

Also inspect any Authentication-specific workflow or documentation that exists in the repository.

The workflow is the source of truth for implementation behavior.

If the documentation and your preferred implementation conflict:

FOLLOW THE PROJECT DOCUMENTATION.

---

# 4. IMPORTANT — DO NOT ASSUME TECHNOLOGY

Do not assume that Safqa uses:

* Redux
* Redux Toolkit
* Zustand
* React Query
* NextAuth
* Clerk
* Firebase Auth
* Supabase Auth
* Passport
* Any other authentication library

unless the repository actually contains and uses it.

Inspect the repository first.

Use the authentication architecture that already exists or is explicitly defined by the project's architecture documentation.

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

unless the project documentation explicitly changes this model.

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
* Session expiration

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
* ✅ existing authentication code
* ✅ existing login/register pages
* ✅ environment configuration
* ✅ existing tests

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

Example:

```text
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

The exact structure must reflect the actual Safqa repository.

---

## Tier 01 Completion

* ✅ Documentation reviewed
* ✅ Architecture reviewed
* ✅ Existing authentication implementation reviewed
* ✅ Missing pieces identified
* ✅ Implementation plan documented

---

# TIER 02 — USER DOMAIN & AUTHENTICATION MODEL

## Objective

Ensure authentication is correctly connected to the existing User domain.

---

## Tasks

### User Entity

Inspect the existing User entity.

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

* ✅ Passwords are never stored in plaintext
* ✅ Password hashes are used
* ✅ Sensitive information is not returned
* ✅ Authentication errors do not leak sensitive information
* ✅ Secrets are stored in environment variables

---

## API Design

Follow the existing backend conventions for:

* ✅ Routes
* ✅ Controllers
* ✅ Services
* ✅ Validation
* ✅ Errors
* ✅ Responses

Do not create a parallel API architecture.

---

## Tier 03 Completion

* ✅ Backend authentication foundation exists
* ✅ Password security implemented
* ✅ Validation implemented
* ✅ Error handling implemented
* ✅ Backend tests/validation executed

---

# TIER 04 — REGISTRATION

## Objective

Implement the complete account registration flow.

---

# Frontend Registration

Implement the existing registration page/design.

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

```text
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

* [ ] Login page
* [ ] Email field
* [ ] Password field
* [ ] Validation
* [ ] Loading state
* [ ] Invalid credentials state
* [ ] Server error
* [ ] Success state
* [ ] Responsive layout
* [ ] RTL
* [ ] Dark mode
* [ ] Accessibility

---

# Backend

Implement or verify:

* [ ] Login endpoint
* [ ] User lookup
* [ ] Password verification
* [ ] Account status verification
* [ ] Authentication response
* [ ] Error handling

---

# Integration

Implement:

```text
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

* [ ] Valid credentials
* [ ] Invalid email
* [ ] Invalid password
* [ ] Missing fields
* [ ] Suspended account
* [ ] Deleted account
* [ ] Server error
* [ ] Network failure

---

## Tier 05 Completion

* [ ] Login UI complete
* [ ] Login backend complete
* [ ] Frontend/backend integrated
* [ ] Error handling complete
* [ ] Tests passed

---

# TIER 06 — SESSION & TOKEN MANAGEMENT

## Objective

Implement secure authentication persistence.

---

## First Determine Existing Strategy

Inspect the repository and determine whether Safqa uses:

* [ ] Cookie-based sessions
* [ ] JWT
* [ ] Refresh tokens
* [ ] Access tokens
* [ ] Another documented mechanism

Do not introduce a different strategy without architectural justification.

---

## Tasks

* [ ] Token/session creation
* [ ] Token/session validation
* [ ] Expiration
* [ ] Persistence
* [ ] Refresh mechanism if required
* [ ] Frontend authentication state
* [ ] Backend authentication middleware
* [ ] Logout cleanup

---

## Security

Verify:

* [ ] Secure storage strategy
* [ ] No unnecessary localStorage token exposure
* [ ] Environment secrets protected
* [ ] Expiration handled
* [ ] Invalid sessions rejected

---

## Tier 06 Completion

* [ ] Authentication persistence works
* [ ] Session/token validation works
* [ ] Expiration works
* [ ] Frontend recognizes authentication
* [ ] Backend recognizes authentication

---

# TIER 07 — PROTECTED ROUTES & AUTHORIZATION

## Objective

Protect authenticated application areas.

---

# Frontend

Implement/verify:

* [ ] Protected routes
* [ ] Authentication guards
* [ ] Redirect behavior
* [ ] Loading/auth resolution
* [ ] Guest behavior
* [ ] Authenticated behavior

---

# Backend

Implement/verify:

* [ ] Authentication middleware
* [ ] Session/token verification
* [ ] User identity extraction
* [ ] Unauthorized responses
* [ ] Role verification where required

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

* [ ] Invalid token
* [ ] Expired token
* [ ] Missing authentication
* [ ] Suspended account
* [ ] Unauthorized role

---

## Tier 07 Completion

* [ ] Frontend routes protected
* [ ] Backend protected
* [ ] Authentication guard working
* [ ] Authorization behavior verified

---

# TIER 08 — LOGOUT

## Objective

Implement complete logout.

---

## Tasks

* [ ] Logout UI
* [ ] Logout request if required
* [ ] Session/token cleanup
* [ ] Frontend authentication state cleanup
* [ ] Redirect
* [ ] Protected route invalidation

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

* [ ] Logout works
* [ ] Session removed
* [ ] Frontend state cleared
* [ ] Redirect works
* [ ] Protected access blocked

---

# TIER 09 — AUTHENTICATION UX & UI STATES

## Objective

Make authentication production-quality from the user's perspective.

---

## States

Implement/verify:

* [ ] Initial state
* [ ] Loading
* [ ] Validation error
* [ ] API error
* [ ] Network error
* [ ] Invalid credentials
* [ ] Duplicate account
* [ ] Success
* [ ] Disabled submit
* [ ] Retry behavior

---

## Design

Follow:

* [ ] Existing Design System
* [ ] Existing color tokens
* [ ] Existing typography
* [ ] Existing spacing
* [ ] Existing buttons
* [ ] Existing inputs
* [ ] Existing alerts
* [ ] Existing responsive patterns

---

## Accessibility

* [ ] Labels
* [ ] Keyboard navigation
* [ ] Focus states
* [ ] Error announcements
* [ ] Accessible buttons
* [ ] Proper form semantics

---

## Tier 09 Completion

* [ ] All authentication states implemented
* [ ] UX reviewed
* [ ] Responsive behavior verified
* [ ] Accessibility verified
* [ ] Light mode verified
* [ ] Dark mode verified
* [ ] RTL verified

---

# TIER 10 — AUTHENTICATION SECURITY REVIEW

## Objective

Perform a security-focused review of the complete authentication implementation.

---

## Password Security

* [ ] Password hashing
* [ ] No plaintext password storage
* [ ] Password never returned in API responses
* [ ] Password not logged

---

## Session Security

* [ ] Secure token/session handling
* [ ] Proper expiration
* [ ] Invalid sessions rejected
* [ ] Logout invalidates access where required

---

## API Security

* [ ] Input validation
* [ ] Authentication checks
* [ ] Authorization checks
* [ ] Safe error messages
* [ ] No sensitive data leakage

---

## Environment Security

* [ ] Secrets in environment variables
* [ ] No secrets committed
* [ ] Production configuration reviewed
* [ ] CORS configuration reviewed

---

## Abuse Protection

Review whether the architecture supports:

* [ ] Rate limiting
* [ ] Brute-force protection
* [ ] Request throttling
* [ ] Account abuse protection

Do not introduce these systems blindly.

Follow project architecture.

---

## Tier 10 Completion

* [ ] Security review completed
* [ ] Critical vulnerabilities fixed
* [ ] No plaintext credentials
* [ ] No secret leakage
* [ ] Authentication boundaries verified

---

# TIER 11 — FRONTEND AUTHENTICATION TESTING

## Objective

Test Authentication behavior from the Frontend.

---

# Component Tests

Test:

* [ ] Login form
* [ ] Register form
* [ ] Input validation
* [ ] Password validation
* [ ] Error states
* [ ] Loading states
* [ ] Success states
* [ ] Disabled states

---

# Integration Tests

Test:

* [ ] Register → API
* [ ] Login → API
* [ ] Logout
* [ ] Authentication state
* [ ] Protected route
* [ ] Redirect behavior

---

# UI Tests

Verify:

* [ ] Desktop
* [ ] Mobile
* [ ] Tablet
* [ ] RTL
* [ ] Dark mode
* [ ] Keyboard
* [ ] Accessibility

---

## Important

Use the testing tools already present in the repository.

Do NOT install another testing framework unless required by the project architecture.

---

## Tier 11 Completion

* [ ] Frontend tests implemented
* [ ] Frontend tests passing
* [ ] UI behavior verified

---

# TIER 12 — BACKEND AUTHENTICATION TESTING

## Objective

Test the Authentication backend independently.

---

## Registration Tests

* [ ] Valid registration
* [ ] Invalid data
* [ ] Duplicate email
* [ ] Invalid password
* [ ] Missing required data

---

## Login Tests

* [ ] Valid credentials
* [ ] Invalid credentials
* [ ] Missing credentials
* [ ] Suspended account
* [ ] Deleted account

---

## Security Tests

* [ ] Invalid token
* [ ] Expired token
* [ ] Missing token
* [ ] Unauthorized access
* [ ] Invalid input

---

## API Contract

Verify:

* [ ] Status codes
* [ ] Response structure
* [ ] Error structure
* [ ] Validation behavior

---

## Tier 12 Completion

* [ ] Backend tests implemented
* [ ] Backend tests passing
* [ ] Authentication API verified
* [ ] Error responses verified

---

# TIER 13 — FULL END-TO-END AUTHENTICATION TESTING

## Objective

Test Authentication exactly as a real user experiences it.

---

# Flow 01 — Registration

```text
Landing Page
     ↓
Register
     ↓
Enter Information
     ↓
Submit
     ↓
Backend Validation
     ↓
User Created
     ↓
Expected Result
```

* [ ] Passed

---

# Flow 02 — Login

```text
Login
 ↓
Enter Credentials
 ↓
Submit
 ↓
Backend Verification
 ↓
Session Created
 ↓
Authenticated Application
```

* [ ] Passed

---

# Flow 03 — Protected Route

```text
Authenticated User
 ↓
Protected Page
 ↓
Access Granted
```

* [ ] Passed

---

# Flow 04 — Guest Protection

```text
Unauthenticated User
 ↓
Protected Page
 ↓
Access Denied
 ↓
Redirect
```

* [ ] Passed

---

# Flow 05 — Logout

```text
Authenticated User
 ↓
Logout
 ↓
Session Removed
 ↓
Protected Page
 ↓
Access Denied
```

* [ ] Passed

---

# Failure Scenarios

Test:

* [ ] Invalid email
* [ ] Invalid password
* [ ] Duplicate account
* [ ] Expired session
* [ ] Invalid token
* [ ] Missing token
* [ ] Network failure
* [ ] Backend failure
* [ ] Suspended account
* [ ] Unauthorized role

---

## Tier 13 Completion

* [ ] Registration E2E passed
* [ ] Login E2E passed
* [ ] Protected routes passed
* [ ] Logout E2E passed
* [ ] Failure scenarios passed
* [ ] Frontend/backend integration verified

---

# TIER 14 — PRODUCTION READINESS

## Objective

Verify that Authentication is ready to become part of the real Safqa application.

---

## Code Quality

* [ ] TypeScript passes
* [ ] Lint passes
* [ ] Build passes
* [ ] No broken imports
* [ ] No dead authentication code
* [ ] No duplicate authentication logic

---

## Runtime

* [ ] Frontend starts correctly
* [ ] Backend starts correctly
* [ ] Authentication works
* [ ] API communication works
* [ ] Protected routes work
* [ ] Logout works

---

## UI

* [ ] Desktop
* [ ] Tablet
* [ ] Mobile
* [ ] RTL
* [ ] Dark mode
* [ ] Light mode
* [ ] Accessibility

---

## Security

* [ ] Secrets protected
* [ ] Passwords protected
* [ ] Session handling reviewed
* [ ] Unauthorized access blocked
* [ ] Error leakage reviewed

---

## Regression

Verify that Authentication work did NOT break:

* [ ] Landing Page
* [ ] Existing Home/Marketplace
* [ ] Existing Product functionality
* [ ] Existing navigation
* [ ] Existing backend functionality

---

## Documentation

* [ ] Authentication behavior documented
* [ ] Environment requirements documented
* [ ] Important architecture decisions documented
* [ ] Testing instructions documented

---

## Tier 14 Completion

* [ ] Build passes
* [ ] Tests pass
* [ ] Security review passes
* [ ] UI review passes
* [ ] Regression review passes
* [ ] Documentation updated

---

# TIER 15 — FINAL AUTHENTICATION SIGN-OFF

## Objective

This is the final gate.

Authentication cannot be considered complete until every required part has passed.

---

# Architecture

* [ ] Tier 01 complete
* [ ] Tier 02 complete
* [ ] Tier 03 complete

# Core Authentication

* [ ] Tier 04 — Registration complete
* [ ] Tier 05 — Login complete
* [ ] Tier 06 — Session complete
* [ ] Tier 07 — Protected Routes complete
* [ ] Tier 08 — Logout complete

# UX & Security

* [ ] Tier 09 — UX complete
* [ ] Tier 10 — Security complete

# Testing

* [ ] Tier 11 — Frontend tests complete
* [ ] Tier 12 — Backend tests complete
* [ ] Tier 13 — E2E tests complete

# Production

* [ ] Tier 14 — Production readiness complete

---

# FINAL USER JOURNEY

The following complete journey MUST work:

```text
                  ┌──────────────┐
                  │   Landing    │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │    Register  │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ User Created │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │     Login    │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │   Session    │
                  └──────┬───────┘
                         │
                         ▼
              ┌─────────────────────┐
              │ Authenticated Home  │
              └──────────┬──────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │    Logout    │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ Public Area  │
                  └──────────────┘
```

---

# FINAL DEFINITION OF DONE

Authentication is COMPLETE only when:

* [ ] Registration works
* [ ] Login works
* [ ] Session works
* [ ] Protected routes work
* [ ] Logout works
* [ ] Frontend tests pass
* [ ] Backend tests pass
* [ ] E2E tests pass
* [ ] Security review passes
* [ ] Responsive UI passes
* [ ] RTL passes
* [ ] Light mode passes
* [ ] Dark mode passes
* [ ] Accessibility passes
* [ ] Build passes
* [ ] TypeScript passes
* [ ] Lint passes
* [ ] Existing Safqa functionality still works
* [ ] Documentation is updated

---

# FINAL RULE

When all requirements above are satisfied:

Mark Phase 07 as:

`✅ COMPLETE`

Then STOP.

Do not start Phase 08 automatically.

Wait for the user to explicitly provide the next task.

