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

This document defines the exact frontend pages that should be created during the current stage of Phase 6.

The current objective is ONLY to create and structure the frontend pages and their basic UI.

Do NOT implement backend logic, database logic, API integrations, authentication logic, or advanced business functionality at this stage unless explicitly requested.

---

# 1. Public Landing Page

The first page users see when visiting Safqa.

Route:

`/`

## Purpose

This page is a marketing/introductory page.

Its purpose is to explain:

- What Safqa is.
- What problem Safqa solves.
- What users can do on Safqa.
- Why users should use Safqa.
- How the marketplace works.

## Main Sections

The page should contain:

- Header / Navigation
- Hero Section
- What is Safqa?
- How Safqa Works
- Why Safqa?
- Marketplace Preview
- Trust / Safety section
- Final Call To Action
- Footer

## Main CTA

The primary CTA should direct the user toward authentication.

Example:

`Get Started`

The CTA should lead to the authentication entry point.

---

# 2. Authentication Entry

Route:

`/auth`

This page acts as the entry point for authentication.

It should provide two clear options:

```text
Create an Account
Log In