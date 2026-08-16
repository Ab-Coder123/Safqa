# Safqa Project Context
Version: 1.0

> This document is the complete knowledge base of the Safqa project.
>
> Every AI model, developer, contributor, or software engineer MUST read this document before making any architectural or implementation decisions.
>
> This document does not only explain WHAT was decided.
> It explains WHY those decisions were made.

---

# Chapter 1
# Project Introduction

## What is Safqa?

Safqa is a modern marketplace platform designed primarily for Egypt and later the Arabic region.

The goal is NOT to build another OLX clone.

The goal is to build the simplest marketplace possible while maintaining high quality architecture, scalability and long-term maintainability.

Every technical decision inside this project should support that philosophy.

---

## Why does Safqa exist?

Current marketplace applications suffer from many problems.

Some examples:

• Complex user experience.

• Poor mobile performance.

• Inconsistent UI.

• Difficult selling process.

• Weak moderation.

• Poor scalability.

• Hard to maintain codebases.

Instead of trying to build the biggest marketplace, Safqa focuses on building the cleanest experience possible.

---

## Long Term Vision

The project should become a marketplace platform that is:

- Easy for beginners.
- Fast.
- Secure.
- AI Friendly.
- Easy to maintain.
- Easy to scale.
- Built using modern engineering practices.

Every feature should respect those goals.

---

## Engineering Vision

One of the most important ideas discussed during planning was that the project should not only be developer friendly.

It should also be AI Friendly.

This means that any AI model should be capable of understanding the project without spending hours reading random files.

The project itself should explain itself.

Documentation is considered part of the source code.

Poor documentation means poor architecture.

---

## Philosophy

Whenever there are two possible solutions:

Option A:
Very clever
Very complex

Option B:
Simple
Readable
Maintainable

Safqa always chooses Option B.

The project values simplicity over cleverness.

---

## MVP Philosophy

One of the biggest discussions during planning was avoiding unnecessary complexity.

The first release should solve the real problem.

It should not attempt to solve every future problem.

Examples of things intentionally postponed:

- Multiple admin levels
- Moderator roles
- Complex RBAC
- Microservices
- Distributed systems
- Event sourcing
- CQRS

Those can always be added later.

Architecture should support growth.

Implementation should remain simple.

---

# Chapter 2
# Product Philosophy

Safqa is not a technology project.

Technology only exists to solve business problems.

The user experience is always more important than using the newest framework.

---

## The User Comes First

Every screen should answer one question:

"Can a non-technical user understand this without instructions?"

If the answer is no...

The design is wrong.

---

## Less is More

Adding features does not automatically improve products.

Sometimes removing features creates a better experience.

Therefore every feature should answer:

Does this solve a real user problem?

If not...

It should not exist.

---

## Consistency

Everything inside the application should feel consistent.

Buttons

Cards

Spacing

Typography

Animations

Colors

Loading states

Empty states

Everything should look like it belongs to one design system.

---

## Mobile First

The majority of users are expected to access Safqa using mobile devices.

Therefore every feature should first be designed for small screens.

Desktop comes second.

---

## Performance First

Performance is considered a feature.

Slow software creates bad user experience.

Developers should always ask:

Can this be faster?

Can this be cached?

Can this be lazy loaded?

Can this component be reused?

---

## Accessibility

Accessibility is not optional.

The project should support:

Semantic HTML

Keyboard navigation

Screen readers

Color contrast

Focus management

Responsive layouts

---

## Trust

Marketplace applications depend on trust.

Users should feel safe.

Examples:

Verified identities (future)

Spam prevention

Report system

Content moderation

Secure authentication

Reliable messaging

---

## Product Simplicity

One important discussion was avoiding unnecessary user types.

Instead of having:

Buyer

Seller

Customer

Vendor

Merchant

Safqa treats everyone simply as:

User

Because a person can publish products today and purchase products tomorrow.

The role changes based on behavior.

Not based on account type.

This dramatically simplifies the product.

---

## Why only USER and ADMIN?

This decision was intentional.

Creating Seller and Buyer roles introduces unnecessary complexity.

Authentication becomes larger.

Authorization becomes harder.

Permissions become harder.

Testing increases.

Documentation becomes more complicated.

Instead we decided:

USER

can:

Buy

Sell

Comment

Report

Chat

Manage Profile

Publish Listings

ADMIN

manages the platform.

Nothing more.

Nothing less.

Future versions may introduce Moderator or Super Admin roles.

The MVP intentionally avoids them.

---

## Simplicity over Premature Optimization

One important engineering rule agreed during planning:

