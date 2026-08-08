import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { Button } from "@/components/ui/button";
import { Check, Server, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const Route = createFileRoute("/studio")({
  component: StudioPage,
});

type QuestId = "bars" | "axes" | "color" | "hover" | "transition";

const QUESTS: {
  id: QuestId;
  title: string;
  desc: string;
  check: (flags: Record<QuestId, boolean>) => boolean;
}[] = [
  { id: "bars", title: "画出柱状", desc: "点击「渲染柱图」生成 5 根柱子", check: (f) => f.bars },
  { id: "axes", title: "加上坐标轴", desc: "开启坐标轴显示", check: (f) => f.axes },
  { id: "color", title: "换配色", desc: "切换一次强调色", check: (f) => f.color },
  { id: "hover", title: "悬停反馈", desc: "鼠标移到任意柱上", check: (f) => f.hover },
  { id: "transition", title: "数据过渡", desc: "点击「随机数据」触发过渡", check: (f) => f.transition },
];

type StudioState = {
  done: QuestId[];
  mark: (id: QuestId) => void;
  reset: () => void;
};

const useStudio = create<StudioState>()(
  persist(
    (set, get) => ({
      done: [],
      mark: (id) => {
        if (get().done.includes(id)) return;
        set({ done: [...get().done, id] });
      },
      reset: () => set({ done: [] }),
    }),
    { name: "d3-learn-studio-v1" },
  ),
);

function StudioPage() {
  const done = useStudio((s) => s.done);
  const mark = useStudio((s) => s.mark);
  const reset = useStudio((s) => s.reset);
  const [showAxes, setShowAxes] = useState(false);
  const [palette, setPalette] = useState(0);
  const [data, setData] = useState([22, 35, 18, 40, 28]);
  const [rendered, setRendered] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const colors = ["var(--color-primary)", "var(--color-peach)", "var(--color-mauve)", "var(--color-teal)"];

  const flags = useMemo(
    () => ({
      bars: rendered,
      axes: showAxes && rendered,
      color: palette > 0 && rendered,
      hover: done.includes("hover"),
      transition: done.includes("transition"),
    }),
    [rendered, showAxes, palette, done],
  );

  useEffect(() => {
    if (rendered) mark("bars");
  }, [rendered, mark]);
  useEffect(() => {
    if (showAxes && rendered) mark("axes");
  }, [showAxes, rendered, mark]);
  useEffect(() => {
    if (palette > 0 && rendered) mark("color");
  }, [palette, rendered, mark]);

  useEffect(() => {
    if (!host.current || !rendered) return;
    const el = host.current;
    const w = el.clientWidth || 420;
    const h = 240;
    const m = { t: 16, r: 12, b: showAxes ? 32 : 12, l: showAxes ? 36 : 12 };
    let svg = d3.select(el).select<SVGSVGElement>("svg");
    if (svg.empty()) {
      el.innerHTML = "";
      svg = d3.select(el).append("svg");
    }
    svg.attr("width", w).attr("height", h);
    svg.selectAll("*").remove();
    const g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);
    const iw = w - m.l - m.r;
    const ih = h - m.t - m.b;
    const x = d3.scaleBand().domain(data.map((_, i) => String(i))).range([0, iw]).padding(0.2);
    const y = d3.scaleLinear().domain([0, d3.max(data)! * 1.15]).range([ih, 0]);
    g.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (_, i) => x(String(i))!)
      .attr("width", x.bandwidth())
      .attr("rx", 4)
      .attr("fill", colors[palette % colors.length])
      .attr("y", ih)
      .attr("height", 0)
      .on("pointerenter", function () {
        d3.select(this).attr("opacity", 0.75);
        mark("hover");
      })
      .on("pointerleave", function () {
        d3.select(this).attr("opacity", 1);
      })
      .transition()
      .duration(500)
      .attr("y", (d) => y(d))
      .attr("height", (d) => ih - y(d));
    if (showAxes) {
      g.append("g").attr("transform", `translate(0,${ih})`).call(d3.axisBottom(x));
      g.append("g").call(d3.axisLeft(y).ticks(5));
    }
  }, [data, rendered, showAxes, palette, mark]);

  const progress = QUESTS.filter((q) => done.includes(q.id)).length;
  const allDone = progress === QUESTS.length;

  return (
    <div className="mx-auto max-w-3xl pb-16">
      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <Server className="h-3.5 w-3.5" />
          图表工坊
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg">闯关：搭一座柱状图</h1>
        <p className="mt-1 text-sm text-muted">完成 5 个小任务，熟悉 D3 图表流水线</p>
      </header>

      <div className="mb-4 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-3">
          <div
            className="h-full rounded-full bg-primary transition-[width]"
            style={{ width: `${(progress / QUESTS.length) * 100}%` }}
          />
        </div>
        <span className="font-mono text-xs text-muted">
          {progress}/{QUESTS.length}
        </span>
        {allDone ? (
          <span className="inline-flex items-center gap-1 text-xs text-primary">
            <Trophy className="h-3.5 w-3.5" />
            通关
          </span>
        ) : null}
      </div>

      <ul className="mb-6 space-y-2">
        {QUESTS.map((q) => {
          const ok = done.includes(q.id);
          return (
            <li
              key={q.id}
              className={cn(
                "flex items-start gap-3 rounded-xl border px-4 py-3",
                ok ? "border-primary/30 bg-primary-soft" : "border-border bg-surface",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full",
                  ok ? "bg-primary text-primary-fg" : "bg-surface-3 text-muted",
                )}
              >
                {ok ? <Check className="h-3 w-3" /> : null}
              </span>
              <div>
                <p className="text-sm font-medium text-fg">{q.title}</p>
                <p className="text-xs text-muted">{q.desc}</p>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mb-3 flex flex-wrap gap-2">
        <Button
          onClick={() => {
            setRendered(true);
          }}
        >
          渲染柱图
        </Button>
        <Button
          variant="secondary"
          disabled={!rendered}
          onClick={() => setShowAxes((v) => !v)}
        >
          {showAxes ? "隐藏坐标轴" : "显示坐标轴"}
        </Button>
        <Button
          variant="secondary"
          disabled={!rendered}
          onClick={() => setPalette((p) => p + 1)}
        >
          切换颜色
        </Button>
        <Button
          variant="secondary"
          disabled={!rendered}
          onClick={() => {
            setData(d3.range(5).map(() => 12 + Math.round(Math.random() * 40)));
            mark("transition");
          }}
        >
          随机数据
        </Button>
        <Button variant="ghost" onClick={() => { reset(); setRendered(false); setShowAxes(false); setPalette(0); if (host.current) host.current.innerHTML=""; }}>
          重置工坊
        </Button>
      </div>

      <div
        ref={host}
        className="min-h-[240px] rounded-xl border border-border bg-bg"
      />
      {!rendered ? (
        <p className="mt-3 text-center text-sm text-muted">先点「渲染柱图」开始闯关</p>
      ) : null}
    </div>
  );
}
