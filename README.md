# learning-d3

交互式中文 **D3.js** 教程（TanStack Start + Vite）。

- 对齐 [d3js.org](https://d3js.org) API 文档（官方暂无 llms.txt）
- 本站发布：[`/llms.txt`](https://xiaoqianran.github.io/learning-d3/llms.txt) · [`/llms-full.txt`](https://xiaoqianran.github.io/learning-d3/llms-full.txt)
- UI：Catppuccin + 学/查/练/我 导航（与 learning-vue3 同构）
- 部署：GitHub Actions → GitHub Pages

# D3.js 实战学习

交互式中文 D3 教程：课程 + Live Demo + 测验 + 进度 + Playground + 图表工坊。

**在线访问：** [https://xiaoqianran.github.io/learning-d3/](https://xiaoqianran.github.io/learning-d3/)  
**仓库：** [https://github.com/xiaoqianran/learning-d3](https://github.com/xiaoqianran/learning-d3)  
**姊妹项目：** [learning-vue3](https://github.com/xiaoqianran/learning-vue3)

---

## 这是什么

面向想系统学习 **D3.js 数据可视化** 的同学。内容以「读一点、动手一点、测一点」组织，结构对齐 [learning-vue3](https://github.com/xiaoqianran/learning-vue3)。

你可以：

- 按路径学完 **24 节** 课程（讲解 + 对应源码 + 交互 Demo + 小测验）
- 在 **Playground** 里写并运行真实 D3 代码
- 在 **图表工坊** 里闯关搭柱状图
- 用 **速查表 / 学习中心 / 错题本 / 结业证明** 跟进度

> 说明：本站本身用 React + TanStack Start 承载教学内容；Demo 与 Playground 运行的是真实 `d3` 库。

---

## 功能一览

| 模块 | 路径 | 说明 |
|------|------|------|
| 课程 | `/lesson/:slug` | 正文、源码、Live Demo、测验、笔记 |
| 首页大纲 | `/` | 搜索、路径筛选、进度条 |
| Playground | `/playground` | 在线写 D3 并预览 SVG |
| 图表工坊 | `/studio` | 柱状图闯关任务 |
| 文档地图 | `/docs` | 对照 d3js.org ↔ 本站课 |
| 主题 | 全局 | Catppuccin（Mocha/Macchiato/Frappé/Latte + Accent） |
| 速查表 | `/cheatsheet` | 一页核心 API |
| 学习中心 | `/hub` | 打卡、收藏、路径进度 |
| 练习场 | `/lab` | 综合测验 |
| 错题本 | `/mistakes` | 测验错题回顾 |
| 结业证明 | `/certificate` | 全部完成后解锁 |

---

## 学习路径（5 条）

| 路径 | 你学到什么 |
|------|------------|
| **基础** | 选择、join、比例尺、坐标轴、SVG path |
| **图表** | 柱/线/面/散点/饼、过渡、交互 |
| **布局** | hierarchy、树、力导向、pack |
| **交互进阶** | 响应式、色带、刷选、仪表盘联动 |
| **工程化** | 模块封装、性能与最佳实践 |

建议顺序：

```text
基础 → 图表 → 布局 → 交互进阶 → 工坊闯关 → 工程化 → 自己的作品
```

---

## 本地运行

环境：Node 22+ 推荐。

```bash
git clone https://github.com/xiaoqianran/learning-d3.git
cd learning-d3
npm install
npm run dev
```

开发服务默认：`http://127.0.0.1:8080`（绑定 `0.0.0.0:8080`）。

```bash
npm run dev          # 开发
npm run build        # 生产构建
npm run build:pages  # GitHub Pages 静态构建
npm run typecheck    # TypeScript 检查
```

GitHub Pages 静态构建会设置 `GITHUB_PAGES=true`，`base` 为 `/learning-d3/`。

---

## 技术栈

- **界面与路由：** React 19、TanStack Start / Router、Vite
- **样式：** Tailwind CSS v4
- **状态：** Zustand（学习进度持久化）
- **可视化：** `d3` v7
- **部署：** GitHub Actions → GitHub Pages

---

## 目录结构（简要）

```text
src/
  data/lessons.ts                 # 全部课程内容
  components/demos/               # 交互 Demo
  routes/                         # 页面路由
  store/progress.ts               # 学习进度
.github/workflows/                # Pages 部署
```

---

## 部署

推送到 `main` 后，Actions 工作流 **Deploy to GitHub Pages** 会构建并发布。

- Pages 源：GitHub Actions  
- 站点：`https://xiaoqianran.github.io/learning-d3/`

---

## 进度与隐私

- 学习进度、笔记、错题、工坊数据保存在 **浏览器 localStorage**
- 不上传到服务器；清站点数据会丢失进度
- 结业证明为本地成就展示，**非正式官方证书**

---

## 许可证与声明

- 教程内容用于学习与演示
- D3 相关商标归各自所有者
- 欢迎提 Issue / PR 纠错与补充

---

## 相关链接

- 在线课站：[learning-d3](https://xiaoqianran.github.io/learning-d3/)
- 仓库：[xiaoqianran/learning-d3](https://github.com/xiaoqianran/learning-d3)
- 姊妹项目：[learning-vue3](https://github.com/xiaoqianran/learning-vue3)
- D3 官方文档：[https://d3js.org/](https://d3js.org/)
