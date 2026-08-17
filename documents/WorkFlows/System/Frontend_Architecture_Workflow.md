# Frontend Architecture Workflow

## Purpose
This workflow defines where frontend code belongs in Safqa and how pages, feature modules, API services, server state, client state, validation, errors, and performance checks must be organized.

## Required Flow
```text
Architecture Review
      |
Feature Boundary
      |
API Layer
      |
Server State
      |
Client State
      |
Components
      |
Hooks
      |
Validation
      |
Error Handling
      |
Testing
      |
Performance Review
      |
Definition of Done
```

## Feature Boundaries
- `apps/web/src/app` owns routes, layouts, route grouping, metadata, and page composition.
- `apps/web/src/features/<feature>` owns feature-specific API calls, hooks, components, schemas, and types.
- `apps/web/src/components/ui` owns primitive reusable UI controls only.
- `apps/web/src/components/shared` may contain cross-feature presentation components after at least two features need them.
- `apps/web/src/lib` owns shared infrastructure such as API client, query configuration, utilities, and cross-cutting helpers.

Do not create empty feature folders. Create a feature folder only when code exists for that feature.

## API Communication
Frontend pages and UI components must not call `fetch()` with backend URLs directly.

Required path:
```text
Page / Component
      |
Feature Hook
      |
TanStack Query query/mutation
      |
Feature API Service
      |
Shared API Client
      |
Backend API
```

Shared API behavior lives in `apps/web/src/lib/api`. Feature endpoint ownership lives in `apps/web/src/features/<feature>/api`.

## Server State
Use TanStack Query for backend-owned data:
- current user
- products
- categories
- favorites
- conversations and messages
- notifications
- reports
- admin data

Query hooks must live in `features/<feature>/hooks`. Query keys must be stable and centralized through `apps/web/src/lib/query/query-keys.ts`.

## Mutations
Server mutations must use `useMutation` through a feature hook. On success, update or invalidate only the relevant query keys. Do not refetch unrelated domains.

## Client State
Use local React state for UI-owned state:
- modal visibility
- active tab
- form field drafts
- local filters before submission
- temporary UI preferences

Do not introduce Redux or Zustand unless a specific cross-route client-state requirement exists and local state/context cannot reasonably solve it.

## Validation
Frontend validation should align with backend DTO rules. Backend DTOs remain the source of truth for business validation. Frontend schemas or mapping functions may normalize form data before calling a feature API service.

## Error Handling
Backend errors must flow through:
```text
Backend Error
      |
Shared API Client
      |
Normalized ApiError
      |
TanStack Query
      |
Feature Hook
      |
UI
```

Do not duplicate response parsing and low-level error handling inside pages.

## Authentication
Authentication UI must remain lightweight and isolated under `app/(auth)`. It may use `features/auth`, `lib/api`, and `lib/query`, but must not import marketplace, notification, messaging, or admin code.

Token mechanics are owned by `apps/web/src/lib/api/token-storage.ts` until the session architecture moves to secure cookies in a later authentication tier.

## Performance Gate
Before completing frontend work, review `documents/WorkFlows/System/Performance_Engineering_Workflow.md` and confirm:
- client components are pushed to the smallest practical boundary
- auth routes remain isolated from heavy feature bundles
- live search/filter events are debounced
- query frequency and stale times are intentional
- memoization is used only for justified work

## Definition of Done
- Feature ownership is clear.
- UI has no hard-coded backend URLs.
- Server state uses feature query/mutation hooks.
- Client state stays local unless there is a documented reason.
- API errors are normalized through the shared API client.
- Types are not duplicated across components.
- Existing scripts for type checks, lint, tests, and builds are run when available.
