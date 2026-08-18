---
name: safqa-workflow-compliance
description: Use this skill for ANY implementation, coding, or modification task inside the Safqa project (monorepo with apps/web, apps/backend, apps/mobile, packages/*). Before writing or changing any code, feature, endpoint, or UI in Safqa, this skill forces reading the matching workflow file under documents/WorkFlows/ first. Triggers include "implement X in Safqa", "add a feature to Safqa", "fix Y in Safqa", "build the Z screen", or any coding task where the project is Safqa — even if the user doesn't explicitly mention "workflow".
---

# Safqa Workflow Compliance

## Purpose

The Safqa project documents the exact end-to-end behavior of every business capability (Frontend ↔ Backend ↔ Database) inside `documents/WorkFlows/`. No implementation task in this project should ever be started from assumption or general best practice alone — it must follow the workflow file that governs that specific capability.

## Mandatory process — follow in order, every time

### 1. Identify the domain of the task
Before writing any code, map the user's request to one of the Safqa domains:

| Domain | Workflow files (under `documents/WorkFlows/`) |
|---|---|
| **User** | `User/Authentication_Workflow.md`, `User/User_Profile_Workflow.md`, `User/User_Settings_Workflow.md` |
| **Marketplace** | `Marketplace/Product_Management_Workflow.md`, `Marketplace/Product_Discovery_Workflow.md`, `Marketplace/Favorites_Workflow.md`, `Marketplace/Product_Lifecycle_Workflow.md` |
| **Communication** | `Communication/Messaging_Workflow.md`, `Communication/Notification_Workflow.md` |
| **Administration** | `Administration/Admin_Workflow.md`, `Administration/Category_Management_Workflow.md`, `Administration/Report_Workflow.md` |
| **System** | `System/Frontend_Architecture_Workflow.md`, `System/Backend_Architecture_Workflow.md`, `System/Media_Workflow.md`, `System/File_Upload_Workflow.md`, `System/Error_Handling_Workflow.md`, `System/Permission_Workflow.md`, `System/Logging_Workflow.md`, `System/Performance_Engineering_Workflow.md` |

If the task spans more than one domain (e.g. "add a report button on a product page" touches both Marketplace and Administration/Report), identify ALL relevant workflow files — not just the most obvious one.

If you're unsure which domain a task belongs to, first read `documents/WorkFlows/README.md` for the overview, then narrow down.

### 2. Read the workflow file(s) fully before writing any code
Use the `view` tool to open every relevant workflow file identified in step 1. Do not skim — read the full data flow, validation rules, error handling, performance guardrails, and authorization rules it defines.

### 3. Cross-check supporting docs when relevant
For anything touching data models, architecture decisions, or design system tokens, also check:
- `documents/Project_Roadmap/01_Safqa_Architecture_Decisions.md`
- `documents/Project_Roadmap/02_database-system-modeling.md`
- `documents/Project_Roadmap/03_Create_Database_And_Project_Setup.md`
- `documents/Project_Roadmap/04_Feature_Implementation_Roadmap.md`
- `documents/Project_Roadmap/05_DesignSystem_ColorSytstem.md`

Read these if the task involves new data models, schema changes, UI tokens, or architecture-level decisions the workflow file references but doesn't fully define.

### 4. Mandatory Performance Engineering Pre-Review
Before writing or modifying any frontend component, page, hook, or event handler, you MUST evaluate `System/Performance_Engineering_Workflow.md` and answer:
- **Client/Server Boundary:** Does this need `"use client"`? Can it remain a Server Component?
- **Bundle & Code Splitting:** Is dynamic import or route splitting needed for heavy or admin-only modules?
- **Memoization:** Is there an expensive calculation or high-frequency list rendering justifying `useMemo` or `React.memo` without over-optimizing?
- **Events:** Do text inputs, search, scroll, or resize events require debouncing/throttling?
- **State Scope:** Is state localized to prevent global re-render cascades?

### 4A. Mandatory Frontend Architecture Pre-Review
Before writing or modifying any frontend route, component, hook, API call, form, or client-side data flow, you MUST read `System/Frontend_Architecture_Workflow.md` and answer:
- Which feature owns this code?
- Is the data Server State or Client/UI State?
- Which feature API service owns the endpoint?
- Which query or mutation owns the request?
- Which component owns the UI?
- What should remain shared or reusable?
- Does this require a new dependency?
- Does this affect rendering performance or auth/admin bundle isolation?

### 4B. Mandatory Backend Architecture Pre-Review
Before writing or modifying any backend controller, DTO, service, guard, Prisma query, or module, you MUST read `System/Backend_Architecture_Workflow.md` and answer:
- Which backend module owns the domain behavior?
- Does the controller remain thin?
- Which DTO validates the request?
- Where does the business rule live?
- Is Prisma access isolated from the controller?
- Which authentication, permission, error, and test rules apply?

### 5. Implement strictly according to the workflow
- Follow the exact data flow described (Frontend → Backend → Database, or whichever direction the workflow defines)
- Apply the same validation, error handling, permission, and performance rules described in `System/Error_Handling_Workflow.md`, `System/Permission_Workflow.md`, and `System/Performance_Engineering_Workflow.md` — these apply globally across all domains
- Match existing naming conventions, folder structure, and patterns already used in `apps/web`, `apps/backend`, `apps/mobile`, and `packages/*`
- If the workflow file is ambiguous or silent on a specific implementation detail, say so explicitly and ask the user rather than inventing behavior

### 6. Mandatory Post-Implementation Verification & Definition of Done
After implementation, verify:
- Functional correctness according to the domain workflow
- Performance adherence (no render cascades, no unnecessary bundle bloating)
- Run workspace validation scripts: TypeScript check (`tsc --noEmit`), build verification (`pnpm --filter @safqa/web build`), and test suites (`pnpm --filter @safqa/backend test`)

## Rules

- Never start writing code in the Safqa project before identifying and reading the matching workflow file(s).
- Always enforce `System/Frontend_Architecture_Workflow.md` and `System/Backend_Architecture_Workflow.md` on all feature work.
- Always enforce `System/Performance_Engineering_Workflow.md` on all UI, state, event, and data operations.
- DO NOT implement API calls directly inside pages or components (`fetch()` is only permitted inside `lib/api/api-client.ts`).
- DO NOT duplicate server state into client state managers (Redux, Zustand, local state). Use TanStack Query hooks.
- DO NOT create feature code outside its owning feature directory (`features/<feature>/`).
- DO NOT add a new dependency without architectural justification.
- DO NOT start a Tier feature before Architecture Foundation requirements are satisfied.
- Never rely on general best practices alone when a workflow file exists for that domain — the workflow file is the source of truth for THIS project.
- If a workflow file doesn't exist for what's being asked (a genuinely new capability), say so explicitly and propose that a new workflow doc be written first, rather than silently improvising.
- Always mention, briefly, which workflow file(s) were used before showing the implementation — so the user can verify the right one was applied.
