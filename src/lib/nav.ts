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

/** 用户向路径命名（序号 + 短名） */
export const TRACK_META: Record<Lesson["track"], { order: number; label: string; blurb: string }> =
  {
    基础: { order: 1, label: "① 入门", blurb: "选择 · join · 比例尺 · 坐标轴" },
    图表: { order: 2, label: "② 常用图表", blurb: "柱 · 线 · 面 · 散点 · 饼" },
    布局: { order: 3, label: "③ 布局算法", blurb: "树 · 力导向 · pack" },
    交互进阶: { order: 4, label: "④ 交互进阶", blurb: "响应式 · 色带 · 刷选 · 仪表盘" },
    工程化: { order: 5, label: "⑤ 工程化", blurb: "模块封装 · 性能 · 实践" },
  };

export function trackLabel(track: Lesson["track"]) {
  return TRACK_META[track]?.label ?? track;
}

export function orderedTracks(): Lesson["track"][] {
  return [...TRACKS].sort((a, b) => (TRACK_META[a]?.order ?? 99) - (TRACK_META[b]?.order ?? 99));
}

export function getContinueLesson(completed: string[]): Lesson {
  return LESSONS.find((l) => !completed.includes(l.slug)) ?? LESSONS[0]!;
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

/** 顶栏主导航：学 / 查 / 练 / 我 */
export const NAV_PRIMARY: NavItem[] = [
  { to: "/docs", label: "查 · 文档", hint: "官网对照", icon: Library },
  { to: "/studio", label: "练 · 工坊", hint: "图表闯关", icon: Server },
  { to: "/hub", label: "我 · 进度", hint: "学习中心", icon: LayoutDashboard },
];

/** 更多工具（侧栏分组 + 顶栏下拉） */
export const NAV_TOOLS: NavItem[] = [
  { to: "/cheatsheet", label: "速查表", hint: "写码时扫一眼", icon: BookMarked },
  { to: "/playground", label: "Playground", hint: "在线写 D3", icon: Code2 },
  { to: "/lab", label: "练习场", hint: "刷测验题", icon: FlaskConical },
  { to: "/mistakes", label: "错题本", hint: "错题重练", icon: BookX },
  { to: "/certificate", label: "结业证书", hint: "全部完成后解锁", icon: Award },
];

export const NAV_HOME: NavItem = {
  to: "/",
  label: "学 · 首页",
  hint: "路径与大纲",
  icon: BookOpen,
};
