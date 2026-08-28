import { cleanup, render, screen } from "@testing-library/react";
import type { ExtendedRecordMap } from "notion-types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PostPageClient from "@/app/posts/[slug]/components/PostPageClient";

const { summaryClientSpy } = vi.hoisted(() => ({
  summaryClientSpy: vi.fn(),
}));

vi.mock("@/app/posts/components/Content", () => ({
  default: () => <article data-testid="article-content">Article content</article>,
}));

vi.mock("@/app/posts/[slug]/components/PostSummaryClient", () => ({
  default: (props: unknown) => {
    summaryClientSpy(props);
    return <div data-testid="summary-client" />;
  },
}));

vi.mock("@/components/common/ScrollToTop", () => ({
  default: () => null,
}));

describe("PostPageClient", () => {
  beforeEach(() => {
    summaryClientSpy.mockClear();
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("PP-001: renders article content without requesting AI summary before interaction", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    render(
      <PostPageClient
        recordMap={{} as ExtendedRecordMap}
        slug="test-slug"
      />,
    );

    expect(screen.getByTestId("article-content")).toHaveTextContent(
      "Article content",
    );
    expect(summaryClientSpy).toHaveBeenCalledTimes(1);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
