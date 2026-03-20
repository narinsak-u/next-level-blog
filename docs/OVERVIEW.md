# Project Overview: next-level-blog

## Introduction
`next-level-blog` is a sophisticated personal blog platform built with **Next.js 15**, utilizing the **App Router** for optimized routing and server-side rendering. It uniquely integrates **Notion** as a headless CMS, allowing for a seamless writing experience in Notion and a high-performance, customizable presentation layer on the web.

## Purpose
The project serves as a personal portfolio and knowledge-sharing hub. It is designed to be:
- **Fast:** Leverages Next.js server components and Turbopack for rapid development and deployment.
- **Aesthetic:** Uses Framer Motion for animations and Mantine UI for a polished, consistent look.
- **Dynamic:** Content is fetched in real-time or at build time from Notion databases and pages.
- **Interactive:** Includes a music player, spotlight search, and a manifesto section with animations.

## Directory Structure & Architecture

```
@/                  → Project root
├── app/            → Next.js App Router pages
│   ├── posts/      → Blog post listing and dynamic [slug] pages
│   └── api/        → API routes (revalidate endpoint)
├── components/     → React components organized by domain
│   ├── home/       → Landing page components (NewProfile, MainProfile, etc.)
│   ├── contents/   → Content rendering components
│   ├── common/     → Reusable utilities (ScrollToTop, ThemeMode, etc.)
│   ├── layout/     → Layout components (Header, Footer, etc.)
│   └── ui/         → Design primitives and compound components
├── context/        → React Context providers
│   └── MusicPlayerContext.tsx
├── hooks/           → Custom React hooks
│   ├── useTheme.ts
│   └── use-layout-store.ts
├── actions/         → Server Actions for Notion API
├── helpers/         → Data transformation utilities
├── lib/             → Utilities and constants
│   ├── utils.ts
│   ├── constants.ts
│   └── errors.ts
├── types/           → TypeScript definitions with Zod
└── site/            → Site configuration
```

## Key Architecture Patterns

### Compound Components
Components composed of smaller, reusable parts using the compound component pattern:

| Component | Sub-components |
|-----------|----------------|
| `FloatingButtonGroup` | `FloatingButtonGroup.Button` |
| `ShareGroup` | `ShareGroup.Button` |
| `MediaBackground` | `MediaBackground.Video`, `MediaBackground.Image` |
| `ManifestoPanel` | `ManifestoPanel.Trigger`, `ManifestoPanel.Content`, `ManifestoPanel.CloseButton` |
| `PostCard` | `PostCardBase` (grid/list variants) |

### Context Providers
Global state management using React Context:

- `MusicPlayerContext` - Music player state accessible throughout the app

### Custom Hooks
- `useTheme()` - Consolidated theme access
- `useLayoutStore()` - Zustand store for layout state
- `useFetchPosts()` - Infinite scrolling
- `useMusicPlayer()` - Music playback control

## Core Workflows

1. **Content Management:** The author writes and manages posts in a Notion database.
2. **Data Transformation:** Server Actions fetch data, and `postMapping` ensures it matches the `PageDataSchema`.
3. **Rendering:** Individual posts are rendered using `react-notion-x`, providing a nearly perfect representation of Notion's blocks.
4. **Performance:** Infinite scrolling is used for the post list, and critical components are dynamically imported to reduce bundle size.

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Mantine UI, Tailwind CSS v4 |
| Animation | Framer Motion |
| CMS | Notion (via `@notionhq/client` + `react-notion-x`) |
| State | Zustand, TanStack Query |
| Validation | Zod |
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
