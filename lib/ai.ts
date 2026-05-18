import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

const model = openai("gpt-4o-mini");

export async function streamPrompt(
  prompt: string,
  onChunk?: (text: string) => void,
): Promise<string> {
  let fullText = "";

  const result = streamText({
    model,
    prompt,
  });

  for await (const chunk of result.textStream) {
    fullText += chunk;
    if (onChunk) {
      onChunk(chunk);
    }
  }

  return fullText;
}
