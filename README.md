# REGIX Store

> **"Buy your need"** — A multi-vendor digital product marketplace with ticket-based purchasing.

A full-stack marketplace platform where buyers express interest in digital products through tickets, sellers review and negotiate, and upon approval, buyers receive secure download access. Built with Next.js 16, React 19, Prisma 7, and Better Auth.

---

## ✨ Key Features

### 🎫 Ticket-Based Purchasing
- No traditional payment gateway — buyers create intent tickets with requirements and budget
- Sellers review, negotiate, and approve tickets
- Secure download links generated upon approval
- In-ticket messaging for negotiation

### 👥 Multi-Role System
| Role | Description |
|------|-------------|
| **Buyer** | Browse products, create tickets, manage purchases |
| **Business** | Team accounts with approval workflows and department tagging |
| **Seller** | List products, manage tickets, KYC verification required |
| **Moderator** | Review products, KYC submissions, oversee transactions |
| **Admin** | Full platform management, user administration, configuration |

### 📦 Product Management
- Digital product listings with categories, tags, and variants
- Multiple license tiers and pricing
- Product media gallery (images, previews)
- Draft → Pending Review → Published workflow
- Featured products and view tracking

### 🛒 Cart & Wishlist
- Add products to cart with variant selection
- Persistent cart for authenticated users
- Wishlist for saving products

### 💬 In-Ticket Messaging
- Real-time chat within purchase tickets
- File attachments in messages
- Read status tracking
- Notification system

### 📊 Seller Dashboard
- Storefront management (banner, logo, bio)
- Product management and analytics
- Ticket inbox with filtering
- KYC verification status

### 🏢 B2B Features
- Business accounts with team management
- Department tagging for tickets
- Team member roles (Admin, Manager, Buyer)
- Purchase approval chains

### 📦 Subscription Boxes
- Curated product bundles (Basic, Pro, Enterprise tiers)
- Monthly/quarterly cycle ticket generation
- Box customization and item swapping
- Subscription management (pause, skip, cancel)

### ⭐ Reviews & Ratings
- Verified purchase reviews (ticket holders only)
- Star rating system
- Seller responses to reviews
- Helpfulness voting

### 🔧 Admin Panel
- User management with role assignment
- Product moderation queue
- KYC review interface
- Platform-wide ticket oversight
- Commission rule configuration
- Announcement banner system
- Feature flag management
- Activity log audit trail

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^19.2.4 | UI library (React Compiler enabled) |
| Next.js | ^16.2.1 | Full-stack framework, App Router |
| Tailwind CSS | ^4.2.2 | Utility-first styling (CSS-only config) |
| shadcn/ui | ^4.1.1 | Accessible UI components, Base Luma preset |
| @base-ui/react | ^1.3.0 | Primitive UI components |
| Lucide React | ^0.577.0 | Icon system |
| next-themes | ^0.4.6 | Dark mode (default: dark) |
| motion | ^12.42.2 | Animations and transitions |
| react-masonry-css | ^1.0.16 | Masonry grid layouts |
| recharts | ^3.10.0 | Data visualization |
| vaul | ^1.1.2 | Drawer/sheet component |

### State & Forms
| Technology | Version | Purpose |
|------------|---------|---------|
| React Hook Form | ^7.72.0 | Performant form handling |
| @hookform/resolvers | ^5.2.2 | Zod resolver integration |
| Zod | ^4.3.6 | Runtime schema validation |
| Jotai | ^2.20.2 | Atomic global state management |
| nuqs | ^2.9.1 | URL query state synchronization |

### Backend & Database
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js Server Actions | 16+ | Server-side mutations |
| Prisma ORM | ^7.5.0 | Type-safe database operations |
| @prisma/adapter-libsql | ^7.5.0 | LibSQL adapter (SQLite) |
| SQLite | — | Local relational database |
| Better Auth | ^1.5.6 | Authentication, RBAC, session management |

### Utilities
| Technology | Version | Purpose |
|------------|---------|---------|
| fuse.js | ^7.5.0 | Client-side fuzzy search |
| date-fns | ^4.4.0 | Date formatting |
| slugify | ^1.6.9 | SEO-friendly URL generation |
| sharp | ^0.34.5 | Image optimization |
| pdf-lib | ^1.17.1 | PDF invoice generation |
| sonner | ^2.0.7 | Toast notifications |
| react-dropzone | ^19.1.1 | File uploads |
| p-limit | ^7.3.1 | Promise concurrency control |
| clsx | ^2.1.1 | Conditional classNames |
| tailwind-merge | ^3.5.0 | Tailwind class merging |
| class-variance-authority | ^0.7.1 | Component variants |

