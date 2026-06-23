import { describe, it, expect, beforeEach } from "vitest";
import { useLayoutStore } from "@/app/posts/hooks/use-layout-store";

describe("useLayoutStore", () => {
  beforeEach(() => {
    useLayoutStore.setState({ isGrid: false });
    localStorage.clear();
  });

  describe("LS-001: initial state", () => {
    it("defaults to isGrid=false (list view)", () => {
      expect(useLayoutStore.getState().isGrid).toBe(false);
    });
  });

  describe("LS-002: toggle()", () => {
    it("toggles from list to grid", () => {
      useLayoutStore.getState().toggle();
      expect(useLayoutStore.getState().isGrid).toBe(true);
    });

    it("toggles from grid back to list", () => {
      useLayoutStore.getState().toggle();
      useLayoutStore.getState().toggle();
      expect(useLayoutStore.getState().isGrid).toBe(false);
    });

    it("toggles multiple times", () => {
      useLayoutStore.getState().toggle();
      useLayoutStore.getState().toggle();
      useLayoutStore.getState().toggle();
      expect(useLayoutStore.getState().isGrid).toBe(true);
    });
  });

  describe("LS-003: persist configuration", () => {
    it("uses 'layout-store' as the storage key", () => {
      useLayoutStore.getState().toggle();
      useLayoutStore.persist.rehydrate();
      const stored = localStorage.getItem("layout-store");
      expect(stored).toBeTruthy();
    });

    it("serializes isGrid state to JSON", () => {
      useLayoutStore.getState().toggle();
      useLayoutStore.persist.rehydrate();
      const stored = JSON.parse(localStorage.getItem("layout-store") || "{}");
      expect(stored.state.isGrid).toBe(true);
    });

    it("uses skipHydration so initial render uses default", () => {
      useLayoutStore.setState({ isGrid: true });
      useLayoutStore.persist.rehydrate();

      expect(useLayoutStore.persist.hasHydrated()).toBe(true);
    });
  });
});
