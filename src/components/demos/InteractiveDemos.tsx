import { useEffect, useRef, useState, type ReactNode } from "react";
import * as d3 from "d3";
import type { DemoKind } from "@/data/lessons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function usePrimary() {
  const [c, setC] = useState("#89b4fa");
  useEffect(() => {
    const read = () => {
      const v = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-primary")
        .trim();
      if (v) setC(v);
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-ctp-flavor", "data-ctp-accent"],
    });
    return () => mo.disconnect();
  }, []);
  return c;
}

function Shell({
  title,
  hint,
  children,
  controls,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
  controls?: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wider text-primary">
            Live Demo
          </p>
          <h3 className="font-display text-base font-semibold text-fg">{title}</h3>
          {hint ? <p className="mt-0.5 text-xs text-muted">{hint}</p> : null}
        </div>
        {controls ? <div className="flex flex-wrap gap-2">{controls}</div> : null}
      </div>
      <div className="p-3 sm:p-4">{children}</div>
    </section>
  );
}

function ChartHost({
  className,
  children,
}: {
  className?: string;
  children: (el: HTMLDivElement) => void | (() => void);
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";
    return children(ref.current) ?? undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);
  return (
    <div
      ref={ref}
      className={cn(
        "min-h-[200px] w-full overflow-hidden rounded-lg border border-border bg-bg",
        className,
      )}
    />
  );
}

const CATS = ["A", "B", "C", "D", "E", "F"];

export function InteractiveDemo({
  kind,
  title,
  hint,
}: {
  kind: DemoKind;
  title: string;
  hint?: string;
}) {
  const primary = usePrimary();

  if (kind === "intro-bars") return <IntroBars title={title} hint={hint} color={primary} />;
  if (kind === "selection") return <SelectionDemo title={title} hint={hint} color={primary} />;
  if (kind === "data-join") return <DataJoinDemo title={title} hint={hint} color={primary} />;
  if (kind === "enter-update-exit")
    return <EUEDemo title={title} hint={hint} color={primary} />;
  if (kind === "scales") return <ScalesDemo title={title} hint={hint} color={primary} />;
  if (kind === "axes") return <AxesDemo title={title} hint={hint} color={primary} />;
  if (kind === "svg-shapes") return <ShapesDemo title={title} hint={hint} color={primary} />;
  if (kind === "bar-chart") return <BarDemo title={title} hint={hint} color={primary} />;
  if (kind === "line-chart") return <LineDemo title={title} hint={hint} color={primary} />;
  if (kind === "area-chart") return <AreaDemo title={title} hint={hint} color={primary} />;
  if (kind === "scatter") return <ScatterDemo title={title} hint={hint} color={primary} />;
  if (kind === "pie") return <PieDemo title={title} hint={hint} color={primary} />;
  if (kind === "transitions") return <TransDemo title={title} hint={hint} color={primary} />;
  if (kind === "interactions") return <IxDemo title={title} hint={hint} color={primary} />;
  if (kind === "hierarchy") return <HierDemo title={title} hint={hint} color={primary} />;
  if (kind === "tree") return <TreeDemo title={title} hint={hint} color={primary} />;
  if (kind === "force") return <ForceDemo title={title} hint={hint} color={primary} />;
  if (kind === "pack") return <PackDemo title={title} hint={hint} color={primary} />;
  if (kind === "responsive") return <RespDemo title={title} hint={hint} color={primary} />;
  if (kind === "color-scale") return <ColorDemo title={title} hint={hint} color={primary} />;
  if (kind === "brush") return <BrushDemo title={title} hint={hint} color={primary} />;
  if (kind === "dashboard") return <DashDemo title={title} hint={hint} color={primary} />;
  if (kind === "modules") return <ModDemo title={title} hint={hint} color={primary} />;
  if (kind === "performance") return <PerfDemo title={title} hint={hint} color={primary} />;
  return (
    <Shell title={title} hint={hint}>
      <p className="text-sm text-muted">Demo 即将上线</p>
    </Shell>
  );
}

function IntroBars({ title, hint, color }: { title: string; hint?: string; color: string }) {
  const [data, setData] = useState([12, 28, 18, 32, 24]);
  const draw = (el: HTMLDivElement) => {
    const w = el.clientWidth || 360;
    const h = 160;
    const svg = d3.select(el).append("svg").attr("width", w).attr("height", h);
    const x = d3.scaleBand().domain(data.map((_, i) => String(i))).range([24, w - 12]).padding(0.2);
    const y = d3.scaleLinear().domain([0, d3.max(data)! * 1.1]).range([h - 20, 12]);
    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (_, i) => x(String(i))!)
      .attr("y", (d) => y(d))
      .attr("width", x.bandwidth())
      .attr("height", (d) => h - 20 - y(d))
      .attr("rx", 4)
      .attr("fill", color);
    svg
      .selectAll("text")
      .data(data)
      .join("text")
      .attr("x", (_, i) => x(String(i))! + x.bandwidth() / 2)
      .attr("y", (d) => y(d) - 4)
      .attr("text-anchor", "middle")
      .attr("fill", "currentColor")
      .attr("font-size", 11)
      .text((d) => d);
  };
  return (
    <Shell
      title={title}
      hint={hint}
      controls={
        <>
          <Button size="sm" variant="secondary" onClick={() => setData(data.map((d) => d + Math.round(Math.random() * 10 - 3)))}>
            随机微调
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setData([12, 28, 18, 32, 24])}>
            重置
          </Button>
        </>
      }
    >
      <ChartHost key={data.join(",") + color}>{draw}</ChartHost>
    </Shell>
  );
}

