import { createFileRoute, Link } from "@tanstack/react-router";
import { DOC_SECTIONS, docsCoverage } from "@/data/docs-map";
import { LESSONS } from "@/data/lessons";
import { BookOpen, ExternalLink, Library, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/docs")({
  component: DocsMapPage,
});

function DocsMapPage() {
  const [q, setQ] = useState("");
  const cov = docsCoverage();
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  const llms = `${base}/llms.txt`;
  const llmsFull = `${base}/llms-full.txt`;

  const sections = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return DOC_SECTIONS;
    return DOC_SECTIONS.map((sec) => ({
      ...sec,
      items: sec.items.filter(
        (it) =>
          it.title.toLowerCase().includes(s) ||
          (it.lessonSlug ?? "").includes(s) ||
          (it.note ?? "").toLowerCase().includes(s),
      ),
    })).filter((sec) => sec.items.length > 0);
  }, [q]);

  return (
    <div className="mx-auto max-w-3xl pb-16">
      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <Library className="h-3.5 w-3.5" />
          v2 · 文档地图
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg sm:text-3xl">
          d3js.org 对照
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          <a href="https://d3js.org" target="_blank" rel="noreferrer" className="text-primary no-underline hover:underline">d3js.org</a>
          {" "}
          暂无官方 <code className="font-mono text-xs">llms.txt</code>
          （Observable 站级另有索引）。API 以 d3js.org 为准；本站发布{" "}
          <a href={llms} className="text-primary no-underline hover:underline">
            llms.txt
          </a>{" "}
          /{" "}
          <a href={llmsFull} className="text-primary no-underline hover:underline">
            llms-full.txt
          </a>
          。
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="h-2 min-w-[8rem] flex-1 overflow-hidden rounded-full bg-surface-3 sm:max-w-xs">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${cov.pct}%` }}
            />
          </div>
          <span className="font-mono text-xs text-muted">
            已映射 {cov.linked}/{cov.total} · 本站 {LESSONS.length} 课
          </span>
        </div>
      </header>

      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索官方章节或本站 slug…"
          className="h-11 w-full rounded-lg border border-border bg-surface pl-10 pr-3 text-sm text-fg placeholder:text-subtle"
        />
      </div>

      <div className="space-y-8">
        {sections.map((sec) => (
          <section key={sec.id}>
            <h2 className="font-display text-lg font-semibold text-fg">{sec.title}</h2>
            <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-surface">
              {sec.items.map((it) => {
                const lesson = it.lessonSlug
                  ? LESSONS.find((l) => l.slug === it.lessonSlug)
                  : undefined;
                return (
                  <li
                    key={sec.id + it.title + (it.lessonSlug ?? "")}
                    className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-fg">{it.title}</p>
                      {it.note ? (
                        <p className="mt-0.5 text-xs text-muted">{it.note}</p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <a
                        href={it.official}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-[11px] text-muted no-underline hover:text-fg"
                      >
                        官网
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      {lesson ? (
                        <Link
                          to="/lesson/$slug"
                          params={{ slug: lesson.slug }}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-medium text-primary no-underline",
                          )}
                        >
                          <BookOpen className="h-3 w-3" />
                          本站课
                        </Link>
                      ) : (
                        <span className="rounded-full bg-surface-3 px-2.5 py-1 text-[11px] text-subtle">
                          待映射
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
