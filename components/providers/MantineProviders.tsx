"use client";

import { useState } from "react";
import { MantineProvider, localStorageColorSchemeManager } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";

// import Player from "@/components/common/Player";
import ThemeSync from "@/components/common/ThemeCheck";
import { theme } from "@/styles/theme";

export default function MantineProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [opened, setOpened] = useState<boolean>(false);

  // get color scheme manager from local storage
  const colorSchemeManager = localStorageColorSchemeManager({
    key: "mantine-color-scheme",
  });

  // useHotkeys([["mod+shift+P", () => setOpened((o) => !o)]]);

  return (
    <MantineProvider
      defaultColorScheme="auto"
      colorSchemeManager={colorSchemeManager}
      theme={theme}
    >
      <ThemeSync>{children}</ThemeSync>
      {/* <Player opened={opened} setOpened={setOpened} /> */}
    </MantineProvider>
  );
}
