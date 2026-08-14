# Phase 3 — Create Database & Project Setup

> **Purpose:** Establish the complete development environment and project foundation before implementing the database or writing business logic. By the end of this section, the project should be fully configured, all required dependencies installed, and the development environment standardized across all contributors.

---

# Part A — Project Setup

This part focuses on creating the project from scratch and preparing a professional development environment.

At the end of this part:

- The project will run successfully.
- All required libraries will be installed.
- Code quality tools will be configured.
- Every developer and AI assistant will work under the same standards.

---

# Step 1 — Create the Project

## Objective

Create the Safqa project using modern technologies and establish a clean, scalable foundation for future development.

This step focuses only on creating the application itself.

No business logic.

No database.

No authentication.

No API implementation.

Only the project foundation.

---

# Why This Step Matters

Many projects fail because they begin writing features before building a stable foundation.

A properly initialized project provides:

- Consistent project structure.
- Better scalability.
- Easier maintenance.
- Faster onboarding for new developers.
- Predictable development workflow.

Every following phase depends on this step being completed correctly.

---

# Technology Stack

The Safqa project is built using the following technologies.

| Technology | Purpose |
|------------|---------|
| Next.js (App Router) | React Framework |
| React | User Interface |
| TypeScript | Static Type Safety |
| Tailwind CSS | Utility-first Styling |
| shadcn/ui | Reusable UI Components |
| PostgreSQL | Relational Database |
| Prisma ORM | Database ORM |
| TanStack Query | Server State Management |
| React Hook Form | Form Handling |
| Zod | Validation |
| Axios | HTTP Client |
| Next Themes | Theme Management |
| ESLint | Code Quality |
| Prettier | Code Formatting |
| Husky | Git Hooks |
| lint-staged | Pre-commit Validation |

These technologies have been selected based on scalability, maintainability, community support, and long-term project growth.

---

# Prerequisites

Before creating the project, verify that the following software is already installed.

## Node.js

Recommended Version

```text
v22 LTS or newer
```

Verify installation

```bash
node -v
```

---

## pnpm

Install

```bash
npm install -g pnpm
```

Verify

```bash
pnpm -v
```

---

## Git

Verify

```bash
git --version
```

---

## Visual Studio Code

Recommended Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma
- GitLens
- Error Lens
- Path IntelliSense
- Material Icon Theme

These extensions improve productivity and maintain consistent code quality.

---

# Creating the Project

Run the following command.

```bash
pnpm create next-app@latest safqa
```

The installer will ask several configuration questions.

Use the following answers.

```text
Project Name:
safqa

Would you like to use TypeScript?
Yes

Would you like to use ESLint?
Yes

Would you like to use Tailwind CSS?
Yes

Would you like your code inside a src directory?
Yes

Would you like to use App Router?
Yes

Would you like to use Turbopack?
Yes

Would you like to customize the import alias?
Yes

Import Alias:
@/*
```

These options define the official project standard.

Every contributor should use the same configuration.

---

# Why These Choices?

## TypeScript

Provides static typing.

Benefits:

- Better IntelliSense.
- Early error detection.
- Safer refactoring.
- Easier maintenance.

---

## App Router

The App Router is the official routing solution in modern Next.js.

Benefits:

- Nested layouts.
- Route groups.
- Server Components.
- Better performance.
- Streaming support.
- Future compatibility.

---

## Tailwind CSS

Chosen because:

- Rapid development.
- Small bundle size.
- Design consistency.
- Easy customization.

---

## Turbopack

Used as the development bundler.

Benefits:

- Faster startup.
- Faster hot reload.
- Better developer experience.

---

## Import Alias

Instead of writing:

```ts
import Button from "../../../../components/ui/button";
```

Use:

```ts
import Button from "@/components/ui/button";
```

Benefits:

- Cleaner imports.
- Easier refactoring.
- Better readability.

---

# Initial Folder Structure

After project creation, the structure should look similar to:

```text
sSafqa/
├── apps/
│   ├── web/                    ← Next.js frontend application
│   ├── backend/                ← NestJS backend application
│   └── mobile/                 ← React Native (Expo) mobile application
│
├── packages/lint.config.mjs
└── README.md
```

