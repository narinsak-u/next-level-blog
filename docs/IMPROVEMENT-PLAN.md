# Improvement Plan — Vercel React Best Practices Audit

> Based on the 62-rule Vercel React Best Practices guide. Organized by impact priority with specific file locations and code references.

---

## Implementation Status

| # | Rule | Issue | Status |
|---|------|-------|--------|
| 3.1 | `server-cache-react` | Remove duplicate `cache()` wrappers | **Done** |
| 6.1 | `rendering-conditional-render` | Replace `&&` with ternaries in JSX | **Done** |
| 3.3 | `server-parallel-fetching` | Use `Promise.all` in slug layout | **Done** |
| 1.3 | `async-suspense-boundaries` | Add Suspense fallbacks to content pages | **Done** |
| 2.1 | `bundle-barrel-imports` | Split `types/index.ts` barrel file | **Done** |
| 5.1 | `rerender-no-inline-components` | Extract `HomeContent` from `app/page.tsx` | **Done** |
| 5.6 | `rerender-functional-setstate` | Stabilize MusicPlayer callbacks with refs | **Done** |
| 2.2 | `bundle-dynamic-imports` | Dynamic import Comments (giscus) | **Done** |
| 6.2 | `rendering-animation-svg-wrapper` | Extract shared `useVideoWithPlaceholder` hook | **Done** |

---

## Remaining Items (Not Yet Implemented)

| # | Rule | Issue | Priority |
|---|------|-------|----------|
| 1.1 | `async-defer-await` | Defer awaits in API routes | LOW |
| 2.3 | `bundle-defer-third-party` | Verify analytics deferral | LOW |
| 2.4 | `bundle-conditional` | Lazy-load ThemeCheck hotkey handler | LOW |
| 3.2 | `server-serialization` | Pass IDs instead of full objects to client | MEDIUM |
| 3.4 | `server-hoist-static-io` | Scope MantineProviders lower in tree | HIGH (hard) |
| 4.1 | `client-swr-dedup` | Lift `useFetchAllPosts` to common ancestor | MEDIUM |
| 4.2 | `client-swr-dedup` | Server-side tag filtering instead of client | MEDIUM |
| 5.2 | `rerender-no-inline-components` | Extract IntroPanel to separate file | LOW |
| 6.3 | `rendering-hydration-no-flicker` | Fix mount-flash in ThemeCheck/ClientComponent | MEDIUM |
| 7.1 | `js-set-map-lookups` | Use Set for related post tag matching | LOW |
| 8.1 | `advanced-init-once` | QueryClient factory for SSR (current pattern OK) | N/A |

---

| Priority | Category | Issues Found |
|----------|----------|-------------|
| CRITICAL | Eliminating Waterfalls | 3 |
| CRITICAL | Bundle Size Optimization | 4 |
| HIGH | Server-Side Performance | 4 |
| MEDIUM-HIGH | Client-Side Data Fetching | 2 |
| MEDIUM | Re-render Optimization | 6 |
| MEDIUM | Rendering Performance | 3 |
| LOW-MEDIUM | JavaScript Performance | 1 |
| LOW | Advanced Patterns | 1 |
| **Total** | | **24** |

---

## 1. Eliminating Waterfalls (CRITICAL)

### 1.1 `async-defer-await` — Sequential awaits that could run in parallel

**Files:** `app/posts/[slug]/page.tsx:42-44`, `app/posts/[slug]/layout.tsx:32-46`

The post slug page and its layout both independently call `fetchPostById(slug)` and make separate `await` calls. While `React.cache()` deduplicates within a single render pass, the layout's `fetchPostById` + `prefetchQuery` are sequential:

```tsx
// app/posts/[slug]/layout.tsx — sequential awaits
const postData = await fetchPostById(slug);       // wait...
const queryClient = new QueryClient();
await queryClient.prefetchQuery({ ... });          // then wait...
```

**Fix:** Start the query prefetch promise early, await only when needed:

```tsx
const postData = await fetchPostById(slug);
if (!postData) return <Loader />;

const queryClient = new QueryClient();
// prefetchQuery can be awaited later if needed, or fire-and-forget with after()
const prefetchPromise = queryClient.prefetchQuery({
  queryKey: useFetchAllPosts.getQueryKey(),
  queryFn: async () => fetchAllPosts(),
});
await prefetchPromise; // or use server.after() for non-blocking
```

