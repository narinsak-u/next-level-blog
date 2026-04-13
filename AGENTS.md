# AGENTS.md - Agent Coding Guidelines for next-level-blog

## Project Overview
- **Project**: Personal blog with Next.js 15 (App Router), Notion as headless CMS
- **Stack**: Next.js 16.2, React 19, TypeScript, Tailwind CSS v4, Mantine UI, Framer Motion
- **Key Libraries**: @notionhq/client, react-notion-x, Zod, Zustand, TanStack Query, Vitest, Playwright
- **Runtime**: Bun

---

## Build / Lint / Test Commands

```bash
# Development
bun run dev              # Start dev server with Turbopack
bun run build            # Production build
bun run start            # Start production server

# Linting & Formatting
bun run lint             # Run ESLint
bun run format           # Run Prettier (if available)

# Unit Testing (Vitest)
bun test                 # Run all unit tests in watch mode
bun test run             # Run all unit tests once
bun test run --coverage # Run tests with coverage

# Run a single test file
bun vitest run path/to/test.file.ts
bun vitest run --testNamePattern="test name"

# E2E Testing (Playwright)
bun run test:e2e         # Run Playwright tests
bun run test:e2e:ui      # Run Playwright with UI mode
```

---

## Code Style Guidelines

### General Principles
- Follow Next.js App Router conventions: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- Use Server Components by default; add `"use client"` only when needed
- Run `bun run lint` before committing

### Imports & Path Aliases
- Use `@/` alias for absolute imports (maps to project root)
- Order: external libs → internal components/hooks → utilities/types
- Example: `import { useState } from "react"` → `import Button from "@/components/ui/Button"` → `import { cn } from "@/lib/utils"`

### TypeScript
- **Strict mode enabled** - avoid `any` types
- Use Zod for runtime validation (schemas in `@/types`)
- Use `interface` for public APIs, `type` for unions/intersections

### Naming Conventions
- **Components**: PascalCase (`PostCard.tsx`, `Button.tsx`)
- **Hooks**: camelCase with `use` prefix (`useFetchPosts.ts`)
- **Files**: kebab-case (`post-mapping.ts`, `notion-client.ts`)
- **Folders**: kebab-case (`components/home/`, `app/posts/`)
- **Constants**: SCREAMING_SNAKE_CASE

### Error Handling
- Use try-catch in Server Actions
- Log errors with `console.error` for debugging
- Return empty arrays or graceful fallbacks rather than crashing

### Component Patterns

#### Explicit Variants (Preferred)
```tsx
// Instead of:
<PostCardBase post={post} layout="grid" />

// Use:
<PostCardGrid post={post} />
<PostCardList post={post} />
```

#### Boolean Props Anti-pattern
Avoid boolean props (`isOpen`, `isDisabled`) that multiply component states. Use compound components or explicit variants instead.

#### General Guidelines
- Use `export default` for page components, named exports for reusable components
- Extract sub-components into separate files
- Keep component files under 300 lines
- Use CVA for button variants

### UI Framework
- Primary: Tailwind CSS v4 with `@tailwindcss/postcss`
- Secondary: Mantine UI for complex components
- Use `cn()` utility from `@/lib/utils` to merge Tailwind classes

### State Management
- Zustand for global client state
- TanStack Query for server state / data fetching
- React `useState` for local component state

### Server Actions
- Place in `@/actions` or inline in `app/` directory
- Use `revalidatePath`/`revalidateTag` after mutations
- Validate all inputs using Zod

### Testing
- Write unit tests in `tests/**/*.test.{ts,tsx}`
- Write E2E tests in `e2e/**/*.test.ts`
- Follow AAA pattern: Arrange, Act, Assert

---

## Directory Structure

```
@/           → project root
@/app/       → Next.js App Router pages
@/components → React components (organized by domain)
@/actions    → Server Actions
@/hooks      → Custom React hooks
@/helpers    → Data transformation utilities
@/lib        → Utilities (utils.ts, notion-client.ts)
@/types      → TypeScript definitions with Zod schemas
@/tests      → Unit tests
@/e2e        → Playwright E2E tests
```

---

## Important Patterns

### Notion Data Flow
1. Author writes in Notion → 2. Server Actions fetch via `@notionhq/client` → 3. `postMapping()` transforms with `PageDataSchema` → 4. Components render with `react-notion-x`

### Zod Validation
- Use `.parse()` for throwing validation, `.safeParse()` for graceful handling

### Revalidation
- On-demand via `app/api/revalidate/route.ts`
- Use `revalidatePath` in Server Actions after content updates

---

## What NOT To Do
- Do NOT use JavaScript - use TypeScript
- Do NOT use `any` without justification
- Do NOT create large component files - extract sub-components
- Do NOT mix Tailwind and Mantine unnecessarily
- Do NOT commit without running `bun run lint`

---

## Performance Guidelines

### Critical
- Use `Promise.all()` for parallel data fetching in server components
- Avoid fetching all posts to find one - use direct Notion filter by ID
- Use `next/dynamic` for heavy components (Video, Tweet)

### High
- Use `React.cache()` for per-request deduplication
- Add `revalidate` tags to static pages

### Medium
- Avoid `useCallback` with object/array dependencies
- Use `useMemo` only for expensive computations
- Don't define components inside components