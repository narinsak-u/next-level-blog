"use client";

import { cn } from "@/lib/utils";

const shortcuts = [
  { keys: ["Ctrl", "K"], label: "Search" },
  { keys: ["Ctrl", "D"], label: "Theme" },
  { keys: ["Ctrl", "M"], label: "Music" },
];

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd
    className={cn(
      "inline-flex items-center px-1.5 py-0.5",
      "text-[10px] font-medium uppercase tracking-wide",
      "bg-white/5 border border-white/15 text-foreground/50"
    )}
  >
    {children}
  </kbd>
);

const KeyShortcuts = () => {
  return (
    <div className="flex items-center justify-center gap-6 py-2">
      {shortcuts.map(({ keys, label }) => (
        <div
          key={label}
          className="flex items-center gap-1.5 text-foreground/35"
        >
          <div className="flex items-center gap-1">
            {keys.map((k, i) => (
              <span key={k} className="flex items-center gap-1">
                <Kbd>{k}</Kbd>
                {i < keys.length - 1 && (
                  <span className="text-[10px] text-foreground/25">+</span>
                )}
              </span>
            ))}
          </div>
          <span className="text-[10px] uppercase tracking-widest text-foreground/35">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default KeyShortcuts;
