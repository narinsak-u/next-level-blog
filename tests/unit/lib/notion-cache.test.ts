import { beforeEach, describe, expect, it, vi } from "vitest";

const { unstableCacheMock, queryMock, retrieveMock, getPageMock } = vi.hoisted(
  () => ({
    unstableCacheMock: vi.fn(
      (fn: (...args: never[]) => unknown) =>
        (...args: never[]) => fn(...args),
    ),
    queryMock: vi.fn(),
    retrieveMock: vi.fn(),
    getPageMock: vi.fn(),
  }),
);
vi.mock("next/cache", () => ({
  unstable_cache: unstableCacheMock,
}));

vi.mock("@/lib/notion-client", () => ({
  notion: {
    dataSources: { query: queryMock },
    pages: { retrieve: retrieveMock },
  },
}));

vi.mock("@/lib/notion-api", () => ({
  default: { getPage: getPageMock },
}));

import {
  buildPostContentCacheKey,
  buildPostListCacheKey,
  buildPostMetadataCacheKey,
  buildPostDatesCacheKey,
  buildStaticPageCacheKey,
  getCachedPostContent,
  getCachedPostDates,
  getCachedPostList,
  getCachedPostMetadata,
  getCachedStaticPageContent,
} from "@/lib/notion-cache";

const REVALIDATE_SECONDS = 300;

describe("Notion cache keys", () => {
  it("keeps metadata and content keys distinct per post", () => {
    expect(buildPostMetadataCacheKey("post-1")).toBe(
      "notion:post:post-1:metadata",
    );
    expect(buildPostContentCacheKey("post-1")).toBe(
      "notion:post:post-1:content",
    );
  });

  it("includes static page identity in the page key", () => {
    expect(buildStaticPageCacheKey("about", "page-about")).toBe(
      "notion:page:about:page-about",
    );
  });

  it("includes every list query input in a stable key", () => {
    expect(
      buildPostListCacheKey("data-source", {
        status: "Done",
        category: "Engineering",
        cursor: "cursor-2",
        pageSize: 6,
      }),
    ).toBe(
      "notion:posts:category:Engineering:data-source:data-source:status:Done:page-size:6:cursor:cursor-2",
    );
    expect(buildPostDatesCacheKey("data-source")).toBe(
      "notion:post-dates:data-source:data-source",
    );
  });
});

describe("Notion cache wrappers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryMock.mockResolvedValue({ results: [], next_cursor: null, has_more: false });
    retrieveMock.mockResolvedValue({ id: "post-1" });
    getPageMock.mockResolvedValue({ block: {} });
  });

  it("caches metadata with a post tag and five-minute revalidation", async () => {
    await getCachedPostMetadata("post-1");

    expect(unstableCacheMock).toHaveBeenCalledWith(
      expect.any(Function),
      ["notion:post:post-1:metadata"],
      { revalidate: REVALIDATE_SECONDS, tags: ["notion:post:post-1"] },
    );
    expect(retrieveMock).toHaveBeenCalledWith({ page_id: "post-1" });
  });

  it("uses bounded revalidation for signed content URLs", async () => {
    await getCachedPostContent("post-1");
    await getCachedStaticPageContent("about", "page-about");

    expect(unstableCacheMock).toHaveBeenCalledWith(
      expect.any(Function),
      ["notion:post:post-1:content"],
      { revalidate: REVALIDATE_SECONDS, tags: ["notion:post:post-1"] },
    );
    expect(unstableCacheMock).toHaveBeenCalledWith(
      expect.any(Function),
      ["notion:page:about:page-about"],
      { revalidate: REVALIDATE_SECONDS, tags: ["notion:page:about"] },
    );
    expect(getPageMock).toHaveBeenNthCalledWith(1, "post-1");
    expect(getPageMock).toHaveBeenNthCalledWith(2, "page-about");
  });

  it("includes list and date inputs in cache configuration", async () => {
    await getCachedPostList("data-source", {
      status: "Done",
      category: "Engineering",
      cursor: "cursor-2",
      pageSize: 6,
    });
    await getCachedPostDates("data-source");

    expect(unstableCacheMock).toHaveBeenCalledWith(
      expect.any(Function),
      [
        "notion:posts:category:Engineering:data-source:data-source:status:Done:page-size:6:cursor:cursor-2",
      ],
      { revalidate: REVALIDATE_SECONDS, tags: ["notion:posts"] },
    );
    expect(unstableCacheMock).toHaveBeenCalledWith(
      expect.any(Function),
      ["notion:post-dates:data-source:data-source"],
      { revalidate: REVALIDATE_SECONDS, tags: ["notion:post-dates"] },
    );
  });
});
