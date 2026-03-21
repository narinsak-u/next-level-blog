import { describe, it, expect } from "vitest";
import { filterPostsByTag, getRelatedPosts } from "@/lib/post-logic";
import { PageDataSchemaType } from "@/types";

const mockPosts: PageDataSchemaType[] = [
  {
    id: "1",
    title: "Post 1",
    createdTime: "2023-01-01",
    lastUpdated: "2023-01-01",
    tags: [
      { id: "tag1", name: "React", color: "blue" },
      { id: "tag2", name: "Next.js", color: "black" },
    ],
    description: "Desc 1",
    coverImage: "img1.jpg",
    authorId: "auth1",
    lastEditedBy: "auth1",
    icon: "🚀",
    category: "Tech",
  },
  {
    id: "2",
    title: "Post 2",
    createdTime: "2023-01-02",
    lastUpdated: "2023-01-02",
    tags: [{ id: "tag1", name: "React", color: "blue" }],
    description: "Desc 2",
    coverImage: "img2.jpg",
    authorId: "auth1",
    lastEditedBy: "auth1",
    icon: "⚛️",
    category: "Tech",
  },
  {
    id: "3",
    title: "Post 3",
    createdTime: "2023-01-03",
    lastUpdated: "2023-01-03",
    tags: [{ id: "tag3", name: "TypeScript", color: "blue" }],
    description: "Desc 3",
    coverImage: "img3.jpg",
    authorId: "auth1",
    lastEditedBy: "auth1",
    icon: "📘",
    category: "Tech",
  },
];

describe("post-logic", () => {
  describe("filterPostsByTag", () => {
    it("should filter posts by tag name", () => {
      const result = filterPostsByTag(mockPosts, "React");
      expect(result).toHaveLength(2);
      expect(result.map((p) => p.id)).toContain("1");
      expect(result.map((p) => p.id)).toContain("2");
    });

    it("should return empty array if tag doesn't exist", () => {
      const result = filterPostsByTag(mockPosts, "Vue");
      expect(result).toHaveLength(0);
    });

    it("should handle null/undefined posts", () => {
      // @ts-ignore
      expect(filterPostsByTag(null, "React")).toEqual([]);
    });
  });

  describe("getRelatedPosts", () => {
    it("should return posts with matching tags, excluding itself", () => {
      const currentPostTags = mockPosts[0].tags; // React, Next.js
      const result = getRelatedPosts(mockPosts, "1", currentPostTags);
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("2"); // Matches "React"
    });

    it("should return empty array if no tags match", () => {
      const currentPostTags = mockPosts[2].tags; // TypeScript
      const result = getRelatedPosts(mockPosts, "3", currentPostTags);
      
      expect(result).toHaveLength(0);
    });

    it("should respect the limit", () => {
      const extraPosts = [
          ...mockPosts,
          { ...mockPosts[1], id: "4" },
          { ...mockPosts[1], id: "5" },
          { ...mockPosts[1], id: "6" },
      ];
      const result = getRelatedPosts(extraPosts, "1", mockPosts[0].tags, 2);
      expect(result).toHaveLength(2);
    });

    it("should handle null/undefined inputs", () => {
      // @ts-ignore
      expect(getRelatedPosts(null, "1", [])).toEqual([]);
      // @ts-ignore
      expect(getRelatedPosts([], "1", null)).toEqual([]);
    });
  });
});
