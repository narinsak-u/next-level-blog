"use client";

import { useMantineColorScheme } from "@mantine/core";

interface ThemeContextValue {
  colorScheme: "light" | "dark" | "auto";
  isDark: boolean;
  isLight: boolean;
  isAuto: boolean;
  toggle: () => void;
  setLight: () => void;
  setDark: () => void;
  setAuto: () => void;
}

export const useTheme = (): ThemeContextValue => {
  const { colorScheme, toggleColorScheme, setColorScheme } =
    useMantineColorScheme();

  return {
    colorScheme,
    isDark: colorScheme === "dark",
    isLight: colorScheme === "light",
    isAuto: colorScheme === "auto",
    toggle: toggleColorScheme,
    setLight: () => setColorScheme("light"),
    setDark: () => setColorScheme("dark"),
    setAuto: () => setColorScheme("auto"),
  };
};
