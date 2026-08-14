# Safqa — Phase 5 Design System & Frontend Implementation

> **Purpose:** Define, implement, and validate the complete Safqa Design System and use it consistently across the entire frontend application.
>
> This document is the execution plan for Phase 5.
>
> The implementation is divided into **10 Tiers**. Each Tier must be completed and verified before moving to the next one.

---

# 1. Mission

The objective of Phase 5 is to transform the existing Safqa architecture, business workflows, database models, and backend APIs into a consistent, scalable, responsive, accessible frontend application.

The frontend must NOT be built page-by-page using arbitrary styles.

Instead, the implementation must follow this hierarchy:

```text
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
12. Frontend permissions must reflect the existing USER and SUPER_ADMIN roles.
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

Do not introduce these roles unless explicitly requested as a future feature.

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
- Z-index
- Transitions
- Component dimensions

---

## Color System

Create semantic tokens.

### Core

```text
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

```text
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

```text
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

- [x] Design token architecture created.
- [x] Color tokens defined.
- [x] Semantic colors defined.
- [x] Typography tokens defined.
- [x] Spacing tokens defined.
- [x] Radius tokens defined.
- [x] Shadow tokens defined.
- [x] Breakpoints defined.
- [x] Transition tokens defined.
- [x] No component contains hardcoded design-system colors.

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

```text
Light
Dark
System
```

Theme switching must not require individual component changes.

---

## Requirements

Components must consume semantic variables.

Correct:

```tsx
className="bg-background text-foreground"
```

Incorrect:

```tsx
className="bg-[#ffffff] text-[#0f172a]"
```

---

## Dark Mode Rules

Dark Mode must not simply invert colors.

Define separately:

- Background
- Surface
- Card
- Border
- Text
- Muted Text
- Primary
- Semantic Colors
- Shadows

---

## Checklist

- [x] Light theme implemented.
- [x] Dark theme implemented.
- [x] System theme supported.
- [x] Theme persistence implemented.
- [x] Theme switcher implemented.
- [x] No hardcoded theme-specific colors in components.
- [x] All existing components work in both themes.
- [x] Contrast checked.

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

```text
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

Example:

```text
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
- Flex behavior
- Mobile layout
- Tablet layout
- Desktop layout

---

## Responsive Breakpoints

Define official breakpoints.

Example:

```text
Mobile
Tablet
Laptop
Desktop
Large Desktop
```

Do not create custom breakpoints inside individual components without justification.

---

## Checklist

- [x] Typography system implemented.
- [x] Heading hierarchy defined.
- [x] Body text hierarchy defined.
- [x] Spacing scale implemented.
- [x] Container system implemented.
- [x] Grid system implemented.
- [x] Responsive breakpoints defined.
- [x] Mobile behavior defined.
- [x] Tablet behavior defined.
- [x] Desktop behavior defined.

---

# TIER 4 — UI Primitives

## Goal

Build the lowest-level reusable components.

These components become the foundation of the entire application.

---

## Required Components

Implement and standardize:

```text
Button
Input
Textarea
Label
Select
Checkbox
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

```text
Primary
Secondary
Outline
Ghost
Destructive
Link
```

Sizes:

```text
Small
Medium
Large
Icon
```

States:

```text
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

```text
Default
Focus
Error
Disabled
Read-only
Success
```

---

## Checklist

- [x] Button system complete.
- [x] Input system complete.
- [x] Form primitives complete.
- [x] Feedback primitives complete.
- [x] Loading primitives complete.
- [x] Accessibility implemented.
- [x] Keyboard navigation tested.
- [x] Dark Mode tested.
- [x] Responsive behavior tested.

---

# TIER 5 — Composite Components

## Goal

Build reusable components composed from the primitives created in Tier 4.

---

## Components

Create:

```text
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

- [x] Card system complete.
- [x] Modal system complete.
- [x] Dropdown system complete.
- [x] Tabs system complete.
- [x] Table system complete.
- [x] Toast system complete.
- [x] Empty states complete.
- [x] Error states complete.
- [x] Loading states complete.
- [x] All components use design tokens.

---

# TIER 6 — Application Layouts & Navigation

## Goal

Build the structural layout of the application.

---

## Public Layout

Create:

```text
Header
Navigation
Main Content
Footer
```

---

## Authenticated User Layout

Create:

```text
Header
Navigation
User Menu
Notification Center
Main Content
```

---

## Admin Layout

Create:

```text
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