**Impact:** Reduces TTFB by parallelizing data fetching.

---

### 1.2 `async-parallel` — Missing Promise.all() for independent fetches in static pages

**Files:** `app/about/page.tsx:24-25`, `app/hobbies/page.tsx:24-25`, `app/note/page.tsx:24-25`

Each static page currently fetches only `fetchStaticPageContent`, but if metadata or other data were needed, they'd be sequential. Current code is fine but worth noting for future parallelization.

**Status:** Monitor — no action needed now.

---

### 1.3 `async-suspense-boundaries` — No granular Suspense boundaries

**Files:** `app/posts/[slug]/page.tsx:46`, `app/about/page.tsx:28`, `app/hobbies/page.tsx:28`, `app/note/page.tsx:27`

All content pages render `<Content recordMap={recordMap} />` without Suspense fallbacks. If Notion content is slow, the entire page blocks.

**Fix:** Wrap Content in Suspense with a meaningful fallback:

```tsx
<Suspense fallback={<ContentSkeleton />}>
  {recordMap ? <Content recordMap={recordMap} /> : null}
</Suspense>
```

This also enables streaming SSR and Progressive Rendering.

**Impact:** Improves perceived load time and enables streaming.

---

## 2. Bundle Size Optimization (CRITICAL)

### 2.1 `bundle-barrel-imports` — Barrel file for types

**File:** `types/index.ts` (imported by 30 files)

All 30 consumer files import from `@/types` which resolves to a barrel file. While tree-shaking handles type-only imports, runtime Zod schema imports (`PageDataSchema`, `PageDataArraySchema`) are also re-exported from this barrel, potentially pulling unused schemas into bundles.

**Fix:** Split into separate files:

```
types/
  post-tag.ts       → PostTagSchema, PostTagSchemaType
  tag.ts            → TagSchema, TagSchemaType
  content-header.ts  → ContentHeaderSchema, ContentHeaderSchemaType
  page-data.ts      → PageDataSchema, PageDataSchemaType, PageDataArraySchema
  index.ts          → re-exports (keep for backwards compat during migration)
```

Enable `verbatimModuleSyntax` in tsconfig or use `import type` to ensure type-only imports are eliminated. Update hot-path imports to direct paths.

**Impact:** Reduces client bundle by avoiding unnecessary Zod schema code in client components.

---

### 2.2 `bundle-dynamic-imports` — Heavy components missing dynamic import

**Files:** `components/home/MusicPlayer.tsx`, `components/home/ManifestoPanel.tsx`, `components/contents/Comments.tsx`

These components are heavy (Framer Motion, third-party embeds) and not dynamically imported:

- `MusicPlayer.tsx` — imports audio logic that most users won't interact with
- `ManifestoPanel.tsx` — uses `framer-motion` `AnimatePresence` + `LazyMotion`
- `Comments.tsx` — likely loads third-party comment embeds

**Fix:**

```tsx
// In components/home/HomePage.tsx or wherever MusicPlayer is used
const MusicPlayer = dynamic(() => import("@/components/home/MusicPlayer"), {
  ssr: false,
});

// In components/home/MainProfile.tsx
const ManifestoPanel = dynamic(() => import("@/components/home/ManifestoPanel"));
```

**Impact:** Reduces initial JS bundle by 20-50KB per component.

---

### 2.3 `bundle-defer-third-party` — Analytics loaded synchronously in root layout

**File:** `app/layout.tsx:48-49`

```tsx
<Analytics />
<SpeedInsights />
```

Vercel Analytics and SpeedInsights are rendered in the root layout body. While these components may already self-defer, verify they don't block hydration.

**Fix:** Confirm these use `after()` or `requestIdleCallback` internally. If not, wrap in dynamic import:

```tsx
const Analytics = dynamic(() => import('@vercel/analytics/next').then(m => ({ default: m.Analytics })), { ssr: false });
```

**Impact:** Marginal — Vercel packages are generally well-optimized. Low priority.

---

### 2.4 `bundle-conditional` — ThemeCheck loads toast/hotkey logic eagerly

**File:** `components/common/ThemeCheck.tsx`

ThemeCheck eagerly imports `@mantine/hooks` `useHotkeys` and `useLocalStorage`, adding Mantine to the initial client bundle even if the user never triggers theme switch.