Never optimize for problems that do not exist.

Many software projects become impossible to maintain because developers design for one million users before getting the first thousand.

Safqa will scale gradually.

Every architecture decision should support growth.

Every implementation should remain simple.

---

End of Part 1. 


# Chapter 3
# Software Architecture

Software architecture is the foundation of the entire project.

Before writing any feature, creating any API, or designing any database table, the architecture must already be defined.

One of the biggest mistakes developers make is starting implementation before defining how the system will grow.

Safqa intentionally does the opposite.

We spend time designing first.

Then implementing.

This dramatically reduces technical debt.

---

## What is Software Architecture?

Software Architecture is the blueprint of the system.

It answers questions like:

- How is the project organized?
- How do applications communicate?
- Where should business logic live?
- How should developers add new features?
- How should AI understand the project?
- How can the project scale?

Architecture is not about frameworks.

Architecture is about decisions.

---

## Goals of the Architecture

The architecture of Safqa has six primary goals.

### 1. Scalability

The project should grow without becoming messy.

Adding new features should not require rewriting existing ones.

---

### 2. Maintainability

Every developer should understand where code belongs.

The codebase should remain readable after years.

---

### 3. Reusability

Code should be written once.

If something is shared between Web, Backend and Mobile...

It belongs inside Shared Packages.

---

### 4. Consistency

Every application should follow exactly the same philosophy.

Naming.

Folder structure.

Coding standards.

Documentation.

Everything should be consistent.

---

### 5. AI Friendly Development

This project is designed to work with AI.

That means:

An AI should understand the project by reading documentation.

Not by randomly searching files.

Documentation is considered a first-class citizen.

---

### 6. Simplicity

The architecture should solve today's problems.

Not tomorrow's imaginary problems.

We avoid unnecessary complexity.

---

# Why We Chose a Monorepo

One of the most important decisions made during planning was choosing a Monorepo.

Instead of having multiple repositories:

```

Frontend Repository

Backend Repository

Mobile Repository

Shared Types Repository

Shared UI Repository

```

Everything lives inside one repository.

```

Safqa/

apps/

packages/

documents/

workflows/

scripts/

```

---

## Why not Multi Repository?

A Multi Repo architecture introduces many problems.

For example:

Shared Types become duplicated.

Shared Components become duplicated.

Documentation becomes duplicated.

Versioning becomes difficult.

Pull Requests become disconnected.

AI loses project context because information is spread across repositories.

This directly conflicts with our AI-first philosophy.

---

## Why Monorepo?

Monorepo gives us one source of truth.

One repository.

One documentation folder.

One workflow system.

One coding standard.

One architecture.

One project history.

Everything becomes centralized.

---

## Benefits of Monorepo

### Shared Types

Instead of writing:

```

User

```

three times.

Web.

Backend.

Mobile.

We define it once.

Every application imports it.

---

### Shared UI

Buttons.

Inputs.

Cards.

Icons.

Layouts.

Dialogs.

Should exist only once.

---

### Shared Utilities

Formatting dates.

Formatting prices.

Validators.

Helpers.

Constants.

Everything reusable belongs in one place.

---

### Shared Configuration

Instead of having:

Three ESLint configurations.

Three Prettier configurations.

Three TypeScript configurations.

We maintain one shared configuration.

Consistency becomes automatic.

---

# Monorepo Folder Structure

```

Safqa/

│

├── apps/

│ ├── web/

│ ├── backend/

│ └── mobile/

│

├── packages/

│ ├── ui/

│ ├── types/

│ ├── utils/

│ └── config/

│

├── documents/

│

├── workflows/

│

├── scripts/

│

└── .github/

```

Everything inside the repository has a single responsibility.

---

# Understanding Apps

The apps folder contains actual applications.

```

apps/

```

Inside it:

```

web

backend

mobile

```

---

## Web

Contains the Next.js application.

Responsible for:

UI

Pages

Components

Client State

Server State

API Consumption

SEO

Accessibility

Responsive Design

---

## Backend

Contains the NestJS server.

Responsible for:

Business Logic

Authentication

Database

Validation

Authorization

API

Background Jobs

---

## Mobile

Contains the React Native application.

Responsible for:

Native User Experience

Notifications

Offline Support

Mobile Navigation

Shared Business Rules

---

# Understanding Packages

Packages are not applications.

Packages are reusable libraries.

Applications consume packages.

Packages never depend on applications.

This keeps architecture clean.

---

## packages/types

This package contains every shared TypeScript type.

Examples:

User

Product

Comment

Message

Notification

Category

