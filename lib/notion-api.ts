import { NotionAPI } from "notion-client";

const INVALID_PUBLISHED_SITE_URL_ERROR =
  "NOTION_PUBLIC_SITE_URL must be an HTTP(S) origin URL";

export const buildNotionApiBaseUrl = (
  publishedSiteUrl: string | undefined,
): string => {
  if (!publishedSiteUrl) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("NOTION_PUBLIC_SITE_URL must be set in production");
    }

    return "https://www.notion.so/api/v3";
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(publishedSiteUrl);
  } catch {
    throw new Error(INVALID_PUBLISHED_SITE_URL_ERROR);
  }

  if (
    (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") ||
    parsedUrl.pathname !== "/" ||
    parsedUrl.search ||
    parsedUrl.hash ||
    parsedUrl.username ||
    parsedUrl.password
  ) {
    throw new Error(INVALID_PUBLISHED_SITE_URL_ERROR);
  }

  return new URL("/api/v3", parsedUrl.origin).toString();
};

const api = new NotionAPI({
  apiBaseUrl: buildNotionApiBaseUrl(process.env.NOTION_PUBLIC_SITE_URL),
});

export default api;