### Dev Tooling
| Technology | Version | Purpose |
|------------|---------|---------|
| TypeScript | ^5.9.3 | Type checking (strict mode) |
| ESLint | ^10.1.0 | Linting |
| Prettier | ^3.8.1 | Code formatting |
| Prisma CLI | ^7.5.0 | Schema management, migrations |
| bun | — | Package manager & script runner |
| shadcn CLI | ^4.1.1 | Component addition |

---

## 📁 Project Structure

```
regix-store/
├── prisma/
│   ├── schema.prisma          # Database schema (30+ models)
│   ├── dev.db                 # SQLite database file
│   ├── seed.ts                # Database seeder
│   └── migrations/            # Database migrations
├── src/
│   ├── app/
│   │   ├── globals.css        # Tailwind v4 + shadcn theme
│   │   ├── layout.tsx         # Root layout with auth session
│   │   ├── page.tsx           # Home page (hero, categories, featured)
│   │   ├── (auth)/            # Auth pages (login, register)
│   │   ├── (dashboard)/       # Role-based dashboard layout
│   │   ├── api/auth/[...all]/ # Better Auth API handler
│   │   ├── categories/        # Category browsing
│   │   ├── products/          # Product listing and detail
│   │   ├── profile/           # User profile
│   │   └── seller/            # Seller dashboard
│   ├── components/
│   │   ├── shadcnui/          # shadcn/ui primitives
│   │   ├── Form/              # Form components
│   │   ├── Header/            # Navigation header
│   │   ├── Providers/         # Theme and auth providers
│   │   └── shared/            # Shared UI components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/
│   │   ├── auth.ts            # Better Auth server config
│   │   ├── auth-client.ts     # Better Auth client config
│   │   ├── database/dbClient.ts  # PrismaClient singleton
│   │   ├── env/               # T3 env validation
│   │   ├── schemas/           # Zod schemas (auth, product, ticket, etc.)
│   │   ├── types/             # Shared TypeScript types
│   │   ├── permissions.ts     # Role hierarchy and helpers
│   │   ├── fonts.ts           # Font configuration
│   │   └── utils.ts           # Utility functions
│   ├── proxy.ts               # Middleware (route protection)
│   ├── server/
│   │   └── actions/           # Server actions (auth, product, ticket, profile)
│   └── store/
│       └── index.ts           # Jotai atoms (user, theme, cart, wishlist)
├── .env                       # Environment variables
├── next.config.ts             # Next.js configuration
├── prisma.config.ts           # Prisma configuration
├── components.json            # shadcn/ui configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 22.x.x
- **npm** >= 11.x.x (or **bun** — recommended)
- **Git**

### Installation

```bash
# Clone the repository
git clone https://github.com/official-jahid/regix-store.git
cd regix-store

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
bun migrate

# Seed the database (creates admin user and categories)
bun prisma db seed

# Start development server
bun dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLite database path (e.g., `file:./dev.db`) |
| `BETTER_AUTH_SECRET` | Better Auth secret key |
| `BETTER_AUTH_URL` | Application URL (e.g., `http://localhost:3000`) |
| `ADMIN_EMAIL` | Admin account email for seeding |
| `ADMIN_USERNAME` | Admin account username |
| `ADMIN_PASSWORD` | Admin account password |

---

## 📜 Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `bun dev` | `next dev` | Start development server |
| `bun build` | `prisma generate && next build` | Build for production |
| `bun start` | `next start` | Start production server |
| `bun lint` | `next typegen && tsc --noEmit && eslint` | Type-check + lint |
| `bun prod` | `prisma generate && eslint && next build && next start` | Full production check |
| `bun migrate` | `prisma migrate deploy` | Apply migrations |
| `bun migrate:dev` | `prisma migrate dev` | Create and apply migrations |
| `bun studio` | `prisma studio --browser none` | Open Prisma Studio |
| `bun db:push` | `prisma db push` | Push schema to database |

---

## 🗄️ Database Schema

The database contains **30+ models** organized into domains:

### Auth & Users
- `User` — Core user account with role (buyer/business/seller/moderator/admin)
- `Session` — Active auth sessions
- `Account` — OAuth account linking
- `Verification` — Email verification tokens

