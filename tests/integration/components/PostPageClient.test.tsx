import { cleanup, render, screen } from "@testing-library/react";
import type { ExtendedRecordMap } from "notion-types";
import { afterEach, describe, expect, it, vi } from "vitest";
import PostPageClient from "@/app/posts/[slug]/components/PostPageClient";

vi.mock("@/app/posts/components/Content", () => ({
  default: () => <article data-testid="article-content">Article content</article>,
}));

vi.mock("@/app/posts/components/AISummaryPopup", () => ({
  AISummaryPopup: () => (
    <div data-testid="ai-summary-popup-marker">AI summary popup</div>
  ),
}));

vi.mock("@/components/common/ScrollToTop", () => ({
  default: () => null,
}));

describe("PostPageClient", () => {

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
    expect(screen.getByTestId("ai-summary-popup-marker")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
