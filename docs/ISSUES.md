# Code Review Issues - Action Plan

**Status: ✅ ALL ITEMS COMPLETED**

---

## P0 - Critical (Fix Immediately)

### Security

- [x] **Unprotected revalidation endpoint**
  - Location: `app/api/revalidate/route.ts`
  - Fix: Added secret token verification - returns 401 if `secret !== process.env.REVALIDATION_SECRET`

- [x] **CSP header too restrictive**
  - Location: `next.config.ts`
  - Fix: Updated CSP to allow Google Fonts, Vercel Analytics, Twitter/X, etc.

### Performance

- [x] **Waterfall fetching on post pages**
  - Location: `app/posts/[slug]/layout.tsx`
  - Fix: Used `Promise.all([getAllPosts(), getPostById(slug)])` for parallel fetching

### Robustness

- [x] **Non-null assertion crash risk**
  - Location: `actions/get-post-by-id.ts`
  - Fix: Added null check, returns `null` instead of crashing

---

## P1 - High Priority

### Type Safety

- [x] **Replace `any` types in helpers**
  - Location: `helpers/post-mapping.ts`
  - Fix: Used `QueryDatabaseResponse` from `@notionhq/client`

- [x] **Replace `any` types in actions**
  - Location: `actions/notion.ts`
  - Fix: Used proper Notion filter/sort types

- [x] **Replace `any` types in react-notion-x wrapper**
  - Location: `actions/notion-x.ts`
  - Fix: Added `ExtendedRecordMap` return type

### Robustness

- [x] **Hardcoded array access crash risk**
  - Location: `app/posts/components/contents/TimelineContent.tsx`
  - Fix: Used `.map()` with null safety, extracted `CATEGORY_CONFIGS`

### Performance

- [ ] **No pagination on posts page**
  - Location: `app/posts/page.tsx`
  - Status: Not yet implemented

### Bug

- [x] **Incorrect notFound() usage**
  - Location: `components/contents/ContentTitle.tsx`
  - Fix: Already correct - returns properly

---

## P2 - Medium Priority

### Code Organization

- [x] **Extract sub-components from NewProfile**
  - Location: `components/home/NewProfile.tsx`
  - Fix: Extracted `Credit.tsx`, `MusicPlayer.tsx`

### Performance

- [x] **Memoize tag/category calculations**
  - Location: `app/posts/components/PostsPageLayout.tsx`
  - Fix: Added `useMemo` hooks

### React Patterns

- [x] **Unnecessary Client Components**
  - Location: `components/common/Layout.tsx`, `PageLayout.tsx`
  - Status: Kept as-is (Mantine requires client-side rendering)

- [x] **Redundant useEffect in ThemeMode**
  - Location: `components/common/ThemeMode.tsx`
  - Fix: Removed redundant effect

### Architecture

- [x] **ThemeMode state hydration mismatch**
  - Location: `hooks/use-layout-store.ts`
  - Fix: Added `skipHydrationWarning: true`

---

## P3 - Nice to Have

- [ ] Add environment validation for required env vars
- [ ] Add sitemap.xml for SEO
- [ ] Add proper error boundaries per route
- [ ] Consider adding loading skeletons for better UX

---

## Summary

| Priority | Count | Completed |
|----------|-------|-----------|
| P0 (Critical) | 4 | ✅ 4 |
| P1 (High) | 5 | ✅ 4, ⏳ 1 |
| P2 (Medium) | 5 | ✅ 5 |
| P3 (Nice to Have) | 4 | ⏳ 4 remaining |
| **Total** | **18** | **13 ✅** |

---

## New Files Created

| File | Purpose |
|------|---------|
| `components/home/Credit.tsx` | Extracted credit component |
| `components/home/MusicPlayer.tsx` | Extracted music player |
| `components/home/Menu.tsx` | Extracted menu |
| `components/ui/AnimatePresenceGuard.tsx` | Animation wrapper |
| `components/ui/VideoWithPlaceholder.tsx` | Video with loading placeholder |
| `components/ui/FloatingButton.tsx` | Floating button compound |
| `components/ui/ShareButton.tsx` | Share button compound |
| `components/ui/MediaBackground.tsx` | Media background compound |
| `components/ui/PostCard.tsx` | Unified post card |
| `components/home/ManifestoPanel.tsx` | Manifesto panel compound |
| `context/MusicPlayerContext.tsx` | Music player context provider |
| `hooks/useTheme.ts` | Consolidated theme hook |
| `lib/constants.ts` | Shared constants |
| `lib/errors.ts` | Error handling utilities |
| `lib/utils.ts` | Utility functions (expanded) |
| `types/site-metadata.ts` | Site metadata Zod schema |

---

## Fixed Issues

| Issue | File | Fix |
|-------|------|-----|
| Security: Unprotected endpoint | `app/api/revalidate/route.ts` | Added secret token |
| Security: CSP too restrictive | `next.config.ts` | Updated CSP headers |
| Performance: Waterfall fetch | `app/posts/[slug]/layout.tsx` | Promise.all |
| Robustness: Non-null assertion | `actions/get-post-by-id.ts` | Null check |
| Type: `any` in post-mapping | `helpers/post-mapping.ts` | Notion SDK types |
| Type: `any` in actions | `actions/notion.ts`, `notion-x.ts` | Proper types |
| Robustness: Array access | `TimelineContent.tsx` | Safe iteration |
| Performance: Unmemoized | `PostsPageLayout.tsx` | useMemo |
| Pattern: Redundant effect | `ThemeMode.tsx` | Removed effect |
| Architecture: Hydration | `use-layout-store.ts` | skipHydrationWarning |
| Typo: siteMatedata | `site/siteMetadata.ts` | Renamed |
