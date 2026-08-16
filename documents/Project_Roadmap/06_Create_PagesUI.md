                 ┌─────────────────────┐
                 │   Safqa Landing     │
                 │       Page          │
                 │                     │
                 │  What is Safqa?     │
                 │  Why Safqa?          │
                 │  How it works       │
                 │  Features           │
                 │  Trust & Safety     │
                 └──────────┬──────────┘
                            │
                     [ Get Started ]
                            │
                            ▼
                 ┌─────────────────────┐
                 │    Auth Gateway     │
                 │                     │
                 │   Login             │
                 │   Create Account    │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │    Safqa App        │
                 │       Home          │
                 └─────────────────────┘

# Safqa — Phase 6 Frontend Pages Scope

## Purpose

This document is the execution checklist for building all Safqa frontend pages.

The Design System, CSS architecture, design tokens, themes, and frontend foundation have already been completed.

This stage is ONLY about:

- Building the actual pages.
- Implementing the UI/UX.
- Connecting existing components and design tokens.
- Making every page responsive.
- Following the approved page designs.
- Verifying each page before marking it complete.

---

# Page Execution Flow

Pages must be implemented in the following order:

Landing Page
↓
Authentication
↓
User Home
↓
Marketplace
↓
Product Details
↓
Product Creation
↓
User Products
↓
Favorites
↓
Messaging
↓
Notifications
↓
Profile
↓
Settings
↓
Reports
↓
Super Admin


IMPORTANT:

Do NOT skip ahead.

Complete the current page, verify it, and mark its checkbox as completed before moving to the next page.

---

# User Pages

| # | Page | Route | Status |
|---|---|---|---|
| 1 | Landing Page | `/` | ⬜ |
| 2 | Authentication Gateway | `/auth` | ⬜ |
| 3 | Login | `/auth/login` | ⬜ |
| 4 | Register | `/auth/register` | ⬜ |
| 5 | Forgot Password | `/auth/forgot-password` | ⬜ |
| 6 | Reset Password | `/auth/reset-password` | ⬜ |
| 7 | Verification | `/auth/verify` | ⬜ |
| 8 | User Home | `/home` | ⬜ |
| 9 | Marketplace | `/products` | ⬜ |
| 10 | Product Details | `/products/[id]` | ⬜ |
| 11 | Create Product | `/products/create` | ⬜ |
| 12 | Edit Product | `/products/[id]/edit` | ⬜ |
| 13 | My Products | `/my-products` | ⬜ |
| 14 | Favorites | `/favorites` | ⬜ |
| 15 | Messages | `/messages` | ⬜ |
| 16 | Conversation | `/messages/[id]` | ⬜ |
| 17 | Notifications | `/notifications` | ⬜ |
| 18 | Profile | `/profile` | ⬜ |
| 19 | Edit Profile | `/profile/edit` | ⬜ |
| 20 | Settings | `/settings` | ⬜ |
| 21 | My Reports | `/reports` | ⬜ |

---

# Super Admin Pages

There are currently only two system roles:

- USER
- SUPER_ADMIN

There is NO separate Seller, Moderator, or regular Admin role at this stage.

| # | Page | Route | Status |
|---|---|---|---|
| 1 | Admin Dashboard | `/admin` | ⬜ |
| 2 | Users Management | `/admin/users` | ⬜ |
| 3 | User Details | `/admin/users/[id]` | ⬜ |
| 4 | Products Management | `/admin/products` | ⬜ |
| 5 | Product Review | `/admin/products/[id]` | ⬜ |
| 6 | Categories | `/admin/categories` | ⬜ |
| 7 | Reports | `/admin/reports` | ⬜ |
| 8 | Report Details | `/admin/reports/[id]` | ⬜ |

---

# Completion Rule

A page can only be marked:

`☑ Complete`

after:

- UI has been implemented.
- Approved design has been followed.
- Existing Design System has been used.
- Responsive behavior has been implemented.
- Light/Dark mode has been verified.
- No visual/layout errors remain.
- No TypeScript/build errors were introduced.
- Existing pages were not broken.

Do NOT mark a page complete simply because the code exists.

---

# Current Progress

## User Flow

- [x] Landing Page
- [ ] Authentication
- [ ] User Home
- [ ] Marketplace
- [ ] Product Details
- [ ] Create Product
- [ ] Edit Product
- [ ] My Products
- [ ] Favorites
- [ ] Messages
- [ ] Conversation
- [ ] Notifications
- [ ] Profile
- [ ] Edit Profile
- [ ] Settings
- [ ] My Reports

## Super Admin Flow

- [ ] Admin Dashboard
- [ ] Users Management
- [ ] User Details
- [ ] Products Management
- [ ] Product Review
- [ ] Categories
- [ ] Reports
- [ ] Report Details

---

# Important

This file is a progress tracker.

Do not turn it into a long technical specification.

Detailed implementation instructions for each page should be provided separately when that page is being implemented.