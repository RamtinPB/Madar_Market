# Madar Market - Project Structure Documentation

## Project Overview

Madar Market is a full-stack e-commerce application built with a modern tech stack. The project consists of a TypeScript/Node.js backend using the Elysia framework and Prisma ORM, paired with a React/Next.js frontend. The application supports user authentication, product management, categories, shopping cart functionality, and administrative features.

## Technology Stack

### Backend

- **Framework**: Elysia (Fast, lightweight web framework for Bun/Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based authentication with role-based access control
- **File Storage**: Arvan Cloud S3 for file uploads
- **Language**: TypeScript
- **Architecture**: Clean Architecture with Repository Pattern

### Frontend

- **Framework**: Next.js with React
- **Styling**: Tailwind CSS
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
│   │   ├── infrastructure/           # Infrastructure layer
│   │   │   ├── auth/                 # Authentication infrastructure
│   │   │   │   ├── auth.guard.ts     # Authentication guard
│   │   │   │   ├── jwt.provider.ts   # JWT token provider
│   │   │   │   └── role.guard.ts     # Role-based access guard
│   │   │   ├── db/                   # Database infrastructure
│   │   │   │   └── prisma.client.ts  # Prisma client configuration
│   │   │   ├── filesystem/           # File system infrastructure
│   │   │   │   └── local.storage.ts  # Local storage implementation
│   │   │   └── storage/              # Storage infrastructure
│   │   │       └── s3.storage.ts     # S3 storage implementation
│   │   ├── modules/                  # Feature modules (Clean Architecture)
│   │   │   ├── auth/                 # Authentication module
│   │   │   │   ├── auth.controller.ts    # Auth controller
│   │   │   │   ├── auth.repository.ts    # Auth repository
│   │   │   │   ├── auth.route.ts         # Auth routes
│   │   │   │   └── auth.service.ts       # Auth business logic
│   │   │   ├── categories/           # Categories module
│   │   │   │   ├── categories.repository.ts
│   │   │   │   ├── categories.route.ts
│   │   │   │   ├── categories.schema.ts  # Category validation schema
│   │   │   │   └── categories.service.ts
│   │   │   ├── product/              # Products module
│   │   │   │   ├── products.repository.ts
│   │   │   │   ├── products.route.ts
│   │   │   │   ├── products.schema.ts    # Product validation schema
│   │   │   │   └── products.service.ts
│   │   │   └── subCategories/        # Subcategories module
│   │   │       ├── subCategories.repository.ts
│   │   │       ├── subCategories.route.ts
│   │   │       ├── subCategories.schema.ts # Subcategory validation schema
│   │   │       └── subCategories.service.ts
│   │   ├── shared/                   # Shared utilities and helpers
│   │   │   ├── errors/               # Error handling
│   │   │   │   └── http-errors.ts    # HTTP error definitions
│   │   │   ├── files/                # File handling utilities
│   │   │   │   └── file.validation.ts # File validation logic
│   │   │   ├── http/                 # HTTP utilities
│   │   │   │   └── swagger.ts        # Swagger documentation
│   │   │   ├── security/             # Security utilities
│   │   │   │   └── hash.ts           # Password hashing utilities
│   │   │   └── validation/           # Input validation
│   │   │       └── auth.ts           # Authentication validation
│   │   ├── server.ts                 # Server configuration
│   │   └── prisma.config.ts          # Prisma configuration
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
│   │           ├── layout.tsx.tsx    # Admin layout
│   │           └── page.tsx          # Admin dashboard
│   ├── data_store/                   # Zustand state management
│   │   └── useCartStore.ts           # Shopping cart store
│   ├── hooks/                        # Custom React hooks
│   │   └── use-mobile.ts             # Mobile detection hook
│   ├── public/                       # Static assets
│   │   └── assets/                   # Application assets
│   │       ├── footer/               # Footer icons and graphics
│   │       ├── header/               # Header icons and graphics
│   │       └── home_screen/          # Home screen assets
│   │           ├── categories/       # Category icons
│   │           └── [other assets]    # Additional home screen assets
│   └── [additional frontend files]   # Additional frontend structure
└── note.txt                          # Project notes
```

## Key Directory Descriptions

### Backend Structure (`backend/`)

#### Clean Architecture Layers

- **`src/infrastructure/`**: Infrastructure layer for external concerns

  - **auth**: JWT authentication, guards, and role-based access control
  - **db**: Database connection and Prisma client configuration
  - **filesystem**: File system abstractions and local storage
  - **storage**: Storage abstractions and S3 integration

- **`src/modules/`**: Feature modules following Clean Architecture pattern

  - Each module contains: repository, route, schema, and service files
  - **auth**: JWT authentication, login, registration, token management
  - **categories**: Product category management with repository pattern
  - **product**: Product CRUD operations with validation schemas
  - **subCategories**: Subcategory management with hierarchical structure

- **`src/shared/`**: Shared utilities and cross-cutting concerns
  - **errors**: HTTP error definitions and handling
  - **files**: File validation and handling utilities
  - **http**: HTTP utilities and Swagger documentation
  - **security**: Password hashing and security utilities
  - **validation**: Input validation schemas and rules

#### Database Layer

- **`prisma/`**: Database layer
  - `schema.prisma`: Database schema with models for users, products, categories, etc.
  - `migrations/`: Database migration history
  - `config.ts`: Prisma configuration with environment variable loading

#### Configuration Files

- **`server.ts`**: Server configuration and setup
- **`index.ts`**: Application entry point
- **`package.json`**: Dependencies including Elysia, Prisma, AWS SDK, JWT libraries

### Frontend Structure (`frontend/`)

#### App Router (`app/`)

- **Route Groups**: Organized using Next.js App Router
  - `(auth)`: Authentication pages (login, signup)
  - `(main)`: Main application pages (home, cart, orders, profile)
  - `admin`: Administrative interface

#### State Management

- **`data_store/`**: Zustand stores for global state management
  - `useCartStore.ts`: Shopping cart state management

#### Component Organization

- Feature-based component structure organized by screen/feature
- Reusable UI components built with Radix UI primitives

#### Styling & Assets

- **`public/assets/`**: Static assets organized by feature
- **`globals.css`**: Global styles and Tailwind imports

## Development Guidelines

### Backend Development

1. **Clean Architecture**: Follow the separation of concerns with infrastructure, modules, and shared layers
2. **Repository Pattern**: Use repositories for data access abstraction
3. **Database Changes**: Create Prisma migrations for schema changes
4. **API Design**: RESTful endpoints with proper HTTP status codes
5. **Authentication**: JWT-based with role-based access control
6. **Validation**: Use schema-based validation for all inputs

### Frontend Development

1. **Component Structure**: Functional components with TypeScript
2. **State Management**: Use Zustand for global state, React hooks for local state
3. **Styling**: Tailwind CSS with custom design system
4. **Routing**: Next.js App Router with proper route grouping

## Key Features Implemented

- **User Authentication**: JWT-based auth with role-based access control
- **Product Management**: CRUD operations with categories and subcategories
- **Shopping Cart**: Add/remove items, quantity management with Zustand
- **File Upload**: S3 integration for product and category images
- **Admin Panel**: User and content management interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation across both frontend and backend
- **Clean Architecture**: Maintainable backend with clear separation of concerns

## Database Schema Highlights

The Prisma schema includes models for:

- **Users**: Authentication and profile data with role management
- **Products**: Product information with categories and attributes
- **Categories/SubCategories**: Hierarchical product organization
- **Orders**: Shopping cart and order management
- **File Uploads**: Image management and storage references

This structure provides a scalable foundation for an e-commerce platform with room for expansion into features like reviews, wishlists, payment processing, and analytics.
