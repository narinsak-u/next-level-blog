# Frontend & API Workflow

This document describes how the frontend and data layer work together in the Next.js blog.

---

## Architecture Overview

```
User Request
    │
    ▼
Next.js Server Component (page.tsx)
    │
    ├─→ Server Action (actions/posts.ts) ← React.cache() at action level, no duplicate wrappers
    │       └─→ Notion API (official + unofficial client)
    │
    ├─→ Promise.all()                     ← parallel independent fetches
    │       ├─ fetchPostById(slug)
    │       └─ queryClient.prefetchQuery()
    │
    ├─→ QueryClient.prefetchQuery()       ← hydrates TanStack Query cache
    │
    ▼
HydrationBoundary (dehydrated state)
    │
    ▼
<Suspense fallback={<Loader />}>          ← streaming SSR + meaningful loading states
    │
    ▼
Client Component
    │
    ├─→ useQuery / useInfiniteQuery       ← reads from hydrated cache (no re-fetch)
    │
    ▼
UI Components (Mantine + Tailwind + Framer Motion)
    │
    ▼
Rendered HTML → User
```

---

## Page-by-Page Data Flow

### 1. Posts Listing (`/posts`)

```
GET /posts
  └─ page.tsx (Server Component)
       ├─ new QueryClient()
       ├─ prefetchQuery(["posts", "all"], fetchAllPosts)
       │     └─ actions/posts.ts → fetchAllPosts()
       │             └─ Notion dataSources.query (status=Done, limit=100)
       │                     └─ Zod validate → PageDataSchema[]
       ├─ dehydrate(queryClient)
       └─ <HydrationBoundary>
               └─ <PostsPageClient />
                     ├─ useFetchAllPosts()  ← cache hit, no network request
                     ├─ getTags(posts)      ← aggregate tags + counts
                     ├─ getCategory(posts)  ← unique categories
                     └─ <PostsPageLayout>
                           ├─ <TagSection>        (tag chips)
                           ├─ <SearchPost>        (Cmd+K spotlight trigger)
                           ├─ <TimelineContent>   (categorized sections)
                           │     └─ <PostGrid>    (per category)
                           │           ├─ useFetchPosts({ categoryName })
                           │           │     └─ useInfiniteQuery (6 posts/page)
                           │           │           Falls back to cached all-posts
                           │           └─ <PostItem>
                           │                 ├─ useLayoutStore → isGrid (Zustand)
                           │                 └─ <PostCardGrid> / <PostCardList>
                           └─ <CustomSpotlight>   (search over all posts)
```

### 2. Individual Post (`/posts/[slug]`)

```
GET /posts/[slug]
  └─ layout.tsx (Server Component)
       ├─ fetchPostById(slug)
       └─ <ContentBody>
              ├─ <ContentTitle>
              ├─ <ShareGroup>               (share buttons)
              ├─ <RelatedPostsServer>
              │     ├─ Fetches at most 6 unfiltered post summaries
              │     ├─ Selects at most 3 related posts server-side
              │     └─ Prioritizes shared tags, then same-category fallback
              └─ <Suspense>
                    └─ <Comments>           ← dynamic import, ssr: false (giscus)

  └─ page.tsx (Server Component, revalidate = 300s)
       ├─ fetchPostContent(slug)
       │     └─ notion-client (unofficial) → ExtendedRecordMap
       └─ <Suspense fallback={<Loader />}>
              └─ <Content recordMap... />
                    ├─ NotionRenderer (react-notion-x)
                    └─ Dynamic imports: Code, Equation, PDF, Modal, Tweet
```

### 3. Tag Filtering (`/tags/[slug]`)

```
GET /tags/[slug]
  └─ page.tsx (Server Component)
       ├─ prefetchQuery(["posts", "all"], fetchAllPosts)  ← same cache key
       └─ <HydrationBoundary>
               └─ <TagPageClient tagname={slug} />
                     └─ useFetchPostsByTag({ tagname })
                           ├─ Uses useFetchAllPosts cache (no re-fetch)
                           └─ filterPostsByTag(posts, tagname) (case-insensitive)
```

### 4. Static Pages (`/about`, `/note`, `/hobbies`)

```
GET /about | /note | /hobbies
  └─ page.tsx (Server Component, revalidate = 300s)
       └─ fetchStaticPageContent(type)
             ├─ Maps type → NOTION_ABOUT_PAGE_ID / _NOTE_ / _PROJECT_PAGE_ID
             └─ notion-client (unofficial) → ExtendedRecordMap
                     └─ <Suspense fallback={<Loader />}>
                           └─ <Content recordMap={...} /> via NotionRenderer
```

### 5. ISR Revalidation (`/api/revalidate`)

```
POST /api/revalidate
  ├─ Authorization: Bearer ${REVALIDATION_SECRET}
  ├─ JSON body: { paths?: string[], tags?: string[] }
  └─ route.ts (Route Handler)
       ├─ Reject invalid credentials with 401
       ├─ Reject invalid or empty payloads with 400
       ├─ revalidatePath(path) for each requested path
       ├─ revalidateTag(tag, "max") for each requested cache tag
       └─ Returns { revalidated: true }
```

## State Management Layers

