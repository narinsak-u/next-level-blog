import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, type PropsWithChildren } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PageDataSchemaType } from "@/types";
import { fetchPosts } from "@/app/posts/actions/posts";
import useFetchPosts from "@/app/posts/hooks/use-fetch-posts";

vi.mock("@/app/posts/actions/posts", () => ({
  fetchPosts: vi.fn(),
}));

const mockedFetchPosts = vi.mocked(fetchPosts);

const createPost = (id: string) => ({ id }) as unknown as PageDataSchemaType;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: PropsWithChildren) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("useFetchPosts", () => {
  beforeEach(() => {
    mockedFetchPosts.mockReset();
  });

  it("progresses through cursor pages and flattens their items", async () => {
    const firstPost = createPost("post-1");
    const secondPost = createPost("post-2");
    mockedFetchPosts
      .mockResolvedValueOnce({
        items: [firstPost],
        nextCursor: "cursor-2",
        hasMore: true,
      })
      .mockResolvedValueOnce({
        items: [secondPost],
        nextCursor: null,
        hasMore: false,
      });

    const { result } = renderHook(
      () => useFetchPosts({ categoryName: "Engineering" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.posts).toEqual([firstPost]));
    expect(mockedFetchPosts).toHaveBeenLastCalledWith({
      category: "Engineering",
      cursor: null,
      pageSize: 6,
    });
    expect(result.current.hasNextPage).toBe(true);

    await result.current.loadNextPost();

    await waitFor(() => expect(result.current.posts).toEqual([firstPost, secondPost]));
    expect(mockedFetchPosts).toHaveBeenLastCalledWith({
      category: "Engineering",
      cursor: "cursor-2",
      pageSize: 6,
    });
    expect(result.current.hasNextPage).toBe(false);
  });

  it("does not expose a next page when the response has no more pages", async () => {
    mockedFetchPosts.mockResolvedValueOnce({
      items: [createPost("post-1")],
      nextCursor: "ignored-cursor",
      hasMore: false,
    });

    const { result } = renderHook(
      () => useFetchPosts({ categoryName: "Engineering" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasNextPage).toBe(false);
    await result.current.loadNextPost();
    expect(mockedFetchPosts).toHaveBeenCalledTimes(1);
  });
});