Do not modify the folder structure yet.

Additional folders will be introduced later in the project.

---

# Install Dependencies

Move into the project.

```bash
cd safqa
```

Install packages.

```bash
pnpm install
```

---

# Start the Development Server

Run

```bash
pnpm dev
```

The application should start successfully.

Expected output:

```text
Local:

http://localhost:3000
```

Opening the browser should display the default Next.js page.

This confirms that the project has been created successfully.

---

# Verify Project Configuration

Verify the following:

- TypeScript is enabled.
- Tailwind CSS is working.
- App Router is active.
- ESLint is configured.
- Import alias `@/*` works.
- Development server starts successfully.

If any of these checks fail, fix the issue before continuing.

---

# Git Initialization

Initialize Git if it was not created automatically.

```bash
git init
```

Create the first commit.

```bash
git add .

git commit -m "Initial Next.js project setup"
```

This commit represents the clean project baseline.

Future changes can always be compared against this state.

---

# Common Mistakes

Avoid the following mistakes.

### Creating the project without TypeScript

This requires migration later.

---

### Choosing Pages Router

The project standard uses the App Router.

---

### Ignoring Import Alias

Relative imports become difficult to maintain.

---

### Skipping Git Initialization

Version control should begin from the first commit.

---

### Installing random packages before planning

Only install approved project dependencies.

Additional libraries should be evaluated before being added.

---

# Best Practices

- Keep the initial project clean.
- Do not create unnecessary folders.
- Do not write application code yet.
- Commit frequently.
- Verify every installation step.
- Follow the documented project standards.

---

# Deliverables

By the end of Step 1, the following must be completed.

✅ Next.js project created.

✅ TypeScript configured.

✅ Tailwind CSS configured.

✅ App Router enabled.

✅ Turbopack enabled.

✅ Import alias configured.

✅ Git repository initialized.

✅ Development server running.

✅ Clean baseline commit created.

---

# Ready for Step 2

After completing this step, the project foundation is ready.

The next step will install and configure every required dependency, including:

- Prisma
- TanStack Query
- React Hook Form
- Zod
- shadcn/ui
- Axios
- Husky
- Prettier
- Additional development tools

Only after all dependencies are installed will the project be ready for database configuration and backend development.  

# Step 2 — Install Project Dependencies

> **Objective:** Install and organize all required runtime and development dependencies before implementing any feature. By the end of this step, the project will contain every core package needed for the entire development lifecycle.

---

# Overview

A professional project should never install packages randomly while development is in progress.

Instead, all core dependencies should be selected, reviewed, and installed before implementation begins.

This approach provides several benefits:

- Consistent development environment.
- Predictable dependency management.
- Easier onboarding for new developers.
- Reduced package conflicts.
- Cleaner project history.

Safqa follows this approach by separating dependencies into two categories:

1. Runtime Dependencies
2. Development Dependencies

---

# Runtime Dependencies

Runtime dependencies are packages that are required while the application is running.

They become part of the production application.

Install them using:

```bash
pnpm add \
@prisma/client \
@tanstack/react-query \
@tanstack/react-query-devtools \
react-hook-form \
@hookform/resolvers \
zod \
axios \
next-themes \
lucide-react \
clsx \
class-variance-authority \
tailwind-merge
```

---

# Package Breakdown

## Prisma Client

```text
@prisma/client
```

### Purpose

Provides the generated database client used to communicate with PostgreSQL.

Example:

```ts
const users = await prisma.user.findMany();
```

Without this package, the application cannot interact with the database.

---

## TanStack Query

```text
@tanstack/react-query
```

### Purpose

Handles all server state inside the application.

Instead of manually managing:

- loading
- caching
- refetching
- synchronization

React Query performs these automatically.

Benefits:

- Automatic caching
- Background refetching
- Request deduplication
- Retry support
- Optimistic updates

Safqa will use React Query for all API communication.

---

## React Query DevTools

```text
@tanstack/react-query-devtools
```

Used only during development.

Allows developers to inspect:

- Query Cache
- Mutation Cache
- Query Status
- Request Lifecycle

This package should never be enabled in production.

---

## React Hook Form

```text
react-hook-form
```

Purpose:

Efficient form management.

Examples:

- Login
- Register
- Product Creation
- Product Editing
- Profile Update

Benefits:

- Minimal re-renders
- High performance
- Easy validation
- Excellent TypeScript support

---

## Hook Form Resolvers

```text
@hookform/resolvers
```

Connects React Hook Form with validation libraries.

Safqa will use:

```text
Zod
```

for validation.

---

## Zod

```text
zod
```

Purpose:

Schema validation.

Example:

```ts
const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});
```

Benefits:

- Runtime validation
- Type inference
- Backend compatibility
- Shared validation rules

---

## Axios

```text
axios
```

Purpose:

HTTP Client.

All communication between frontend and backend will use Axios.

Benefits:

- Request interceptors
- Response interceptors
- Better error handling
- Request cancellation
- Automatic JSON parsing

---

## Next Themes

```text
next-themes
```

Purpose:

Theme management.

Supports:

- Light Mode
- Dark Mode
- System Theme

---

## Lucide React

```text
lucide-react
```

Purpose:

Official icon library.

Reasons for choosing Lucide:

- Lightweight
- Tree-shakable
- Consistent design
- Excellent React support

---

## clsx

```text
clsx
```

Purpose:

Conditional class names.

Example:

```ts
clsx(
    "rounded",
    isActive && "bg-primary"
);
```

---

## class-variance-authority

```text
class-variance-authority
```

Purpose:

Component variants.

Example:

Button

- Primary
- Secondary
- Outline
- Ghost

without writing duplicated Tailwind classes.

---

## tailwind-merge

```text
tailwind-merge
```

Purpose:

Automatically merges conflicting Tailwind classes.

Example:

```text
px-4

px-8
```

becomes

```text
px-8
```

This prevents duplicate utility classes.

---

# Development Dependencies

Development dependencies are not shipped to production.

They exist only for developers.

Install them using:

```bash
pnpm add -D \
prisma \
prettier \
prettier-plugin-tailwindcss \
eslint-config-prettier \
husky \
lint-staged \
@types/node
```

---

# Prisma CLI

```text
prisma
```

Purpose:

Command Line Interface.

Used for:

- Migrations
- Schema generation
- Database synchronization
- Prisma Studio

Examples:

```bash
pnpm prisma migrate dev

pnpm prisma generate

pnpm prisma studio
```

---

# Prettier

```text
prettier
```

Purpose:

Automatic code formatting.

Every contributor should produce identical formatting.

This eliminates formatting discussions during code reviews.

---

# Tailwind Prettier Plugin

```text
prettier-plugin-tailwindcss
```

Automatically sorts Tailwind utility classes.

Instead of:

```text
text-white

rounded

flex

bg-blue-500
```

It reorganizes them into the official Tailwind order.

---

# ESLint Config Prettier

Disables conflicting formatting rules between ESLint and Prettier.

Both tools work together without conflicts.

---

# Husky

Purpose:

Git Hooks.

Every commit can automatically run:

- ESLint
- Type Checking
- Formatting
- Tests

before code is committed.

---

# lint-staged

Runs quality checks only on staged files.

Benefits:

- Faster commits
- Better developer experience

---

# Install shadcn/ui

Initialize shadcn.

```bash
pnpm dlx shadcn@latest init
```

Recommended configuration:

```text
Style:
Default

Base Color:
Slate

CSS Variables:
Yes

Tailwind CSS:
Yes

Import Alias:
@/*
```

---

# Why shadcn/ui?

Safqa requires a reusable design system.

shadcn/ui provides:

- Accessible components
- Customizable source code
- Excellent Tailwind integration
- No runtime dependency

Unlike many UI libraries, components become part of your own codebase.

---

# Verify Installation

Run:

```bash
pnpm list
```

Verify that all required packages appear without errors.

Next, ensure the application still starts correctly.

```bash
pnpm dev
```

Expected Result:

