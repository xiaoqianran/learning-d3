import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LESSONS } from "@/data/lessons";

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
  visited: string[];
  completed: string[];
  mastered: string[];
  quizScores: Record<string, number>;
  bookmarks: string[];
  notes: Record<string, string>;
  wrongBook: WrongItem[];
  checkIns: string[];
  streak: number;
  studioDone: string[];
  markVisited: (slug: string) => void;
  markComplete: (slug: string) => void;
  markMastered: (slug: string) => void;
  markStudio: (id: string) => void;
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
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function computeStreak(checkIns: string[]): number {
  if (!checkIns.length) return 0;
  const set = new Set(checkIns);
  let streak = 0;
  const cursor = new Date();
  if (!set.has(todayKey())) cursor.setDate(cursor.getDate() - 1);
  for (;;) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    if (!set.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function uniqPush(list: string[], slug: string) {
  return list.includes(slug) ? list : [...list, slug];
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      visited: [],
      completed: [],
      mastered: [],
      quizScores: {},
      bookmarks: [],
      notes: {},
      wrongBook: [],
      checkIns: [],
      streak: 0,
      studioDone: [],
      markVisited: (slug) => set((s) => ({ visited: uniqPush(s.visited, slug) })),
      markComplete: (slug) =>
        set((s) => ({
          visited: uniqPush(s.visited, slug),
          completed: uniqPush(s.completed, slug),
        })),
      markMastered: (slug) =>
        set((s) => ({
          visited: uniqPush(s.visited, slug),
          completed: uniqPush(s.completed, slug),
          mastered: uniqPush(s.mastered, slug),
        })),
      markStudio: (id) => set((s) => ({ studioDone: uniqPush(s.studioDone, id) })),
      setQuizScore: (slug, score) =>
        set((s) => ({ quizScores: { ...s.quizScores, [slug]: score } })),
      toggleBookmark: (slug) =>
        set((s) => ({
          bookmarks: s.bookmarks.includes(slug)
            ? s.bookmarks.filter((b) => b !== slug)
            : [...s.bookmarks, slug],
        })),
      setNote: (slug, text) => set((s) => ({ notes: { ...s.notes, [slug]: text } })),
      addWrong: (item) =>
        set((s) => ({
          wrongBook: [
            { ...item, at: Date.now() },
            ...s.wrongBook.filter((w) => w.id !== item.id),
          ].slice(0, 80),
        })),
      clearWrong: (id) =>
        set((s) => ({ wrongBook: s.wrongBook.filter((w) => w.id !== id) })),
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
      },
      reset: () =>
        set({
          visited: [],
          completed: [],
          mastered: [],
          quizScores: {},
          bookmarks: [],
          notes: {},
          wrongBook: [],
          checkIns: [],
          streak: 0,
          studioDone: [],
        }),
    }),
    {
      name: "d3-learn-progress-v2",
      version: 2,
      migrate: (persisted) => {
        const p = (persisted ?? {}) as Partial<ProgressState>;
        const completed = p.completed ?? [];
        return {
          visited: p.visited ?? completed,
          completed,
          mastered: p.mastered ?? [],
          quizScores: p.quizScores ?? {},
          bookmarks: p.bookmarks ?? [],
          notes: p.notes ?? {},
          wrongBook: p.wrongBook ?? [],
          checkIns: p.checkIns ?? [],
          streak: p.streak ?? 0,
          studioDone: p.studioDone ?? [],
        };
      },
    },
  ),
);

export { todayKey, computeStreak };

export function isCertificateReady(mastered: string[], completed?: string[]) {
  if (mastered.length > 0) {
    return LESSONS.every((l) => mastered.includes(l.slug));
  }
  if (completed) return LESSONS.every((l) => completed.includes(l.slug));
  return false;
}
