"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select } from "@mantine/core";
import CalHeatmap from "cal-heatmap";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import LegendLite from "cal-heatmap/plugins/LegendLite";
import CalendarLabel from "cal-heatmap/plugins/CalendarLabel";
import dayjs from "dayjs";
import "cal-heatmap/cal-heatmap.css";
import Loader from "@/components/common/Loader";

// Optional: manually inject basic styles if the CSS import fails in Turbopack
if (typeof document !== "undefined") {
  const id = "cal-heatmap-fix";
  if (!document.getElementById(id)) {
    const style = document.createElement("style");
    style.id = id;
    style.innerHTML = `
      #cal-heatmap {
        display: block !important;
        min-height: 150px;
        width: 100%;
      }
      .ch-domain-text { fill: #666; font-size: 10px; }
    `;
    document.head.appendChild(style);
  }
}

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

interface PostHeatmapProps {
  initialData?: YearData;
}

const PostHeatmap = ({ initialData }: PostHeatmapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<CalHeatmap | null>(null);
  const isPainting = useRef(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const { data, isLoading } = useQuery<YearData>({
    queryKey: ["postDates"],
    queryFn: () => fetchPostDates(),
    initialData: initialData,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (
      !containerRef.current ||
      !data ||
      Object.keys(data.dates).length === 0 ||
      isPainting.current ||
      selectedYear === null
    )
      return;

    const now = new Date();
    const year = selectedYear || now.getFullYear();
    const startDate = new Date(`${year}-01-01`);

    const filteredData = Object.entries(data.dates).reduce(
      (acc, [date, count]) => {
        const postDate = new Date(date);
        if (postDate.getFullYear() === year) {
          acc.push({ date, value: count });
        }
        return acc;
      },
      [] as { date: string; value: number }[],
    );

    if (calRef.current) {
      try {
        calRef.current.destroy();
      } catch (e) {
        console.error("Cleanup error:", e);
      }
    }

    // Ensure the container is empty before painting
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    isPainting.current = true;
    calRef.current = new CalHeatmap();

    try {
      calRef.current.paint(
        {
          itemSelector: containerRef.current,
          date: { start: startDate },
          range: 12,
          domain: {
            type: "month",
            gutter: 4,
            label: { text: "MMM", textAlign: "start", position: "top" },
          },
          subDomain: {
            type: "ghDay",
            radius: 2,
            width: 11,
            height: 11,
            gutter: 4,
          },
          data: { source: filteredData, type: "json", x: "date", y: "value" },
          scale: {
            color: {
              scheme: "Oranges",
              type: "linear",
              domain: [0, Math.max(5, ...filteredData.map((d) => d.value))],
            },
          },
        },
        [
          [
            Tooltip,
            {
              text: (date: number, value: number, dayjsDate: any) => {
                return `${dayjsDate.format("MMM DD, YYYY")}: ${value || 0} post${value !== 1 ? "s" : ""}`;
              },
            },
          ],
          [
            CalendarLabel,
            {
              width: 30,
              textAlign: "start",
              text: () => ["", "Mon", "", "Wed", "", "Fri", ""],
              padding: [25, 0, 0, 0],
            },
          ],
          [
            LegendLite,
            {
              includeBlank: true,
              itemSelector: "#cal-heatmap-legend",
              radius: 2,
              width: 11,
              height: 11,
              gutter: 4,
            },
          ],
        ],
      );
    } catch (e) {
      console.error("Paint error:", e);
    } finally {
      isPainting.current = false;
    }

    return () => {
      if (calRef.current) {
        try {
          calRef.current.destroy();
          calRef.current = null;
        } catch (e) {
          // ignore cleanup errors on unmount
          console.log("Cleanup error:", e);
        }
      }
      isPainting.current = false;
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
    return <div className="text-center py-8 text-gray-500">No posts yet</div>;
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const yearlyPosts = Object.entries(data.dates).reduce(
    (sum, [date, count]) => {
      const postDate = new Date(date);
      const year = postDate.getFullYear();
      if (year === (selectedYear || currentYear)) {
        return sum + count;
      }
      return sum;
    },
    0,
  );

  const totalPosts = Object.values(data.dates).reduce(
    (sum, count) => sum + count,
    0,
  );

  const yearOptions = data.years.map((year) => ({
    value: String(year),
    label: String(year),
  }));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-orange-600 text-sm">
          Total Posts: {totalPosts} ({selectedYear || currentYear}:{" "}
          {yearlyPosts})
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
      <div className="overflow-x-auto w-full p-4">
        <div className="flex flex-col items-center min-w-max">
          <div ref={containerRef} id="cal-heatmap" />
          <div className="w-full flex justify-end mt-4 px-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Less</span>
              <div id="cal-heatmap-legend" />
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostHeatmap;