Pagination

ApiResponse

Instead of defining those multiple times...

We define them once.

Every application imports them.

---

## packages/ui

Contains shared UI Components.

Examples:

Button

Input

Card

Modal

Avatar

Dropdown

Tabs

Skeleton

Badge

Loader

Toast

The design system starts here.

---

## packages/utils

Contains reusable logic.

Examples:

formatPrice()

formatDate()

validators()

currency()

phone()

slug()

debounce()

constants

No application should duplicate utility functions.

---

## packages/config

Contains project configuration.

Examples:

ESLint

Prettier

Tailwind

TypeScript

Shared Environment Schemas

Shared Build Configurations

This guarantees consistency across the entire project.

---

# Architecture Philosophy

Every folder must have one purpose.

Every module must solve one problem.

Every function should have one responsibility.

Every package should be reusable.

If something feels difficult to understand...

The architecture is probably wrong.

---

# Architecture Before Features

Another important decision discussed during planning:

Features never come first.

Architecture comes first.

Many projects immediately start building:

Authentication.

Marketplace.

Chat.

Notifications.

Without defining how those systems connect.

Safqa avoids that mistake.

First:

Architecture.

Then:

Features.

---

# Documentation Is Part of Architecture

One of the strongest principles agreed upon is that documentation is not optional.

Documentation is part of the architecture.

If developers cannot understand the project...

The architecture has failed.

Every important architectural decision must be documented.

Every folder should exist for a reason.

Every workflow should be explained.

The documentation should always be capable of onboarding a completely new developer or AI model without requiring external explanations.

---

End of Part 2.

# Chapter 4
# Domain-Driven Design (DDD)

One of the most important architectural decisions made during the planning phase was adopting Domain-Driven Design (DDD).

This decision was not made because DDD is popular.

It was made because the project is expected to grow over time, and without clear boundaries the codebase will eventually become difficult to understand and maintain.

DDD helps organize software around the business itself instead of organizing it around technical concepts.

The project should reflect how the business works.

Not how the framework works.

---

# What is a Domain?

A Domain represents a business area.

In Safqa, the business is an online marketplace.

Instead of thinking about controllers, components, or database tables...

We first think about the business.

Examples:

Authentication

Users

Marketplace

Chat

Notifications

Reports

Admin

Favorites

Categories

Search

Each one represents a business capability.

Not a folder.

---

# Why Domain First?

Many projects organize code like this:

```
controllers/

services/

repositories/

models/

validators/

utils/
```

This structure works for very small projects.

As the project grows...

Every folder becomes huge.

Finding related code becomes difficult.

Instead we organize around Features.

For example:

```
marketplace/

auth/

notifications/

favorites/

reports/
```

Everything related to Marketplace stays together.

Everything related to Authentication stays together.

Everything related to Reports stays together.

This dramatically improves maintainability.

---

# Bounded Context

One important concept discussed while designing the architecture is keeping every domain independent.

Every domain has boundaries.

Authentication should not know Marketplace details.

Marketplace should not know Notification implementation.

Notification should not directly manipulate Users.

Communication should happen through Services or Events.

Never through random imports.

This reduces coupling.

And improves scalability.

---

# Single Responsibility

Every domain should solve exactly one problem.

Examples:

Authentication

Responsible for:

Login

Register

Tokens

Password Reset

Refresh Tokens

Nothing else.

---

Marketplace

Responsible for:

Listings

Products

Images

Prices

Publishing

Editing

Deleting

Nothing else.

---

Chat

Responsible for:

Messages

Conversations

Attachments

Read Status

Nothing else.

---

Reports

Responsible for:

Spam Reports

Fake Listings

Abuse Reports

Review Status

Nothing else.

---

Keeping domains isolated makes development significantly easier.

---

# Entity

An Entity represents something with identity.

Examples:

User

Product

Listing

Comment

Conversation

Message

Category

Every Entity has its own lifecycle.

A Product today is still the same Product tomorrow.

Only its data changes.

Identity never changes.

---

# Value Objects

Not everything has identity.

Some objects simply represent values.

Examples:

Email

Phone Number

Address

Money

Coordinates

These objects should be immutable whenever possible.

Changing an Email means creating another Email.

Not modifying the existing one.

---

# Services

Business logic belongs inside Services.

Never inside Controllers.

Never inside Components.

Controllers receive requests.

Services make decisions.

Repositories access the database.

Keeping those responsibilities separated makes the code predictable.

---

# Repository Pattern

Repositories exist to communicate with the database.

Services should never know whether the data comes from:

PostgreSQL

