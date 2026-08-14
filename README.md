# Safqa — صفقة 🛒

> **أسهل سوق للبيع والشراء في مصر والوطن العربي**

Safqa is a modern, high-performance marketplace platform designed for seamlessly buying, selling, favoriting, messaging, and moderating classified listings. Built as a monorepo architecture with clean separation of concerns between backend APIs, web frontend, and shared types.

---

## 🌟 Key Features

- **Design System & RTL First:** Fully customized UI using Cairo Google Font, Tailwind design tokens, and smooth Light/Dark/System theme persistence.
- **Product Discovery & Search:** Paginated search, categories navigation, condition filtering, price range normalization, and interactive favorites.
- **Direct Messaging:** Real-time role-neutral conversation system between buyers and sellers with unread badges and auto mark-as-read.
- **Notifications Engine:** Automated notification dispatch for comments, moderation actions, and 3-day auto-expiry cleanup.
- **Super Admin Moderation:** Full dashboard metrics, user suspension with automated product archival, category management, and report resolution workflow.

---

## 🛠️ Monorepo Tech Stack

- **Frontend (`apps/web`):** Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons, `next-themes`.
- **Backend (`apps/backend`):** NestJS, TypeScript, Prisma ORM (v5), JWT Authentication, bcryptjs.
- **Database:** PostgreSQL (9 Prisma models).
- **Shared Packages (`packages/*`):** `@safqa/types`, `@safqa/utils`, `@safqa/config`.
- **Build & Monorepo Tooling:** PNPM Workspaces, Turborepo.

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- PNPM >= 8

### Installation

```bash
# Clone the repository
git clone https://github.com/Ab-Coder123/Safqa.git
cd Safqa

# Install dependencies
pnpm install

# Generate Prisma Client
pnpm db:generate

# Run development servers
pnpm dev
```

---

## 📜 Architecture & Workflows

Detailed documentation of business workflows and database modeling can be found inside the [`documents/`](./documents) directory:
- [`documents/WorkFlows/`](./documents/WorkFlows)
- [`documents/Project_Roadmap/`](./documents/Project_Roadmap)

---

## 📄 License

Private Repository — All Rights Reserved © Safqa.
