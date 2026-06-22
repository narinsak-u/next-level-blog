export const ANIMATION = {
  DURATION: 0.4,
  DELAY: 0.1,
  EASE_OUT: [0.33, 1, 0.68, 1] as const,
  EASE_OUT_OPACITY: [0.25, 0.46, 0.45, 0.94] as const,
  SPRING: {
    type: "spring" as const,
    stiffness: 120,
    damping: 14,
    mass: 0.8,
  },
  SPRING_SLOW: {
    type: "spring" as const,
    stiffness: 80,
    damping: 12,
    mass: 1,
  },
} as const;

export const MUSIC = {
  VOLUME: 0.3,
  SRC: "/assets/where-winds-meet-ost.mp3",
} as const;

export const POSTS = {
  DEFAULT_LIMIT: 6,
} as const;

export const VIDEO_EXTENSIONS = [
  "mp4",
  "webm",
  "ogg",
  "mov",
  "avi",
  "m4v",
] as const;

export const DEFAULT_DATE = "2023-07-27T17:12:00.000Z";

export const DEFAULT_DESCRIPTION =
  "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit, voluptatum nesciunt assumenda accusamus eius rem?";
