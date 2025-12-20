# Madar Market - Project Structure Documentation

## Project Overview

Madar Market is a full-stack e-commerce application built with a modern tech stack. The project consists of a TypeScript/Node.js backend using the Elysia framework and Prisma ORM, paired with a React/Next.js frontend. The application supports user authentication, product management, categories, shopping cart functionality, and administrative features.

## Technology Stack

### Backend

- **Framework**: Elysia (Fast, lightweight web framework for Bun/Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based authentication with refresh tokens
- **File Storage**: Arvan Cloud S3 for file uploads
- **Language**: TypeScript

### Frontend

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives with custom components
- **State Management**: Zustand for global state
- **Icons**: Lucide React
- **Language**: TypeScript

## Complete Project Structure

```
madar_market/
├── backend/                          # Backend API server
│   ├── .env                          # Environment variables (not tracked)
│   ├── .gitignore                    # Git ignore rules for backend
│   ├── bun.lock                      # Bun package manager lockfile
│   ├── generated/                    # Generated Prisma client files
│   │   └── prisma/                   # Generated Prisma client
│   ├── index.ts                      # Backend entry point
│   ├── node_modules/                 # Dependencies (not tracked)
│   ├── note.txt                      # Developer notes
│   ├── package-lock.json             # NPM lockfile (fallback)
│   ├── package.json                  # Backend dependencies
│   ├── prisma/                       # Database schema and migrations
│   │   ├── schema.prisma             # Database schema definition
│   │   ├── config.ts                 # Prisma configuration
│   │   └── migrations/               # Database migration history
│   ├── public/                       # Static files served by backend
│   │   ├── carousel/                 # Carousel images
│   │   └── uploads/                  # User uploaded files
│   │       ├── categories/           # Category images
│   │       └── products/             # Product images
│   ├── README.md                     # Backend documentation
│   ├── src/                          # Source code
│   │   ├── modules/                  # Feature modules (MVC pattern)
│   │   │   ├── auth/                 # Authentication module
│   │   │   │   ├── auth.controller.ts    # Auth controller
│   │   │   │   ├── auth.middleware.ts    # Auth middleware
│   │   │   │   ├── auth.route.ts         # Auth routes
│   │   │   │   ├── auth.service.ts       # Auth business logic
│   │   │   │   └── auth.types.ts         # Auth type definitions
│   │   │   ├── categories/           # Categories module
│   │   │   │   ├── categories.controller.ts
│   │   │   │   ├── categories.dto.ts     # Data transfer objects
│   │   │   │   ├── categories.middleware.ts
│   │   │   │   ├── categories.route.ts
│   │   │   │   ├── categories.service.ts
│   │   │   │   └── categories.types.ts
│   │   │   ├── product/              # Products module
│   │   │   │   ├── products.controller.ts
│   │   │   │   ├── products.dto.ts
│   │   │   │   ├── products.middleware.ts
│   │   │   │   ├── products.route.ts
│   │   │   │   ├── products.service.ts
│   │   │   │   └── products.types.ts
│   │   │   ├── storage/              # File storage module
│   │   │   │   └── storage.service.ts    # S3 integration
│   │   │   ├── subCategories/        # Subcategories module
│   │   │   │   ├── subCategories.controller.ts
│   │   │   │   ├── subCategories.dto.ts
│   │   │   │   ├── subCategories.middleware.ts
│   │   │   │   ├── subCategories.route.ts
│   │   │   │   ├── subCategories.service.ts
│   │   │   │   └── subCategories.types.ts
│   │   │   └── user/                 # User management module
│   │   │       ├── user.controller.ts
│   │   │       ├── user.route.ts
│   │   │       └── user.service.ts
│   │   ├── s3.ts                     # S3 configuration
│   │   ├── server.ts                 # Server configuration
│   │   └── utils/                    # Utility functions
│   │       ├── auth.ts               # Auth utilities
│   │       ├── errors.ts             # Error handling
│   │       ├── files.ts              # File handling utilities
│   │       ├── hash.ts               # Password hashing
│   │       ├── jwt.ts                # JWT utilities
│   │       ├── prisma.ts             # Prisma client instance
│   │       └── securityRoute.ts      # Security middleware
│   └── tsconfig.json                 # TypeScript configuration
├── frontend/                         # Next.js frontend application
│   ├── .gitignore                    # Git ignore rules for frontend
│   ├── components.json               # shadcn/ui component config
│   ├── eslint.config.mjs             # ESLint configuration
│   ├── middleware.ts                 # Next.js middleware
│   ├── next.config.ts                # Next.js configuration
│   ├── package-lock.json             # NPM lockfile
│   ├── package.json                  # Frontend dependencies
│   ├── postcss.config.mjs            # PostCSS configuration
│   ├── README.md                     # Frontend documentation
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── .next/                        # Next.js build output (generated)
│   ├── app/                          # Next.js App Router
│   │   ├── favicon.ico               # Site favicon
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout component
│   │   ├── (auth)/                   # Authentication routes
│   │   │   ├── layout.tsx            # Auth layout wrapper
│   │   │   ├── login/                # Login page
│   │   │   │   └── page.tsx
│   │   │   └── signup/               # Signup page
│   │   │       └── page.tsx
│   │   ├── (main)/                   # Main application routes
│   │   │   ├── layout.tsx            # Main app layout
│   │   │   ├── page.tsx              # Home page
│   │   │   ├── cart/                 # Shopping cart
│   │   │   │   └── page.tsx
│   │   │   ├── home/                 # Home screen
│   │   │   │   └── page.tsx
│   │   │   ├── orders/               # Orders page
│   │   │   │   └── page.tsx
│   │   │   └── profile/              # User profile
│   │   │       └── page.tsx
│   │   └── admin/                    # Admin panel
│   │       └── (panel)/              # Admin interface
│   │           ├── layout.tsx.tsx    # Admin layout (typo in filename)
│   │           └── page.tsx          # Admin dashboard
│   ├── hooks/                        # Custom React hooks
│   │   └── use-mobile.ts             # Mobile detection hook
│   ├── public/                       # Static assets
│   │   └── assets/                   # Application assets
│   │       ├── footer/               # Footer icons and graphics
│   │       ├── header/               # Header icons and graphics
│   │       ├── home_screen/          # Home screen assets
│   │       │   ├── categories/       # Category icons
│   │       │   └── special_products/ # Featured product images
│   │       ├── login/                # Login page assets
│   │       └── shopping_cart_screen/ # Shopping cart assets
│   ├── src/                          # Source code
│   │   ├── components/               # React components
│   │   │   ├── Admin/                # Admin panel components
│   │   │   │   ├── Admin_Sidebar.tsx
│   │   │   │   └── UsersManager.tsx
│   │   │   ├── Footer_comp/          # Footer components
│   │   │   │   ├── footer.tsx
│   │   │   │   └── NavItem.tsx
│   │   │   ├── Header_comp/          # Header components
│   │   │   │   └── header.tsx
│   │   │   ├── HomeScreen_comp/      # Home screen components
│   │   │   │   ├── BannerCarousel.tsx
│   │   │   │   ├── CountdownAd.tsx
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   └── WatchAd.tsx
│   │   │   ├── Login_comp/           # Login components
│   │   │   │   ├── LoginFooterOTP.tsx
│   │   │   │   ├── LoginFooterPhone.tsx
│   │   │   │   ├── LoginHeader.tsx
│   │   │   │   ├── StageOTP.tsx
│   │   │   │   ├── StagePhone.tsx
│   │   │   │   └── hooks/
│   │   │   │       ├── useLoginStages.ts
│   │   │   │       └── useOTPCountdown.ts
│   │   │   ├── Screens_comp/         # Screen components
│   │   │   │   ├── cart_screen.tsx
│   │   │   │   ├── home_screen.tsx
│   │   │   │   ├── orders_screen.tsx
│   │   │   │   └── profile_screen.tsx
│   │   │   ├── ShoppingCartScreen_comp/ # Shopping cart components
│   │   │   │   ├── CustomSpinner.tsx
│   │   │   │   ├── ScrollCategories.tsx
│   │   │   │   ├── SubCategories.tsx
│   │   │   │   ├── ProductList_comp/   # Product list components
│   │   │   │   │   ├── ProduceList.tsx
│   │   │   │   │   ├── ProduceListGrid.tsx
│   │   │   │   │   ├── ProduceListHeader.tsx
│   │   │   │   │   ├── ProductListCard_comp/ # Product card components
│   │   │   │   │   │   ├── CartButton.tsx
│   │   │   │   │   │   ├── DiscountBadge.tsx
│   │   │   │   │   │   ├── ProduceListCard.tsx
│   │   │   │   │   │   ├── SponsorPrice.tsx
│   │   │   │   │   │   └── [additional card components]
│   │   │   │   │   └── ProductSheet_comp/    # Product detail sheet
│   │   │   │   │       ├── ProductSheet.tsx
│   │   │   │   │       ├── ProductSheetAttributes.tsx
│   │   │   │   │       ├── ProductSheetCard.tsx
│   │   │   │   │       ├── ProductSheetFooter.tsx
│   │   │   │   │       ├── ProductSheetHeader.tsx
│   │   │   │   │       ├── ProductSheetPriceBox.tsx
│   │   │   │   │       └── sheetData.ts
│   │   │   └── ui/                   # Reusable UI components
│   │   │       ├── [shadcn/ui components] # Accordion, Avatar, Button, etc.
│   │   ├── context/                  # React context providers
│   │   │   └── AuthContext.tsx       # Authentication context
│   │   ├── hooks/                    # Additional custom hooks
│   │   │   └── checkLoginState.ts    # Login state hook
│   │   ├── lib/                      # Utility libraries
│   │   │   ├── utils.ts              # General utilities
│   │   │   └── api/                  # API integration layer
│   │   │       ├── auth.ts           # Authentication API calls
│   │   │       ├── categories.ts     # Categories API calls
│   │   │       ├── fetcher.ts        # Generic API fetcher
│   │   │       ├── products.ts       # Products API calls
│   │   │       └── subcategories.ts  # Subcategories API calls
│   └── [additional frontend files]
└── note.txt                          # Project notes
```

## Key Directory Descriptions

### Backend Structure (`backend/`)

#### Core Directories

- **`src/modules/`**: Feature-based modular architecture following MVC pattern

  - Each module contains: controller, service, route, middleware, DTO, and types
  - **auth**: JWT authentication, login, registration, token management
  - **categories**: Product category management
  - **product**: Product CRUD operations and management
  - **subCategories**: Subcategory management
  - **storage**: File upload handling with S3 integration
  - **user**: User profile and management

- **`src/utils/`**: Shared utility functions

  - Authentication, JWT handling, password hashing
  - Error handling and security middleware
  - File handling utilities
  - Prisma client configuration

- **`prisma/`**: Database layer

  - `schema.prisma`: Database schema with models for users, products, categories, etc.
  - `migrations/`: Database migration history
  - `config.ts`: Prisma configuration with environment variable loading

- **`public/uploads/`**: File storage
  - Static file serving for uploaded images
  - Organized by type: categories, products

#### Configuration Files

- **`index.ts`**: Application entry point
- **`server.ts`**: Server configuration and setup
- **`s3.ts`**: Arvan Cloud S3 integration
- **`package.json`**: Dependencies including Elysia, Prisma, AWS SDK, JWT libraries

### Frontend Structure (`frontend/`)

#### App Router (`app/`)

- **Route Groups**: Organized using Next.js 13+ App Router
  - `(auth)`: Authentication pages (login, signup)
  - `(main)`: Main application pages (home, cart, orders, profile)
  - `admin`: Administrative interface

#### Component Organization

- **`components/ui/`**: Reusable UI components built with Radix UI primitives
- **Feature-based components**: Organized by screen/feature
  - `HomeScreen_comp/`: Home page components
  - `ShoppingCartScreen_comp/`: Shopping cart and product browsing
  - `Login_comp/`: Authentication flow components
  - `Screens_comp/`: Main screen layouts

#### State Management & API

- **`src/lib/api/`**: API integration layer with type-safe functions
- **`src/context/AuthContext.tsx`**: Authentication state management
- **`hooks/`**: Custom React hooks for reusable logic
- **`data_store/`**: Zustand stores for global state (cart, user data)

#### Styling & Assets

- **`public/assets/`**: Static assets organized by feature
- **`globals.css`**: Global styles and Tailwind imports
- **`tailwind.config.js`**: Tailwind CSS customization

## Development Guidelines

### Backend Development

1. **Modular Architecture**: Add new features as modules in `src/modules/`
2. **Database Changes**: Create Prisma migrations for schema changes
3. **API Design**: RESTful endpoints with proper HTTP status codes
4. **Authentication**: JWT-based with refresh token rotation

### Frontend Development

1. **Component Structure**: Functional components with TypeScript
2. **State Management**: Use Zustand for global state, React hooks for local state
3. **API Calls**: Use the typed API functions in `src/lib/api/`
4. **Styling**: Tailwind CSS with custom design system

## Key Features Implemented

- **User Authentication**: JWT-based auth with OTP support
- **Product Management**: CRUD operations with categories and subcategories
- **Shopping Cart**: Add/remove items, quantity management
- **File Upload**: S3 integration for product and category images
- **Admin Panel**: User and content management interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation across both frontend and backend

## Database Schema Highlights

The Prisma schema includes models for:

- **Users**: Authentication and profile data
- **Products**: Product information with categories and attributes
- **Categories/SubCategories**: Hierarchical product organization
- **Orders**: Shopping cart and order management
- **File Uploads**: Image management and storage references

This structure provides a scalable foundation for an e-commerce platform with room for expansion into features like reviews, wishlists, payment processing, and analytics.
