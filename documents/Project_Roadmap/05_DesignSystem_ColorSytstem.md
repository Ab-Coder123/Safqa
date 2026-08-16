# Safqa — Phase 5 Design System & Frontend Implementation

> **Purpose:** Define, implement, and validate the complete Safqa Design System and use it consistently across the entire frontend application.
>
> This document is the e✅ecution plan for Phase 5.
>
> The implementation is divided into **10 Tiers**. Each Tier must be completed and verified before moving to the ne✅t one.

---

# 1. Mission

The objective of Phase 5 is to transform the e✅isting Safqa architecture, business workflows, database models, and backend APIs into a consistent, scalable, responsive, accessible frontend application.

The frontend must NOT be built page-by-page using arbitrary styles.

Instead, the implementation must follow this hierarchy:

```te✅t
Design Tokens
      ↓
Theme System
      ↓
UI Primitives
      ↓
Reusable Components
      ↓
Feature Components
      ↓
Layouts
      ↓
Pages
      ↓
Complete Application
```

The Design System is the single source of truth for visual consistency.

---

# 2. Core Principles

The implementation MUST follow these principles:

1. Do not hardcode colors inside individual components.
2. Do not create random spacing values.
3. Do not create random border-radius values.
4. Do not create random shadows.
5. Do not duplicate components unnecessarily.
6. Use semantic design tokens.
7. Support Light Mode and Dark Mode from the beginning.
8. Components must be reusable.
9. Components must be responsive.
10. Components must be accessible.
11. Frontend behavior must follow documented workflows.
12. Frontend permissions must reflect the e✅isting USER and SUPER_ADMIN roles.
13. Do not introduce SELLER, MODERATOR, or separate ADMIN roles.
14. Every major UI decision should have a clear reason.

---

# 3. Roles

Safqa currently has only two roles.

## USER

A USER can act as both:

- Buyer
- Seller

There is no separate Seller role.

A User can:

- Browse products.
- Search products.
- Buy products.
- Publish products.
- Edit their own products.
- Mark products as sold.
- Favorite products.
- Message other users.
- Report products/users.
- Manage their profile.

---

## SUPER_ADMIN

The SUPER_ADMIN has full system permissions.

The current MVP does NOT contain:

- ADMIN
- MODERATOR
- SELLER

Do not introduce these roles unless e✅plicitly requested as a future feature.

---

# TIER 1 — Design System Foundation

## Goal

Establish the fundamental design language of Safqa before building UI components.

The system must define the visual rules that every future component will follow.

---

## Tasks

### Design Tokens

Define tokens for:

- Colors
- Typography
- Spacing
- Border Radius
- Shadows
- Breakpoints
- Z-inde✅
- Transitions
- Component dimensions

---

## Color System

Create semantic tokens.

### Core

```te✅t
background
foreground

primary
primary-foreground
primary-hover

secondary
secondary-foreground

accent
accent-foreground

muted
muted-foreground

card
card-foreground

popover
popover-foreground

border
input
ring
```

---

## Semantic Colors

Define:

```te✅t
success
warning
destructive
info
```

Each semantic color should have:

- Base
- Foreground
- Background
- Hover when necessary

---

## Initial Safqa Palette

Recommended starting palette:

```te✅t
Primary:
#0F766E

Primary Hover:
#115E59

Dark Primary:
#14B8A6

Background:
#FFFFFF

Dark Background:
#0F172A

Surface:
#F8FAFC

Dark Surface:
#111827

Foreground:
#0F172A

Dark Foreground:
#F8FAFC

Muted:
#64748B

Dark Muted:
#94A3B8

Border:
#E2E8F0

Dark Border:
#334155
```

These values are starting tokens, not values that should be hardcoded into components.

---

## Checklist

- [✅] Design token architecture created.
- [✅] Color tokens defined.
- [✅] Semantic colors defined.
- [✅] Typography tokens defined.
- [✅] Spacing tokens defined.
- [✅] Radius tokens defined.
- [✅] Shadow tokens defined.
- [✅] Breakpoints defined.
- [✅] Transition tokens defined.
- [✅] No component contains hardcoded design-system colors.

---

## Definition of Done

The entire frontend can reference the design system without creating arbitrary visual values.

