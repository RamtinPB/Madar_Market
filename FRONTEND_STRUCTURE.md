# Frontend Project Structure

This document provides a comprehensive overview of the frontend project structure for the Madar Market application. The frontend is built using **Next.js 14** with the App Router, **TypeScript**, **Tailwind CSS**, and **shadcn/ui** components.

## Project Overview

The frontend is a modern React application utilizing:

- **Next.js 14** with App Router for routing and server-side rendering
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Zustand** for state management
- **React Hook Form** for form handling
- **Axios** for API calls

---

## Complete Directory Structure

```
frontend/
├── .gitignore                          # Git ignore patterns for frontend
├── components.json                     # shadcn/ui components configuration
├── eslint.config.mjs                   # ESLint configuration for code linting
├── middleware.ts                       # Next.js middleware for redirects/auth
├── next.config.ts                      # Next.js configuration settings
├── package-lock.json                   # NPM dependency lock file
├── package.json                        # Project dependencies and scripts
├── postcss.config.mjs                  # PostCSS configuration for Tailwind
├── README.md                           # Frontend project documentation
├── tsconfig.json                       # TypeScript configuration
├── .next/                              # Next.js build output (generated)
├── public/                             # Static assets served by Next.js
│   └── assets/                         # Image and icon assets
│       ├── footer/                     # Footer component icons
│       │   ├── home.svg               # Home icon
│       │   ├── item_active.svg        # Active item icon
│       │   ├── profile.svg            # Profile icon
│       │   ├── receipt.svg            # Receipt icon
│       │   └── right-to-bracket-solid-full.svg # Back icon
│       ├── header/                     # Header component icons
│       │   ├── basket.svg             # Shopping cart icon
│       │   ├── logo.svg               # Application logo
│       │   └── right_arrow.svg        # Right arrow icon
│       ├── home_screen/                # Home screen specific assets
│       │   ├── CountdownAd.svg        # Countdown advertisement graphic
│       │   ├── search.svg             # Search icon
│       │   ├── watch.png              # Watch advertisement image
│       │   ├── categories/            # Category icons for home screen
│       │   │   ├── Accessories.png    # Accessories category icon
│       │   │   ├── Additives.png      # Additives category icon
│       │   │   ├── BackedGoods.png    # Baked goods category icon
│       │   │   ├── Breakfast.png      # Breakfast category icon
│       │   │   ├── Canned.png         # Canned goods category icon
│       │   │   ├── Cosmetics.png      # Cosmetics category icon
│       │   │   ├── Dairy.png          # Dairy category icon
│       │   │   ├── Disposable.png     # Disposable items category icon
│       │   │   ├── Dried fruits, sweets.png # Dried fruits category icon
│       │   │   ├── Drinks.png         # Drinks category icon
│       │   │   ├── Essential Groseries.png # Essential groceries icon
│       │   │   ├── Fruits and Vegetables.png # Fresh produce icon
│       │   │   ├── Health.png         # Health products category icon
│       │   │   ├── home and hygiene.png # Home hygiene category icon
│       │   │   ├── Mother and child.png # Mother & child category icon
│       │   │   ├── Pickled.png        # Pickled goods category icon
│       │   │   ├── Protein.png        # Protein products category icon
│       │   │   ├── Refrigerated.png   # Refrigerated items icon
│       │   │   ├── Snacks.png         # Snacks category icon
│       │   │   └── Writing supplies.png # Writing supplies icon
│       │   └── special_products/      # Special product showcase images
│       │       ├── arrow.png          # Navigation arrow
│       │       ├── Cart.png           # Shopping cart illustration
│       │       ├── cheese.png         # Cheese product image
│       │       ├── machhiato.png      # Machhiato product image
│       │       ├── olive_oil.png      # Olive oil product image
│       │       └── qh.png             # Product image
│       ├── login/                      # Login screen assets
│       │   ├── clock.svg              # Clock icon for OTP timer
│       │   ├── edit.svg               # Edit icon
│       │   ├── eye-slash-regular-full.svg # Hide password icon
│       │   ├── eye-solid-full.svg     # Show password icon
│       │   ├── HandBasket.png         # Hand basket illustration
│       │   ├── HBread.png             # Bread product image
│       │   ├── HBread.svg             # Bread product vector
│       │   ├── HCan.png               # Can product image
│       │   ├── HCan.svg               # Can product vector
│       │   ├── HLemon.png             # Lemon product image
│       │   ├── HLemon.svg             # Lemon product vector
│       │   ├── HOil.png               # Oil product image
│       │   ├── HOil.svg               # Oil product vector
│       │   ├── login_hands.png        # Login hands illustration
│       │   ├── login_hands.svg        # Login hands vector
│       │   ├── login_left.png         # Left side login graphic
│       │   ├── login_right.png        # Right side login graphic
│       │   ├── logo_desc.png          # Logo with description
│       │   ├── logo.png               # Application logo
│       │   └── Phone.svg              # Phone icon
│       └── shopping_cart_screen/      # Shopping cart screen assets
│           ├── arrow-swap.svg         # Swap arrow icon
│           ├── card.svg               # Credit card icon
│           ├── CheckMark.svg          # Check mark icon
│           ├── close.svg              # Close icon
│           ├── plus.svg               # Plus icon
│           ├── receipt-discount.svg   # Discount receipt icon
│           └── trash.svg              # Delete/trash icon
└── src/                               # Source code directory
    ├── app/                           # Next.js App Router pages
    │   ├── favicon.ico               # Browser favicon
    │   ├── globals.css               # Global CSS styles
    │   ├── layout.tsx                # Root layout component
    │   ├── (auth)/                   # Authentication route group
    │   │   ├── layout.tsx            # Auth layout wrapper
    │   │   ├── login/page.tsx        # Login page
    │   │   └── signup/page.tsx       # Sign up page
    │   ├── (main)/                   # Main application route group
    │   │   ├── layout.tsx            # Main app layout wrapper
    │   │   ├── page.tsx              # Default redirect page
    │   │   ├── cart/page.tsx         # Shopping cart page
    │   │   ├── home/page.tsx         # Home screen page
    │   │   ├── orders/page.tsx       # Orders page
    │   │   └── profile/page.tsx      # User profile page
    │   └── admin/(panel)/            # Admin panel route group
    │       ├── layout.tsx.tsx        # Admin layout (note: duplicate extension)
    │       └── page.tsx              # Admin dashboard page
    ├── components/                    # React components
    │   ├── Admin/                    # Admin-specific components
    │   │   ├── Admin_Sidebar.tsx     # Admin navigation sidebar
    │   │   ├── UsersManager.tsx      # User management component
    │   │   └── cat-subcat-manager/   # Category/subcategory management
    │   │       └── CatSubCatManager.tsx # Category manager component
    │   ├── Footer_comp/              # Footer components
    │   │   ├── footer.tsx            # Main footer component
    │   │   └── NavItem.tsx           # Footer navigation item
    │   ├── Header_comp/              # Header components
    │   │   └── header.tsx            # Main header component
    │   ├── HomeScreen_comp/          # Home screen components
    │   │   ├── BannerCarousel.tsx    # Image carousel for banners
    │   │   ├── CountdownAd.tsx       # Countdown advertisement component
    │   │   ├── SearchBar.tsx         # Search input component
    │   │   ├── WatchAd.tsx           # Watch advertisement component
    │   │   ├── Categories_comp/      # Categories display components
    │   │   │   ├── Categories.tsx    # Main categories grid
    │   │   │   └── CategoryItem.tsx  # Individual category item
    │   │   └── SpecialProducts_comp/ # Special products components
    │   │       ├── ProductCard.tsx   # Product display card
    │   │       ├── ProductData.ts    # Product data types/constants
    │   │       ├── SpecialProducts.tsx # Special products section
    │   │       └── ViewAllCard.tsx   # "View All" card component
    │   ├── Login_comp/               # Login components
    │   │   ├── LoginFooterOTP.tsx    # OTP login footer
    │   │   ├── LoginFooterPhone.tsx  # Phone login footer
    │   │   ├── LoginHeader.tsx       # Login screen header
    │   │   ├── StageOTP.tsx          # OTP verification stage
    │   │   ├── StagePhone.tsx        # Phone number stage
    │   │   ├── hooks/               # Login-specific hooks
    │   │   │   ├── useLoginStages.ts # Login stage management
    │   │   │   └── useOTPCountdown.ts # OTP timer functionality
    │   │   └── utils/               # Login utilities
    │   │       └── formatTime.ts     # Time formatting utilities
    │   ├── Screens_comp/             # Screen wrapper components
    │   │   ├── cart_screen.tsx       # Cart screen wrapper
    │   │   ├── home_screen.tsx       # Home screen wrapper
    │   │   ├── orders_screen.tsx     # Orders screen wrapper
    │   │   └── profile_screen.tsx    # Profile screen wrapper
    │   ├── ShoppingCartScreen_comp/  # Shopping cart components
    │   │   ├── CustomSpinner.tsx     # Loading spinner component
    │   │   ├── ScrollCategories.tsx  # Scrollable categories list
    │   │   ├── SubCategories.tsx     # Subcategories component
    │   │   ├── ProductList_comp/     # Product listing components
    │   │   │   ├── ProduceList.tsx   # Main product list
    │   │   │   ├── ProduceListGrid.tsx # Grid view of products
    │   │   │   ├── ProduceListHeader.tsx # Product list header
    │   │   │   └── ProductListCard_comp/ # Product card components
    │   │   │       ├── CartButton.tsx # Add to cart button
    │   │   │       ├── DiscountBadge.tsx # Discount badge
    │   │   │       ├── ProduceListCard.tsx # Product card
    │   │   │       └── SponsorPrice.tsx # Sponsor pricing display
    │   │   │   └── ProductSheet_comp/ # Product detail sheet
    │   │   │       ├── ProductSheet.tsx # Main product sheet
    │   │   │       ├── ProductSheetAttributes.tsx # Product attributes
    │   │   │       ├── ProductSheetCard.tsx # Product card in sheet
    │   │   │       ├── ProductSheetFooter.tsx # Sheet footer
    │   │   │       ├── ProductSheetHeader.tsx # Sheet header
    │   │   │       ├── ProductSheetPriceBox.tsx # Price display
    │   │   │       └── sheetData.ts # Sheet data types
    │   │   └── ui/                   # Reusable UI components (shadcn/ui)
    │   │       ├── accordion.tsx     # Accordion component
    │   │       ├── aspect-ratio.tsx  # Aspect ratio container
    │   │       ├── avatar.tsx        # Avatar component
    │   │       ├── badge.tsx         # Badge component
    │   │       ├── breadcrumb.tsx    # Breadcrumb navigation
    │   │       ├── button-group.tsx  # Button group container
    │   │       ├── button.tsx        # Button component
    │   │       ├── card.tsx          # Card container
    │   │       ├── carousel.tsx      # Carousel component
    │   │       ├── collapsible.tsx   # Collapsible content
    │   │       ├── combobox.tsx      # Combobox dropdown
    │   │       ├── command.tsx       # Command palette
    │   │       ├── dialog.tsx        # Modal dialog
    │   │       ├── input-group.tsx   # Input group container
    │   │       ├── input.tsx         # Input component
    │   │       ├── pagination.tsx    # Pagination component
    │   │       ├── popover.tsx       # Popover component
    │   │       ├── scroll-area.tsx   # Scrollable area
    │   │       ├── select.tsx        # Select dropdown
    │   │       ├── separator.tsx     # Visual separator
    │   │       ├── sheet.tsx         # Sheet/sidebar component
    │   │       ├── sidebar.tsx       # Sidebar component
    │   │       ├── skeleton.tsx      # Loading skeleton
    │   │       ├── sonner.tsx        # Toast notifications
    │   │       ├── spinner.tsx       # Spinner component
    │   │       ├── table.tsx         # Table component
    │   │       ├── textarea.tsx      # Textarea component
    │   │       └── tooltip.tsx       # Tooltip component
    ├── context/                       # React contexts
    │   └── AuthContext.tsx           # Authentication context provider
    ├── features/                      # Feature-based organization
    │   └── auth/                     # Authentication features
    │       ├── index.ts              # Auth feature exports
    │       ├── types.ts              # Authentication types
    │       └── hooks/                # Authentication hooks
    │           ├── useLogin.ts       # Login hook
    │           ├── useLogout.ts      # Logout hook
    │           ├── UseMe.ts          # Get current user hook
    │           └── useSignup.ts      # Sign up hook
    ├── hooks/                         # Custom React hooks
    │   ├── checkLoginState.ts        # Login state checker
    │   └── use-mobile.ts             # Mobile device detection
    ├── lib/                           # Utility libraries
    │   ├── api-error.ts              # API error handling
    │   ├── utils.ts                  # General utilities
    │   └── api/                      # API functions
    │       ├── auth.ts               # Authentication API calls
    │       ├── categories.ts         # Categories API calls
    │       ├── fetcher.ts            # Generic API fetcher
    │       ├── products.ts           # Products API calls
    │       └── subcategories.ts      # Subcategories API calls
    ├── schemas/                       # Validation schemas
    │   ├── auth.schema.ts            # Authentication validation
    │   ├── category.schema.ts        # Category validation
    │   ├── product.schema.ts         # Product validation
    │   └── subCategory.schema.ts     # Subcategory validation
    ├── services/                      # Business logic services
    │   ├── auth.service.ts           # Authentication service
    │   ├── categories.service.ts     # Categories service
    │   ├── http-clients.ts           # HTTP client configuration
    │   ├── orders.service.ts         # Orders service
    │   ├── products.service.ts       # Products service
    │   └── subCategories.service.ts  # Subcategories service
    ├── stores/                        # State management (Zustand)
    │   ├── auth.store.ts             # Authentication state store
    │   └── cart.store.ts.ts          # Shopping cart state store
```

