import { describe, it, expect } from "vitest";
import { getCategory } from "@/app/posts/helpers/get-unique-category";
import type { PageDataSchemaType } from "@/types";

function makePost(id: string, category: string): PageDataSchemaType {
  return {
    id,
    title: `Post ${id}`,
    createdTime: "2023-01-01",
    lastUpdated: "2023-01-01",
    tags: [],
    description: `Desc ${id}`,
    coverImage: `img${id}.jpg`,
    authorId: "auth1",
    lastEditedBy: "auth1",
    icon: "🚀",
    category,
  };
}

describe("getCategory", () => {
  it("GC-001: returns empty array for empty post list", () => {
    expect(getCategory([])).toEqual([]);
  });

  it("GC-002: returns single category", () => {
    const posts = [makePost("1", "Tech"), makePost("2", "Tech")];
    expect(getCategory(posts)).toEqual(["Tech"]);
  });

  it("GC-003: returns unique categories (no duplicates)", () => {
    const posts = [
      makePost("1", "Tech"),
      makePost("2", "Tech"),
      makePost("3", "Life"),
      makePost("4", "Life"),
    ];
    const result = getCategory(posts);
    expect(result).toHaveLength(2);
    expect(result).toContain("Tech");
    expect(result).toContain("Life");
  });

  it("GC-004: skips posts with empty category", () => {
    const posts = [
      makePost("1", "Tech"),
      makePost("2", ""),
      makePost("3", "Life"),
    ];
    const result = getCategory(posts);
    expect(result).toHaveLength(2);
    expect(result).not.toContain("");
  });

  it("GC-005: returns categories in insertion order", () => {
    const posts = [
      makePost("1", "B"),
      makePost("2", "A"),
      makePost("3", "C"),
    ];
    expect(getCategory(posts)).toEqual(["B", "A", "C"]);
  });

  it("GC-006: handles all posts with empty category", () => {
    const posts = [makePost("1", ""), makePost("2", "")];
    expect(getCategory(posts)).toEqual([]);
  });
});
