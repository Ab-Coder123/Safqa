
# TASK — Frontend & Backend Architecture Foundation

We are currently working on **Phase 07 — Authentication System**.

IMPORTANT CURRENT STATE:

- Tier 01 is completed.
- Tier 02 is completed.
- Tier 03 is completed.
- Tier 04 — Signup implementation is completed.
- DO NOT start Tier 05 yet.

Before continuing with Tier 05, we need to establish and enforce a proper **Frontend & Backend Application Architecture Foundation**.

This is an architectural foundation task, not a UI feature task.

The goal is to make sure all future Phase 07 features and all future application features follow a consistent architecture for:

- API communication
- Server State
- Client State
- Feature boundaries
- Components
- Hooks
- Services
- Validation
- Error handling
- Authentication
- Data fetching
- Mutations
- Caching
- Testing
- Dependencies
- Frontend/Backend separation

After this foundation is completed and verified, we will continue with **Tier 05**.

---

# 1. FIRST — READ THE PROJECT BEFORE CHANGING ANYTHING

Do NOT start coding immediately.

First inspect the repository and understand the existing architecture.

You MUST review:

## Agent / Workflow

- `agent/SKILL.md`
- `documents/WorkFlows/README.md`
- all relevant frontend workflows
- all relevant backend workflows
- `documents/WorkFlows/System/Performance_Engineering_Workflow.md`
- Authentication workflow
- Error handling workflow
- Permission workflow
- relevant architecture decisions

## Architecture

Review:

- `01_Safqa_Architecture_Decisions.md`
- Phase 07 documentation
- current project roadmap
- existing project conventions

## Frontend

Inspect:

- `apps/web/package.json`
- `apps/web/src/`
- `apps/web/src/app/`
- `apps/web/src/components/`
- `apps/web/src/hooks/`
- `apps/web/src/lib/`
- existing authentication implementation
- Signup implementation
- Login implementation if already present
- existing API calls
- existing `fetch()` usage
- existing state management
- existing forms
- existing validation
- existing error handling

## Backend

Inspect:

- `apps/backend/package.json`
- `apps/backend/src/`
- modules
- controllers
- services
- DTOs
- guards
- Prisma layer
- authentication implementation
- error handling
- response structure
- validation
- testing architecture

DO NOT assume filenames or architecture.

Discover the actual repository structure first.

---

# 2. CURRENT PROBLEM WE ARE SOLVING

The current frontend has API/data logic directly inside pages/components in some areas.

We need to prevent this architecture from growing.

We do NOT want:

```text
Page
  ↓
fetch()
  ↓
API
  ↓
local state
  ↓
UI
````

or:

```text
Component
  ↓
fetch()
  ↓
localStorage
  ↓
error handling
  ↓
UI
```

Instead, establish clear boundaries:

```text
UI
 ↓
Feature
 ↓
Feature Hook
 ↓
Server State / Mutation Layer
 ↓
Feature API Service
 ↓
Shared API Client
 ↓
Backend API
```

The UI should not know unnecessary details about:

* API URLs
* HTTP implementation
* authentication headers
* token refresh
* response parsing
* retry behavior
* caching
* query invalidation
* low-level API errors

---

# 3. IMPORTANT — DO NOT COPY ANOTHER PROJECT

Do NOT copy architecture from another project.

Do NOT introduce a structure simply because it is popular.

The architecture must be designed specifically for Safqa based on:

* Safqa domains
* current Next.js architecture
* current NestJS architecture
* current authentication system
* current database/domain model
* existing workflows
* existing conventions

---

# 4. ESTABLISH FEATURE-BASED FRONTEND ARCHITECTURE

Evaluate the current frontend structure and establish feature boundaries where appropriate.

The target architecture should be conceptually similar to:

```text
apps/web/src/

