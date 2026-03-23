# Blog Redesign — Glassmorphism + Orange Theme

## Context
The blog currently mixes Mantine components, inline styles, Tailwind utilities, and hardcoded color values inconsistently. Orange/amber variants differ between light and dark mode (`bg-orange-200`, `dark:bg-amber-900`, `hover:text-amber-900` which is near-invisible in dark). CSS property values are quoted strings that silently fail. Goal: minimal, modern, glassmorphism aesthetic — frosted glass cards over the video background, consistent orange-500 accent, JetBrains Mono typographic identity (uppercase + wide tracking on labels).

---

## Design Direction

- **Glassmorphism**: frosted glass surfaces (`backdrop-blur-md/2xl`, `bg-white/5–10`, `border border-white/10`)
- **Orange-500 accent**: `#F97316` used consistently for interactive elements, links, hover states
- **Typography**: JetBrains Mono identity — `uppercase tracking-widest` on labels/categories/footer
- **Video BG**: keep anime video background, improve text overlay
- **Dark mode gradient**: warm orange-900 ember tint at page bottom

---

## Files to Modify (in order)

1. `app/globals.css`
2. `components/layout/Logo.tsx`
3. `components/layout/Footer.tsx`
4. `components/layout/Header.tsx`
5. `components/ui/PostCard.tsx`
6. `components/home/ManifestoPanel.tsx`
7. `app/posts/components/PostsPageLayout.tsx`
8. `app/posts/components/TagsBanner.tsx`
9. `app/posts/components/contents/end-section.tsx`

---

## Step 1 — `app/globals.css`: Fix CSS string bugs + add tokens

**Fix 14 quoted string values** (browser ignores them silently):
```css
/* All lines like font-size: "16px" → fix to unquoted */
font-weight: 400;
font-size: 16px;
overflow-x: hidden;
/* code */  font-size: 14px;  padding: 4px;
/* ul */    margin-bottom: 16px;  padding-left: 24px;
/* li */    font-size: 16px;  margin-bottom: 4px;
/* p */     margin-bottom: 16px;
/* a */     cursor: pointer;  text-decoration: none;
/* blockquote */ margin: 10px;  padding: 0 15px;
```

**Add orange + glass design tokens** in `:root {}` after `--sidebar-ring`:
```css
/* Orange accent system */
--accent-orange: #F97316;
--accent-orange-muted: #EA580C;
--accent-orange-subtle: rgba(249, 115, 22, 0.12);
--accent-orange-border: rgba(249, 115, 22, 0.25);

/* Glass surface tokens */
--glass-bg: rgba(255, 255, 255, 0.06);
--glass-bg-hover: rgba(255, 255, 255, 0.10);
--glass-border: rgba(255, 255, 255, 0.10);
--glass-border-hover: rgba(255, 255, 255, 0.18);
```

**Refine dark mode body gradient** — replace `#4940375b` with orange-900 tint:
```css
[data-mantine-color-scheme="dark"] body {
  background: linear-gradient(
    to bottom,
    rgb(37, 38, 43) 60%,
    rgba(120, 53, 15, 0.22) 100%
  ) !important;
}
```

---

## Step 2 — `components/layout/Logo.tsx`: Remove Mantine Center, add aria-label

Remove `Center` from `@mantine/core`. Use Tailwind flex. Add `aria-label`. Apply orange hover + tracking-widest:
```tsx
"use client";
import Link from "next/link";
import { siteMetadata } from "@/site/siteMetadata";
import { RocketIcon } from "../icons/Icons";
import { cn } from "@/lib/utils";

const Logo = () => (
  <div className="flex justify-center mt-6 mb-4">
    <Link
      href="/"
      aria-label={`${siteMetadata.title} — Home`}
      className={cn(
        "inline-flex gap-2 items-center",
        "text-foreground/80 hover:text-orange-500 transition-colors duration-200",
        "text-sm font-semibold uppercase tracking-widest"
      )}
    >
      <span className="opacity-70"><RocketIcon /></span>
      {siteMetadata.title}
    </Link>
  </div>
);
export default Logo;
```

---

## Step 3 — `components/layout/Footer.tsx`: Full rewrite — minimal Tailwind only

