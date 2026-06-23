import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PostCardGrid, PostCardList, TagItemInline } from "@/app/posts/components/PostCard";
import type { PageDataSchemaType } from "@/types";

const mockPost: PageDataSchemaType = {
  id: "post-123",
  title: "Test Post Title",
  createdTime: "2024-01-15T10:00:00.000Z",
  lastUpdated: "2024-01-15T10:00:00.000Z",
  tags: [
    { id: "t1", name: "React", color: "blue" },
    { id: "t2", name: "TypeScript", color: "blue" },
  ],
  description: "A test post description for unit testing",
  coverImage: "https://example.com/cover.jpg",
  authorId: "auth1",
  lastEditedBy: "auth1",
  icon: "🚀",
  category: "Tech",
};

const postWithoutTags: PageDataSchemaType = {
  ...mockPost,
  id: "post-no-tags",
  tags: [],
};

const postWithoutCover: PageDataSchemaType = {
  ...mockPost,
  id: "post-no-cover",
  coverImage: "",
};

describe("PostCardGrid", () => {
  it("PC-001: renders title, description, and date", () => {
    render(<PostCardGrid post={mockPost} />);
    expect(screen.getByText("Test Post Title")).toBeTruthy();
    expect(screen.getByText("A test post description for unit testing")).toBeTruthy();
    expect(screen.getByText("January 15, 2024")).toBeTruthy();
  });

  it("PC-002: links to the post detail page", () => {
    render(<PostCardGrid post={mockPost} />);
    const link = screen.getByRole("link", { name: /Read post: Test Post Title/i });
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toBe("/posts/post-123");
  });

  it("PC-003: shows tag badges by default", () => {
    render(<PostCardGrid post={mockPost} />);
    expect(screen.getByText("React")).toBeTruthy();
    expect(screen.getByText("TypeScript")).toBeTruthy();
  });

  it("PC-004: hides tags when showTags is false", () => {
    render(<PostCardGrid post={mockPost} showTags={false} />);
    expect(screen.queryByText("React")).toBeNull();
    expect(screen.queryByText("TypeScript")).toBeNull();
  });

  it("PC-005: does not crash when coverImage is present", () => {
    expect(() => render(<PostCardGrid post={mockPost} />)).not.toThrow();
  });

  it("PC-005b: does not crash when coverImage is empty", () => {
    expect(() => render(<PostCardGrid post={postWithoutCover} />)).not.toThrow();
  });

  it("PC-006: hides cover image when showImage is false", () => {
    render(<PostCardGrid post={mockPost} showImage={false} />);
    expect(document.querySelector("img")).toBeNull();
  });

  it("PC-007: shows description by default", () => {
    render(<PostCardGrid post={mockPost} />);
    expect(screen.getByText("A test post description for unit testing")).toBeTruthy();
  });

  it("PC-008: hides description when showDescription is false", () => {
    render(<PostCardGrid post={mockPost} showDescription={false} />);
    expect(screen.queryByText("A test post description for unit testing")).toBeNull();
  });

  it("PC-009: renders without tags when post has empty tags array", () => {
    render(<PostCardGrid post={postWithoutTags} />);
    expect(screen.queryByText("React")).toBeNull();
    expect(screen.getByText("Test Post Title")).toBeTruthy();
  });
});

describe("PostCardList", () => {
  it("PCL-001: renders title and description", () => {
    render(<PostCardList post={mockPost} />);
    expect(screen.getByText("Test Post Title")).toBeTruthy();
    expect(screen.getByText("A test post description for unit testing")).toBeTruthy();
  });

  it("PCL-002: links to the post detail page", () => {
    render(<PostCardList post={mockPost} />);
    const link = screen.getByRole("link", { name: /Read post: Test Post Title/i });
    expect(link.getAttribute("href")).toBe("/posts/post-123");
  });

  it("PCL-003: renders date in yyyy-LL-dd format", () => {
    render(<PostCardList post={mockPost} />);
    expect(screen.getByText("2024-01-15")).toBeTruthy();
  });

  it("PCL-004: hides description when showDescription is false", () => {
    render(<PostCardList post={mockPost} showDescription={false} />);
    expect(screen.queryByText("A test post description for unit testing")).toBeNull();
  });

  it("PCL-005: shows description by default", () => {
    render(<PostCardList post={mockPost} />);
    expect(screen.getByText("A test post description for unit testing")).toBeTruthy();
  });
});

describe("TagItemInline", () => {
  it("TI-001: renders all tag names", () => {
    render(<TagItemInline tags={mockPost.tags} />);
    expect(screen.getByText("React")).toBeTruthy();
    expect(screen.getByText("TypeScript")).toBeTruthy();
  });

  it("TI-002: renders nothing for empty tags array", () => {
    const { container } = render(<TagItemInline tags={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("TI-003: renders nothing for null tags", () => {
    const { container } = render(<TagItemInline tags={null as never} />);
    expect(container.firstChild).toBeNull();
  });
});
