# Task Spec: task-2

## Create generateSummary server action with KV caching

### Steps

1. **Create server action**
   
   Create `@/actions/generate-summary.ts`:
   ```typescript
   "use server";
   
   import { fetchPostContent } from "@/actions/posts";
   import { generateTextFromPrompt } from "@/lib/ai";
   import { kv } from "@vercel/kv";
   
   const SUMMARY_CACHE_TTL = 604800; // 7 days
   
   export async function generateSummary(slug: string): Promise<{
     success: boolean;
     summary?: string;
     error?: string;
   }> {
     const cacheKey = `summary:${slug}`;
     
     try {
       // 1. Check cache
       const cached = await kv.get<string>(cacheKey);
       if (cached) {
         return { success: true, summary: cached };
       }
       
       // 2. Fetch post content
       const recordMap = await fetchPostContent(slug);
       if (!recordMap) {
         return { success: false, error: "Post not found" };
       }
       
       // 3. Extract text from Notion blocks
       const textContent = extractTextFromRecordMap(recordMap);
       if (!textContent.trim()) {
         return { success: false, error: "No content to summarize" };
       }
       
       // 4. Generate summary
       const prompt = `Summarize the following article in 1-3 paragraphs in Thai:\n\n${textContent}`;
       const summary = await generateTextFromPrompt(prompt);
       
       // 5. Cache result
       await kv.set(cacheKey, summary, { ex: SUMMARY_CACHE_TTL });
       
       return { success: true, summary };
     } catch (error) {
       console.error("generateSummary error:", error);
       return { success: false, error: "Failed to generate summary" };
     }
   }
   ```

2. **Implement text extraction**
   
   Create helper to extract text from Notion blocks:
   ```typescript
   function extractTextFromRecordMap(recordMap: any): string {
     // Extract text from blocks
     // Handle paragraph, heading, bulleted_list, numbered_list, quote, code, etc.
     // Return concatenated text
   }
   ```

3. **Add KV to package.json if needed**
   
   Already has `@vercel/kv` in dependencies (package.json line 35).

### Verification
- Server action works when called with valid slug
- Error handling works for invalid slug, empty content, API failures

### Dependencies
- task-1