Remove all Mantine `Text`/`Center`. Use semantic `<footer>`. No emojis. Consistent `hover:text-orange-500`:
```tsx
"use client";
import { siteMetadata } from "@/site/siteMetadata";
import { cn } from "@/lib/utils";

const Footer = () => (
  <footer className="py-8 px-4">
    <div className={cn(
      "flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3",
      "text-xs text-foreground/40 uppercase tracking-widest"
    )}>
      <span>{`© ${new Date().getFullYear()}`}</span>
      <span className="hidden sm:inline text-foreground/20">•</span>
      <a href={siteMetadata.github} target="_blank" rel="noopener noreferrer"
         className="hover:text-orange-500 transition-colors duration-200">
        {siteMetadata.title}
      </a>
      <span className="hidden sm:inline text-foreground/20">•</span>
      <div className="flex items-center gap-2">
        <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer"
           className="hover:text-orange-500 transition-colors duration-200">Next.js</a>
        <span className="text-foreground/20">+</span>
        <a href="https://mantine.dev/" target="_blank" rel="noopener noreferrer"
           className="hover:text-orange-500 transition-colors duration-200">Mantine</a>
        <span className="text-foreground/20">+</span>
        <a href="https://www.notion.com/" target="_blank" rel="noopener noreferrer"
           className="hover:text-orange-500 transition-colors duration-200">Notion</a>
      </div>
      <span className="hidden sm:inline text-foreground/20">•</span>
      <a href={siteMetadata.githubRepo} target="_blank" rel="noopener noreferrer"
         className="hover:text-orange-500 transition-colors duration-200">
        {siteMetadata.version}
      </a>
    </div>
  </footer>
);
export default Footer;
```

---

## Step 4 — `components/layout/Header.tsx`: Glass + orange left-border accent

Replace solid `bg-orange-400` fill with frosted glass + orange left border. Remove `"use client"`:
```tsx
import { cn } from "@/lib/utils";
type Props = { title: string };

const Header = ({ title }: Props) => (
  <div className={cn(
    "py-3 px-4 rounded-md",
    "bg-white/5 backdrop-blur-sm",
    "border border-white/10 border-l-2 border-l-orange-500",
    "text-xs sm:text-sm uppercase tracking-widest font-medium text-foreground/70"
  )}>
    {title}
  </div>
);
export default Header;
```

---

## Step 5 — `components/ui/PostCard.tsx`: Glass cards, fix amber-900 bugs, add a11y

### `TagItemInline` — fix dark mode pill (amber-900 → glass orange):
```tsx
className={cn(
  "inline-block px-2 py-0.5 text-xs rounded-full font-medium uppercase tracking-wide",
  "bg-orange-500/10 text-orange-500 border border-orange-500/20",
  "dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-400/25"
)}
```

### `PostCardGrid` — glass hover, fix Image, add aria-label:
- `<Link>` → add `aria-label={`Read post: ${post.title}`}`
- `<Image>` → add `width={400}`, `alt={`Cover image for ${post.title}`}`
- Remove `shadow="md"`, remove `hover:bg-orange-200 dark:hover:bg-neutral-700`
- New Card classes:
  ```
  "md:h-[420px] cursor-pointer"
  "bg-white/5 dark:bg-white/[0.04] backdrop-blur-md"
  "border border-white/10"
  "hover:bg-white/10 dark:hover:bg-white/[0.08] hover:border-orange-500/30 hover:-translate-y-2"
  "transition-all duration-300 ease-out shadow-none hover:shadow-lg hover:shadow-black/20"
  ```

### `PostCardList` — remove `dark:hover:text-amber-900` (invisible), use orange left-border:
- Remove `hover:underline hover:text-orange-400 dark:hover:text-amber-900`
- Add `aria-label` to `<Link>`
- New wrapper classes:
  ```
  "p-3 cursor-pointer rounded-md"
  "hover:bg-white/5 dark:hover:bg-white/[0.04]"
  "border-l-2 border-l-transparent hover:border-l-orange-500"
  "transition-all duration-200 ease-out"
  ```
- Date: add `text-xs uppercase tracking-wide text-foreground/50`

---

## Step 6 — `components/home/ManifestoPanel.tsx`: Deepen glass effect

In `ManifestoContent` `m.div` className (line ~155):

**Remove:** `bg-primary/20 backdrop-blur-xl border-2 border-border/50 ring-1 ring-offset-primary/10 ring-border/10 ring-offset-2 shadow-button`

