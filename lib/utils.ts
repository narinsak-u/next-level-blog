import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const VIDEO_EXTENSIONS = ["mp4", "webm", "ogg", "mov", "avi", "m4v"] as const;

export const getFileExtension = (url: string): string => {
  return url.split(".").pop()?.toLowerCase() || "";
};

export const isVideo = (extension: string): boolean => {
  return VIDEO_EXTENSIONS.includes(extension as (typeof VIDEO_EXTENSIONS)[number]);
};
