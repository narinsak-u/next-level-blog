"use client";

import { useState, useRef } from "react";
import { extractTextFromRecordMap } from "@/helpers/extract-text-from-record-map";
import { AISummaryPopup } from "@/components/ai/AISummaryPopup";
import Content from "@/components/contents/Content";
import ScrollToTop from "@/components/common/ScrollToTop";
import { ExtendedRecordMap } from "notion-types";

interface PostPageClientProps {
  recordMap: ExtendedRecordMap;
}

export default function PostPageClient({ recordMap }: PostPageClientProps) {
  const abortControllerRef = useRef<AbortController | null>(null);
  const [summaryState, setSummaryState] = useState<{
    isOpen: boolean;
    summary: string;
    isLoading: boolean;
    error: string | null;
  }>({
    isOpen: false,
    summary: "",
    isLoading: false,
    error: null,
  });

  const handleOpenAI = async () => {
    if (summaryState.isLoading) return;

    abortControllerRef.current = new AbortController();
    const textContent = extractTextFromRecordMap(recordMap);
    console.log("Extracted text length:", textContent.length);

    if (!textContent.trim()) {
      setSummaryState((prev) => ({
        ...prev,
        isOpen: true,
        isLoading: false,
        error: "No content to summarize",
      }));
      return;
    }

    setSummaryState((prev) => ({
      ...prev,
      isOpen: true,
      summary: "",
      isLoading: true,
      error: null,
    }));

    try {
      console.log("Fetching /api/ai-summary...");
      const response = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Summarize the following article in 1-3 paragraphs in Thai:\n\n${textContent}`,
        }),
        signal: abortControllerRef.current.signal,
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed: ${response.status} - ${errText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No reader");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              setSummaryState((prev) => ({
                ...prev,
                summary: prev.summary + parsed.text,
              }));
            } catch {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      const err = error as Error;
      if (err.name === "AbortError") return;
      console.error("Streaming error:", err);
      setSummaryState((prev) => ({
        ...prev,
        error: err.message || "Failed to generate summary",
      }));
    } finally {
      setSummaryState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleClose = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setSummaryState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleRetry = () => {
    handleOpenAI();
  };

  return (
    <>
      <Content recordMap={recordMap} />
      <AISummaryPopup
        isOpen={summaryState.isOpen}
        summary={summaryState.summary}
        isLoading={summaryState.isLoading}
        error={summaryState.error}
        onClose={handleClose}
        onRetry={handleRetry}
      />
      <ScrollToTop onAISummaryClick={handleOpenAI} />
    </>
  );
}
