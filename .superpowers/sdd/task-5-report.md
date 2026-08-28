# Task 5 Report: Add ISR and authenticated cache invalidation

## Status

Implemented five-minute ISR for post and tag detail routes and replaced query-string-secret revalidation with authenticated JSON POST invalidation.

## Changes

- Added `export const revalidate = 300` to `app/posts/[slug]/page.tsx` and `app/tags/[slug]/page.tsx`.
- Replaced `GET /api/revalidate?secret=...&path=...` with `POST /api/revalidate`.
- Require an exact `Authorization: Bearer ${REVALIDATION_SECRET}` header; invalid or missing credentials return `401`.
- Parse and validate JSON payloads with optional non-empty string `paths` and `tags` arrays. Invalid JSON, wrong shapes, empty arrays, and missing entries return `400`.
- Invalidate every requested path with `revalidatePath` and every requested tag with Next 16-compatible `revalidateTag(tag, "max")`.
- Preserve the successful `{ revalidated: true }` response.
- Centralized the existing Task 2 Notion cache tags and tag builders in `lib/notion-cache.ts` without changing their values.
- Added focused route-handler tests covering authentication, malformed/empty payloads, path invalidation, tag invalidation, and the Next 16 profile argument.
- Updated `docs/WORKFLOW.md` to document the bounded `RelatedPostsServer` article flow and authenticated POST revalidation contract instead of the removed full-list hydration/query-secret flow.

## TDD Evidence

1. Added `tests/unit/lib/revalidation.test.ts` before implementing the POST handler.
2. Ran the focused test red; it failed because the route exported no `POST` handler:

   ```text
   TypeError: POST is not a function
   ```

3. Implemented the minimal handler and ran the focused test green:

   ```text
   Test Files  1 passed (1)
   Tests  3 passed (3)
   ```

4. Re-ran the focused cache and revalidation tests after centralizing tags:

   ```text
   Test Files  2 passed (2)
   Tests  9 passed (9)
   ```

5. TypeScript validation passed:

   ```text
   bun x tsc --noEmit --pretty false
   ```

6. Confirmed the installed Next 16.2 declaration requires the second `revalidateTag` profile argument (`string | CacheLifeConfig`); the handler uses the documented `"max"` profile.

## Concerns

No known implementation concerns. The workflow documentation now reflects the current bounded article and POST revalidation flows.

## Verification

Commands run in `D:/Github/next-level-blog/.worktrees/cms-content-performance`:

```text
$ bun x vitest run tests/unit/lib/revalidation.test.ts
Test Files  1 passed (1)
Tests  3 passed (3)

$ bun x vitest run tests/unit/lib/notion-cache.test.ts tests/unit/lib/revalidation.test.ts
Test Files  2 passed (2)
Tests  9 passed (9)

$ bun x tsc --noEmit --pretty false
Passed with no output.
```