function SelectionDemo({ title, hint, color }: { title: string; hint?: string; color: string }) {
  const [r, setR] = useState(16);
  const draw = (el: HTMLDivElement) => {
    const w = el.clientWidth || 360;
    const svg = d3.select(el).append("svg").attr("width", w).attr("height", 120);
    svg
      .selectAll("circle")
      .data([20, 40, 60, 80, 100])
      .join("circle")
      .attr("cx", (d, i) => 40 + i * ((w - 60) / 4))
      .attr("cy", 60)
      .attr("r", r)
      .attr("fill", color)
      .attr("opacity", (_, i) => 0.45 + i * 0.12);
  };
  return (
    <Shell
      title={title}
      hint={hint}
      controls={
        <label className="flex items-center gap-2 text-xs text-muted">
          r
          <input type="range" min={6} max={36} value={r} onChange={(e) => setR(+e.target.value)} />
        </label>
      }
    >
      <ChartHost key={r + color}>{draw}</ChartHost>
    </Shell>
  );
}

function DataJoinDemo({ title, hint, color }: { title: string; hint?: string; color: string }) {
  const [n, setN] = useState(4);
  const draw = (el: HTMLDivElement) => {
    const data = d3.range(n).map((i) => ({ id: `id-${i}`, v: 8 + ((i * 7) % 20) }));
    const w = el.clientWidth || 360;
    const h = 160;
    const svg = d3.select(el).append("svg").attr("width", w).attr("height", h);
    const x = d3.scaleBand().domain(data.map((d) => d.id)).range([20, w - 12]).padding(0.15);
    const y = d3.scaleLinear().domain([0, 30]).range([h - 16, 12]);
    svg
      .selectAll("rect")
      .data(data, (d: any) => d.id)
      .join("rect")
      .attr("x", (d) => x(d.id)!)
      .attr("y", (d) => y(d.v))
      .attr("width", x.bandwidth())
      .attr("height", (d) => h - 16 - y(d.v))
      .attr("rx", 4)
      .attr("fill", color);
  };
  return (
    <Shell
      title={title}
      hint={hint}
      controls={
        <>
          <Button size="sm" variant="secondary" onClick={() => setN((v) => Math.min(8, v + 1))}>
            + 数据
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setN((v) => Math.max(1, v - 1))}>
            − 数据
          </Button>
        </>
      }
    >
      <ChartHost key={n + color}>{draw}</ChartHost>
    </Shell>
  );
}

function EUEDemo({ title, hint, color }: { title: string; hint?: string; color: string }) {
  const [items, setItems] = useState([1, 2, 3, 4]);
  const draw = (el: HTMLDivElement) => {
    const w = el.clientWidth || 360;
    const h = 140;
    const svg = d3.select(el).append("svg").attr("width", w).attr("height", h);
    const x = d3.scalePoint().domain(items.map(String)).range([40, w - 40]);
    svg
      .selectAll("circle")
      .data(items, (d: any) => d)
      .join(
        (enter) =>
          enter
            .append("circle")
            .attr("cy", h / 2)
            .attr("cx", (d) => x(String(d))!)
            .attr("r", 0)
            .attr("fill", color)
            .call((e) => e.transition().duration(400).attr("r", 16)),
        (update) => update.attr("fill", color).attr("cx", (d) => x(String(d))!),
        (exit) => exit.transition().duration(300).attr("r", 0).remove(),
      );
  };
  return (
    <Shell
      title={title}
      hint={hint}
      controls={
        <>
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              setItems((arr) => {
                const n = (arr[arr.length - 1] ?? 0) + 1;
                return [...arr, n].slice(-7);
              })
            }
          >
            Enter
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setItems((arr) => arr.slice(0, -1))}>
            Exit
          </Button>
        </>
      }
    >
      <ChartHost key={items.join("-") + color}>{draw}</ChartHost>
    </Shell>
  );
}

function ScalesDemo({ title, hint, color }: { title: string; hint?: string; color: string }) {
  const [max, setMax] = useState(50);
  const draw = (el: HTMLDivElement) => {
    const data = [10, 20, 35, 42, 18];
    const w = el.clientWidth || 360;
    const h = 150;
    const svg = d3.select(el).append("svg").attr("width", w).attr("height", h);
    const x = d3.scaleBand().domain(CATS.slice(0, 5)).range([32, w - 12]).padding(0.2);
    const y = d3.scaleLinear().domain([0, max]).range([h - 24, 12]);
    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (_, i) => x(CATS[i])!)
      .attr("y", (d) => y(d))
      .attr("width", x.bandwidth())
      .attr("height", (d) => Math.max(0, h - 24 - y(d)))
      .attr("fill", color)
      .attr("rx", 3);
    svg
      .append("g")
      .attr("transform", `translate(0,${h - 24})`)
      .call(d3.axisBottom(x).tickSize(0))
      .attr("color", "currentColor")
      .select(".domain")
      .attr("stroke-opacity", 0.3);
    svg
      .append("text")
      .attr("x", 8)
      .attr("y", 14)
      .attr("fill", "currentColor")
      .attr("font-size", 11)
      .text(`domain [0, ${max}]`);
  };
  return (
    <Shell
      title={title}
      hint={hint}
      controls={
        <label className="flex items-center gap-2 text-xs text-muted">
          y max
          <input type="range" min={30} max={100} value={max} onChange={(e) => setMax(+e.target.value)} />
        </label>
      }
    >
      <ChartHost key={max + color}>{draw}</ChartHost>
    </Shell>
  );
}