Redis

External APIs

Future databases

The Service simply asks:

"Give me this Product."

The Repository decides how.

This separation makes future migrations much easier.

---

# Why We Chose Modular Architecture

During planning we decided not to build one massive application.

Instead...

Every domain becomes its own module.

Examples:

```
modules/

auth/

users/

marketplace/

chat/

favorites/

notifications/

reports/

admin/
```

Each module owns everything related to itself.

Components.

Logic.

Tests.

Validation.

Types.

Documentation.

---

# Benefits of Modular Architecture

Adding a new feature becomes simple.

Removing a feature becomes simple.

Testing becomes easier.

Developers understand ownership.

AI models understand context much faster.

Modules can eventually become Microservices if necessary.

Nothing needs to be rewritten.

---

# Future Scalability

Although Safqa starts as a Modular Monolith...

The architecture intentionally allows future migration.

If one day Marketplace becomes too large...

It can become its own service.

If Notifications become independent...

They can be extracted.

The important point is:

We are not building Microservices today.

We are building software that can evolve into Microservices tomorrow.

This is a very important difference.

We avoid premature complexity while keeping future possibilities open.

---

# Why Not Microservices Today?

This topic was discussed during planning.

Microservices introduce many challenges:

Distributed systems.

Service discovery.

Network communication.

Monitoring.

Tracing.

Deployment complexity.

Development overhead.

For an MVP...

Those costs are much higher than the benefits.

Therefore we intentionally rejected Microservices for the first version.

Instead we chose:

Monorepo

+

Modular Monolith

+

DDD

This gives us almost all organizational benefits while keeping development simple.

---

# Architecture Decision

The official architecture of Safqa is:

Monorepo

↓

Modular Monolith

↓

Domain-Driven Design

↓

Feature-Based Development

↓

Shared Packages

↓

AI-Friendly Documentation

Every future decision should respect these principles.

No feature should violate the architectural boundaries established in this chapter.

---

# Preparing for Frontend Architecture

Now that the business has been divided into independent domains...

The next step is deciding how the Frontend application should consume those domains.

The frontend should mirror the business structure.

Not the framework structure.

That philosophy will be explained in the next chapter.

---

End of Part 3.

# Chapter 5 — Development Guidelines & Engineering Standards

This chapter defines how development should be performed throughout the Safqa project. Every developer and AI model must follow these guidelines before implementing any feature.

---

# AI Development Philosophy

Safqa is designed to be AI-friendly from day one.

The project is intentionally organized so that an AI model can understand the architecture before writing code.

Documentation is considered part of the project, not an optional addition.

An AI should never guess how the project works. If the required information exists in the documentation, it must follow it.

If the documentation is missing, the AI should ask instead of making assumptions.

---

# AI Development Workflow

Every implementation follows the same workflow.

```text
Receive Task
      ↓
Read Documentation
      ↓
Project Audit
      ↓
Architecture Audit
      ↓
Select Workflow
      ↓
Analyze Feature
      ↓
Implementation
      ↓
Testing
      ↓
Verification
      ↓
Review
      ↓
Documentation Update
      ↓
Done
```

Skipping any step is considered incorrect.

---

# Project Audit

Before implementing anything, the AI must understand the current project.

The audit should answer questions such as:

- What feature is being modified?
- Which application is affected?
- Which modules are related?
- Is there existing code?
- Does similar functionality already exist?
- Which documents should be read first?

The goal is understanding before implementation.

---

# Architecture Audit

The AI must verify that the requested feature matches the existing architecture.

Questions include:

- Which domain owns this feature?
- Which module should contain it?
- Does the feature belong to Web, Backend or Mobile?
- Should any shared package be updated?
- Will this change affect another application?

No implementation should violate architectural boundaries.

---

# Workflow Selection

The AI must choose the correct workflow before writing code.

Examples:

Frontend Feature → Frontend Workflow

Backend API → Backend Workflow

Mobile Screen → Mobile Workflow

Database Change → Database Workflow

Documentation Update → Documentation Workflow

Using the wrong workflow usually leads to poor implementation.

---

# Frontend Workflow

When implementing a frontend feature:

1. Read the related documentation.
2. Understand the feature requirements.
3. Review the UI design.
4. Review the API.
5. Identify reusable components.
6. Implement the feature.
7. Handle loading and error states.
8. Test responsiveness.
9. Verify accessibility.
10. Update documentation if needed.

Frontend changes should never modify backend code unless explicitly required.

---

# Backend Workflow

When implementing backend features:

1. Read API requirements.
2. Review related modules.
3. Validate the architecture.
4. Create DTOs if needed.
5. Implement business logic.
6. Update repositories.
7. Validate inputs.
8. Write tests.
9. Verify API responses.
10. Update documentation.

Backend changes should not modify frontend code unless necessary.

---

# Mobile Workflow

When implementing mobile features:

1. Review navigation.
2. Review APIs.
3. Reuse shared types.
4. Build responsive screens.
5. Handle offline behavior if required.
6. Test on different screen sizes.
7. Verify performance.

---

# Documentation Workflow

Documentation evolves with the project.

Whenever architecture changes:

- Update architecture documents.

Whenever APIs change:

- Update API documentation.

Whenever workflows change:

- Update workflow documents.

Documentation should always reflect reality.

---

# Testing Strategy

Every completed feature should be verified before being considered finished.

Testing includes:

- Unit Testing
- Integration Testing
- End-to-End Testing
- Manual Testing
- Visual Testing (Frontend)

The level of testing depends on the feature size.

---

# Verification Checklist

Before marking any task as complete:

- Feature works correctly.
- No console errors.
- No TypeScript errors.
- No lint errors.
- Build succeeds.
- Existing functionality still works.
- UI matches the design.
- API responses are correct.
- Documentation is updated.

Only then can the task be considered complete.

---

# Coding Standards

Every implementation should follow these principles:

- Write clean code.
- Keep functions small.
- Keep components focused.
- Avoid duplicated logic.
- Prefer composition over duplication.
- Use descriptive names.
- Respect project structure.
- Follow the selected workflow.
- Reuse existing code whenever possible.

Readable code is preferred over clever code.

---

# Naming Convention

Use consistent naming across the project.

Examples:

Components

```text
ProductCard.tsx
UserProfile.tsx
```

Hooks

```text
useAuth.ts
useProducts.ts
```

Utilities

```text
formatPrice.ts
calculateDiscount.ts
```

Constants

```text
API_ENDPOINTS
MAX_UPLOAD_SIZE
```

Interfaces

```text
User
Product
Category
```

Folders

```text
marketplace
notifications
authentication
```

Names should describe purpose rather than implementation.

---

# Definition of Done

A feature is considered complete only when:

- Requirements are implemented.
- Architecture is respected.
- Code follows project standards.
- Tests pass.
- Build succeeds.
- Documentation is updated.
- No known issues remain.

Until then, the feature is still considered in progress.

---

# Official Project Decisions

The following decisions were agreed during project planning.

## Roles

The MVP supports only two roles:

- USER
- ADMIN

A USER can both buy and sell.

Separate Buyer and Seller roles are intentionally excluded from the MVP.

---

## Authentication

Authentication uses JWT.

Authorization is role-based.

Current roles remain intentionally simple.

---

## Monorepo

The project uses a Monorepo.

All applications live inside one repository.

Shared logic belongs inside Shared Packages.

---

## Technology Stack

Frontend

- Next.js
- React
- TypeScript
- React Query
- Redux Toolkit
- Tailwind CSS
- shadcn/ui

Backend

- NestJS
- PostgreSQL
- Prisma
- JWT

Mobile

- React Native

---

## Documentation

Documentation is mandatory.

Every important architectural decision must be documented.

Documentation should always remain synchronized with the implementation.

---

## Performance Engineering Decision

Performance Engineering is a first-class architectural requirement across the Safqa codebase:

1. **Measured Optimization:** Use `useMemo`, `useCallback`, and `React.memo` only when profiling or technical logic justifies them (e.g. high-frequency lists, expensive computations). Avoid premature, blanket memoization.
2. **Code Splitting & Dynamic Imports:** Admin dashboards, heavy charts, and specialized modals must be dynamically imported to maintain small initial bundle sizes for standard users.
3. **Client/Server Boundaries:** Minimize `"use client"` scopes and colocate interactive logic in leaf components.
4. **Event Efficiency:** High-frequency input (search, filters, scroll) must be debounced or throttled.
5. **Domain Isolation:** Authentication pages must remain ultra-lightweight and isolated from heavy marketplace and administrative dependencies.

Every task must comply with `documents/WorkFlows/System/Performance_Engineering_Workflow.md`.

---

## AI Rule

The AI must never start coding immediately.

It must:

1. Read documentation.
2. Audit the project.
3. Understand the architecture.
4. Select the correct workflow (including Performance Engineering).
5. Implement.
6. Test.
7. Verify.
8. Update documentation.

Following this process ensures consistency across the entire project and allows both developers and AI models to collaborate efficiently without breaking the architecture.