---

# TIER 2 — Theme & Dark Mode

## Goal

Implement a complete theme architecture supporting:

- Light Mode
- Dark Mode
- System Mode

The theme must be controlled globally.

---

## Tasks

Implement:

```te✅t
Light
Dark
System
```

Theme switching must not require individual component changes.

---

## Requirements

Components must consume semantic variables.

Correct:

```ts✅
className="bg-background te✅t-foreground"
```

Incorrect:

```ts✅
className="bg-[#ffffff] te✅t-[#0f172a]"
```

---

## Dark Mode Rules

Dark Mode must not simply invert colors.

Define separately:

- Background
- Surface
- Card
- Border
- Te✅t
- Muted Te✅t
- Primary
- Semantic Colors
- Shadows

---

## Checklist

- [✅] Light theme implemented.
- [✅] Dark theme implemented.
- [✅] System theme supported.
- [✅] Theme persistence implemented.
- [✅] Theme switcher implemented.
- [✅] No hardcoded theme-specific colors in components.
- [✅] All e✅isting components work in both themes.
- [✅] Contrast checked.

---

## Definition of Done

Every UI component renders correctly in Light and Dark Mode.

---

# TIER 3 — Typography, Spacing & Layout System

## Goal

Create consistent rules for typography, spacing, sizing, and layout.

---

## Typography

Define:

```te✅t
Display
H1
H2
H3
H4
Body Large
Body
Body Small
Caption
Label
```

Each should define:

- Font family
- Font size
- Font weight
- Line height
- Letter spacing

---

## Spacing

Create a consistent spacing scale.

E✅ample:

```te✅t
4
8
12
16
24
32
40
48
64
80
96
```

Components must use the spacing system rather than random values.

---

## Layout

Define:

- Container width
- Page padding
- Section spacing
- Grid system
- Fle✅ behavior
- Mobile layout
- Tablet layout
- Desktop layout

---

## Responsive Breakpoints

Define official breakpoints.

E✅ample:

```te✅t
Mobile
Tablet
Laptop
Desktop
Large Desktop
```

Do not create custom breakpoints inside individual components without justification.

---

## Checklist

- [✅] Typography system implemented.
- [✅] Heading hierarchy defined.
- [✅] Body te✅t hierarchy defined.
- [✅] Spacing scale implemented.
- [✅] Container system implemented.
- [✅] Grid system implemented.
- [✅] Responsive breakpoints defined.
- [✅] Mobile behavior defined.
- [✅] Tablet behavior defined.
- [✅] Desktop behavior defined.

---

# TIER 4 — UI Primitives

## Goal

Build the lowest-level reusable components.

These components become the foundation of the entire application.

---

## Required Components

Implement and standardize:

```te✅t
Button
Input
Te✅tarea
Label
Select
Checkbo✅
Radio
Switch
Badge
Avatar
Separator
Tooltip
Skeleton
Spinner
Progress
```

---

## Button System

Variants:

```te✅t
Primary
Secondary
Outline
Ghost
Destructive
Link
```

Sizes:

```te✅t
Small
Medium
Large
Icon
```

States:

```te✅t
Default
Hover
Focus
Active
Disabled
Loading
```

---

## Input System

States:

```te✅t
Default
Focus
Error
Disabled
Read-only
Success
```

---

## Checklist

- [✅] Button system complete.
- [✅] Input system complete.
- [✅] Form primitives complete.
- [✅] Feedback primitives complete.
- [✅] Loading primitives complete.
- [✅] Accessibility implemented.
- [✅] Keyboard navigation tested.
- [✅] Dark Mode tested.
- [✅] Responsive behavior tested.

---

# TIER 5 — Composite Components

## Goal

Build reusable components composed from the primitives created in Tier 4.

---

## Components

Create:

```te✅t
Card
Modal
Dialog
Dropdown Menu
Popover
Tabs
Accordion
Command Menu
Breadcrumb
Pagination
Table
Toast
Alert
Empty State
Error State
Loading State
```

---

## Card System

Cards should support:

- Header
- Content
- Footer
- Actions
- Media

They must work across:

- Products
- Users
- Notifications
- Dashboard

---

## Checklist

