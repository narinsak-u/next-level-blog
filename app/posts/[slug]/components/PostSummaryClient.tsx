"use client";

import { useEffect, useRef, useState } from "react";
import { extractTextFromRecordMap } from "@/app/posts/helpers/extract-text-from-record-map";
import { AISummaryPopup } from "@/app/posts/components/AISummaryPopup";
import ScrollToTop from "@/components/common/ScrollToTop";
import type { ExtendedRecordMap } from "notion-types";

interface PostSummaryClientProps {
  recordMap: ExtendedRecordMap;
  slug: string;
}

const CACHE_TTL_DAYS = 15;

function getCacheKey(slug: string) {
  return `ai-summary:${slug}`;
}

const SUMMARY_SYSTEM_PROMPT = `คุณคือนักวิเคราะห์เนื้อหาที่เชี่ยวชาญ อ่านบทความต่อไปนี้แล้วสรุปเป็นภาษาไทยในรูปแบบที่ช่วยให้ผู้อ่านเข้าใจภาพรวมและได้ข้อคิดเชิงลึก

โครงสร้างที่ต้องการ:
1) **แก่นสาระสำคัญ** — ประเด็นหลักของบทความคืออะไร เขียนแบบกระชับ 1-2 ประโยค
2) **ประเด็นสำคัญที่ควรรู้** — bullet points 2-3 ข้อ ครอบคลุมแนวคิด ข้อเท็จจริง ตัวอย่าง หรือบทเรียนที่ผู้เขียนถ่ายทอด
3) **ข้อคิดเชิงลึก** — สิ่งที่ผู้อ่านควรนำไปใช้หรือคิดต่อ 1-2 ประโยค

กฎ:
- เขียนเป็นภาษาไทยที่อ่านง่าย เป็นธรรมชาติ ไม่แปลตรงๆ
- ไม่ต้องเกริ่นนำ ไม่ต้องสรุปท้าย เข้าเนื้อหาเลย
- ข้ามส่วนที่ไม่เกี่ยวข้อง (เช่น ลิงก์ โฆษณา ส่วนนำทาง)
- หากเนื้อหาไม่เพียงพอ ให้ตอบสั้นๆ ว่าไม่สามารถสรุปได้

สำคัญ: สรุปไม่ควรเกิน 200 คำ

เนื้อหาบทความ:
"""
CONTENT_PLACEHOLDER
"""`;

function buildSummaryPrompt(textContent: string) {
  return SUMMARY_SYSTEM_PROMPT.replace("CONTENT_PLACEHOLDER", textContent);
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

export default function PostSummaryClient({
  recordMap,
  slug,
}: PostSummaryClientProps) {
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
          prompt: buildSummaryPrompt(textContent),
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        let errorMessage = `Error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // Fallback to text if not JSON
          const text = await response.text();
          if (text) errorMessage = text;
        }
        throw new Error(errorMessage);
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
      setSummaryState((prev) => {
        // If loading finished but we have no summary and no error,
        // it means the stream ended prematurely without content.
        const error =
          !prev.summary && !prev.error
            ? "ไม่สามารถสร้างสรุปได้ในขณะนี้ กรุณาลองใหม่อีกครั้งครับ"
            : prev.error;

        return { ...prev, isLoading: false, error };
      });

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
