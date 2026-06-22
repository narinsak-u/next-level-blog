"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Center, Text } from "@mantine/core";
import { IconSparkles, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const LOADING_STEPS = [
  { emoji: "📖", text: "กำลังอ่านเนื้อหา..." },
  { emoji: "🤔", text: "วิเคราะห์เนื้อหา..." },
  { emoji: "✍️", text: "กำลังสรุป..." },
  { emoji: "✨", text: "เกือบเสร็จแล้ว..." },
];

interface AISummaryPopupProps {
  isOpen: boolean;
  summary: string;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onRetry: () => void;
}

const AISummaryPopup = ({
  isOpen,
  summary,
  isLoading,
  error,
  onClose,
  onRetry,
}: AISummaryPopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!isLoading || summary) return;
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isLoading, summary]);

  useEffect(() => {
    if (!isLoading) setStepIndex(0);
  }, [isLoading]);

  // Auto-scroll to bottom when text is streaming
  useEffect(() => {
    if (textRef.current && summary) {
      textRef.current.scrollTop = textRef.current.scrollHeight;
    }
  }, [summary, isLoading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onCloseRef.current();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={popupRef}
      className={cn(
        "fixed z-50 max-w-100 w-[90vw] bottom-30 right-30",
        "bg-white/95 dark:bg-black/75 backdrop-blur-xl",
        "border border-gray-200 dark:border-gray-700",
        "rounded-xl shadow-xl",
        "animate-slide-up",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <IconSparkles size={20} className="text-orange-500" />
          <Text fw={600} size="sm" className="dark:text-white">
            AI Summary
          </Text>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close"
        >
          <IconX size={18} className="dark:text-gray-300" />
        </button>
      </div>

      <Box className="p-4 min-h-25 overflow-y-auto">
        {isLoading && !summary && (
          <Center className="py-8 flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-bounce">
                {LOADING_STEPS[stepIndex].emoji}
              </span>
              <Text
                size="sm"
                className="dark:text-gray-300 font-medium"
              >
                {LOADING_STEPS[stepIndex].text}
              </Text>
            </div>
            <div className="flex gap-1.5">
              {LOADING_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-500",
                    i === stepIndex
                      ? "bg-orange-500 scale-125"
                      : "bg-gray-300 dark:bg-gray-600",
                  )}
                />
              ))}
            </div>
          </Center>
        )}

        {error && (
          <Center className="py-8 flex-col gap-4">
            <div className={cn(
              "p-4 rounded-xl text-center w-full",
              error.includes("โควต้า") 
                ? "bg-orange-50 dark:bg-orange-950/30 text-orange-800 dark:text-orange-200 border border-orange-100 dark:border-orange-900/50"
                : "bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-200 border border-red-100 dark:border-red-900/50"
            )}>
              <Text size="sm" className="font-medium leading-relaxed">
                {error}
              </Text>
            </div>
            {!error.includes("โควต้า") && (
              <button
                onClick={onRetry}
                className="px-6 py-2 text-sm font-semibold rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                ลองใหม่อีกครั้ง (Retry)
              </button>
            )}
          </Center>
        )}

        {/* Show summary even while loading (for streaming) */}
        {(summary || (!isLoading && !error)) && (
          <div ref={textRef}>
            <Text
              size="sm"
              className="leading-relaxed whitespace-pre-wrap dark:text-gray-200"
            >
              {summary}
            </Text>
            {isLoading && (
              <span className="inline-block w-2 h-4 bg-orange-500 animate-pulse ml-1" />
            )}
          </div>
        )}
      </Box>
    </div>
  );
};

export { AISummaryPopup };
export type { AISummaryPopupProps };
