import { describe, it, expect } from "vitest";
import { extractTextFromRecordMap } from "@/app/posts/helpers/extract-text-from-record-map";
import type { ExtendedRecordMap } from "notion-types";

function makeBlock(type: string, title: unknown) {
  return {
    value: {
      value: {
        type,
        properties: { title },
      },
    },
  };
}

function makeFlatBlock(type: string, title: unknown) {
  return {
    value: {
      type,
      properties: { title },
    },
  };
}

function makeRecordMap(blocks: Record<string, unknown>): ExtendedRecordMap {
  return { block: blocks } as unknown as ExtendedRecordMap;
}

describe("extractTextFromRecordMap", () => {
  describe("ETX-001: text block extraction", () => {
    it("extracts text from a paragraph block", () => {
      const recordMap = makeRecordMap({
        b1: makeBlock("paragraph", [["Hello world"]]),
      });
      expect(extractTextFromRecordMap(recordMap)).toBe("Hello world");
    });

    it("extracts text from heading_1", () => {
      const recordMap = makeRecordMap({
        b1: makeBlock("heading_1", [["My Heading"]]),
      });
      expect(extractTextFromRecordMap(recordMap)).toBe("My Heading");
    });

    it("extracts text from heading_2 and heading_3", () => {
      const recordMap = makeRecordMap({
        b1: makeBlock("heading_2", [["H2 Title"]]),
        b2: makeBlock("heading_3", [["H3 Title"]]),
      });
      const result = extractTextFromRecordMap(recordMap);
      expect(result).toContain("H2 Title");
      expect(result).toContain("H3 Title");
    });
  });

  describe("ETX-002: multiple blocks joined with newlines", () => {
    it("joins multiple paragraph blocks with newlines", () => {
      const recordMap = makeRecordMap({
        b1: makeBlock("paragraph", [["First"]]),
        b2: makeBlock("paragraph", [["Second"]]),
        b3: makeBlock("paragraph", [["Third"]]),
      });
      expect(extractTextFromRecordMap(recordMap)).toBe("First\nSecond\nThird");
    });
  });

  describe("ETX-003: ignores non-text block types", () => {
    it("skips image blocks", () => {
      const recordMap = makeRecordMap({
        b1: makeBlock("image", [["image-url"]]),
        b2: makeBlock("paragraph", [["Visible text"]]),
      });
      expect(extractTextFromRecordMap(recordMap)).toBe("Visible text");
    });

    it("skips divider blocks", () => {
      const recordMap = makeRecordMap({
        b1: makeBlock("divider", []),
        b2: makeBlock("paragraph", [["After divider"]]),
      });
      expect(extractTextFromRecordMap(recordMap)).toBe("After divider");
    });
  });

  describe("ETX-004: handles nested value wrappers", () => {
    it("resolves double value wrapper", () => {
      const recordMap = makeRecordMap({
        b1: makeBlock("paragraph", [["Nested text"]]),
      });
      expect(extractTextFromRecordMap(recordMap)).toBe("Nested text");
    });

    it("resolves flat value wrapper", () => {
      const recordMap = makeRecordMap({
        b1: makeFlatBlock("paragraph", [["Flat text"]]),
      });
      expect(extractTextFromRecordMap(recordMap)).toBe("Flat text");
    });
  });

  describe("ETX-005: handles malformed blocks gracefully", () => {
    it("returns valid text for null block wrapper", () => {
      const recordMap = makeRecordMap({
        b1: null,
        b2: makeBlock("paragraph", [["Real text"]]),
      });
      expect(extractTextFromRecordMap(recordMap)).toBe("Real text");
    });

    it("returns empty string when block has no title property", () => {
      const recordMap = makeRecordMap({
        b1: makeBlock("paragraph", null),
      });
      expect(extractTextFromRecordMap(recordMap)).toBe("");
    });

    it("returns empty string when title is not an array", () => {
      const recordMap = makeRecordMap({
        b1: { value: { value: { type: "paragraph", properties: { title: "string-not-array" } } } },
      });
      expect(extractTextFromRecordMap(recordMap)).toBe("");
    });
  });

  describe("ETX-006: rich text fragments", () => {
    it("concatenates text fragments in the same block", () => {
      const recordMap = makeRecordMap({
        b1: makeBlock("paragraph", [["Hello "], ["world"]]),
      });
      expect(extractTextFromRecordMap(recordMap)).toBe("Hello world");
    });

    it("strips leading and trailing newlines from fragments", () => {
      const recordMap = makeRecordMap({
        b1: makeBlock("paragraph", [["\nHello\n"], [" world\n"]]),
      });
      expect(extractTextFromRecordMap(recordMap)).toBe("Hello world");
    });
  });

  describe("ETX-007: edge cases", () => {
    it("returns empty string for empty recordMap", () => {
      const recordMap = makeRecordMap({});
      expect(extractTextFromRecordMap(recordMap)).toBe("");
    });

    it("returns empty string when no text-type blocks exist", () => {
      const recordMap = makeRecordMap({
        b1: makeBlock("image", [["url"]]),
        b2: makeBlock("divider", []),
      });
      expect(extractTextFromRecordMap(recordMap)).toBe("");
    });
  });
});
