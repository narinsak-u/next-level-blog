# Test Plan: next-level-blog

## Overview
This test plan outlines comprehensive testing strategy for the Notion-powered blog built with Next.js 15.

---

## Recommended Test Stack

| Type | Library | Purpose |
|------|---------|---------|
| Unit & Integration | **Vitest** | Fast Vite-native test runner |
| Component | **@testing-library/react** | React component testing |
| E2E | **Playwright** | Browser automation |
| Mocking | **msw** | API mocking for Notion |
| Coverage | **c8** | Code coverage reports |

---

## Test File Structure

```
tests/
├── unit/
│   ├── helpers/
│   │   └── post-mapping.test.ts
│   ├── lib/
│   │   ├── utils.test.ts
│   │   └── errors.test.ts
│   └── context/
│       └── music-player-context.test.tsx
├── integration/
│   ├── actions/
│   │   ├── notion.test.ts
│   │   └── notion-x.test.ts
│   └── components/
│       ├── Credit.test.tsx
│       ├── MusicPlayer.test.tsx
│       ├── ContentTitle.test.tsx
│       ├── FloatingButton.test.tsx
│       ├── ShareButton.test.tsx
│       ├── MediaBackground.test.tsx
│       └── ManifestoPanel.test.tsx
├── e2e/
│   ├── navigation.spec.ts
│   ├── posts.spec.ts
│   ├── music-player.spec.ts
│   └── theme.spec.ts
└── fixtures/
    ├── notion-response.json
    └── posts.ts
```

---

## Unit Tests

### 1. `helpers/post-mapping.test.ts`

**Test File:** `tests/unit/helpers/post-mapping.test.ts`

| ID | Test Case | Expected |
|----|-----------|----------|
| PM-001 | Valid Notion response maps correctly | Returns `PageDataSchemaType[]` with all fields |
| PM-002 | Empty array returns empty array | Returns `[]` |
| PM-003 | Missing optional fields use defaults | `coverImage` defaults to `defaultImage` |
| PM-004 | Invalid data throws Zod error | `console.error` called, returns `[]` |
| PM-005 | Null title uses fallback "title" | Title defaults to `"title"` |
| PM-006 | Multi-select tags parsed correctly | Returns array of tag objects |
| PM-007 | Date fields handle null | Uses `DEFAULT_DATE` fallback |

**Mock Data:**
```typescript
const validNotionPage = {
  id: "uuid-123",
  created_time: "2024-01-15T10:00:00.000Z",
  last_edited_time: "2024-01-20T15:30:00.000Z",
  properties: {
    Name: { title: [{ plain_text: "Test Post" }] },
    Description: { rich_text: [{ plain_text: "Test description" }] },
    Tags: { multi_select: [{ id: "1", name: "React", color: "blue" }] },
    Category: { select: { name: "Tech" } },
    Status: { status: { name: "Done" } }
  },
  cover: { external: { url: "https://example.com/cover.jpg" } },
  created_by: { id: "user-123" },
  last_edited_by: { id: "user-456" },
  icon: { emoji: "🎉" }
};
```

---

### 2. `lib/utils.test.ts`

**Test File:** `tests/unit/lib/utils.test.ts`

| ID | Test Case | Expected |
|----|-----------|----------|
| UT-001 | `cn()` merges class names correctly | Tailwind classes merged |
| UT-002 | `cn()` handles conditional classes | False conditions removed |
| UT-003 | `getFileExtension()` extracts extension | `"mp4"` from `"video.mp4"` |
| UT-004 | `getFileExtension()` handles query strings | Returns extension before `?` |
| UT-005 | `isVideo()` returns true for video ext | `true` for `"mp4"`, `"webm"` |
| UT-006 | `isVideo()` returns false for images | `false` for `"jpg"`, `"png"` |
| UT-007 | `isVideo()` handles uppercase | `"MP4"` recognized as video |

---

### 3. `lib/errors.test.ts`

**Test File:** `tests/unit/lib/errors.test.ts`

