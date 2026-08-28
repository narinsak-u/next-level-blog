import { afterEach, describe, expect, it, vi } from "vitest";

const { notionApiConstructorMock } = vi.hoisted(() => ({
  notionApiConstructorMock: vi.fn(),
}));

vi.mock("notion-client", () => ({
  NotionAPI: notionApiConstructorMock,
}));

const originalNodeEnv = process.env.NODE_ENV;
const originalPublishedSiteUrl = process.env.NOTION_PUBLIC_SITE_URL;

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();

  if (originalNodeEnv === undefined) {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = originalNodeEnv;
  }

  if (originalPublishedSiteUrl === undefined) {
    delete process.env.NOTION_PUBLIC_SITE_URL;
  } else {
    process.env.NOTION_PUBLIC_SITE_URL = originalPublishedSiteUrl;
  }
});

describe("Notion API configuration", () => {
  it("normalizes a published site URL to its API base URL", async () => {
    process.env.NODE_ENV = "test";
    // Dynamic imports let each test set process.env before module initialization.
    const { buildNotionApiBaseUrl } = await import("@/lib/notion-api");

    expect(
      buildNotionApiBaseUrl("https://future-shawl-a38.notion.site/"),
    ).toBe("https://future-shawl-a38.notion.site/api/v3");
  });

  it("throws an actionable error when the published site URL is missing in production", async () => {
    process.env.NODE_ENV = "production";
    delete process.env.NOTION_PUBLIC_SITE_URL;

    await expect(import("@/lib/notion-api")).rejects.toThrow(
      "NOTION_PUBLIC_SITE_URL must be set in production",
    );
  });

  it("configures the shared Notion client with the published domain", async () => {
    process.env.NODE_ENV = "production";
    process.env.NOTION_PUBLIC_SITE_URL =
      "https://future-shawl-a38.notion.site/";

    await import("@/lib/notion-api");

    expect(notionApiConstructorMock).toHaveBeenCalledWith({
      apiBaseUrl: "https://future-shawl-a38.notion.site/api/v3",
    });
  });
});
