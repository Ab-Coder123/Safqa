# Phase 4 — Feature Implementation Roadmap

> **Purpose:** Define the exact order, priority, and implementation sequence for every feature in the Safqa MVP, using the workflow documents as the specification reference for every feature.
>
> **Prerequisite:** Phase 3 (Project Setup) must be fully complete before starting any implementation task in this phase. Every feature listed here has a corresponding workflow document inside `documents/WorkFlows/`.

---

# Implementation Philosophy

Every feature in Safqa is implemented following this exact sequence:

```text
1. Read the Workflow Document
         ↓
2. Understand Business Rules
         ↓
3. Design the API Contract
         ↓
4. Implement Backend Module
         ↓
5. Write Backend Tests
         ↓
6. Implement Frontend Page / Component
         ↓
7. Integrate API
         ↓
8. Test End-to-End
         ↓
9. Update Documentation
         ↓
10. Mark Feature as Complete
```

No feature is considered complete until all 10 steps are verified.

---

# Implementation Priority Order

Features are implemented in dependency order. Infrastructure features must be complete before consumer features that depend on them.

---

## Tier 1 — Infrastructure (Must Complete First)

These features underpin the entire platform. Nothing else can work without them.

| # | Feature | Workflow Reference | Status |
|---|---|---|---|
| 1 | Shared Types Package (`packages/types`) | `02_database-system-modeling.md` | ✅ Completed |
| 2 | Shared Utils Package (`packages/utils`) | `03_Create_Database_And_Project_Setup.md` | ✅ Completed |
| 3 | Shared Config Package (`packages/config`) | `03_Create_Database_And_Project_Setup.md` | ✅ Completed |
| 4 | Prisma Schema + Migration | `03_Create_Database_And_Project_Setup.md` | ✅ Completed |
| 5 | Database Seed (Categories + Super Admin) | `03_Create_Database_And_Project_Setup.md` | ✅ Completed |
| 6 | NestJS App Bootstrap + Global Config | `03_Create_Database_And_Project_Setup.md` | ✅ Completed |
| 7 | Global Error Filter (NestJS) | `WorkFlows/System/Error_Handling_Workflow.md` | ✅ Completed |
| 8 | Global Permission Guards (NestJS) | `WorkFlows/System/Permission_Workflow.md` | ✅ Completed |
| 9 | Request Logging Interceptor | `WorkFlows/System/Logging_Workflow.md` | ✅ Completed |

---

## Tier 2 — Authentication (Must Complete Before Any User Feature)

Authentication is the foundation of every subsequent feature.

| # | Feature | Workflow Reference | Status |
|---|---|---|---|
| 10 | User Registration API | `WorkFlows/User/Authentication_Workflow.md` | ✅ Completed |
| 11 | User Login API (JWT Issuance) | `WorkFlows/User/Authentication_Workflow.md` | ✅ Completed |
| 12 | JWT Token Refresh API | `WorkFlows/User/Authentication_Workflow.md` | ✅ Completed |
| 13 | Logout + Token Invalidation API | `WorkFlows/User/Authentication_Workflow.md` | ✅ Completed |
| 14 | Frontend: Register Screen | `WorkFlows/User/Authentication_Workflow.md` | ✅ Completed |
| 15 | Frontend: Login Screen | `WorkFlows/User/Authentication_Workflow.md` | ✅ Completed |
| 16 | Frontend: Auth State Management (Redux) | `WorkFlows/User/Authentication_Workflow.md` | ✅ Completed |

---

## Tier 3 — File Upload (Must Complete Before Products / Profiles)

Media uploads are required for publishing products and setting avatars.

| # | Feature | Workflow Reference | Status |
|---|---|---|---|
| 17 | File Upload API (Multer + Storage) | `WorkFlows/System/File_Upload_Workflow.md` | ✅ Completed |
| 18 | Image Compression + WEBP Conversion | `WorkFlows/System/File_Upload_Workflow.md` | ✅ Completed |
| 19 | Media Entity Write + URL Return | `WorkFlows/System/Media_Workflow.md` | ✅ Completed |

---

## Tier 4 — Category Management (Must Complete Before Products)

Products require categories. Categories must exist before any listing can be created.

| # | Feature | Workflow Reference | Status |
|---|---|---|---|
| 20 | Category CRUD API (Admin Only) | `WorkFlows/Administration/Category_Management_Workflow.md` | ✅ Completed |
| 21 | Category List API (Public) | `WorkFlows/Administration/Category_Management_Workflow.md` | ✅ Completed |
| 22 | Frontend: Admin Category Manager | `WorkFlows/Administration/Category_Management_Workflow.md` | ✅ Completed |
| 23 | Frontend: Category Directory Navigation | `WorkFlows/Marketplace/Product_Discovery_Workflow.md` | ✅ Completed |

