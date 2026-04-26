"use client";

import { useState, useRef, useEffect } from "react";
import { extractTextFromRecordMap } from "@/helpers/extract-text-from-record-map";
import { AISummaryPopup } from "@/components/ai/AISummaryPopup";
import Content from "@/components/contents/Content";
import ScrollToTop from "@/components/common/ScrollToTop";
import { ExtendedRecordMap } from "notion-types";

interface PostPageClientProps {
  recordMap: ExtendedRecordMap;
  slug: string;
}

const CACHE_TTL_DAYS = 15;

function getCacheKey(slug: string) {
  return `ai-summary:${slug}`;
}

function getCachedSummary(slug: string): string | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(getCacheKey(slug));
    if (!raw) return null;

    const { text, timestamp } = JSON.parse(raw);
    const age = Date.now() - timestamp;
    const maxAge = CACHE_TTL_DAYS * 24 * 60 * 60 * 1000;

    if (age > maxAge) {
      localStorage.removeItem(getCacheKey(slug));
      return null;
    }

    return text;
  } catch {
    return null;
  }
}

function saveSummaryToCache(slug: string, text: string): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      getCacheKey(slug),
      JSON.stringify({ text, timestamp: Date.now() }),
    );
  } catch {
    // Storage full or unavailable
  }
}

export default function PostPageClient({
  recordMap,
  slug,
}: PostPageClientProps) {
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentSummaryRef = useRef<string>("");
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

  useEffect(() => {
    const cached = getCachedSummary(slug);
    if (cached) {
      currentSummaryRef.current = cached;
      setSummaryState((prev) => ({ ...prev, summary: cached }));
    }
  }, [slug]);

  const handleOpenAI = async () => {
    if (summaryState.isLoading) return;

    const cached = getCachedSummary(slug);
    if (cached) {
      currentSummaryRef.current = cached;
      setSummaryState((prev) => ({
        ...prev,
        summary: cached,
        isOpen: true,
        isLoading: false,
        error: null,
      }));
      return;
    }

    abortControllerRef.current = new AbortController();
    const textContent = extractTextFromRecordMap(recordMap);

    if (!textContent.trim()) {
      setSummaryState((prev) => ({
        ...prev,
        isOpen: true,
        isLoading: false,
        error: "No content to summarize",
      }));
      return;
    }

    currentSummaryRef.current = "";
    setSummaryState((prev) => ({
      ...prev,
      isOpen: true,
      summary: "",
      isLoading: true,
      error: null,
    }));

    try {
      const response = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Summarize the following article in 1-3 paragraphs in Thai:\n\n${textContent}`,
        }),
        signal: abortControllerRef.current.signal,
      });

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
              currentSummaryRef.current += parsed.text;
              setSummaryState((prev) => ({
                ...prev,
                summary: currentSummaryRef.current,
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
      setSummaryState((prev) => ({
        ...prev,
        error: err.message || "Failed to generate summary",
      }));
    } finally {
      setSummaryState((prev) => ({ ...prev, isLoading: false }));

      if (currentSummaryRef.current) {
        saveSummaryToCache(slug, currentSummaryRef.current);
      }
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
