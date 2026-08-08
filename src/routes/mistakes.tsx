import { createFileRoute, Link } from "@tanstack/react-router";
import { useProgress } from "@/store/progress";
import { LESSONS } from "@/data/lessons";
import { Button } from "@/components/ui/button";
import { BookX, Trash2 } from "lucide-react";

export const Route = createFileRoute("/mistakes")({
  component: MistakesPage,
});

function MistakesPage() {
  const wrongBook = useProgress((s) => s.wrongBook);
  const clearWrong = useProgress((s) => s.clearWrong);
  const clearAllWrong = useProgress((s) => s.clearAllWrong);

  return (
    <div className="mx-auto max-w-2xl pb-16">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
            <BookX className="h-3.5 w-3.5" />
            错题本
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-fg">
            复习错题
          </h1>
          <p className="mt-1 text-sm text-muted">
            测验与练习场答错的题目会自动收录
          </p>
        </div>
        {wrongBook.length > 0 ? (
          <Button variant="secondary" size="sm" onClick={() => clearAllWrong()}>
            清空全部
          </Button>
        ) : null}
      </header>

      {wrongBook.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-4 py-12 text-center">
          <p className="text-sm text-muted">暂无错题，去测验或练习场练练手</p>
          <Link
            to="/lab"
            className="mt-3 inline-block text-sm text-primary no-underline hover:underline"
          >
            打开练习场
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {wrongBook.map((item) => {
            const lesson = LESSONS.find((l) => l.slug === item.lessonSlug);
            return (
              <li
                key={item.id}
                className="rounded-xl border border-border bg-surface p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-primary">
                      {lesson?.title ?? item.lessonSlug}
                    </p>
                    <p className="mt-1 text-sm font-medium text-fg">
                      {item.question}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => clearWrong(item.id)}
                    className="shrink-0 text-muted hover:text-danger"
                    aria-label="移除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 space-y-1 text-xs">
                  <p className="text-warn">
                    你的选择：{item.options[item.wrongChoice]}
                  </p>
                  <p className="text-primary">
                    正确：{item.options[item.answer]}
                  </p>
                  <p className="text-muted">{item.explain}</p>
                </div>
                <Link
                  to="/lesson/$slug"
                  params={{ slug: item.lessonSlug }}
                  className="mt-3 inline-block text-xs text-muted no-underline hover:text-primary"
                >
                  回到对应课程
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
