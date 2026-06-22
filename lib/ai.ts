import { streamText } from "ai";
import { llm, getDefaultModel } from "@/lib/llm-provider";

const model = llm(getDefaultModel());

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