| ID | Test Case | Expected |
|----|-----------|----------|
| ER-001 | `AppError` has correct properties | `name`, `message`, `code`, `statusCode` |
| ER-002 | `NotionAPIError` defaults to 500 | Status code 500 when not specified |
| ER-003 | `ValidationError` always 400 | Status code 400 |
| ER-004 | `NotFoundError` always 404 | Status code 404 |
| ER-005 | `AuthenticationError` always 401 | Status code 401 |
| ER-006 | `handleError()` wraps unknown errors | Returns `AppError` |
| ER-007 | `handleError()` preserves AppError | Passes through custom errors |

---

### 4. `context/music-player-context.test.tsx`

**Test File:** `tests/unit/context/music-player-context.test.tsx`

| ID | Test Case | Expected |
|----|-----------|----------|
| MP-001 | Initial state: `isPlaying` false | Default state correct |
| MP-002 | `togglePlay()` plays audio | `isPlaying` becomes `true` |
| MP-003 | `togglePlay()` when playing pauses | `isPlaying` becomes `false` |
| MP-004 | `play()` directly plays audio | `isPlaying` becomes `true` |
| MP-005 | `pause()` directly pauses audio | `isPlaying` becomes `false` |
| MP-006 | `setVolume()` updates volume | `audioRef.current.volume` updated |
| MP-007 | Audio ended event sets `isPlaying` false | Cleanup works correctly |
| MP-008 | Throws error when used outside provider | Error thrown |

---

### 5. `hooks/useTheme.test.ts`

**Test File:** `tests/unit/hooks/useTheme.test.ts`

| ID | Test Case | Expected |
|----|-----------|----------|
| TH-001 | Returns correct `isDark` | `true` when `colorScheme === "dark"` |
| TH-002 | Returns correct `isLight` | `true` when `colorScheme === "light"` |
| TH-003 | `toggle()` calls `toggleColorScheme` | State toggles correctly |
| TH-004 | `setDark()` sets dark mode | `setColorScheme("dark")` called |
| TH-005 | `setLight()` sets light mode | `setColorScheme("light")` called |

---

## Integration Tests

### 6. `actions/notion.test.ts`

**Test File:** `tests/integration/actions/notion.test.ts`

| ID | Test Case | Expected |
|----|-----------|----------|
| AN-001 | `getAllPosts()` returns posts | Array of posts on success |
| AN-002 | `getAllPosts()` with no posts | Returns `[]` |
| AN-003 | `getPostsByCategory()` filters correctly | Only specified category |
| AN-004 | `getPage()` retrieves single page | Single page object |
| AN-005 | API error throws `NotionAPIError` | Error caught and logged |

**Mock with MSW:**
```typescript
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const handlers = [
  http.post('/api/data-sources/query', () => {
    return HttpResponse.json({ results: [mockNotionPage] });
  }),
];

export const server = setupServer(...handlers);
```

---

### 7. `components/Credit.test.tsx`

**Test File:** `tests/integration/components/Credit.test.tsx`

| ID | Test Case | Expected |
|----|-----------|----------|
| CR-001 | Renders credit link when configured | Link with `Copyright` icon |
| CR-002 | Credit hidden when no text/url | No credit element rendered |
| CR-003 | External link has `target="_blank"` | `rel="noopener"` present |
| CR-004 | MusicPlayer rendered | Play/pause button visible |

---

### 8. `components/MusicPlayer.test.tsx`

**Test File:** `tests/integration/components/MusicPlayer.test.tsx`

| ID | Test Case | Expected |
|----|-----------|----------|
| MP-001 | Shows play icon initially | `<Play />` icon rendered |
| MP-002 | Click toggles to pause icon | `<Pause />` icon after click |
| MP-003 | `aria-label` updates correctly | Dynamic based on `isPlaying` |
| MP-004 | Audio element has correct src | Uses `MUSIC.SRC` constant |
| MP-005 | Audio is muted and looping | `loop` and `muted` attributes |

---

### 9. `components/ContentTitle.test.tsx`

**Test File:** `tests/integration/components/ContentTitle.test.tsx`

