# AGENTS.md - Agent Coding Guidelines for next-level-blog

## Project Overview
- **Project**: A personal blog built with Next.js 15 (App Router), using Notion as headless CMS
- **Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS v4, Mantine UI, Framer Motion
- **Key Libraries**: @notionhq/client, react-notion-x, Zod, Zustand, TanStack Query

---

## Build / Lint / Test Commands

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run pwa              # Dev server with experimental HTTPS

# Build
npm run build            # Production build
npm run start            # Start production server

# Linting
npm run lint             # Run ESLint (next lint)

# No test framework configured - do not add tests
```

---

## Code Style Guidelines

### General Principles
- Follow Next.js App Router conventions with `page.tsx`, `layout.tsx`, `loading.tsx`
- Use Server Components by default; only add `"use client"` when needed
- Keep components focused and single-purpose

### Imports & Path Aliases
- Use `@/` alias for absolute imports (configured in tsconfig.json)
- Order imports: external libs → internal components/hooks → utilities/types
- Example: `import { useState } from "react"` → `import Button from "@/components/ui/Button"` → `import { cn } from "@/lib/utils"`

### TypeScript
- **Strict mode enabled** (`strict: true` in tsconfig.json)
- Avoid `any` types - use proper typing from Notion SDK or Zod schemas
- Use Zod for runtime validation (see `@/types` and `@/helpers/post-mapping.ts`)
- Export types for shared interfaces

### Naming Conventions
- **Components**: PascalCase (`NewProfile.tsx`, `PostCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useFetchPosts.ts`, `useLayoutStore.ts`)
- **Files**: kebab-case for utilities (`post-mapping.ts`, `notion-client.ts`)
- **Folders**: kebab-case (`components/home/`, `app/posts/`)

### Error Handling
- Use try-catch blocks in Server Actions (see `@/lib/notion-api.ts`)
- Log errors with `console.error` for debugging
- Return empty arrays or graceful fallbacks rather than crashing
- Consider implementing a centralized error handling utility

### Component Patterns
- Use `export default` for page/leaf components
- Use named exports for reusable components
- Extract sub-components into separate files (avoid large files like `NewProfile.tsx` growing too large)
- Use Radix UI primitives in `@/components/ui/` for accessible base components

### UI Framework
- Primary: Tailwind CSS v4 with `@tailwindcss/postcss`
- Secondary: Mantine UI for complex components (dialogs, forms, etc.)
- Use `cn()` utility from `@/lib/utils` to merge Tailwind classes
- Avoid mixing Mantine and Tailwind unnecessarily

### State Management
- Zustand for global client state (see hooks like `useLayoutStore`)
- TanStack Query for server state / data fetching
- React `useState` for local component state

### Server Actions
- Place in `@/actions` or inline in `app/` directory
- Use for Notion API calls and mutations
- Implement proper revalidation with `revalidatePath` and `revalidateTag`

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
- Consider adding Zod validation for `siteMetadata`

### Revalidation
- On-demand revalidation via `app/api/revalidate/route.ts`
- Use `revalidatePath` in Server Actions after content updates
- Protect revalidation endpoint with secret token (see improvement plan)

---

## What NOT To Do
- Do NOT add Jest, Vitest, or any test framework (not configured)
- Do NOT use JavaScript - use TypeScript
- Do NOT use the `any` type without justification
- Do NOT create large component files - extract sub-components
- Do NOT mix styling frameworks unnecessarily (pick Tailwind or Mantine per component)

---

## Sub-Agents

### code-reviewer
Specialized for reviewing code quality, security, performance, and best practices.
```bash
/review file:components/home/NewProfile.tsx
```

### code-refactorer
Specialized for improving code structure, readability, and maintainability.
```bash
/refactor file:components/home/NewProfile.tsx
```

### architect
Plans features with React/Next.js best practices before implementation. Considers component hierarchy, data flow, rendering strategy, and file structure.
```bash
/plan feature:add-search-to-blog
```

### documentation-writer
Adds comprehensive JSDoc comments and documentation to code.
```bash
/document file:lib/notion-api.ts
```

### test-engineer
Expert in unit, integration, and E2E testing with Vitest and Playwright.
```bash
/test file:lib/utils.ts
```

---

## External Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Mantine UI](https://mantine.dev/)
- [Notion API](https://developers.notion.com/)
- [react-notion-x](https://github.com/NotionX/react-notion-x)