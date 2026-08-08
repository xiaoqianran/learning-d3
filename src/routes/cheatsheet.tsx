import { createFileRoute, Link } from "@tanstack/react-router";
import { BookMarked } from "lucide-react";

export const Route = createFileRoute("/cheatsheet")({
  component: CheatsheetPage,
});

const SECTIONS: { title: string; items: { k: string; v: string }[] }[] = [
  {
    title: "选择与绑定",
    items: [
      { k: "d3.select", v: "第一个匹配元素" },
      { k: "d3.selectAll", v: "全部匹配" },
      { k: ".data(arr, key)", v: "绑定数据；key 用稳定 id" },
      { k: ".join(tag)", v: "enter/update/exit 一站式" },
      { k: ".datum(x)", v: "整元素绑单个值/数组" },
      { k: ".attr / .style", v: "属性 / CSS" },
      { k: ".on(type, fn)", v: "事件；fn(event, d)" },
    ],
  },
  {
    title: "比例尺",
    items: [
      { k: "scaleLinear", v: "连续数值 → 像素" },
      { k: "scaleBand", v: "分类 → 带宽" },
      { k: "scalePoint", v: "分类 → 点（无线宽）" },
      { k: "scaleTime", v: "时间域" },
      { k: "scaleOrdinal", v: "分类颜色等" },
      { k: "scaleSequential", v: "连续色带" },
      { k: ".domain / .range", v: "数据域 / 视觉域" },
      { k: ".nice()", v: "美化 domain 边界" },
    ],
  },
  {
    title: "形状与轴",
    items: [
      { k: "d3.line / area", v: "path 生成器" },
      { k: "d3.arc / pie", v: "扇区布局 + 弧" },
      { k: "curveMonotoneX", v: "平滑且单调曲线" },
      { k: "axisBottom/Left", v: "由 scale 生成轴" },
      { k: ".ticks / tickFormat", v: "刻度数量与格式" },
    ],
  },
  {
    title: "布局",
    items: [
      { k: "d3.hierarchy", v: "树形数据节点" },
      { k: "tree / cluster", v: "树坐标" },
      { k: "pack / treemap", v: "空间填充" },
      { k: "forceSimulation", v: "力导向迭代" },
      { k: "forceLink/ManyBody", v: "连线 / 斥力" },
    ],
  },
  {
    title: "动画与交互",
    items: [
      { k: ".transition()", v: "属性插值" },
      { k: ".duration / ease", v: "时长与缓动" },
      { k: "brushX / brush", v: "刷选过滤" },
      { k: "zoom", v: "平移缩放" },
      { k: "drag", v: "拖拽节点" },
    ],
  },
  {
    title: "工程建议",
    items: [
      { k: "margin 约定", v: "t/r/b/l + 内宽高" },
      { k: "viewBox", v: "响应式 SVG" },
      { k: "稳定 key", v: "避免错误过渡" },
      { k: "React + D3", v: "useEffect + ref 操作 DOM" },
      { k: "大数据", v: "Canvas / 抽样 / 聚合" },
    ],
  },
];

function CheatsheetPage() {
  return (
    <div className="mx-auto max-w-3xl pb-16">
      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <BookMarked className="h-3.5 w-3.5" />
          速查表
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg">D3 核心 API</h1>
        <p className="mt-1 text-sm text-muted">一页复习；完整课程见首页大纲</p>
      </header>
      <div className="space-y-4">
        {SECTIONS.map((sec) => (
          <section key={sec.title} className="rounded-xl border border-border bg-surface p-4 sm:p-5">
            <h2 className="font-display text-base font-semibold text-fg">{sec.title}</h2>
            <dl className="mt-3 divide-y divide-border">
              {sec.items.map((it) => (
                <div key={it.k} className="grid gap-1 py-2.5 sm:grid-cols-[11rem_1fr] sm:gap-4">
                  <dt className="font-mono text-sm text-primary">{it.k}</dt>
                  <dd className="text-sm text-muted">{it.v}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        想动手？去{" "}
        <Link to="/playground" className="text-primary no-underline hover:underline">
          Playground
        </Link>
      </p>
    </div>
  );
}
