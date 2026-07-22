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

### 1.4 Success Criteria (MVP)
- Buyers can browse, search, and create purchase tickets
- Sellers can list products, manage tickets, and approve downloads
- Admins can moderate products, users, and oversee platform health
- All user flows are functional end-to-end without critical bugs
- Platform handles concurrent users gracefully on Render infrastructure

---

## 2. Tech Stack Summary

### 2.1 Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19+ | UI library |
| Next.js | 16+ | Full-stack framework with App Router |
| Tailwind CSS | 4+ | Utility-first styling |
| shadcn/ui | latest | Accessible UI component primitives |
| Lucide React | latest | Consistent icon system |
| motion.dev | latest | Animations and transitions |
| react-masonry-css | latest | Masonry grid layouts |
| recharts | latest | Data visualization and analytics |
| fuse.js | latest | Client-side fuzzy search |
| nuqs | latest | URL query state synchronization |
| react-dropzone | latest | Drag-and-drop file uploads |

### 2.2 State & Forms
| Technology | Version | Purpose |
|------------|---------|---------|
| Jotai | latest | Atomic global state management |
| React Hook Form | latest | Performant form handling |
| Zod | 4+ | Runtime schema validation |

### 2.3 Backend & Database
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js Server Actions | 16+ | Server-side mutations |
| Prisma ORM | 7+ | Type-safe database operations |
| SQLite | latest | Local relational database |
| Better Auth | 1.6+ | Authentication and authorization |

### 2.4 Storage & Media
| Technology | Version | Purpose |
|------------|---------|---------|
| AWS SDK (S3) | latest | Cloud object storage |
| S3 Presigner | latest | Secure temporary upload/download URLs |
| sharp | latest | Image optimization and resizing |
| node-vibrant | latest | Color palette extraction from images |

### 2.5 Utilities
| Technology | Version | Purpose |
|------------|---------|---------|
| date-fns | latest | Date formatting and manipulation |
| pdf-lib | latest | PDF invoice and receipt generation |
| slugify | latest | SEO-friendly URL generation |
| p-limit | latest | Promise concurrency control |
| Sonner | latest | Toast notification system |

### 2.6 Infrastructure & Caching
| Technology | Version | Purpose |
|------------|---------|---------|
| Render | - | Application hosting platform |
| @upstash/redis | latest | Redis caching and rate limiting |
| Local SQLite | - | Primary database |
| Local / S3 | - | File storage |

### 2.7 Excluded Services
- No external email service (Resend, SendGrid, Nodemailer)
- No payment gateway (Stripe, PayPal)
- No external analytics (Google Analytics, Mixpanel)

---

## 3. Phase 1: Foundation (Weeks 1-4)

### 3.1 Week 1: Project Setup & Authentication

#### Day 1-2: Repository & Tooling Setup
- Initialize Next.js 16 project with App Router
- Configure Tailwind CSS 4 with custom theme tokens
- Set up shadcn/ui with base components (Button, Input, Card, Dialog, etc.)
- Configure ESLint, Prettier, and TypeScript strict mode
- Set up Git repository with branch protection rules
- Configure environment variable structure (.env.local template)

#### Day 3-4: Database & ORM Setup
- Initialize Prisma ORM with SQLite provider
- Design and implement core schema tables: User, Account, Session
- Set up Prisma Client singleton pattern
- Configure database migration workflow
- Seed database with initial admin account
- Set up Prisma Studio for local data inspection

#### Day 5-7: Authentication System (Better Auth)
- Configure Better Auth with SQLite adapter
- Implement email/password registration and login
- Implement OAuth providers (Google, GitHub)
- Set up role-based access control (RBAC) with five roles: buyer, business, seller, moderator, admin
- Implement session management with JWT and refresh tokens
- Build authentication UI components (login, register, forgot password forms)
- Implement protected route middleware
- Add logout and session cleanup

**Week 1 Deliverables:**
- Working authentication system with all five roles
- Database schema for users, sessions, and accounts
- Login, register, and OAuth callback pages
- Protected route infrastructure

---

### 3.2 Week 2: Core User Management & KYC

#### Day 8-9: User Profiles & Role Switching
- Build profile management pages for all roles
- Implement profile editing (name, bio, avatar)
- Build avatar upload using react-dropzone
- Create role-specific dashboard shells
- Implement role switching for users with multiple roles

#### Day 10-11: Seller KYC Flow
- Design KYC submission form (identity documents, business registration, tax info)
- Implement document upload via react-dropzone to S3
- Build KYC review queue for moderators/admins
- Implement KYC status tracking (Pending, Under Review, Verified, Rejected)
- Add KYC approval/rejection with feedback messaging
- Gate seller features behind KYC verification status

#### Day 12-14: Business Account Setup (B2B Foundation)
- Implement business registration flow
- Build company profile management
- Create team invitation system
- Implement basic team member listing
- Set up business-specific profile fields

**Week 2 Deliverables:**
- Complete user profile system
- Functional KYC flow for sellers
- Business account creation and team invites
- Moderator KYC review interface

---

### 3.3 Week 3: Product Catalog Foundation

#### Day 15-16: Product Data Model
- Design Prisma schema for products, categories, tags, and variants
- Implement category hierarchy (parent/child categories)
- Create tag management system
- Set up product status workflow (Draft, Pending Review, Published, Rejected, Archived)
- Build database seeders for categories and sample products

#### Day 17-18: Product Creation Flow
- Build product creation form with React Hook Form and Zod validation
- Implement rich text description editor
- Add product pricing fields (base price, sale price, currency)
- Build category and tag selection interfaces
- Implement auto-slug generation via slugify
- Create draft save functionality

#### Day 19-21: File Upload & Media Management
- Configure AWS S3 bucket and IAM credentials
- Implement presigned URL generation for secure uploads
- Build file upload component with react-dropzone
- Add file type and size validation
- Implement upload progress indicators
- Build cover image and gallery management
- Integrate sharp for image optimization (thumbnail generation)
- Integrate node-vibrant for product color palette extraction

**Week 3 Deliverables:**
- Complete product data model
- Product creation and editing flow
- S3 file upload with image optimization
- Product media gallery management

---

### 3.4 Week 4: Ticket System Core

#### Day 22-23: Cart & Wishlist
- Implement cart state management with Jotai
- Build add-to-cart functionality across product pages
- Create cart page with quantity management and item removal
- Implement cart persistence for authenticated users
- Build wishlist functionality (save for later)
- Add cart/wishlist count badges to navigation

#### Day 24-25: Ticket Creation Flow
- Design ticket intent form (quantity, license type, intended use, budget, custom message)
- Implement B2B-specific fields (company info, department, project details)
- Build attachment upload for supporting documents
- Create ticket preview and confirmation step
- Implement ticket creation server action with validation
- Build ticket detail view for buyers

#### Day 26-28: Ticket Management & Approval
- Create ticket status lifecycle (Pending, Under Review, Contacted, Negotiating, Approved, Rejected, Cancelled, Expired)
- Build seller ticket inbox with filtering
- Implement ticket approval and rejection workflows
- Create secure download link generation (presigned S3 URLs with expiry)
- Build buyer ticket dashboard with status tracking
- Implement download tracking and history
- Add basic ticket expiry logic (auto-close after inactivity)

**Week 4 Deliverables:**
- Functional cart and wishlist
- End-to-end ticket creation flow
- Seller ticket management dashboard
- Secure download delivery system
- Basic ticket lifecycle management

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

*Document Version: 1.0*  
*Project: REGIX Store — "Buy your need"*  
*Last Updated: 2026-07-23*
