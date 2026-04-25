# Post Frequency Heatmap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a stats section with a time-series calendar heatmap showing post frequency using Cal-Heatmap library with orange theme.

**Architecture:** Server-side fetch posts via `fetchPosts`, aggregate by date on server, pass to client component `PostHeatmap` which renders Cal-Heatmap.

**Tech Stack:** Cal-Heatmap, React 19, Next.js 16, Mantine UI (Loader)

---

## Task 1: Install Cal-Heatmap

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install cal-heatmap package**

Run: `bun add cal-heatmap`
Expected: Package added to dependencies

- [ ] **Step 2: Commit**

```bash
git add package.json bun.lock
git commit -m "chore: add cal-heatmap dependency"
```

---

## Task 2: Create PostHeatmap Client Component

**Files:**
- Create: `app/note/components/PostHeatmap.tsx`

- [ ] **Step 1: Write the PostHeatmap component**

Create `app/note/components/PostHeatmap.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import CalHeatmap from "cal-heatmap";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import "cal-heatmap/cal-heatmap.css";
import Loader from "@/components/common/Loader";

interface PostHeatmapProps {
  data: Record<string, number>;
}

const PostHeatmap = ({ data }: PostHeatmapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<CalHeatmap | null>(null);

  useEffect(() => {
    if (!containerRef.current || Object.keys(data).length === 0) return;

    if (calRef.current) {
      calRef.current.destroy();
    }

    calRef.current = new CalHeatmap();

    calRef.current.paint(
      {
        itemSelector: "#cal-heatmap",
        date: { start: new Date("2020-01-01") },
        domain: { type: "year", label: { text: null } },
        subDomain: { type: "day", label: null },
        data: { source: data, type: "json", x: "date", y: "value" },
        scale: {
          color: {
            scheme: "Oranges",
            type: "linear",
            domain: [0, Math.max(1, ...Object.values(data))],
          },
        },
      },
      [[Tooltip]]
    );

    return () => {
      if (calRef.current) {
        calRef.current.destroy();
        calRef.current = null;
      }
    };
  }, [data]);

  const totalPosts = Object.values(data).reduce((sum, count) => sum + count, 0);

  if (Object.keys(data).length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No posts yet
      </div>
    );
  }

  return (
    <div>
      <p className="text-center mb-4 font-semibold text-orange-600">
        Total Posts: {totalPosts}
      </p>
      <div ref={containerRef} id="cal-heatmap" className="flex justify-center" />
    </div>
  );
};

export default PostHeatmap;
```

- [ ] **Step 2: Commit**

```bash
git add app/note/components/PostHeatmap.tsx
git commit -m "feat: add PostHeatmap component with Cal-Heatmap"
```

---

## Task 3: Modify Note Page to Fetch and Pass Post Data

**Files:**
- Modify: `app/note/page.tsx:26-36`

- [ ] **Step 1: Update note/page.tsx to fetch posts and aggregate by date**

Replace the Note component in `app/note/page.tsx`:

```tsx
import { fetchPosts } from "@/actions/posts";

// ... existing imports

const Note = async () => {
  const recordMap = await fetchStaticPageContent("note");
  const posts = await fetchPosts({ limit: 100, status: "Done" });

  // Aggregate post counts by date (YYYY-MM-DD)
  const postDates = posts.reduce((acc, post) => {
    const date = post.createdTime.split("T")[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <NotePage postDates={postDates}>
      <Suspense fallback={<Loader />}>
        {recordMap ? <Content recordMap={recordMap} /> : null}
      </Suspense>
    </NotePage>
  );
};
```

- [ ] **Step 2: Commit**

```bash
git add app/note/page.tsx
git commit -m "feat: fetch posts and aggregate by date for heatmap"
```

---

## Task 4: Modify NotePage to Accept and Render PostHeatmap

**Files:**
- Modify: `app/note/components/NotePage.tsx:1-46`

- [ ] **Step 1: Update NotePage to accept postDates prop**

Update `NotePage.tsx`:

```tsx
"use client";

import { Container, Divider, Space } from "@mantine/core";
import CustomBlockquote from "./CustomBlockquote";
import FirstContent from "../contents/content-1.mdx";
import PostHeatmap from "./PostHeatmap";

type Props = {
  children: React.ReactNode;
  postDates: Record<string, number>;
};

const NotePage = ({ children, postDates }: Props) => {
  return (
    <>
      <Container className="my-0 mx-2 md:m-auto w-full">
        <CustomBlockquote
          cite="3rd rabbit The caffeine-driven man"
          quote="The only way to gain knowledge is to be aware of everything around you. ✌️"
        />
        <Space h={"lg"} />
        <Space h={"lg"} />

        <div>
          <Divider label="Content from Notion" labelPosition="center" />
          {children}
          <Space h={"lg"} />
          <Divider label="Content from .mdx" labelPosition="center" />
          <Space h={"lg"} />
          <div className="prose w-full max-w-none">
            <FirstContent />
          </div>
          <Space h={"lg"} />
          <Space h={"lg"} />
          <Divider label="Stats" labelPosition="center" />
          <Space h={"lg"} />
          <PostHeatmap data={postDates} />
        </div>

        <Space h={"lg"} />
        <Divider />
        <Space h={"lg"} />
      </Container>
    </>
  );
};

export default NotePage;
```

- [ ] **Step 2: Commit**

```bash
git add app/note/components/NotePage.tsx
git commit -m "feat: add PostHeatmap to NotePage stats section"
```

---

## Task 5: Test and Verify

**Files:**
- Test: Manual browser verification

- [ ] **Step 1: Run lint**

Run: `bun run lint`
Expected: No errors

- [ ] **Step 2: Run build**

Run: `bun run build`
Expected: Build successful

- [ ] **Step 3: Verify in browser**

Run: `bun run dev`
Navigate to /note
Verify:
- Stats section shows below MDX content
- Heatmap renders with orange cells
- Total posts count displayed
- Tooltip appears on hover with date and count

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: complete post frequency heatmap feature"
```

---

## Summary

| Task | Description |
|------|-------------|
| 1 | Install cal-heatmap dependency |
| 2 | Create PostHeatmap client component |
| 3 | Modify note/page.tsx to fetch posts and aggregate by date |
| 4 | Modify NotePage to render PostHeatmap |
| 5 | Test and verify |

Plan complete and saved to `docs/superpowers/plans/2026-04-26-post-frequency-heatmap-plan.md`.

Two execution options:

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

2. **Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?