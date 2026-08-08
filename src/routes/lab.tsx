import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { getAllQuizQuestions } from "@/data/lessons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useProgress } from "@/store/progress";
import { FlaskConical, Shuffle } from "lucide-react";

export const Route = createFileRoute("/lab")({
  component: LabPage,
});

function LabPage() {
  const all = useMemo(() => getAllQuizQuestions(), []);
  const [seed, setSeed] = useState(0);
  const pack = useMemo(() => {
    const arr = [...all];
    // deterministic shuffle by seed
    let s = seed + 1;
    for (let i = arr.length - 1; i > 0; i--) {
      s = (s * 16807) % 2147483647;
      const j = s % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, 5);
  }, [all, seed]);

  const [idx, setIdx] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const checkInToday = useProgress((s) => s.checkInToday);
  const addWrong = useProgress((s) => s.addWrong);

  const current = pack[idx];

  function resetRound(nextSeed?: number) {
    setSeed((s) => nextSeed ?? s + 1);
    setIdx(0);
    setChoice(null);
    setRevealed(false);
    setScore(0);
    setDone(false);
  }

  function submit() {
    if (choice === null || !current) return;
    setRevealed(true);
    const ok = choice === current.answer;
    if (ok) setScore((s) => s + 1);
    else {
      addWrong({
        id: `lab:${current.id}:${Date.now()}`,
        lessonSlug: current.lessonSlug,
        question: current.question,
        options: current.options,
        answer: current.answer,
        explain: current.explain,
        wrongChoice: choice,
      });
    }
  }

  function next() {
    if (idx >= pack.length - 1) {
      setDone(true);
      checkInToday();
      return;
    }
    setIdx((i) => i + 1);
    setChoice(null);
    setRevealed(false);
  }

  return (
    <div className="mx-auto max-w-2xl pb-16">
      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
          <FlaskConical className="h-3.5 w-3.5" />
          练习场
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-fg">
          综合抽题挑战
        </h1>
        <p className="mt-1 text-sm text-muted">
          从全部课程随机 5 题，检验掌握程度
        </p>
      </header>

      {done ? (
        <section className="rounded-xl border border-border bg-surface p-6 text-center">
          <p className="font-mono text-3xl font-semibold text-primary">
            {score}/{pack.length}
          </p>
          <p className="mt-2 text-sm text-muted">
            {score === pack.length
              ? "全对，状态拉满"
              : "错题已进入错题本，可去复习"}
          </p>
          <Button className="mt-5" onClick={() => resetRound()}>
            <Shuffle className="h-4 w-4" />
            再来一组
          </Button>
        </section>
      ) : current ? (
        <section className="rounded-xl border border-border bg-surface p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between text-xs text-muted">
            <span>
              第 {idx + 1} / {pack.length} 题
            </span>
            <span className="text-primary">{current.lessonTitle}</span>
          </div>
          <p className="text-base font-medium text-fg">{current.question}</p>
          <div className="mt-4 grid gap-2">
            {current.options.map((opt, oi) => {
              let cls =
                "border-border bg-surface-2 hover:border-border-strong";
              if (revealed) {
                if (oi === current.answer)
                  cls = "border-primary/50 bg-primary-soft";
                else if (oi === choice) cls = "border-danger/40 bg-danger/10";
                else cls = "border-border bg-surface-2 opacity-70";
              } else if (choice === oi) {
                cls = "border-primary bg-primary-soft";
              }
              return (
                <button
                  key={oi}
                  type="button"
                  disabled={revealed}
                  onClick={() => setChoice(oi)}
                  className={cn(
                    "rounded-md border px-3 py-2.5 text-left text-sm transition-colors",
                    cls,
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {revealed ? (
            <p className="mt-3 text-sm text-muted">{current.explain}</p>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-2">
            {!revealed ? (
              <Button onClick={submit} disabled={choice === null}>
                确认
              </Button>
            ) : (
              <Button onClick={next}>
                {idx >= pack.length - 1 ? "查看成绩" : "下一题"}
              </Button>
            )}
            <Button variant="ghost" onClick={() => resetRound()}>
              换一组
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
