"use client";

import { Sun, Moon } from "tabler-icons-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const ThemeMode = () => {
  const { colorScheme, setLight, setDark } = useTheme();

  return (
    <div className="flex justify-center my-3">
      <div
        className={cn(
          "inline-flex",
          "bg-white/5 border border-white/10 backdrop-blur-sm"
        )}
      >
        <button
          onClick={setLight}
          aria-label="Switch to light mode"
          aria-pressed={colorScheme === "light"}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5",
            "text-xs uppercase tracking-widest font-medium",
            "transition-all duration-200",
            colorScheme === "light"
              ? "bg-white/15 text-foreground"
              : "text-foreground/40 hover:text-foreground/70"
          )}
        >
          <Sun size={13} />
          Light
        </button>
        <div className="w-px bg-white/10" />
        <button
          onClick={setDark}
          aria-label="Switch to dark mode"
          aria-pressed={colorScheme === "dark"}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5",
            "text-xs uppercase tracking-widest font-medium",
            "transition-all duration-200",
            colorScheme === "dark"
              ? "bg-white/15 text-foreground"
              : "text-foreground/40 hover:text-foreground/70"
          )}
        >
          <Moon size={13} />
          Dark
        </button>
      </div>
    </div>
  );
};

export default ThemeMode;
