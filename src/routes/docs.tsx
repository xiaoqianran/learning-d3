import { createFileRoute, Link } from "@tanstack/react-router";
import { LESSONS } from "@/data/lessons";
import { ExternalLink, Library } from "lucide-react";

export const Route = createFileRoute("/docs")({
  component: DocsPage,
});

const OFFICIAL = [
  { title: "What is D3?", href: "https://d3js.org/what-is-d3", topic: "intro" },
  { title: "d3-selection", href: "https://d3js.org/d3-selection", topic: "selection" },
  { title: "Joining data", href: "https://d3js.org/d3-selection/joining", topic: "data-join" },
  { title: "d3-scale", href: "https://d3js.org/d3-scale", topic: "scales" },
  { title: "d3-axis", href: "https://d3js.org/d3-axis", topic: "axes" },
  { title: "d3-shape", href: "https://d3js.org/d3-shape", topic: "svg-shapes" },
  { title: "d3-transition", href: "https://d3js.org/d3-transition", topic: "transitions" },
  { title: "d3-hierarchy", href: "https://d3js.org/d3-hierarchy", topic: "hierarchy" },
  { title: "d3-force", href: "https://d3js.org/d3-force", topic: "force" },
  { title: "d3-brush", href: "https://d3js.org/d3-brush", topic: "brush" },
  { title: "d3-zoom", href: "https://d3js.org/d3-zoom", topic: "brush" },
  { title: "Gallery", href: "https://observablehq.com/@d3/gallery", topic: "dashboard" },
];

function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl pb-16">
      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <Library className="h-3.5 w-3.5" />
          文档地图
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg">官网 ↔ 本站课程</h1>
        <p className="mt-1 text-sm text-muted">对照 d3js.org，按需跳转到对应小节</p>
      </header>

      <ul className="space-y-2">
        {OFFICIAL.map((item) => {
          const lesson = LESSONS.find((l) => l.slug === item.topic);
          return (
            <li
              key={item.href}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3"
            >
              <div>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-fg no-underline hover:text-primary"
                >
                  {item.title}
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </a>
                <p className="mt-0.5 font-mono text-[11px] text-subtle">{item.href.replace("https://", "")}</p>
              </div>
              {lesson ? (
                <Link
                  to="/lesson/$slug"
                  params={{ slug: lesson.slug }}
                  className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary no-underline"
                >
                  本站：{lesson.title}
                </Link>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