| ID | Test Case | Expected |
|----|-----------|----------|
| CT-001 | Renders title correctly | Title text visible |
| CT-002 | Renders formatted date | `format()` applied correctly |
| CT-003 | Shows `lastUpdated` date | Uses `lastUpdated` when available |
| CT-004 | Falls back to `createdTime` | When `lastUpdated` is empty |
| CT-005 | Renders tags | Tag components rendered |
| CT-006 | Handles missing postData | `notFound()` called |

---

### 10. `components/ui/FloatingButton.test.tsx`

**Test File:** `tests/integration/components/FloatingButton.test.tsx`

| ID | Test Case | Expected |
|----|-----------|----------|
| FB-001 | Renders icon correctly | Icon component rendered |
| FB-002 | Click calls `onClick` | Callback invoked |
| FB-003 | `href` creates link | `a` tag with correct href |
| FB-004 | `external` adds `target="_blank"` | Opens in new tab |
| FB-005 | `aria-label` set correctly | Accessibility attribute present |

---

### 11. `components/ui/ShareButton.test.tsx`

**Test File:** `tests/integration/components/ShareButton.test.tsx`

| ID | Test Case | Expected |
|----|-----------|----------|
| SB-001 | Facebook button renders | `BrandFacebook` icon visible |
| SB-002 | Twitter button renders | `TwitterIcon` visible |
| SB-003 | Uses correct share URL | URL contains encoded `postLink` |
| SB-004 | Custom hashtag applied | Share URL includes hashtag |

---

### 12. `components/ui/MediaBackground.test.tsx`

**Test File:** `tests/integration/components/MediaBackground.test.tsx`

| ID | Test Case | Expected |
|----|-----------|----------|
| MB-001 | Renders video with placeholder | `VideoBackground` rendered |
| MB-002 | Video plays automatically | Autoplay behavior works |
| MB-003 | Placeholder hides when video loads | `invisible` class applied |
| MB-004 | Handles missing placeholder | Warning in dev mode |

---

### 13. `components/home/ManifestoPanel.test.tsx`

**Test File:** `tests/integration/components/ManifestoPanel.test.tsx`

| ID | Test Case | Expected |
|----|-----------|----------|
| MP-001 | Trigger opens panel | Click toggles `isOpen` |
| MP-002 | Close button hides panel | Click closes panel |
| MP-003 | ESC key closes panel | `Escape` key handler works |
| MP-004 | Throws error outside provider | Context error thrown |
| MP-005 | `useManifesto` hook works | State accessible via hook |

---

## E2E Tests (Playwright)

### 14. Navigation Tests

**Test File:** `tests/e2e/navigation.spec.ts`

| ID | Test Case | Steps |
|----|-----------|-------|
| NAV-001 | Home page loads | 1. Visit `/` 2. Check title |
| NAV-002 | Navigate to posts | 1. Click Posts link 2. Check `/posts` |
| NAV-003 | Navigate to about | 1. Visit `/about` 2. Content renders |
| NAV-004 | 404 page works | 1. Visit `/nonexistent` 2. 404 UI |

---

### 15. Posts Flow

**Test File:** `tests/e2e/posts.spec.ts`

| ID | Test Case | Steps |
|----|-----------|-------|
| POST-001 | Posts page loads | 1. Visit `/posts` 2. Timeline visible |
| POST-002 | View single post | 1. Click post 2. Content renders |
| POST-003 | Post metadata shown | 1. Open post 2. Title/date visible |
| POST-004 | Share button visible | 1. Open post 2. Share component present |
| POST-005 | Layout toggle works | 1. Toggle grid/list 2. Layout changes |

---

### 16. Music Player

**Test File:** `tests/e2e/music-player.spec.ts`

| ID | Test Case | Steps |
|----|-----------|-------|
| MUSIC-001 | Play button exists on home | 1. Visit `/` 2. Button visible |
| MUSIC-002 | Click play button | 1. Click 2. Icon changes to pause |
| MUSIC-003 | Toggle back to pause | 1. While playing 2. Click again |
| MUSIC-004 | Music persists across navigation | 1. Play 2. Navigate 3. Still playing |