function AxesDemo({ title, hint, color }: { title: string; hint?: string; color: string }) {
  const [ticks, setTicks] = useState(5);
  const draw = (el: HTMLDivElement) => {
    const w = el.clientWidth || 360;
    const h = 180;
    const m = { t: 16, r: 12, b: 28, l: 36 };
    const svg = d3.select(el).append("svg").attr("width", w).attr("height", h);
    const g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);
    const iw = w - m.l - m.r;
    const ih = h - m.t - m.b;
    const x = d3.scaleLinear().domain([0, 10]).range([0, iw]);
    const y = d3.scaleLinear().domain([0, 100]).range([ih, 0]);
    g.append("g").attr("transform", `translate(0,${ih})`).call(d3.axisBottom(x).ticks(ticks));
    g.append("g").call(d3.axisLeft(y).ticks(ticks));
    g.append("circle").attr("cx", x(6)).attr("cy", y(55)).attr("r", 8).attr("fill", color);
  };
  return (
    <Shell
      title={title}
      hint={hint}
      controls={
        <label className="flex items-center gap-2 text-xs text-muted">
          ticks
          <input type="range" min={2} max={10} value={ticks} onChange={(e) => setTicks(+e.target.value)} />
        </label>
      }
    >
      <ChartHost key={ticks + color}>{draw}</ChartHost>
    </Shell>
  );
}

function ShapesDemo({ title, hint, color }: { title: string; hint?: string; color: string }) {
  const curves = [
    { id: "monotone", fn: d3.curveMonotoneX },
    { id: "linear", fn: d3.curveLinear },
    { id: "basis", fn: d3.curveBasis },
    { id: "step", fn: d3.curveStep },
  ] as const;
  const [ci, setCi] = useState(0);
  const draw = (el: HTMLDivElement) => {
    const data = d3.range(8).map((i) => ({ t: i, v: 20 + Math.sin(i) * 12 + i * 3 }));
    const w = el.clientWidth || 360;
    const h = 160;
    const m = 24;
    const svg = d3.select(el).append("svg").attr("width", w).attr("height", h);
    const x = d3.scaleLinear().domain([0, 7]).range([m, w - m]);
    const y = d3.scaleLinear().domain([0, 60]).range([h - m, m]);
    const line = d3
      .line<{ t: number; v: number }>()
      .x((d) => x(d.t))
      .y((d) => y(d.v))
      .curve(curves[ci].fn);
    svg
      .append("path")
      .datum(data)
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2.5);
    svg
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x(d.t))
      .attr("cy", (d) => y(d.v))
      .attr("r", 3.5)
      .attr("fill", color);
  };
  return (
    <Shell
      title={title}
      hint={hint}
      controls={
        <div className="flex flex-wrap gap-1">
          {curves.map((c, i) => (
            <Button key={c.id} size="sm" variant={i === ci ? "default" : "secondary"} onClick={() => setCi(i)}>
              {c.id}
            </Button>
          ))}
        </div>
      }
    >
      <ChartHost key={ci + color}>{draw}</ChartHost>
    </Shell>
  );
}

function barData() {
  return CATS.slice(0, 5).map((name, i) => ({ name, value: 15 + i * 8 + Math.round(Math.random() * 10) }));
}

function BarDemo({ title, hint, color }: { title: string; hint?: string; color: string }) {
  const [data, setData] = useState(barData);
  const draw = (el: HTMLDivElement) => {
    const w = el.clientWidth || 360;
    const h = 200;
    const m = { t: 12, r: 8, b: 28, l: 32 };
    const svg = d3.select(el).append("svg").attr("width", w).attr("height", h);
    const g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);
    const iw = w - m.l - m.r;
    const ih = h - m.t - m.b;
    const x = d3.scaleBand().domain(data.map((d) => d.name)).range([0, iw]).padding(0.2);
    const y = d3.scaleLinear().domain([0, d3.max(data, (d) => d.value)! * 1.1]).nice().range([ih, 0]);
    g.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.name)!)
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => ih - y(d.value))
      .attr("rx", 4)
      .attr("fill", color);
    g.append("g").attr("transform", `translate(0,${ih})`).call(d3.axisBottom(x));
    g.append("g").call(d3.axisLeft(y).ticks(4));
  };
  return (
    <Shell
      title={title}
      hint={hint}
      controls={<Button size="sm" variant="secondary" onClick={() => setData(barData())}>换数据</Button>}
    >
      <ChartHost key={JSON.stringify(data) + color}>{draw}</ChartHost>
    </Shell>
  );
}

