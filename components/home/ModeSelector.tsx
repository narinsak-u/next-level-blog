"use client";

import { useEffect } from "react";
import { SegmentedControl, useMantineColorScheme } from "@mantine/core";
import { useModeStore, type Mode } from "@/hooks/use-mode-store";

const ModeSelector = () => {
  const { mode, setMode } = useModeStore();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    useModeStore.persist.rehydrate();
  }, []);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <SegmentedControl
        value={mode}
        onChange={(value) => setMode(value as Mode)}
        data={[
          { label: "🎯 Focused", value: "focused" },
          { label: "🍃 Jianghu", value: "jianghu" },
        ]}
        size="sm"
        styles={{
          root: {
            backgroundColor: "transparent",
          },
          label: {
            color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
          },
          indicator: {
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)",
          },
        }}
      />
    </div>
  );
};

export default ModeSelector;
