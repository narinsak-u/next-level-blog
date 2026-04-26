# Project Overview: next-level-blog

## Introduction
`next-level-blog` is a sophisticated personal blog platform built with **Next.js 16.2**, utilizing the **App Router** for optimized routing and server-side rendering. It uniquely integrates **Notion** as a headless CMS, allowing for a seamless writing experience in Notion and a high-performance, customizable presentation layer on the web.

## Purpose
The project serves as a personal portfolio and knowledge-sharing hub. It is designed to be:
- **Fast:** Leverages Next.js server components, Turbopack, React.cache(), TanStack Query prefetching, and Suspense boundaries for optimal loading.
- **Aesthetic:** Uses Framer Motion (LazyMotion + domAnimation) for animations and Mantine UI with glassmorphism styling.
- **Dynamic:** Content is fetched in real time or at build time from Notion databases and pages.
- **Interactive:** Includes a music player, spotlight search, and a manifesto section with animations.

## Directory Structure & Architecture

```
@/                  → Project root
├── app/            → Next.js App Router pages
│   ├── home/       → HomeContent client component
│   ├── posts/      → Blog post listing and dynamic [slug] pages
│   ├── about/      → Static content pages (about, hobbies, note)
│   ├── hobbies/
│   ├── note/
│   ├── tags/       → Tag filtering pages
│   └── api/        → API routes (revalidate endpoint)
├── components/     → React components organized by domain
│   ├── home/       → Landing page components (NewProfile, MainProfile, ManifestoPanel)
│   ├── contents/   → Content rendering components (Content, ContentBody, Comments)
│   ├── common/     → Reusable utilities (ScrollToTop, ThemeMode, Spotlight)
│   ├── layout/     → Layout components (Header, Footer, Layout)
│   └── ui/         → Design primitives and compound components
├── context/        → React Context providers
│   └── MusicPlayerContext.tsx  → Stable callback refs for play/pause/toggle
├── hooks/           → Custom React hooks
│   ├── useTheme.ts
│   ├── use-layout-store.ts
│   ├── use-mode-store.ts
│   ├── use-fetch-all-posts.ts
│   ├── use-fetch-posts.ts
│   ├── use-fetch-posts-by-tag.ts
│   ├── use-get-related-posts.ts
│   ├── use-get-posts-by-tag.ts
│   ├── use-get-tweet-id.ts
│   └── use-video-with-placeholder.ts  → Shared video loading state
├── actions/         → Unified Server Actions for Notion CMS
│   └── posts.ts    → All fetch functions with React.cache()
├── lib/             → Utilities, constants, and domain logic
│   ├── post-logic.ts   → Pure domain logic for posts
│   ├── notion-client.ts → Official Notion SDK client
│   ├── notion-api.ts   → Unofficial Notion SDK (notion-client)
│   ├── utils.ts
│   ├── constants.ts
│   └── errors.ts
├── types/           → TypeScript definitions with Zod schemas (split modules)
│   ├── post-tag.ts     → PostTagSchema
│   ├── tag.ts          → TagSchema
│   ├── content-header.ts → ContentHeaderSchema
│   ├── page-data.ts    → PageDataSchema
│   ├── site-metadata.ts → SiteMetadataSchema
│   └── index.ts        → Barrel re-exports
└── site/            → Site configuration
```

## Key Architecture Patterns

### Compound Components
Components composed of smaller, reusable parts using the compound component pattern:

| Component | Sub-components |
|-----------|---------------|
| `FloatingButtonGroup` | `FloatingButtonGroup.Button` |
| `ShareGroup` | `ShareGroup.Button` |
| `MediaBackground` | `MediaBackground.Video`, `MediaBackground.Image` |
| `ManifestoPanel` | `ManifestoPanel.Trigger`, `ManifestoPanel.Content`, `ManifestoPanel.CloseButton` |
| `PostCard` | `PostCardGrid`, `PostCardList`, `TagItemInline` |

### Context Providers
Global state management using React Context:

- `MusicPlayerContext` — Music player state with stable callback refs (no re-renders on play/pause toggle)

### Custom Hooks
- `useTheme()` — Consolidated theme access with memoized values
- `useLayoutStore()` — Zustand store for layout state (grid/list preference)
- `useModeStore()` — Zustand store for mode state (focused/jianghu)
- `useFetchPosts()` — Infinite scrolling with TanStack Query
- `useFetchAllPosts()` — All posts with TanStack Query
- `useFetchPostsByTag()` — Filters cached posts by tag
- `useMusicPlayer()` — Music playback control with stable ref callbacks
- `useVideoWithPlaceholder()` — Shared video loading state hook

### Data Fetching Patterns

**Server Components:** `React.cache()` wraps all server actions for per-request deduplication. No duplicate `cache()` wrappers needed at call sites.

**Client Hydration:** TanStack Query with SSR prefetch via `HydrationBoundary` for instant client-side data availability.

**Parallel Fetching:** `Promise.all()` for independent server-side data fetches (e.g., post data + all posts prefetch in `[slug]` layout).

**Suspense Boundaries:** Content pages wrapped in `<Suspense>` for streaming SSR and meaningful loading states.

### Type Module Split
Types are split into individual modules (`post-tag.ts`, `tag.ts`, etc.) with a barrel re-export, allowing tree-shaking and direct imports in hot paths.

## Core Workflows

1. **Content Management:** The author writes and manages posts in a Notion database.
2. **Data Access:** The unified `actions/posts.ts` module fetches and maps data internally, ensuring it matches the `PageDataSchema`. All functions use `React.cache()` for deduplication.
3. **Domain Logic:** Business rules (like post relation and tag filtering) are processed in `lib/post-logic.ts`.
4. **Rendering:** Individual posts are rendered using `react-notion-x`, wrapped in `ContentErrorBoundary` and `Suspense`. The `Comments` component (giscus) is dynamically imported with `ssr: false`.
5. **Performance:** Infinite scrolling, `React.cache()`, `Promise.all()`, TanStack Query prefetch, Suspense boundaries, dynamic imports (Code, Equation, Pdf, Modal, Tweet, Comments), and `LazyMotion` with `domAnimation`.

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| UI | React 19, Mantine UI, Tailwind CSS v4 |
| Animation | Framer Motion (LazyMotion + domAnimation) |
| CMS | Notion (via `@notionhq/client` + `react-notion-x`) |
| State | Zustand (persist), TanStack Query (server state) |
| Validation | Zod |
| Testing | Vitest, Playwright, Testing Library |
| Deployment | Vercel |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NOTION_TOKEN` | Notion API integration token |
| `NOTION_DATA_SOURCE_ID` | Notion data source ID |
| `NOTION_ABOUT_PAGE_ID` | Notion page ID for about page |
| `NOTION_NOTE_PAGE_ID` | Notion page ID for notes |
| `NOTION_PROJECT_PAGE_ID` | Notion page ID for projects |
| `REVALIDATION_SECRET` | Secret for protecting revalidation endpoint |