function LineDemo({ title, hint, color }: { title: string; hint?: string; color: string }) {
  const [seed, setSeed] = useState(0);
  const draw = (el: HTMLDivElement) => {
    const data = d3.range(12).map((i) => ({ m: `M${i + 1}`, v: 30 + Math.sin(i / 2 + seed) * 18 + i * 2 }));
    const w = el.clientWidth || 360;
    const h = 180;
    const m = { t: 12, r: 12, b: 28, l: 32 };
    const svg = d3.select(el).append("svg").attr("width", w).attr("height", h);
    const g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);
    const iw = w - m.l - m.r;
    const ih = h - m.t - m.b;
    const x = d3.scalePoint().domain(data.map((d) => d.m)).range([0, iw]);
    const y = d3.scaleLinear().domain([0, d3.max(data, (d) => d.v)! * 1.1]).nice().range([ih, 0]);
    const line = d3.line<(typeof data)[0]>().x((d) => x(d.m)!).y((d) => y(d.v)).curve(d3.curveMonotoneX);
    g.append("path").datum(data).attr("d", line).attr("fill", "none").attr("stroke", color).attr("stroke-width", 2.5);
    g.selectAll("circle").data(data).join("circle").attr("cx", (d) => x(d.m)!).attr("cy", (d) => y(d.v)).attr("r", 3).attr("fill", color);
    g.append("g").attr("transform", `translate(0,${ih})`).call(d3.axisBottom(x).tickValues(data.filter((_, i) => i % 2 === 0).map((d) => d.m)));
    g.append("g").call(d3.axisLeft(y).ticks(4));
  };
  return (
    <Shell title={title} hint={hint} controls={<Button size="sm" variant="secondary" onClick={() => setSeed((s) => s + 1)}>扰动</Button>}>
      <ChartHost key={seed + color}>{draw}</ChartHost>
    </Shell>
  );
}

function AreaDemo({ title, hint, color }: { title: string; hint?: string; color: string }) {
  const draw = (el: HTMLDivElement) => {
    const data = d3.range(10).map((i) => ({ m: i, v: 25 + Math.sin(i / 1.5) * 15 + i }));
    const w = el.clientWidth || 360;
    const h = 170;
    const m = { t: 12, r: 12, b: 20, l: 12 };
    const svg = d3.select(el).append("svg").attr("width", w).attr("height", h);
    const g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);
    const iw = w - m.l - m.r;
    const ih = h - m.t - m.b;
    const x = d3.scaleLinear().domain([0, 9]).range([0, iw]);
    const y = d3.scaleLinear().domain([0, 60]).range([ih, 0]);
    const area = d3.area<(typeof data)[0]>().x((d) => x(d.m)).y0(ih).y1((d) => y(d.v)).curve(d3.curveMonotoneX);
    const line = d3.line<(typeof data)[0]>().x((d) => x(d.m)).y((d) => y(d.v)).curve(d3.curveMonotoneX);
    g.append("path").datum(data).attr("d", area).attr("fill", color).attr("opacity", 0.25);
    g.append("path").datum(data).attr("d", line).attr("fill", "none").attr("stroke", color).attr("stroke-width", 2);
  };
  return (
    <Shell title={title} hint={hint}>
      <ChartHost key={color}>{draw}</ChartHost>
    </Shell>
  );
}

function ScatterDemo({ title, hint, color }: { title: string; hint?: string; color: string }) {
  const [seed, setSeed] = useState(1);
  const draw = (el: HTMLDivElement) => {
    const rng = d3.randomNormal.source(d3.randomLcg(seed))(50, 15);
    const data = d3.range(40).map(() => ({ a: Math.abs(rng()), b: Math.abs(rng()), c: 4 + Math.random() * 10 }));
    const w = el.clientWidth || 360;
    const h = 200;
    const m = { t: 12, r: 12, b: 28, l: 32 };
    const svg = d3.select(el).append("svg").attr("width", w).attr("height", h);
    const g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);
    const iw = w - m.l - m.r;
    const ih = h - m.t - m.b;
    const x = d3.scaleLinear().domain([0, 100]).range([0, iw]);
    const y = d3.scaleLinear().domain([0, 100]).range([ih, 0]);
    g.append("g").attr("transform", `translate(0,${ih})`).call(d3.axisBottom(x).ticks(5));
    g.append("g").call(d3.axisLeft(y).ticks(5));
    g.selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x(d.a))
      .attr("cy", (d) => y(d.b))
      .attr("r", (d) => d.c / 2)
      .attr("fill", color)
      .attr("fill-opacity", 0.7);
  };
  return (
    <Shell title={title} hint={hint} controls={<Button size="sm" variant="secondary" onClick={() => setSeed((s) => s + 1)}>重采样</Button>}>
      <ChartHost key={seed + color}>{draw}</ChartHost>
    </Shell>
  );
}

function PieDemo({ title, hint, color }: { title: string; hint?: string; color: string }) {
  const [donut, setDonut] = useState(true);
  const draw = (el: HTMLDivElement) => {
    const data = [
      { name: "A", v: 30 },
      { name: "B", v: 22 },
      { name: "C", v: 18 },
      { name: "D", v: 15 },
      { name: "E", v: 15 },
    ];
    const w = el.clientWidth || 360;
    const h = 200;
    const svg = d3.select(el).append("svg").attr("width", w).attr("height", h);
    const g = svg.append("g").attr("transform", `translate(${w / 2},${h / 2})`);
    const pie = d3.pie<(typeof data)[0]>().value((d) => d.v).sort(null);
    const arc = d3.arc<d3.PieArcDatum<(typeof data)[0]>>().innerRadius(donut ? 48 : 0).outerRadius(80);
    const colors = d3.quantize(d3.interpolateHcl(color, "#45475a"), data.length);
    g.selectAll("path")
      .data(pie(data))
      .join("path")
      .attr("d", arc)
      .attr("fill", (_, i) => colors[i])
      .attr("stroke", "var(--color-bg)")
      .attr("stroke-width", 2);
  };
  return (
    <Shell
      title={title}
      hint={hint}
      controls={
        <Button size="sm" variant="secondary" onClick={() => setDonut((d) => !d)}>
          {donut ? "切饼图" : "切环图"}
        </Button>
      }
    >
      <ChartHost key={String(donut) + color}>{draw}</ChartHost>
    </Shell>
  );
}

