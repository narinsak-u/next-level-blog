# Mode Selection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add mode selection toggle at the top of the home page to switch between Focused (HomePage) and Jianghu (NewProfile) modes.

**Architecture:** Zustand store with localStorage persistence manages mode state. ModeSelector component renders toggle switch at top of page. app/page.tsx conditionally renders the correct component based on mode.

**Tech Stack:** React, Zustand, TypeScript, Tailwind CSS, Mantine UI (SegmentedControl for toggle)

---

## Files

**Create:**
- `hooks/use-mode-store.ts` - Zustand store for mode state with localStorage persistence
- `components/home/ModeSelector.tsx` - Toggle switch component

**Modify:**
- `app/page.tsx` - Add mode state and conditional rendering

---

### Task 1: Create Mode Store

**Files:**
- Create: `hooks/use-mode-store.ts`

- [ ] **Step 1: Create the mode store with Zustand**

```typescript
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
```

---

### Task 2: Create ModeSelector Component

**Files:**
- Create: `components/home/ModeSelector.tsx`

- [ ] **Step 1: Create the ModeSelector component**

```tsx
"use client";

import { SegmentedControl } from "@mantine/core";
import { useModeStore, type Mode } from "@/hooks/use-mode-store";

const ModeSelector = () => {
  const { mode, setMode } = useModeStore();

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
          labelActive: {
            color: "#fff",
          },
          control: {
            border: "none",
          },
        }}
      />
    </div>
  );
};

export default ModeSelector;
```

---

### Task 3: Update Home Page with Mode Selection

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Update page.tsx to use mode selection**

```tsx
import HomePage from "@/components/home/HomePage";
import NewProfile from "@/components/home/NewProfile";
import ModeSelector from "@/components/home/ModeSelector";
import { useModeStore } from "@/hooks/use-mode-store";

const Home = () => {
  const mode = useModeStore((state) => state.mode);

  return (
    <>
      <ModeSelector />
      {mode === "focused" ? <HomePage /> : <NewProfile />}
    </>
  );
};

export default Home;
```

- [ ] **Step 2: Run lint check**

Run: `bun run lint`
Expected: No errors

- [ ] **Step 3: Test manually in browser**

1. Open the home page
2. Verify Focused mode shows HomePage by default
3. Click "Jianghu" - should switch to NewProfile
4. Refresh the page - mode should persist
5. Click "Focused" - should switch back to HomePage

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add mode selection toggle for Focused/Jianghu home page views"
```