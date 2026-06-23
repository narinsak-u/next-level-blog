import type { ExtendedRecordMap } from "notion-types";

export function createMockRecordMap(
  blocks: Array<{ id: string; type: string; text: string }>,
): ExtendedRecordMap {
  const block: Record<string, unknown> = {};
  for (const b of blocks) {
    block[b.id] = {
      value: {
        type: b.type,
        properties: {
          title: [[b.text]],
        },
      },
    };
  }
  return { block } as unknown as ExtendedRecordMap;
}

export const paragraphBlock = {
  id: "block1",
  type: "paragraph",
  text: "Hello world",
};

export const heading1Block = {
  id: "block2",
  type: "heading_1",
  text: "Heading 1 Title",
};

export const heading2Block = {
  id: "block3",
  type: "heading_2",
  text: "Heading 2 Title",
};

export const heading3Block = {
  id: "block4",
  type: "heading_3",
  text: "Heading 3 Title",
};

export const bulletedListBlock = {
  id: "block5",
  type: "bulleted_list",
  text: "List item",
};

export const numberedListBlock = {
  id: "block6",
  type: "numbered_list",
  text: "Numbered item",
};

export const quoteBlock = {
  id: "block7",
  type: "quote",
  text: "Quote text",
};

export const calloutBlock = {
  id: "block8",
  type: "callout",
  text: "Callout text",
};

export const codeBlock = {
  id: "block9",
  type: "code",
  text: "console.log('hi')",
};

export const imageBlock = {
  id: "block10",
  type: "image",
  text: "image caption",
};

export const mixedRecordMap = createMockRecordMap([
  paragraphBlock,
  heading1Block,
  heading2Block,
  heading3Block,
  bulletedListBlock,
  numberedListBlock,
  quoteBlock,
  calloutBlock,
  codeBlock,
  imageBlock,
]);

export const allSupportedRecordMap = createMockRecordMap([
  paragraphBlock,
  heading1Block,
  heading2Block,
  heading3Block,
  bulletedListBlock,
  numberedListBlock,
  quoteBlock,
  calloutBlock,
]);
