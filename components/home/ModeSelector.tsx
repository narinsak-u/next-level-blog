"use client";

import { useEffect } from "react";
import { SegmentedControl } from "@mantine/core";
import { useModeStore, type Mode } from "@/hooks/use-mode-store";

const ModeSelector = () => {
  const { mode, setMode } = useModeStore();

  useEffect(() => {
    useModeStore.persist.rehydrate();
  }, []);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <SegmentedControl
        value={mode}
        onChange={(value) => setMode(value as Mode)}
        data={[
          { label: "Focused", value: "focused" },
          { label: "Jianghu", value: "jianghu" },
        ]}
        size="sm"
        styles={{
          root: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(8px)",
          },
          label: {
            color: "rgba(255, 255, 255, 0.7)",
          },
          indicator: {
            backgroundColor: "rgba(255, 255, 255, 0.15)",
          },
        }}
      />
    </div>
  );
};

export default ModeSelector;