---

## Key Architectural Components

### 1. **App Router Structure** (`src/app/`)

The application uses Next.js 14's App Router with route groups:

- `(auth)` - Authentication pages (login, signup)
- `(main)` - Main application pages (home, cart, orders, profile)
- `(admin)` - Admin panel pages

### 2. **Component Organization** (`src/components/`)

Components are organized by feature and screen:

- **Admin** - Admin panel components
- **Footer_comp** - Footer-related components
- **Header_comp** - Header navigation components
- **HomeScreen_comp** - Home page specific components
- **Login_comp** - Authentication flow components
- **Screens_comp** - Screen wrapper components
- **ShoppingCartScreen_comp** - Shopping cart components
- **ui** - Reusable shadcn/ui components

### 3. **State Management** (`src/stores/`)

Uses Zustand for lightweight state management:

- `auth.store.ts` - User authentication state
- `cart.store.ts` - Shopping cart state

### 4. **Services Layer** (`src/services/`)

Business logic separated from components:

- Authentication, products, categories, orders services
- HTTP client configuration

### 5. **Feature-Based Organization** (`src/features/`)

Features grouped by domain with hooks and types:

- Authentication features with custom hooks

### 6. **API Layer** (`src/lib/api/`)

Centralized API functions for different entities:

- Authentication, categories, products, subcategories
- Generic fetcher for consistent API calls

### 7. **Validation** (`src/schemas/`)

TypeScript schemas for runtime validation using Zod or similar

### 8. **Assets** (`public/assets/`)

Organized static assets by component/screen:

- Footer, header, home screen, login, and shopping cart assets

---

## Development Guidelines

1. **Component Structure**: Components follow a feature-based organization
2. **State Management**: Use Zustand for global state, React state for local state
3. **API Calls**: Use the service layer and API functions for consistency
4. **Styling**: Tailwind CSS with shadcn/ui components
5. **Type Safety**: Full TypeScript coverage with proper type definitions
6. **Routing**: Next.js App Router with route groups for organization

This structure promotes maintainability, scalability, and separation of concerns while following modern React and Next.js best practices.
