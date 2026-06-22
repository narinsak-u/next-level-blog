import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { VIDEO_EXTENSIONS } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getFileExtension = (url: string): string => {
  const cleanUrl = url.split("?")[0]!;
  const lastDot = cleanUrl.lastIndexOf(".");
  if (lastDot === -1 || lastDot === cleanUrl.length - 1) return "";
  return cleanUrl.slice(lastDot + 1).toLowerCase();
};

export const isVideo = (extension: string): boolean => {
  if (!extension) return false;
  return (VIDEO_EXTENSIONS as readonly string[]).includes(extension.toLowerCase());
};