- No dependency conflicts.
- No installation errors.
- Development server starts successfully.

---

# Common Mistakes

Avoid the following:

- Installing duplicate packages.
- Installing libraries without evaluation.
- Mixing npm, yarn, and pnpm.
- Forgetting to save dependencies.
- Ignoring peer dependency warnings.
- Installing UI libraries that conflict with the chosen design system.

---

# Best Practices

- Keep dependencies minimal.
- Prefer actively maintained packages.
- Install packages intentionally.
- Remove unused dependencies regularly.
- Pin versions when stability is required.
- Review new packages before introducing them.

---

# Deliverables

By the end of this step:

✅ All runtime dependencies are installed.

✅ All development dependencies are installed.

✅ Prisma CLI is available.

✅ Prisma Client is installed.

✅ React Query is configured.

✅ React Hook Form is installed.

✅ Zod is installed.

✅ Axios is installed.

✅ shadcn/ui is initialized.

✅ Prettier is installed.

✅ Husky is installed.

✅ lint-staged is installed.

✅ The application starts successfully without dependency errors.

---

# Ready for Step 3

After completing this step, the project has every required library installed.

The next step focuses on configuring the development environment, including:

- ESLint
- Prettier
- Husky
- lint-staged
- Environment Variables
- VS Code Workspace Settings
- Project-wide development standards

Once Step 3 is completed, the project foundation will be fully prepared for building the database infrastructure in Part B. 

# Step 3 — Configure the Development Environment

> **Objective:** Establish a consistent, maintainable, and production-ready development environment before any application code is written. Every developer and AI assistant working on Safqa should share the exact same coding standards, formatting rules, linting behavior, Git workflow, and workspace configuration.

---

# Overview

Creating the project and installing dependencies is only the beginning.

A professional software project requires a standardized development environment.

Without one, every contributor writes code differently.

Common problems include:

- Different formatting styles.
- Different ESLint configurations.
- Inconsistent folder structures.
- Broken commits.
- Merge conflicts.
- Unpredictable code quality.

The purpose of this step is to eliminate these problems before development begins.

By the end of this step, every contributor should be working under the exact same development standards.

---

# Development Standards

Safqa follows these core principles:

- One coding style.
- One formatting style.
- One linting configuration.
- One Git workflow.
- One project structure.
- One source of truth.

No developer should configure the project differently.

---

# Configure ESLint

## Purpose

ESLint analyzes source code and detects potential issues before the application runs.

Examples include:

- Unused variables.
- Incorrect imports.
- Unsafe TypeScript usage.
- React Hook violations.
- Potential bugs.

---

## Why ESLint?

Benefits:

- Improves code quality.
- Detects bugs early.
- Enforces coding standards.
- Maintains consistency across the project.

---

## Configuration

The project already includes ESLint through Next.js.

Review the generated configuration and extend it when necessary.

Recommended plugins include:

- TypeScript ESLint
- React Hooks
- Import Order
- Unused Imports

Example:

```text
eslint.config.mjs
```

This file becomes the central place for all linting rules.

---

# Configure Prettier

## Purpose

Prettier automatically formats source code.

Instead of debating:

- indentation
- spacing
- semicolons
- quotes

the formatter applies one consistent style.

---

## Create

```text
.prettierrc
```

Example:

```json
{
    "semi": true,
    "singleQuote": false,
    "trailingComma": "all",
    "printWidth": 100,
    "plugins": [
        "prettier-plugin-tailwindcss"
    ]
}
```

---

## Why Use Prettier?

Benefits:

- Consistent formatting.
- Easier code reviews.
- Cleaner Git history.
- Reduced merge conflicts.

Formatting should never be discussed during code reviews.

---

# Configure EditorConfig

## Purpose

Different editors may use different settings.

EditorConfig ensures everyone uses the same:

- indentation
- line endings
- character encoding
- whitespace rules

---

## Create

```text
.editorconfig
```

Example:

```text
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true
```

---

# Configure Husky

## Purpose

Prevent bad commits.

Instead of relying on developers to manually run checks, Git automatically runs them before every commit.

Initialize Husky:

