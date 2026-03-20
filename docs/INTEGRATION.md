# Integration Documentation: next-level-blog

## Notion CMS Integration

The core of the application is its integration with Notion. It uses two distinct approaches:

### 1. Official Notion SDK (`@notionhq/client`)
Used for querying the blog database, filtering by status/category, and retrieving metadata.
- **Data Source:** Notion Database (configured via `NOTION_DATA_SOURCE_ID`).
- **Logic Location:** `actions/notion.ts`
- **Key Methods:**
  - `getAllPosts()`: Fetches all posts where `Status` is "Done".
  - `getPostsByCategory()`: Filters posts by the `Category` select property.
  - `getPage()`: Retrieves basic page metadata.

### 2. Unofficial Notion API (`notion-client`)
Used for retrieving the full `recordMap` of a page to render it with `react-notion-x`.
- **Logic Location:** `actions/notion-x.ts`
- **Key Method:** `fetchPageContent(pageId)`: Fetches the deep record map required for the high-fidelity renderer.

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

### 2. TanStack React Query
- **Purpose:** Handles client-side state for infinite scrolling and related posts.
- **Provider:** `components/providers/query-provider.tsx`
- **Usage:** See `hooks/use-fetch-posts.ts` for implementation of `useInfiniteQuery`.

### 3. Theme System
- **Hook:** `hooks/useTheme.ts`
- **Integration:** Mantine color scheme with custom hook wrapper
- **Features:** Light/dark mode with persistent storage

### 4. Vercel Analytics & Speed Insights
- **Purpose:** Performance monitoring and visitor analytics.
- **Implementation:** Integrated into the root `layout.tsx`.

## Data Transformation Flow

1. **Fetch:** Notion SDK returns a complex JSON object.
2. **Transform:** `helpers/post-mapping.ts` iterates through `results`, extracting fields like `Name`, `Tags`, `Cover`, and `Description`.
3. **Validate:** `PageDataSchema.parse(post)` ensures the transformed object conforms to the application's internal types.
4. **Deliver:** The UI receives a clean `PageDataSchemaType` object, reducing coupling with the Notion API structure.

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