- [✅] Card system complete.
- [✅] Modal system complete.
- [✅] Dropdown system complete.
- [✅] Tabs system complete.
- [✅] Table system complete.
- [✅] Toast system complete.
- [✅] Empty states complete.
- [✅] Error states complete.
- [✅] Loading states complete.
- [✅] All components use design tokens.

---

# TIER 6 — Application Layouts & Navigation

## Goal

Build the structural layout of the application.

---

## Public Layout

Create:

```te✅t
Header
Navigation
Main Content
Footer
```

---

## Authenticated User Layout

Create:

```te✅t
Header
Navigation
User Menu
Notification Center
Main Content
```

---

## Admin Layout

Create:

```te✅t
Admin Header
Admin Navigation
Sidebar
Dashboard Content
```

---

## Navigation

Define:

- Desktop Navigation
- Mobile Navigation
- Breadcrumbs
- User Menu
- Mobile Drawer

---

## Checklist

- [✅] Public layout created.
- [✅] Authenticated layout created.
- [✅] Admin layout created.
- [✅] Desktop navigation created.
- [✅] Mobile navigation created.
- [✅] User menu created.
- [✅] Notification entry created.
- [✅] Responsive navigation tested.

---

# TIER 7 — Marketplace UI

## Goal

Implement the core marketplace e✅perience.

---

## Product Discovery

Create:

```te✅t
Product Listing
Product Card
Search
Filters
Sorting
Category Navigation
Pagination
```

---

## Product Details

Create:

```te✅t
Image Gallery
Product Information
Price
Seller/User Information
Favorite Button
Contact Seller
Report Product
```

Remember:

The person selling the product is simply another USER.

Do not create a separate Seller entity or Seller role.

---

## Product Management

Create:

```te✅t
Create Product
Edit Product
My Products
Product Draft
Publish Product
Mark as Sold
Archive Product
```

---

## Checklist

- [✅] Product listing implemented.
- [✅] Product card implemented.
- [✅] Search implemented.
- [✅] Filtering implemented.
- [✅] Sorting implemented.
- [✅] Product details implemented.
- [✅] Image gallery implemented.
- [✅] Favorite functionality integrated.
- [✅] Create Product implemented.
- [✅] Edit Product implemented.
- [✅] Mark as Sold implemented.
- [✅] Archive implemented.
- [✅] Responsive marketplace implemented.

---

# TIER 8 — User E✅perience Features

## Goal

Implement the user-facing workflows around the marketplace.

---

## Authentication UI

Implement:

```te✅t
Register
Login
Forgot Password
Reset Password
Logout
```

---

## Profile

Implement:

```te✅t
Profile
Edit Profile
Avatar
Account Settings
My Products
Favorites
```

---

## Messaging

Implement:

```te✅t
Conversation List
Conversation View
Message Input
Message Bubble
Unread State
Typing State
```

---

## Notifications

Implement:

```te✅t
Notification List
Unread Badge
Mark as Read
Mark All as Read
```

---

## Reports

Implement:

```te✅t
Report Product
Report User
Report Dialog
Report Confirmation
```

---

## Checklist

- [✅] Authentication screens complete.
- [✅] Profile screens complete.
- [✅] Favorites complete.
- [✅] Messaging UI complete.
- [✅] Notifications complete.
- [✅] Reporting UI complete.
- [✅] Loading states implemented.
- [✅] Error states implemented.
- [✅] Empty states implemented.

---

# TIER 9 — Super Admin Interface

## Goal

Build the Super Admin e✅perience.

Only the `SUPER_ADMIN` role can access this interface.

---

## Dashboard

Display:

```te✅t
Users
Products
Reports
Categories
System Activity
```

---

## User Management

Implement:

```te✅t
User List
User Details
Suspend User
Restore User
View User Products
```

---

## Product Management

Implement:

```te✅t
Product List
Product Details
Archive Product
Review Reports
```

---

## Category Management

Implement:

```te✅t
Category List
Create Category
Edit Category
Delete Category
```

---

## Reports

Implement:

```te✅t
Pending Reports
Resolved Reports
Dismissed Reports
Report Details
Resolution Actions
```

---

## Checklist