| Layer | Tool | Scope | Usage |
|-------|------|-------|-------|
| Server state / cache | TanStack Query v5 | App-wide | Posts data, prefetch + hydration |
| Layout preference | Zustand (persisted) | App-wide | Grid vs list toggle (localStorage) |
| Audio / music | React Context | App-wide | Play/pause, volume — stable refs via `isPlayingRef` |
| Component state | React useState | Local | Loading, inputs, animations |

---

## Server Actions (`actions/posts.ts`)

All functions are marked `"use server"` and wrapped with `React.cache()` for per-request deduplication. No additional `cache()` wrappers needed at call sites.

| Function | Description |
|----------|-------------|
| `fetchPosts(options)` | Paginated posts from Notion, filtered by status=Done |
| `fetchAllPosts()` | Convenience wrapper — fetches up to 100 posts |
| `fetchPostById(postId)` | Single post metadata via official Notion client |
| `fetchPostContent(pageId)` | Full Notion block tree via unofficial `notion-client` |
| `fetchStaticPageContent(type)` | Static pages (about/note/project) block tree |

---

## TanStack Query Hooks (`hooks/`)

| Hook | Query Key | Strategy |
|------|-----------|----------|
| `useFetchAllPosts` | `["posts", "all"]` | Single fetch, 60s stale time |
| `useFetchPosts` | `["posts", categoryName]` | Infinite query (6/page), falls back to all-posts cache |
| `useFetchPostsByTag` | — | Derived — filters `useFetchAllPosts` client-side |

**QueryClient defaults:**
- `staleTime`: 60s
- `gcTime`: 5 min
- `refetchOnWindowFocus`: false
- `retry`: 1

---

## Search / Spotlight Flow

```
User presses Cmd+K (or /)
  └─ SearchPost → openSpotlight()
        └─ CustomSpotlight
              ├─ Receives all posts as props
              ├─ Builds action groups:
              │     • Pages: Home, Project (→ /hobbies), Note
              │     └─ Posts: all posts with title + description
              └─ Selection → router.push(url)
```

---

## Notion Clients

Two separate Notion clients are used together:

| Client | Package | Used For |
|--------|---------|---------|
| Official | `@notionhq/client` | Structured queries, metadata, database filters |
| Unofficial | `notion-client` | Full block content rendering (react-notion-x) |

---

## Key Environment Variables

```env
NOTION_TOKEN                # Official client auth
NOTION_DATA_SOURCE_ID       # Database for post queries
NOTION_PUBLIC_SITE_URL      # Published Notion workspace domain for page content
NOTION_ABOUT_PAGE_ID        # About static page
NOTION_NOTE_PAGE_ID         # Notes static page
NOTION_PROJECT_PAGE_ID      # Projects/Hobbies static page
REVALIDATION_SECRET         # ISR revalidation auth
NEXT_PUBLIC_GITHUB_NAME     # Giscus comments
NEXT_PUBLIC_REPO            # Giscus comments
NEXT_PUBLIC_REPO_ID         # Giscus comments
NEXT_PUBLIC_CATEGORY_ID     # Giscus discussion category
```

`NOTION_PUBLIC_SITE_URL` must identify the published Notion workspace domain (for
example, `https://future-shawl-a38.notion.site`). Every page rendered through
`notion-client` must be published under this configured domain. Set this
variable in Vercel Production and Preview environments whenever those
environments render deployed content.

---

## Performance Strategies

| Strategy | Where | Effect |
|----------|-------|--------|
| Server-side prefetch | `page.tsx` (server) | Zero-latency first render |
| `React.cache()` | `actions/posts.ts` (action level) | Deduplicates metadata + content fetches across request |
| `Promise.all()` | `posts/[slug]/layout.tsx` | Parallel independent fetches |
| `HydrationBoundary` | All data pages | Transfers server cache to client, no re-fetch |
| `<Suspense>` boundaries | Content pages | Streaming SSR + meaningful loading states |
| ISR (300s) | Static pages | Cached HTML regenerated every 5 minutes |
| Dynamic imports | `Content` component | Code splits PDF, Equation, Modal, Code blocks, Comments |
| `optimizePackageImports` | `next.config.ts` | Tree-shakes Mantine to reduce bundle |
| Infinite query pagination | `PostGrid` | Loads 6 posts at a time on demand |
| Stable callback refs | `MusicPlayerContext` | Prevents re-renders on play/pause toggle |
| Barrel type modules | `types/*.ts` | Tree-shakeable type imports, backward-compatible re-exports |

---

## Type Module Split

Types are organized as individual modules for tree-shaking, with a barrel re-export for backward compatibility:

```
types/
├── post-tag.ts       → PostTagSchema, PostTagSchemaType
├── tag.ts            → TagSchema, TagSchemaType
├── content-header.ts  → ContentHeaderSchema, ContentHeaderSchemaType
├── page-data.ts      → PageDataSchema, PageDataSchemaType, PageDataArraySchema
├── site-metadata.ts  → SiteMetadataSchema, SiteMetadataType
└── index.ts          → Barrel re-exports (backward compatible)
```

Import directly for hot paths: `import { PageDataSchemaType } from "@/types/page-data"`
Import from barrel for convenience: `import { PageDataSchemaType } from "@/types"`