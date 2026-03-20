import type { PageDataSchemaType } from '@/types';

export const mockPost: PageDataSchemaType = {
  id: "post-123",
  title: "Test Post",
  description: "This is a test post description",
  createdTime: "2024-01-15T10:00:00.000Z",
  lastUpdated: "2024-01-20T15:30:00.000Z",
  coverImage: "https://example.com/cover.jpg",
  tags: [
    { id: "1", name: "React", color: "blue" },
    { id: "2", name: "TypeScript", color: "green" }
  ],
  category: "Tech",
  authorId: "user-123",
  lastEditedBy: "user-456",
  icon: "📝"
};

export const mockPosts: PageDataSchemaType[] = [
  mockPost,
  {
    ...mockPost,
    id: "post-456",
    title: "Another Post",
    category: "Reading"
  },
  {
    ...mockPost,
    id: "post-789",
    title: "Third Post",
    category: "Hobbies"
  }
];

export const emptyPosts: PageDataSchemaType[] = [];