---

## Tier 5 — User Profile (Core User Feature)

| # | Feature | Workflow Reference | Status |
|---|---|---|---|
| 24 | Get User Profile API (Public) | `WorkFlows/User/User_Profile_Workflow.md` | ✅ Completed |
| 25 | Update Profile API (Authenticated) | `WorkFlows/User/User_Profile_Workflow.md` | ✅ Completed |
| 26 | Frontend: Public Profile Screen | `WorkFlows/User/User_Profile_Workflow.md` | ✅ Completed |
| 27 | Frontend: Private Profile + Settings Screen | `WorkFlows/User/User_Settings_Workflow.md` | ✅ Completed |
| 28 | Change Password API | `WorkFlows/User/User_Settings_Workflow.md` | ✅ Completed |
| 29 | Account Soft-Delete API | `WorkFlows/User/User_Settings_Workflow.md` | ✅ Completed |

---

## Tier 6 — Marketplace Core (Primary Business Value)

The marketplace listing system is the core product of Safqa.

| # | Feature | Workflow Reference | Status |
|---|---|---|---|
| 30 | Create Product API + Daily Limit Enforcement | `WorkFlows/Marketplace/Product_Management_Workflow.md` | ✅ Completed |
| 31 | Edit Product API (Owner Only) | `WorkFlows/Marketplace/Product_Management_Workflow.md` | ✅ Completed |
| 32 | Delete/Archive Product API | `WorkFlows/Marketplace/Product_Management_Workflow.md` | ✅ Completed |
| 33 | Mark Product as Sold API | `WorkFlows/Marketplace/Product_Lifecycle_Workflow.md` | ✅ Completed |
| 34 | Get Product Details API (Public) | `WorkFlows/Marketplace/Product_Management_Workflow.md` | ✅ Completed |
| 35 | Product Search + Filter API | `WorkFlows/Marketplace/Product_Discovery_Workflow.md` | ✅ Completed |
| 36 | Frontend: Home Feed (Listing Grid) | `WorkFlows/Marketplace/Product_Discovery_Workflow.md` | ✅ Completed |
| 37 | Frontend: Product Details Screen | `WorkFlows/Marketplace/Product_Management_Workflow.md` | ✅ Completed |
| 38 | Frontend: Publish Product Form | `WorkFlows/Marketplace/Product_Management_Workflow.md` | ✅ Completed |
| 39 | Frontend: Search + Filter UI | `WorkFlows/Marketplace/Product_Discovery_Workflow.md` | ✅ Completed |
| 40 | Frontend: My Listings Screen | `WorkFlows/Marketplace/Product_Lifecycle_Workflow.md` | ✅ Completed |

---

## Tier 7 — Favorites

| # | Feature | Workflow Reference | Status |
|---|---|---|---|
| 41 | Toggle Favorite API | `WorkFlows/Marketplace/Favorites_Workflow.md` | ✅ Completed |
| 42 | Get User Favorites API | `WorkFlows/Marketplace/Favorites_Workflow.md` | ✅ Completed |
| 43 | Frontend: Favorites Screen | `WorkFlows/Marketplace/Favorites_Workflow.md` | ✅ Completed |
| 44 | Frontend: Heart Icon Toggle on Product Cards | `WorkFlows/Marketplace/Favorites_Workflow.md` | ✅ Completed |

---

## Tier 8 — Notifications

| # | Feature | Workflow Reference | Status |
|---|---|---|---|
| 45 | Create Notification (Internal Service) | `WorkFlows/Communication/Notification_Workflow.md` | ✅ Completed |
| 46 | Get Notifications API (Authenticated) | `WorkFlows/Communication/Notification_Workflow.md` | ✅ Completed |
| 47 | Mark Notification as Read API | `WorkFlows/Communication/Notification_Workflow.md` | ✅ Completed |
| 48 | Auto-Expiry Background Job (3-day cleanup) | `WorkFlows/Communication/Notification_Workflow.md` | ✅ Completed |
| 49 | Frontend: Notifications Screen | `WorkFlows/Communication/Notification_Workflow.md` | ✅ Completed |

---

## Tier 9 — Messaging

