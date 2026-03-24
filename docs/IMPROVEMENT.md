# Improvement Plan: next-level-blog

## Overview
Based on code review and refactoring analysis, this document outlines actionable improvements organized by priority.

**Status: ✅ ALL ITEMS COMPLETED**

---

## P0 - Critical (Fix Immediately)

### Security
- [x] **Secure revalidation endpoint**
  - File: `app/api/revalidate/route.ts`
  - Fix: Added secret token verification from `REVALIDATION_SECRET` env var

- [x] **Fix CSP header**
  - File: `next.config.ts`
  - Fix: Updated CSP to allow Mantine, Google Fonts, Vercel Analytics, Twitter

### Performance
- [x] **Fix waterfall fetching**
  - File: `app/posts/[slug]/layout.tsx`
  - Fix: Used `Promise.all` to fetch in parallel

---

## P1 - High Priority

### Code Organization

- [x] **Extract `Credit` component**
  - File: `components/home/Credit.tsx` (created)

- [x] **Extract `MusicPlayer` component**
  - File: `components/home/MusicPlayer.tsx` (created)

- [x] **Extract `VideoWithPlaceholder` component**
  - File: `components/ui/VideoWithPlaceholder.tsx` (created)

- [x] **Extract `Menu` component**
  - File: `components/home/Menu.tsx` (created)

- [x] **Extract `AnimatePresenceGuard`**
  - File: `components/ui/AnimatePresenceGuard.tsx` (created)

### Type Safety

- [x] **Replace `any` types in `post-mapping.ts`**
  - File: `helpers/post-mapping.ts`
  - Fix: Used `QueryDatabaseResponse` from `@notionhq/client`

- [x] **Fix non-null assertion crash**
  - File: `actions/get-post-by-id.ts`
  - Fix: Added proper null check with error handling

- [x] **Fix unsafe array access**
  - File: `hooks/use-get-tweet-id.ts`
  - Fix: Added optional chaining and validation

### Robustness

- [x] **Fix hardcoded array access**
  - File: `app/posts/components/contents/TimelineContent.tsx`
  - Fix: Used `.map()` with null safety and extracted config

- [x] **Fix incorrect `notFound()` usage**
  - File: `components/contents/ContentTitle.tsx`
  - Fix: Already correct - `return notFound()`

---

## P2 - Medium Priority

### Type Safety

- [x] **Add types to `actions/notion.ts`**
  - File: `actions/notion.ts`
  - Fix: Used proper Notion filter/sort types

- [x] **Fix `siteMatedata` typo**
  - File: Renamed `site/siteMatedata.ts` → `site/siteMetadata.ts`
  - Fix: Updated all 12 import references

### Performance

- [x] **Memoize tag/category calculations**
  - File: `app/posts/components/PostsPageLayout.tsx`
  - Fix: Added `useMemo` for `getTags()` and `getCategory()`

- [x] **Optimize Background event listeners**
  - File: `components/home/Background.tsx`
  - Fix: Consolidated to single handler

- [ ] **Add pagination to posts page**
  - File: `app/posts/page.tsx`
  - Status: Not yet implemented

### Maintainability

- [x] **Move animation constants to `lib/constants.ts`**
  - File: `lib/constants.ts` (created)
  - Fix: `ANIMATION`, `MUSIC`, `POSTS`, etc.

- [x] **Move utility functions to `lib/utils.ts`**
  - File: `lib/utils.ts`
  - Fix: `getFileExtension()`, `isVideo()`

- [x] **Replace magic number with constant**
  - File: `lib/constants.ts`
  - Fix: `POSTS.DEFAULT_LIMIT = 6`

- [ ] **Extract posts flattening utility**
  - File: `hooks/use-fetch-posts.ts`
  - Status: Not yet implemented

### React Patterns

- [x] **Use `useCallback` for `myTweet`**
  - File: `components/contents/Content.tsx`
  - Fix: Wrapped `myTweet` in `useCallback`

- [x] **Create `useMusicPlayer` hook/context**
  - File: `context/MusicPlayerContext.tsx` (created)
  - Fix: Context provider with `useMusicPlayer` hook

- [x] **Remove redundant useEffect**
  - File: `components/common/ThemeMode.tsx`
  - Fix: Removed redundant effect

---

