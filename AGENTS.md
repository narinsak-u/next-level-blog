# AGENTS.md - Agent Coding Guidelines for next-level-blog

## Project Overview
- **Project**: Personal blog with Next.js 16.2 (App Router), Notion as headless CMS
- **Stack**: React 19, TypeScript (strict mode), Tailwind CSS v4, Mantine UI v8, Framer Motion
- **Key Libraries**: @notionhq/client, react-notion-x, Zod v4, Zustand v5, TanStack Query v5, Vitest, Playwright
- **Runtime**: Bun

## Build / Lint / Test Commands

```bash
# Development
bun run dev              # Start dev server with Turbopack
bun run pwa              # Dev server with experimental HTTPS
bun run build            # Production build
bun run start            # Start production server

# Linting
bun run lint             # Run ESLint (flat config, eslint.config.mjs)

# Unit Testing (Vitest) — tests in tests/unit/ and tests/integration/
bun test                 # Run all unit tests in watch mode
bun test:run             # Run all unit tests once
bun test:coverage        # Run tests with coverage

# Run a single test file
bun vitest run tests/unit/hooks/useTheme.test.ts
bun vitest run tests/integration/components/ShareButton.test.tsx

# Run tests matching a name pattern
bun vitest run --testNamePattern="TH-001"

# E2E Testing (Playwright) — tests in tests/e2e/
bun test:e2e             # Run all E2E tests
bun test:e2e:ui          # Run Playwright with UI mode
bun test:e2e:debug       # Run Playwright in debug mode
```

---

## Code Style Guidelines

### General Principles
- Follow Next.js App Router conventions: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`
- Server Components by default; add `"use client"` only when browser APIs or state are needed
- Use `"use server"` in actions directory for Server Actions
- Run `bun run lint` before committing

### Imports & Path Aliases
- Use `@/` alias (maps to project root via tsconfig.json paths)
- Order: external libs → `@/components|hooks` → `@/actions|helpers|lib` → `@/types`
- Use `import type { ... }` for type-only imports (https://typescript-eslint.io/blog/consistent-type-imports-and-exports/)
- Use double quotes for all import strings
- End import statements with semicolons

```tsx
import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PageDataSchemaType } from "@/types";
```

### TypeScript
- **Strict mode** enabled in tsconfig — avoid `any` at all costs
- Use Zod v4 for runtime validation; schemas live in `@/types/<name>.ts`
- Pattern: define schema → export schema + `z.infer<typeof Schema>` as `XxxSchemaType`
- Use `interface` for public APIs / props, `type` for unions/intersections
- No `@ts-ignore` or `@ts-expect-error` without justification

### Naming Conventions
- **Components**: PascalCase (`PostCard.tsx`, `ShareButton.tsx`)
- **Hooks**: camelCase with `use` prefix (`useFetchPosts.ts`)
- **Files**: kebab-case (`post-mapping.ts`, `notion-client.ts`)
- **Folders**: kebab-case (`components/home/`, `app/posts/`)
- **Constants**: SCREAMING_SNAKE_CASE with `as const` assertion

### Error Handling
- Use custom error classes: `AppError`, `NotionAPIError`, `ValidationError`, `NotFoundError`, `AuthenticationError`
- Use `handleError()` in `@/lib/errors.ts` to normalize caught errors
- Server Actions: try-catch with `console.error` logging; return empty arrays or `null` fallbacks
- Validate all external inputs (Notion API responses, user input) with Zod

### Component Patterns
- **Named exports** for reusable components; `export default` only for page/layout components
- **Explicit variants** over boolean props: `PostCardGrid` / `PostCardList` instead of `<PostCard layout="grid" />`
- **Compound components** for related sub-components: `ShareGroup.Button`
- **Context + hook** for shared state: `MusicPlayerProvider` + `useMusicPlayer()`
- Keep files under ~300 lines; extract sub-components into separate files
- Use CVA (`class-variance-authority`) for multi-variant components like `Button`

### UI Framework
- **Primary**: Tailwind CSS v4 with `@tailwindcss/postcss`
- **Secondary**: Mantine UI v8 for complex components (Card, Modal, SegmentedControl)
- Merge classes with `cn()` utility from `@/lib/utils`

### State Management
- Zustand v5 with `persist` middleware for global client state
- TanStack Query v5 for server state / data fetching (including infinite queries)
- React `useState` / `useCallback` for local component state

### Testing Patterns
- **Tests by layer**: `tests/unit/` for pure logic, `tests/integration/components/` for rendered components
- **Test ID convention**: `COMPONENT-INITIALS-XXX` for describe blocks (e.g., `SB-001`, `TH-001`)
- **AAA pattern**: Arrange, Act, Assert — one assertion per `it()` block preferred
- **Vitest setup** (`tests/setup.ts`): mocks @mantine/core, @mantine/hooks, next/navigation
- **Fixtures** in `tests/fixtures/`: `notion-response.ts`, `posts.ts`
- Use `@testing-library/react` (`render`, `screen`) for component tests

---

## Directory Structure

```
@/           → project root
@/app/       → Next.js App Router with domain-based layout
@/app/(home)/         → Landing page: components/, context/, hooks/
@/app/_layout/        → Global layout components (Header, Footer, Layout, Menu, PageLayout)
@/app/posts/          → Posts domain: components/, hooks/, helpers/, actions/
@/app/posts/[slug]/   → Individual post pages
@/app/tags/           → Tags routes
@/app/about/          → About page
@/app/note/           → Notes page
@/app/hobbies/        → Hobbies/projects page
@/app/api/            → API routes (revalidate, post-dates, ai-summary)
@/components/         → Shared UI primitives (Button, Kbd, Loader, ScrollToTop, etc.)
@/components/ui/      → Button, FloatingButton, MediaBackground, ShortcutList, etc.
@/components/common/  → Loader, ThemeCheck, ThemeMode, Spotlight, Player, etc.
@/components/icons/   → Shared icon components
@/components/providers/ → MantineProviders, query-provider
@/hooks              → Shared hooks: useTheme, use-video-with-placeholder
@/lib                → Utilities (utils.ts, errors.ts, constants.ts, notion-client.ts, notion-api.ts)
@/types              → Zod schemas + inferred types (page-data.ts, post-tag.ts, tag.ts, etc.)
@/site               → Metadata config and static data
@/styles             → Global CSS (Tailwind), theme.ts, notion-custom.css
@/tests              → Unit tests (unit/), integration (integration/), E2E (e2e/), fixtures (fixtures/)
```

### Import Examples
```tsx
// Layout components
import Layout from "@/app/_layout/components/Layout";