**Fix:** Consider lazy-loading the hotkey handler or deferring the hotkey registration until interaction.

**Impact:** Low — Mantine is likely already in the bundle from other components.

---

## 3. Server-Side Performance (HIGH)

### 3.1 `server-cache-react` — Duplicate cache() wrapper in page and layout

**Files:** `app/posts/[slug]/page.tsx:10`, `app/posts/[slug]/layout.tsx:17`

Both files independently create a `cache()` wrapper:

```tsx
const fetchPostById = cache(_fetchPostById);
```

This is redundant. The server action `fetchPostById` in `actions/posts.ts` is **already** wrapped with `cache()`. Calling `cache()` again on an already-cached function creates unnecessary wrapper overhead.

**Fix:** Import `fetchPostById` directly from `@/actions/posts` — it's already cached. Remove the duplicate `cache()` calls:

```tsx
// Remove: const fetchPostById = cache(_fetchPostById);
// Use:
import { fetchPostById } from "@/actions/posts";
```

**Impact:** Eliminates redundant cache layer, simplifies code.

---

### 3.2 `server-serialization` — Large RSC props passed to client components

**Files:** `app/posts/[slug]/layout.tsx:64-76`, `components/contents/ContentBody.tsx`

The full `postData` object (including all post metadata) is serialized and passed from the server layout to `ContentBody` and then down to `RelatedPostsWrapper`. This causes the entire post object to be included in the RSC payload.

**Fix:** Pass only the `postId` and `postTags` to client components. Let `RelatedPostsWrapper` access data from TanStack Query cache instead:

```tsx
// Instead of passing postData down
<ContentBody postId={postData.id} postTags={postData.tags}>
  {children}
</ContentBody>
```

Since all posts are already prefetched via `HydrationBoundary`, the client can read from cache.

**Impact:** Reduces RSC serialization payload size.

---

### 3.3 `server-parallel-fetching` — Sequential data fetching in slug layout

**File:** `app/posts/[slug]/layout.tsx:32-46`

`fetchPostById` and the TanStack Query prefetch are sequential. They could run in parallel since they're independent:

**Fix:**

```tsx
const [postData] = await Promise.all([
  fetchPostById(slug),
  queryClient.prefetchQuery({
    queryKey: useFetchAllPosts.getQueryKey(),
    queryFn: () => fetchAllPosts(),
  }),
]);
```

Wait — actually `queryClient` construction depends on nothing, so we can construct it first, but the two awaits are independent. Use `Promise.all`:

```tsx
const postData = await fetchPostById(slug);
if (!postData) return <Loader />;
// prefetch is independent of postData result (not really — it's independent)
const queryClient = new QueryClient();
await queryClient.prefetchQuery({ ... });
```

Actually, the two awaits ARE independent. `fetchAllPosts` doesn't depend on `postData`. So:

```tsx
const slugData = await params;
const queryClient = new QueryClient();

const [postData] = await Promise.all([
  fetchPostById(slugData.slug),
  queryClient.prefetchQuery({
    queryKey: useFetchAllPosts.getQueryKey(),
    queryFn: () => fetchAllPosts(),
  }),
]);
```

**Impact:** Reduces TTFB by parallelizing two independent network calls.

---

### 3.4 `server-hoist-static-io` — MantineProviders wrapping entire app in client boundary

**File:** `app/layout.tsx:45-46`

```tsx
<MantineProviders>
  <QueryProvider>{children}</QueryProvider>
</MantineProviders>
```

Both providers are client components wrapping all children. This forces the entire page tree into client rendering and increases hydration work.

**Fix:** Evaluate if MantineProviders can be scoped to components that actually use Mantine. For pages that are pure Notion content (about, note, hobbies), Mantine may not be needed at the root level.

**Impact:** Medium — enables more server-rendered content, reduces hydration JS.

---

## 4. Client-Side Data Fetching (MEDIUM-HIGH)

### 4.1 `client-swr-dedup` — Duplicate client-side fetches across components

**Files:** Multiple components call `useFetchAllPosts()` independently:

- `app/posts/components/PostsPageClient.tsx:9`
- `app/posts/components/PostsPageLayout.tsx` (via Spotlight)
- `components/contents/RelatedPostsWrapper.tsx:12`
- `components/common/SpotlightClient.tsx:7`
- `app/tags/components/TagPageClient.tsx:12`