function TransDemo({ title, hint, color }: { title: string; hint?: string; color: string }) {
  const [data, setData] = useState([20, 40, 30, 50, 35]);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!host.current) return;
    const el = host.current;
    const w = el.clientWidth || 360;
    const h = 170;
    let svg = d3.select(el).select<SVGSVGElement>("svg");
    if (svg.empty()) {
      el.innerHTML = "";
      svg = d3.select(el).append("svg").attr("width", w).attr("height", h);
    } else {
      svg.attr("width", w);
    }
    const x = d3.scaleBand().domain(data.map((_, i) => String(i))).range([20, w - 12]).padding(0.2);
    const y = d3.scaleLinear().domain([0, 70]).range([h - 16, 12]);
    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (_, i) => x(String(i))!)
      .attr("width", x.bandwidth())
      .attr("rx", 4)
      .attr("fill", color)
      .transition()
      .duration(500)
      .ease(d3.easeCubicOut)
      .attr("y", (d) => y(d))
      .attr("height", (d) => h - 16 - y(d));
  }, [data, color]);
  return (
    <Shell
      title={title}
      hint={hint}
      controls={
        <Button size="sm" variant="secondary" onClick={() => setData(d3.range(5).map(() => 15 + Math.round(Math.random() * 50)))}>
          过渡到新数据
        </Button>
      }
    >
      <div ref={host} className="min-h-[170px] w-full overflow-hidden rounded-lg border border-border bg-bg" />
    </Shell>
  );
}

function IxDemo({ title, hint, color }: { title: string; hint?: string; color: string }) {
  const [tip, setTip] = useState("");
  const draw = (el: HTMLDivElement) => {
    const data = CATS.slice(0, 5).map((name, i) => ({ name, value: 20 + i * 10 }));
    const w = el.clientWidth || 360;
    const h = 180;
    const m = { t: 12, r: 8, b: 28, l: 8 };
    const svg = d3.select(el).append("svg").attr("width", w).attr("height", h);
    const g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);
    const iw = w - m.l - m.r;
    const ih = h - m.t - m.b;
    const x = d3.scaleBand().domain(data.map((d) => d.name)).range([0, iw]).padding(0.2);
    const y = d3.scaleLinear().domain([0, 80]).range([ih, 0]);
    g.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.name)!)
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => ih - y(d.value))
      .attr("rx", 4)
      .attr("fill", color)
      .attr("opacity", 0.75)
      .style("cursor", "pointer")
      .on("pointerenter", function (_e, d) {
        d3.select(this).attr("opacity", 1);
        setTip(`${d.name}: ${d.value}`);
      })
      .on("pointerleave", function () {
        d3.select(this).attr("opacity", 0.75);
        setTip("");
      });
    g.append("g").attr("transform", `translate(0,${ih})`).call(d3.axisBottom(x));
  };
  return (
    <Shell title={title} hint={hint || "悬停柱子查看数值"}>
      <div className="mb-2 min-h-5 font-mono text-xs text-primary">{tip || "—"}</div>
      <ChartHost key={color}>{draw}</ChartHost>
    </Shell>
  );
}

function HierDemo({ title, hint, color }: { title: string; hint?: string; color: string }) {
  const draw = (el: HTMLDivElement) => {
    const data = {
      name: "root",
      children: [
        { name: "前端", children: [{ name: "React", value: 40 }, { name: "Vue", value: 28 }] },
        { name: "可视化", children: [{ name: "D3", value: 36 }, { name: "ECharts", value: 22 }] },
      ],
    };
    const root = d3.hierarchy(data).sum((d: any) => d.value ?? 0);
    const w = el.clientWidth || 360;
    const leaves = root.leaves();
    const x = d3.scaleBand().domain(leaves.map((d) => d.data.name)).range([40, w - 12]).padding(0.2);
    const y = d3.scaleLinear().domain([0, d3.max(leaves, (d) => d.value)!]).range([150, 20]);
    const svg = d3.select(el).append("svg").attr("width", w).attr("height", 180);
    svg
      .selectAll("rect")
      .data(leaves)
      .join("rect")
      .attr("x", (d) => x(d.data.name)!)
      .attr("y", (d) => y(d.value!))
      .attr("width", x.bandwidth())
      .attr("height", (d) => 150 - y(d.value!))
      .attr("fill", color)
      .attr("rx", 4);
    svg
      .selectAll("text")
      .data(leaves)
      .join("text")
      .attr("x", (d) => x(d.data.name)! + x.bandwidth() / 2)
      .attr("y", 168)
      .attr("text-anchor", "middle")
      .attr("fill", "currentColor")
      .attr("font-size", 11)
      .text((d) => d.data.name);
  };
  return (
    <Shell title={title} hint={hint}>
      <ChartHost key={color}>{draw}</ChartHost>
    </Shell>
  );
}

