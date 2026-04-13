"use client";

import ShortcutList from "@/components/ui/ShortcutList";

const shortcuts = [
  { id: "search", keys: ["Ctrl", "K"], label: "Search" },
  { id: "theme", keys: ["Ctrl", "D"], label: "Theme" },
  { id: "music", keys: ["Ctrl", "M"], label: "Music" },
];

const KeyShortcuts = () => {
  return <ShortcutList items={shortcuts} gap="gap-6" />;
};

export default KeyShortcuts;
