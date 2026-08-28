import { NotionAPI } from "notion-client";

export const buildNotionApiBaseUrl = (publishedSiteUrl: string | undefined): string => {
  if (!publishedSiteUrl) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("NOTION_PUBLIC_SITE_URL must be set in production");
    }

    return "https://www.notion.so/api/v3";
  }

  return `${publishedSiteUrl.replace(/\/+$/, "")}/api/v3`;
};

const api = new NotionAPI({
  apiBaseUrl: buildNotionApiBaseUrl(process.env.NOTION_PUBLIC_SITE_URL),
});

export default api;