function TreeDemo({ title, hint, color }: { title: string; hint?: string; color: string }) {
  const draw = (el: HTMLDivElement) => {
    const data = {
      name: "D3",
      children: [
        { name: "Selection", children: [{ name: "join" }, { name: "on" }] },
        { name: "Scale", children: [{ name: "linear" }, { name: "band" }] },
        { name: "Shape", children: [{ name: "line" }, { name: "arc" }] },
      ],
    };
    const w = el.clientWidth || 360;
    const h = 220;
    const root = d3.hierarchy(data);
    d3.tree<typeof data>().size([h - 20, w - 100])(root);
    const svg = d3.select(el).append("svg").attr("width", w).attr("height", h);
    const g = svg.append("g").attr("transform", "translate(40,10)");
    g.selectAll("path")
      .data(root.links())
      .join("path")
      .attr(
        "d",
        d3
          .linkHorizontal<any, any>()
          .x((d) => d.y)
          .y((d) => d.x),
      )
      .attr("fill", "none")
      .attr("stroke", "var(--color-border-strong)")
      .attr("stroke-width", 1.5);
    const node = g
      .selectAll("g")
      .data(root.descendants())
      .join("g")
      .attr("transform", (d) => `translate(${d.y},${d.x})`);
    node.append("circle").attr("r", 5).attr("fill", color);
    node
      .append("text")
      .attr("dy", "0.32em")
      .attr("x", (d) => (d.children ? -8 : 8))
      .attr("text-anchor", (d) => (d.children ? "end" : "start"))
      .attr("fill", "currentColor")
      .attr("font-size", 11)
      .text((d) => d.data.name);
  };
  return (
    <Shell title={title} hint={hint}>
      <ChartHost key={color}>{draw}</ChartHost>
    </Shell>
  );
}

function ForceDemo({ title, hint, color }: { title: string; hint?: string; color: string }) {
  const draw = (el: HTMLDivElement) => {
    const nodes = d3.range(12).map((i) => ({ id: String(i) }));
    const links = d3.range(14).map((i) => ({
      source: String(i % 12),
      target: String((i * 3 + 1) % 12),
    }));
    const w = el.clientWidth || 360;
    const h = 220;
    const svg = d3.select(el).append("svg").attr("width", w).attr("height", h);
    const link = svg
      .append("g")
      .attr("stroke", "var(--color-border-strong)")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.2);
    const node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 8)
      .attr("fill", color)
      .call(
        d3
          .drag<any, any>()
          .on("start", (event, d) => {
            if (!event.active) sim.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) sim.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }) as any,
      );
    const sim = d3
      .forceSimulation(nodes as any)
      .force(
        "link",
        d3
          .forceLink(links as any)
          .id((d: any) => d.id)
          .distance(50),
      )
      .force("charge", d3.forceManyBody().strength(-160))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force("collide", d3.forceCollide(12));
    sim.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
    });
    return () => {
      sim.stop();
    };
  };
  return (
    <Shell title={title} hint={hint || "拖拽节点"}>
      <ChartHost key={color}>{draw}</ChartHost>
    </Shell>
  );
}

function PackDemo({ title, hint, color }: { title: string; hint?: string; color: string }) {
  const draw = (el: HTMLDivElement) => {
    const data = {
      name: "root",
      children: [
        { name: "A", children: [{ name: "a1", value: 20 }, { name: "a2", value: 14 }] },
        { name: "B", children: [{ name: "b1", value: 18 }, { name: "b2", value: 10 }, { name: "b3", value: 8 }] },
        { name: "C", value: 22 },
      ],
    };
    const w = el.clientWidth || 360;
    const h = 220;
    const root = d3.pack<any>().size([w, h]).padding(4)(
      d3.hierarchy(data).sum((d: any) => d.value ?? 0),
    );
    const svg = d3.select(el).append("svg").attr("width", w).attr("height", h);
    const colors = d3.quantize(d3.interpolateRgb(color, "#313244"), 4);
    svg
      .selectAll("circle")
      .data(root.descendants())
      .join("circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", (d) => d.r)
      .attr("fill", (d) => colors[d.depth] ?? color)
      .attr("fill-opacity", (d) => (d.children ? 0.25 : 0.85))
      .attr("stroke", "var(--color-border)")
      .attr("stroke-width", 1);
  };
  return (
    <Shell title={title} hint={hint}>
      <ChartHost key={color}>{draw}</ChartHost>
    </Shell>
  );
}

function RespDemo({ title, hint, color }: { title: string; hint?: string; color: string }) {
  const [pct, setPct] = useState(100);
  const draw = (el: HTMLDivElement) => {
    const full = el.parentElement?.clientWidth || 360;
    const w = Math.max(180, (full * pct) / 100);
    const h = 140;
    const data = [4, 8, 6, 10, 7];
    const svg = d3
      .select(el)
      .append("svg")
      .attr("viewBox", `0 0 ${w} ${h}`)
      .attr("width", w)
      .attr("height", h);
    const x = d3.scaleBand().domain(data.map((_, i) => String(i))).range([20, w - 8]).padding(0.2);
    const y = d3.scaleLinear().domain([0, 12]).range([h - 16, 10]);
    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (_, i) => x(String(i))!)
      .attr("y", (d) => y(d))
      .attr("width", x.bandwidth())
      .attr("height", (d) => h - 16 - y(d))
      .attr("fill", color)
      .attr("rx", 3);
  };
  return (
    <Shell
      title={title}
      hint={hint}
      controls={
        <label className="flex items-center gap-2 text-xs text-muted">
          宽度 {pct}%
          <input type="range" min={40} max={100} value={pct} onChange={(e) => setPct(+e.target.value)} />
        </label>
      }
    >
      <ChartHost key={pct + color}>{draw}</ChartHost>
    </Shell>
  );
}

