declare module "cal-heatmap" {
  interface PaintOptions {
    itemSelector: Element | string;
    date: {
      start: Date;
      end?: Date;
    };
    range?: number;
    domain?: {
      type?: "month" | "year";
      gutter?: number;
      label?: {
        text?: string | null;
        textAlign?: "start" | "center" | "end";
        position?: "top" | "bottom";
      };
    };
    subDomain?: {
      type?: "day" | "ghDay";
      radius?: number;
      width?: number;
      height?: number;
      gutter?: number;
      label?: Record<string, unknown> | null;
    };
    data?: {
      source: unknown[];
      type: "json";
      x: string;
      y: string;
    };
    scale?: {
      color?: {
        scheme?: string;
        type?: "linear";
        domain?: number[];
      };
    };
  }

  export default class CalHeatmap {
    constructor();
    paint(options: PaintOptions, plugins?: unknown[]): void;
    destroy(): void;
  }
}

declare module "cal-heatmap/plugins/Tooltip" {
  interface TooltipOptions {
    text: (date: number, value: number, dayjsDate: unknown) => string;
  }

  const Tooltip: new (options: TooltipOptions) => unknown;
  export default Tooltip;
}

declare module "cal-heatmap/plugins/Legend" {
  interface LegendOptions {
    includeBlank?: boolean;
    itemSelector?: string;
    radius?: number;
    width?: number;
    height?: number;
    gutter?: number;
  }

  const Legend: new (options?: LegendOptions) => unknown;
  export default Legend;
}

declare module "cal-heatmap/plugins/LegendLite" {
  interface LegendLiteOptions {
    includeBlank?: boolean;
    itemSelector?: string;
    radius?: number;
    width?: number;
    height?: number;
    gutter?: number;
  }

  const LegendLite: new (options?: LegendLiteOptions) => unknown;
  export default LegendLite;
}

declare module "cal-heatmap/plugins/CalendarLabel" {
  interface CalendarLabelOptions {
    width?: number;
    textAlign?: "start" | "center" | "end";
    text?: () => string[];
    padding?: number[];
  }

  const CalendarLabel: new (options?: CalendarLabelOptions) => unknown;
  export default CalendarLabel;
}

declare module "cal-heatmap/cal-heatmap.css" {
  const content: string;
  export default content;
}