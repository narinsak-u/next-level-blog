# AGENTS.md - Agent Coding Guidelines for next-level-blog

## Project Overview
- **Project**: A personal blog built with Next.js 15 (App Router), using Notion as headless CMS
- **Stack**: Next.js 16.2, React 19, TypeScript, Tailwind CSS v4, Mantine UI, Framer Motion
- **Key Libraries**: @notionhq/client, react-notion-x, Zod, Zustand, TanStack Query, Vitest, Playwright

---

## Build / Lint / Test Commands

```bash
# Development
bun run dev              # Start dev server with Turbopack
bun run pwa              # Dev server with experimental HTTPS

# Build
bun run build            # Production build
bun run start            # Start production server

# Linting
bun run lint             # Run ESLint (next lint)

# Unit Testing (Vitest)
bun run test             # Run all unit tests in watch mode
bun run test:run         # Run all unit tests once
bun run test:coverage    # Run tests with coverage report
bun run test:watch      # Run tests in watch mode

# E2E Testing (Playwright)
bun run test:e2e        # Run Playwright tests
bun run test:e2e:ui     # Run Playwright with UI mode
bun run test:e2e:debug  # Run Playwright in debug mode

# Run a single test file
bun vitest run path/to/test.file.ts
bun vitest run --testNamePattern="test name"
```

---

## Code Style Guidelines

### General Principles
- Follow Next.js App Router conventions with `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- Use Server Components by default; only add `"use client"` when needed
- Keep components focused and single-purpose
- Run `bun run lint` before committing

### Imports & Path Aliases
- Use `@/` alias for absolute imports (configured in tsconfig.json)
- Order imports: external libs → internal components/hooks → utilities/types
- Example: `import { useState } from "react"` → `import Button from "@/components/ui/Button"` → `import { cn } from "@/lib/utils"`
- Group related imports together with blank lines between groups

### TypeScript
- **Strict mode enabled** (`strict: true` in tsconfig.json)
- Avoid `any` types - use proper typing from Notion SDK or Zod schemas
- Use Zod for runtime validation (see `@/types` and `@/helpers/post-mapping.ts`)
- Export types for shared interfaces
- Use `interface` for public APIs, `type` for unions/intersections

### Naming Conventions
- **Components**: PascalCase (`NewProfile.tsx`, `PostCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useFetchPosts.ts`, `useLayoutStore.ts`)
- **Files**: kebab-case for utilities (`post-mapping.ts`, `notion-client.ts`)
- **Folders**: kebab-case (`components/home/`, `app/posts/`)
- **Constants**: SCREAMING_SNAKE_CASE for config constants

### Error Handling
- Use try-catch blocks in Server Actions (see `@/lib/notion-api.ts`)
- Log errors with `console.error` for debugging
- Return empty arrays or graceful fallbacks rather than crashing
- Create custom error types for domain-specific errors

### Component Patterns

#### Explicit Variants (Preferred)
Instead of boolean props like `isGrid`, `isList`, create explicit variant components:
```tsx
// Instead of this:
<PostCardBase post={post} layout="grid" />