---

### 17. Theme Switching

**Test File:** `tests/e2e/theme.spec.ts`

| ID | Test Case | Steps |
|----|-----------|-------|
| THEME-001 | Theme toggle exists | 1. Find toggle 2. Visible |
| THEME-002 | Toggle switches theme | 1. Click toggle 2. Theme changes |
| THEME-003 | Theme persists | 1. Set theme 2. Reload 3. Same theme |

---

## Edge Cases & Error Handling

### 18. Empty States

| ID | Test Case | Expected |
|----|-----------|----------|
| EMPTY-001 | No posts in Notion | Empty timeline with "END OF CONTENT" |
| EMPTY-002 | Empty category | Category section hidden |
| EMPTY-003 | No tags on post | Tags section not rendered |

---

### 19. Error Handling

| ID | Test Case | Expected |
|----|-----------|----------|
| ERR-001 | Invalid post slug | Redirect to 404 or error page |
| ERR-002 | Notion API fails | Error boundary shows message |
| ERR-003 | Network offline | Offline indicator or retry |
| ERR-004 | MusicPlayer outside provider | Throws error |

---

### 20. Environment Variables

| ID | Test Case | Expected |
|----|-----------|----------|
| ENV-001 | Missing `NOTION_TOKEN` | Build fails with clear error |
| ENV-002 | Missing `NOTION_DATA_SOURCE_ID` | Graceful error message |

---

## Priority Order

### Phase 1 - Critical Path (Before any feature work)
1. `cn()` utility function
2. `postMapping()` with Zod validation
3. Error classes
4. `getAllPosts()` action
5. `MusicPlayerContext`

### Phase 2 - Component Basics
6. `MusicPlayer` component
7. `Credit` component
8. `ContentTitle` component
9. Theme switching
10. `FloatingButton`

### Phase 3 - User Flows
11. Navigation between pages
12. Posts list and detail view
13. 404/error handling

### Phase 4 - Robustness
14. Edge cases (empty data)
15. Error boundaries
16. Loading states
17. Compound components

---

## Coverage Targets

| Type | Target |
|------|--------|
| Functions | 90% |
| Branches | 80% |
| Lines | 85% |

---

## Commands

```bash
# Run all tests
bun test

# Run with coverage
bun test -- --coverage

# Run E2E
bun run test:e2e

# Run in watch mode
bun test -- --watch

# Update snapshots
bun test -- --updateSnapshot
```

---

## CI Integration

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest
      - run: bun install --frozen-lockfile
      - run: bun test -- --coverage
      - uses: codecov/codecov-action@v4
      - run: bun run test:e2e
```

---

## Component Test Coverage Map

| Component | File | Pattern | Priority |
|-----------|------|---------|----------|
| `FloatingButton` | `components/ui/FloatingButton.tsx` | Compound | High |
| `FloatingButtonGroup` | `components/ui/FloatingButton.tsx` | Compound | High |
| `MusicPlayerProvider` | `context/MusicPlayerContext.tsx` | Context | High |
| `MusicPlayer` | `components/home/MusicPlayer.tsx` | Consumer | High |
| `ShareButton` | `components/ui/ShareButton.tsx` | Compound | Medium |
| `ShareGroup` | `components/ui/ShareButton.tsx` | Compound | Medium |
| `MediaBackground` | `components/ui/MediaBackground.tsx` | Compound | Medium |
| `VideoBackground` | `components/ui/MediaBackground.tsx` | Compound | Medium |
| `ImageBackground` | `components/ui/MediaBackground.tsx` | Compound | Medium |
| `ManifestoPanel` | `components/home/ManifestoPanel.tsx` | Compound | Medium |
| `ManifestoTrigger` | `components/home/ManifestoPanel.tsx` | Compound | Medium |
| `ManifestoContent` | `components/home/ManifestoPanel.tsx` | Compound | Medium |
| `PostCardBase` | `components/ui/PostCard.tsx` | Unified | Medium |
| `useTheme` | `hooks/useTheme.ts` | Hook | Low |
