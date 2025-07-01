# Full-Stack Web Application with Express & React

## Overview

This is a full-stack e-commerce web application built with Express.js backend and React frontend, featuring a modern UI with shadcn/ui components and Drizzle ORM for database management. The application is designed as an Amazon-style marketplace with Shopify branding, featuring product browsing, detailed product pages, user authentication, and category-based shopping.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React Hook Form with Zod validation
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Development**: Hot reload with tsx for TypeScript execution
- **Build**: esbuild for production bundling

### Database Strategy
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: Shared schema definitions in `/shared/schema.ts`
- **Migrations**: Stored in `/migrations` directory
- **Connection**: Neon Database serverless PostgreSQL

## Key Components

### Database Schema
- **Users Table**: Basic user authentication with username/password
- **Schema Validation**: Zod schemas for type-safe data validation
- **Storage Interface**: Abstracted storage layer with in-memory fallback for development

### Frontend Components
- **Comprehensive UI Kit**: 40+ shadcn/ui components including forms, navigation, data display
- **Custom Hooks**: Mobile detection, toast notifications
- **Form Management**: React Hook Form with Zod resolver integration
- **Theme System**: CSS custom properties with light/dark mode support

### Backend Services
- **Route Management**: Centralized route registration system
- **Storage Abstraction**: Interface-based storage with memory implementation
- **Development Middleware**: Request logging and error handling
- **Vite Integration**: SSR-ready development server setup

## Data Flow

1. **Client Requests**: React components make API calls through TanStack Query
2. **API Layer**: Express routes handle HTTP requests with JSON middleware
3. **Data Layer**: Storage interface abstracts database operations
4. **Response Handling**: Standardized error handling and JSON responses
5. **State Management**: Client-side state synchronized with server state

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form state management
- **zod**: Runtime schema validation

### UI Dependencies
- **@radix-ui/***: Accessible component primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management

### Development Dependencies
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: JavaScript bundler for production

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with HMR on client directory
- **Backend**: tsx with watch mode for hot reload
- **Database**: Drizzle push for schema synchronization

### Production
- **Frontend**: Vite build to `/dist/public`
- **Backend**: esbuild bundle to `/dist/index.js`
- **Database**: PostgreSQL with Neon serverless
- **Serving**: Express serves both API and static files

### Build Process
1. `npm run build`: Builds both frontend and backend
2. Frontend assets compiled to `/dist/public`
3. Backend bundled as ESM module to `/dist`
4. `npm start`: Runs production server

## Recent Changes
- **June 30, 2025**: Fixed authentication system and enhanced user experience
  - Fixed login credentials issue - authentication now works perfectly
  - Added complete signup functionality with form validation
  - Fixed image loading issues with reliable image URLs
  - Enhanced product display with discount pricing system:
    - Red discount badges showing percentage off (e.g., "-20% OFF")
    - Original prices with strikethrough effect
    - Star ratings and review counts
    - Professional Amazon-style product cards
  - Improved login/signup interface with tabbed design
  - Added quick-fill demo credential buttons
  - Enhanced responsive design and visual polish
- **June 30, 2025**: Transformed into Amazon-style e-commerce marketplace
  - Dashboard is now the main landing page (no login required for browsing)
  - Added 21 products across 7 categories (Electronics, Fashion, Home & Kitchen, Sports & Outdoors, Books & Media, Home & Garden, Beauty & Personal Care)
  - Created individual product detail pages with full Amazon-style layout
  - Added category navigation and filtering
  - Implemented "Add to Cart" functionality that prompts login
  - Products are clickable and lead to detailed product pages
  - Enhanced responsive design for mobile and desktop

## Changelog
- June 30, 2025: Enhanced with user/admin authentication system and product dashboard
- June 30, 2025: Added role-based login (Customer/Administrator) with demo credentials
- June 30, 2025: Created product management with search functionality and responsive design
- June 30, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.