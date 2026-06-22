import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const providerName = (process.env.PROVIDER_NAME ?? "openrouter").toLowerCase();

const config =
  providerName === "opencode"
    ? {
        name: "opencode",
        baseURL: "https://opencode.ai/zen/go/v1",
        apiKey: process.env.OPENCODE_API_KEY,
      }
    : {
        name: "openrouter",
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
      };

export const llm = createOpenAICompatible({
  name: config.name,
  baseURL: config.baseURL,
  apiKey: config.apiKey,
});

export function getDefaultModel(): string {
  return providerName === "opencode"
    ? (process.env.OPENCODE_LLM_MODEL ?? "deepseek-v4-flash")
    : (process.env.OPENROUTER_LLM_MODEL ?? "google/gemma-3-27b-it:free");
}
