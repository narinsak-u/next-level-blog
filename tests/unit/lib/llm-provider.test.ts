import { describe, it, expect, vi, beforeEach } from "vitest";

const ORIGINAL_ENV = { ...process.env };

beforeEach(() => {
  vi.resetModules();
  process.env = { ...ORIGINAL_ENV };
});

describe("getDefaultModel()", () => {
  it("LP-001: returns OpenRouter model when PROVIDER_NAME is unset", async () => {
    delete process.env.PROVIDER_NAME;
    process.env.OPENROUTER_LLM_MODEL = "google/gemma-3-27b-it:free";
    const { getDefaultModel } = await import("@/lib/llm-provider");
    expect(getDefaultModel()).toBe("google/gemma-3-27b-it:free");
  });

  it("LP-002: returns OpenCode model when PROVIDER_NAME=opencode", async () => {
    process.env.PROVIDER_NAME = "opencode";
    process.env.OPENCODE_LLM_MODEL = "deepseek-v4-flash";
    const { getDefaultModel } = await import("@/lib/llm-provider");
    expect(getDefaultModel()).toBe("deepseek-v4-flash");
  });

  it("LP-003: falls back to default model when env vars are not set", async () => {
    delete process.env.PROVIDER_NAME;
    delete process.env.OPENROUTER_LLM_MODEL;
    const { getDefaultModel } = await import("@/lib/llm-provider");
    expect(getDefaultModel()).toBe("google/gemma-3-27b-it:free");
  });
});
