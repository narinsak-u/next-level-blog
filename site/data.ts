// Images
export const defaultImage = "/image.jpg";
// export const ogHomeImage = "/assets/og-home.png";
// export const ogNoteImage = "/assets/og-notes.png";
// export const ogPoststImage = "/assets/og-posts.png";
// export const ogTagImage = "/assets/og-tags.png";

// Music
export const myMusic = {
  name: "Who Really Knows",
  src: "/assets/who-really-knows.mp3",
};

// Menu
export interface NavigationItem {
  id: string;
  href: string;
  name: string;
  emoji: string;
}

export const Navigations: NavigationItem[] = [
  {
    id: "1",
    href: "/about",
    name: "About Me",
    emoji: "📌 ",
  },
  {
    id: "2",
    href: "/posts",
    name: "Posts",
    emoji: "📖",
  },
  {
    id: "3",
    href: "/hobbies",
    name: "Hobbies",
    emoji: "🎨",
  },
  {
    id: "4",
    href: "/note",
    name: "Note",
    emoji: "📝",
  },
];

export const MainKeys = [
  { id: "theme", keys: ["Ctrl", "D"], label: "Theme" },
  { id: "mode", keys: ["Ctrl", "Q"], label: "Mode" },
];
