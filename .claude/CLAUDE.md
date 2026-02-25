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
  - `ui/` - shadcn/ui base components (button, input, label, select, switch)
  - `shared/` - Reusable components (Icon, Logo, InputField)
  - `auth/` - Authentication components
  - `dashboard/` - Dashboard-specific components (Sidebar, Cart, ProductCard, etc.)
- `src/contexts/` - React contexts for global state
  - `ShiftContext.tsx` - Register shift management (open/close register, shift status)
- `src/lib/` - Shared utilities, types, and mock data
  - `types.ts` - TypeScript interfaces (Product, CartItem)
  - `data.ts` - Mock product and cart data
  - `utils.ts` - Utility functions (cn for classnames)

### Component Architecture

**Dashboard Layout Pattern**: The dashboard uses a flexible layout system:

1. **Three-column layout** (Orders page):
   - Left sidebar (`Sidebar.tsx`) - Navigation with categorized menu items
   - Center content area - Product grid with categories and search
   - Right sidebar (`Cart.tsx`) - Shopping cart with checkout actions

2. **Full-width layout** (Products, Register, etc.):
   - Left sidebar only
   - Full-width content area for tables, forms, and detailed views

The `dashboard/layout.tsx` orchestrates navigation by:

- Extracting the active page from the URL pathname
- Managing page transitions via Next.js router
- Maintaining fixed sidebar position while content changes
- Conditionally rendering cart sidebar based on route

**Client-Side Navigation**: All dashboard components are client components (`"use client"`) using Next.js navigation hooks. Page state is derived from URL, not local state.

**State Management**:

- `ShiftContext` - Tracks register open/close state, enforces shift-based access control
- `CartContext` - Manages shopping cart items with localStorage persistence
- URL-based routing for page navigation

### Icon System

Uses lucide-react with a wrapper component (`Icon.tsx`) that accepts icon names as strings. To add a new icon, use any lucide-react icon name (e.g., "PieChart", "ShoppingCart", "Users").

### Key Features Implemented

**Products Page** (`dashboard/products/page.tsx`):

- Comprehensive filter system with:
  - Search by name, SKU, handle, or supplier code
  - Category dropdown filter
  - Tags input
  - Supplier dropdown
  - Brand dropdown
  - Status filter (Active/Inactive/All)
  - Purchase order number search
- Data table with:
  - Checkbox selection (individual and bulk)
  - Product thumbnails with name and SKU
  - Brand and supplier columns
  - Stock availability display (including infinity symbol for unlimited stock)
  - Retail price in GH₵
  - Active/inactive toggle switches
  - Created date
  - Edit action buttons
  - Sortable columns
  - Hover effects and expandable row indicators
- Export functionality
- Import and "Add product" action buttons
- Uses violet/purple (#7c3aed) as primary action color

**Register Management** (`dashboard/register/page.tsx`):

- Open/close register flow with modals
- Shift tracking with financial summaries
- Opening float and closing cash management
- Transaction counting
- Shift status display with live indicators
- Integration with ShiftContext for access control

**Orders/POS Interface** (`dashboard/orders/page.tsx`):

- Product grid with category filtering
- Real-time cart updates
- Shift-based access control (redirects if shift not open)
- Integration with payment flow

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

- `Product` - Store items with variants (sizes, colors), plus additional fields for inventory management (sku, brand, supplier, stock, active status, createdAt, variants count)
- `CartItem` - Selected products with quantity and chosen variant
- `RegisterShift` - Register shift data (opening/closing times, cash floats, sales totals)
- `ShiftSummary` - Summary of shift financial data
- `Customer` - Customer information
- `Quote` - Sales quote/estimate data

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
- Product data is mocked in `src/lib/data.ts` with 8 sample products
- Implemented pages:
  - **Orders** (`dashboard/orders/`) - POS interface with product grid and cart
  - **Products** (`dashboard/products/`) - Full product management with filters, search, and table view
  - **Register** (`dashboard/register/`) - Register shift management (open/close register)
  - **Payment Flow** - Complete checkout with payment method selection
  - **Quotes** (`dashboard/orders/quotes/`) - Quote management system
- Placeholder pages: Overview, Reporting, Categories, Users, Bank, Transactions, Promos
- The cart functionality uses React Context (CartContext) with localStorage persistence
- Register shifts managed via ShiftContext with shift state tracking
- Images are loaded from Pixabay CDN (placeholder assets)

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
