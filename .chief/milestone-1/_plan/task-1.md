# Task Spec: task-1

## Install AI SDK and configure OpenAI provider

### Steps

1. **Install AI SDK**
   ```bash
   bun add ai
   ```

2. **Install OpenAI provider**
   ```bash
   bun add @openai/ai
   ```

3. **Configure OpenAI provider**
   
   Create or update `@/lib/ai.ts`:
   ```typescript
   import { generateText } from "ai";
   import { openai } from "@openai/ai";
   
   const model = openai("gpt-4o-mini");
   
   export async function generateTextFromPrompt(prompt: string) {
     const result = await generateText({
       model,
       prompt,
     });
     return result.text;
   }
   ```

4. **Add environment variables**
   
   Add to `.env.local`:
   ```
   OPENAI_API_KEY=your-openai-api-key
   ```

5. **Add to .env.example**
   
   Document the required env var.

### Verification
- `bun run build` succeeds
- No lint errors

### Dependencies
- None