While TanStack Query deduplicates active requests (same query key), each mounted component still creates a subscription. The real issue is that `useFetchAllPosts` is called in `SpotlightClient` AND `PostsPageClient` on the same page, effectively creating two subscriptions.

**Fix:** Lift the data fetch to a common ancestor and pass data down via props or context. For the posts page, `PostsPageClient` already has the data — pass it to `Spotlight` directly instead of having `SpotlightClient` re-fetch:

```tsx
// Instead of <SpotlightClient /> inside layout
// Use <Spotlight data={posts} /> with data from hydrate cache
```

**Impact:** Reduces redundant subscriptions and re-render cascades.

---

### 4.2 `client-swr-dedup` — useFetchPostsByTag fetches all posts then filters client-side

**File:** `hooks/use-fetch-posts-by-tag.ts`

```tsx
const useFetchPostsByTag = ({ tagname }) => {
  const { data: posts, ... } = useFetchAllPosts();
  const filteredPosts = useMemo(() => posts.filter(...), [posts, tagname]);
  ...
};
```

This fetches ALL posts from Notion and then filters on the client. If the data grows, this becomes expensive.

**Fix:** Add a server action `fetchPostsByTag(tagName)` that uses Notion's filter API directly (the `fetchPosts` action already supports `category` filter but not `tag` filter). Then use TanStack Query with a tag-specific query key:

```tsx
const useFetchPostsByTag = (tagname: string) => {
  return useQuery({
    queryKey: ["posts", "tag", tagname],
    queryFn: () => fetchPostsByTag(tagname),
  });
};
```

**Impact:** Reduces data transfer and client-side computation for tag pages.

---

## 5. Re-render Optimization (MEDIUM)

### 5.1 `rerender-no-inline-components` — HomeContent defined as sibling in same file

**File:** `app/page.tsx:11-33`

`HomeContent` is defined as a non-exported component in the same file as `Home`. On every re-render of `Home`, `HomeContent` will be re-created, causing React to unmount/remount it.

**Fix:** Either inline `HomeContent` logic into `Home`, or extract to a separate file with its own `"use client"` directive.

**Impact:** Prevents unnecessary remounting on state changes in parent `Home`.

---

### 5.2 `rerender-no-inline-components` — IntroPanel defined inside MainProfile.tsx file

**File:** `components/home/MainProfile.tsx:75-115`

`IntroPanel` is a separate component but defined in the same file. It uses `useManifesto()` context. While not inline (not inside render), it's a candidate for extraction if the file grows.

**Status:** Low priority — acceptable pattern for compound sub-components.

---

### 5.3 `rerender-memo-with-default-value` — PostCardGrid defaults object/array props

**File:** `components/ui/PostCard.tsx:47-52`

```tsx
const PostCardGrid = ({
  post,
  showImage = true,
  showTags = true,
  showDescription = true,
}: PostCardGridProps) => ...
```

The boolean defaults are fine (primitives), but usage sites that pass non-primitive props should be checked. The current implementation correctly uses primitive defaults.

**Status:** No action needed — primitive defaults are fine.

---

### 5.4 `rerender-derived-state-no-effect` — ThemeCheck uses effect for theme sync

**File:** `components/common/ThemeCheck.tsx:24-40`

```tsx
useEffect(() => {
  const syncTheme = () => { ... };
  setMounted(true);
  syncTheme();
}, [colorScheme]);
```

This effect syncs Mantine's color scheme with Tailwind's dark class. It's a side-effect that should run on the client after mount — the pattern is acceptable since it's syncing DOM mutations.

**Status:** Acceptable — this is a client-side hydration sync, not a derived state from props.

---

### 5.5 `rerender-defer-reads` — useModeStore subscribers read full state

**File:** `app/page.tsx:12-13`

```tsx
const mode = useModeStore((state) => state.mode);
const setMode = useModeStore((state) => state.setMode);
```

This correctly uses selectors — not an issue. However, `useModeStore.persist.rehydrate()` is called in a `useEffect`, which is the Zustand-recommended pattern.

**Status:** No action needed.

---

### 5.6 `rerender-functional-setstate` — MusicPlayerContext callbacks depend on isPlaying

**File:** `context/MusicPlayerContext.tsx:84-94`