- [x] Public layout created.
- [x] Authenticated layout created.
- [x] Admin layout created.
- [x] Desktop navigation created.
- [x] Mobile navigation created.
- [x] User menu created.
- [x] Notification entry created.
- [x] Responsive navigation tested.

---

# TIER 7 — Marketplace UI

## Goal

Implement the core marketplace experience.

---

## Product Discovery

Create:

```text
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

```text
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

```text
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

- [x] Product listing implemented.
- [x] Product card implemented.
- [x] Search implemented.
- [x] Filtering implemented.
- [x] Sorting implemented.
- [x] Product details implemented.
- [x] Image gallery implemented.
- [x] Favorite functionality integrated.
- [x] Create Product implemented.
- [x] Edit Product implemented.
- [x] Mark as Sold implemented.
- [x] Archive implemented.
- [x] Responsive marketplace implemented.

---

# TIER 8 — User Experience Features

## Goal

Implement the user-facing workflows around the marketplace.

---

## Authentication UI

Implement:

```text
Register
Login
Forgot Password
Reset Password
Logout
```

---

## Profile

Implement:

```text
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

```text
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

```text
Notification List
Unread Badge
Mark as Read
Mark All as Read
```

---

## Reports

Implement:

```text
Report Product
Report User
Report Dialog
Report Confirmation
```

---

## Checklist

- [x] Authentication screens complete.
- [x] Profile screens complete.
- [x] Favorites complete.
- [x] Messaging UI complete.
- [x] Notifications complete.
- [x] Reporting UI complete.
- [x] Loading states implemented.
- [x] Error states implemented.
- [x] Empty states implemented.

---

# TIER 9 — Super Admin Interface

## Goal

Build the Super Admin experience.

Only the `SUPER_ADMIN` role can access this interface.

---

## Dashboard

Display:

```text
Users
Products
Reports
Categories
System Activity
```

---

## User Management

Implement:

```text
User List
User Details
Suspend User
Restore User
View User Products
```

---

## Product Management

Implement:

```text
Product List
Product Details
Archive Product
Review Reports
```

---

## Category Management

Implement:

```text
Category List
Create Category
Edit Category
Delete Category
```

---

## Reports

Implement:

```text
Pending Reports
Resolved Reports
Dismissed Reports
Report Details
Resolution Actions
```

---

## Checklist

- [x] Admin authentication verified.
- [x] Dashboard created.
- [x] User management created.
- [x] Product management created.
- [x] Category management created.
- [x] Reports management created.
- [x] Admin permissions enforced.
- [x] Unauthorized users blocked.
- [x] Responsive admin interface created.

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

```text
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

```text
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

- [x] Tokens finalized.
- [x] Light Mode finalized.
- [x] Dark Mode finalized.
- [x] Typography finalized.
- [x] Spacing finalized.
- [x] Responsive system finalized.

## Components

- [x] Primitive components complete.
- [x] Composite components complete.
- [x] Forms complete.
- [x] Feedback components complete.

## Marketplace

- [x] Product Discovery complete.
- [x] Product Details complete.
- [x] Product Management complete.
- [x] Favorites complete.

## Communication

- [x] Messaging complete.
- [x] Notifications complete.

## User

- [x] Authentication complete.
- [x] Profile complete.
- [x] Settings complete.

## Administration

- [x] Super Admin Dashboard complete.
- [x] User Management complete.
- [x] Product Management complete.
- [x] Category Management complete.
- [x] Reports complete.

## Quality

- [x] Accessibility verified.
- [x] Responsive behavior verified.
- [x] Dark Mode verified.
- [x] Performance reviewed.
- [x] Error states verified.
- [x] Loading states verified.
- [x] Empty states verified.
- [x] No unnecessary duplication.
- [x] No hardcoded design tokens.
- [x] Production build passes.

---

# Phase 5 Definition of Done

Phase 5 is considered COMPLETE only when:

```text
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

Every checkbox must be verified.

No Tier should be marked complete simply because the code exists.

The implementation must be tested and actually work.

---

# Important Instruction for AI Agents

You are expected to execute this document sequentially.

Do NOT attempt to implement all ten Tiers at once.

Process:

```text
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

Before moving to the next Tier:

1. Review the implementation.
2. Run the relevant checks.
3. Fix discovered issues.
4. Update the checklist.
5. Report what was completed.
6. Only then continue.

Never mark a checkbox as complete without actually implementing and verifying the corresponding requirement.