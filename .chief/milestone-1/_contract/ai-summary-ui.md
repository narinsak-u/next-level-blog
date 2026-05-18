# Contract: AI Summary UI

## Component: AISummaryPopup

### Props
```typescript
{
  isOpen: boolean;
  summary: string | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onRetry: () => void;
}
```

### Visual Design
- **Position:** Fixed, bottom-right, 16px from edges
- **Width:** max-width 400px, full width on mobile (<640px)
- **Background:** `--color-bg-secondary` (or Mantine secondary bg)
- **Border radius:** 12px
- **Shadow:** Elevated shadow (Mantine default)
- **Padding:** 16px

### Internal Layout
1. **Header:**
   - Title: "AI สรุปบทความ" (AI Summary)
   - Close button (X icon), right-aligned

2. **Content:**
   - Loading: Spinner/typing indicator centered
   - Error: Error message + Retry button
   - Success: Summary text in Thai (1-3 paragraphs)

3. **Footer:** None

### Interactions
- **Open animation:** Fade in + slide up (200ms ease-out)
- **Close animation:** Fade out + slide down (150ms ease-in)
- **Close on:** Click outside, X button click
- **Retry:** Re-triggers server action

### Responsive
- Mobile (<640px): Full width, bottom 0, fixed
- Desktop (≥640px): Fixed bottom-right as specified

## Component: FloatingButtonGroup

### Modification
Add new menu item to FloatingButtonGroup:

```typescript
{
  icon: Sparkles;  // AI icon
  onClick: () => setAISummaryOpen(true);
  label: "AI สรุป";
}
```

### Visibility
- Display only on `/posts/[slug]` routes
- Use `usePathname` to check route

## State Management
- Use React useState in page component
- OR use Zustand store if preferred