"use client";

import { MantineProvider, localStorageColorSchemeManager } from "@mantine/core";
import ThemeSync from "@/components/common/ThemeCheck";
import { theme } from "@/styles/theme";

export default function MantineProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const colorSchemeManager = localStorageColorSchemeManager({
    key: "mantine-color-scheme",
  });

  return (
    <MantineProvider
      defaultColorScheme="auto"
      colorSchemeManager={colorSchemeManager}
      theme={theme}
    >
      <ThemeSync>{children}</ThemeSync>
    </MantineProvider>
  );
}
