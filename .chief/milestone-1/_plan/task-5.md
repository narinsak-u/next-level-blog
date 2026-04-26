# Task Spec: task-5

## Integrate AISummaryPopup into post page

### Steps

1. **Modify post page**
   
   Update `app/posts/[slug]/page.tsx`:
   ```tsx
   "use client";
   
   import { useState, useEffect, Suspense } from "react";
   import { useSearchParams } from "next/navigation";
   import { generateSummary } from "@/actions/generate-summary";
   import AISummaryPopup from "@/components/ai/AISummaryPopup";
   
   // Wrap existing page in client component
   function PostContent({ slug }: { slug: string }) {
     const [summaryState, setSummaryState] = useState<{
       isOpen: boolean;
       summary: string | null;
       isLoading: boolean;
       error: string | null;
     }>({
       isOpen: false,
       summary: null,
       isLoading: false,
       error: null,
     });
   
     const handleOpen = async () => {
       setSummaryState((prev) => ({ ...prev, isOpen: true, isLoading: true }));
   
       const result = await generateSummary(slug);
   
       setSummaryState((prev) => ({
         ...prev,
         isLoading: false,
         summary: result.success ? result.summary ?? null : null,
         error: result.success ? null : result.error ?? "Unknown error",
       }));
     };
   
     const handleClose = () => {
       setSummaryState((prev) => ({ ...prev, isOpen: false }));
     };
   
     const handleRetry = () => {
       handleOpen();
     };
   
     return (
       <>
         {/* Existing page content */}
         <Suspense fallback={<Loader />}>
           {recordMap ? <Content recordMap={recordMap} /> : null}
         </Suspense>
   
         {/* AI Summary Popup */}
         <AISummaryPopup
           isOpen={summaryState.isOpen}
           summary={summaryState.summary}
           isLoading={summaryState.isLoading}
           error={summaryState.error}
           onClose={handleClose}
           onRetry={handleRetry}
         />
       </>
     );
   }
   ```

2. **Alternative: Use query param approach**
   
   Simpler integration without managing state in page:
   
   ```tsx
   // In page.tsx, add as child component
   import AISummaryTrigger from "@/components/ai/AISummaryTrigger";
   
   // Then wrap with client component that reads query param
   function PostPageWithAI({ params }: Props) {
     return (
       <>
         <PostPageContent params={params} />
         <AISummaryTrigger slug={slug} />
       </>
     );
   }
   ```

3. **Add trigger button**
   
   In ScrollToTop, when on post page, add Sparkles button that calls `setAISummaryOpen(true)`:
   
   Pass `onAISummaryClick` prop to ScrollToTop from the post page.

4. **Simplest approach:**
   
   - Make ScrollToTop accept an `onMenuItemClick` callback
   - When Sparkles clicked, call that callback with "ai-summary"
   - Page component listens and manages popup state
   
   OR
   
   - Use URL query param `?ai-summary=1`
   - Client component checks `searchParams.get("ai-summary")`

### Verification
- Clicking Sparkles on post page opens popup
- Summary loads and displays correctly
- Error/retry works

### Dependencies
- task-2 (server action)
- task-3 (popup component)
- task-4 (trigger button)