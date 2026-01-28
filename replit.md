# Probability Learning Hub

## Overview

This is an interactive educational web application that teaches probability concepts through fun mini-games. The app features a 3D spinner wheel that randomly selects one of four probability-based games: Coin Flip, Dice Kingdom, Marble Collector, and Plinko. Each game demonstrates different probability concepts while tracking player statistics and scores.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

- **Framework**: React with TypeScript, built using Vite
- **3D Graphics**: Three.js via React Three Fiber (@react-three/fiber) with Drei helpers and post-processing effects
- **Styling**: Tailwind CSS with shadcn/ui component library (Radix UI primitives)
- **State Management**: Zustand stores with selector subscriptions for game state, audio, and probability game logic
- **Animations**: Framer Motion for game transitions and UI animations
- **Font**: Inter font family via @fontsource

### Backend Architecture

- **Server**: Express.js with TypeScript
- **Development**: Vite dev server with HMR integration
- **Build**: esbuild for server bundling, Vite for client bundling
- **API Pattern**: RESTful routes prefixed with `/api`

### Data Layer

- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL via Neon serverless driver (@neondatabase/serverless)
- **Schema Location**: `shared/schema.ts` - shared between client and server
- **Storage Pattern**: Interface-based storage abstraction (`IStorage`) with in-memory implementation (`MemStorage`) - can be swapped for database-backed implementation

### Project Structure

```
client/           # React frontend
  src/
    components/   # UI components including game UIs and shadcn components
    lib/stores/   # Zustand state stores
    hooks/        # Custom React hooks
    pages/        # Page components
server/           # Express backend
  index.ts        # Server entry point
  routes.ts       # API route definitions
  storage.ts      # Data storage interface
  vite.ts         # Vite dev server integration
shared/           # Shared code between client and server
  schema.ts       # Drizzle database schema
```

### Key Design Decisions

1. **Shared Schema Pattern**: Database types and schemas are defined in `shared/schema.ts` and imported by both client and server, ensuring type safety across the stack.

2. **Storage Abstraction**: The `IStorage` interface allows swapping between in-memory storage (for development/testing) and database-backed storage without changing application code.

3. **3D Game Integration**: React Three Fiber is used only for the spinner wheel component, while other mini-games use standard 2D React components for better performance.

4. **Audio Management**: Centralized audio state management via Zustand store with mute toggle and sound effect playback.

5. **Path Aliases**: TypeScript path aliases (`@/*` for client, `@shared/*` for shared) simplify imports across the codebase.

## External Dependencies

### Database
- **PostgreSQL**: Primary database via Neon serverless driver
- **Connection**: Requires `DATABASE_URL` environment variable

### UI Component Libraries
- **Radix UI**: Headless UI primitives (dialog, dropdown, tabs, etc.)
- **shadcn/ui**: Pre-styled component implementations

### 3D Graphics
- **Three.js**: Core 3D rendering
- **React Three Fiber**: React renderer for Three.js
- **React Three Drei**: Useful Three.js helpers
- **React Three Postprocessing**: Visual effects

### Build Tools
- **Vite**: Frontend development and bundling
- **esbuild**: Server-side bundling
- **vite-plugin-glsl**: GLSL shader support

### State and Data
- **Zustand**: Client-side state management
- **TanStack Query**: Server state and caching
- **Drizzle ORM**: Database queries and migrations
- **Zod**: Schema validation (via drizzle-zod)