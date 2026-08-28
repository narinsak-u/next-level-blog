# CMS Content Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce Notion requests, article RSC payloads, and duplicate client downloads while preserving the current Notion/`react-notion-x` workflow.

**Architecture:** Add a small server-side Notion data layer using Next.js persistent caching with explicit keys and tags. Article routes fetch current metadata/content plus a bounded related-post list; they no longer hydrate the complete post list. Replace offset slicing with cursor-based Notion queries and connect the existing infinite query to cursors. Add authenticated content invalidation for both cache tags and route paths.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict mode, `@notionhq/client`, `notion-client`, TanStack Query v5, Vitest.

## Global Constraints

- Keep `react-notion-x` as the renderer.
- Preserve existing `[]`/`null` fallbacks and error logging for Notion failures.
- Cache signed Notion asset URLs only within a bounded five-minute content TTL.
- Use `@/` imports and strict TypeScript; do not add `any`, `@ts-ignore`, or `@ts-expect-error`.
- Use cursor pagination; do not reintroduce local offset slicing as the data-fetch mechanism.
- Revalidation must not expose secrets in GET query strings.
- Run focused tests after each task and the production build plus runtime smoke test at the end.

---

### Task 1: Extract and test post query primitives

**Files:**
- Create: `app/posts/helpers/post-query.ts`
- Test: `tests/unit/helpers/post-query.test.ts`
- Modify: `app/posts/actions/posts.ts`

**Interfaces:**
- Produces `PostQueryOptions`, `PostQueryPage`, `buildPostFilter()`, and `mapPostQueryPage()` for the server action and hook.
- `PostQueryPage` has `items: PageDataSchemaType[]`, `nextCursor: string | null`, and `hasMore: boolean`.

- [ ] **Step 1: Write failing tests for filter and cursor mapping**

```ts
it("combines status and category filters", () => {
  expect(buildPostFilter("Done", "Engineering")).toEqual({
    and: [
      { property: "Status", status: { equals: "Done" } },
      { property: "Category", select: { equals: "Engineering" } },
    ],
  });
});

it("maps a Notion response to a cursor page", () => {
  expect(mapPostQueryPage({ results: [], has_more: true, next_cursor: "cursor-2" })).toEqual({
    items: [],
    nextCursor: "cursor-2",
    hasMore: true,
  });
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `bun vitest run tests/unit/helpers/post-query.test.ts`
Expected: FAIL because the helper exports do not exist.

- [ ] **Step 3: Implement typed filter and cursor mapping**

Use `QueryDataSourceParameters["filter"]` for the filter output and a narrow local response type for `results`, `has_more`, and `next_cursor`. Reuse the existing post mapper from `posts.ts` without duplicating mapping logic.

- [ ] **Step 4: Update `fetchPosts` to accept `cursor` and `pageSize`**

The Notion query must pass `page_size: pageSize`, `start_cursor: cursor` when present, and return `PostQueryPage`. Remove `page` and all `results.slice(...)` behavior. Keep `fetchAllPosts()` as a separate bounded aggregate function temporarily for sitemap and non-article consumers.

- [ ] **Step 5: Run the focused test and verify it passes**

Run: `bun vitest run tests/unit/helpers/post-query.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/posts/helpers/post-query.ts app/posts/actions/posts.ts tests/unit/helpers/post-query.test.ts
git commit -m "perf(posts): use cursor pagination for Notion queries"
```

### Task 2: Add persistent Notion cache wrappers

**Files:**
- Create: `lib/notion-cache.ts`
- Modify: `app/posts/actions/posts.ts`
- Test: `tests/unit/lib/notion-cache.test.ts`

**Interfaces:**
- Produces cached functions for post metadata, post content, static page content, post dates, and list pages.
- Cache tags use `notion:posts`, `notion:post:{id}`, `notion:page:{type}`, and `notion:post-dates`.

- [ ] **Step 1: Write tests for stable cache key/tag construction**

```ts
it("builds distinct keys for distinct post content", () => {
  expect(postContentCacheKey("a")).not.toEqual(postContentCacheKey("b"));
});