function ColorDemo({ title, hint, color }: { title: string; hint?: string; color: string }) {
  const draw = (el: HTMLDivElement) => {
    const data = d3.range(12).map((i) => ({ i, v: i }));
    const w = el.clientWidth || 360;
    const h = 120;
    const scale = d3.scaleSequential(d3.interpolateTurbo).domain([0, 11]);
    const x = d3.scaleBand().domain(data.map((d) => String(d.i))).range([12, w - 12]).padding(0.08);
    const svg = d3.select(el).append("svg").attr("width", w).attr("height", h);
    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(String(d.i))!)
      .attr("y", 24)
      .attr("width", x.bandwidth())
      .attr("height", 56)
      .attr("rx", 4)
      .attr("fill", (d) => scale(d.v));
    svg
      .append("text")
      .attr("x", 12)
      .attr("y", 16)
      .attr("fill", "currentColor")
      .attr("font-size", 11)
      .text("scaleSequential · interpolateTurbo");
    void color;
  };
  return (
    <Shell title={title} hint={hint}>
      <ChartHost>{draw}</ChartHost>
    </Shell>
  );
}

function BrushDemo({ title, hint, color }: { title: string; hint?: string; color: string }) {
  const [range, setRange] = useState("拖选一段区间");
  const draw = (el: HTMLDivElement) => {
    const data = d3.range(30).map((i) => ({ x: i, y: 20 + Math.sin(i / 3) * 10 + i * 0.4 }));
    const w = el.clientWidth || 360;
    const h = 180;
    const m = { t: 12, r: 12, b: 24, l: 28 };
    const svg = d3.select(el).append("svg").attr("width", w).attr("height", h);
    const g = svg.append("g").attr("transform", `translate(${m.l},${m.t})`);
    const iw = w - m.l - m.r;
    const ih = h - m.t - m.b;
    const x = d3.scaleLinear().domain([0, 29]).range([0, iw]);
    const y = d3.scaleLinear().domain([0, 50]).range([ih, 0]);
    const dots = g
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x(d.x))
      .attr("cy", (d) => y(d.y))
      .attr("r", 4)
      .attr("fill", color)
      .attr("opacity", 0.85);
    const brush = d3
      .brushX()
      .extent([
        [0, 0],
        [iw, ih],
      ])
      .on("brush end", (event) => {
        if (!event.selection) {
          dots.attr("opacity", 0.85);
          setRange("拖选一段区间");
          return;
        }
        const [x0, x1] = event.selection.map(x.invert);
        dots.attr("opacity", (d) => (d.x >= x0 && d.x <= x1 ? 1 : 0.2));
        setRange(`x ∈ [${x0.toFixed(1)}, ${x1.toFixed(1)}]`);
      });
    g.append("g").call(brush);
  };
  return (
    <Shell title={title} hint={hint}>
      <p className="mb-2 font-mono text-xs text-primary">{range}</p>
      <ChartHost key={color}>{draw}</ChartHost>
    </Shell>
  );
}

function DashDemo({ title, hint, color }: { title: string; hint?: string; color: string }) {
  const rows = [
    { cat: "北", m: "1月", v: 20 },
    { cat: "北", m: "2月", v: 28 },
    { cat: "北", m: "3月", v: 22 },
    { cat: "南", m: "1月", v: 18 },
    { cat: "南", m: "2月", v: 24 },
    { cat: "南", m: "3月", v: 30 },
    { cat: "东", m: "1月", v: 14 },
    { cat: "东", m: "2月", v: 19 },
    { cat: "东", m: "3月", v: 25 },
  ];
  const [cat, setCat] = useState<string | null>(null);
  const draw = (el: HTMLDivElement) => {
    const filtered = cat ? rows.filter((r) => r.cat === cat) : rows;
    const byCat = d3.rollup(
      filtered,
      (v) => d3.sum(v, (d) => d.v),
      (d) => d.cat,
    );
    const barData = Array.from(byCat, ([name, value]) => ({ name, value }));
    const byM = d3.rollup(
      filtered,
      (v) => d3.mean(v, (d) => d.v) ?? 0,
      (d) => d.m,
    );
    const lineData = Array.from(byM, ([m, v]) => ({ m, v }));
    const w = el.clientWidth || 360;
    const h = 220;
    const svg = d3.select(el).append("svg").attr("width", w).attr("height", h);
    // bars left
    const g1 = svg.append("g").attr("transform", "translate(28,12)");
    const bw = w / 2 - 40;
    const bh = 90;
    const x = d3.scaleBand().domain(barData.map((d) => d.name)).range([0, bw]).padding(0.25);
    const y = d3.scaleLinear().domain([0, d3.max(barData, (d) => d.value)!]).range([bh, 0]);
    g1.selectAll("rect")
      .data(barData)
      .join("rect")
      .attr("x", (d) => x(d.name)!)
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => bh - y(d.value))
      .attr("fill", color)
      .attr("rx", 3)
      .style("cursor", "pointer")
      .on("click", (_e, d) => setCat((c) => (c === d.name ? null : d.name)));
    g1.append("g").attr("transform", `translate(0,${bh})`).call(d3.axisBottom(x));
    // line right
    const g2 = svg.append("g").attr("transform", `translate(${w / 2 + 10},12)`);
    const lw = w / 2 - 30;
    const x2 = d3.scalePoint().domain(lineData.map((d) => d.m)).range([0, lw]);
    const y2 = d3.scaleLinear().domain([0, 35]).range([bh, 0]);
    const line = d3.line<(typeof lineData)[0]>().x((d) => x2(d.m)!).y((d) => y2(d.v)).curve(d3.curveMonotoneX);
    g2.append("path").datum(lineData).attr("d", line).attr("fill", "none").attr("stroke", color).attr("stroke-width", 2);
    g2.selectAll("circle").data(lineData).join("circle").attr("cx", (d) => x2(d.m)!).attr("cy", (d) => y2(d.v)).attr("r", 3.5).attr("fill", color);
    g2.append("g").attr("transform", `translate(0,${bh})`).call(d3.axisBottom(x2));
    svg
      .append("text")
      .attr("x", 28)
      .attr("y", h - 12)
      .attr("fill", "currentColor")
      .attr("font-size", 11)
      .text(cat ? `过滤：${cat}（再点取消）` : "点击柱体过滤右侧趋势");
  };
  return (
    <Shell title={title} hint={hint}>
      <ChartHost key={(cat ?? "all") + color}>{draw}</ChartHost>
    </Shell>
  );
}