// Posts domain
import { fetchPosts } from "@/app/posts/actions";
import { PostCardGrid } from "@/app/posts/components/PostCard";
import useFetchPosts from "@/app/posts/hooks/use-fetch-posts";

// Home domain
import NewProfile from "@/app/(home)/components/NewProfile";
import { useMusicPlayer } from "@/app/(home)/context/MusicPlayerContext";

// Shared UI
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PageDataSchemaType } from "@/types";
```

---

## Important Patterns

### Notion Data Flow
1. Author writes in Notion → 2. Server Actions in `@/app/posts/actions/posts.ts` fetch via `@notionhq/client` → 3. `mapNotionResultsToPosts()` transforms with Zod validation → 4. Components render with `react-notion-x`

### Zod Validation
```tsx
const PageDataSchema = z.object({ id: z.string(), title: z.string(), ... });
type PageDataSchemaType = z.infer<typeof PageDataSchema>;

// Throwing validation
const data = PageDataSchema.parse(input);

// Graceful handling
const result = PageDataSchema.safeParse(input);
if (!result.success) { console.error(result.error); return fallback; }
```

### Revalidation
- On-demand revalidation via `app/api/revalidate/route.ts`
- Use `revalidatePath` / `revalidateTag` in Server Actions after content updates

### Performance
- Use `React.cache()` for per-request deduplication of async data fetches
- Use `Promise.all()` for parallel data fetching in Server Components
- Use `next/dynamic` for heavy components (Video, Tweet)
- Avoid `useCallback` with object/array dependencies; prefer primitive deps

---

## What NOT To Do
- Do NOT use JavaScript — use TypeScript
- Do NOT use `any` without explicit justification
- Do NOT create large component files — extract sub-components
- Do NOT mix Tailwind and Mantine unnecessarily
- Do NOT commit without running `bun run lint`
- Do NOT use `@ts-ignore` — use `@ts-expect-error` with a reason if unavoidable
- Do NOT over-abstract — prefer duplication over the wrong abstraction