it("uses the post tag for post metadata and content", () => {
  expect(postCacheTags("abc")).toContain("notion:post:abc");
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `bun vitest run tests/unit/lib/notion-cache.test.ts`
Expected: FAIL because the cache helper exports do not exist.

- [ ] **Step 3: Implement cache wrappers with `unstable_cache`**

Use a five-minute `revalidate` value. Cache keys must include every input that changes the result. Keep the wrapped functions small and typed so the Notion clients remain easy to mock. Do not cache an unbounded aggregate under a key that ignores filters.

- [ ] **Step 4: Route all Notion reads through the wrappers**

Update `fetchPostById`, `fetchPostContent`, `fetchStaticPageContent`, `fetchPostDates`, and cursor list reads. Preserve existing fallback behavior around the cached calls. Keep React `cache()` only where it provides request-level deduplication without hiding the persistent cache.

- [ ] **Step 5: Run focused tests**

Run: `bun vitest run tests/unit/lib/notion-cache.test.ts tests/unit/helpers/post-query.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add lib/notion-cache.ts app/posts/actions/posts.ts tests/unit/lib/notion-cache.test.ts
git commit -m "perf(cms): cache Notion reads across requests"
```

### Task 3: Replace full-list article hydration with bounded related posts

**Files:**
- Create: `app/posts/helpers/related-posts.ts`
- Create: `app/posts/components/RelatedPostsServer.tsx`
- Modify: `app/posts/[slug]/layout.tsx`
- Modify: `app/posts/components/ContentBody.tsx`
- Remove or modify: `app/posts/components/RelatedPostsWrapper.tsx`
- Test: `tests/unit/helpers/related-posts.test.ts`

**Interfaces:**
- `selectRelatedPosts(posts, currentPost, limit)` returns at most `limit` posts, excludes the current post, and prioritizes shared tags before category-only matches.
- `RelatedPostsServer` receives `postData` and renders only bounded summaries.

- [ ] **Step 1: Write failing tests for exclusion, limit, and tag precedence**

```ts
it("excludes the current post and limits related results", () => {
  const result = selectRelatedPosts(posts, posts[0], 3);
  expect(result).toHaveLength(3);
  expect(result.some((post) => post.id === posts[0].id)).toBe(false);
});

it("prioritizes posts sharing a tag", () => {
  const [first] = selectRelatedPosts(posts, currentPost, 1);
  expect(first.tags.some((tag) => currentPost.tags.some((current) => current.id === tag.id))).toBe(true);
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `bun vitest run tests/unit/helpers/related-posts.test.ts`
Expected: FAIL because the selector does not exist.

- [ ] **Step 3: Implement the selector and bounded server component**

Use existing `RelatedPosts` presentation. The server component should fetch only enough post summaries to select four related posts, or use a cached bounded list when the Notion API cannot express the exact tag query. It must not create a client query or `HydrationBoundary` for `allPosts`.

- [ ] **Step 4: Remove full-list prefetch from the article layout**

Delete `fetchAllPosts`, `QueryClient`, `HydrationBoundary`, and `useFetchAllPosts` imports from `app/posts/[slug]/layout.tsx`. Pass the current post into `ContentBody`, which renders the server-side related component.

- [ ] **Step 5: Run focused tests and the article component test set**

Run: `bun vitest run tests/unit/helpers/related-posts.test.ts tests/integration/components/PostCard.test.tsx`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/posts/helpers/related-posts.ts app/posts/components/RelatedPostsServer.tsx app/posts/[slug]/layout.tsx app/posts/components/ContentBody.tsx app/posts/components/RelatedPostsWrapper.tsx tests/unit/helpers/related-posts.test.ts
git commit -m "perf(posts): stop hydrating full list on article pages"
```

### Task 4: Connect cursor pagination to the infinite query

**Files:**
- Modify: `app/posts/hooks/use-fetch-posts.ts`
- Modify: `app/posts/hooks/use-fetch-all-posts.ts` only if its return type needs the new page shape
- Test: `tests/unit/hooks/use-fetch-posts.test.ts`

**Interfaces:**
- The infinite query passes `pageParam: string | null` to `fetchPosts({ category, cursor: pageParam, pageSize })`.
- `getNextPageParam` returns `lastPage.nextCursor` only when `lastPage.hasMore` is true.

- [ ] **Step 1: Add a focused test for cursor progression**

Assert that a page with `nextCursor: "next"` produces `"next"`, while a page with `hasMore: false` produces `undefined`.

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `bun vitest run tests/unit/hooks/use-fetch-posts.test.ts`
Expected: FAIL because the current hook uses numeric page parameters.

- [ ] **Step 3: Update the hook to use cursor page parameters**

Set `initialPageParam: null`, pass the cursor to `fetchPosts`, and remove numeric page calculations. Keep `staleTime`, `maxPages`, and placeholder behavior unless the tests demonstrate a regression.

- [ ] **Step 4: Run focused tests**

Run: `bun vitest run tests/unit/hooks/use-fetch-posts.test.ts tests/unit/helpers/post-query.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/posts/hooks/use-fetch-posts.ts tests/unit/hooks/use-fetch-posts.test.ts
git commit -m "perf(posts): paginate category queries by cursor"
```

### Task 5: Add ISR and authenticated cache invalidation

**Files:**
- Modify: `app/posts/[slug]/page.tsx`
- Modify: `app/tags/[slug]/page.tsx`
- Modify: `app/api/revalidate/route.ts`
- Modify: `lib/notion-cache.ts`
- Test: `tests/unit/lib/revalidation.test.ts`

**Interfaces:**
- `POST /api/revalidate` accepts `Authorization: Bearer <REVALIDATION_SECRET>` and JSON `{ paths?: string[], tags?: string[] }`.
- Invalid requests return `401` or `400`; valid requests return `{ revalidated: true }`.

- [ ] **Step 1: Write failing tests for authentication and payload validation**

Cover missing authorization, wrong authorization, malformed JSON, and valid paths/tags. Tests must mock `revalidatePath` and `revalidateTag` and assert the requested entries are invalidated.

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `bun vitest run tests/unit/lib/revalidation.test.ts`
Expected: FAIL because the endpoint currently only supports GET query parameters.

- [ ] **Step 3: Implement POST invalidation**

Read the bearer token from the authorization header. Validate arrays and path/tag strings before invalidating. Keep a minimal GET response that returns `405` rather than accepting query-string secrets.

- [ ] **Step 4: Add five-minute ISR to detail and tag routes**

Export `revalidate = 300` from both route modules. Do not rely on this alone; the cached Notion functions remain the source of cross-request data reuse.

- [ ] **Step 5: Run focused tests**

Run: `bun vitest run tests/unit/lib/revalidation.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add app/posts/[slug]/page.tsx app/tags/[slug]/page.tsx app/api/revalidate/route.ts lib/notion-cache.ts tests/unit/lib/revalidation.test.ts
git commit -m "perf(cms): add ISR and tagged content invalidation"
```

### Task 6: Split article rendering from AI summary client state

**Files:**
- Create: `app/posts/[slug]/components/PostSummaryClient.tsx`
- Modify: `app/posts/[slug]/components/PostPageClient.tsx`
- Modify: `app/posts/components/Content.tsx` only if the split requires a prop boundary
- Test: `tests/integration/components/PostPageClient.test.tsx`

**Interfaces:**
- Article content continues to receive `ExtendedRecordMap` and render identically.
- AI summary remains lazy and only runs after user interaction.

- [ ] **Step 1: Add a regression test that article content renders without opening summary**

Assert the renderer is present and `/api/ai-summary` is not called on initial render.

- [ ] **Step 2: Run the focused test and verify it fails or records the current coupling**

Run: `bun vitest run tests/integration/components/PostPageClient.test.tsx`
Expected: The test either fails due to the missing test boundary or documents the current combined component behavior.

- [ ] **Step 3: Move summary state and handlers into `PostSummaryClient`**

Keep `Content` rendering independent from summary state. Preserve local-storage TTL behavior, abort handling, streaming parsing, retry, and error messages. Do not preload or request AI content.

- [ ] **Step 4: Run the focused integration test**

Run: `bun vitest run tests/integration/components/PostPageClient.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/posts/[slug]/components/PostSummaryClient.tsx app/posts/[slug]/components/PostPageClient.tsx app/posts/components/Content.tsx tests/integration/components/PostPageClient.test.tsx
git commit -m "perf(posts): isolate lazy summary client state"
```

### Task 7: Validate runtime behavior and clean up

**Files:**
- Modify: `app/posts/actions/posts.ts` only for verified cleanup
- Modify: `app/posts/components/RelatedPostsWrapper.tsx` only if Task 3 leaves dead code
- Modify: `docs/superpowers/specs/2026-08-28-cms-content-performance-design.md` only if the final contract differs

- [ ] **Step 1: Run the full unit suite once**

Run: `bun test:run`
Expected: PASS.

- [ ] **Step 2: Run lint**

Run: `bun run lint`
Expected: PASS with no new warnings or errors.

- [ ] **Step 3: Run the production build**

Run: `bun run build`
Expected: Successful Next.js production build with detail and tag routes showing the intended five-minute revalidation policy.

- [ ] **Step 4: Run the application and smoke-test navigation**

Run: `bun run dev`.
Exercise `/posts`, one article, another article, and a tag page. Verify in the browser network panel that article navigation does not transfer or refetch the complete `allPosts` query, and that AI summary is requested only after interaction.

- [ ] **Step 5: Measure before/after server and network behavior**

Record article TTFB, Notion request count, RSC/document payload size, and duplicate requests on reload/navigation. Confirm cached reloads issue no Notion request in the application logs.

- [ ] **Step 6: Remove dead code and commit final cleanup**

```bash
git add app lib tests docs/superpowers/specs/2026-08-28-cms-content-performance-design.md
git commit -m "chore(cms): finalize content workflow optimization"
```
