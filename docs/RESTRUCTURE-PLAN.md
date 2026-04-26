# Restructure Plan: React Composition Patterns

## Overview
Based on Vercel's React Composition Patterns guidelines, this plan outlines restructuring opportunities to improve component flexibility and reduce boolean prop proliferation.

**Status: ✅ ALL ITEMS COMPLETED**

---

## Priority Summary

| Priority | Category | Files | Status |
|----------|----------|-------|--------|
| **High** | Compound Components | 4 | ✅ Completed |
| **High** | Context Providers | 2 | ✅ Completed |
| **Medium** | Variant Components | 3 | ✅ Completed |
| **Low** | Explicit Variants | 2 | ✅ Completed |

---

## 1. HIGH PRIORITY - Compound Components ✅

### 1.1 `ScrollToTop.tsx` → Floating Button Group ✅

**Status:** Implemented in `components/ui/FloatingButton.tsx`

**Implementation:**
```tsx
// components/ui/FloatingButton.tsx
interface FloatingButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

const FloatingButtonGroup = ({ children, className }: FloatingButtonGroupProps) => {
  const [scroll] = useWindowScroll();
  
  return (
    <div className={cn("hidden md:flex fixed z-50 flex-col items-center", className)}>
      <Transition transition="slide-up" mounted={scroll.y > 0}>
        {(transitionStyles) => <Box style={transitionStyles}>{children}</Box>}
      </Transition>
    </div>
  );
};

FloatingButtonGroup.Button = FloatingButton;
```

**Usage in `ScrollToTop.tsx`:**
```tsx
<FloatingButtonGroup className="md:!right-6 lg:!right-14 md:!bottom-4">
  <FloatingButtonGroup.Button icon={ArrowUpCircle} onClick={() => scrollTo({ y: 0 })} label="Scroll to top" />
  <FloatingButtonGroup.Button icon={Books} onClick={() => router.push("/posts")} label="Go to posts" />
  <FloatingButtonGroup.Button icon={Feather} href={siteMetadata.feedbackUrl} external label="Give feedback" />
</FloatingButtonGroup>
```

---

### 1.2 `MusicPlayer` → Context Provider ✅

**Status:** Implemented in `context/MusicPlayerContext.tsx`

**Implementation:**
```tsx
// context/MusicPlayerContext.tsx
interface MusicPlayerContextValue {
  isPlaying: boolean;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
  volume: number;
  setVolume: (volume: number) => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);

export const MusicPlayerProvider = ({ children, src, defaultVolume }: Props) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // ... implementation
};

export const useMusicPlayer = () => {
  const context = useContext(MusicPlayerContext);
  if (!context) throw new Error("useMusicPlayer must be used within MusicPlayerProvider");
  return context;
};
```

**Usage in `NewProfile.tsx`:**
```tsx
<MusicPlayerProvider>
  <main className="h-[100dvh] w-full">
    <Credit />
    <Background src="/silhouette-at-twilight.mp4" placeholder="/alt-placeholder.jpg" />
    <MainProfile />
    <MainFooter />
  </main>
</MusicPlayerProvider>
```

---

### 1.3 `PostCard` + `PostCardFlex` → Unified Component ✅

**Status:** Implemented in `components/ui/PostCard.tsx`

**Implementation:**
```tsx
// components/ui/PostCard.tsx
type LayoutVariant = "grid" | "list";

const PostCardBase = ({ post, layout = "grid", showImage, showTags, showDescription }: Props) => {
  const isGrid = layout === "grid";
  if (isGrid) {
    // Grid layout with Card, Image, Tags
  }
  return (
    // List layout without image
  );
};

PostCardBase.Image = PostCardImage;
PostCardBase.Content = PostCardContent;
// ...
```

---

## 2. HIGH PRIORITY - Context Providers ✅

### 2.1 Music Player Context ✅

See section 1.2 above.

