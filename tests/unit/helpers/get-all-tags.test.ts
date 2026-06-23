import { describe, it, expect } from "vitest";
import { getTags } from "@/app/posts/helpers/get-all-tags";
import type { PageDataSchemaType } from "@/types";

function makePost(id: string, tags: { id: string; name: string; color: string }[]): PageDataSchemaType {
  return {
    id,
    title: `Post ${id}`,
    createdTime: "2023-01-01",
    lastUpdated: "2023-01-01",
    tags,
    description: `Desc ${id}`,
    coverImage: `img${id}.jpg`,
    authorId: "auth1",
    lastEditedBy: "auth1",
    icon: "🚀",
    category: "Tech",
  };
}

describe("getTags", () => {
  it("GT-001: returns empty object for empty post list", () => {
    expect(getTags([])).toEqual({});
  });

  it("GT-002: counts each unique tag across all posts", () => {
    const posts = [
      makePost("1", [{ id: "t1", name: "React", color: "blue" }]),
      makePost("2", [{ id: "t1", name: "React", color: "blue" }]),
      makePost("3", [{ id: "t1", name: "React", color: "blue" }]),
    ];
    expect(getTags(posts)).toEqual({ React: 3 });
  });

  it("GT-003: counts different tags independently", () => {
    const posts = [
      makePost("1", [
        { id: "t1", name: "React", color: "blue" },
        { id: "t2", name: "TypeScript", color: "blue" },
      ]),
      makePost("2", [{ id: "t1", name: "React", color: "blue" }]),
    ];
    expect(getTags(posts)).toEqual({ React: 2, TypeScript: 1 });
  });

  it("GT-004: handles posts with no tags", () => {
    const posts = [makePost("1", []), makePost("2", [{ id: "t1", name: "React", color: "blue" }])];
    expect(getTags(posts)).toEqual({ React: 1 });
  });

  it("GT-005: handles single post with multiple tags", () => {
    const posts = [
      makePost("1", [
        { id: "t1", name: "React", color: "blue" },
        { id: "t2", name: "TypeScript", color: "blue" },
        { id: "t3", name: "Next.js", color: "black" },
      ]),
    ];
    expect(getTags(posts)).toEqual({ React: 1, TypeScript: 1, "Next.js": 1 });
  });

  it("GT-006: counts tags independently of order", () => {
    const postsA = [
      makePost("1", [{ id: "t1", name: "React", color: "blue" }]),
      makePost("2", [{ id: "t1", name: "React", color: "blue" }]),
    ];
    const postsB = [
      makePost("2", [{ id: "t1", name: "React", color: "blue" }]),
      makePost("1", [{ id: "t1", name: "React", color: "blue" }]),
    ];
    expect(getTags(postsA)).toEqual(getTags(postsB));
  });
});
