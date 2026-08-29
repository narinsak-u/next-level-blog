# Published Notion Domain Content Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make production Notion article and static-page bodies render by routing `notion-client` through the published Notion workspace domain.

**Architecture:** Keep `notion-client.getPage()` and `react-notion-x` unchanged at the renderer boundary. Centralize published-domain URL normalization in `lib/notion-api.ts`; content cache wrappers continue calling the shared client. Content failures remain isolated from metadata and render a visible, non-sensitive fallback.

**Tech Stack:** Next.js App Router, TypeScript strict mode, `notion-client`, `react-notion-x`, `unstable_cache`, Vitest, Bun.

## Global Constraints

- Use TypeScript; no `any`, `@ts-ignore`, or `@ts-expect-error`.
- Preserve the existing `ExtendedRecordMap` content contract.
- Never log tokens or full Notion responses.
- Do not fall back to `https://www.notion.so/api/v3` in production.
- Use the existing five-minute Notion cache and cache tags.
- Follow existing named-export and `@/` import conventions.

---

### Task 1: Configure the published Notion API base URL

**Files:**
- Modify: `lib/notion-api.ts`
- Modify: `lib/notion-cache.ts` only if its inferred client type requires an explicit import change
- Test: `tests/unit/lib/notion-api.test.ts`
- Modify: `.env.example` if present; otherwise document the variable in `docs/WORKFLOW.md`

**Interfaces:**
- Produces a shared default `NotionAPI` configured with `apiBaseUrl` equal to `${NOTION_PUBLIC_SITE_URL}/api/v3`.
- Consumes `process.env.NOTION_PUBLIC_SITE_URL`.

- [ ] **Step 1: Write failing URL-normalization tests**

Test that `https://future-shawl-a38.notion.site/` becomes `https://future-shawl-a38.notion.site/api/v3` and that a missing production value throws an actionable configuration error.

- [ ] **Step 2: Run the focused test**

Run: `bun vitest run tests/unit/lib/notion-api.test.ts`

Expected: FAIL because the URL helper and configured client are not implemented.

- [ ] **Step 3: Implement configuration**

Add a small pure helper for URL construction and instantiate `NotionAPI` with:

```ts
new NotionAPI({ apiBaseUrl: buildNotionApiBaseUrl(process.env.NOTION_PUBLIC_SITE_URL) })
```

Strip trailing slashes before appending `/api/v3`. In production, throw when the variable is missing. Do not silently use `www.notion.so`.

- [ ] **Step 4: Run focused tests and typecheck through the relevant test path**

Run: `bun vitest run tests/unit/lib/notion-api.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/notion-api.ts tests/unit/lib/notion-api.test.ts .env.example docs/WORKFLOW.md
git commit -m "fix(cms): use published Notion API domain"
```

### Task 2: Add an explicit content failure state

**Files:**
- Modify: `app/posts/[slug]/page.tsx`
- Modify: `app/posts/[slug]/components/PostPageClient.tsx` or the existing content boundary component
- Test: `tests/integration/components/PostPageClient.test.tsx`

**Interfaces:**
- Content success continues receiving the existing `ExtendedRecordMap`.
- Content failure receives an explicit boolean or `null` state and renders a stable user-facing message without raw errors.

- [ ] **Step 1: Write the failing rendering test**

Render the article with a missing record map and assert that a content-unavailable message is present while the article shell remains mounted.

- [ ] **Step 2: Run the focused test**

Run: `bun vitest run tests/integration/components/PostPageClient.test.tsx`

Expected: FAIL because the current missing-content path renders no explicit state.

- [ ] **Step 3: Implement the fallback**

Keep logging server-side with page ID and hostname only. Pass the failure state to the client boundary and render a concise fallback such as `Article content is temporarily unavailable.` Do not show the Notion URL, stack trace, token, or request payload.

- [ ] **Step 4: Run the focused test**

Run: `bun vitest run tests/integration/components/PostPageClient.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/posts/[slug]/page.tsx app/posts/[slug]/components/PostPageClient.tsx tests/integration/components/PostPageClient.test.tsx
git commit -m "fix(posts): show content fetch failure state"
```

### Task 3: Document deployment configuration

**Files:**
- Modify: `docs/WORKFLOW.md`
- Modify: `.env.example` if the repository contains one

**Interfaces:**
- Documents `NOTION_PUBLIC_SITE_URL=https://future-shawl-a38.notion.site` as required for deployed content fetching.

- [ ] **Step 1: Add the environment-variable and publication requirements**

Document that every page rendered through `notion-client` must be published under the configured workspace domain and that the variable must be set in Vercel Production and Preview environments as needed.

- [ ] **Step 2: Check documentation consistency**

Run: `bun vitest run tests/unit/lib/notion-api.test.ts`

Expected: PASS; documentation changes do not alter runtime behavior.

- [ ] **Step 3: Commit**

```bash
git add docs/WORKFLOW.md .env.example
git commit -m "docs(cms): document published Notion domain"
```

### Task 4: Verify locally and in production

**Files:**
- No source changes unless verification exposes a defect.

- [ ] **Step 1: Set the local published-domain variable without committing secrets**

Use the existing published URL in local environment configuration:

```env
NOTION_PUBLIC_SITE_URL=https://future-shawl-a38.notion.site
```

- [ ] **Step 2: Run changed-contract tests**

Run: `bun test:run`

Expected: all tests pass.

- [ ] **Step 3: Run changed-file lint**

Run ESLint against the changed TypeScript files. Expected: no lint errors. Do not rely on the repository's invalid `next lint` script.

- [ ] **Step 4: Build the application**

Run: `bun run build`

Expected: production build succeeds with TypeScript compilation.

- [ ] **Step 5: Deploy with Vercel environment configuration**

Set `NOTION_PUBLIC_SITE_URL` in the target Vercel environment and redeploy. Cache invalidation without redeployment is insufficient because the client configuration is evaluated by the server bundle.

- [ ] **Step 6: Exercise production article rendering**

Open `/posts/28c06e04-986c-807f-ad37-cef1ab36033a` and verify article body text, headings, related posts, and AI summary behavior. Check Vercel logs for the published-domain endpoint and absence of the previous `www.notion.so/api/v3/loadPageChunk` 403.

- [ ] **Step 7: Exercise one static page and one additional article**

Confirm the shared client configuration works for every `getPage()` consumer, not only the reported article.
