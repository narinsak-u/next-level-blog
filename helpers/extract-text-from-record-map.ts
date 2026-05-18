import type { ExtendedRecordMap } from "notion-types";

export function extractTextFromRecordMap(recordMap: ExtendedRecordMap): string {
  const blocks = recordMap.block;
  const blockIds = Object.keys(blocks);
  const textParts: string[] = [];

  for (const blockId of blockIds) {
    const blockWrapper = blocks[blockId];
    if (!blockWrapper) continue;

    let blockValue: unknown;

    const wrapperValue = (blockWrapper as { value?: unknown }).value;
    if (!wrapperValue) continue;

    if (
      typeof wrapperValue === "object" &&
      wrapperValue !== null &&
      "value" in wrapperValue
    ) {
      blockValue = (wrapperValue as { value: unknown }).value;
    } else {
      blockValue = wrapperValue;
    }

    if (!blockValue || typeof blockValue !== "object") continue;

    const block = blockValue as {
      type?: string;
      properties?: Record<string, unknown[]>;
      [key: string]: unknown;
    };

    const blockType = block.type;
    let text = "";

    switch (blockType) {
      case "text":
      case "paragraph":
      case "heading_1":
      case "heading_2":
      case "heading_3": {
        const titleProp = block.properties?.title;
        if (titleProp && Array.isArray(titleProp)) {
          text = titleProp
            .flat()
            .map((t) => String(t).replace(/^\n/, "").replace(/\n$/, ""))
            .join("")
            .trim();
        }
        break;
      }

      case "bulleted_list": {
        const bulletedTitle = block.properties?.title;
        if (bulletedTitle && Array.isArray(bulletedTitle)) {
          text = bulletedTitle
            .flat()
            .map((t) => String(t).replace(/^\n/, "").replace(/\n$/, ""))
            .join("")
            .trim();
        }
        break;
      }

      case "numbered_list": {
        const numberedTitle = block.properties?.title;
        if (numberedTitle && Array.isArray(numberedTitle)) {
          text = numberedTitle
            .flat()
            .map((t) => String(t).replace(/^\n/, "").replace(/\n$/, ""))
            .join("")
            .trim();
        }
        break;
      }

      case "quote": {
        const quoteTitle = block.properties?.title;
        if (quoteTitle && Array.isArray(quoteTitle)) {
          text = quoteTitle
            .flat()
            .map((t) => String(t).replace(/^\n/, "").replace(/\n$/, ""))
            .join("")
            .trim();
        }
        break;
      }

      case "callout": {
        const calloutTitle = block.properties?.title;
        if (calloutTitle && Array.isArray(calloutTitle)) {
          text = calloutTitle
            .flat()
            .map((t) => String(t).replace(/^\n/, "").replace(/\n$/, ""))
            .join("")
            .trim();
        }
        break;
      }

      case "page":
      case "collection_view_page":
      case "image":
      case "bulleted_list_item":
      case "numbered_list_item":
      case "code":
      case "toggle":
      case "collection_view":
      case undefined:
      default:
        break;
    }

    if (text) {
      textParts.push(text);
    }
  }

  return textParts.join("\n");
}
