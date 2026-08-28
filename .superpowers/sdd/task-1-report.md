# Task 1 Report: Extract and test post query primitives

## Scope

Implemented the CMS post-query primitive extraction and cursor-pagination contract from Task 1.

## Changes

- Added `app/posts/helpers/post-query.ts` with:
  - `PostQueryOptions` (`category`, `cursor`, `pageSize`, and `status`)
  - `PostQueryPage` (`items`, `nextCursor`, and `hasMore`)
  - `PostQueryResponse` narrow Notion response type
  - `buildPostFilter()` using `QueryDataSourceParameters["filter"]`
  - `mapPostQueryPage()` converting Notion cursor fields to application fields
- Added `tests/unit/helpers/post-query.test.ts` covering:
  - Combined status and category filters
  - Cursor response mapping
- Updated `app/posts/actions/posts.ts`:
  - `fetchPosts()` now accepts cursor-based `PostQueryOptions`
  - Passes `page_size` and optional `start_cursor` to Notion
  - Returns `PostQueryPage` and preserves empty error fallback semantics
  - Removed `page` and manual `results.slice(...)` pagination
  - Reuses the existing post-result mapper through `mapPostQueryPage()`
  - Kept `fetchAllPosts()` as a separate bounded wrapper returning page items

## TDD evidence

1. Added the focused test before implementing the helper.
2. Ran the focused test red:
   - `bun vitest run tests/unit/helpers/post-query.test.ts`
   - Failed because `@/app/posts/helpers/post-query` did not exist.
3. Implemented the helper and action changes.
4. Ran the focused test green:
   - `bun vitest run tests/unit/helpers/post-query.test.ts`
   - `Test Files 1 passed; Tests 2 passed`

## Self-review

- Confirmed legacy `page`/`limit`/`results.slice(...)` pagination is absent from `fetchPosts()`.
- Confirmed the Notion request includes `page_size` and conditionally includes `start_cursor`.
- Confirmed `fetchAllPosts()` retains its array return contract for sitemap and other existing consumers.
- No formatters, linters, project-wide builds, or project-wide test suites were run.

## Concerns

- Existing infinite-query hook callers still use the old array/page-number contract; the planned follow-up task must migrate those callers to `PostQueryPage` cursor semantics.

## Task 1 Follow-up Fix: Migrate `useFetchPosts` to Cursor Pagination

### Scope

Updated `useFetchPosts` to consume the cursor-based `fetchPosts` result page contract:

- `initialPageParam` starts at `null`.
- Each query request passes `category`, `cursor`, and `pageSize`.
- Results flatten `page.items` across all loaded pages.
- Next-page loading follows `hasMore` and `nextCursor`.

### Changes

- Updated `app/posts/hooks/use-fetch-posts.ts`:
  - Replaced page-number and `limit` arguments with cursor-based options.
  - Removed the legacy array response cast.
  - Flattened `PostQueryPage.items`.
  - Returned `undefined` when `hasMore` is false or `nextCursor` is null.
- Added `tests/unit/hooks/use-fetch-posts.test.ts`:
  - Verifies the initial `null` cursor and subsequent cursor progression.
  - Verifies posts from multiple pages are flattened.
  - Verifies no next page is exposed when `hasMore` is false, even if a cursor is present.

### TDD Evidence

1. Added the focused hook tests before changing the hook implementation.
2. Ran the focused hook test red:

   ```text
   $ bun vitest run tests/unit/hooks/use-fetch-posts.test.ts

    RUN  v4.1.0 D:/Github/next-level-blog/.worktrees/cms-content-performance

    ❯ tests/unit/hooks/use-fetch-posts.test.ts (2 tests | 2 failed) 1122ms
        × progresses through cursor pages and flattens their items 1038ms
        × does not expose a next page when the response has no more pages 80ms

    Test Files  1 failed (1)
    Tests  2 failed (2)
   ```

   The failures showed that the old hook returned page envelopes instead of `items` and derived the next page from array length rather than `hasMore`.

3. Implemented the cursor-based hook changes.
4. Ran the focused hook and query tests green:

   ```text
   $ bun vitest run tests/unit/hooks/use-fetch-posts.test.ts tests/unit/helpers/post-query.test.ts

    RUN  v4.1.0 D:/Github/next-level-blog/.worktrees/cms-content-performance

    Test Files  2 passed (2)
    Tests  4 passed (4)
    Start at 21:16:16
    Duration 1.48s (transform 121ms, setup 256ms, import 219ms, tests 266ms, environment 1.49s)
   ```

### Concerns

- No known concerns for the migrated hook contract.
- Per task instructions, formatters, linters, project-wide builds, and project-wide test suites were not run.
