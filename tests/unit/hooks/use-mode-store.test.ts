import { describe, it, expect, beforeEach } from "vitest";
import { useModeStore } from "@/app/(home)/hooks/use-mode-store";

describe("useModeStore", () => {
  beforeEach(() => {
    useModeStore.setState({ mode: "focused" });
    localStorage.clear();
  });

  describe("MS-001: initial state", () => {
    it("defaults to 'focused' mode", () => {
      expect(useModeStore.getState().mode).toBe("focused");
    });
  });

  describe("MS-002: setMode()", () => {
    it("updates mode to 'jianghu'", () => {
      useModeStore.getState().setMode("jianghu");
      expect(useModeStore.getState().mode).toBe("jianghu");
    });

    it("updates mode back to 'focused'", () => {
      useModeStore.getState().setMode("jianghu");
      useModeStore.getState().setMode("focused");
      expect(useModeStore.getState().mode).toBe("focused");
    });

    it("preserves mode across setState updates", () => {
      useModeStore.getState().setMode("jianghu");
      useModeStore.setState({ mode: "focused" });
      expect(useModeStore.getState().mode).toBe("focused");
    });
  });

  describe("MS-003: persist configuration", () => {
    it("uses 'mode-store' as the storage key", () => {
      useModeStore.getState().setMode("jianghu");
      useModeStore.persist.rehydrate();
      const stored = localStorage.getItem("mode-store");
      expect(stored).toBeTruthy();
    });

    it("serializes mode to JSON", () => {
      useModeStore.getState().setMode("jianghu");
      useModeStore.persist.rehydrate();
      const stored = JSON.parse(localStorage.getItem("mode-store") || "{}");
      expect(stored.state.mode).toBe("jianghu");
    });

    it("uses skipHydration so initial render uses default", () => {
      useModeStore.setState({ mode: "jianghu" });
      useModeStore.persist.rehydrate();

      expect(useModeStore.persist.hasHydrated()).toBe(true);
    });
  });
});
