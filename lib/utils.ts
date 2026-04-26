import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const VIDEO_EXTENSIONS = ["mp4", "webm", "ogg", "mov", "avi", "m4v"] as const;

export const getFileExtension = (url: string): string => {
  const cleanUrl = url.split("?")[0]!;
  const lastDot = cleanUrl.lastIndexOf(".");
  if (lastDot === -1 || lastDot === cleanUrl.length - 1) return "";
  return cleanUrl.slice(lastDot + 1).toLowerCase();
};

export const isVideo = (extension: string): boolean => {
  if (!extension) return false;
  return VIDEO_EXTENSIONS.includes(extension.toLowerCase() as (typeof VIDEO_EXTENSIONS)[number]);
};
