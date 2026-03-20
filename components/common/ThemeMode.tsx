"use client";

import {
  SegmentedControl,
  Group,
  Center,
  Box,
} from "@mantine/core";
import { Sun, Moon } from "tabler-icons-react";
import { useTheme } from "@/hooks/useTheme";

const ThemeMode = () => {
  const { colorScheme, toggle } = useTheme();

  return (
    <Group justify="center" my="md">
      <SegmentedControl
        size="xs"
        style={{ fontSize: "14px", gap: "6px" }}
        defaultValue={colorScheme}
        value={colorScheme}
        onChange={() => toggle()}
        data={[
          {
            value: "light",
            label: (
              <Center>
                <Sun size={14} />
                <Box ml={10}>Light</Box>
              </Center>
            ),
          },
          {
            value: "dark",
            label: (
              <Center>
                <Moon size={14} />
                <Box ml={10}>Dark</Box>
              </Center>
            ),
          },
        ]}
      />
    </Group>
  );
};

export default ThemeMode;
