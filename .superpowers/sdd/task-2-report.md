# Task 2 Report: Show content fetch failure state

## Status

DONE

## Files

- `app/posts/[slug]/page.tsx`
  - Passes a missing record map through to the client boundary instead of omitting the post content boundary.
- `app/posts/[slug]/components/PostPageClient.tsx`
  - Accepts `ExtendedRecordMap | null`.
  - Renders `Article content is temporarily unavailable.` only for a missing record map, without adding a wrapper.
  - Preserves the prior successful fragment containing `Content` and `PostSummaryClient` unchanged.
- `app/posts/actions/posts.ts`
  - Sanitizes content-fetch failure logs to page ID and configured Notion endpoint hostname only.
- `tests/integration/components/PostPageClient.test.tsx`
  - Covers the missing record-map fallback and verifies the successful DOM tree has no added wrapper.

## Commit

`fix(posts): preserve content success markup`

## Test

Command:

```text
bun vitest run tests/integration/components/PostPageClient.test.tsx
```

Output:

```text
 RUN  v4.1.0 D:/Github/next-level-blog/.worktrees/published-notion-domain


 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  23:43:04
   Duration 1.79s (transform 124ms, setup 172ms, import 372ms, tests 67ms, environment 946ms)
```

## Concerns

None known. The existing metadata error handling remains unchanged; content-fetch logs no longer include caught error objects.