```tsx
const togglePlay = useCallback(() => {
  const el = audioRef.current;
  if (!el) return;
  if (isPlaying) { ... } else { ... }
}, [isPlaying]);
```

`togglePlay` recreates on every `isPlaying` change. Use functional setState pattern to avoid dependency on state:

```tsx
const togglePlay = useCallback(() => {
  const el = audioRef.current;
  if (!el) return;
  // Use ref to track isPlaying instead
  if (isPlayingRef.current) { ... }
}, []); // stable reference
```

Or use `useRef` to track the playing state for DOM interactions.

**Impact:** Prevents context value changes on every play/pause toggle, which re-renders all consumers.

---

## 6. Rendering Performance (MEDIUM)

### 6.1 `rendering-conditional-render` — Using `&&` for JSX conditionals

**Files with JSX `&&` conditionals:**

| File | Line | Expression |
|------|------|------------|
| `components/ui/PostCard.tsx` | L75 | `showImage && post.coverImage && (...)` |
| `components/ui/PostCard.tsx` | L86 | `showTags && <TagItemInline .../>` |
| `app/about/page.tsx` | L28 | `recordMap && <Content .../>` |
| `app/hobbies/page.tsx` | L28 | `recordMap && <Content .../>` |
| `app/note/page.tsx` | L27 | `recordMap && <Content .../>` |
| `app/posts/[slug]/page.tsx` | L46 | `return recordMap && <Content .../>` |
| `app/posts/[slug]/layout.tsx` | L66 | `{postData && <Share .../>}` |
| `components/home/MainProfile.tsx` | L80 | `{!isOpen && (<m.div.../>}` |
| `components/home/ManifestoPanel.tsx` | L115 | `{isOpen && (<m.div.../>}` |

**Risk:** If `recordMap` were `0`, `""`, or `NaN`, `&&` would render those falsy values as visible content. For `postData && <Share />`, rendering nothing when `postData` is `0` would be incorrect.

**Fix:** Use ternary operators:

```tsx
// Before
{recordMap && <Content recordMap={recordMap} />}
// After
{recordMap ? <Content recordMap={recordMap} /> : null}

// Before
{showImage && post.coverImage && (...)}
// After
{showImage && post.coverImage ? (...) : null}
```

**Impact:** Prevents rendering falsy values like `0` as text. Defensive coding practice.

---

### 6.2 `rendering-animation-svg-wrapper` — Duplicate video component logic

**Files:** `components/ui/MediaBackground.tsx`, `components/ui/VideoWithPlaceholder.tsx`

These two files contain nearly identical video loading logic (3 useEffects each for: placeholder warning, video ready event, autoplay). This is ~70 lines of duplicated stateful logic.

**Fix:** Extract a `useVideoWithPlaceholder` hook:

```tsx
function useVideoWithPlaceholder(videoRef: RefObject<HTMLVideoElement | null>, src: string, placeholder?: string) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  // ... shared logic
  return { videoLoaded };
}
```

**Impact:** Eliminates code duplication, single source of truth for video loading behavior.

---

### 6.3 `rendering-hydration-no-flicker` — ClientComponent/ThemeCheck null-then-render pattern

**Files:** `components/common/ClientComponent.tsx`, `components/common/ThemeCheck.tsx`

Both use `useState(false)` + `useEffect(() => setMounted(true), [])` pattern that returns `null` on initial render. This causes a visible flash/flicker (content appears then disappears or shifts).

**Fix:** Use `suppressHydrationWarning` and CSS-based approach to prevent flash:

```tsx
// Instead of conditional rendering
if (!mounted) return null;

// Use CSS to hide until hydrated
<div className={mounted ? "opacity-100" : "opacity-0 transition-opacity"}>
  {children}
</div>
```

Or use Next.js `dynamic()` with `{ ssr: false }` for components that should only render on the client.

**Impact:** Eliminates layout shift and FOUC on page load.

---

## 7. JavaScript Performance (LOW-MEDIUM)

### 7.1 `js-set-map-lookups` — Related posts filtering uses Array.includes() in nested loop

**File:** `lib/post-logic.ts:34`

```tsx
post.tags?.some((tag) => currentTagNames.includes(tag.name))
```

`currentTagNames.includes()` is called inside `.some()` — this is O(n*m) where n = all posts and m = tags per post. For a blog with <100 posts this is fine, but for correctness:

