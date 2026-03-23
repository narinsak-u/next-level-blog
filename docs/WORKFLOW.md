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
    ├─→ Server Action (actions/posts.ts)
    │       └─→ Notion API (official + unofficial client)
    │
    ├─→ QueryClient.prefetchQuery()   ← hydrates TanStack Query cache
    │
    ▼
HydrationBoundary (dehydrated state)
    │
    ▼
Client Component
    │
    ├─→ useQuery / useInfiniteQuery   ← reads from hydrated cache (no re-fetch)
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
                     ├─ getCategory(posts) ← unique categories
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
  └─ page.tsx (Server Component)
       ├─ generateMetadata({ slug })
       │     └─ fetchPostById(slug)  ← React.cache() deduplication
       │             └─ Notion pages.retrieve(slug)
       │                     └─ Returns title, description, tags, cover image
       ├─ fetchPostContent(slug)
       │     └─ notion-client (unofficial) → ExtendedRecordMap
       │             └─ Full Notion block tree for rendering
       └─ <Content recordMap={...} />
             ├─ NotionRenderer (react-notion-x)
             ├─ Dynamic imports: Code, Equation, PDF, Modal, Tweet
             ├─ <ContentWrapper>  (breadcrumbs, metadata)
             ├─ <Share>           (share buttons)
             ├─ <Comments>        (Giscus / GitHub Discussions)
             └─ <RelatedPosts>    (getRelatedPosts → same tags, max 3)
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
                     └─ <Content recordMap={...} /> via NotionRenderer
```

### 5. ISR Revalidation (`/api/revalidate`)

```
GET /api/revalidate?secret=<SECRET>&path=<PATH>
  └─ route.ts (Route Handler)
       ├─ Validate secret === REVALIDATION_SECRET
       ├─ revalidatePath(path)   ← Next.js ISR on-demand
       └─ Returns { revalidated: true, now: Date }
```

---

## State Management Layers

| Layer | Tool | Scope | Usage |
|-------|------|-------|-------|
| Server state / cache | TanStack Query v5 | App-wide | Posts data, prefetch + hydration |
| Layout preference | Zustand (persisted) | App-wide | Grid vs list toggle (localStorage) |
| Audio / music | React Context | App-wide | Play/pause, volume, audioRef |
| Component state | React useState | Local | Loading, inputs, animations |

---

## Server Actions (`actions/posts.ts`)

All functions are marked `"use server"` and run only on the server.

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
NOTION_ABOUT_PAGE_ID        # About static page
NOTION_NOTE_PAGE_ID         # Notes static page
NOTION_PROJECT_PAGE_ID      # Projects/Hobbies static page
REVALIDATION_SECRET         # ISR revalidation auth
NEXT_PUBLIC_GITHUB_NAME     # Giscus comments
NEXT_PUBLIC_REPO            # Giscus comments
NEXT_PUBLIC_REPO_ID         # Giscus comments
NEXT_PUBLIC_CATEGORY_ID     # Giscus discussion category
```

---

## Performance Strategies

| Strategy | Where | Effect |
|----------|-------|--------|
| Server-side prefetch | `page.tsx` (server) | Zero-latency first render |
| `React.cache()` | `posts/[slug]/page.tsx` | Deduplicates metadata + content fetches |
| `HydrationBoundary` | All data pages | Transfers server cache to client, no re-fetch |
| ISR (300s) | Static pages | Cached HTML regenerated every 5 minutes |
| Dynamic imports | `Content` component | Code splits PDF, Equation, Modal, Code blocks |
| `optimizePackageImports` | `next.config.ts` | Tree-shakes Mantine to reduce bundle |
| Infinite query pagination | `PostGrid` | Loads 6 posts at a time on demand |
