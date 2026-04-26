"use client";

import { useEffect, useRef } from "react";
import { Box, Center, Loader, Text } from "@mantine/core";
import { IconSparkles, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

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
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

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
          <Center className="py-6">
            <Loader size="sm" color="orange" />
          </Center>
        )}

        {error && (
          <Center className="py-4 flex-col gap-3">
            <Text c="red" size="sm" ta="center">
              {error}
            </Text>
            <button
              onClick={onRetry}
              className="px-4 py-2 text-sm font-medium rounded-md bg-orange-500 text-white hover:bg-orange-600 transition-colors"
            >
              Retry
            </button>
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