### Profiles
- `Profile` — Extended user profile (bio, website, location, social links)
- `SellerProfile` — Seller store details (store name, slug, KYC status)
- `KYCSubmission` — Seller verification documents
- `BusinessProfile` — B2B company details
- `TeamMember` — Business team associations

### Products
- `Category` — Hierarchical product categories
- `Tag` — Product tags
- `Product` — Core product listing
- `ProductVariant` — License tiers and formats
- `ProductMedia` — Images and previews
- `ProductTag` — Product-tag associations
- `ProductView` — View tracking for analytics

### Tickets & Purchases
- `CartItem` — Shopping cart items
- `WishlistItem` — Saved products
- `Ticket` — Purchase intent tickets
- `TicketItem` — Products within a ticket
- `TicketMessage` — In-ticket chat messages
- `TicketStatusHistory` — Status change audit log
- `DownloadLog` — Download tracking

### Reviews
- `Review` — Product reviews (verified purchases only)
- `ReviewResponse` — Seller responses to reviews

### Subscriptions
- `SubscriptionBox` — Curated product bundles
- `BoxItem` — Products in a box
- `UserSubscription` — User subscriptions
- `SubscriptionTicket` — Generated tickets per cycle

### Admin & Platform
- `Notification` — In-app notifications
- `CommissionRule` — Platform fee configuration
- `Announcement` — Platform banners
- `FeatureFlag` — Toggleable features
- `ActivityLog` — Platform audit trail

---

## 🔒 Authentication & Authorization

### Better Auth Configuration
- Email/password authentication
- Session management with JWT and refresh tokens
- `nextCookies()` plugin for Next.js integration
- Prisma adapter with SQLite

### Role Hierarchy
```
buyer (0) → business (1) → seller (2) → moderator (3) → admin (4)
```

### Route Protection
- Middleware (`src/proxy.ts`) protects all routes except public whitelist
- Public routes: `/`, `/login`, `/register`, `/products`, `/categories`, `/sellers`, `/api/auth`
- Unauthenticated users redirected to `/login` with redirect parameter
- Role-based access in dashboard layout

---

## 🎨 Styling Conventions

- **Tailwind CSS v4** — CSS-only configuration via `@theme` in `globals.css`
- **No `tailwind.config.ts`** — All theme tokens in CSS
- **PostCSS** — `@tailwindcss/postcss` plugin
- **shadcn/ui** — Base Luma preset, components in `src/components/shadcnui/`
- **Base UI** — All primitives from `@base-ui/react` (not Radix)
- **Prettier** — `singleAttributePerLine: true`, `bracketSameLine: true`, `experimentalTernaries: true`
- **Dark mode** — Default dark, system sync disabled

---

## 📝 Form Patterns

All forms follow a consistent pattern:
1. Zod schema in `src/lib/schemas/` (export schema + inferred type)
2. `"use client"` component with `react-hook-form` + `@hookform/resolvers/zod`
3. Each field rendered through `Controller` with shadcn `Field`, `FieldLabel`, `Input`, `FieldError`
4. Submit via server action with toast feedback

---

## 🧠 State Management

- **Jotai** — Atomic state for user, theme, cart, wishlist, notifications
- **Derived atoms** — Computed values (e.g., `isSellerAtom`, `isAdminAtom`)
- **Server Components** — Direct Prisma queries for initial data
- **URL state** — `nuqs` for shareable filter/search state

---

## 📄 License

MIT — see [LICENSE](LICENSE)

## 👤 Author

**Jahid Ekbal Mallick**

- GitHub: [@official-jahid](https://github.com/official-jahid)

---

## 🏗️ Project Status

**Stage:** MVP — Foundation complete, active development ongoing.

### ✅ Completed
- Project scaffolding and tooling
- Database schema (30+ models) and migrations
- Authentication (email/password) with Better Auth
- Auth UI (login, register)
- Role-based access control
- Route protection middleware
- Server actions (auth, product, ticket, profile)
- Zod schemas and shared types
- Jotai state management
- Home page with hero, categories, featured products
- Dashboard layout with role-based sidebar
- shadcn/ui component library

### 🚧 In Progress
- User profiles and KYC flow
- Product catalog pages
- Ticket system UI
- Seller dashboard
- Search and discovery
- Admin panel
- B2B features
- Subscription boxes
- PDF invoices
- Deployment configuration