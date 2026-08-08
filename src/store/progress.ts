import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WrongItem = {
  id: string;
  lessonSlug: string;
  question: string;
  options: string[];
  answer: number;
  explain: string;
  wrongChoice: number;
  at: number;
};

type ProgressState = {
  completed: string[];
  quizScores: Record<string, number>;
  bookmarks: string[];
  notes: Record<string, string>;
  wrongBook: WrongItem[];
  /** YYYY-MM-DD check-in dates */
  checkIns: string[];
  streak: number;
  markComplete: (slug: string) => void;
  setQuizScore: (slug: string, score: number) => void;
  toggleBookmark: (slug: string) => void;
  setNote: (slug: string, text: string) => void;
  addWrong: (item: Omit<WrongItem, "at">) => void;
  clearWrong: (id: string) => void;
  clearAllWrong: () => void;
  checkInToday: () => void;
  reset: () => void;
};

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function computeStreak(checkIns: string[]): number {
  if (checkIns.length === 0) return 0;
  const set = new Set(checkIns);
  let streak = 0;
  const cursor = new Date();
  // If not checked in today, start from yesterday (streak still valid until end of day)
  if (!set.has(todayKey())) {
    cursor.setDate(cursor.getDate() - 1);
  }
  for (;;) {
    const y = cursor.getFullYear();
    const m = String(cursor.getMonth() + 1).padStart(2, "0");
    const day = String(cursor.getDate()).padStart(2, "0");
    const key = `${y}-${m}-${day}`;
    if (!set.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      completed: [],
      quizScores: {},
      bookmarks: [],
      notes: {},
      wrongBook: [],
      checkIns: [],
      streak: 0,
      markComplete: (slug) =>
        set((s) =>
          s.completed.includes(slug)
            ? s
            : { completed: [...s.completed, slug] },
        ),
      setQuizScore: (slug, score) =>
        set((s) => ({
          quizScores: { ...s.quizScores, [slug]: score },
        })),
      toggleBookmark: (slug) =>
        set((s) => ({
          bookmarks: s.bookmarks.includes(slug)
            ? s.bookmarks.filter((b) => b !== slug)
            : [...s.bookmarks, slug],
        })),
      setNote: (slug, text) =>
        set((s) => ({
          notes: { ...s.notes, [slug]: text },
        })),
      addWrong: (item) =>
        set((s) => {
          const filtered = s.wrongBook.filter((w) => w.id !== item.id);
          return {
            wrongBook: [{ ...item, at: Date.now() }, ...filtered].slice(0, 80),
          };
        }),
      clearWrong: (id) =>
        set((s) => ({
          wrongBook: s.wrongBook.filter((w) => w.id !== id),
        })),
      clearAllWrong: () => set({ wrongBook: [] }),
      checkInToday: () => {
        const key = todayKey();
        const { checkIns } = get();
        if (checkIns.includes(key)) {
          set({ streak: computeStreak(checkIns) });
          return;
        }
        const next = [...checkIns, key];
        set({ checkIns: next, streak: computeStreak(next) });
        void yesterdayKey;
      },
      reset: () =>
        set({
          completed: [],
          quizScores: {},
          bookmarks: [],
          notes: {},
          wrongBook: [],
          checkIns: [],
          streak: 0,
        }),
    }),
    {
      name: "d3-learn-progress-v2",
      version: 2,
      migrate: (persisted) => {
        const p = (persisted ?? {}) as Partial<ProgressState>;
        return {
          completed: p.completed ?? [],
          quizScores: p.quizScores ?? {},
          bookmarks: p.bookmarks ?? [],
          notes: p.notes ?? {},
          wrongBook: p.wrongBook ?? [],
          checkIns: p.checkIns ?? [],
          streak: p.streak ?? 0,
        };
      },
    },
  ),
);

export { todayKey, computeStreak };
