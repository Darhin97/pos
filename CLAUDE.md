# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Point of Sale (POS) system built with Next.js 16, React 19, TypeScript, and Tailwind CSS. The system uses shadcn/ui components styled with the "new-york" variant. Currently implemented as a frontend-only prototype with mock data, but designed to support a multi-tenant architecture.

## IMPORTANT: Required Reading

**Before writing any code, you MUST read `plan/command.md` to understand the architectural context and non-negotiable design principles.** This file contains critical requirements for:

- Multi-tenancy design (tenant_id + RLS)
- Offline-first POS requirements
- Inventory management patterns (append-only, no locking)
- Security model and data isolation
- Anti-patterns to avoid

Failure to follow these principles will result in code that doesn't align with the production architecture goals.

## Key Commands

### Development

```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Project Architecture

### Directory Structure

- `src/app/` - Next.js App Router pages and layouts
  - `login/` & `signup/` - Authentication pages
  - `dashboard/` - Main POS interface with nested routes (overview, orders, products, etc.)
- `src/components/` - React components organized by feature
  - `ui/` - shadcn/ui base components (button, input, label)
  - `shared/` - Reusable components (Icon, Logo, InputField)
  - `auth/` - Authentication components
  - `dashboard/` - Dashboard-specific components (Sidebar, Cart, ProductCard, etc.)
- `src/lib/` - Shared utilities, types, and mock data
  - `types.ts` - TypeScript interfaces (Product, CartItem)
  - `data.ts` - Mock product and cart data
  - `utils.ts` - Utility functions (cn for classnames)

### Component Architecture

**Dashboard Layout Pattern**: The dashboard uses a fixed three-column layout:

1. Left sidebar (`Sidebar.tsx`) - Navigation with categorized menu items (Main Menu, Inventory, Report, Settings)
2. Center content area - Dynamic page content from `dashboard/[page]/page.tsx`
3. Right sidebar (`Cart.tsx`) - Shopping cart displayed on all dashboard pages

The `dashboard/layout.tsx` orchestrates navigation by:

- Extracting the active page from the URL pathname
- Managing page transitions via Next.js router
- Maintaining fixed sidebar and cart positions while content changes

**Client-Side Navigation**: All dashboard components are client components (`"use client"`) using Next.js navigation hooks. Page state is derived from URL, not local state.

### Icon System

Uses lucide-react with a wrapper component (`Icon.tsx`) that accepts icon names as strings. To add a new icon, use any lucide-react icon name (e.g., "PieChart", "ShoppingCart", "Users").

### Styling

- Tailwind CSS 4 with PostCSS integration
- Path alias `@/*` maps to `src/*`
- shadcn/ui components configured with:
  - Style: "new-york"
  - Base color: neutral
  - CSS variables enabled
  - RSC (React Server Components) support

### Type Safety

The project uses TypeScript 5 in strict mode. Key interfaces:

- `Product` - Store items with variants (sizes, colors)
- `CartItem` - Selected products with quantity and chosen variant

## Future Architecture (from plan/command.md)

The system is designed to evolve into a production multi-tenant POS with:

- Multi-tenancy via Postgres with tenant_id + Row Level Security (RLS)
- Tenant → Store → Register hierarchy
- Offline-first POS with eventual consistency and sync
- Append-only inventory movements (no locking)
- JWT-based auth with tenant-scoped access
- Subdomain/custom domain per tenant/store

When implementing backend features, follow the modular monolith pattern and prioritize:

1. Offline-first capabilities
2. Eventual consistency over blocking operations
3. Database-level security (RLS) over application logic
4. Append-only event patterns for inventory

## Development Notes

- Authentication is currently UI-only (no backend validation)
- Product data is mocked in `src/lib/data.ts`
- All dashboard pages are placeholder implementations using `SimplePage.tsx`
- The cart functionality is UI-only (no persistence or checkout flow)
- Images are loaded from Unsplash and Supabase CDN (placeholder assets)

## Core principles (non-negotiable)

- Before boxes and arrows, these principles drive everything:
- Multi-tenant by design
- Every request is tenant-scoped
- No “shared admin DB hacks”
- Store ≠ Register
- One store can have many registers (iPads, PCs)
- Offline-first POS
- Sales must work even if internet dies
- Eventually consistent, never blocking
- Inventory syncs, not locks
- Security via isolation, not hope
- RLS + scoped JWTs