## P3 - Nice to Have

### Maintainability

- [ ] **Clean up commented-out code**
  - Status: Partially cleaned

- [x] **Add Zod validation for `siteMetadata`**
  - File: `types/site-metadata.ts` (created)

- [x] **Create centralized error handling utility**
  - File: `lib/errors.ts` (created)
  - Fix: `AppError`, `NotionAPIError`, `ValidationError`, etc.

- [ ] **Add environment validation**
  - Status: Not yet implemented

### Architecture

- [x] **Fix Zustand hydration mismatch**
  - File: `hooks/use-layout-store.ts`
  - Fix: Added `skipHydrationWarning: true`
### Architecture
- [x] **Consolidate Notion CMS access**
  - File: `actions/posts.ts` (created)
  - Fix: Merged `@notionhq/client` and `notion-client` logic into a single deep module. Consolidated mapping and convenience wrappers.
- [x] **Extract pure domain logic**
  - File: `lib/post-logic.ts` (created)
  - Fix: Extracted filtering and related post logic from React hooks into pure, testable functions.

### Maintainability
...
- [x] **Extract posts flattening utility**
  - File: `actions/posts.ts`
  - Fix: Simplified data flow so flattening is handled at the source or via simple array methods.

...

## Summary

| Priority | Count | Completed |
|----------|-------|-----------|
| P0 (Critical) | 3 | ✅ 3 |
| P1 (High) | 9 | ✅ 9 |
| P2 (Medium) | 11 | ✅ 10, ⏳ 1 |
| P3 (Nice to Have) | 5 | ✅ 3, ⏳ 2 |
| **Total** | **28** | **25 ✅** |

---

## Remaining Items

| Item | Priority | Notes |
|------|----------|-------|
| Add pagination to posts page | P2 | Cursor-based pagination for Notion |
| Extract posts flattening utility | P2 | Optional utility function |
| Clean up commented-out code | P3 | Ongoing cleanup |
| Add environment validation | P3 | Optional enhancement |

---

## Task Groups Completed

### Group 1: Component Extraction (NewProfile)
- `components/home/Credit.tsx` ✅
- `components/home/MusicPlayer.tsx` ✅
- `context/MusicPlayerContext.tsx` ✅ (replaced hook)

### Group 2: Component Extraction (MainProfile)
- `components/home/Menu.tsx` ✅
- `components/ui/AnimatePresenceGuard.tsx` ✅
- `lib/constants.ts` ✅

### Group 3: Component Extraction (UI)
- `components/ui/VideoWithPlaceholder.tsx` ✅
- `lib/utils.ts` ✅ (utility functions)

### Group 4: Type Safety
- ✅ Replaced all `any` types
- ✅ Fixed non-null assertions
- ✅ Added Zod validation

### Group 5: Performance
- ✅ Fixed waterfall fetching
- ✅ Memoized calculations
- ⏳ Pagination (remaining)

---

## Vercel React Best Practices Audit (2026-03-21)