**Fix:** Convert `currentTagNames` to a `Set` for O(1) lookup:

```tsx
const currentTagNameSet = new Set(currentPostTags.map(t => t.name));
// then in filter:
post.tags?.some((tag) => currentTagNameSet.has(tag.name))
```

**Impact:** Negligible for current scale, but better practice.

---

## 8. Advanced Patterns (LOW)

### 8.1 `advanced-init-once` — QueryClient created inside server component on every request

**Files:** `app/posts/page.tsx:16`, `app/posts/[slug]/layout.tsx:38`, `app/tags/[slug]/page.tsx:29`

Each server component request creates a new `QueryClient()`:

```tsx
const queryClient = new QueryClient();
```

While this is acceptable for SSR (each request needs its own cache), the `QueryClient` constructor creates default query/mutation caches that are immediately thrown away after `dehydrate()`.

**Fix:** Consider creating a factory function:

```tsx
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  });
}
```

This is already partially handled by the client-side `QueryProvider` using `useState` lazy init. The server-side pattern is fine as-is.

**Status:** No action needed — current pattern is correct for SSR.

---

## Implementation Priority Order

### Phase 1 — High Impact, Low Effort (Do First)

| # | Rule | Issue | Effort |
|---|------|-------|--------|
| 3.1 | `server-cache-react` | Remove duplicate `cache()` wrappers | Trivial |
| 6.1 | `rendering-conditional-render` | Replace `&&` with ternaries in JSX | Easy |
| 3.3 | `server-parallel-fetching` | Use `Promise.all` in slug layout | Easy |
| 1.3 | `async-suspense-boundaries` | Add Suspense fallbacks to content pages | Easy |

### Phase 2 — High Impact, Medium Effort

| # | Rule | Issue | Effort |
|---|------|-------|--------|
| 2.1 | `bundle-barrel-imports` | Split `types/index.ts` barrel file | Medium |
| 5.1 | `rerender-no-inline-components` | Extract `HomeContent` from `app/page.tsx` | Easy |
| 5.6 | `rerender-functional-setstate` | Stabilize MusicPlayer callbacks with refs | Medium |
| 2.2 | `bundle-dynamic-imports` | Dynamic import MusicPlayer, Comments | Medium |
| 6.2 | `rendering-animation-svg-wrapper` | Extract shared video hook | Medium |

### Phase 3 — Medium Impact, Medium Effort

| # | Rule | Issue | Effort |
|---|------|-------|--------|
| 3.2 | `server-serialization` | Pass IDs instead of full objects to client | Medium |
| 4.1 | `client-swr-dedup` | Lift `useFetchAllPosts` to common ancestor | Medium |
| 4.2 | `client-swr-dedup` | Server-side tag filtering instead of client-side | Medium |
| 6.3 | `rendering-hydration-no-flicker` | Fix mount-flash pattern in ThemeCheck/ClientComponent | Medium |
| 3.4 | `server-hoist-static-io` | Scope MantineProviders lower in tree | Hard |

### Phase 4 — Low Impact, Polish

| # | Rule | Issue | Effort |
|---|------|-------|--------|
| 7.1 | `js-set-map-lookups` | Use Set for related post tag matching | Trivial |
| 1.1 | `async-defer-await` | Verify query prefetch timing | Easy |
| 2.3 | `bundle-defer-third-party` | Verify analytics deferral | Easy |

---

## Metrics to Track

Before and after each phase, measure:

1. **Bundle Size** — `next build` output for client JS size
2. **Lighthouse Performance** — especially TTI and TBT
3. **Core Web Vitals** — LCP, FID/INP, CLS
4. **Hydration Time** — React DevTools Profiler
5. **Server TTFB** — `next build` timing reports

---

## Notes

- **68 client components vs 13 server components** — many components (like layout wrappers, static content) could be converted to server components to reduce hydration work.
- **Zustand stores use `skipHydration: true`** — this is correct for SSR compatibility.
- **TanStack Query setup is solid** — `prefetchQuery` + `HydrationBoundary` pattern is well-implemented.
- **Framer Motion uses `LazyMotion` + `domAnimation`** — good bundle optimization already in place.
- **Dynamic imports for Notion heavy components** — `Content.tsx` already uses `next/dynamic` for Code, Equation, Pdf, Modal. Good pattern.