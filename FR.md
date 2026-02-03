# Frontend Architecture Snapshot

**Project:** madar_initiation  
**Generated:** 2026-02-01  
**Framework:** Next.js 16.0.3 (App Router)  
**Reviewer:** Senior Frontend Engineer  

---

## 1. Project Metadata

| Property | Value |
|----------|-------|
| **Project Name** | madar_initiation |
| **Framework** | Next.js 16.0.3 |
| **React Version** | 19.2.0 |
| **TypeScript Version** | 5.9.3 |
| **Routing System** | Next.js App Router with Route Groups |
| **State Management** | Zustand 5.0.8 + React Context |
| **Styling** | Tailwind CSS 4 + tw-animate-css |
| **UI Component Library** | Radix UI Primitives + Custom Components |
| **Package Manager** | npm (implied from package-lock.json) |

**Key Dependencies Summary:**
- **UI Components:** @radix-ui/* (dialog, select, popover, tooltip, accordion, carousel, sheet, etc.)
- **Styling Utilities:** clsx, tailwind-merge, class-variance-authority, tw-animate-css
- **State:** zustand, next-themes
- **Data Fetching:** Native fetch with custom wrappers
- **Carousel:** embla-carousel-react, swiper
- **Forms/Command:** cmdk, sonner (toast)

---

## 2. Full Directory Tree (Annotated)

```
frontend/
├── .env                                    # Environment variables (NEXT_PUBLIC_API_BASE)
├── .gitignore                              # Standard gitignore configuration
├── components.json                          # shadcn/ui configuration
├── eslint.config.mjs                        # ESLint configuration (Flat config)
├── middleware.ts                           # Next.js middleware for auth protection
├── next.config.ts                          # Next.js configuration with webpack customizations
├── package.json / package-lock.json        # Dependencies and lockfile
├── postcss.config.mjs                      # PostCSS with Tailwind plugin
├── tsconfig.json                          # TypeScript configuration with path aliases
├── README.md                              # Default Next.js README
└── src/                                   # Source code root
    ├── app/                               # App Router structure
    │   ├── favicon.ico
    │   ├── globals.css                    # Global styles + Tailwind imports
    │   ├── layout.tsx                    # Root layout (providers wrapper)
    │   ├── (auth)/                      # Route group: Authentication pages
    │   │   ├── layout.tsx              # Auth-specific layout (omitted: no navbar/footer)
    │   │   ├── login/page.tsx           # Login page
    │   │   └── signup/page.tsx          # Signup page
    │   ├── (main)/                     # Route group: Main application pages
    │   │   ├── layout.tsx             # Main layout (Header + Footer + providers)
    │   │   ├── page.tsx               # Redirect to /home
    │   │   ├── home/page.tsx          # Home screen
    │   │   ├── cart/page.tsx          # Shopping cart
    │   │   ├── orders/page.tsx        # User orders
    │   │   └── profile/page.tsx       # User profile
    │   └── admin/                     # Admin panel routes
    │       └── (panel)/              # Admin route group
    │           ├── layout.tsx.tsx     # Admin layout (TSX extension typo: .tsx.tsx)
    │           └── page.tsx           # Admin dashboard
    │
    ├── components/                    # UI Components organized by feature
    │   ├── Admin/                     # Admin-specific components
    │   │   ├── Admin_Sidebar.tsx      # Admin navigation sidebar
    │   │   ├── UsersManager.tsx       # User management component
    │   │   └── cat-subcat-manager/   # Category/Subcategory management
    │   │       └── CatSubCatManager.tsx
    │   ├── Footer_comp/               # Footer components
    │   │   ├── footer.tsx            # Main footer
    │   │   └── NavItem.tsx           # Footer nav item
    │   ├── Header_comp/              # Header components
    │   │   └── header.tsx           # Main header with navigation
    │   ├── HomeScreen_comp/          # Home screen components
    │   │   ├── BannerCarousel.tsx    # Banner slider
    │   │   ├── CountdownAd.tsx       # Countdown advertisement
    │   │   ├── SearchBar.tsx        # Search component
    │   │   ├── WatchAd.tsx          # Watch advertisement
    │   │   ├── Categories_comp/     # Category display
    │   │   │   ├── Categories.tsx    # Categories grid
    │   │   │   └── CategoryItem.tsx  # Individual category
    │   │   └── SpecialProducts_comp/ # Featured products
    │   │       ├── ProductCard.tsx
    │   │       ├── ProductData.ts    # Mock data (smell)
    │   │       ├── SpecialProducts.tsx
    │   │       └── ViewAllCard.tsx
    │   ├── Login_comp/               # Login/auth components
    │   │   ├── LoginFooterOTP.tsx
    │   │   ├── LoginFooterPhone.tsx
    │   │   ├── LoginHeader.tsx
    │   │   ├── StageOTP.tsx
    │   │   ├── StagePhone.tsx
    │   │   ├── hooks/               # Login-specific hooks
    │   │   │   ├── useLoginStages.ts
    │   │   │   └── useOTPCountdown.ts
    │   │   └── utils/
    │   │       └── formatTime.ts
    │   ├── Screens_comp/             # Page wrapper components
    │   │   ├── cart_screen.tsx
    │   │   ├── home_screen.tsx
    │   │   ├── orders_screen.tsx
    │   │   └── profile_screen.tsx
    │   ├── ShoppingCartScreen_comp/ # Cart and product listing
    │   │   ├── CustomSpinner.tsx
    │   │   ├── ScrollCategories.tsx
    │   │   ├── SubCategories.tsx
    │   │   ├── ProductList_comp/     # Product listing
    │   │   │   ├── ProduceList.tsx
    │   │   │   ├── ProduceListGrid.tsx
    │   │   │   ├── ProduceListHeader.tsx
    │   │   │   ├── ProductListCard_comp/
    │   │   │   │   ├── CartButton.tsx
    │   │   │   │   ├── DiscountBadge.tsx
    │   │   │   │   ├── ProduceListCard.tsx
    │   │   │   │   ├── SponsorPrice.tsx
    │   │   │   └── ProductSheet_comp/
    │   │   │       ├── ProductSheet.tsx
    │   │   │       ├── ProductSheetAttributes.tsx
    │   │   │       ├── ProductSheetCard.tsx
    │   │   │       ├── ProductSheetFooter.tsx
    │   │   │       ├── ProductSheetHeader.tsx
    │   │   │       ├── ProductSheetPriceBox.tsx
    │   │   │       └── sheetData.ts
    │   │   └── ... (additional cart components)
    │   └── ui/                        # Shared UI primitives (shadcn-like)
    │       ├── accordion.tsx
    │       ├── aspect-ratio.tsx
    │       ├── avatar.tsx
    │       ├── badge.tsx
    │       ├── button.tsx
    │       ├── carousel.tsx
    │       ├── dialog.tsx
    │       ├── input.tsx
    │       ├── select.tsx
    │       ├── sheet.tsx
    │       ├── sidebar.tsx
    │       ├── skeleton.tsx
    │       ├── spinner.tsx
    │       ├── table.tsx
    │       ├── tooltip.tsx
    │       └── ... (20+ more UI components)
    │
    ├── context/                       # React Context providers
    │   └── AuthContext.tsx            # Authentication context (duplicates store logic?)
    │
    ├── features/                      # Feature-based architecture folder
    │   └── auth/                     # Auth feature module
    │       ├── index.ts
    │       ├── types.ts
    │       └── hooks/               # Feature-specific hooks
    │           ├── useLogin.ts
    │           ├── useLogout.ts
    │           ├── UseMe.ts
    │           └── useSignup.ts
    │
    ├── hooks/                        # Shared hooks
    │   ├── checkLoginState.ts
    │   └── use-mobile.ts
    │
    ├── lib/                          # Utilities and API layer
    │   ├── api-error.ts              # Error handling
    │   ├── utils.ts                  # ClassName utilities (cn)
    │   └── api/                      # API client layer
    │       ├── auth.ts
    │       ├── categories.ts
    │       ├── fetcher.ts             # Base fetcher with error handling
    │       ├── products.ts
    │       └── subcategories.ts
    │
    ├── schemas/                      # Zod validation schemas
    │   ├── auth.schema.ts
    │   ├── category.schema.ts
    │   ├── product.schema.ts
    │   └── subCategory.schema.ts
    │
    ├── services/                     # Service layer (API calls)
    │   ├── auth.service.ts
    │   ├── categories.service.ts
    │   ├── http-clients.ts           # HTTP client configuration
    │   ├── orders.service.ts
    │   ├── products.service.ts
    │   └── subCategories.service.ts
    │
    └── stores/                       # Zustand stores
        ├── auth.store.ts             # Auth state management
        └── cart.store.ts.ts          # Cart state management
```

---

## 3. Routing & Layout Model

### Route Groups Structure

The application uses Next.js App Router with three distinct route groups, each with independent layouts:

```
app/
├── (auth)/           # Authentication routes (no header/footer)
│   ├── login/
│   └── signup/
│
├── (main)/           # Main consumer-facing routes (with header/footer)
│   ├── home/
│   ├── cart/
│   ├── orders/
│   └── profile/
│
└── admin/            # Admin panel (protected)
    └── (panel)/
```

**Layout Inheritance Pattern:**

1. **Root Layout** (`app/layout.tsx`): Wraps all routes, typically contains global providers (ThemeProvider, AuthProvider)
2. **Route Group Layouts**: Each `(group)` has its own `layout.tsx` that defines the UI shell for that section
3. **Page Components**: Leaf `page.tsx` files render route-specific content

**Key Observation:** The admin route group uses a filename with duplicate extension (`layout.tsx.tsx`) which is likely a typo that needs correction.

### Protected Routes & Middleware

**Middleware Configuration** (`middleware.ts`):
```typescript
export function middleware(req: NextRequest) {
    const refreshToken = req.cookies.get("refreshToken")?.value;
    const protectedPaths = ["/admin"];
    const isProtected = protectedPaths.some((p) =>
        req.nextUrl.pathname.startsWith(p)
    );
    if (isProtected && !refreshToken) {
        return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
}
```

**Protection Mechanism:**
- Only checks for `refreshToken` cookie existence
- Does NOT validate token signature or expiration
- Does NOT check user roles/permissions
- Redirects unauthenticated users to `/` (root)

**Security Gaps Identified:**
1. Token validation is missing - only checks presence
2. No role-based access control (RBAC) enforcement
3. Access token not checked (only refresh token)
4. Token expiration not validated server-side
5. No token refresh mechanism in middleware

---

## 4. State Management

### Zustand Stores

| Store | Location | State Owned | Dependencies | Scope |
|-------|----------|-------------|--------------|-------|
| **auth.store.ts** | `src/stores/auth.store.ts` | user, isAuthenticated, login, logout, signup | API services, AuthContext | Global |
| **cart.store.ts.ts** | `src/stores/cart.store.ts.ts` | cartItems, addToCart, removeFromCart, updateQuantity | Products API | Global |

**Auth Store Structure (inferred):**
```typescript
// Likely contains:
- user: User | null
- isAuthenticated: boolean
- login(credentials): Promise<void>
- logout(): Promise<void>
- signup(data): Promise<void>
- checkAuth(): Promise<void>
```

**Cart Store Structure (inferred):**
```typescript
// Likely contains:
- items: CartItem[]
- addToCart(product, quantity)
- removeFromCart(productId)
- updateQuantity(productId, quantity)
- clearCart()
- total: number
```

### React Context Usage

| Context | Location | Purpose | Duplicate with Store? |
|---------|----------|---------|---------------------|
| **AuthContext** | `src/context/AuthContext.tsx` | Provide auth state to components | Yes - overlaps with auth.store.ts |

**Architectural Issue:** `AuthContext` and `auth.store.ts` appear to manage the same state, creating confusion and potential synchronization issues. One should be eliminated.

---

## 5. Data Fetching & API Layer

### API Layer Architecture

```
lib/api/                    # Low-level fetch wrappers
├── fetcher.ts             # Base fetcher with error handling
├── auth.ts               # Auth-specific endpoints
├── categories.ts
├── products.ts
└── subcategories.ts

services/                  # Service layer (business logic)
├── auth.service.ts
├── categories.service.ts
├── products.service.ts
├── subCategories.service.ts
└── orders.service.ts
```

**Fetcher Implementation Pattern** (`lib/api/fetcher.ts`):
- Likely wraps native `fetch` with base URL from `NEXT_PUBLIC_API_BASE`
- Implements error handling via `ApiError` class
- Handles response parsing and error transformation

**Service Layer Pattern**:
- Services import from `lib/api/*` fetchers
- Add business logic (transformation, aggregation)
- Return typed responses

### API Endpoint Mapping

| Domain | Service | Key Methods |
|--------|---------|------------|
| **Auth** | `auth.service.ts` | login, signup, logout, me |
| **Products** | `products.service.ts` | list, getById, create, update, delete |
| **Categories** | `categories.service.ts` | list, getById, create, update, delete |
| **SubCategories** | `subCategories.service.ts` | list, getById, create, update, delete, byCategory |
| **Orders** | `orders.service.ts` | list, getById, create |

### Issues Identified

1. **Path Alias Overlap**: `tsconfig.json` defines both `@/src/*` and `@services/*` etc., creating unclear import conventions
2. **Service/API Duplication**: Both `services/` and `lib/api/` contain similar functionality
3. **No API Abstraction Layer**: Direct HTTP calls scattered across services
4. **Missing Request/Response Types**: Type safety may be incomplete

---

## 6. Hooks

### Custom Hooks Inventory

| Hook | Location | Responsibility | Issues |
|------|----------|----------------|--------|
| `useLogin` | `features/auth/hooks/useLogin.ts` | Login logic | None identified |
| `useLogout` | `features/auth/hooks/useLogout.ts` | Logout logic | None identified |
| `UseMe` | `features/auth/hooks/UseMe.ts` | Get current user | Capitalization inconsistent |
| `useSignup` | `features/auth/hooks/useSignup.ts` | Signup logic | None identified |
| `useLoginStages` | `components/Login_comp/hooks/useLoginStages.ts` | Multi-stage login state | Mixed concerns (state + logic) |
| `useOTPCountdown` | `components/Login_comp/hooks/useOTPCountdown.ts` | OTP timer logic | None identified |
| `checkLoginState` | `hooks/checkLoginState.ts` | Check auth state | May duplicate store logic |
| `useMobile` | `hooks/use-mobile.ts` | Mobile detection | None identified |

### Hook Analysis

**Single Responsibility Violations:**

1. **`useLoginStages.ts`**: Manages both OTP countdown state AND stage transitions. Should be split into:
   - `useLoginStage` (state management)
   - `useOTPCountdown` (already exists, imported but not used)

2. **`UseMe.ts`**: Filename capitalization inconsistency with convention

**Recommendations:**
- Standardize hook naming (PascalCase for files)
- Split hooks with mixed responsibilities
- Eliminate duplicates between `features/hooks/` and `hooks/`

---

## 7. UI Components

### Component Categorization

#### Reusable / Shared (UI Primitives)

| Component | Path | Role |
|-----------|------|------|
| Button | `components/ui/button.tsx` | Base button with variants |
| Input | `components/ui/input.tsx` | Form input |
| Dialog | `components/ui/dialog.tsx` | Modal dialog |
| Sheet | `components/ui/sheet.tsx` | Slide-out panel |
| Select | `components/ui/select.tsx` | Dropdown select |
| Carousel | `components/ui/carousel.tsx` | Image carousel |
| Table | `components/ui/table.tsx` | Data table |
| Badge | `components/ui/badge.tsx` | Status indicator |
| Spinner | `components/ui/spinner.tsx` | Loading indicator |
| Skeleton | `components/ui/skeleton.tsx` | Loading placeholder |
| Accordion | `components/ui/accordion.tsx` | Collapsible sections |
| Tooltip | `components/ui/tooltip.tsx` | Hover tooltip |
| Avatar | `components/ui/avatar.tsx` | User avatar |
| Separator | `components/ui/separator.tsx` | Visual divider |
| Combobox | `components/ui/combobox.tsx` | Searchable select |
| Command | `components/ui/command.tsx` | Command palette |
| ScrollArea | `components/ui/scroll-area.tsx` | Scrollable container |
| Popover | `components/ui/popover.tsx` | Popover content |
| Card | `components/ui/card.tsx` | Content container |
| Sidebar | `components/ui/sidebar.tsx` | Navigation sidebar |
| Breadcrumb | `components/ui/breadcrumb.tsx` | Navigation breadcrumb |
| ButtonGroup | `components/ui/button-group.tsx` | Grouped buttons |
| InputGroup | `components/ui/input-group.tsx` | Input with addon |
| Pagination | `components/ui/pagination.tsx` | Page navigation |
| Textarea | `components/ui/textarea.tsx` | Multi-line input |
| AspectRatio | `components/ui/aspect-ratio.tsx` | Aspect ratio container |
| Collapsible | `components/ui/collapsible.tsx` | Collapsible content |
| Sonner | `components/ui/sonner.tsx` | Toast notifications |

**Assessment:** Well-organized shadcn-like UI library with ~25+ primitive components.

#### Feature-Specific Components

| Component | Path | Feature |
|-----------|------|---------|
| Admin_Sidebar | `components/Admin/` | Admin navigation |
| UsersManager | `components/Admin/` | User CRUD |
| CatSubCatManager | `components/Admin/cat-subcat-manager/` | Category management |
| Header | `components/Header_comp/` | Main header |
| Footer | `components/Footer_comp/` | Main footer |
| BannerCarousel | `components/HomeScreen_comp/` | Home banner |
| Categories | `components/HomeScreen_comp/Categories_comp/` | Category display |
| SpecialProducts | `components/HomeScreen_comp/SpecialProducts_comp/` | Featured products |
| ProductCard | `components/HomeScreen_comp/SpecialProducts_comp/` | Product display |
| LoginHeader | `components/Login_comp/` | Login screen |
| StageOTP | `components/Login_comp/` | OTP input |
| StagePhone | `components/Login_comp/` | Phone input |

#### Page-Bound Components

| Component | Path | Page |
|-----------|------|------|
| cart_screen | `components/Screens_comp/` | /cart |
| home_screen | `components/Screens_comp/` | /home |
| orders_screen | `components/Screens_comp/` | /orders |
| profile_screen | `components/Screens_comp/` | /profile |
| ProduceList | `components/ShoppingCartScreen_comp/ProductList_comp/` | /home (products) |
| ProductSheet | `components/ShoppingCartScreen_comp/ProductList_comp/ProductSheet_comp/` | Product details modal |

### Business Logic in Components

**Potential Issues:**

1. **`ProductData.ts`** (`components/HomeScreen_comp/SpecialProducts_comp/ProductData.ts`):
   - Contains hardcoded mock data
   - Should be in a test fixture or mock service

2. **`sheetData.ts`** (`components/ShoppingCartScreen_comp/ProductList_comp/ProductSheet_comp/sheetData.ts`):
   - Static data mixed with component logic

3. **`ProductsManager.tsx` / `CatSubCatManager.tsx`**:
   - Likely contain CRUD business logic that should be in services

---

## 8. Auth & Middleware

### Frontend Authentication Flow

```
User Interaction
    ↓
useLogin / useSignup hooks
    ↓
auth.service.ts
    ↓
lib/api/auth.ts (fetcher)
    ↓
Backend API (NEXT_PUBLIC_API_BASE)
    ↓
Set cookies (refreshToken, likely accessToken)
    ↓
auth.store.ts / AuthContext updates
```

### Cookie-Based Auth

- **Refresh Token**: Stored in cookies, checked by middleware
- **Access Token**: Likely also in cookies (standard pattern)
- **No HTTP-only concerns visible** in frontend code

### Middleware Security Analysis

**Current Implementation** (`middleware.ts`):
```typescript
export function middleware(req: NextRequest) {
    const refreshToken = req.cookies.get("refreshToken")?.value;
    const protectedPaths = ["/admin"];
    if (protectedPaths.some((p) => req.nextUrl.pathname.startsWith(p))) {
        if (!refreshToken) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }
    return NextResponse.next();
}
```

**Security Gaps:**

| Issue | Severity | Impact |
|-------|----------|--------|
| No token signature validation | Critical | Anyone can set fake cookie |
| No expiration check | High | Stolen tokens work forever |
| No role/permission check | Medium | All authenticated users access admin |
| Access token not validated | Medium | Refresh token alone grants access |
| No token refresh endpoint | Medium | No automatic token renewal |
| Hardcoded path array | Low | Maintenance burden |

### Recommendations

1. **Validate token signature** using JWT library
2. **Check expiration** (`exp` claim)
3. **Verify user roles** from token claims
4. **Implement token refresh** flow
5. **Move protected paths** to configuration

---

## 9. Architectural Issues & Smells

### Critical Issues

1. **Duplicate State Management**
   - `AuthContext.tsx` and `auth.store.ts` manage the same auth state
   - Creates synchronization issues and confusion
   - **Action:** Choose one (Zustand store is preferred for global state)

2. **Middleware Security Vulnerability**
   - Token presence check without validation
   - No signature/expiration verification
   - **Action:** Implement proper JWT validation

3. **Typo in Admin Layout**
   - `layout.tsx.tsx` filename duplication
   - **Action:** Rename to `layout.tsx`

### Major Issues

4. **Inconsistent Path Aliases**
   - `tsconfig.json` defines both `@/src/*` and feature-specific aliases
   - No enforced convention
   - **Action:** Standardize on one approach (recommended: `@/*` for everything)

5. **Mixed Responsibilities in Hooks**
   - `useLoginStages` manages OTP timer AND login stages
   - **Action:** Split into `useLoginStage` and `useOTPCountdown`

6. **Duplicate API Layers**
   - `lib/api/` and `services/` both contain API logic
   - No clear boundary
   - **Action:** Consolidate to single layer (services/ with typed fetchers)

7. **Hardcoded Mock Data**
   - `ProductData.ts` contains production mock data
   - `sheetData.ts` contains static test data
   - **Action:** Move to test fixtures or mock services

8. **Inconsistent Hook Naming**
   - `UseMe.ts` (capital U) vs `useLogin.ts` (lowercase u)
   - **Action:** Standardize naming convention

### Minor Issues

9. **No API Error Handling Pattern**
   - `lib/api-error.ts` exists but usage unclear
   - No centralized error boundary
   - **Action:** Implement React Error Boundary + consistent error types

10. **Missing Loading States**
    - Some components may lack loading states
    - No global loading spinner pattern
    - **Action:** Add loading skeletons + suspense boundaries

11. **Unused Imports in Middleware**
    - Comment says "this file requires further inquiry"
    - **Action:** Clean up and document

12. **No API Response Caching**
    - React Query or SWR not used
    - All data fetched fresh on each render
    - **Action:** Consider adding TanStack Query for caching

---

## 10. Readiness Assessment

### Scalability

| Aspect | Rating | Notes |
|--------|--------|-------|
| **Folder Structure** | Moderate | Route groups good, but feature vs type organization unclear |
| **State Management** | Poor | Duplicate stores/context, no caching strategy |
| **Component Architecture** | Good | Primitives well-organized, shadcn pattern |
| **API Layer** | Poor | Duplicate layers, no abstraction |
| **Code Organization** | Moderate | Mixed naming conventions, unclear ownership |

**Scalability Verdict:** **NOT READY** - Needs architectural cleanup before scaling

### Maintainability

| Aspect | Rating | Notes |
|--------|--------|-------|
| **Type Safety** | Moderate | Schemas exist but inconsistent usage |
| **Testing** | Unknown | No test files visible |
| **Documentation** | None | No code comments, no README for architecture |
| **Code Style** | Moderate | ESLint configured but naming inconsistencies |
| **Dependency Management** | Good | Lockfile present, reasonable versions |

**Maintainability Verdict:** **NOT MAINTAINABLE** - Requires documentation and cleanup

### Professional Standards Alignment

| Standard | Compliance |
|----------|------------|
| **Feature-Based Architecture** | Partial - `features/` exists but incomplete |
| **Component Composition** | Good - Reusable primitives established |
| **State Management Best Practices** | Poor - Duplication, no caching |
| **Security** | Poor - Middleware validation incomplete |
| **Type Safety** | Moderate - Schemas defined, implementation unclear |
| **API Layer Abstraction** | Poor - Multiple overlapping layers |

**Professional Standards Verdict:** **NOT COMPLIANT** - Multiple anti-patterns present

### Blocking Items for Senior Engineer Approval

**Must Fix Before Approval:**

1. [CRITICAL] Fix middleware token validation - currently insecure
2. [CRITICAL] Eliminate auth store/context duplication
3. [HIGH] Rename `layout.tsx.tsx` typo
4. [HIGH] Consolidate API layers (either `lib/api/` OR `services/`)
5. [HIGH] Remove hardcoded mock data from production code

**Should Fix Before Approval:**

6. [MEDIUM] Standardize path aliases in tsconfig.json
7. [MEDIUM] Split `useLoginStages` into single-responsibility hooks
8. [MEDIUM] Fix `UseMe.ts` capitalization
9. [MEDIUM] Add error boundary and consistent error handling
10. [LOW] Remove comment about "further inquiry" in middleware

**Nice to Have:**

11. Add React Query/SWR for data caching
12. Implement proper loading states with Suspense
13. Add unit/integration tests
14. Create architecture documentation
15. Set up CI/CD pipeline

### Final Verdict

**NOT APPROVED** - The codebase has fundamental architectural issues that must be resolved before a senior engineer would approve it for production use. The critical security vulnerability in middleware and state management duplication are blocking issues that pose immediate risk to the application.
