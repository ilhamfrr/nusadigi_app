# Nusadigi — White Label SaaS Platform

> Production-ready multi-tenant SaaS platform with subdomain isolation, white-label branding, Stripe billing, and strict RBAC.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | TailwindCSS v4 + DaisyUI v5 |
| Animations | Framer Motion |
| Database | PostgreSQL |
| ORM | Prisma v7 |
| Auth | NextAuth v5 (beta) |
| Billing | Stripe |
| Icons | Lucide React |

## Project Structure

```
src/
├── app/
│   ├── page.tsx                   # Marketing landing page
│   ├── login/page.tsx             # Login
│   ├── register/page.tsx          # Register
│   ├── dashboard/
│   │   ├── layout.tsx             # Protected dashboard shell
│   │   ├── page.tsx               # Role-based redirect
│   │   ├── admin/page.tsx         # Super Admin dashboard
│   │   └── tenant/
│   │       ├── page.tsx           # Tenant dashboard
│   │       └── branding/page.tsx  # Branding settings
│   └── api/
│       ├── auth/[...nextauth]/    # NextAuth handler
│       ├── auth/register/         # Registration endpoint
│       ├── stripe/webhook/        # Stripe webhook
│       ├── stripe/checkout/       # Checkout session
│       └── tenants/               # Tenant management
├── components/
│   ├── marketing/                 # Navbar, Hero, Features, Pricing, Footer
│   └── dashboard/                 # Sidebar, Topbar, BrandingForm
└── lib/
    ├── db.ts                      # Prisma client singleton
    ├── auth.ts                    # NextAuth config
    ├── rbac.ts                    # Permission matrix & guards
    ├── stripe.ts                  # Stripe client & helpers
    ├── tenant.ts                  # Tenant resolver
    ├── utils.ts                   # Shared utilities
    └── services/
        ├── tenant.service.ts
        ├── subscription.service.ts
        └── user.service.ts
```

## Quick Start

### 1. Setup environment

```bash
cp .env.example .env
# Fill in: DATABASE_URL, NEXTAUTH_SECRET, GOOGLE_*, STRIPE_*
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup database

```bash
# Create DB schema
npm run db:migrate

# Seed with super admin + plans + demo tenant
npm run db:seed
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Default Credentials (after seed)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@nusadigi.id | admin123! |
| Tenant Admin | admin@demo.com | tenant123! |

> ⚠️ Change these in production!

## Multi-Tenant Architecture

Tenants are isolated by subdomain:
- `acme.nusadigi.id` → Acme tenant
- `demo.nusadigi.id` → Demo tenant

The middleware (`src/middleware.ts`) detects the subdomain and injects `x-tenant-subdomain` header for downstream use.

## Roles & Permissions

| Permission | Super Admin | Tenant Admin | Tenant Staff |
|-----------|-------------|--------------|--------------|
| Manage Tenants | ✅ | ❌ | ❌ |
| Manage Users | ✅ | ✅ | ❌ |
| Manage Branding | ✅ | ✅ | ❌ |
| View Dashboard | ✅ | ✅ | ✅ |
| Manage Subscriptions | ✅ | ✅ | ❌ |

## Deployment

### Vercel

1. Connect the GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Add wildcard domain: `*.nusadigi.id`
4. Deploy — `vercel.json` handles subdomain routing

### Database migrations in production

```bash
npm run db:migrate:prod
```

## Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Production build
npm run db:migrate       # Run Prisma migrations
npm run db:migrate:prod  # Deploy migrations (production)
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio
npm run typecheck        # TypeScript type checking
```
