import type { ExtendedRecordMap } from "notion-types";

const TEXT_BLOCK_TYPES = new Set([
  "text",
  "paragraph",
  "heading_1",
  "heading_2",
  "heading_3",
  "bulleted_list",
  "numbered_list",
  "quote",
  "callout",
]);

function extractBlockText(block: {
  properties?: Record<string, unknown[]>;
  type?: string;
}): string {
  const titleProp = block.properties?.title;
  if (!titleProp || !Array.isArray(titleProp)) return "";

  return titleProp
    .flat()
    .map((t) => String(t).replace(/^\n|\n$/g, ""))
    .join("")
    .trim();
}

function resolveBlockValue(blockWrapper: unknown): unknown {
  const wrapperValue = (blockWrapper as { value?: unknown }).value;
  if (!wrapperValue) return null;

  if (
    typeof wrapperValue === "object" &&
    wrapperValue !== null &&
    "value" in wrapperValue
  ) {
    return (wrapperValue as { value: unknown }).value;
  }

  return wrapperValue;
}

export function extractTextFromRecordMap(recordMap: ExtendedRecordMap): string {
  const textParts: string[] = [];

  for (const blockWrapper of Object.values(recordMap.block)) {
    if (!blockWrapper) continue;

    const blockValue = resolveBlockValue(blockWrapper);
    if (!blockValue || typeof blockValue !== "object") continue;

    const block = blockValue as {
      type?: string;
      properties?: Record<string, unknown[]>;
      [key: string]: unknown;
    };

    if (block.type && TEXT_BLOCK_TYPES.has(block.type)) {
      const text = extractBlockText(block);
      if (text) textParts.push(text);
    }
  }

  return textParts.join("\n");
}
