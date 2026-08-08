import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Button } from "@/components/ui/button";
import { Code2, Play, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/playground")({
  component: PlaygroundPage,
});

const PRESETS: { id: string; label: string; code: string }[] = [
  {
    id: "bars",
    label: "柱状图",
    code: `// 可用: d3, svg, width, height
const data = [12, 28, 18, 32, 24, 30];
const m = { t: 16, r: 16, b: 24, l: 32 };
const w = width - m.l - m.r;
const h = height - m.t - m.b;
const g = svg.append("g").attr("transform", \`translate(\${m.l},\${m.t})\`);
const x = d3.scaleBand().domain(data.map((_,i)=>String(i))).range([0,w]).padding(0.2);
const y = d3.scaleLinear().domain([0, d3.max(data)]).nice().range([h,0]);
g.selectAll("rect").data(data).join("rect")
  .attr("x", (_,i)=>x(String(i)))
  .attr("y", d=>y(d))
  .attr("width", x.bandwidth())
  .attr("height", d=>h-y(d))
  .attr("fill", "var(--color-primary)")
  .attr("rx", 4);
g.append("g").attr("transform", \`translate(0,\${h})\`).call(d3.axisBottom(x));
g.append("g").call(d3.axisLeft(y).ticks(5));`,
  },
  {
    id: "line",
    label: "折线",
    code: `const data = d3.range(12).map(i => ({t:i, v: 20+Math.sin(i/2)*12+i*2}));
const m = { t: 16, r: 16, b: 24, l: 32 };
const w = width - m.l - m.r, h = height - m.t - m.b;
const g = svg.append("g").attr("transform", \`translate(\${m.l},\${m.t})\`);
const x = d3.scaleLinear().domain([0,11]).range([0,w]);
const y = d3.scaleLinear().domain([0,50]).range([h,0]);
const line = d3.line().x(d=>x(d.t)).y(d=>y(d.v)).curve(d3.curveMonotoneX);
g.append("path").datum(data).attr("d", line)
  .attr("fill","none").attr("stroke","var(--color-primary)").attr("stroke-width",2.5);
g.append("g").attr("transform", \`translate(0,\${h})\`).call(d3.axisBottom(x).ticks(6));
g.append("g").call(d3.axisLeft(y).ticks(5));`,
  },
  {
    id: "force",
    label: "力导向",
    code: `const nodes = d3.range(10).map(i => ({id:String(i)}));
const links = d3.range(12).map(i => ({source:String(i%10), target:String((i*3+1)%10)}));
const link = svg.append("g").attr("stroke","var(--color-border-strong)")
  .selectAll("line").data(links).join("line");
const node = svg.append("g").selectAll("circle").data(nodes).join("circle")
  .attr("r", 8).attr("fill","var(--color-primary)");
const sim = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d=>d.id).distance(50))
  .force("charge", d3.forceManyBody().strength(-160))
  .force("center", d3.forceCenter(width/2, height/2));
sim.on("tick", () => {
  link.attr("x1",d=>d.source.x).attr("y1",d=>d.source.y)
      .attr("x2",d=>d.target.x).attr("y2",d=>d.target.y);
  node.attr("cx",d=>d.x).attr("cy",d=>d.y);
});`,
  },
];

function PlaygroundPage() {
  const [code, setCode] = useState(PRESETS[0].code);
  const [err, setErr] = useState<string | null>(null);
  const host = useRef<HTMLDivElement>(null);

  function run(src: string) {
    if (!host.current) return;
    setErr(null);
    const el = host.current;
    el.innerHTML = "";
    const width = el.clientWidth || 480;
    const height = 320;
    const svg = d3.select(el).append("svg").attr("width", width).attr("height", height);
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function("d3", "svg", "width", "height", src);
      fn(d3, svg, width, height);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  }

  useEffect(() => {
    run(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-5xl pb-16">
      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <Code2 className="h-3.5 w-3.5" />
          Playground
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg">D3 在线实验场</h1>
        <p className="mt-1 text-sm text-muted">
          注入变量：d3、svg、width、height。写完点运行。
        </p>
      </header>

      <div className="mb-3 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <Button
            key={p.id}
            size="sm"
            variant="secondary"
            onClick={() => {
              setCode(p.code);
              run(p.code);
            }}
          >
            {p.label}
          </Button>
        ))}
        <Button size="sm" onClick={() => run(code)}>
          <Play className="h-3.5 w-3.5" />
          运行
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setCode(PRESETS[0].code);
            run(PRESETS[0].code);
          }}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          重置
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          className="min-h-[320px] w-full rounded-xl border border-border bg-code-bg p-4 font-mono text-[13px] leading-relaxed text-code-fg"
        />
        <div>
          <div
            ref={host}
            className="min-h-[320px] overflow-hidden rounded-xl border border-border bg-bg"
          />
          {err ? (
            <p className="mt-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 font-mono text-xs text-danger">
              {err}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