**Replace with:**
```
bg-white/10 dark:bg-white/[0.08]
backdrop-blur-2xl
border border-white/15
ring-1 ring-orange-500/10
shadow-2xl shadow-black/30
```
Note: `bg-primary/20` resolves to near-black in `:root` (oklch 0.205) — switching to `bg-white/10` gives true frosted glass over the video.

---

## Step 7 — `app/posts/components/PostsPageLayout.tsx`: Remove Timeline, clean toggle

**Remove imports:** `Timeline` from `@mantine/core`, `Hash` from `tabler-icons-react`

Replace `<Timeline>` wrapping `TagSection` with:
```tsx
<div className="space-y-2">
  <p className="text-xs uppercase tracking-widest text-foreground/50">
    Choose your content
  </p>
  <TagSection tags={tags} categoryCount={categoryCount} />
</div>
```

Replace Divider + ActionIcon layout toggle with:
```tsx
<div className="flex items-center justify-end gap-2 my-2">
  <span className="text-xs uppercase tracking-widest text-foreground/50">Layout</span>
  <ActionIcon
    component="div" size="md" radius="sm" variant="subtle"
    className="bg-white/5 hover:bg-orange-500/15 border border-white/10 hover:border-orange-500/30 transition-all duration-200"
    onClick={() => toggle()}
    aria-label={isGrid ? "Switch to list layout" : "Switch to grid layout"}
  >
    {isGrid
      ? <LayoutGrid size={16} className="text-orange-500" />
      : <LayoutList size={16} className="text-orange-500" />
    }
  </ActionIcon>
</div>
<Divider my="xs" />
```

---

## Step 8 — `app/posts/components/TagsBanner.tsx`: Fix hover + replace Box with Link

Replace `<Box component="a">` + `onClick` with `<Link href>` for proper anchor semantics:
```tsx
import Link from "next/link";
// Remove: Box from @mantine/core, useRouter

{Object.entries(tags).map((tag, i) => (
  <Link
    key={i}
    href={`/tags/${tag[0]}`}
    className="cursor-pointer text-foreground/50 hover:text-orange-500 dark:hover:text-orange-400 font-medium text-xs leading-relaxed transition-colors duration-200"
  >
    {`#${tag[0]}(${tag[1]})`}
  </Link>
))}
```

---

## Step 9 — `app/posts/components/contents/end-section.tsx`: Fix invalid inline style

Replace `style={{ color: "orange", cursor: "pointer", "&:hover": {...} }}` (invalid pseudo-selector):
```tsx
<Text
  component="span"
  inherit
  onClick={() => { if (scroll.y > 0) scrollTo({ y: 0 }); }}
  className="text-orange-500 hover:text-orange-400 cursor-pointer transition-colors duration-200"
>
  Back to top ({`#${posts.length}`})
</Text>
```

---

## Web Guidelines Issues Fixed

| Issue | Location | Fix |
|-------|----------|-----|
| `dark:hover:text-amber-900` invisible in dark | `PostCard.tsx:91` | Removed → orange left-border |
| `Image` missing `width` prop | `PostCard.tsx:71` | Added `width={400}` |
| `<Link>` wrapping card, no `aria-label` | `PostCard.tsx:52,89` | Added `aria-label` |
| `<Box component="a">` with `onClick`, no `href` | `TagsBanner.tsx:17` | Replaced with `<Link href>` |
| Invalid `"&:hover"` in inline style | `end-section.tsx:29` | Replaced with Tailwind |
| Layout toggle icon button, no `aria-label` | `PostsPageLayout.tsx` | Added `aria-label` |
| CSS property values as strings (14 occurrences) | `globals.css:112–163` | All unquoted |

---

## Verification

1. `bun dev` — home page video BG + frosted ManifestoPanel looks glassy
2. `/posts` — glass grid cards lift on hover (no orange fill), list items show orange left border
3. Toggle grid/list — ActionIcon uses glass hover (no solid orange fill)
4. Click a tag in TagsBanner — navigates via `<Link>` (browser prefetch, correct back button)
5. Dark mode toggle — no invisible text on any hover state
6. Footer — no emoji, single-row minimal, orange hover on links
7. Header banner (on `/posts`, `/hobbies`, `/note`) — glass panel + orange left border
8. `bun build` — no TypeScript errors
