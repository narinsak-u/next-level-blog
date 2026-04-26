declare module "cal-heatmap" {
  export default class CalHeatmap {
    constructor();
    paint(options: any, plugins?: any[]): void;
    destroy(): void;
  }
}

declare module "cal-heatmap/plugins/Tooltip" {
  const Tooltip: any;
  export default Tooltip;
}

declare module "cal-heatmap/plugins/Legend" {
  const Legend: any;
  export default Legend;
}

declare module "cal-heatmap/plugins/LegendLite" {
  const LegendLite: any;
  export default LegendLite;
}

declare module "cal-heatmap/plugins/CalendarLabel" {
  const CalendarLabel: any;
  export default CalendarLabel;
}

declare module "cal-heatmap/cal-heatmap.css" {
  const content: any;
  export default content;
}
