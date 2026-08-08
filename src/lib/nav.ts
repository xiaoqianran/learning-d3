import {
  Award,
  BookMarked,
  BookOpen,
  BookX,
  Code2,
  FlaskConical,
  LayoutDashboard,
  Library,
  Server,
  type LucideIcon,
} from "lucide-react";
import type { Lesson } from "@/data/lessons";
import { LESSONS, TRACKS } from "@/data/lessons";

export const TRACK_META: Record<
  Lesson["track"],
  { order: number; label: string; blurb: string }
> = {
  基础: { order: 1, label: "① 入门", blurb: "选择 · join · 比例尺 · 坐标轴" },
  图表: { order: 2, label: "② 常用图表", blurb: "柱 · 线 · 面 · 散点 · 饼" },
  布局: { order: 3, label: "③ 布局算法", blurb: "树 · 力导向 · pack" },
  交互进阶: { order: 4, label: "④ 交互进阶", blurb: "响应式 · 色带 · 刷选 · 仪表盘" },
  工程化: { order: 5, label: "⑤ 工程化", blurb: "模块封装 · 性能 · 实践" },
};

export function trackLabel(track: string) {
  return (TRACK_META as Record<string, { label: string }>)[track]?.label ?? track;
}

export function orderedTracks(): Lesson["track"][] {
  return [...TRACKS].sort(
    (a, b) =>
      ((TRACK_META as Record<string, { order: number }>)[a]?.order ?? 99) -
      ((TRACK_META as Record<string, { order: number }>)[b]?.order ?? 99),
  );
}

export function getValidCompleted(completed: string[]): string[] {
  const set = new Set(LESSONS.map((l) => l.slug));
  return completed.filter((s) => set.has(s));
}

export function completedCount(completed: string[]): number {
  return getValidCompleted(completed).length;
}

export function progressPercent(completed: string[]): number {
  if (!LESSONS.length) return 0;
  return Math.round((completedCount(completed) / LESSONS.length) * 100);
}

export function isAllComplete(completed: string[]): boolean {
  return LESSONS.every((l) => completed.includes(l.slug));
}

export function getContinueLesson(completed: string[]): Lesson {
  return (
    LESSONS.find((l) => !completed.includes(l.slug)) ??
    LESSONS[LESSONS.length - 1]!
  );
}

export function getContinueHref(completed: string[]): {
  kind: "lesson" | "certificate";
  slug?: string;
} {
  if (isAllComplete(completed)) return { kind: "certificate" };
  return { kind: "lesson", slug: getContinueLesson(completed).slug };
}

export type NavItem = {
  to:
    | "/"
    | "/docs"
    | "/cheatsheet"
    | "/studio"
    | "/playground"
    | "/lab"
    | "/hub"
    | "/mistakes"
    | "/certificate";
  label: string;
  hint?: string;
  icon: LucideIcon;
};

export const NAV_PRIMARY: NavItem[] = [
  { to: "/docs", label: "文档", hint: "查 · d3js.org 对照", icon: Library },
  { to: "/studio", label: "工坊", hint: "练 · 图表挑战", icon: Server },
  { to: "/hub", label: "进度", hint: "我 · 学习中心", icon: LayoutDashboard },
];

export const NAV_TOOLS: NavItem[] = [
  { to: "/cheatsheet", label: "速查表", hint: "API 扫一眼", icon: BookMarked },
  { to: "/playground", label: "Playground", hint: "D3 试验场", icon: Code2 },
  { to: "/lab", label: "练习场", hint: "刷测验题", icon: FlaskConical },
  { to: "/mistakes", label: "错题本", hint: "错题重练", icon: BookX },
  { to: "/certificate", label: "结业证书", hint: "掌握后解锁", icon: Award },
];

export const NAV_HOME: NavItem = {
  to: "/",
  label: "学 · 首页",
  hint: "路径与大纲",
  icon: BookOpen,
};