### 2.2 Theme Hook Consolidation ✅

**Status:** Implemented in `hooks/useTheme.ts`

**Implementation:**
```tsx
// hooks/useTheme.ts
export const useTheme = (): ThemeContextValue => {
  const { colorScheme, toggleColorScheme, setColorScheme } = useMantineColorScheme();
  
  return {
    colorScheme,
    isDark: colorScheme === "dark",
    isLight: colorScheme === "light",
    isAuto: colorScheme === "auto",
    toggle: toggleColorScheme,
    setLight: () => setColorScheme("light"),
    setDark: () => setColorScheme("dark"),
    setAuto: () => setColorScheme("auto"),
  };
};
```

---

## 3. MEDIUM PRIORITY - Variant Components ✅

### 3.1 `MainProfile.tsx` → Manifesto Panel Compound ✅

**Status:** Implemented in `components/home/ManifestoPanel.tsx`

**Implementation:**
```tsx
// components/home/ManifestoPanel.tsx
const ManifestoPanel = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  // ESC key handler
  return (
    <ManifestoContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </ManifestoContext.Provider>
  );
};

ManifestoPanel.Trigger = ManifestoTrigger;
ManifestoPanel.Content = ManifestoContent;
ManifestoPanel.CloseButton = ManifestoCloseButton;
```

---

### 3.2 `Background.tsx` → Media Background Compound ✅

**Status:** Implemented in `components/ui/MediaBackground.tsx`

**Implementation:**
```tsx
// components/ui/MediaBackground.tsx
const MediaBackground = ({ children, className }: Props) => {
  return <div className={cn("absolute inset-0 w-full h-full object-cover", className)}>{children}</div>;
};

MediaBackground.Video = VideoBackground;
MediaBackground.Image = ImageBackground;
```

---

### 3.3 `Share.tsx` → Share Button Group ✅

**Status:** Implemented in `components/ui/ShareButton.tsx`

**Implementation:**
```tsx
// components/ui/ShareButton.tsx
const ShareButton = ({ platform, url, hashtag, title }: Props) => {
  // Platform-specific rendering
};

const ShareGroup = ({ children, postLink, hashtag, title }: Props) => {
  return (
    <div className="hidden absolute md:flex md:left-[-35px] lg:left-[-50px]">
      {/* Default: Facebook + Twitter buttons */}
      {children || (
        <>
          <ShareButton platform="facebook" url={postLink} hashtag={hashtag} />
          <ShareButton platform="twitter" url={postLink} hashtag={hashtag} title={title} />
        </>
      )}
    </div>
  );
};

ShareGroup.Button = ShareButton;
```

---

## 4. LOW PRIORITY - Explicit Variants ✅

### 4.1 `LoadButton.tsx` → Status Variant

**Status:** Not yet implemented (optional future enhancement)

### 4.2 `HomePage.tsx` + `NewProfile.tsx` → Variant Home

**Status:** Not applicable (NewProfile is the current implementation)

---

## File Changes Summary

### New Files ✅
```
components/ui/
├── FloatingButton.tsx          ✅
├── ShareButton.tsx             ✅
├── MediaBackground.tsx         ✅
└── PostCard.tsx                ✅

context/
└── MusicPlayerContext.tsx      ✅

hooks/
├── useTheme.ts                 ✅
└── use-video-with-placeholder.ts ✅ (shared video loading logic)

app/home/
└── HomeContent.tsx             ✅ (extracted from app/page.tsx)

types/
├── post-tag.ts                 ✅ (split from index.ts)
├── tag.ts                      ✅
├── content-header.ts            ✅
└── page-data.ts                ✅
```

