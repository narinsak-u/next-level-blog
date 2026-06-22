import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Mode = "focused" | "jianghu";

type ModeStore = {
  mode: Mode;
  setMode: (mode: Mode) => void;
};

export const useModeStore = create<ModeStore>()(
  persist(
    (set) => ({
      mode: "focused",
      setMode: (mode) => set({ mode }),
    }),
    {
      name: "mode-store",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);

export type { Mode };
export default useModeStore;