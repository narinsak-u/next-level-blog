# Task 3 Report: Bound related post hydration

## Status

Implemented server-side bounded related-post selection and removed full-list article hydration.

## Changes

- Added `selectRelatedPosts(posts, currentPost, limit)` as a pure selector.
  - Excludes the current post.
  - Prioritizes shared-tag matches.
  - Uses same-category posts without shared tags as fallback candidates.
  - Preserves source ordering within each priority group and caps the result at the requested limit.
- Added `RelatedPostsServer`, which fetches at most six unfiltered post summaries, selects at most three related posts, and reuses the existing `RelatedPosts` presentation.
- Changed `RelatedPosts` to render the already-selected server results while preserving its existing grid/list presentation and `No post matched...` fallback.
- Removed `RelatedPostsWrapper` and its client-side `allPosts` query.
- Removed `QueryClient`, `fetchAllPosts` prefetching, and `HydrationBoundary` from the article layout.
- Passed the server-rendered related-post result through `ContentBody` without changing article content rendering.

## TDD Evidence

1. Added `tests/unit/helpers/related-posts.test.ts` before implementing the selector.
2. Ran the focused test red:

   ```text
   Error: Failed to resolve import "@/app/posts/helpers/related-posts"
   ```

3. Implemented the selector and ran the focused test green:

   ```text
   Test Files  1 passed (1)
   Tests  3 passed (3)
   ```

4. Re-ran the focused test after the component and layout integration; it remained green:

   ```text
   Test Files  1 passed (1)
   Tests  3 passed (3)
   ```

5. TypeScript check passed:

   ```text
   bun x tsc --noEmit --pretty false
   ```

## Concerns

The server query is intentionally bounded to six summaries and is unfiltered so shared-tag posts from any category can be considered before same-category fallback. A shared-tag post outside that bounded candidate set cannot be selected, which is the explicit performance trade-off for removing the full-list article hydration.

## Verification

Commands run in `D:/Github/next-level-blog/.worktrees/cms-content-performance`:

```text
$ bun vitest run tests/unit/helpers/related-posts.test.ts
Test Files  1 passed (1)
Tests  3 passed (3)

$ bun x tsc --noEmit --pretty false
Passed with no output.
```