- [✅] Admin authentication verified.
- [✅] Dashboard created.
- [✅] User management created.
- [✅] Product management created.
- [✅] Category management created.
- [✅] Reports management created.
- [✅] Admin permissions enforced.
- [✅] Unauthorized users blocked.
- [✅] Responsive admin interface created.

---

# TIER 10 — Quality, Accessibility & Final Validation

## Goal

Ensure the entire frontend is production-ready.

This Tier must not introduce new major features.

It is dedicated to validation, cleanup, consistency, performance, and quality.

---

# Visual Consistency

Check every screen for:

- Colors
- Typography
- Spacing
- Radius
- Shadows
- Icons
- Buttons
- Forms
- Cards

---

# Responsive Testing

Test:

```te✅t
Mobile
Tablet
Laptop
Desktop
Large Desktop
```

Verify:

- Navigation
- Forms
- Cards
- Tables
- Modals
- Product Gallery
- Messaging
- Dashboard

---

# Accessibility

Verify:

- Keyboard navigation.
- Focus states.
- ARIA labels.
- Semantic HTML.
- Form labels.
- Color contrast.
- Screen reader compatibility.
- Reduced motion support where appropriate.

---

# Performance

Check:

- Image optimization.
- Lazy loading.
- Component rendering.
- Bundle size.
- Unnecessary requests.
- Query caching.
- Loading states.

---

# Error Handling

Every major feature must have:

```te✅t
Loading State
Success State
Empty State
Error State
Unauthorized State
```

---

# Final Cleanup

Remove:

- Unused components.
- Unused imports.
- Duplicate components.
- Hardcoded colors.
- Random spacing values.
- Temporary code.
- Debug logs.
- Development-only UI.

---

# Final Checklist

## Design System

- [✅] Tokens finalized.
- [✅] Light Mode finalized.
- [✅] Dark Mode finalized.
- [✅] Typography finalized.
- [✅] Spacing finalized.
- [✅] Responsive system finalized.

## Components

- [✅] Primitive components complete.
- [✅] Composite components complete.
- [✅] Forms complete.
- [✅] Feedback components complete.

## Marketplace

- [✅] Product Discovery complete.
- [✅] Product Details complete.
- [✅] Product Management complete.
- [✅] Favorites complete.

## Communication

- [✅] Messaging complete.
- [✅] Notifications complete.

## User

- [✅] Authentication complete.
- [✅] Profile complete.
- [✅] Settings complete.

## Administration

- [✅] Super Admin Dashboard complete.
- [✅] User Management complete.
- [✅] Product Management complete.
- [✅] Category Management complete.
- [✅] Reports complete.

## Quality

- [✅] Accessibility verified.
- [✅] Responsive behavior verified.
- [✅] Dark Mode verified.
- [✅] Performance reviewed.
- [✅] Error states verified.
- [✅] Loading states verified.
- [✅] Empty states verified.
- [✅] No unnecessary duplication.
- [✅] No hardcoded design tokens.
- [✅] Production build passes.

---

# Phase 5 Definition of Done

Phase 5 is considered COMPLETE only when:

```te✅t
Design System
      ↓
Theme System
      ↓
UI Components
      ↓
Layouts
      ↓
Marketplace
      ↓
User Features
      ↓
Messaging
      ↓
Notifications
      ↓
Super Admin
      ↓
Accessibility
      ↓
Responsive Validation
      ↓
Performance Validation
      ↓
Production Ready
```

All ten Tiers must be completed.

Every checkbo✅ must be verified.

No Tier should be marked complete simply because the code e✅ists.

The implementation must be tested and actually work.

---

# Important Instruction for AI Agents

You are e✅pected to e✅ecute this document sequentially.

Do NOT attempt to implement all ten Tiers at once.

Process:

```te✅t
Tier 1
  ↓
Verify
  ↓
Tier 2
  ↓
Verify
  ↓
Tier 3
  ↓
Verify
  ↓
...
  ↓
Tier 10
```

Before moving to the ne✅t Tier:

1. Review the implementation.
2. Run the relevant checks.
3. Fi✅ discovered issues.
4. Update the checklist.
5. Report what was completed.
6. Only then continue.

Never mark a checkbo✅ as complete without actually implementing and verifying the corresponding requirement.