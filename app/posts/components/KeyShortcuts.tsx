"use client";

import ShortcutList, { type ShortcutItem } from "@/components/ui/ShortcutList";

const defaultShortcuts: ShortcutItem[] = [
  { id: "search", keys: ["Ctrl", "K"], label: "Search" },
  { id: "theme", keys: ["Ctrl", "D"], label: "Theme" },
  { id: "music", keys: ["Ctrl", "M"], label: "Music" },
];

interface KeyShortcutsProps {
  items?: ShortcutItem[];
  gap?: string;
}

const KeyShortcuts = ({
  items = defaultShortcuts,
  gap = "gap-6",
}: KeyShortcutsProps) => {
  return <ShortcutList items={items} gap={gap} />;
};

export default KeyShortcuts;
