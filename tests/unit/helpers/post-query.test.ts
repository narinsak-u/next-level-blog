import { describe, expect, it } from "vitest";
import { buildPostFilter, mapPostQueryPage } from "@/app/posts/helpers/post-query";

describe("post query primitives", () => {
  it("combines status and category filters", () => {
    expect(buildPostFilter("Done", "Engineering")).toEqual({
      and: [
        { property: "Status", status: { equals: "Done" } },
        { property: "Category", select: { equals: "Engineering" } },
      ],
    });
  });

  it("maps a Notion response to a cursor page", () => {
    expect(
      mapPostQueryPage({
        results: [],
        has_more: true,
        next_cursor: "cursor-2",
      }),
    ).toEqual({
      items: [],
      nextCursor: "cursor-2",
      hasMore: true,
    });
  });
});
