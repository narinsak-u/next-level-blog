# Integration Documentation: next-level-blog

## Notion CMS Integration

The application integrates with Notion through a unified, "deep" access layer that encapsulates both the official and unofficial SDKs.

### 1. Unified Posts Module (`actions/posts.ts`)
This module provides a single entry point for all blog post data and hides the implementation details of the Notion APIs. All functions are wrapped with `React.cache()` at the action level — no additional `cache()` wrappers needed at call sites.
- **Data Source:** Notion Database (configured via `NOTION_DATA_SOURCE_ID`) and individual Page content.
- **Key Methods:**
  - `fetchPosts(options)`: A flexible, cached function to fetch posts with support for categories, status filtering, and pagination.
  - `fetchAllPosts()`: A convenience wrapper for fetching the entire post database.
  - `fetchPostById(id)`: Fetches metadata for a single post. Deduplicated across `generateMetadata` and page/layout.
  - `fetchPostContent(pageId)`: Uses `notion-client` to fetch the deep record map for high-fidelity rendering.
  - `fetchStaticPageContent(type)`: Fetches content for fixed pages like About, Note, or Projects.

### 2. Domain Logic Layer (`lib/post-logic.ts`)
Pure business logic for managing post data is decoupled from both the data source (Notion) and the UI (React).
- **Key Methods:**
  - `filterPostsByTag(posts, tagName)`: Pure function for client-side or server-side tag filtering.
  - `getRelatedPosts(posts, currentPostId, tags)`: Pure logic to find matching posts based on shared tags.

## API Endpoints (Next.js Routes)

### On-Demand Revalidation
- **Path:** `/api/revalidate`
- **Method:** `GET`
- **Query Params:** 
  - `secret` (required) - Must match `REVALIDATION_SECRET` env var
  - `path` (required) - Route to revalidate (e.g., `/posts`)
- **Example:** `/api/revalidate?secret=YOUR_SECRET&path=/posts`
- **Security:** Protected with secret token verification

## Client-Side Integrations

### 1. Music Player (Context-based)
- **Provider:** `context/MusicPlayerContext.tsx`
- **Components:** `components/home/MusicPlayer.tsx`, `components/home/Credit.tsx`
- **Features:**
  - Global play/pause state
  - Volume control
  - Looping audio
  - Accessible controls
  - Stable callback refs (`isPlayingRef`) prevent context re-renders on play/pause toggle

### 2. TanStack React Query
- **Purpose:** Handles client-side state for infinite scrolling and related posts.
- **Provider:** `components/providers/query-provider.tsx`
- **Usage:** See `hooks/use-fetch-posts.ts` for implementation of `useInfiniteQuery`.
- **SSR Prefetch:** Server components use `prefetchQuery` + `HydrationBoundary` for instant client-side data.
- **Parallel Fetching:** Independent prefetches use `Promise.all()` (e.g., post data + all posts prefetch in `[slug]` layout).

### 3. Theme System
- **Hook:** `hooks/useTheme.ts`
- **Integration:** Mantine color scheme with custom hook wrapper
- **Features:** Light/dark mode with persistent storage

### 4. Vercel Analytics & Speed Insights
- **Purpose:** Performance monitoring and visitor analytics.
- **Implementation:** Integrated into the root `layout.tsx`.

## Data Transformation Flow

1. **Fetch:** `actions/posts.ts` queries Notion using the appropriate SDK.
2. **Transform:** Mapping logic is internal to the posts module. It extracts fields like `Name`, `Tags`, `Cover`, and `Description`.
3. **Validate:** `PageDataSchema.parse(post)` ensures the transformed object conforms to the application's internal types.
4. **Deliver:** The UI receives a clean `PageDataSchemaType` object.
5. **Compute:** Hooks and components use `lib/post-logic.ts` to derive additional state (like related posts) from the clean data.

## Component Composition Patterns

### Floating Button Group
```tsx
<FloatingButtonGroup>
  <FloatingButtonGroup.Button icon={ArrowUpCircle} onClick={() => scrollTo(0)} />
  <FloatingButtonGroup.Button icon={Books} href="/posts" />
</FloatingButtonGroup>
```

### Share Button Group
```tsx
<ShareGroup postLink={url}>
  <ShareGroup.Button platform="facebook" url={url} />
  <ShareGroup.Button platform="twitter" url={url} />
</ShareGroup>
```

### Media Background
```tsx
<MediaBackground>
  <MediaBackground.Video src="/video.mp4" placeholder="/poster.jpg" />
</MediaBackground>
```
Both `MediaBackground.Video` and `VideoWithPlaceholder` use the shared `useVideoWithPlaceholder` hook for consistent video loading state management.

### Manifesto Panel
```tsx
<ManifestoPanel>
  <ManifestoPanel.Trigger>Manifesto</ManifestoPanel.Trigger>
  <ManifestoPanel.Content>
    <p>Pain is the best teacher...</p>
  </ManifestoPanel.Content>
</ManifestoPanel>
```

## Error Handling

Custom error types defined in `lib/errors.ts`:
- `AppError` - Base error class
- `NotionAPIError` - Notion API failures
- `ValidationError` - Data validation failures
- `NotFoundError` - Resource not found
- `AuthenticationError` - Auth failures

## Security Features

- **Revalidation Endpoint:** Protected with secret token
- **CSP Headers:** Configured in `next.config.ts`
- **Type Safety:** Zod validation on data boundaries
- **No `any` types:** Proper TypeScript typing throughout
