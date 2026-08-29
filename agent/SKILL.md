---
name: safqa-workflow-compliance
description: Use this skill for ANY implementation, coding, or modification task inside the Safqa project (monorepo with apps/web, apps/backend, apps/mobile, packages/*). Before writing or changing any code, feature, endpoint, or UI in Safqa, this skill forces reading the matching workflow file under documents/WorkFlows/ first. Triggers include "implement X in Safqa", "add a feature to Safqa", "fix Y in Safqa", "build the Z screen", or any coding task where the project is Safqa — even if the user doesn't explicitly mention "workflow".
---

# Safqa Workflow Compliance & Architecture Enforcement

## ⚠️ MANDATORY RULE: NEVER WRITE CODE WITHOUT READING WORKFLOWS FIRST

The Safqa project documents the exact end-to-end behavior of every single business capability (Frontend ↔ Backend ↔ Database) inside `documents/WorkFlows/`.
**No implementation task in this project should EVER be started from memory, assumption, or general best practices alone.** It MUST follow the workflow file that governs that specific capability.

Before touching or creating any file in `apps/web` or `apps/backend`:
1. You MUST call `view_file` on the corresponding workflow file under `documents/WorkFlows/`.
2. You MUST explicitly state in your response which workflow file was reviewed.

---

## 🗺️ WorkFlows Directory Mapping (`documents/WorkFlows/`)

| Domain | Workflow Files (under `documents/WorkFlows/`) |
|---|---|
| **User & Auth** | `User/Authentication_Workflow.md`<br>`User/User_Profile_Workflow.md`<br>`User/User_Settings_Workflow.md` |
| **Marketplace** | `Marketplace/Product_Management_Workflow.md`<br>`Marketplace/Product_Discovery_Workflow.md`<br>`Marketplace/Favorites_Workflow.md`<br>`Marketplace/Product_Lifecycle_Workflow.md` |
| **Communication** | `Communication/Messaging_Workflow.md`<br>`Communication/Notification_Workflow.md` |
| **Administration** | `Administration/Admin_Workflow.md`<br>`Administration/Category_Management_Workflow.md`<br>`Administration/Report_Workflow.md` |
| **System & Architecture** | `System/Frontend_Architecture_Workflow.md`<br>`System/Backend_Architecture_Workflow.md`<br>`System/Media_Workflow.md`<br>`System/File_Upload_Workflow.md`<br>`System/Error_Handling_Workflow.md`<br>`System/Permission_Workflow.md`<br>`System/Logging_Workflow.md`<br>`System/Performance_Engineering_Workflow.md` |

---

## 📋 Mandatory Process — Follow in Strict Order Every Time

### 1. Identify and Read the Domain Workflow File(s)
* Before writing a single line of code, locate the matching file in `documents/WorkFlows/`.
* Use `view_file` to read the entire workflow: data flow, endpoint contracts, response structures, database relationships, error codes, and permissions.
* If a feature spans multiple domains (e.g. creating a product with image upload), read BOTH domain workflows (`Marketplace/Product_Management_Workflow.md` AND `System/File_Upload_Workflow.md`).

### 2. Cross-Check Architecture & Modeling Docs
* `documents/Project_Roadmap/01_Safqa_Architecture_Decisions.md`
* `documents/Project_Roadmap/02_database-system-modeling.md`
* `documents/Project_Roadmap/05_DesignSystem_ColorSytstem.md`

### 3. Frontend Architecture Pre-Review (`System/Frontend_Architecture_Workflow.md`)
* **Feature Boundaries:** Code must live inside `features/<feature>/` (components, api, hooks, types, query-keys).
* **State Ownership:** Server state MUST use TanStack Query (`useQuery` / `useMutation`). NO global client state (Redux/Zustand) for server data.
* **API Flow:** `Component` ➔ `Feature Hook` ➔ `Feature API` ➔ `apiClient` ➔ `Backend`. NO direct `fetch()` in pages or components.
* **Query Keys:** Must use local `features/<feature>/query-keys.ts`. NO centralized monolithic query key files.

### 4. Backend Architecture Pre-Review (`System/Backend_Architecture_Workflow.md`)
* **Layering:** `Module` ➔ `Controller` (thin, DTO validation) ➔ `Service` (business logic) ➔ `PrismaService` ➔ `PostgreSQL`.
* **Security:** Use `JwtAuthGuard` and `RolesGuard` for protected endpoints.
* **Response Contracts:** Match the exact JSON shapes expected by the Frontend and defined in the domain workflow.

### 5. Performance Engineering Pre-Review (`System/Performance_Engineering_Workflow.md`)
* Client vs Server components boundary.
* Code splitting & dynamic imports (`dynamic()`) for heavy/admin modules.
* Debouncing on search/filter inputs.

### 6. Post-Implementation Verification & Definition of Done
* Verify with test suites: `pnpm --filter @safqa/backend test`
* Verify build: `pnpm --filter @safqa/web build`
* Update Roadmap checkboxes `[x] ✅`.

---

## 🚫 Absolute Rules & Prohibitions

1. **NEVER assume API payloads or database models** — always verify from `documents/WorkFlows/` and Prisma schema.
2. **NEVER put domain-specific UI components in global `components/`** — put them in `features/<feature>/components/`.
3. **NEVER use `fetch()` or `axios` directly in pages or components** — only inside `lib/api/api-client.ts`.
4. **NEVER skip reading the workflow file before implementation.**
5. **ALWAYS state the workflow file reviewed in your response to the user.**