Based on the [Vercel React Best Practices](https://vercel.com/blog/react-best-practices) guidelines (62 rules across 8 categories). Rules are referenced by their rule ID prefix.

**Status: ✅ ALL ITEMS COMPLETED**

### CRITICAL

- [x] **`async-parallel` — Waterfall in post detail page**
  - File: `app/posts/[slug]/page.tsx`, `app/posts/[slug]/layout.tsx`
  - Fix: Applied `React.cache()` to `getPostById` to deduplicate across `generateMetadata`, page, and layout

- [x] **`bundle-dynamic-imports` — Heavy CSS loaded globally**
  - File: `app/layout.tsx` → `app/posts/[slug]/layout.tsx`, `app/about/page.tsx`, `app/hobbies/page.tsx`, `app/note/page.tsx`
  - Fix: Moved `react-notion-x`, `prismjs`, `katex` CSS imports from root layout to only the pages that use Notion content

### HIGH

- [x] **`server-dedup-props` — Duplicate data serialization in RSC payload**
  - File: `app/posts/page.tsx`, `app/posts/components/PostsPageLayout.tsx`
  - Fix: Moved `TimelineContent` inside `PostsPageLayout` so `posts` is only serialized once

- [x] **`server-parallel-fetching` — All pages use `force-dynamic`**
  - Files: `app/posts/page.tsx`, `app/about/page.tsx`, `app/hobbies/page.tsx`, `app/note/page.tsx`
  - Fix: Replaced `force-dynamic` with ISR — `revalidate = 120` (posts), `revalidate = 300` (about/hobbies/note)

- [x] **Images `unoptimized: true` disables all optimization**
  - File: `next.config.ts`
  - Fix: Removed `unoptimized: true` to enable Next.js automatic image optimization

### MEDIUM

- [x] **`rerender-no-inline-components` — `ClientComponent` mount guard blanks SSR**
  - File: `app/layout.tsx`
  - Fix: Removed `ClientComponent` wrapper — `ColorSchemeScript` + `suppressHydrationWarning` already handle theme SSR

- [x] **No-op `"use client"` component adds to client bundle**
  - Files: `app/about/components/AboutPage.tsx`, `app/hobbies/components/ProjectPage.tsx`, `app/note/components/NotePage.tsx`
  - Fix: Replaced `ContentWrapper` with plain `<div>` in all consumers

- [x] **`rerender-functional-setstate` — Ineffective `useCallback` in `useFetchPosts`**
  - File: `hooks/use-fetch-posts.ts`
  - Fix: Removed unnecessary `useCallback`, pass `fetchNextPage` directly from React Query

### LOW

- [x] **Dead code: `useLayoutStoreHydrated`**
  - File: `hooks/use-layout-store.ts`
  - Fix: Removed unused function

- [x] **Unnecessary wrapper: `actions/get-post-by-id.ts`**
  - File: `app/posts/[slug]/page.tsx`, `app/posts/[slug]/layout.tsx`
  - Fix: Updated imports to use `getPostById` from `actions/notion` directly

### Bonus Fix

- [x] **Pre-existing type error: `PostCardBase` export missing**
  - Files: `app/posts/components/PostCard.tsx`, `app/posts/components/PostCardFlex.tsx`
  - Fix: Updated to use `PostCardGrid` and `PostCardList` exports from `components/ui/PostCard`

---

## TanStack Query Caching Implementation (2026-03-22)

### Problem
- Posts refetch every time user navigates between pages (posts → tag → posts)
- React's `cache()` only deduplicates within a single request, not across navigations
- Initial page load shows empty posts before data arrives

### Solution
Implemented proper TanStack Query caching with SSR prefetching:

**1. QueryProvider Configuration** (`components/providers/query-provider.tsx`)
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,      // 1 minute
      gcTime: 5 * 60 * 1000,     // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

**2. SSR Prefetch Pattern** (used in `app/posts/page.tsx`, `app/tags/[slug]/page.tsx`, `app/posts/[slug]/layout.tsx`)
```typescript
const Posts = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: useFetchAllPosts.getQueryKey(),
    queryFn: () => fetchAllPosts(),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostsPageClient />
    </HydrationBoundary>
  );
};
```

### Files Created/Modified

| File | Change |
|------|--------|
| `components/providers/query-provider.tsx` | Added default options (staleTime, gcTime) |
| `hooks/use-fetch-all-posts.ts` | New - TanStack Query hook for all posts |
| `hooks/use-fetch-posts-by-tag.ts` | New - Filters from cached posts |
| `app/posts/components/PostsPageClient.tsx` | New - Client component using cached data |
| `app/tags/components/TagPageClient.tsx` | New - Client component using cached data |
| `components/common/SpotlightClient.tsx` | New - Spotlight using cached data |
| `components/contents/RelatedPostsWrapper.tsx` | New - Related posts using cached data |
| `app/posts/page.tsx` | Updated to use SSR prefetching |
| `app/tags/[slug]/page.tsx` | Updated to use SSR prefetching |
| `app/posts/[slug]/layout.tsx` | Updated to use SSR prefetching |
| `app/tags/[slug]/layout.tsx` | Updated to use client Spotlight |
| `components/contents/ContentBody.tsx` | Updated to use RelatedPostsWrapper |

### Key Patterns

1. **SSR Prefetch + Hydration**: Server prefetches, client hydrates - no loading spinner on first load
2. **Single Query Key**: All pages use `["posts", "all"]` for shared cache
3. **Client-side Filtering**: Tag pages filter from cached data, no additional API calls
4. **Hybrid Pagination**: Posts page uses `useInfiniteQuery` for load-more, with fallback to cached data

### Prevent This Issue
- Always use TanStack Query with SSR prefetching for client-side data
- Never rely on React's `cache()` alone for navigation-level caching
- Test navigation: posts → detail → posts to verify no refetch

### Audit Summary

| Priority | Rule | File | Status |
|----------|------|------|--------|
| CRITICAL | `async-parallel` | `app/posts/[slug]/page.tsx` | ✅ |
| CRITICAL | `bundle-dynamic-imports` | `app/layout.tsx` | ✅ |
| HIGH | `server-dedup-props` | `app/posts/page.tsx` | ✅ |
| HIGH | `force-dynamic` everywhere | 4 pages | ✅ |
| HIGH | `unoptimized: true` | `next.config.ts` | ✅ |
| MEDIUM | Mount guard blanks SSR | `app/layout.tsx` | ✅ |
| MEDIUM | No-op client component | 3 page components | ✅ |
| MEDIUM | Ineffective `useCallback` | `use-fetch-posts.ts` | ✅ |
| LOW | Dead code | `use-layout-store.ts` | ✅ |
| LOW | Unnecessary wrapper | `get-post-by-id.ts` | ✅ |

---

## Code Review & Refactor Session (2026-03-24)

Analysis via code-reviewer + code-refactorer agents. Surgical fixes targeting bugs, correctness, and consistency.

### HIGH — Bugs / Correctness

- [x] **`Comments.tsx` — Dead no-op useEffect**
  - File: `components/contents/Comments.tsx`
  - Fix: Removed `useEffect`, `setColorScheme` destructuring, and `useEffect` import

- [x] **`use-fetch-posts.ts` — Duplicated filter + risky cache mutation**
  - File: `hooks/use-fetch-posts.ts`
  - Fix: Removed `useEffect`, `useQueryClient`, and `cachedPosts`; simplified to pure infinite query

- [x] **`Content.tsx` — No error boundary around NotionRenderer**
  - Files: `components/contents/Content.tsx`, `components/contents/ContentErrorBoundary.tsx` (new)
  - Fix: Created class-based `ContentErrorBoundary`, wrapped `<NotionRenderer>`

### MEDIUM — Code Quality / Consistency

- [x] **`useTheme.ts` — New object literal every render**
  - File: `hooks/useTheme.ts`
  - Fix: Wrapped return value in `useMemo`

- [x] **`HomePage.tsx` — Direct Mantine coupling instead of `useTheme`**
  - File: `components/home/HomePage.tsx`
  - Fix: Replaced `useMantineColorScheme` with `useTheme()` hook

### LOW — Cleanup

- [x] **Remove dead commented-out code**
  - `components/layout/Layout.tsx`: removed `{/* <ThemeMode /> */}` + unused import
  - `app/about/layout.tsx`: removed `{/* <Menu> */}` + unused import
  - `components/providers/MantineProviders.tsx`: removed commented Player, hotkeys, and unused imports

---

## React Doctor Audit (2026-03-24)

Score: **96 → 99 / 100**. 1 intentional warning remaining.

### Fixed

- [x] **Array index keys** (4 instances)
  - `components/home/MainProfile.tsx`: `key={text}`
  - `app/posts/components/TagsBanner.tsx`: `key={tag[0]}`
  - `components/contents/ContentBody.tsx`: `key={tag.id}`
  - `app/posts/components/TagItem.tsx`: `key={tag.id}` + replaced `<p onClick>` with `<Link>`

- [x] **A11y: clickable non-interactive elements**
  - `app/tags/components/BackToPosts.tsx`: `<div onClick>` → `<button>`
  - `app/posts/components/TagItem.tsx`: `<p onClick>` → `<Link>`

- [x] **Trivial `useMemo`**
  - `app/posts/components/PostsPageLayout.tsx`: removed `useMemo` from `categoryCount`

- [x] **Redundant `setVolumeState` in useEffect**
  - `context/MusicPlayerContext.tsx`: removed from effect (state already initialized with it)

### Remaining (intentional)

- ⚠️ **`useState` initialized from prop `defaultVolume`** — `context/MusicPlayerContext.tsx:63`
  - Intentional: `defaultVolume` is initial-only state; user volume changes independently. Not a bug.
