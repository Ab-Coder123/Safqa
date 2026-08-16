# Performance Engineering Workflow

## Purpose
The Performance Engineering Workflow establishes mandatory optimization principles, rendering guardrails, code-splitting strategies, and memory/network guidelines across the entire Safqa platform. It ensures fast First Contentful Paint (FCP), optimal Largest Contentful Paint (LCP), low Cumulative Layout Shift (CLS), and frictionless client interactions without over-engineering or premature optimization.

---

## Core Philosophy: Justified & Measured Optimization

> **Cardinal Rule:** Never introduce optimization primitives (`useMemo`, `useCallback`, `React.memo`, `dynamic()`) simply because they exist. Every optimization must have a technical justification.

- **Bad:** Wrapping every function in `useCallback` and every component in `React.memo`.
- **Bad:** Blindly lazy-loading tiny components and creating network waterfall delays.
- **Good:** Applying targeted code-splitting, memoizing expensive computations, stabilizing list-item rendering, and keeping client bundles minimal.

---

## 1. Code Splitting & Dynamic Imports

### Principles:
- **Route-Level Splitting:** Next.js App Router naturally splits routes. Keep shared root layouts lightweight.
- **Feature-Level & Heavy Component Splitting:** Dynamically import heavy UI modules that are not required on initial page load:
  - Complex charts and data visualization tools.
  - Rich text or markdown editors.
  - Heavy administration tables and moderation consoles.
  - Seldom-used modals (e.g., Delete Account, Report Form, Advanced Filters).

### Guidelines:
```tsx
// Correct: Dynamically import heavy non-critical components
import dynamic from 'next/dynamic';

const HeavyAnalyticsChart = dynamic(
  () => import('./analytics-chart').then((mod) => mod.AnalyticsChart),
  {
    loading: () => <Skeleton className="h-64 w-full rounded-xl" />,
    ssr: false, // Use ssr: false only if component depends strictly on browser canvas/window
  }
);
```

---

## 2. Memoization Guardrails (`useMemo`, `useCallback`, `React.memo`)

### `useMemo`
- **When to use:**
  - Calculations involving large arrays (e.g., multi-criteria client-side filtering, sorting hundreds of items).
  - Transforming complex datasets that produce new object/array references consumed by child dependency arrays.
- **When NOT to use:**
  - Simple string formatting, basic arithmetic, or filtering arrays of < 20 items.

### `useCallback`
- **When to use:**
  - Callbacks passed to memoized child components (`React.memo`).
  - Callbacks included in `useEffect` or custom hook dependency arrays where referential stability prevents infinite loops or recalculations.
- **When NOT to use:**
  - Normal event handlers on native HTML elements (`<button onClick={...}>`).

### `React.memo`
- **When to use:**
  - Components rendered frequently in large lists (e.g., `ProductCard`, `MessageBubble`, `NotificationItem`).
  - Heavy visual components that receive unchanged props while parent state updates frequently.
- **When NOT to use:**
  - Top-level page wrappers or leaf components with primitive props that re-render in < 1ms.

---

## 3. Client vs. Server Component Boundaries (`"use client"`)

### Rules:
1. **Default to Server Components:** Keep pages and static layout containers as Server Components whenever possible to reduce JavaScript shipped to the client.
2. **Isolate Client Boundaries:** Push `"use client"` down to the lowest interactive leaf component (e.g., interactive search input, theme toggle, favorite button) rather than marking entire layouts or route trees as client.
3. **No Unnecessary State:** If a component only renders props or static content, do not add client state or hooks.

---

## 4. Event Performance & High-Frequency Listeners

### Rules:
- **Search & Filter Inputs:** Apply debouncing (e.g., 300ms) on live search/filter inputs to prevent sending API requests or filtering large datasets on every keystroke.
- **Scroll, Resize, & Mouse Listeners:** Always debounce, throttle, or use `requestAnimationFrame` when attaching event listeners to `window` or scrollable containers. Always clean up listeners in `useEffect` return functions.

---

## 5. State Management & Subscriptions

### Rules:
- **Colocate State:** Keep state as local as possible (`useState` inside the immediate component). Do not hoist state to global contexts unless shared across distinct feature trees.
- **Scoped Subscriptions:** Ensure components subscribe only to the specific slice of state they need to avoid global re-render cascades.
- **Avoid Object Literals in Props:** Avoid passing newly instantiated inline objects/arrays `style={{ ... }}` or `options={[...]}` to memoized children if it breaks referential equality without justification.

---

## 6. Rendering Audit

Before completing any Tier or feature implementation, a **mandatory rendering audit** must be performed:

### Rendering Audit Checklist (run before closing any Tier):
- [ ] Open React DevTools Profiler or add `console.count('ComponentName render')` temporarily.
- [ ] Verify no component re-renders unnecessarily when unrelated state updates occur.
- [ ] Confirm list-item components (e.g., `ProductCard`, `NotificationItem`) do NOT re-render when sibling items change.
- [ ] Confirm parent page state updates (e.g., loading toggle, search query) do NOT cascade into memoized children.
- [ ] Remove all debug render-count logs before committing.