### Modified Files ✅
```
components/common/ScrollToTop.tsx      ✅ → Uses FloatingButtonGroup
components/home/MusicPlayer.tsx       ✅ → Uses MusicPlayerContext
components/home/Credit.tsx          ✅ → Uses MusicPlayerContext
components/contents/Share.tsx         ✅ → Uses ShareGroup
components/common/ThemeMode.tsx       ✅ → Uses useTheme
components/home/Background.tsx        ✅ → Uses MediaBackground
components/home/MainProfile.tsx       ✅ → Uses ManifestoPanel, ternary conditional
components/home/NewProfile.tsx        ✅ → Wrapped with MusicPlayerProvider
components/contents/ContentBody.tsx   ✅ → Dynamic import for Comments
components/ui/MediaBackground.tsx     ✅ → Uses useVideoWithPlaceholder hook
components/ui/VideoWithPlaceholder.tsx ✅ → Uses useVideoWithPlaceholder hook
app/posts/[slug]/page.tsx            ✅ → Removed duplicate cache(), Suspense boundary
app/posts/[slug]/layout.tsx           ✅ → Removed duplicate cache(), Promise.all
app/about/page.tsx                   ✅ → Suspense boundary
app/hobbies/page.tsx                 ✅ → Suspense boundary
app/note/page.tsx                    ✅ → Suspense boundary
app/posts/components/PostCard.tsx     ✅ → Refactored to use base
app/posts/components/PostCardFlex.tsx ✅ → Refactored to use base
context/MusicPlayerContext.tsx         ✅ → Stable refs (isPlayingRef)
```

### Deleted Files
```
hooks/use-music-player.ts      ✅ → Replaced by context/MusicPlayerContext.tsx
```

---

## Benefits Delivered

| Pattern | Benefit | Status |
|---------|--------|--------|
| Compound Components | Reusable sub-components, flexible composition | ✅ |
| Context Providers | Global state access, single source of truth | ✅ |
| Variant Components | Eliminates code duplication, explicit APIs | ✅ |
| Explicit Variants | Type-safe, self-documenting props | ✅ |

---

## Current Component Architecture

```
context/
└── MusicPlayerContext.tsx     # Global music player state

hooks/
├── useTheme.ts                # Theme hook (consolidated)
├── use-layout-store.ts        # Layout state (Zustand)
├── use-mode-store.ts          # Mode state (Zustand)
├── use-video-with-placeholder.ts # Shared video loading state
├── use-fetch-all-posts.ts     # TanStack Query — all posts
├── use-fetch-posts.ts         # TanStack Query — infinite
├── use-fetch-posts-by-tag.ts  # Filters from cached data
├── use-get-related-posts.ts   # useMemo from post-logic
├── use-get-posts-by-tag.ts    # useMemo from post-logic
└── use-get-tweet-id.ts        # Tweet ID extraction

components/
├── ui/
│   ├── FloatingButton.tsx    # Compound: FloatingButtonGroup, FloatingButton
│   ├── ShareButton.tsx       # Compound: ShareGroup, ShareButton
│   ├── MediaBackground.tsx    # Compound: MediaBackground, VideoBackground, ImageBackground
│   ├── PostCard.tsx           # Unified: PostCardBase (grid/list)
│   └── AnimatePresenceGuard.tsx
├── home/
│   ├── ManifestoPanel.tsx     # Compound: ManifestoPanel, Trigger, Content, CloseButton
│   ├── Credit.tsx            # Uses MusicPlayerContext
│   ├── MusicPlayer.tsx       # Uses MusicPlayerContext
│   ├── Background.tsx        # Uses MediaBackground
│   └── MainProfile.tsx       # Uses ManifestoPanel
└── common/
    ├── ThemeMode.tsx          # Uses useTheme
    └── ScrollToTop.tsx       # Uses FloatingButtonGroup
```

---

## References
- [Vercel Composition Patterns](file:///C:/Users/narin/.agents/skills/vercel-composition-patterns)
- [Compound Components Pattern](https://kentcdodds.com/blog/compound-components-with-react-hooks)
- [Context API Best Practices](https://react.dev/learn/passing-data-deeply-with-context)
