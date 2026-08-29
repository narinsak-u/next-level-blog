# Published Notion Domain Content Fetch Design

## Problem

Production article bodies fail to render because `notion-client` posts to Notion's default internal endpoint, `https://www.notion.so/api/v3/loadPageChunk`, and Vercel receives `403 Forbidden`. The same published page accepts the request through the workspace's published domain.

## Decision

Keep the existing `notion-client` and `react-notion-x` record-map rendering pipeline, but configure `NotionAPI` with the published workspace domain from `NOTION_PUBLIC_SITE_URL`.

The client will derive `${NOTION_PUBLIC_SITE_URL}/api/v3`, normalize trailing slashes, and reject missing production configuration rather than silently falling back to `www.notion.so`.

## Scope

- Configure post and static-page content fetching through the published Notion domain.
- Preserve existing cache keys, five-minute cache lifetime, record-map shape, and renderer.
- Make content-fetch failure visible instead of rendering an indistinguishable empty article.
- Add unit/integration coverage for URL construction, client configuration, and the failure state.
- Document the required Vercel environment variable.

## Non-goals

- Do not migrate to the official block API in this fix.
- Do not build an official-block-to-`ExtendedRecordMap` adapter.
- Do not add retries for deterministic `403` responses.
- Do not expose Notion credentials or internal error details to visitors.

## Error behavior

Metadata and related-post behavior remain independent from content rendering. If content fetching fails, the article renders its existing shell and a clear content-unavailable state. The server logs the page ID and endpoint host for diagnosis.

## Validation

The affected production URL must render article body text after deployment. Logs must show requests using the published-domain API base and no `www.notion.so/api/v3/loadPageChunk` 403 for published pages.
