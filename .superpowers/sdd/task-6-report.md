# Task 6 Report: Split article rendering from AI summary client state

## Status

Implemented the client-state split while preserving the article renderer and existing AI-summary behavior.

## Changes

- Added `app/posts/[slug]/components/PostSummaryClient.tsx` to own AI summary state, cache reads/writes, request handling, streaming parsing, abort handling, retry behavior, and existing error messages.
- Kept the article path in `PostPageClient` focused on rendering `Content` and composing `PostSummaryClient`.
- Kept `ScrollToTop` and its AI-summary interaction inside `PostSummaryClient`, preserving the existing summary trigger and rendered order.
- Added `tests/integration/components/PostPageClient.test.tsx` regression coverage proving article content renders on initial mount, the summary client is composed, and no `/api/ai-summary` request is made before interaction.

## TDD Evidence

1. Added the regression test before the production split.
2. Ran it red; it failed because `PostPageClient` did not compose `PostSummaryClient`:

   ```text
   AssertionError: expected "vi.fn()" to be called 1 times, but got 0 times
   ```

3. Extracted the existing summary implementation into `PostSummaryClient` and composed it from `PostPageClient`.
4. Ran the focused test green:

   ```text
   Test Files  1 passed (1)
   Tests  1 passed (1)
   ```

## Verification

Commands run from the worktree:

```text
bun x vitest run tests/integration/components/PostPageClient.test.tsx tests/integration/components/AISummaryPopup.test.tsx
Test Files  2 passed (2)
Tests  7 passed (7)

git diff --check
Passed with no output.
```

## Concerns

No known concerns. The summary logic was moved without changing its cache TTL, lazy request trigger, abort behavior, stream parsing, retry path, or error messages.
