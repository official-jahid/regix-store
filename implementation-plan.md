# REGIX Store — Implementation Plan

> **Project:** REGIX Store — "Buy your need"  
> **Type:** Multi-vendor digital product marketplace (B2C + B2B)  
> **Stage:** MVP  
> **Last Updated:** 2026-07-23

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack Summary](#2-tech-stack-summary)
3. [Phase 1: Foundation (Weeks 1-4)](#3-phase-1-foundation-weeks-1-4)
4. [Phase 2: Seller & Discovery (Weeks 5-7)](#4-phase-2-seller--discovery-weeks-5-7)
5. [Phase 3: B2B & Subscriptions (Weeks 8-10)](#5-phase-3-b2b--subscriptions-weeks-8-10)
6. [Phase 4: Polish & Scale (Weeks 11-12)](#6-phase-4-polish--scale-weeks-11-12)
7. [Database Schema Overview](#7-database-schema-overview)
8. [API Architecture](#8-api-architecture)
9. [File & Asset Strategy](#9-file--asset-strategy)
10. [State Management Strategy](#10-state-management-strategy)
11. [Caching & Performance Strategy](#11-caching--performance-strategy)
12. [Security Checklist](#12-security-checklist)
13. [Testing Strategy](#13-testing-strategy)
14. [Deployment Plan](#14-deployment-plan)
15. [Post-MVP Roadmap](#15-post-mvp-roadmap)

---

## 1. Project Overview

### 1.1 Core Concept

REGIX Store is a multi-vendor digital product marketplace where purchases flow through a ticket-based negotiation system rather than instant payment checkout. Buyers express intent, sellers review and negotiate, and upon approval, buyers receive secure download access.

### 1.2 Target Users

- **B2C Buyers:** Individual consumers purchasing digital products
- **B2B Buyers:** Business teams with approval workflows and team accounts
- **Sellers:** Independent creators and businesses listing digital products
- **Moderators:** Platform staff overseeing transactions and disputes
- **Admins:** Platform operators managing the entire ecosystem

### 1.3 Key Differentiators

- Ticket-based purchase flow (no payment gateway)
- Multi-vendor marketplace with KYC verification
- AI-powered product recommendations
- Subscription box bundles for digital products
- In-app messaging and negotiation within tickets

### 1.4 Current Project Status

#### ✅ Completed (Phase 1, Week 1 — Foundation)

| Area                         | Status  | Details                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Project Initialization**   | ✅ Done | Next.js 16.2.1 with App Router, TypeScript strict mode, ESLint, Prettier configured                                                                                                                                                                                                                                                                                                                                            |
| **Styling Setup**            | ✅ Done | Tailwind CSS v4 with `@tailwindcss/postcss`, shadcn/ui Base Luma preset, `tw-animate-css`                                                                                                                                                                                                                                                                                                                                      |
| **Database & ORM**           | ✅ Done | Prisma 7.5.0 with SQLite via `@prisma/adapter-libsql`, PrismaClient singleton pattern (`src/lib/database/dbClient.ts`), migrations present                                                                                                                                                                                                                                                                                     |
| **Authentication**           | ✅ Done | Better Auth 1.5.6 with email/password, Prisma adapter, `nextCookies` plugin, session management, RBAC plugin added                                                                                                                                                                                                                                                                                                             |
| **Auth UI**                  | ✅ Done | Login page (`/auth`), Register page (`/auth/register`), Profile page (`/profile`) with shadcn Card components                                                                                                                                                                                                                                                                                                                  |
| **Auth API**                 | ✅ Done | Better Auth handler at `src/app/api/auth/[...all]/route.ts`                                                                                                                                                                                                                                                                                                                                                                    |
| **Schema (Core)**            | ✅ Done | User, Session, Account, Verification models (Better Auth defaults)                                                                                                                                                                                                                                                                                                                                                             |
| **Environment**              | ✅ Done | `.env` with Better Auth secrets, admin credentials, database URL; T3 env validation (`serverEnv.ts`, `clientEnv.ts`)                                                                                                                                                                                                                                                                                                           |
| **Admin Seeding**            | ✅ Done | Admin account (`ceojahid`) configured in `.env` for seed on first run                                                                                                                                                                                                                                                                                                                                                          |
| **Full Prisma Schema**       | ✅ Done | 30+ models: User, Profile, SellerProfile, KYCSubmission, BusinessProfile, TeamMember, Category, Tag, Product, ProductVariant, ProductMedia, ProductTag, ProductView, CartItem, WishlistItem, Ticket, TicketItem, TicketMessage, TicketStatusHistory, DownloadLog, Review, ReviewResponse, SubscriptionBox, BoxItem, UserSubscription, SubscriptionTicket, Notification, CommissionRule, Announcement, FeatureFlag, ActivityLog |
| **Missing Packages**         | ✅ Done | Installed: jotai, fuse.js, nuqs, date-fns, slugify, sonner, react-dropzone, react-masonry-css, recharts, motion, pdf-lib, p-limit                                                                                                                                                                                                                                                                                              |
| **Database Migration**       | ✅ Done | Migration `20260722202822` applied — all 30+ tables created in SQLite                                                                                                                                                                                                                                                                                                                                                          |
| **Seed Script**              | ✅ Done | `prisma/seed.ts` — admin user + 8 categories                                                                                                                                                                                                                                                                                                                                                                                   |
| **Shared Types**             | ✅ Done | `src/lib/types/` — ActionResult, PaginatedResult, Role, TicketStatus, ProductStatus, KYCStatus, etc.                                                                                                                                                                                                                                                                                                                           |
| **Zod Schemas**              | ✅ Done | `src/lib/schemas/` — auth, profile, product, ticket, subscription schemas with inferred types                                                                                                                                                                                                                                                                                                                                  |
| **Auth Enhancement**         | ✅ Done | RBAC plugin added to Better Auth, role hierarchy in `src/lib/permissions.ts`                                                                                                                                                                                                                                                                                                                                                   |
| **Middleware**               | ✅ Done | `src/middleware.ts` — route protection, role-based access, public route whitelist                                                                                                                                                                                                                                                                                                                                              |
| **Server Actions (Auth)**    | ✅ Done | `src/server/actions/auth.actions.ts` — login, register, logout, getSession                                                                                                                                                                                                                                                                                                                                                     |
| **Server Actions (Product)** | ✅ Done | `src/server/actions/product.actions.ts` — createProduct, updateProduct, getProducts, getProductBySlug, getSellerProducts, submitForReview, getCategories, getTags                                                                                                                                                                                                                                                              |
| **Server Actions (Ticket)**  | ✅ Done | `src/server/actions/ticket.actions.ts` — addToCart, removeFromCart, getCart, toggleWishlist, getWishlist, createTicket, getBuyerTickets, getSellerTickets, getTicketById, updateTicketStatus, sendMessage, createReview, getNotifications, markNotificationRead                                                                                                                                                                |

#### 🚧 In Progress / Not Started

| Area                    | Status         | Target Phase     |
| ----------------------- | -------------- | ---------------- |
| **User Profiles & KYC** | ❌ Not started | Phase 1, Week 2  |
| **Product Catalog**     | ❌ Not started | Phase 1, Week 3  |
| **Ticket System**       | ❌ Not started | Phase 1, Week 4  |
| **Seller Dashboard**    | ❌ Not started | Phase 2, Week 5  |
| **Search & Discovery**  | ❌ Not started | Phase 2, Week 6  |
| **AI Recommendations**  | ❌ Not started | Phase 2, Week 7  |
| **Admin Panel**         | ❌ Not started | Phase 2, Week 7  |
| **B2B Features**        | ❌ Not started | Phase 3, Week 8  |
| **Subscriptions**       | ❌ Not started | Phase 3, Week 9  |
| **PDF Invoices**        | ❌ Not started | Phase 3, Week 10 |
| **Caching (Redis)**     | ❌ Not started | Phase 4, Week 11 |
| **Rate Limiting**       | ❌ Not started | Phase 4, Week 11 |
| **Deployment**          | ❌ Not started | Phase 4, Week 12 |

#### 📦 Installed Dependencies (Current)

| Category      | Packages                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------ |
| **Framework** | `next@^16.2.1`, `react@^19.2.4`, `react-dom@^19.2.4`                                       |
| **Database**  | `@prisma/client@^7.5.0`, `@prisma/adapter-libsql@^7.5.0`, `prisma@^7.5.0`                  |
| **Auth**      | `better-auth@^1.5.6`                                                                       |
| **UI**        | `@base-ui/react@^1.3.0`, `lucide-react@^0.577.0`, `next-themes@^0.4.6`, `vaul@^1.1.2`      |
| **Forms**     | `react-hook-form@^7.72.0`, `@hookform/resolvers@^5.2.2`, `zod@^4.3.6`                      |
| **Styling**   | `tailwindcss@^4.2.2`, `@tailwindcss/postcss@^4.2.2`, `tw-animate-css@^1.4.0`               |
| **Utilities** | `class-variance-authority@^0.7.1`, `clsx@^2.1.1`, `tailwind-merge@^3.5.0`, `sharp@^0.34.5` |
| **Dev**       | `typescript@^5.9.3`, `eslint@^10.1.0`, `eslint-config-next@^16.2.1`, `prettier@^3.8.1`     |

#### 📁 Project Structure (Current)

```
regix-store/
├── prisma/
│   ├── schema.prisma          # User, Session, Account, Verification models
│   ├── dev.db                 # SQLite database file
│   └── migrations/            # Database migrations
├── src/
│   ├── app/
│   │   ├── globals.css        # Tailwind v4 + shadcn theme
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── api/auth/[...all]/ # Better Auth API handler
│   │   ├── auth/              # Login page
│   │   ├── auth/register/     # Register page
│   │   └── profile/           # Profile page
│   ├── components/
│   │   ├── shadcnui/          # shadcn/ui primitives (Card, Button, Input, etc.)
│   │   ├── Form/              # LoginForm, RegisterForm
│   │   ├── Header/            # Navigation header
│   │   ├── Providers/         # Theme provider, auth provider
│   │   └── UserProfileCard.tsx
│   ├── hooks/                 # Custom hooks (empty, .gitkeep)
│   ├── lib/
│   │   ├── auth.ts            # Better Auth server config
│   │   ├── auth-client.ts     # Better Auth client config
│   │   ├── database/dbClient.ts  # PrismaClient singleton
│   │   ├── env/               # T3 env validation (serverEnv, clientEnv)
│   │   ├── fonts.ts           # Font configuration
│   │   ├── utils.ts           # Utility functions (cn)
│   │   └── zodSchema.ts       # Zod schemas
│   └── server/                # Server-only modules (empty, .gitkeep)
├── .env                       # Environment variables
├── next.config.ts             # Next.js configuration
├── prisma.config.ts           # Prisma configuration
├── components.json            # shadcn/ui configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

### 1.5 Success Criteria (MVP)

- Buyers can browse, search, and create purchase tickets
- Sellers can list products, manage tickets, and approve downloads
- Admins can moderate products, users, and oversee platform health
- All user flows are functional end-to-end without critical bugs
- Platform handles concurrent users gracefully on Render infrastructure

---

## 2. Tech Stack Summary

> **Note:** ✅ = Installed and configured. 📦 = Planned for future phases (not yet installed).

### 2.1 Frontend

| Technology               | Version      | Purpose                                                  | Status |
| ------------------------ | ------------ | -------------------------------------------------------- | ------ |
| React                    | ^19.2.4      | UI library (React Compiler enabled)                      | ✅     |
| Next.js                  | ^16.2.1      | Full-stack framework, App Router                         | ✅     |
| Tailwind CSS             | ^4.2.2       | Utility-first styling (CSS-only config in `globals.css`) | ✅     |
| shadcn/ui                | ^4.1.1 (CLI) | Accessible UI components, Base Luma preset               | ✅     |
| @base-ui/react           | ^1.3.0       | Primitive UI components (replaces Radix)                 | ✅     |
| Lucide React             | ^0.577.0     | Consistent icon system                                   | ✅     |
| next-themes              | ^0.4.6       | Dark mode (`default: "dark"`, `enableSystem: false`)     | ✅     |
| tw-animate-css           | ^1.4.0       | Tailwind animation utilities                             | ✅     |
| vaul                     | ^1.1.2       | Drawer / sheet component                                 | ✅     |
| class-variance-authority | ^0.7.1       | Component variant utilities                              | ✅     |
| motion.dev               | latest       | Animations and transitions                               | 📦     |
| react-masonry-css        | latest       | Masonry grid layouts                                     | 📦     |
| recharts                 | latest       | Data visualization and analytics                         | 📦     |
| fuse.js                  | latest       | Client-side fuzzy search                                 | 📦     |
| nuqs                     | latest       | URL query state synchronization                          | 📦     |
| react-dropzone           | latest       | Drag-and-drop file uploads                               | 📦     |

### 2.2 State & Forms

| Technology          | Version | Purpose                        | Status |
| ------------------- | ------- | ------------------------------ | ------ |
| React Hook Form     | ^7.72.0 | Performant form handling       | ✅     |
| @hookform/resolvers | ^5.2.2  | Zod resolver integration       | ✅     |
| Zod                 | ^4.3.6  | Runtime schema validation      | ✅     |
| Jotai               | latest  | Atomic global state management | 📦     |

### 2.3 Backend & Database

| Technology             | Version | Purpose                                                             | Status |
| ---------------------- | ------- | ------------------------------------------------------------------- | ------ |
| Next.js Server Actions | 16+     | Server-side mutations                                               | ✅     |
| Prisma ORM             | ^7.5.0  | Type-safe database operations (custom output `../generated/prisma`) | ✅     |
| @prisma/adapter-libsql | ^7.5.0  | LibSQL adapter for Prisma (SQLite)                                  | ✅     |
| SQLite                 | latest  | Local relational database (file-backed)                             | ✅     |
| Better Auth            | ^1.5.6  | Authentication, RBAC, session management                            | ✅     |
| better-auth/next-js    | —       | Next.js cookies integration plugin                                  | ✅     |

### 2.4 Storage & Media

| Technology   | Version | Purpose                               | Status |
| ------------ | ------- | ------------------------------------- | ------ |
| sharp        | ^0.34.5 | Image optimization and resizing       | ✅     |
| AWS SDK (S3) | latest  | Cloud object storage                  | 📦     |
| S3 Presigner | latest  | Secure temporary upload/download URLs | 📦     |
| node-vibrant | latest  | Color palette extraction from images  | 📦     |

### 2.5 Utilities

| Technology         | Version | Purpose                            | Status |
| ------------------ | ------- | ---------------------------------- | ------ |
| clsx               | ^2.1.1  | Conditional className utilities    | ✅     |
| tailwind-merge     | ^3.5.0  | Tailwind class merging             | ✅     |
| react-toastify     | ^11.0.5 | Toast notification system          | ✅     |
| dotenv             | ^17.3.1 | Environment variable loading       | ✅     |
| @t3-oss/env-nextjs | —       | Zod-enforced env validation        | ✅     |
| date-fns           | latest  | Date formatting and manipulation   | 📦     |
| pdf-lib            | latest  | PDF invoice and receipt generation | 📦     |
| slugify            | latest  | SEO-friendly URL generation        | 📦     |
| p-limit            | latest  | Promise concurrency control        | 📦     |

### 2.6 Infrastructure & Caching

| Technology     | Version | Purpose                         | Status |
| -------------- | ------- | ------------------------------- | ------ |
| Render         | -       | Application hosting platform    | 📦     |
| @upstash/redis | latest  | Redis caching and rate limiting | 📦     |
| Local SQLite   | -       | Primary database                | ✅     |
| Local / S3     | -       | File storage                    | 📦     |

### 2.7 Excluded Services

- No external email service (Resend, SendGrid, Nodemailer)
- No payment gateway (Stripe, PayPal)
- No external analytics (Google Analytics, Mixpanel)
- No external OAuth providers configured yet (Google, GitHub — planned for later)

### 2.8 Dev Tooling

| Technology                  | Version | Purpose                                                                                | Status |
| --------------------------- | ------- | -------------------------------------------------------------------------------------- | ------ |
| TypeScript                  | ^5.9.3  | Type checking (strict mode)                                                            | ✅     |
| ESLint                      | ^10.1.0 | Linting (plugin-react blocked from v10)                                                | ✅     |
| eslint-config-next          | ^16.2.1 | Next.js ESLint configuration                                                           | ✅     |
| eslint-plugin-react-hooks   | ^7.0.1  | React Hooks lint rules                                                                 | ✅     |
| Prettier                    | ^3.8.1  | Code formatting (`singleAttributePerLine`, `bracketSameLine`, `experimentalTernaries`) | ✅     |
| prettier-plugin-tailwindcss | ^0.7.2  | Tailwind class sorting in Prettier                                                     | ✅     |
| Prisma CLI                  | ^7.5.0  | Schema management, migrations, studio                                                  | ✅     |
| bun                         | latest  | Package manager & script runner                                                        | ✅     |
| shadcn CLI                  | ^4.1.1  | Component addition CLI                                                                 | ✅     |
| babel-plugin-react-compiler | ^1.0.0  | React Compiler Babel plugin                                                            | ✅     |

### 2.9 Key Convention Notes

- **Auth:** Better Auth 1.5.6 with email/password only. No OAuth providers configured yet. RBAC not yet implemented — roles are WIP.
- **Styling:** Tailwind v4 uses CSS-only config via `@theme` in `globals.css`. No `tailwind.config.ts`. PostCSS plugin is `@tailwindcss/postcss`.
- **UI Primitives:** All shadcn components use `@base-ui/react` (not Radix). The `Button` wraps `@base-ui/react/button`.
- **Env Validation:** `@t3-oss/env-nextjs` validates all env vars at startup. `serverEnv.ts` uses `experimental__runtimeEnv: process.env`.
- **Prisma Client:** Imported from `@generated/prisma/client` (custom output path). `schema.prisma` has no inline `datasource.url` — it comes from `prisma.config.ts`.
- **Database Editing:** Use `bun migrate` (`prisma migrate dev && prisma generate`) for schema changes — not `prisma db push`.
- **Build Verification:** `bun lint` → `bun run build` → `bun prod` (increasingly strict gates).

---

## 3. Phase 1: Foundation (Weeks 1-4)

> **Status Key:** ✅ = Completed. 🔄 = Partially done (see notes). ❌ = Not started. 📦 = Blocked by missing dependency.

### 3.1 Week 1: Project Setup & Authentication

> **Actual Status:** ✅ Week 1 is substantially complete. Core project scaffolding, database, and email/password auth are done. OAuth providers, RBAC roles, forgot-password flow, and protected route middleware remain for future phases.

#### Day 1-2: Repository & Tooling Setup

| Task                                                   | Status  | Notes                                                                                                     |
| ------------------------------------------------------ | ------- | --------------------------------------------------------------------------------------------------------- |
| Initialize Next.js 16 project with App Router          | ✅ Done | Next.js ^16.2.1, App Router, Turbopack default                                                            |
| Configure Tailwind CSS 4 with custom theme tokens      | ✅ Done | Tailwind v4 via `@tailwindcss/postcss`, CSS-only config in `globals.css`                                  |
| Set up shadcn/ui with base components                  | ✅ Done | shadcn CLI ^4.1.1, Base Luma preset, components in `src/components/shadcnui/`                             |
| Configure ESLint, Prettier, and TypeScript strict mode | ✅ Done | ESLint ^10.1.0, Prettier ^3.8.1 with `singleAttributePerLine`, `bracketSameLine`, `experimentalTernaries` |
| Set up Git repository with branch protection rules     | ✅ Done | GitHub remote configured (`origin: https://github.com/official-jahid/regix-store.git`)                    |
| Configure environment variable structure               | ✅ Done | `.env` with T3 env validation (`serverEnv.ts`, `clientEnv.ts`); `.env.example` template committed         |

#### Day 3-4: Database & ORM Setup

| Task                                           | Status     | Notes                                                                                                                                                         |
| ---------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Initialize Prisma ORM with SQLite provider     | ✅ Done    | Prisma ^7.5.0, `@prisma/adapter-libsql`, custom output `../generated/prisma`                                                                                  |
| Design and implement core schema tables        | ✅ Done    | User, Session, Account, Verification models (Better Auth defaults)                                                                                            |
| Set up Prisma Client singleton pattern         | ✅ Done    | `src/lib/database/dbClient.ts` — `globalThis` singleton wired to `PrismaLibSql`                                                                               |
| Configure database migration workflow          | ✅ Done    | `prisma/migrations/` present; `bun migrate` script configured                                                                                                 |
| Seed database with initial admin account       | 🔄 Partial | `.env` has `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_EMAIL` vars, but **no seed script exists yet**. Seeding is configured conceptually but not implemented. |
| Set up Prisma Studio for local data inspection | ✅ Done    | `bun studio` script configured (headless, `--browser none`)                                                                                                   |

#### Day 5-7: Authentication System (Better Auth)

| Task                                                                    | Status      | Notes                                                                                                                                 |
| ----------------------------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Configure Better Auth with SQLite adapter                               | ✅ Done     | `src/lib/auth.ts` — `prismaAdapter(prisma, { provider: "sqlite" })`                                                                   |
| Implement email/password registration and login                         | ✅ Done     | `emailAndPassword: { enabled: true, autoSignIn: false, requireEmailVerification: false }`                                             |
| Implement OAuth providers (Google, GitHub)                              | ❌ Not done | No OAuth config in `auth.ts`. No provider credentials in `.env`. Planned for later.                                                   |
| Set up RBAC with five roles (buyer, business, seller, moderator, admin) | ❌ Not done | No role configuration in `auth.ts`. Better Auth RBAC plugin not yet integrated.                                                       |
| Implement session management with JWT and refresh tokens                | ✅ Done     | Better Auth default behavior with `nextCookies()` plugin                                                                              |
| Build authentication UI components                                      | 🔄 Partial  | Login page (`/auth`) and Register page (`/auth/register`) done with shadcn Card components. **Forgot password form not implemented.** |
| Implement protected route middleware                                    | ❌ Not done | No `middleware.ts` found in project. Routes are currently unprotected.                                                                |
| Add logout and session cleanup                                          | ✅ Done     | Better Auth handles session cleanup via API route at `/api/auth/[...all]`                                                             |

**Week 1 Deliverables — Actual vs Planned:**

| Deliverable                                   | Status      | Notes                                                   |
| --------------------------------------------- | ----------- | ------------------------------------------------------- |
| Working authentication system                 | ✅ Done     | Email/password auth functional. OAuth and RBAC pending. |
| Database schema for users, sessions, accounts | ✅ Done     | Plus Verification model                                 |
| Login and register pages                      | ✅ Done     | OAuth callback pages not built (no OAuth configured)    |
| Protected route infrastructure                | ❌ Not done | No middleware; routes are publicly accessible           |

---

### 3.2 Week 2: Core User Management & KYC

> **Actual Status:** ❌ Not started. No profile pages, KYC flow, or business account features exist yet.

#### Day 8-9: User Profiles & Role Switching

| Task                                                   | Status         | Notes                                                      |
| ------------------------------------------------------ | -------------- | ---------------------------------------------------------- |
| Build profile management pages for all roles           | ❌ Not started | Only a basic `/profile` page exists (auth profile display) |
| Implement profile editing (name, bio, avatar)          | ❌ Not started | No edit forms or profile update actions                    |
| Build avatar upload using react-dropzone               | ❌ Not started | `react-dropzone` not installed (📦 planned)                |
| Create role-specific dashboard shells                  | ❌ Not started | No dashboards exist                                        |
| Implement role switching for users with multiple roles | ❌ Not started | No multi-role support yet                                  |

#### Day 10-11: Seller KYC Flow

| Task                                               | Status         | Notes                                                      |
| -------------------------------------------------- | -------------- | ---------------------------------------------------------- |
| Design KYC submission form                         | ❌ Not started |                                                            |
| Implement document upload via react-dropzone to S3 | ❌ Not started | Blocked: `react-dropzone` not installed, S3 not configured |
| Build KYC review queue for moderators/admins       | ❌ Not started |                                                            |
| Implement KYC status tracking                      | ❌ Not started |                                                            |
| Add KYC approval/rejection with feedback           | ❌ Not started |                                                            |
| Gate seller features behind KYC verification       | ❌ Not started |                                                            |

#### Day 12-14: Business Account Setup (B2B Foundation)

| Task                                    | Status         | Notes |
| --------------------------------------- | -------------- | ----- |
| Implement business registration flow    | ❌ Not started |       |
| Build company profile management        | ❌ Not started |       |
| Create team invitation system           | ❌ Not started |       |
| Implement basic team member listing     | ❌ Not started |       |
| Set up business-specific profile fields | ❌ Not started |       |

**Week 2 Deliverables — Actual vs Planned:**

| Deliverable                                | Status         | Notes                                    |
| ------------------------------------------ | -------------- | ---------------------------------------- |
| Complete user profile system               | ❌ Not started | Basic profile page exists but no editing |
| Functional KYC flow for sellers            | ❌ Not started |                                          |
| Business account creation and team invites | ❌ Not started |                                          |
| Moderator KYC review interface             | ❌ Not started |                                          |

---

### 3.3 Week 3: Product Catalog Foundation

> **Actual Status:** ❌ Not started. No product models, creation flows, or media management exist yet.

#### Day 15-16: Product Data Model

| Task                                                          | Status         | Notes                                             |
| ------------------------------------------------------------- | -------------- | ------------------------------------------------- |
| Design Prisma schema for products, categories, tags, variants | ❌ Not started | Schema only has User/Session/Account/Verification |
| Implement category hierarchy                                  | ❌ Not started |                                                   |
| Create tag management system                                  | ❌ Not started |                                                   |
| Set up product status workflow                                | ❌ Not started |                                                   |
| Build database seeders for categories and sample products     | ❌ Not started |                                                   |

#### Day 17-18: Product Creation Flow

| Task                                                   | Status         | Notes                                |
| ------------------------------------------------------ | -------------- | ------------------------------------ |
| Build product creation form with React Hook Form + Zod | ❌ Not started | RHF and Zod are installed and ready  |
| Implement rich text description editor                 | ❌ Not started |                                      |
| Add product pricing fields                             | ❌ Not started |                                      |
| Build category and tag selection interfaces            | ❌ Not started |                                      |
| Implement auto-slug generation via slugify             | ❌ Not started | `slugify` not installed (📦 planned) |
| Create draft save functionality                        | ❌ Not started |                                      |

#### Day 19-21: File Upload & Media Management

| Task                                                | Status         | Notes                                                     |
| --------------------------------------------------- | -------------- | --------------------------------------------------------- |
| Configure AWS S3 bucket and IAM credentials         | ❌ Not started | No AWS SDK installed (📦 planned)                         |
| Implement presigned URL generation                  | ❌ Not started |                                                           |
| Build file upload component with react-dropzone     | ❌ Not started | `react-dropzone` not installed (📦 planned)               |
| Add file type and size validation                   | ❌ Not started |                                                           |
| Implement upload progress indicators                | ❌ Not started |                                                           |
| Build cover image and gallery management            | ❌ Not started |                                                           |
| Integrate sharp for image optimization              | ❌ Not started | `sharp` is installed but not integrated into any pipeline |
| Integrate node-vibrant for color palette extraction | ❌ Not started | `node-vibrant` not installed (📦 planned)                 |

**Week 3 Deliverables — Actual vs Planned:**

| Deliverable                            | Status         | Notes |
| -------------------------------------- | -------------- | ----- |
| Complete product data model            | ❌ Not started |       |
| Product creation and editing flow      | ❌ Not started |       |
| S3 file upload with image optimization | ❌ Not started |       |
| Product media gallery management       | ❌ Not started |       |

---

### 3.4 Week 4: Ticket System Core

> **Actual Status:** ❌ Not started. No cart, wishlist, ticket, or download functionality exists yet.

#### Day 22-23: Cart & Wishlist

| Task                                               | Status         | Notes                              |
| -------------------------------------------------- | -------------- | ---------------------------------- |
| Implement cart state management with Jotai         | ❌ Not started | `jotai` not installed (📦 planned) |
| Build add-to-cart functionality                    | ❌ Not started | No product pages exist to add from |
| Create cart page with quantity management          | ❌ Not started |                                    |
| Implement cart persistence for authenticated users | ❌ Not started |                                    |
| Build wishlist functionality                       | ❌ Not started |                                    |
| Add cart/wishlist count badges to navigation       | ❌ Not started |                                    |

#### Day 24-25: Ticket Creation Flow

| Task                                             | Status         | Notes |
| ------------------------------------------------ | -------------- | ----- |
| Design ticket intent form                        | ❌ Not started |       |
| Implement B2B-specific fields                    | ❌ Not started |       |
| Build attachment upload for supporting documents | ❌ Not started |       |
| Create ticket preview and confirmation step      | ❌ Not started |       |
| Implement ticket creation server action          | ❌ Not started |       |
| Build ticket detail view for buyers              | ❌ Not started |       |

#### Day 26-28: Ticket Management & Approval

| Task                                              | Status         | Notes             |
| ------------------------------------------------- | -------------- | ----------------- |
| Create ticket status lifecycle                    | ❌ Not started |                   |
| Build seller ticket inbox with filtering          | ❌ Not started |                   |
| Implement ticket approval and rejection workflows | ❌ Not started |                   |
| Create secure download link generation            | ❌ Not started | S3 not configured |
| Build buyer ticket dashboard                      | ❌ Not started |                   |
| Implement download tracking and history           | ❌ Not started |                   |
| Add basic ticket expiry logic                     | ❌ Not started |                   |

**Week 4 Deliverables — Actual vs Planned:**

| Deliverable                        | Status         | Notes |
| ---------------------------------- | -------------- | ----- |
| Functional cart and wishlist       | ❌ Not started |       |
| End-to-end ticket creation flow    | ❌ Not started |       |
| Seller ticket management dashboard | ❌ Not started |       |
| Secure download delivery system    | ❌ Not started |       |
| Basic ticket lifecycle management  | ❌ Not started |       |

---

## 4. Phase 2: Seller & Discovery (Weeks 5-7)

### 4.1 Week 5: Seller Dashboard & Chat

#### Day 29-30: Seller Storefront

- Build customizable seller storefront page
- Implement storefront builder (banner, logo, bio, social links)
- Create seller public profile with product listing
- Build storefront analytics (views, followers)

#### Day 31-32: Seller Product Management

- Create seller product listing dashboard
- Implement product editing and deletion
- Build draft management interface
- Add product analytics (views, tickets, conversion)

#### Day 33-35: In-Ticket Messaging System

- Design chat data model (messages, attachments, read status)
- Build real-time messaging interface within ticket detail view
- Implement file attachment sharing in chat
- Add message history with pagination
- Build unread message indicators and notifications
- Create notification system with Sonner toasts

**Week 5 Deliverables:**

- Customizable seller storefronts
- Complete seller product management
- Functional in-ticket messaging
- Notification system with toasts

---

### 4.2 Week 6: Search, Discovery & Reviews

#### Day 36-37: Search Implementation

- Integrate fuse.js for client-side fuzzy search
- Build search input with autocomplete suggestions
- Implement search results page with product cards
- Add recent searches and popular searches
- Build search analytics tracking

#### Day 38-39: Filters & Browse Experience

- Implement category filtering with hierarchy
- Build price range, license type, and format filters
- Add sorting options (newest, popular, highest rated, price)
- Create masonry grid layout with react-masonry-css
- Implement infinite scroll for product listings
- Synchronize filter state with URL using nuqs

#### Day 40-42: Reviews & Ratings System

- Design review data model (rating, text, photos, verified status)
- Build review submission form (restricted to approved ticket holders)
- Implement star rating component
- Create product review listing with helpfulness voting
- Build seller response to reviews
- Add review moderation tools for admins

**Week 6 Deliverables:**

- Full-text fuzzy search with filters
- Masonry grid browse experience
- Verified purchase review system

---

### 4.3 Week 7: AI Recommendations & Admin Panel

#### Day 43-44: AI Recommendations (Basic)

- Implement product view tracking
- Build "recently viewed" section
- Create "similar products" based on category/tags matching
- Implement basic personalized feed (category affinity)
- Add trending products algorithm (view and ticket volume)

#### Day 45-46: Admin User Management

- Build admin user directory with search and filters
- Implement user detail view with activity history
- Create account suspension/activation controls
- Build role assignment interface
- Add user export functionality

#### Day 47-49: Admin Product & Ticket Oversight

- Create product moderation queue (pending approvals)
- Implement product approval/rejection with feedback
- Build flagged products review interface
- Create platform-wide ticket oversight dashboard
- Implement ticket intervention capabilities
- Build basic platform analytics overview

**Week 7 Deliverables:**

- Basic AI recommendation engine
- Complete admin user management
- Product moderation workflow
- Platform oversight dashboard

---

## 5. Phase 3: B2B & Subscriptions (Weeks 8-10)

### 5.1 Week 8: B2B Features

#### Day 50-51: Team Management

- Build team member invitation system
- Implement role permissions within teams (Admin, Manager, Buyer)
- Create team activity log
- Build team dashboard for business accounts

#### Day 52-53: Purchase Workflows

- Implement internal purchase approval chain
- Build department tagging for tickets
- Create bulk ticketing interface (multiple products in one ticket)
- Add budget tracking and spending alerts

#### Day 54-56: B2B Documentation

- Build structured contract notes field in tickets
- Implement volume pricing request workflow
- Create purchase history export (CSV)
- Prepare PDF invoice generation architecture

**Week 8 Deliverables:**

- Team management and permissions
- Purchase approval workflows
- Bulk ticketing system
- B2B-specific ticket fields

---

### 5.2 Week 9: Subscription Boxes

#### Day 57-58: Box Management

- Design subscription box data model
- Build box creation interface for admins/sellers
- Implement box tier management (Basic, Pro, Enterprise)
- Create box preview and item listing

#### Day 59-60: Subscription Lifecycle

- Build subscription enrollment flow (intent-based)
- Implement cycle management (monthly/quarterly ticket generation)
- Create subscription management dashboard (pause, skip, cancel)
- Build subscription history and upcoming cycle view

#### Day 61-63: Box Customization

- Implement item swapping before ticket generation
- Build box customization preferences
- Create subscription notification system
- Add box delivery tracking (ticket-based)

**Week 9 Deliverables:**

- Subscription box creation and enrollment
- Automated cycle ticket generation
- Subscription management dashboard

---

### 5.3 Week 10: PDF Invoices & Advanced Features

#### Day 64-65: PDF Invoice Generation

- Implement pdf-lib integration for PDF creation
- Build invoice template design
- Create invoice generation trigger on ticket approval
- Add invoice download for B2B buyers
- Build invoice history and management

#### Day 66-67: Advanced Admin Features

- Implement commission rule configuration
- Build category management interface (add, edit, remove)
- Create announcement banner system
- Add feature flag management

#### Day 68-70: Analytics Enhancement

- Build comprehensive Recharts dashboards for sellers
- Implement platform-wide analytics for admins
- Create conversion funnel visualization
- Add top seller and category performance charts

**Week 10 Deliverables:**

- PDF invoice generation and download
- Advanced admin configuration tools
- Enhanced analytics dashboards

---

## 6. Phase 4: Polish & Scale (Weeks 11-12)

### 6.1 Week 11: Performance & Caching

#### Day 71-72: Redis Caching Implementation

- Set up @upstash/redis connection
- Implement query result caching for product listings
- Add search result caching with fuse.js
- Cache user sessions and auth state
- Build cache invalidation strategy

#### Day 73-74: Rate Limiting & Security

- Implement rate limiting on ticket creation using Redis
- Add rate limiting on messaging and file uploads
- Build API abuse detection
- Implement request throttling

#### Day 75-77: Image & Asset Optimization

- Audit and optimize all image loading with sharp
- Implement responsive image variants
- Add lazy loading for product grids
- Optimize S3 asset delivery
- Build image CDN strategy

**Week 11 Deliverables:**

- Redis caching layer
- Rate limiting across critical endpoints
- Optimized asset delivery

---

### 6.2 Week 12: Final Polish & Launch Prep

#### Day 78-79: UX Polish

- Implement skeleton loading screens across all pages
- Add motion.dev animations for page transitions
- Build micro-interactions (button hovers, card lifts)
- Implement empty states and error boundaries
- Add dark mode toggle with system preference sync

#### Day 80-81: Accessibility & Testing

- Conduct keyboard navigation audit
- Implement ARIA labels and semantic HTML
- Add focus management and visible focus indicators
- Ensure WCAG AA color contrast compliance
- Build basic test suite (unit and integration)

#### Day 82-84: Deployment & Documentation

- Configure Render deployment pipeline
- Set up production environment variables
- Build deployment health checks
- Create API documentation
- Write user guides and seller onboarding documentation
- Prepare launch checklist and rollback plan

**Week 12 Deliverables:**

- Polished UI with animations
- Accessibility compliance
- Production deployment on Render
- Complete documentation
- Launch-ready application

---

## 7. Database Schema Overview

### 7.1 Core Entities

#### User & Authentication

- **User:** Core user account (id, email, name, avatar, role, createdAt, updatedAt)
- **Account:** OAuth account linking (id, userId, provider, providerAccountId)
- **Session:** Active sessions (id, userId, token, expiresAt)
- **Verification:** Email verification tokens (id, identifier, token, expires)

#### Profiles

- **Profile:** Extended user profile (id, userId, bio, website, location, socialLinks)
- **BusinessProfile:** B2B company details (id, userId, companyName, industry, size, taxId)
- **TeamMember:** Business team associations (id, businessId, userId, role, invitedAt)
- **SellerProfile:** Seller-specific data (id, userId, storeName, storeSlug, storeDescription, banner, logo, verificationStatus)
- **KYCSubmission:** Seller verification documents (id, sellerId, documentType, documentUrl, status, reviewedAt, reviewedBy)

#### Products

- **Category:** Product categories (id, name, slug, parentId, description, sortOrder)
- **Tag:** Product tags (id, name, slug)
- **Product:** Core product (id, sellerId, title, slug, description, price, salePrice, currency, status, categoryId, licenseType, downloadLimit, createdAt, updatedAt)
- **ProductTag:** Product-tag associations (id, productId, tagId)
- **ProductVariant:** License tiers and formats (id, productId, name, price, fileUrl, downloadLimit)
- **ProductMedia:** Product images and videos (id, productId, url, type, sortOrder, isPrimary)
- **ProductView:** View tracking for analytics (id, productId, userId, viewedAt)

#### Tickets & Purchases

- **CartItem:** Shopping cart items (id, userId, productId, variantId, quantity, addedAt)
- **WishlistItem:** Saved products (id, userId, productId, addedAt)
- **Ticket:** Purchase tickets (id, buyerId, sellerId, status, totalAmount, currency, intentMessage, companyInfo, department, createdAt, updatedAt, expiresAt)
- **TicketItem:** Products within a ticket (id, ticketId, productId, variantId, quantity, price)
- **TicketMessage:** In-ticket chat messages (id, ticketId, senderId, content, attachmentUrl, createdAt, readAt)
- **TicketStatusHistory:** Status change audit log (id, ticketId, status, changedBy, reason, createdAt)
- **DownloadLog:** Download tracking (id, ticketId, productId, downloadedAt, ipAddress)

#### Reviews

- **Review:** Product reviews (id, productId, userId, ticketId, rating, content, helpfulCount, createdAt, updatedAt)
- **ReviewResponse:** Seller responses (id, reviewId, sellerId, content, createdAt)

#### Subscriptions

- **SubscriptionBox:** Curated bundles (id, creatorId, name, description, slug, tier, price, frequency, status)
- **BoxItem:** Products in a box (id, boxId, productId, quantity, isOptional)
- **UserSubscription:** User subscriptions (id, userId, boxId, status, startDate, nextDeliveryDate, pausedUntil)
- **SubscriptionTicket:** Generated tickets per cycle (id, subscriptionId, ticketId, cycleDate)

#### Notifications

- **Notification:** In-app notifications (id, userId, type, title, message, relatedId, relatedType, readAt, createdAt)

#### Admin & Platform

- **CommissionRule:** Platform fee configuration (id, categoryId, sellerTier, percentage, effectiveFrom)
- **Announcement:** Platform banners (id, title, content, type, startDate, endDate, isActive)
- **FeatureFlag:** Toggleable features (id, name, description, enabled, rolloutPercentage)
- **ActivityLog:** Platform audit trail (id, userId, action, entityType, entityId, metadata, createdAt)

### 7.2 Relationships Summary

- One User has one Profile, one SellerProfile (optional), one BusinessProfile (optional)
- One Seller has many Products; one Product belongs to one Seller
- One Product has many Variants, many Media, many Reviews
- One Ticket has many Items, many Messages, many StatusHistory entries
- One Business has many TeamMembers
- One SubscriptionBox has many BoxItems, many UserSubscriptions

---

## 8. API Architecture

### 8.1 Server Actions Pattern

All server-side mutations use Next.js Server Actions with the following conventions:

- Actions are co-located with their consuming components
- Each action has Zod-validated input schemas
- Actions return typed success/error responses
- Actions handle authentication and authorization checks internally
- Actions use Prisma transactions for multi-step operations

### 8.2 API Route Categories

#### Authentication Actions

- User registration, login, logout
- OAuth callback handling
- Password reset flow
- Session refresh and validation
- Role verification helpers

#### User Management Actions

- Profile creation and updates
- Avatar upload handling
- KYC document submission
- Team member invitations and management
- Account deletion

#### Product Actions

- Product creation, update, deletion
- Product status transitions (draft, submit for review, publish, archive)
- Category and tag management
- Product media upload and ordering
- Product view tracking

#### Ticket Actions

- Cart add, update, remove
- Ticket creation from cart
- Ticket status updates (approve, reject, cancel)
- Message sending within tickets
- Download link generation and tracking

#### Search & Discovery Actions

- Product search indexing updates
- Search analytics tracking
- Filter and sort parameter handling

#### Admin Actions

- User suspension/activation
- Role assignment
- Product moderation decisions
- Commission rule updates
- Announcement management
- Feature flag toggling

### 8.3 Data Fetching Patterns

- Server Components fetch data directly via Prisma
- Client Components use Server Actions for mutations
- Real-time updates via optimistic UI with Jotai
- Search and filters handled client-side with fuse.js and nuqs
- Pagination via cursor-based infinite scroll

### 8.4 Error Handling Strategy

- Zod validation errors returned with field-level messages
- Business logic errors returned with user-friendly messages
- Server errors logged internally, generic message shown to user
- Network failures handled with retry logic and user feedback
- Unauthorized access returns 403 with redirect to login

---

## 9. File & Asset Strategy

### 9.1 Upload Flow

1. Client requests presigned upload URL from Server Action
2. Server generates S3 presigned URL with content type and size constraints
3. Client uploads file directly to S3 via react-dropzone
4. On upload completion, client notifies server with file metadata
5. Server validates and stores file reference in database

### 9.2 File Categories & Storage

#### Product Assets

- **Location:** S3 bucket under `products/{productId}/`
- **Types:** Cover images, gallery images, preview videos, demo files
- **Processing:** sharp generates thumbnails and responsive variants
- **Lifecycle:** Deleted when product is permanently removed

#### Digital Products

- **Location:** S3 bucket under `downloads/{productId}/`
- **Types:** ZIP, PDF, video files, software binaries
- **Access:** Presigned URLs generated only on ticket approval
- **Security:** URLs expire after configured duration (default 24 hours)
- **Tracking:** All downloads logged with timestamp and IP

#### User Uploads

- **Location:** S3 bucket under `users/{userId}/`
- **Types:** Avatars, KYC documents, ticket attachments, chat files
- **Avatars:** Processed by sharp to standard sizes
- **KYC Documents:** Restricted access, only visible to moderators/admins
- **Chat Attachments:** Accessible to ticket participants only

### 9.3 Image Processing Pipeline

1. Original upload stored in S3
2. sharp generates multiple variants: thumbnail (300x300), medium (800x600), large (1600x1200)
3. node-vibrant extracts dominant color palette for UI theming
4. Variant URLs stored in ProductMedia table
5. Client receives responsive srcset for optimal loading

### 9.4 Cleanup & Maintenance

- Orphaned file detection (files in S3 without database references)
- Soft-deleted product files retained for 30 days
- Expired download links automatically invalidated
- Periodic audit of storage usage per seller

---

## 10. State Management Strategy

### 10.1 Jotai Atoms Hierarchy

#### Global Atoms

- **userAtom:** Current authenticated user with role
- **themeAtom:** Light/dark mode preference
- **notificationsAtom:** Unread notification count and list
- **cartAtom:** Shopping cart items and totals
- **wishlistAtom:** Wishlisted product IDs

#### Feature-Specific Atoms

- **searchQueryAtom:** Current search input and filters
- **ticketFilterAtom:** Active filters for ticket dashboards
- **chatMessagesAtom:** Messages for active ticket conversation
- **productDraftAtom:** Auto-saved product creation form state

#### Derived Atoms

- **cartTotalAtom:** Computed cart total from cartAtom
- **isSellerAtom:** Boolean derived from user role
- **unreadCountAtom:** Computed from notificationsAtom

### 10.2 State Persistence

- Cart and wishlist persisted to database for authenticated users
- Search filters synced to URL via nuqs for shareability
- Form drafts stored in localStorage with expiry
- Theme preference persisted to localStorage

### 10.3 Server State Synchronization

- Server Components hydrate initial state from Prisma queries
- Mutations invalidate related Jotai atoms
- Optimistic updates applied immediately, rolled back on error
- Periodic background refetch for time-sensitive data (ticket status, notifications)

---

## 11. Caching & Performance Strategy

### 11.1 Redis Cache Layers

#### Query Result Caching

- Product listings cached by filter combination (TTL: 5 minutes)
- Category tree cached as single object (TTL: 1 hour)
- Popular product pages cached individually (TTL: 10 minutes)
- Seller storefront data cached by seller slug (TTL: 15 minutes)

#### Session & Auth Caching

- Active sessions cached for quick validation
- User role permissions cached per session
- Rate limit counters stored in Redis with sliding window

#### Search Caching

- fuse.js search index rebuilt and cached on product changes
- Recent search suggestions cached per user (TTL: 1 hour)
- Popular search terms aggregated and cached (TTL: 30 minutes)

### 11.2 Cache Invalidation

- Product updates invalidate related product and listing caches
- New ticket creation invalidates seller ticket count caches
- User role changes invalidate auth caches
- Scheduled cache warming for high-traffic pages

### 11.3 Rate Limiting Rules

- Ticket creation: 10 per hour per buyer
- Messages: 60 per minute per user
- File uploads: 20 per hour per user
- Login attempts: 5 per 15 minutes per IP
- Search requests: 120 per minute per IP

### 11.4 Database Optimization

- Indexed fields: product slug, sellerId, status, categoryId, createdAt
- Composite indexes for common query patterns (tickets by seller + status)
- Query result pagination with cursor-based offsets
- Connection pooling for concurrent requests

---

## 12. Security Checklist

### 12.1 Authentication Security

- Passwords hashed with bcrypt (via Better Auth)
- JWT tokens with short expiry and secure refresh rotation
- OAuth state parameter validation to prevent CSRF
- Session invalidation on password change or suspicious activity
- Brute force protection on login endpoints

### 12.2 Authorization Security

- Role-based access control enforced at Server Action level
- Resource ownership verification (users can only modify their own data)
- Ticket access restricted to participants (buyer, seller, moderator, admin)
- Download links tied to specific user and ticket with expiry
- Admin actions require explicit admin role verification

### 12.3 Data Security

- SQLite database file protected from direct web access
- S3 buckets configured with least-privilege access policies
- Presigned URLs generated with minimal expiry times
- File uploads validated for type and size before S3 upload
- Sensitive fields (KYC documents) excluded from API responses by default

### 12.4 Input Security

- All user inputs validated with Zod schemas
- SQL injection prevention via Prisma parameterized queries
- XSS prevention through React's built-in escaping
- Content Security Policy headers configured
- File upload restrictions on type, size, and content

### 12.5 Infrastructure Security

- Environment variables never exposed to client
- HTTPS enforced on all routes
- Security headers (HSTS, X-Frame-Options, X-Content-Type-Options)
- Dependency vulnerability scanning
- Regular security audits of Server Actions

---

## 13. Testing Strategy

### 13.1 Unit Testing

- Zod schema validation tests
- Utility function tests (slugify, date formatting, price calculations)
- Jotai atom logic tests
- Component rendering tests for critical UI

### 13.2 Integration Testing

- Server Action endpoint tests with mocked Prisma
- Authentication flow tests (register, login, logout, OAuth)
- Ticket lifecycle tests (create, approve, reject, download)
- File upload flow tests with mocked S3

### 13.3 End-to-End Testing

- Critical user journeys:
  - New buyer registration to first download
  - New seller registration to first approved product
  - Moderator review and approval workflow
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile responsiveness testing

### 13.4 Performance Testing

- Load testing for concurrent ticket creation
- S3 upload performance under various file sizes
- Search response time with large product catalogs
- Database query performance with pagination

### 13.5 Security Testing

- Authentication bypass attempts
- Authorization boundary testing
- File upload security (malicious file types)
- Rate limiting effectiveness
- Session fixation and hijacking tests

---

## 14. Deployment Plan

### 14.1 Render Configuration

- Web Service: Next.js application with Node.js runtime
- Build Command: `npm run build`
- Start Command: `npm start`
- Environment: Production Node.js environment
- Auto-deploy on main branch push

### 14.2 Environment Variables

- Database: `DATABASE_URL` (SQLite file path)
- Auth: `BETTER_AUTH_SECRET`, OAuth client IDs and secrets
- Storage: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME`, `S3_REGION`
- Redis: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- App: `NEXT_PUBLIC_APP_URL`, `APP_NAME`

### 14.3 Pre-Deployment Checklist

- All environment variables configured in Render dashboard
- Database migrations applied
- S3 bucket created with correct CORS and policy settings
- Redis instance provisioned and accessible
- Domain configured with SSL certificate
- Health check endpoint responding correctly

### 14.4 Post-Deployment

- Verify all user flows on production
- Monitor error logs and performance metrics
- Test file upload and download functionality
- Validate email-less notification system
- Confirm rate limiting is active

### 14.5 Rollback Plan

- Previous deployment retained for instant rollback
- Database backups before major migrations
- Feature flags for gradual rollout of new features
- Monitoring alerts for error rate spikes

---

## 15. Post-MVP Roadmap

### 15.1 Immediate Post-MVP (Months 2-3)

- Email service integration (Resend or alternative) for notifications
- Advanced AI recommendations (collaborative filtering, embeddings)
- Mobile Progressive Web App (PWA) with offline support
- Advanced analytics (funnel analysis, cohort tracking)
- Webhook support for third-party integrations

### 15.2 Growth Phase (Months 4-6)

- Payment gateway integration (Stripe, PayPal) as optional feature
- Affiliate and referral program
- Advanced seller tools (promoted listings, coupons)
- Multi-language support (i18n)
- Advanced search (Elasticsearch or Algolia)

### 15.3 Scale Phase (Months 7-12)

- Database migration from SQLite to PostgreSQL
- Microservices architecture for high-load components
- CDN integration for global asset delivery
- Real-time features with WebSockets
- Machine learning for fraud detection and content moderation

---

_Document Version: 1.0_  
_Project: REGIX Store — "Buy your need"_  
_Last Updated: 2026-07-23_
