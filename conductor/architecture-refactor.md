# Deepen Architecture: Unified Posts Module

## Objective
Consolidate the fragmented CMS access layer, eliminate redundant server action wrappers, and extract pure domain logic from React hooks. This refactoring will create a "deep module" for handling posts, making the codebase more testable, easier to navigate, and decoupled from Notion-specific data structures.

## Scope & Impact
- **Data Access:** Consolidate `actions/notion.ts`, `actions/notion-x.ts`, `actions/get-post-by-id.ts`, and `actions/get-post-by-cat.ts` into a single, cohesive module (`actions/posts.ts`).
- **Domain Logic:** Extract the filtering and relation logic currently locked inside React hooks (`use-get-posts-by-tag.ts`, `use-get-related-posts.ts`) into pure functions (`lib/post-logic.ts`).
- **Dependencies:** The rest of the application will depend on the clean interfaces provided by `actions/posts.ts` and `lib/post-logic.ts`, hiding the underlying Notion SDKs and mapping complexities.

## Proposed Solution (Functional Design)

We will adopt a functional approach tailored for Next.js App Router, heavily utilizing `React.cache()` for deduplication and separating data fetching from business logic.

### 1. The Deepened `actions/posts.ts` Module
This module will be the single entry point for fetching post data. It hides both the official and unofficial Notion SDKs and the mapping logic.

**Interface:**
```typescript
import { cache } from 'react';
import type { PageDataSchemaType } from '@/types'; // Clean application type
import type { ExtendedRecordMap } from 'notion-types';

export const fetchPosts = cache(async (options?: { category?: string; status?: string; limit?: number; page?: number }): Promise<PageDataSchemaType[]>);
export const fetchPostById = cache(async (id: string): Promise<PageDataSchemaType | null>);
export const fetchPostContent = cache(async (id: string): Promise<ExtendedRecordMap | null>);
```

### 2. Pure Domain Logic: `lib/post-logic.ts`
We will extract the logic from the custom hooks into pure functions. This allows the logic to be tested independently and used on both the server and the client.

**Interface:**
```typescript
import type { PageDataSchemaType, PostTagSchemaType } from '@/types';

export const filterPostsByTag = (posts: PageDataSchemaType[], tagName: string): PageDataSchemaType[] => { ... };
export const getRelatedPosts = (posts: PageDataSchemaType[], targetPostId: string, targetTags: PostTagSchemaType[], limit = 3): PageDataSchemaType[] => { ... };
```

### 3. Simplify Hooks
The existing hooks will be simplified to just wrap these pure functions, or removed entirely if the logic can be run directly in Server Components.

## Implementation Steps

1.  **Create `lib/post-logic.ts`:**
    *   Move the logic from `use-get-posts-by-tag.ts` into `filterPostsByTag`.
    *   Move the logic from `use-get-related-posts.ts` into `getRelatedPosts`.
    *   Update the original hooks to use these new pure functions.
2.  **Create the Deep Module (`actions/posts.ts`):**
    *   Consolidate `getAllPosts`, `getPostsByCategory`, and `getPostById` from `actions/notion.ts` into a flexible `fetchPosts` function (and `fetchPostById` convenience wrapper).
    *   Move `getPageContent` logic from `actions/notion-x.ts` into `fetchPostContent` within `actions/posts.ts`.
    *   Move the mapping logic from `helpers/post-mapping.ts` to be a private, internal function within `actions/posts.ts` (or keep it in a nearby private file, but ensure it's not part of the public API boundary).
    *   Wrap exported functions in `React.cache()`.
3.  **Refactor Consumers:**
    *   Update all page and layout components (e.g., `app/posts/[slug]/page.tsx`, `app/posts/[slug]/layout.tsx`) to import from `actions/posts.ts`.
    *   Update the client-side data fetching hooks (e.g., `use-fetch-posts.ts`) to use the new `fetchPosts` action.
4.  **Clean Up:**
    *   Delete `actions/get-post-by-id.ts`.
    *   Delete `actions/get-post-by-cat.ts`.
    *   Delete `actions/notion.ts` and `actions/notion-x.ts` (or strictly mark them as internal implementations if kept separate for file size reasons, but the public API must be `actions/posts.ts`).

## Verification & Testing

- **New Boundary Tests (`tests/unit/post-logic.test.ts`):** Add unit tests for `filterPostsByTag` and `getRelatedPosts` using mock `PageDataSchemaType` objects. These tests should be fast and not require React or Notion.
- **Integration Tests:** Ensure that existing tests (if any) that relied on the old shallow actions are updated to point to `actions/posts.ts`.
- **Manual Verification:** Verify that the blog still builds and renders correctly. Ensure pagination, category filtering, and related posts still function exactly as before.

## Migration & Rollback
Since this is an internal architectural refactoring, the external behavior of the site should not change. If issues arise during the deployment of these changes, we can easily revert the PR, as it does not involve schema changes in Notion.
