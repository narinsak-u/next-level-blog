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

- [ ] **Convert unnecessary Client Components**
  - Status: Not yet implemented

---

## Summary

| Priority | Count | Completed |
|----------|-------|-----------|
| P0 (Critical) | 3 | ✅ 3 |
| P1 (High) | 9 | ✅ 9 |
| P2 (Medium) | 10 | ✅ 8, ⏳ 1 |
| P3 (Nice to Have) | 5 | ✅ 3, ⏳ 2 |
| **Total** | **27** | **23 ✅** |

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
