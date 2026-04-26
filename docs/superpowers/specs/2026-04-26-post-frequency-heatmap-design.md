# Post Frequency Heatmap - Design Specification

## Overview

Add a stats section to the Note page displaying a time-series calendar heatmap showing post frequency using Cal-Heatmap library with orange theme.

## Goals

- Display post creation frequency from Notion in a GitHub-style heatmap
- Use orange color scheme matching app theme
- Show total post count summary
- Interactive tooltips on hover

## Data Source

- **Notion Property**: `created_time` (post creation date)
- **Aggregation**: Group posts by date → `{ "YYYY-MM-DD": count }`
- **Date Range**: All-time, organized by month (January → December)

## Visual Design

### Color Scheme
- **Theme**: Orange (matching app)
- **Scale**: Light orange (no posts) → Dark orange (high activity)
- **Implementation**: Cal-Heatmap's color range with orange hex values

### Layout
- **Cell Size**: Small
- **Orientation**: Months on top (Jan-Dec), days on left (Mon-Sun)
- **Tooltip**: Show "MMM DD, YYYY: N post(s)" on hover

### Summary
- Total post count displayed above heatmap (e.g., "Total Posts: 42")

## Component Design

### New Component: `PostHeatmap`
- **Location**: `app/note/components/PostHeatmap.tsx`
- **Type**: Client component ("use client")
- **Props**: `data: Record<string, number>` (date → post count)

### Props Interface
```typescript
interface PostHeatmapProps {
  data: Record<string, number>;
}
```

### Dependencies
- `cal-heatmap` - main library
- `cal-heatmap/plugins/Tooltip` - for hover tooltips
- `cal-heatmap/cal-heatmap.css` - base styles

## Data Flow

1. **Server-side** (`app/note/page.tsx`): Fetch all posts from Notion
2. **Transform**: Extract `created_time`, aggregate by date
3. **Pass to client**: Pass date counts to `NotePage` → `PostHeatmap`
4. **Render**: Client component renders Cal-Heatmap

## Implementation Details

### Server-Side (note/page.tsx)
```typescript
// Fetch posts, extract created_time, aggregate by date
const posts = await getPosts();
const postDates = posts.reduce((acc, post) => {
  const date = post.created_time.split('T')[0];
  acc[date] = (acc[date] || 0) + 1;
  return acc;
}, {} as Record<string, number>);
```

### Client Component (PostHeatmap.tsx)
- Import CalHeatmap and Tooltip plugin
- Use `useEffect` to initialize heatmap after mount
- Configure: domain (year), subDomain (day), color scale (orange)
- Handle loading with existing `Loader` component

### Loading State
- Show `Loader` (orange Mantine dots) while data loads

### Edge Cases
- **No posts**: Show message "No posts yet"
- **Single post**: Render normally with one highlighted cell

## Acceptance Criteria

1. Heatmap displays post frequency by date from Notion created_time
2. Orange color scheme matches app theme
3. Tooltip shows date and post count on hover
4. Total post count displayed above heatmap
5. Small cell size
6. Loading state shows Loader component
7. Works with all-time data (Jan-Dec)
8. Responsive within container

## File Changes

1. **Create**: `app/note/components/PostHeatmap.tsx`
2. **Modify**: `app/note/page.tsx` - fetch and transform post dates
3. **Modify**: `app/note/components/NotePage.tsx` - import and render PostHeatmap

## Ideal image
- URL: https://i.postimg.cc/SKWG8g8s/Screenshot-2026-04-26-013049.png