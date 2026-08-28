import { unstable_cache } from "next/cache";
import { buildPostFilter, PostQueryOptions } from "@/app/posts/helpers/post-query";
import { notion as officialClient } from "@/lib/notion-client";
import unofficialClient from "@/lib/notion-api";

export const NOTION_CACHE_REVALIDATE_SECONDS = 300;
export const DEFAULT_CACHED_POST_PAGE_SIZE = 6;

type CacheablePostQueryOptions = Pick<
  PostQueryOptions,
  "category" | "cursor" | "pageSize" | "status"
>;

export type NotionQueryResponse = {
  results: unknown[];
  next_cursor: string | null;
  has_more: boolean;
};

const cacheOptions = (tag: string) => ({
  revalidate: NOTION_CACHE_REVALIDATE_SECONDS,
  tags: [tag],
});

const valueForKey = (value: string | number | null | undefined): string =>
  value === null || value === undefined ? "none" : String(value);

export const buildPostMetadataCacheKey = (postId: string): string =>
  `notion:post:${postId}:metadata`;

export const buildPostContentCacheKey = (postId: string): string =>
  `notion:post:${postId}:content`;

export const buildStaticPageCacheKey = (
  type: "about" | "note" | "project",
  pageId: string,
): string => `notion:page:${type}:${pageId}`;

export const buildPostDatesCacheKey = (dataSourceId: string): string =>
  `notion:post-dates:data-source:${dataSourceId}`;

export const buildPostListCacheKey = (
  dataSourceId: string,
  options: CacheablePostQueryOptions = {},
): string => {
  const status = options.status ?? "Done";
  const pageSize = options.pageSize ?? DEFAULT_CACHED_POST_PAGE_SIZE;
  const categoryPart = options.category
    ? `category:${options.category}`
    : "all";

  return [
    `notion:posts:${categoryPart}`,
    `data-source:${dataSourceId}`,
    `status:${status}`,
    `page-size:${pageSize}`,
    `cursor:${valueForKey(options.cursor)}`,
  ].join(":");
};

export async function getCachedPostMetadata(postId: string) {
  const cached = unstable_cache(
    () =>
      officialClient.pages.retrieve({
        page_id: postId,
      }),
    [buildPostMetadataCacheKey(postId)],
    cacheOptions(`notion:post:${postId}`),
  );

  return cached();
}

export async function getCachedPostContent(pageId: string) {
  const cached = unstable_cache(
    () => unofficialClient.getPage(pageId),
    [buildPostContentCacheKey(pageId)],
    cacheOptions(`notion:post:${pageId}`),
  );

  return cached();
}

export async function getCachedStaticPageContent(
  type: "about" | "note" | "project",
  pageId: string,
) {
  const cached = unstable_cache(
    () => unofficialClient.getPage(pageId),
    [buildStaticPageCacheKey(type, pageId)],
    cacheOptions(`notion:page:${type}`),
  );

  return cached();
}

export async function getCachedPostDates(
  dataSourceId: string,
): Promise<NotionQueryResponse> {
  const cached = unstable_cache(
    async () => {
      const response = await officialClient.dataSources.query({
        data_source_id: dataSourceId,
        filter: {
          property: "Status",
          status: { equals: "Done" },
        },
        sorts: [{ timestamp: "created_time", direction: "ascending" }],
      });

      return response as unknown as NotionQueryResponse;
    },
    [buildPostDatesCacheKey(dataSourceId)],
    cacheOptions("notion:post-dates"),
  );

  return cached();
}

export async function getCachedPostList(
  dataSourceId: string,
  options: CacheablePostQueryOptions = {},
): Promise<NotionQueryResponse> {
  const status = options.status ?? "Done";
  const pageSize = options.pageSize ?? DEFAULT_CACHED_POST_PAGE_SIZE;
  const filter = buildPostFilter(status, options.category);

  const cached = unstable_cache(
    async () => {
      const response = await officialClient.dataSources.query({
        data_source_id: dataSourceId,
        filter,
        page_size: pageSize,
        ...(options.cursor ? { start_cursor: options.cursor } : {}),
        sorts: [{ timestamp: "created_time", direction: "descending" }],
      });

      return response as unknown as NotionQueryResponse;
    },
    [buildPostListCacheKey(dataSourceId, options)],
    cacheOptions("notion:posts"),
  );

  return cached();
}
