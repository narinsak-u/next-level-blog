export const validNotionPage = {
  id: "uuid-123",
  created_time: "2024-01-15T10:00:00.000Z",
  last_edited_time: "2024-01-20T15:30:00.000Z",
  properties: {
    Name: { title: [{ plain_text: "Test Post" }] },
    Description: { rich_text: [{ plain_text: "Test description" }] },
    Tags: { multi_select: [{ id: "1", name: "React", color: "blue" }] },
    Category: { select: { name: "Tech" } },
    Status: { status: { name: "Done" } }
  },
  cover: { external: { url: "https://example.com/cover.jpg" } },
  created_by: { id: "user-123" },
  last_edited_by: { id: "user-456" },
  icon: { emoji: "🎉" }
};

export const notionPageWithMissingFields = {
  id: "uuid-456",
  created_time: "2024-01-15T10:00:00.000Z",
  last_edited_time: "2024-01-20T15:30:00.000Z",
  properties: {
    Name: { title: [] },
    Description: { rich_text: [] },
    Tags: { multi_select: [] },
    Category: { select: null },
    Status: { status: { name: "Done" } }
  },
  cover: null,
  created_by: { id: "user-123" },
  last_edited_by: { id: "user-456" },
  icon: null
};

export const notionPageWithNullDates = {
  id: "uuid-789",
  created_time: null,
  last_edited_time: null,
  properties: {
    Name: { title: [{ plain_text: "Null Date Test" }] },
    Description: { rich_text: [] },
    Tags: { multi_select: [] },
    Category: { select: { name: "Test" } },
    Status: { status: { name: "Done" } }
  },
  cover: null,
  created_by: { id: "user-123" },
  last_edited_by: { id: "user-456" },
  icon: null
};