// Use this:
<PostCardGrid post={post} />
<PostCardList post={post} />
```

#### Compound Components
Use compound components with shared context for complex stateful UI:
```tsx
// Well-structured compound component (see ManifestoPanel.tsx)
const ManifestoPanel = {
  Provider: ManifestoPanelProvider,
  Trigger: ManifestoTrigger,
  Content: ManifestoContent,
  CloseButton: ManifestoCloseButton,
};
```

#### Boolean Props Anti-pattern
Avoid adding boolean props (`isOpen`, `isDisabled`, `showX`) that multiply component states:
- Each boolean doubles possible states
- Use explicit variants or compound components instead
- See `components/ui/PostCard.tsx` for good examples

#### General Guidelines
- Use `export default` for page/leaf components
- Use named exports for reusable components
- Extract sub-components into separate files (avoid large files like `NewProfile.tsx` growing too large)
- Use Radix UI primitives in `@/components/ui/` for accessible base components
- Keep component files under 300 lines; split if larger
- Use CVA (class-variance-authority) for button variants (see `components/ui/button.tsx`)

### UI Framework
- Primary: Tailwind CSS v4 with `@tailwindcss/postcss`
- Secondary: Mantine UI for complex components (dialogs, forms, etc.)
- Use `cn()` utility from `@/lib/utils` to merge Tailwind classes
- Avoid mixing Mantine and Tailwind unnecessarily
- Use Tailwind's `@apply` sparingly; prefer utility classes

### State Management
- Zustand for global client state (see hooks like `useLayoutStore`)
- TanStack Query for server state / data fetching
- React `useState` for local component state

### Server Actions
- Place in `@/actions` or inline in `app/` directory
- Use for Notion API calls and mutations
- Implement proper revalidation with `revalidatePath` and `revalidateTag`
- Validate all inputs using Zod before processing

### Testing Guidelines
- Write unit tests in `*.test.ts` or `*.spec.ts` files
- Write E2E tests in `e2e/*.test.ts`
- Test components with React Testing Library
- Mock external dependencies (Notion API, etc.)
- Follow AAA pattern: Arrange, Act, Assert

### Test Dependencies
The following packages are required for testing (ensure they're installed):
```bash
bun add -d jsdom @testing-library/react @testing-library/jest-dom
```

**Known test failures**: 31 tests fail due to incomplete mocks for `next/navigation` and Mantine components. These need mock fixes but don't block refactoring work.

---

## Directory Structure (Key Paths)

```
@/           → project root
@/app/       → Next.js App Router pages
@/components → React components (organized by domain)
@/actions    → Server Actions
@/hooks      → Custom React hooks
@/helpers    → Data transformation (post-mapping.ts)
@/lib        → Utilities (utils.ts, notion-client.ts)
@/types      → TypeScript definitions with Zod
@/site       → Site configuration and data
@/e2e        → Playwright E2E tests
```

---

## Important Patterns

### Notion Data Flow
1. Author writes in Notion
2. Server Actions fetch via `@notionhq/client`
3. `postMapping()` transforms raw data using `PageDataSchema.parse()`
4. Components render using `react-notion-x`

### Zod Validation
- Define schemas in `@/types` for runtime validation
- Use `PageDataSchema` for post data validation
- Use `.parse()` for throwing validation, `.safeParse()` for graceful handling

### Revalidation
- On-demand revalidation via `app/api/revalidate/route.ts`
- Use `revalidatePath` in Server Actions after content updates
- Protect revalidation endpoint with secret token

---

## What NOT To Do
- Do NOT use JavaScript - use TypeScript
- Do NOT use the `any` type without justification
- Do NOT create large component files - extract sub-components
- Do NOT mix styling frameworks unnecessarily (pick Tailwind or Mantine per component)
- Do NOT commit without running `bun run lint` and `bun run test:run`

---

## Sub-Agents

### code-reviewer
Reviews code quality, security, performance, and best practices.
```bash
/review file:components/home/NewProfile.tsx
```

### code-refactorer
Improves code structure, readability, and maintainability.
```bash
/refactor file:components/home/NewProfile.tsx
```

### architect
Plans features with React/Next.js best practices before implementation.
```bash
/plan feature:add-search-to-blog
```

### documentation-writer
Adds comprehensive JSDoc comments and documentation to code.
```bash
/document file:lib/notion-api.ts
```

### test-engineer
Writes unit and E2E tests with Vitest and Playwright.
```bash
/test file:lib/utils.ts
```

---

## External Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Mantine UI](https://mantine.dev/)
- [Notion API](https://developers.notion.com/)
- [react-notion-x](https://github.com/NotionX/react-notion-x)
- [Vitest Docs](https://vitest.dev/)
- [Playwright Docs](https://playwright.dev/)

---

## Performance Guidelines

### Critical (Waterfalls & Bundle Size)
- Use `Promise.all()` for parallel data fetching in server components
- Avoid fetching all posts to find one - use direct Notion filter by ID
- Use `next/dynamic` for heavy components (Video, Tweet, etc.)
- Import icons directly: `import { Check } from 'lucide-react/dist/esm/icons/check'`

### High (Server Performance)
- Use `React.cache()` for per-request deduplication of expensive operations
- Add `revalidate` tags to static pages to reduce Notion API calls
- Hoist static I/O (config, constants) to module level

### Medium (Re-renders)
- Use refs for values that change frequently but shouldn't trigger re-renders
- Avoid `useCallback` with object/array dependencies that recreate on every render
- Use `useMemo` only for expensive computations, not simple primitives
- Don't define components inside components - extract to file scope
