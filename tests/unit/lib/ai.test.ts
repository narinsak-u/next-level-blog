import { describe, it, expect, vi, beforeEach } from "vitest";

const mockStreamText = vi.fn();

vi.mock("ai", () => ({
  streamText: mockStreamText,
}));

vi.mock("@/lib/llm-provider", () => ({
  llm: vi.fn(),
  getDefaultModel: () => "test-model",
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("streamPrompt()", () => {
  it("AI-001: returns concatenated text from stream", async () => {
    const chunks = ["Hello", " ", "World", "!"];
    mockStreamText.mockReturnValue({
      textStream: (async function* () {
        for (const c of chunks) yield c;
      })(),
    });

    const { streamPrompt } = await import("@/lib/ai");
    const result = await streamPrompt("test prompt");
    expect(result).toBe("Hello World!");
  });

  it("AI-002: calls onChunk callback for each chunk", async () => {
    const chunks = ["foo", "bar"];
    mockStreamText.mockReturnValue({
      textStream: (async function* () {
        for (const c of chunks) yield c;
      })(),
    });

    const onChunk = vi.fn();
    const { streamPrompt } = await import("@/lib/ai");
    await streamPrompt("test prompt", onChunk);
    expect(onChunk).toHaveBeenCalledTimes(2);
    expect(onChunk).toHaveBeenNthCalledWith(1, "foo");
    expect(onChunk).toHaveBeenNthCalledWith(2, "bar");
  });

  it("AI-003: handles empty stream gracefully", async () => {
    mockStreamText.mockReturnValue({
      textStream: (async function* () {})(),
    });

    const { streamPrompt } = await import("@/lib/ai");
    const result = await streamPrompt("test prompt");
    expect(result).toBe("");
  });
});
