# Task Spec: task-4

## Add AI Summary trigger to FloatingButtonGroup (post page only)

### Steps

1. **Modify FloatingButtonGroup**
   
   Update `@/components/ui/FloatingButton.tsx` to accept children or add menu items:
   
   Option A: Add new button directly in ScrollToTop
   
   Update `components/common/ScrollToTop.tsx`:
   ```tsx
   "use client";
   
   import { ArrowUpCircle, Feather, Books, Sparkles } from "tabler-icons-react";
   import { IconHome } from "@tabler/icons-react";
   import { siteMetadata } from "@/site/siteMetadata";
   import { FloatingButtonGroup } from "@/components/ui/FloatingButton";
   import { useRouter, usePathname } from "next/navigation";
   import { useState } from "react";
   
   const ScrollToTop = () => {
     const router = useRouter();
     const pathname = usePathname();
     const [isAISummaryOpen, setAISummaryOpen] = useState(false);
   
     const isPostPage = pathname.startsWith("/posts/") && pathname !== "/posts";
   
     return (
       <FloatingButtonGroup className="md:!right-6 lg:!right-14 md:!bottom-4">
         {isPostPage && (
           <FloatingButtonGroup.Button
             icon={Sparkles}
             onClick={() => setAISummaryOpen(true)}
             label="AI สรุป"
           />
         )}
         <FloatingButtonGroup.Button
           icon={ArrowUpCircle}
           onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
           label="Scroll to top"
         />
         <FloatingButtonGroup.Button
           icon={Books}
           onClick={() => router.push("/posts")}
           label="Go to posts"
         />
         <FloatingButtonGroup.Button
           icon={Feather}
           href={siteMetadata.feedbackUrl}
           external
           label="Give feedback"
         />
         <FloatingButtonGroup.Button
           icon={IconHome}
           onClick={() => router.push("/")}
           label="Go to home"
         />
       </FloatingButtonGroup>
     );
   };
   
   export default ScrollToTop;
   ```

2. **Use context or lift state up**
   
   Better approach: Lift state to page component. Update ScrollToTop to accept a prop:
   
   ```tsx
   // In FloatingButtonGroup, expose internal state
   // Or pass callback from parent
   
   interface ScrollToTopProps {
     onAISummaryClick?: () => void;
   }
   
   // Then in ScrollToTop, conditionally render the AI button
   {onAISummaryClick && (
     <FloatingButtonGroup.Button
       icon={Sparkles}
       onClick={onAISummaryClick}
       label="AI สรุป"
     />
   )}
   ```

3. **Simplified approach: Use query params**
   
   Instead of lifting state, use URL query param:
   ```tsx
   // In ScrollToTop, for post pages:
   onClick={() => router.push(`?ai-summary=true`, { scroll: false })}
   ```
   
   Then in page, check query param.

### Verification
- Button shows only on `/posts/[slug]` page
- Clicking triggers the action (or sets state)

### Dependencies
- task-3 (popup component)