```bash
pnpm husky init
```

---

# Configure lint-staged

## Purpose

Only validate staged files before committing.

Benefits:

- Faster commits.
- Better performance.
- Consistent code quality.

Example configuration:

```json
{
    "*.{js,ts,tsx}": [
        "eslint --fix",
        "prettier --write"
    ]
}
```

---

# Configure Git Hooks

Before every commit, automatically execute:

1. ESLint
2. Prettier
3. Type Checking (optional)
4. Unit Tests (future)

If any step fails, the commit should be rejected.

This prevents broken code from entering the repository.

---

# Configure Environment Variables

## Purpose

Sensitive information should never be stored directly in source code.

Instead, use environment variables.

Create:

```text
.env.local
```

Initial variables:

```env
DATABASE_URL=

NEXT_PUBLIC_API_URL=

NEXTAUTH_SECRET=

NEXTAUTH_URL=
```

These values will be completed in later phases.

---

# Environment Variable Rules

- Never commit `.env.local`.
- Never hardcode secrets.
- Use `NEXT_PUBLIC_` only for variables that are safe to expose to the browser.
- Keep server-only variables private.

---

# Configure VS Code Workspace

Create:

```text
.vscode/
```

Recommended structure:

```text
.vscode/

settings.json

extensions.json
```

---

## settings.json

Configure:

- Format on Save
- ESLint Auto Fix
- Default Formatter
- TypeScript Preferences

Example:

```json
{
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "always"
    },
    "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

---

## extensions.json

Recommended extensions:

```text
ESLint

Prettier

Tailwind CSS IntelliSense

Prisma

GitLens

Error Lens

Material Icon Theme

Path IntelliSense
```

This ensures all contributors use the same tooling.

---

# Configure Project Scripts

Verify that `package.json` includes the essential scripts.

```json
{
    "scripts": {
        "dev": "next dev --turbopack",
        "build": "next build",
        "start": "next start",
        "lint": "next lint",
        "format": "prettier --write ."
    }
}
```

These scripts become the official project commands.

---

# Configure Git Ignore

Verify `.gitignore` contains:

```text
node_modules

.next

.env.local

.env

coverage

dist
```

Never commit generated files or secrets.

---

# Verify the Environment

Run the following commands:

```bash
pnpm lint
```

```bash
pnpm format
```

```bash
pnpm build
```

```bash
pnpm dev
```

Expected result:

- No lint errors.
- No formatting issues.
- Successful production build.
- Development server starts correctly.

---

# Common Mistakes

Avoid the following:

- Using different formatting rules.
- Disabling ESLint.
- Committing `.env.local`.
- Installing editor-specific plugins without team approval.
- Ignoring Husky failures.
- Mixing tabs and spaces.

---

# Best Practices

- Format code before every commit.
- Keep ESLint warnings at zero whenever possible.
- Commit small, focused changes.
- Never bypass Git Hooks without a valid reason.
- Document new tooling before adding it.
- Review dependencies periodically.

---

# Deliverables

By the end of Step 3, the following should be complete:

✅ ESLint configured.

✅ Prettier configured.

✅ EditorConfig created.

✅ Husky initialized.

✅ lint-staged configured.

✅ Git Hooks enabled.

✅ Environment variables prepared.

✅ VS Code workspace configured.

✅ Project scripts verified.

✅ Git Ignore validated.

✅ Development server running successfully.

✅ Production build passes without errors.

---

# Completion of Part A — Project Setup

At this stage, the project foundation is complete.

The application is now:

- Properly initialized.
- Consistently configured.
- Following shared development standards.
- Ready for collaborative development.

No additional project configuration should be required before database implementation.

---

# Ready for Part B — Database Foundation

The next section focuses on building the initial database infrastructure.

Topics include:

- Installing PostgreSQL
- Installing Prisma
- Connecting the application to the database
- Configuring `schema.prisma`
- Establishing naming conventions
- Defining UUID strategy
- Timestamp strategy
- Soft Delete strategy
- Audit fields
- Database design standards

By the end of Part B, the project will have a fully connected and production-ready database foundation, ready for schema implementation.