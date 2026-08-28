# CMS Content Workflow Performance Design

## Goal

Serve Notion-backed content faster while avoiding unnecessary re-downloads during initial loads and client navigation.

## Scope

This change keeps `react-notion-x` as the article renderer. It optimizes the data layer, related-post loading, route caching, revalidation, and Notion pagination.

## Architecture

### Cached Notion data

Use Next.js persistent server caching for Notion reads with explicit cache keys and a five-minute default revalidation period:

- `notion:posts:all`
- `notion:posts:category:{category}`
- `notion:post:{id}:metadata`
- `notion:post:{id}:content`
- `notion:page:{type}`
- `notion:post-dates`

React `cache()` may remain for request-level deduplication, but it is not treated as the cross-request cache.

Record maps contain signed Notion asset URLs. Content cache lifetime must remain within the supported signed-URL lifetime. The implementation will not introduce indefinite caching of signed URLs.

### Article request

An article page will fetch:

1. Current post metadata.
2. Current post record map.
3. A bounded set of related post summaries.

It will not prefetch and dehydrate the complete post list. Related posts will be loaded server-side or through a bounded server query, not through a client query that downloads every post.

### List pagination

Notion data-source queries will use cursor pagination. The server response will expose items plus `nextCursor`/`hasMore`; the client infinite query will use the cursor as `pageParam`.

### Route freshness

Post detail and tag routes will receive a five-minute ISR policy. Existing static pages retain five-minute revalidation. Explicit revalidation will invalidate both route output and matching content cache entries.

### Revalidation API

The endpoint will accept authenticated POST requests with the secret in an authorization header and paths/tags in the request body. Existing path invalidation behavior will remain available. GET query-string secrets will not be used for the new contract.

## Error handling

- Notion failures preserve existing safe fallbacks (`[]` or `null`) and logging behavior.
- Cache failures must not prevent a direct Notion fetch if the cache wrapper permits fallback.
- Cursor pagination must stop when `has_more` is false or `next_cursor` is absent.
- Related-post failures must not prevent the article body from rendering.
- Revalidation rejects invalid authentication and malformed payloads with explicit 4xx responses.

## Verification

- Unit tests cover cursor conversion, related-post exclusion/limit behavior, and cache key construction where those are new pure contracts.
- Production build must pass.
- Runtime smoke verification checks article reloads and navigation for duplicate full-list requests.
- Network/server measurements compare article TTFB, Notion request count, RSC payload size, and duplicate requests before and after implementation.

## Non-goals

- Replacing `react-notion-x`.
- Rebuilding Notion content into a separate database.
- Adding a service worker.
- Reworking unrelated UI or media delivery.
