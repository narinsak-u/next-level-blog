# Task 2 Report: Add persistent Notion cache wrappers

## Scope

Implemented persistent Next.js caching for all Notion reads used by the post actions. Task 1 code was not changed except for the required integration in `app/posts/actions/posts.ts`.

## Changes

- Added `lib/notion-cache.ts` with five-minute `unstable_cache` wrappers for:
  - Post metadata (`pages.retrieve`)
  - Post content record maps (`getPage`)
  - Static page content (`getPage` with a page-type cache key)
  - Post dates (`dataSources.query`)
  - Cursor-paginated post list pages (`dataSources.query`)
- Added stable cache-key builders that include every result-affecting input, including data source ID, status, category, cursor, and page size for list pages.
- Applied the required cache tags:
  - `notion:posts`
  - `notion:post:{id}`
  - `notion:page:{type}`
  - `notion:post-dates`
- Kept content caches bounded at five-minute revalidation so signed Notion asset URLs are not cached indefinitely.
- Routed all Notion reads in `posts.ts` through the cache wrappers while preserving existing `[]`/`null` fallbacks and error logging. React `cache()` remains only around action functions for request-level deduplication.
- Added focused unit tests for key stability, tag/revalidation configuration, API routing, and signed-content cache lifetime.

## TDD Evidence

1. Added `tests/unit/lib/notion-cache.test.ts` before the cache implementation.
2. Ran the focused test red:

   ```text
   bun vitest run tests/unit/lib/notion-cache.test.ts
   Error: Failed to resolve import "@/lib/notion-cache"
   ```

3. Implemented the cache wrappers and `posts.ts` integration.
4. Ran the focused tests green:

   ```text
   bun vitest run tests/unit/lib/notion-cache.test.ts tests/unit/helpers/post-query.test.ts
   Test Files 2 passed; Tests 8 passed
   ```

5. Ran the TypeScript check:

   ```text
   bun x tsc --noEmit --pretty false
   passed with no output
   ```

## Concerns

- Cache key values are built from Notion IDs and query strings; these are expected to be stable deployment inputs. No known functional concerns remain.
