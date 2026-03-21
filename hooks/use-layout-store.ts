import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Store = {
  isGrid: boolean;
  toggle: () => void;
};

export const useLayoutStore = create<Store>()(
  persist(
    (set) => ({
      isGrid: true,
      toggle: () => set((state) => ({ isGrid: !state.isGrid })),
    }),
    {
      name: "layout-store",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);

export default useLayoutStore;