function ModDemo({ title, hint, color }: { title: string; hint?: string; color: string }) {
  const [n, setN] = useState(5);
  const draw = (el: HTMLDivElement) => {
    // mini reusable chart function
    function barChart(node: HTMLElement, values: number[]) {
      const root = d3.select(node);
      root.selectAll("*").remove();
      const w = node.clientWidth || 360;
      const h = 150;
      const svg = root.append("svg").attr("width", w).attr("height", h);
      const x = d3.scaleBand().domain(values.map((_, i) => String(i))).range([16, w - 8]).padding(0.2);
      const y = d3.scaleLinear().domain([0, d3.max(values)! * 1.15]).range([h - 12, 10]);
      svg
        .selectAll("rect")
        .data(values)
        .join("rect")
        .attr("x", (_, i) => x(String(i))!)
        .attr("y", (d) => y(d))
        .attr("width", x.bandwidth())
        .attr("height", (d) => h - 12 - y(d))
        .attr("fill", color)
        .attr("rx", 4);
    }
    barChart(
      el,
      d3.range(n).map((i) => 10 + i * 6),
    );
  };
  return (
    <Shell
      title={title}
      hint={hint}
      controls={
        <>
          <Button size="sm" variant="secondary" onClick={() => setN((v) => Math.min(10, v + 1))}>
            加柱
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setN((v) => Math.max(2, v - 1))}>
            减柱
          </Button>
        </>
      }
    >
      <ChartHost key={n + color}>{draw}</ChartHost>
    </Shell>
  );
}

function PerfDemo({ title, hint, color }: { title: string; hint?: string; color: string }) {
  const [mode, setMode] = useState<"smart" | "naive">("smart");
  const [tick, setTick] = useState(0);
  const host = useRef<HTMLDivElement>(null);
  const dataRef = useRef(d3.range(40).map((i) => ({ id: i, v: 10 + Math.random() * 40 })));
  useEffect(() => {
    if (!host.current) return;
    const el = host.current;
    const w = el.clientWidth || 360;
    const h = 160;
    const data = dataRef.current.map((d) => ({ ...d, v: 10 + Math.random() * 40 }));
    dataRef.current = data;
    if (mode === "naive") {
      el.innerHTML = "";
      const svg = d3.select(el).append("svg").attr("width", w).attr("height", h);
      const x = d3.scaleBand().domain(data.map((d) => String(d.id))).range([8, w - 8]).padding(0.1);
      const y = d3.scaleLinear().domain([0, 55]).range([h - 8, 8]);
      svg
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (d) => x(String(d.id))!)
        .attr("y", (d) => y(d.v))
        .attr("width", x.bandwidth())
        .attr("height", (d) => h - 8 - y(d.v))
        .attr("fill", color);
    } else {
      let svg = d3.select(el).select<SVGSVGElement>("svg");
      if (svg.empty()) {
        el.innerHTML = "";
        svg = d3.select(el).append("svg").attr("width", w).attr("height", h);
      }
      const x = d3.scaleBand().domain(data.map((d) => String(d.id))).range([8, w - 8]).padding(0.1);
      const y = d3.scaleLinear().domain([0, 55]).range([h - 8, 8]);
      svg
        .selectAll("rect")
        .data(data, (d: any) => d.id)
        .join("rect")
        .attr("x", (d) => x(String(d.id))!)
        .attr("width", x.bandwidth())
        .attr("fill", color)
        .transition()
        .duration(250)
        .attr("y", (d) => y(d.v))
        .attr("height", (d) => h - 8 - y(d.v));
    }
  }, [mode, tick, color]);
  return (
    <Shell
      title={title}
      hint={hint}
      controls={
        <>
          <Button size="sm" variant={mode === "smart" ? "default" : "secondary"} onClick={() => setMode("smart")}>
            高效 join
          </Button>
          <Button size="sm" variant={mode === "naive" ? "default" : "secondary"} onClick={() => setMode("naive")}>
            全量重建
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setTick((t) => t + 1)}>
            更新一帧
          </Button>
        </>
      }
    >
      <div ref={host} className="min-h-[160px] w-full overflow-hidden rounded-lg border border-border bg-bg" />
    </Shell>
  );
}
