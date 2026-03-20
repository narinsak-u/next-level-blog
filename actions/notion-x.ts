"use server";

import api from "@/lib/notion-api";
import type { ExtendedRecordMap } from "notion-types";

type PageContentFetcher = (slug: string) => Promise<ExtendedRecordMap | null>;

const fetchPageContent: PageContentFetcher = async (pageId: string) => {
  if (!pageId) return null;

  try {
    const recordMap = await api.getPage(pageId);
    return recordMap;
  } catch (error) {
    console.error("Failed to fetch page content:", error);
    throw new Error("Failed to fetch page content");
  }
};

const fetchContentById = async (pageId: string) => {
  if (!pageId) throw new Error("Page ID is required");
  return fetchPageContent(pageId);
};

export const getPageContent = async (slug: string) => fetchPageContent(slug);

export const getAboutPageContent = async () => {
  const aboutPageId = process.env.NOTION_ABOUT_PAGE_ID as string;
  return fetchContentById(aboutPageId);
};

export const getNotePageContent = async () => {
  const notePageId = process.env.NOTION_NOTE_PAGE_ID as string;
  return fetchContentById(notePageId);
};

export const getProjectPageContent = async () => {
  const projectPageId = process.env.NOTION_PROJECT_PAGE_ID as string;
  return fetchContentById(projectPageId);
};
