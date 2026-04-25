"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select } from "@mantine/core";
import CalHeatmap from "cal-heatmap";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import "cal-heatmap/cal-heatmap.css";
import Loader from "@/components/common/Loader";

const fetchPostDates = async (): Promise<YearData> => {
  const res = await fetch("/api/post-dates");
  if (!res.ok) {
    throw new Error("Failed to fetch post dates");
  }
  return res.json();
};

interface YearData {
  dates: Record<string, number>;
  years: number[];
}

const PostHeatmap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<CalHeatmap | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const { data, isLoading } = useQuery<YearData>({
    queryKey: ["postDates"],
    queryFn: () => fetchPostDates(),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!containerRef.current || !data || Object.keys(data.dates).length === 0) return;

    const now = new Date();
    const year = selectedYear || now.getFullYear();
    const startDate = new Date(`${year}-01-01`);
    const endDate = year === now.getFullYear() ? now : new Date(`${year}-12-31`);

    const filteredData = Object.entries(data.dates).reduce((acc, [date, count]) => {
      const postDate = new Date(date);
      if (postDate.getFullYear() === year) {
        acc[date] = count;
      }
      return acc;
    }, {} as Record<string, number>);

    if (Object.keys(filteredData).length === 0) return;

    if (calRef.current) {
      calRef.current.destroy();
    }

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
  }, [data, selectedYear]);

  useEffect(() => {
    if (data?.years?.length && !selectedYear) {
      const now = new Date();
      const currentYear = now.getFullYear();
      if (data.years.includes(currentYear)) {
        setSelectedYear(currentYear);
      } else {
        setSelectedYear(data.years[data.years.length - 1]);
      }
    }
  }, [data, selectedYear]);

  if (isLoading) {
    return <Loader />;
  }

  if (!data || Object.keys(data.dates).length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No posts yet
      </div>
    );
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const yearlyPosts = Object.entries(data.dates).reduce((sum, [date, count]) => {
    const postDate = new Date(date);
    const year = postDate.getFullYear();
    if (year === (selectedYear || currentYear)) {
      return sum + count;
    }
    return sum;
  }, 0);

  const totalPosts = Object.values(data.dates).reduce((sum, count) => sum + count, 0);

  const yearOptions = data.years.map((year) => ({
    value: String(year),
    label: String(year),
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-orange-600">
          Total Posts: {totalPosts} ({selectedYear || currentYear}: {yearlyPosts})
        </p>
        <Select
          size="sm"
          w={100}
          data={yearOptions}
          value={selectedYear ? String(selectedYear) : String(currentYear)}
          onChange={(value) => setSelectedYear(value ? Number(value) : null)}
          styles={{
            input: {
              borderColor: "#fd746c",
            },
          }}
        />
      </div>
      <div ref={containerRef} id="cal-heatmap" className="flex justify-center" />
    </div>
  );
};

export default PostHeatmap;