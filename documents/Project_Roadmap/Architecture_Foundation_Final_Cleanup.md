# Architecture Foundation — Final Cleanup & Gate Plan

---

## 📌 Purpose

This roadmap defines the final architectural cleanup tasks required to achieve a 100% **Production-Grade Architecture Foundation** for the Safqa monorepo before starting **Phase 08 (Product & Marketplace Capability Roadmap)**.

It directly resolves all partial architectural findings identified in the Architecture Audit Report:
1. Feature boundary violations (misplaced components in `components/marketplace` & `components/admin`).
2. Centralized query keys (`lib/query/query-keys.ts` -> feature-owned `query-keys.ts`).
3. Frontend testing setup (Vitest + React Testing Library foundation for frontend unit & component tests).
4. Full workspace verification & Git release gate.

---

## 🧱 Plan Overview & Tier Division

The **Architecture Foundation Final Cleanup** is divided into **4 Sequential Tiers**:

```text
ARCHITECTURE FOUNDATION FINAL CLEANUP
       │
       ├── TIER 01: Feature Boundaries & Component Relocation
       │     └── Move misplaced UI components to feature ownership
       │
       ├── TIER 02: Decentralized Feature-Owned Query Keys
       │     └── Distribute query keys to features/*/query-keys.ts
       │
       ├── TIER 03: Frontend Testing Infrastructure & Base Tests
       │     └── Vitest + React Testing Library setup & component specs
       │
       └── TIER 04: Workspace Verification, Audit Gate & Release
             └── Full build, test suite execution, report & git commit
```

---

# TIER 01 — FEATURE BOUNDARIES & COMPONENT RELOCATION

## Objective
Ensure 100% adherence to `System/Frontend_Architecture_Workflow.md` by moving domain-specific UI components out of global `components/` into their respective `features/<feature>/components/` directories.

## Scope of Work

### 1. Products Feature Components
* Move `apps/web/src/components/marketplace/product-card.tsx` -> `apps/web/src/features/products/components/product-card.tsx`.
* Export `ProductCard` from `features/products/components/index.ts`.
* Update all import references across `apps/web/src/app/` (e.g. `app/page.tsx`, `app/products/page.tsx`, `app/favorites/page.tsx`, `app/my-listings/page.tsx`).

### 2. Admin Feature Components
* Move `apps/web/src/components/admin/admin-tabs.tsx` -> `apps/web/src/features/admin/components/admin-tabs.tsx`.
* Update import references in `apps/web/src/app/admin/page.tsx`.

### 3. Cleanup & Verification
* Remove empty legacy directories (`components/marketplace`, `components/admin`).
* Verify TypeScript compilation (`tsc --noEmit`).

## Definition of Done (Tier 01)
- [ ] No feature UI components exist in global `components/` directory.
- [ ] All pages import feature components from `@/features/<feature>/components`.
- [ ] Next.js build passes cleanly.

---

# TIER 02 — DECENTRALIZED FEATURE-OWNED QUERY KEYS

## Objective
Enforce strict modularity by eliminating the monolithic `lib/query/query-keys.ts` and establishing feature-owned query keys under `features/<feature>/query-keys.ts`.

## Scope of Work

### 1. Feature Query Key Allocation
Create co-located query key factories in each feature:
* `apps/web/src/features/auth/query-keys.ts` -> `authKeys`
* `apps/web/src/features/products/query-keys.ts` -> `productKeys`
* `apps/web/src/features/categories/query-keys.ts` -> `categoryKeys`
* `apps/web/src/features/favorites/query-keys.ts` -> `favoriteKeys`
* `apps/web/src/features/conversations/query-keys.ts` -> `conversationKeys`
* `apps/web/src/features/notifications/query-keys.ts` -> `notificationKeys`
* `apps/web/src/features/reports/query-keys.ts` -> `reportKeys`
* `apps/web/src/features/users/query-keys.ts` -> `userKeys`
* `apps/web/src/features/admin/query-keys.ts` -> `adminKeys`

### 2. Hook Refactoring
* Update all custom hooks under `features/*/hooks/` to consume their co-located query keys.
* Remove legacy global `lib/query/query-keys.ts`.

## Definition of Done (Tier 02)
- [ ] Every feature owns its `query-keys.ts`.
- [ ] No feature imports query keys from `lib/query/query-keys.ts`.
- [ ] All cache invalidations (`queryClient.invalidateQueries`) reference local feature keys.

---

# TIER 03 — FRONTEND TESTING INFRASTRUCTURE & BASE TESTS

## Objective
Establish the testing infrastructure for frontend components and hooks as mandated by the project architecture rules before launching Phase 08.

## Scope of Work

### 1. Testing Infrastructure Setup
* Configure Vitest / Jest & React Testing Library in `apps/web`.
* Create `apps/web/src/test/setup.ts` with `@testing-library/jest-dom` extensions and mock providers (`QueryClientProvider`, `ThemeProvider`).

### 2. Base Component & Hook Unit Tests
Implement unit tests for core frontend building blocks:
* `features/auth/components/__tests__/auth-guard.test.tsx` (Test unauthenticated redirect, session loading skeleton, and role restriction).
* `features/products/components/__tests__/product-card.test.tsx` (Test rendering, price formatting, condition badge, and image fallback).
* `features/auth/hooks/__tests__/use-login.test.tsx` (Test login mutation execution & token storage).

## Definition of Done (Tier 03)
- [ ] `pnpm --filter @safqa/web test` command configured and runnable.
- [ ] Unit tests for `AuthGuard` and `ProductCard` pass.
- [ ] Testing pattern documented for subsequent Phase 08 Tiers.

---

# TIER 04 — WORKSPACE VERIFICATION, AUDIT GATE & RELEASE

## Objective
Perform full workspace regression checks, verify 100% scorecard compliance, write the final completion report, and commit to Git.

## Scope of Work

### 1. Automated Verification Commands
Run full workspace checks:
```bash
pnpm --filter @safqa/backend test
pnpm --filter @safqa/web test
pnpm --filter @safqa/web build
```

### 2. Architecture Scorecard Gate
Verify that Scorecard metrics read:
* Frontend Architecture Foundation: **16 / 16 COMPLETE ✅**
* Backend Architecture Foundation: **10 / 10 COMPLETE ✅**
* Foundation Gate Status: **PASSED ✅**

### 3. Final Report & Git Release
* Generate `Architecture_Foundation_Final_Report.md`.
* Execute Git commit:
  ```bash
  git add -A
  git commit -m "refactor(arch): complete Architecture Foundation final cleanup & testing setup"
  git push origin master
  ```

## Definition of Done (Tier 04)
- [ ] All tests pass in web and backend.
- [ ] Next.js build succeeds without type errors or lint warnings.
- [ ] Final audit report committed and pushed.
- [ ] Repository status officially marked: **READY FOR PHASE 08**.
