import { useMemo } from "react";
import { ExtendedRecordMap } from "notion-types";

type Props = {
  recordMap: ExtendedRecordMap;
};

const useGetTweetId = ({ recordMap }: Props) => {
  const tweetId = useMemo(() => {
    try {
      const tweetBlock = Object.values(recordMap.block).filter(
        (b) => "type" in b.value && (b.value as { type?: string }).type === "tweet"
      );

      if (!tweetBlock?.length) return null;

      const block = tweetBlock[0]?.value as { properties?: { source?: string[][] } };
      const url = block?.properties?.source?.[0]?.[0] as string | undefined;
      if (!url) return null;

      const str = url.split("/");
      const id = str[str.length - 1];

      return id;
    } catch (error) {
      console.error("Error extracting tweet ID:", error);
      return null;
    }
  }, [recordMap]);

  return { tweetId };
};

export default useGetTweetId;
