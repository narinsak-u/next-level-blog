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
