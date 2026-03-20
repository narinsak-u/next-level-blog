export const ANIMATION = {
  DURATION: 0.3,
  DELAY: 0.3,
  EASE_OUT: "easeOut",
  EASE_OUT_OPACITY: [0.25, 0.46, 0.45, 0.94] as const,
  SPRING: {
    type: "spring" as const,
    stiffness: 60,
    damping: 10,
    mass: 0.8,
  },
} as const;

export const MUSIC = {
  VOLUME: 0.3,
  SRC: "/assets/lan-ting-xu.mp3",
} as const;

export const POSTS = {
  DEFAULT_LIMIT: 6,
} as const;

export const VIDEO_EXTENSIONS = ["mp4", "webm", "ogg", "mov", "avi", "m4v"] as const;

export const DEFAULT_DATE = "2023-07-27T17:12:00.000Z";

export const DEFAULT_DESCRIPTION = "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Velit, voluptatum nesciunt assumenda accusamus eius rem?";
