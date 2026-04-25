"use client";

import { useEffect, useRef } from "react";
import CalHeatmap from "cal-heatmap";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import "cal-heatmap/cal-heatmap.css";

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

    const now = new Date();
    const currentYear = now.getFullYear();
    const startDate = new Date(`${currentYear}-01-01`);
    const endDate = now;

    const filteredData = Object.entries(data).reduce((acc, [date, count]) => {
      const postDate = new Date(date);
      if (postDate.getFullYear() === currentYear) {
        acc[date] = count;
      }
      return acc;
    }, {} as Record<string, number>);

    if (Object.keys(filteredData).length === 0) return;

    calRef.current = new CalHeatmap();

    calRef.current.paint(
      {
        itemSelector: "#cal-heatmap",
        date: { start: startDate, end: endDate },
        range: 1,
        domain: { type: "year", label: { text: null } },
        subDomain: { type: "day", label: null },
        data: { source: filteredData, type: "json", x: "date", y: "value" },
        scale: {
          color: {
            scheme: "Oranges",
            type: "linear",
            domain: [0, Math.max(1, ...Object.values(filteredData))],
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

  const now = new Date();
  const currentYear = now.getFullYear();
  const yearlyPosts = Object.entries(data).reduce((sum, [date, count]) => {
    const postDate = new Date(date);
    if (postDate.getFullYear() === currentYear) {
      return sum + count;
    }
    return sum;
  }, 0);

  return (
    <div>
      <p className="text-center mb-4 font-semibold text-orange-600">
        Total Posts: {totalPosts} ({currentYear}: {yearlyPosts})
      </p>
      <div ref={containerRef} id="cal-heatmap" className="flex justify-center" />
    </div>
  );
};

export default PostHeatmap;
