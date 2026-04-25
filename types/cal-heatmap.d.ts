declare module "cal-heatmap" {
  export default class CalHeatmap {
    paint(options: any, plugins?: any[]): void;
    destroy(): void;
  }
}

declare module "cal-heatmap/plugins/Tooltip" {
  export default class Tooltip {}
}

declare module "cal-heatmap/plugins/Legend" {
  export default class Legend {}
}

declare module "cal-heatmap/cal-heatmap.css" {
  const css: string;
  export default css;
}
