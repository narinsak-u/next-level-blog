"use client";

import { useEffect, useRef } from "react";
import CalHeatmap from "cal-heatmap";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import "cal-heatmap/cal-heatmap.css";
import Loader from "@/components/common/Loader";

interface PostHeatmapProps {
  data: Record<string, number>;
}

const PostHeatmap = ({ data }: PostHeatmapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<CalHeatmap | null>(null);

  useEffect(() => {
    if (!containerRef.current || Object.keys(data).length === 0) return;

    if (calRef.current) {
      calRef.current.destroy();
    }

    calRef.current = new CalHeatmap();

    calRef.current.paint(
      {
        itemSelector: "#cal-heatmap",
        date: { start: new Date("2020-01-01") },
        domain: { type: "year", label: { text: null } },
        subDomain: { type: "day", label: null },
        data: { source: data, type: "json", x: "date", y: "value" },
        scale: {
          color: {
            scheme: "Oranges",
            type: "linear",
            domain: [0, Math.max(1, ...Object.values(data))],
          },
        },
      },
      [[Tooltip]]
    );

    return () => {
      if (calRef.current) {
        calRef.current.destroy();
        calRef.current = null;
      }
    };
  }, [data]);

  const totalPosts = Object.values(data).reduce((sum, count) => sum + count, 0);

  if (Object.keys(data).length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No posts yet
      </div>
    );
  }

  return (
    <div>
      <p className="text-center mb-4 font-semibold text-orange-600">
        Total Posts: {totalPosts}
      </p>
      <div ref={containerRef} id="cal-heatmap" className="flex justify-center" />
    </div>
  );
};

export default PostHeatmap;
