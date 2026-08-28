import { describe, expect, it } from "vitest";
import type { PageDataSchemaType } from "@/types";
import { selectRelatedPosts } from "@/app/posts/helpers/related-posts";

const post = (
  id: string,
  options: { tags?: string[]; category?: string } = {},
): PageDataSchemaType => ({
  id,
  title: id,
  description: "",
  createdTime: "2026-01-01",
  lastUpdated: "2026-01-01",
  authorId: "author",
  lastEditedBy: "author",
  tags: (options.tags ?? []).map((name) => ({ id: name, name })),
  icon: "",
  category: options.category ?? "engineering",
});

describe("selectRelatedPosts", () => {
  it("excludes the current post and prioritizes shared tags over category-only matches", () => {
    const currentPost = post("current", {
      tags: ["react"],
      category: "engineering",
    });

    const posts = [
      post("category-only", { category: "engineering" }),
      post("shared-other-category", { tags: ["react"], category: "design" }),
      currentPost,
      post("shared-same-category", {
        tags: ["react"],
        category: "engineering",
      }),
      post("unrelated", { category: "design" }),
    ];

    expect(selectRelatedPosts(posts, currentPost, 3).map(({ id }) => id)).toEqual([
      "shared-other-category",
      "shared-same-category",
      "category-only",
    ]);
  });

  it("returns no more than the requested limit and handles an empty limit", () => {
    const currentPost = post("current");
    const posts = [post("one"), post("two")];

    expect(selectRelatedPosts(posts, currentPost, 1).map(({ id }) => id)).toEqual([
      "one",
    ]);
    expect(selectRelatedPosts(posts, currentPost, 0)).toEqual([]);
  });

  it("returns an empty list when there are no matching posts", () => {
    const currentPost = post("current", {
      tags: ["react"],
      category: "engineering",
    });

    expect(
      selectRelatedPosts(
        [post("unrelated", { tags: ["vue"], category: "design" })],
        currentPost,
        3,
      ),
    ).toEqual([]);
  });
});
