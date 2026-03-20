"use client";

import { useEffect, useRef, useState } from "react";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import { MantineColorScheme, useMantineColorScheme } from "@mantine/core";

/**
 * Syncs Mantine color scheme with Tailwind dark mode class to prevent FOUC.
 * Adds/removes 'dark' class on <html> element based on color scheme.
 */
const ThemeSync = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  const { toggleColorScheme } = useMantineColorScheme();
  const [colorScheme] = useLocalStorage<MantineColorScheme>({
    key: "mantine-color-scheme",
  });

  const colorSchemeRef = useRef(colorScheme);
  colorSchemeRef.current = colorScheme;

  useHotkeys([["ctrl+D", () => toggleColorScheme()]]);

  useEffect(() => {
    const syncTheme = () => {
      const scheme = colorSchemeRef.current;
      if (
        scheme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    setMounted(true);
    syncTheme();
  }, [colorScheme]);

  if (!mounted) return null;

  return <>{children}</>;
};

export default ThemeSync;