├── app/
│   ├── (auth)/
│   ├── products/
│   ├── conversations/
│   ├── favorites/
│   ├── notifications/
│   ├── settings/
│   └── admin/
│
├── features/
│   ├── auth/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── components/
│   │   ├── schemas/
│   │   └── types/
│   │
│   ├── products/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── components/
│   │   ├── schemas/
│   │   └── types/
│   │
│   ├── conversations/
│   ├── favorites/
│   ├── notifications/
│   ├── categories/
│   ├── reports/
│   └── users/
│
├── components/
│   ├── ui/
│   └── shared/
│
├── lib/
│   ├── api/
│   ├── query/
│   └── utils/
│
├── hooks/
│
└── types/
```

IMPORTANT:

This is a target architectural direction, NOT a command to blindly create every folder.

Only create folders that are justified by the actual application.

Avoid empty folders and unnecessary abstraction.

---

# 5. SERVER STATE ARCHITECTURE

We need a dedicated solution for Server State.

Evaluate the current dependencies first.

The preferred solution is:

## TanStack Query

Use:

```text
@tanstack/react-query
```

for Server State such as:

* Current user
* Products
* Categories
* Favorites
* Conversations
* Messages
* Notifications
* Reports
* Admin data
* Authentication-related server data

TanStack Query should handle:

* fetching
* caching
* stale state
* loading state
* error state
* refetching
* mutations
* query invalidation
* optimistic updates where justified

DO NOT use TanStack Query for normal UI state.

---

# 6. CLIENT STATE

Clearly define the difference between:

## Server State

Data owned by the backend.

Use:

```text
TanStack Query
```

## Client/UI State

State owned by the frontend UI.

Examples:

* modal visibility
* sidebar state
* active tab
* temporary UI state
* local filters
* UI preferences

Prefer:

```text
React useState
```

when the state is local.

Do NOT introduce Redux or Zustand automatically.

Only introduce a global client-state library if the project has a real requirement that local state/context cannot reasonably solve.

If a global state library is already installed, audit whether it is actually needed before keeping or expanding it.

---

# 7. API CLIENT

Create a single shared API communication boundary.

Conceptually:

```text
features/*
     ↓
feature API service
     ↓
shared API client
     ↓
backend
```

The API client should centralize appropriate concerns such as:

* base URL
* request configuration
* authentication handling
* headers
* response parsing
* common errors
* token refresh if required by the existing authentication architecture

Do NOT duplicate API configuration inside every feature.

---

# 8. API SERVICES

Each feature should own its API operations.

Example:

```text
features/auth/api/auth.api.ts

features/products/api/products.api.ts

features/favorites/api/favorites.api.ts

features/conversations/api/conversations.api.ts
```

The API service should know how to communicate with the backend.

UI components should NOT know endpoint URLs.

Bad:

```tsx
fetch("http://localhost:3001/products")
```

inside a component.

Preferred:

```tsx
useProducts()
```

which internally uses the appropriate feature API service.

---

# 9. QUERY HOOKS

Create feature-level query hooks.

Example:

```text
features/products/hooks/
    use-products.ts
    use-product.ts
    use-create-product.ts
    use-update-product.ts
    use-delete-product.ts
```

Conceptually:

```text
Component
    ↓
useProducts()
    ↓
useQuery()
    ↓
products.api.ts
    ↓
apiClient
```

The component should only care about:

* data
* loading
* error
* mutation state
* user interaction

It should not care about HTTP implementation details.

---

# 10. MUTATION ARCHITECTURE

All server mutations should follow the same architecture.

Example:

```text
Create Product

Product Form
     ↓
useCreateProduct()
     ↓
useMutation()
     ↓
products.api.ts
     ↓
API Client
     ↓
POST /products
```

After successful mutations, use appropriate:

* query invalidation
* cache updates
* optimistic updates

Do NOT refetch everything blindly.

---

# 11. AUTHENTICATION ARCHITECTURE

Because Phase 07 is Authentication, pay special attention to:

* Signup
* Login
* Refresh token
* Current user
* Logout
* Protected requests
* Authentication errors

The architecture must clearly define:

```text
Auth UI
 ↓
Auth Feature Hook
 ↓
Auth Mutation
 ↓
Auth API
 ↓
API Client
 ↓
Backend
```

The UI should not manually manage low-level token mechanics unless the existing architecture explicitly requires it.

Preserve the security decisions already established in Phase 07.

Do NOT introduce NextAuth or another authentication framework unless the existing architecture explicitly requires it.

---

# 12. FORMS AND VALIDATION

Inspect the existing form architecture before introducing dependencies.

Evaluate:

* React Hook Form
* Zod
* existing DTO/schema validation
* existing validation utilities

If these libraries are already installed, use the established conventions.

If they are not installed, determine whether they are actually justified.

Do NOT install libraries simply because they are popular.

The frontend validation should align with backend validation without duplicating business rules unnecessarily.

---

# 13. ERROR HANDLING

All API errors should follow the existing Safqa Error Handling Workflow.

Do NOT create custom error handling inside every page.

Establish a consistent boundary:

```text
Backend Error
      ↓
API Client
      ↓
Normalized Error
      ↓
TanStack Query
      ↓
Feature
      ↓
UI
```

Review the existing:

```text
documents/WorkFlows/System/Error_Handling_Workflow.md
```

before implementation.

---

# 14. TYPES

Review the existing shared types.

Determine where types should live.

Prefer:

```text
Feature-specific types
    ↓
feature/types
```

and shared types only when they genuinely belong to multiple domains.

Do NOT duplicate API response types across multiple components.

Do NOT create unnecessary global types.

---

# 15. BACKEND ARCHITECTURE WORKFLOW

While this task primarily establishes the frontend foundation, also define the corresponding Backend Architecture Workflow.

The backend should maintain clear boundaries such as:

```text
Controller
   ↓
DTO / Validation
   ↓
Service
   ↓
Domain / Business Logic
   ↓
Repository / Prisma
   ↓
Database
```

Controllers should NOT contain business logic.

Services should NOT become giant classes containing unrelated domains.

Each backend domain/module should remain isolated.

Example:

```text
modules/
├── auth/
├── users/
├── products/
├── categories/
├── favorites/
├── conversations/
├── messages/
├── notifications/
├── reports/
└── admin/
```

Use the actual existing Safqa modules and do not create unnecessary modules.

---

# 16. FRONTEND ↔ BACKEND CONTRACT

Define clear API contracts.

The frontend should consume backend contracts through a predictable structure.

Review whether the existing project already has:

* shared types
* DTO-derived types
* API response types
* enums
* validation schemas

Do not create duplicate sources of truth without a reason.

The backend remains the source of truth for business rules.

The frontend handles presentation and client interaction.

---

# 17. PERFORMANCE ENGINEERING INTEGRATION

The Architecture Foundation MUST integrate with the existing:

```text
Performance_Engineering_Workflow.md
```

Before introducing:

* React Query
* new providers
* new hooks
* new components
* feature modules
* client components

evaluate:

* bundle impact
* rendering behavior
* client/server boundaries
* unnecessary subscriptions
* unnecessary rerenders
* query frequency
* caching strategy

Do NOT sacrifice performance for abstraction.

---

# 18. REQUIRED LIBRARIES

Before installing anything, inspect the existing package.json files.

The preferred stack is:

### Server State

```text
@tanstack/react-query
```

### Forms

Use the existing project solution if one exists.

If not, evaluate:

```text
react-hook-form
```

### Validation

Use the existing project solution if one exists.

If not, evaluate:

```text
zod
```

### HTTP

Do NOT automatically install Axios.

First inspect the current API architecture.

If native `fetch` is sufficient, create a clean API client around `fetch`.

Only introduce Axios if there is a concrete architectural reason.

### Global Client State

Do NOT automatically install:

```text
redux
zustand
```

Use local React state unless a real global-state requirement exists.

---

# 19. DO NOT OVER-ENGINEER

This rule is mandatory.

Do NOT create:

```text
20 abstractions
```

for a simple CRUD feature.

Do NOT create:

```text
repository
service
adapter
facade
manager
factory
```

just because the pattern exists.

Every abstraction must solve a real problem.

The goal is:

```text
Low Coupling
+
High Cohesion
+
Clear Ownership
+
Easy Testing
+
Predictable Data Flow
```

---

# 20. MIGRATE THE EXISTING AUTH IMPLEMENTATION CAREFULLY

Signup is already completed.

DO NOT rewrite Signup unnecessarily.

Instead:

1. Inspect the current Signup implementation.
2. Identify its API calls.
3. Identify its state management.
4. Identify validation.
5. Identify error handling.
6. Determine how it fits into the new architecture.
7. Refactor only where required by the new architecture.
8. Preserve existing behavior and UI.

Do not break the completed Tier 04 work.

---

# 21. CREATE THE WORKFLOW

After understanding the architecture, create/update the existing workflow system so that future agents MUST follow the new Frontend & Backend Architecture rules.

The workflow should contain:

## Frontend Architecture Workflow

```text
Architecture Review
        ↓
Feature Boundary
        ↓
API Layer
        ↓
Server State
        ↓
Client State
        ↓
Components
        ↓
Hooks
        ↓
Validation
        ↓
Error Handling
        ↓
Testing
        ↓
Performance Review
        ↓
Definition of Done
```

## Backend Architecture Workflow

```text
Domain
   ↓
Controller
   ↓
DTO / Validation
   ↓
Service
   ↓
Business Logic
   ↓
Repository / Prisma
   ↓
Database
   ↓
Testing
   ↓
Definition of Done
```

---

# 22. UPDATE AGENT WORKFLOW RULES

This is mandatory.

Update the existing Agent workflow so that before implementing any future frontend feature, the agent MUST review:

1. Frontend Architecture Workflow
2. Performance Engineering Workflow
3. relevant Domain workflow
4. relevant Authentication/Permission/Error workflow
5. Architecture Decisions

The agent must determine:

* Which feature owns the code?
* Is this Server State or Client State?
* Which API service owns the endpoint?
* Which query/mutation owns the request?
* Which component owns the UI?
* What should remain reusable/shared?
* Does this require a new dependency?
* Does this affect rendering performance?

---

# 23. VALIDATION

After implementation run the actual repository commands.

First inspect package.json.

Then run the appropriate:

* TypeScript checks
* ESLint
* Frontend tests
* Backend tests
* package builds
* production build

Do NOT invent scripts.

Use the project's existing scripts.

---

# 24. FINAL ARCHITECTURE CHECK

Before completing this task, verify:

### Frontend

* [ ] Feature boundaries are defined.
* [ ] API communication is separated from UI.
* [ ] Server State architecture is established.
* [ ] TanStack Query is configured if approved.
* [ ] Query hooks follow a consistent convention.
* [ ] Mutations follow a consistent convention.
* [ ] Client State is clearly separated from Server State.
* [ ] API client has a clear ownership boundary.
* [ ] Authentication follows the architecture.
* [ ] Forms and validation follow project conventions.
* [ ] Error handling follows the existing workflow.
* [ ] Types have clear ownership.
* [ ] Performance workflow is integrated.

### Backend

* [ ] Module boundaries are clear.
* [ ] Controllers remain thin.
* [ ] DTO validation is consistent.
* [ ] Business logic remains in services/domain layer.
* [ ] Prisma/database access remains isolated.
* [ ] Error handling follows the existing workflow.
* [ ] Authentication boundaries remain intact.
* [ ] Tests remain passing.

### Workflow

* [ ] Frontend Architecture Workflow exists.
* [ ] Backend Architecture Workflow exists.
* [ ] Existing Agent workflow references them.
* [ ] Future agents are required to review them.
* [ ] Performance Engineering remains mandatory.

---

# 25. VERY IMPORTANT — DO NOT START TIER 05

Do NOT start Tier 05 implementation during this task.

The order MUST be:

```text
Tier 04 — Signup
        ↓
        ✅ COMPLETED
        ↓
Architecture Foundation
        ↓
Frontend Architecture Workflow
        ↓
Backend Architecture Workflow
        ↓
Server State Architecture
        ↓
API Architecture
        ↓
Feature Boundaries
        ↓
Validation & Error Architecture
        ↓
Performance Review
        ↓
Testing
        ↓
Architecture Foundation COMPLETE
        ↓
STOP
        ↓
Tier 05
```

Once the Architecture Foundation is completely implemented and verified, STOP.

Do NOT automatically continue to Tier 05.

Provide a final report containing:

1. Current architecture problems discovered.
2. Target architecture.
3. Files created.
4. Files modified.
5. Libraries already available.
6. Libraries installed and why.
7. Libraries intentionally NOT installed and why.
8. Frontend architecture changes.
9. Backend architecture changes.
10. Server State architecture.
11. Client State architecture.
12. API architecture.
13. Workflow changes.
14. Tests/builds executed.
15. Results.
16. Confirmation that Tier 05 has NOT been started.

The next task after this report will be to start Tier 05 separately.

---

# COMPLETION RECORD - 2026-08-17

Status: COMPLETE

## Implemented Foundation

- Frontend Architecture Workflow created at `documents/WorkFlows/System/Frontend_Architecture_Workflow.md`.
- Backend Architecture Workflow created at `documents/WorkFlows/System/Backend_Architecture_Workflow.md`.
- `agent/SKILL.md` updated to require frontend/backend architecture pre-review.
- `documents/WorkFlows/README.md` updated with mandatory architecture workflow order.
- TanStack Query added to `apps/web` for server state and mutations.
- Shared query infrastructure added under `apps/web/src/lib/query`.
- Shared API infrastructure added under `apps/web/src/lib/api`.
- Auth feature boundary established under `apps/web/src/features/auth`.
- Tier 04 register flow migrated from direct page-level `fetch()` to:

```text
Register UI
  -> useRegister()
  -> authApi.register()
  -> apiClient()
  -> Backend /auth/register
```

- Register token persistence moved behind `tokenStorage`.
- Register backend errors now flow through normalized `ApiError`.
- Register route split through an auth feature shell to keep auth First Load JS below the 120 kB target.
- Backend seed build blocker fixed by aligning hashing import with installed `bcryptjs`.

## Audit Findings Deferred To Future Feature Work

Existing non-auth pages still contain direct `fetch()` and local token access. These are documented as migration targets for their own future feature tiers and were not rewritten during this foundation task to avoid broad behavioral changes.

## Verification

- `pnpm --filter @safqa/web build` passed.
- `/register` First Load JS: 88.7 kB.
- `pnpm --filter @safqa/backend test` passed.
- `pnpm --filter @safqa/backend build` passed.

Tier 05 Login was not started.