| # | Feature | Workflow Reference | Status |
|---|---|---|---|
| 50 | Create / Find Conversation API | `WorkFlows/Communication/Messaging_Workflow.md` | ✅ Completed |
| 51 | Send Message API | `WorkFlows/Communication/Messaging_Workflow.md` | ✅ Completed |
| 52 | Get Conversation Messages API | `WorkFlows/Communication/Messaging_Workflow.md` | ✅ Completed |
| 53 | Mark Messages as Read API | `WorkFlows/Communication/Messaging_Workflow.md` | ✅ Completed |
| 54 | Frontend: Conversations List Screen | `WorkFlows/Communication/Messaging_Workflow.md` | ✅ Completed |
| 55 | Frontend: Chat Detail Screen | `WorkFlows/Communication/Messaging_Workflow.md` | ✅ Completed |
| 56 | WhatsApp Redirect Button | `WorkFlows/Communication/Messaging_Workflow.md` | ✅ Completed |

---

## Tier 10 — Reports & Moderation

| # | Feature | Workflow Reference | Status |
|---|---|---|---|
| 57 | Submit Report API | `WorkFlows/Administration/Report_Workflow.md` | ✅ Completed |
| 58 | Admin: Get Reports Queue API | `WorkFlows/Administration/Report_Workflow.md` | ✅ Completed |
| 59 | Admin: Resolve / Dismiss Report API | `WorkFlows/Administration/Report_Workflow.md` | ✅ Completed |
| 60 | Frontend: Report Button (Product/User) | `WorkFlows/Administration/Report_Workflow.md` | ✅ Completed |
| 61 | Frontend: Admin Reports Dashboard | `WorkFlows/Administration/Report_Workflow.md` | ✅ Completed |

---

## Tier 11 — Admin Dashboard

| # | Feature | Workflow Reference | Status |
|---|---|---|---|
| 62 | Admin: Get Platform Metrics API | `WorkFlows/Administration/Admin_Workflow.md` | ✅ Completed |
| 63 | Admin: Get All Users API (Paginated) | `WorkFlows/Administration/Admin_Workflow.md` | ✅ Completed |
| 64 | Admin: Suspend User API | `WorkFlows/Administration/Admin_Workflow.md` | ✅ Completed |
| 65 | Admin: Activate User API | `WorkFlows/Administration/Admin_Workflow.md` | ✅ Completed |
| 66 | Admin: Archive Any Listing API | `WorkFlows/Administration/Admin_Workflow.md` | ✅ Completed |
| 67 | Frontend: Admin Dashboard Overview Screen | `WorkFlows/Administration/Admin_Workflow.md` | ✅ Completed |
| 68 | Frontend: Admin Users Management Screen | `WorkFlows/Administration/Admin_Workflow.md` | ✅ Completed |

---

# Implementation Rules (Enforcement)

Every developer and AI model implementing a feature MUST follow these rules:

1. **Read Before Writing**: Read the workflow document before writing a single line of code.
2. **Backend First**: Implement and test the API before starting frontend integration.
3. **No Cross-Domain Shortcuts**: Backend code must not directly read frontend files. Frontend must consume APIs only.
4. **Shared Types Only**: Use types from `packages/types`. Never define duplicate interfaces locally.
5. **Error Handling**: Every endpoint must use the global error filter. Never return raw exception stack traces.
6. **Permission Guards**: Every protected endpoint must use authentication and permission guards.
7. **Ownership Checks**: Every mutation endpoint for user-owned resources must verify ownership server-side.
8. **Documentation Update**: After completing a feature, update the corresponding workflow document's status.

---

# Definition of Done Per Feature

A feature is **DONE** only when all of the following are true:

| Check | Description |
|---|---|
| ✅ Workflow Read | Developer has read the corresponding workflow document |
| ✅ API Implemented | Backend API endpoint is created and operational |
| ✅ Validation Added | Input validation (DTO / Zod) is implemented |
| ✅ Permission Checked | Auth guards and ownership checks are active |
| ✅ Error Handled | All exception paths return standardized error responses |
| ✅ Tests Pass | Unit or integration tests cover the feature |
| ✅ Frontend Integrated | UI screen consumes the API correctly |
| ✅ Loading States | Loading, empty, and error states are handled in UI |
| ✅ Mobile Responsive | UI is tested on small screens |
| ✅ No TypeScript Errors | Build passes with zero type errors |

---

# MVP Completion Criteria

The Safqa MVP is considered **production-ready** when:

- All **68 features** across Tiers 1–11 are marked as complete.
- The platform passes end-to-end testing for the core buyer flow:
  - Register → Browse → Search → View Product → Favorite → Contact via WhatsApp.
- The platform passes end-to-end testing for the core seller flow:
  - Register → Publish Product → Receive Contact → Mark as Sold.
- The admin panel passes moderation flow testing:
  - Receive Report → Review → Suspend User / Archive Product.

---

# Next Phase

**Phase 5** covers production deployment, CI/CD pipeline, performance optimization, and scaling strategies.

This will be documented in `05_Production_Deployment.md`.