### Common Render Cascade Patterns to Detect:
- Inline object/array props on memoized children: `<Child options={[...]} />` — creates new reference every render.
- Unstable callback props: `<Child onAction={() => doX()} />` passed to `React.memo` child without `useCallback`.
- Context consumers re-rendering on every context value update even when their slice didn't change.

---

## 7. Authentication Bundle Isolation Rules

### Strict Rules for Auth Pages (`/login`, `/register`, `/forgot-password`):
- **No heavy imports:** Auth pages must NEVER import marketplace components, admin utilities, notification centers, or messaging listeners.
- **Minimal `useState`:** Only form field values, validation errors, loading state, and server error messages are allowed as state in auth pages.
- **No `useEffect` for data fetching:** Auth pages must not fetch marketplace data, user feeds, or any non-auth API on mount.
- **No shared layout with marketplace:** Auth pages use their own isolated `(auth)` route group layout, NOT the main app layout.
- **Bundle size target:** Auth route First Load JS must stay under **120 kB**.

---

## 8. Admin Bundle Isolation & Dynamic Import Enforcement

### Rules:
- **Mandatory `dynamic()` for Admin:** All heavy admin components (data tables, moderation panels, bulk action forms, analytics charts) MUST be imported using Next.js `dynamic()` to prevent standard user sessions from downloading admin code.
- **Admin routes only:** Any component that imports admin-specific utilities must be restricted to files inside `/app/admin/` directory.
- **No admin imports in shared components:** Shared layout components (`Header`, `Footer`, `MobileNav`) must NEVER import or reference admin-only modules.

```tsx
// Enforcement Example — inside /app/admin/page.tsx
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui';

// Heavy moderation table — loaded only when admin visits the page
const ModerationTable = dynamic(
  () => import('@/components/admin/moderation-table'),
  { loading: () => <Skeleton className="h-48 w-full" /> }
);

// Bulk action form — loaded only when admin triggers it
const BulkActionForm = dynamic(
  () => import('@/components/admin/bulk-action-form'),
  { loading: () => <Skeleton className="h-24 w-full" /> }
);
```

---

## 9. Authentication & Admin Domain Isolation (General)

### Rules:
- **Authentication Pages (`/login`, `/register`):** Must remain strictly lightweight. Never bundle marketplace feeds, administrative tools, messaging listeners, or large third-party modules into auth routes.
- **Admin Isolation:** Admin utilities, charts, moderation forms, and bulk action controllers must be isolated within `/admin` routes and dynamic imports so standard user sessions never download administrative bundles.

---

## Mandatory Pre-Implementation Checklist

Before writing code for any feature, page, component, or hook, the engineer/agent must answer:

* [ ] **Client Boundary:** Does this component require `"use client"`? Can interactivity be pushed down to smaller child components?
* [ ] **Bundle Weight:** Does this introduce heavy dependencies? Should it be dynamically imported?
* [ ] **Computation & Lists:** Is there expensive data transformation or frequent list rendering justifying `useMemo` or `React.memo`?
* [ ] **Event Frequency:** Do text input or scroll events require debouncing or throttling?
* [ ] **State Scope:** Is state localized to the minimal component scope?
* [ ] **Domain Isolation:** Are admin or authentication routes kept strictly isolated from unrelated feature bundles?

---

## Mandatory Post-Implementation Verification (Per Tier)

After completing ANY Tier, the following must ALL pass before the Tier is marked `[x]` in the roadmap:

### 🔍 Performance Gate
* [ ] **Rendering Audit Complete:** No unnecessary re-renders detected (see Section 6).
* [ ] **No Over-Optimization:** No unjustified `useMemo`/`useCallback` on trivial operations.
* [ ] **No Render Cascades:** Parent state updates do not cascade into memoized children.
* [ ] **Auth Bundle Isolation:** Auth routes comply with Section 7 rules (< 120 kB First Load JS).
* [ ] **Admin Dynamic Imports:** Any new admin component is imported via `dynamic()` per Section 8.

### 🧪 Build & Test Gate
* [ ] **TypeScript Check:** `pnpm --filter @safqa/web build` or `tsc --noEmit` passes without type errors.
* [ ] **Production Build:** Next.js build succeeds — all static pages generated with zero warnings.
* [ ] **Backend Tests:** `pnpm --filter @safqa/backend test` — all test suites pass.

### 📋 Documentation Gate
* [ ] **Roadmap Updated:** The Tier checkbox is marked `[x]` in `documents/Project_Roadmap/Phase XX.md`.
* [ ] **Workflow Compliance:** The implemented code was cross-checked against its domain workflow file(s) before writing.
