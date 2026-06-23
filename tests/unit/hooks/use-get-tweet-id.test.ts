import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import useGetTweetId from "@/app/posts/hooks/use-get-tweet-id";
import type { ExtendedRecordMap } from "notion-types";

function makeRecordMap(blocks: Record<string, unknown>): ExtendedRecordMap {
  return { block: blocks } as unknown as ExtendedRecordMap;
}

function makeTweetBlock(url: string) {
  return {
    value: {
      type: "tweet",
      properties: { source: [[url]] },
    },
  };
}

function makeParagraphBlock(text: string) {
  return {
    value: {
      type: "paragraph",
      properties: { title: [[text]] },
    },
  };
}

describe("useGetTweetId", () => {
  describe("TID-001: tweet extraction", () => {
    it("extracts tweet ID from a standard x.com URL", () => {
      const recordMap = makeRecordMap({
        b1: makeTweetBlock("https://x.com/user/status/1234567890"),
      });
      const { result } = renderHook(() => useGetTweetId({ recordMap }));
      expect(result.current.tweetId).toBe("1234567890");
    });

    it("extracts tweet ID from a twitter.com URL", () => {
      const recordMap = makeRecordMap({
        b1: makeTweetBlock("https://twitter.com/user/status/9876543210"),
      });
      const { result } = renderHook(() => useGetTweetId({ recordMap }));
      expect(result.current.tweetId).toBe("9876543210");
    });

    it("extracts numeric tweet ID with non-numeric chars in URL", () => {
      const recordMap = makeRecordMap({
        b1: makeTweetBlock("https://x.com/some_user/status/42"),
      });
      const { result } = renderHook(() => useGetTweetId({ recordMap }));
      expect(result.current.tweetId).toBe("42");
    });
  });

  describe("TID-002: returns null when no tweet block exists", () => {
    it("returns null when recordMap is empty", () => {
      const recordMap = makeRecordMap({});
      const { result } = renderHook(() => useGetTweetId({ recordMap }));
      expect(result.current.tweetId).toBeNull();
    });

    it("returns null when only non-tweet blocks exist", () => {
      const recordMap = makeRecordMap({
        b1: makeParagraphBlock("Just text"),
        b2: makeParagraphBlock("More text"),
      });
      const { result } = renderHook(() => useGetTweetId({ recordMap }));
      expect(result.current.tweetId).toBeNull();
    });
  });

  describe("TID-003: handles malformed tweet blocks", () => {
    it("returns null when tweet block has no source property", () => {
      const recordMap = makeRecordMap({
        b1: { value: { type: "tweet", properties: {} } },
      });
      const { result } = renderHook(() => useGetTweetId({ recordMap }));
      expect(result.current.tweetId).toBeNull();
    });

    it("returns null when source URL is missing", () => {
      const recordMap = makeRecordMap({
        b1: { value: { type: "tweet", properties: { source: [[]] } } },
      });
      const { result } = renderHook(() => useGetTweetId({ recordMap }));
      expect(result.current.tweetId).toBeNull();
    });
  });

  describe("TID-004: ignores non-tweet block types", () => {
    it("does not extract from image blocks even if they have a source URL", () => {
      const recordMap = makeRecordMap({
        b1: {
          value: {
            type: "image",
            properties: { source: [["https://x.com/user/status/111"]] },
          },
        },
      });
      const { result } = renderHook(() => useGetTweetId({ recordMap }));
      expect(result.current.tweetId).toBeNull();
    });

    it("finds the tweet among mixed block types", () => {
      const recordMap = makeRecordMap({
        b1: makeParagraphBlock("Intro"),
        b2: { value: { type: "image", properties: { source: [["https://x.com/user/status/999"]] } } },
        b3: makeTweetBlock("https://x.com/user/status/12345"),
        b4: makeParagraphBlock("Conclusion"),
      });
      const { result } = renderHook(() => useGetTweetId({ recordMap }));
      expect(result.current.tweetId).toBe("12345");
    });
  });
});
