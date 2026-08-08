/**
 * 文档地图：d3js.org 官方模块 ⇄ 本站课程
 * d3js.org 暂无 llms.txt；Observable 有站级 llms，API 以 d3js.org 为准。
 */
export type DocItem = {
  title: string;
  official: string;
  lessonSlug?: string;
  note?: string;
};

export type DocSection = {
  id: string;
  title: string;
  items: DocItem[];
};

const D = "https://d3js.org";

export const DOC_SECTIONS: DocSection[] = [
  {
    id: "intro",
    title: "Introduction",
    items: [
      { title: "What is D3?", official: `${D}/what-is-d3`, lessonSlug: "intro" },
      { title: "Getting started", official: `${D}/getting-started`, lessonSlug: "intro" },
      { title: "API index", official: `${D}/api`, note: "全模块入口" },
    ],
  },
  {
    id: "selection-data",
    title: "Selection & Data",
    items: [
      { title: "d3-selection", official: `${D}/d3-selection`, lessonSlug: "selection" },
      { title: "Selecting elements", official: `${D}/d3-selection/selecting`, lessonSlug: "selection" },
      { title: "Joining data", official: `${D}/d3-selection/joining`, lessonSlug: "data-join" },
      { title: "Modifying elements", official: `${D}/d3-selection/modifying`, lessonSlug: "enter-update-exit" },
      { title: "Handling events", official: `${D}/d3-selection/events`, lessonSlug: "interactions" },
    ],
  },
  {
    id: "scales-axes",
    title: "Scales & Axes",
    items: [
      { title: "d3-scale", official: `${D}/d3-scale`, lessonSlug: "scales" },
      { title: "Linear scales", official: `${D}/d3-scale/linear`, lessonSlug: "scales" },
      { title: "Band scales", official: `${D}/d3-scale/band`, lessonSlug: "bar-chart" },
      { title: "Time scales", official: `${D}/d3-scale/time`, lessonSlug: "line-chart" },
      { title: "d3-axis", official: `${D}/d3-axis`, lessonSlug: "axes" },
      { title: "d3-scale-chromatic", official: `${D}/d3-scale-chromatic`, lessonSlug: "color-scale" },
    ],
  },
  {
    id: "shapes-charts",
    title: "Shapes & Charts",
    items: [
      { title: "d3-shape", official: `${D}/d3-shape`, lessonSlug: "svg-shapes" },
      { title: "Lines", official: `${D}/d3-shape/line`, lessonSlug: "line-chart" },
      { title: "Areas", official: `${D}/d3-shape/area`, lessonSlug: "area-chart" },
      { title: "Arcs / Pies", official: `${D}/d3-shape/arc`, lessonSlug: "pie" },
      { title: "Stacks", official: `${D}/d3-shape/stack`, lessonSlug: "area-chart" },
      { title: "Scatter (marks)", official: `${D}/d3-shape/symbol`, lessonSlug: "scatter" },
    ],
  },
  {
    id: "layout",
    title: "Hierarchy & Force",
    items: [
      { title: "d3-hierarchy", official: `${D}/d3-hierarchy`, lessonSlug: "hierarchy" },
      { title: "Tree", official: `${D}/d3-hierarchy/tree`, lessonSlug: "tree" },
      { title: "Pack", official: `${D}/d3-hierarchy/pack`, lessonSlug: "pack" },
      { title: "Treemap", official: `${D}/d3-hierarchy/treemap`, lessonSlug: "hierarchy" },
      { title: "d3-force", official: `${D}/d3-force`, lessonSlug: "force" },
      { title: "Force simulation", official: `${D}/d3-force/simulation`, lessonSlug: "force" },
    ],
  },
  {
    id: "interaction",
    title: "Animation & Interaction",
    items: [
      { title: "d3-transition", official: `${D}/d3-transition`, lessonSlug: "transitions" },
      { title: "d3-ease", official: `${D}/d3-ease`, lessonSlug: "transitions" },
      { title: "d3-brush", official: `${D}/d3-brush`, lessonSlug: "brush" },
      { title: "d3-zoom", official: `${D}/d3-zoom`, lessonSlug: "interactions" },
      { title: "d3-drag", official: `${D}/d3-drag`, lessonSlug: "interactions" },
    ],
  },
  {
    id: "data",
    title: "Data utilities",
    items: [
      { title: "d3-array", official: `${D}/d3-array`, lessonSlug: "modules" },
      { title: "d3-fetch", official: `${D}/d3-fetch`, lessonSlug: "modules" },
      { title: "d3-dsv", official: `${D}/d3-dsv`, lessonSlug: "modules" },
      { title: "d3-format", official: `${D}/d3-format`, lessonSlug: "axes" },
      { title: "d3-time-format", official: `${D}/d3-time-format`, lessonSlug: "line-chart" },
    ],
  },
  {
    id: "practice",
    title: "本站实践",
    items: [
      { title: "Responsive charts", official: `${D}/d3-selection`, lessonSlug: "responsive" },
      { title: "Dashboard composition", official: `${D}/api`, lessonSlug: "dashboard" },
      { title: "Performance tips", official: `${D}/d3-selection/joining`, lessonSlug: "performance" },
    ],
  },
];

export function docsCoverage() {
  const items = DOC_SECTIONS.flatMap((s) => s.items);
  const linked = items.filter((i) => i.lessonSlug).length;
  return { total: items.length, linked, pct: Math.round((linked / items.length) * 100) };
}
