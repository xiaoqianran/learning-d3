export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explain: string;
};

export type DemoKind =
  | "intro-bars"
  | "selection"
  | "data-join"
  | "enter-update-exit"
  | "scales"
  | "axes"
  | "svg-shapes"
  | "bar-chart"
  | "line-chart"
  | "area-chart"
  | "scatter"
  | "pie"
  | "transitions"
  | "interactions"
  | "hierarchy"
  | "tree"
  | "force"
  | "pack"
  | "responsive"
  | "color-scale"
  | "brush"
  | "dashboard"
  | "modules"
  | "performance";

export type LessonBlock =
  | { type: "text"; title?: string; body: string }
  | { type: "code"; title?: string; lang?: string; code: string }
  | { type: "tip"; body: string }
  | { type: "demo"; kind: DemoKind; title: string; hint?: string }
  | { type: "quiz"; questions: QuizQuestion[] };

export type Lesson = {
  slug: string;
  title: string;
  summary: string;
  level: "入门" | "进阶" | "实战";
  track: "基础" | "图表" | "布局" | "交互进阶" | "工程化";
  minutes: number;
  official?: string;
  blocks: LessonBlock[];
};

export const LESSONS: Lesson[] = [
  {
    slug: "intro",
    title: "D3 是什么",
    summary: "数据驱动文档：用数据操作 DOM/SVG。",
    level: "入门",
    track: "基础",
    minutes: 8,
    official: "https://d3js.org/what-is-d3",
    blocks: [
      {
        type: "text",
        title: "数据驱动文档",
        body: "D3（Data-Driven Documents）不是图表库，而是一套把数据绑定到页面元素并驱动视觉变化的工具。你可以用它画柱状图，也可以做地图、力导向网络、自定义可视化。\n\n核心心智模型：数据 → 选择集 → 绑定 → 属性/样式/过渡。",
      },
      {
        type: "code",
        title: "最小例子 · 用数据画矩形",
        lang: "js",
        code: `import * as d3 from "d3";

const data = [12, 28, 18, 32, 24];
d3.select("#chart")
  .selectAll("div.bar")
  .data(data)
  .join("div")
  .attr("class", "bar")
  .style("width", (d) => d * 8 + "px")
  .text((d) => d);`,
      },
      { type: "demo", kind: "intro-bars", title: "动手：数据驱动的条形" },
      {
        type: "tip",
        body: "D3 常与 SVG 搭配；也支持 Canvas / HTML。本站示例以 SVG 为主，便于调试与交互。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "i1",
            question: "D3 的核心思想？",
            options: ["只提供现成图表组件", "数据驱动 DOM/SVG", "只能画地图", "替代 React"],
            answer: 1,
            explain: "Data-Driven Documents：用数据驱动页面。",
          },
          {
            id: "i2",
            question: "D3 更像？",
            options: ["Chart.js 封装", "低层可视化工具箱", "数据库", "CSS 框架"],
            answer: 1,
            explain: "底层原语多，自由度高。",
          },
        ],
      },
    ],
  },
  {
    slug: "selection",
    title: "选择与修改",
    summary: "select / selectAll / attr / style / text。",
    level: "入门",
    track: "基础",
    minutes: 10,
    official: "https://d3js.org/d3-selection",
    blocks: [
      {
        type: "text",
        title: "选择集",
        body: "d3.select 取第一个匹配元素；d3.selectAll 取全部。之后链式调用 attr、style、property、text、html、classed、on。\n\n选择集像 jQuery 风格 API，但真正强大在「数据绑定」之后。",
      },
      {
        type: "code",
        title: "对应源码 · 选择与链式修改",
        lang: "js",
        code: `const svg = d3.select("#chart").append("svg")
  .attr("width", 320).attr("height", 120);

svg.selectAll("circle")
  .data([20, 40, 60, 80])
  .join("circle")
  .attr("cx", (d, i) => 40 + i * 70)
  .attr("cy", 60)
  .attr("r", (d) => d / 4)
  .attr("fill", "var(--color-primary)");`,
      },
      { type: "demo", kind: "selection", title: "动手：选择与属性" },
      {
        type: "quiz",
        questions: [
          {
            id: "s1",
            question: "selectAll 返回？",
            options: ["单个节点", "选择集（可能多个）", "数组原始数据", "Promise"],
            answer: 1,
            explain: "选择集，可继续链式操作。",
          },
          {
            id: "s2",
            question: "attr 与 style 区别？",
            options: ["完全一样", "attr 写属性，style 写 CSS", "attr 只用于 class", "style 不能动画"],
            answer: 1,
            explain: "SVG 几何多用 attr；颜色等也可用 style。",
          },
        ],
      },
    ],
  },
  {
    slug: "data-join",
    title: "数据绑定 data + join",
    summary: "把数组接到 DOM 节点上。",
    level: "入门",
    track: "基础",
    minutes: 12,
    official: "https://d3js.org/d3-selection/joining",
    blocks: [
      {
        type: "text",
        title: "Join 模式",
        body: "现代 D3 推荐 selection.data(data).join(enter)。join 会自动处理 enter（新建）、update（更新）、exit（移除）。\n\nkey 函数很重要：用稳定业务 id，不要只用数组下标，否则过渡会错乱。",
      },
      {
        type: "code",
        title: "对应源码 · join",
        lang: "js",
        code: `const data = [
  { id: "a", v: 10 },
  { id: "b", v: 20 },
  { id: "c", v: 15 },
];

svg.selectAll("rect")
  .data(data, (d) => d.id)
  .join("rect")
  .attr("x", (_, i) => i * 40)
  .attr("y", (d) => 100 - d.v * 3)
  .attr("width", 30)
  .attr("height", (d) => d.v * 3);`,
      },
      { type: "demo", kind: "data-join", title: "动手：增减数据看 join" },
      {
        type: "tip",
        body: "旧写法 enter/append + merge + exit/remove 仍常见于老代码；新项目优先 .join()。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "j1",
            question: "join 主要处理？",
            options: ["仅 CSS", "enter / update / exit", "仅异步", "仅坐标轴"],
            answer: 1,
            explain: "数据与元素的增删改。",
          },
          {
            id: "j2",
            question: "key 函数建议？",
            options: ["永远用 index", "用稳定 id", "随机数", "固定 0"],
            answer: 1,
            explain: "稳定 key 保证正确匹配。",
          },
        ],
      },
    ],
  },
  {
    slug: "enter-update-exit",
    title: "Enter / Update / Exit 详解",
    summary: "理解数据变化时元素生命周期。",
    level: "入门",
    track: "基础",
    minutes: 12,
    official: "https://d3js.org/d3-selection/joining",
    blocks: [
      {
        type: "text",
        title: "三态",
        body: "Enter：数据有、元素无 → 创建。Update：两边都有 → 改属性。Exit：元素有、数据无 → 删除（常配合过渡）。\n\njoin(enter => …, update => …, exit => …) 可分别定制三态动画。",
      },
      {
        type: "code",
        title: "对应源码 · 自定义三态",
        lang: "js",
        code: `sel.data(data, (d) => d)
  .join(
    (enter) => enter.append("circle")
      .attr("r", 0)
      .call((e) => e.transition().attr("r", 12)),
    (update) => update.attr("fill", "var(--color-accent)"),
    (exit) => exit.transition().attr("r", 0).remove(),
  );`,
      },
      { type: "demo", kind: "enter-update-exit", title: "动手：三态动画" },
      {
        type: "quiz",
        questions: [
          {
            id: "e1",
            question: "数据变少时主要触发？",
            options: ["enter", "exit", "scale", "axis"],
            answer: 1,
            explain: "多余元素进入 exit。",
          },
        ],
      },
    ],
  },
  {
    slug: "scales",
    title: "比例尺 Scales",
    summary: "把数据域映射到像素域。",
    level: "入门",
    track: "基础",
    minutes: 14,
    official: "https://d3js.org/d3-scale",
    blocks: [
      {
        type: "text",
        title: "domain 与 range",
        body: "scaleLinear：连续数值。scaleBand：分类柱状图。scaleTime：时间。scaleOrdinal / scaleSequential：颜色。\n\n几乎所有图表都先定 scale，再画几何。",
      },
      {
        type: "code",
        title: "对应源码 · linear + band",
        lang: "js",
        code: `const x = d3.scaleBand()
  .domain(data.map((d) => d.name))
  .range([0, width])
  .padding(0.2);

const y = d3.scaleLinear()
  .domain([0, d3.max(data, (d) => d.value)]).nice()
  .range([height, 0]); // SVG y 向下`,
      },
      { type: "demo", kind: "scales", title: "动手：拖动看 domain/range" },
      {
        type: "tip",
        body: "SVG 的 y 轴向下增大，所以数值轴 range 常写成 [height, 0]。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "sc1",
            question: "柱状图分类轴常用？",
            options: ["scaleLinear", "scaleBand", "scaleSqrt", "scaleLog"],
            answer: 1,
            explain: "band 给每类一段带宽。",
          },
          {
            id: "sc2",
            question: "y 轴 range 为何常 [h,0]？",
            options: ["更快", "SVG 坐标系 y 向下", "D3 强制", "随机"],
            answer: 1,
            explain: "屏幕坐标原点在左上。",
          },
        ],
      },
    ],
  },
  {
    slug: "axes",
    title: "坐标轴 Axes",
    summary: "axisBottom / axisLeft 与 tick。",
    level: "入门",
    track: "基础",
    minutes: 10,
    official: "https://d3js.org/d3-axis",
    blocks: [
      {
        type: "text",
        title: "生成轴",
        body: "轴是根据 scale 生成的一组 path + text。axisBottom(x) 画在底部；需要 g 容器并 transform 到正确位置。\n\nticks、tickFormat、tickSize 控制刻度观感。",
      },
      {
        type: "code",
        title: "对应源码 · 双轴",
        lang: "js",
        code: `g.append("g")
  .attr("transform", \`translate(0,\${height})\`)
  .call(d3.axisBottom(x));

g.append("g")
  .call(d3.axisLeft(y).ticks(5).tickFormat((d) => d + "k"));`,
      },
      { type: "demo", kind: "axes", title: "动手：坐标轴与刻度" },
      {
        type: "quiz",
        questions: [
          {
            id: "a1",
            question: "axis 依赖什么？",
            options: ["CSS only", "scale", "Canvas 2D", "WebGL"],
            answer: 1,
            explain: "轴从 scale 推导刻度位置。",
          },
        ],
      },
    ],
  },
  {
    slug: "svg-shapes",
    title: "SVG 与 path 生成器",
    summary: "line / area / arc / symbol。",
    level: "入门",
    track: "基础",
    minutes: 12,
    official: "https://d3js.org/d3-shape",
    blocks: [
      {
        type: "text",
        title: "形状生成器",
        body: "d3.line、d3.area、d3.arc、d3.symbol 把数据转成 path 的 d 字符串。再配合 curve 曲线插值（curveMonotoneX、curveBasis…）。",
      },
      {
        type: "code",
        title: "对应源码 · line",
        lang: "js",
        code: `const line = d3.line()
  .x((d) => x(d.t))
  .y((d) => y(d.v))
  .curve(d3.curveMonotoneX);

path.datum(data).attr("d", line).attr("fill", "none");`,
      },
      { type: "demo", kind: "svg-shapes", title: "动手：曲线类型" },
      {
        type: "quiz",
        questions: [
          {
            id: "sh1",
            question: "line 生成器输出？",
            options: ["PNG", "path d 字符串", "CSV", "WebGL buffer"],
            answer: 1,
            explain: "SVG path 的 d。",
          },
        ],
      },
    ],
  },
  {
    slug: "bar-chart",
    title: "柱状图",
    summary: "从 scale + join 拼出完整柱图。",
    level: "进阶",
    track: "图表",
    minutes: 14,
    official: "https://d3js.org/d3-shape",
    blocks: [
      {
        type: "text",
        title: "标准配方",
        body: "margin → 内宽高 → scaleBand + scaleLinear → join rect → axes → 标签。这是 D3 入门后的第一个「完整图表」。",
      },
      {
        type: "code",
        title: "对应源码 · 柱状图",
        lang: "js",
        code: `const margin = { top: 16, right: 16, bottom: 32, left: 40 };
const w = width - margin.left - margin.right;
const h = height - margin.top - margin.bottom;
const g = svg.append("g").attr("transform", \`translate(\${margin.left},\${margin.top})\`);

g.selectAll("rect")
  .data(data)
  .join("rect")
  .attr("x", (d) => x(d.name))
  .attr("y", (d) => y(d.value))
  .attr("width", x.bandwidth())
  .attr("height", (d) => h - y(d.value));`,
      },
      { type: "demo", kind: "bar-chart", title: "动手：完整柱状图" },
      {
        type: "quiz",
        questions: [
          {
            id: "b1",
            question: "柱宽通常来自？",
            options: ["x.bandwidth()", "Math.random", "固定 10", "y(d)"],
            answer: 0,
            explain: "scaleBand 提供 bandwidth。",
          },
        ],
      },
    ],
  },
  {
    slug: "line-chart",
    title: "折线图",
    summary: "时间序列与单调曲线。",
    level: "进阶",
    track: "图表",
    minutes: 12,
    official: "https://d3js.org/d3-shape/line",
    blocks: [
      {
        type: "text",
        title: "折线",
        body: "x 常为 scaleTime 或 scalePoint；y 为 scaleLinear。line.curve 控制平滑。多系列时每条线一个 path。",
      },
      {
        type: "code",
        title: "对应源码 · 折线",
        lang: "js",
        code: `const x = d3.scalePoint().domain(data.map(d => d.m)).range([0, w]);
const y = d3.scaleLinear().domain([0, d3.max(data, d => d.v)]).nice().range([h, 0]);
const line = d3.line().x(d => x(d.m)).y(d => y(d.v)).curve(d3.curveMonotoneX);
g.append("path").datum(data).attr("d", line).attr("fill", "none").attr("stroke-width", 2);`,
      },
      { type: "demo", kind: "line-chart", title: "动手：折线图" },
      {
        type: "quiz",
        questions: [
          {
            id: "l1",
            question: "单条折线绑定数据常用？",
            options: ["selectAll + data", "path.datum(data)", "only append", "innerHTML"],
            answer: 1,
            explain: "整条 path 对应整个数组用 datum。",
          },
        ],
      },
    ],
  },
  {
    slug: "area-chart",
    title: "面积图",
    summary: "line + y0/y1 填充区域。",
    level: "进阶",
    track: "图表",
    minutes: 10,
    official: "https://d3js.org/d3-shape/area",
    blocks: [
      {
        type: "text",
        title: "area",
        body: "d3.area 类似 line，但有 y0/y1（或 x0/x1）定义填充边界。常用于趋势强调与 stacked area。",
      },
      {
        type: "code",
        title: "对应源码 · 面积",
        lang: "js",
        code: `const area = d3.area()
  .x((d) => x(d.m))
  .y0(h)
  .y1((d) => y(d.v))
  .curve(d3.curveMonotoneX);`,
      },
      { type: "demo", kind: "area-chart", title: "动手：面积图" },
      {
        type: "quiz",
        questions: [
          {
            id: "ar1",
            question: "面积图底部常设？",
            options: ["y0 = h", "y0 = 0 且 range 颠倒无所谓", "必须 Canvas", "只能 pie"],
            answer: 0,
            explain: "y0 通常是基线高度。",
          },
        ],
      },
    ],
  },
  {
    slug: "scatter",
    title: "散点图",
    summary: "二维关系与半径编码。",
    level: "进阶",
    track: "图表",
    minutes: 12,
    official: "https://d3js.org/d3-scale",
    blocks: [
      {
        type: "text",
        title: "散点",
        body: "每个点一个 circle：cx/cy 映射两个度量，可选 r 或 fill 映射第三维。注意重叠与透明度。",
      },
      {
        type: "code",
        title: "对应源码 · 散点",
        lang: "js",
        code: `g.selectAll("circle")
  .data(data)
  .join("circle")
  .attr("cx", (d) => x(d.a))
  .attr("cy", (d) => y(d.b))
  .attr("r", (d) => r(d.c))
  .attr("fill-opacity", 0.75);`,
      },
      { type: "demo", kind: "scatter", title: "动手：散点图" },
      {
        type: "quiz",
        questions: [
          {
            id: "sp1",
            question: "散点第三维常见编码？",
            options: ["只能文字", "半径 / 颜色", "必须 3D", "删除轴"],
            answer: 1,
            explain: "r 或 color 映射额外字段。",
          },
        ],
      },
    ],
  },
  {
    slug: "pie",
    title: "饼图与环形图",
    summary: "pie 布局 + arc 生成器。",
    level: "进阶",
    track: "图表",
    minutes: 12,
    official: "https://d3js.org/d3-shape/pie",
    blocks: [
      {
        type: "text",
        title: "pie + arc",
        body: "d3.pie() 把数值数组变成带 startAngle/endAngle 的布局数据；d3.arc() 生成扇形 path。innerRadius > 0 即 donut。",
      },
      {
        type: "code",
        title: "对应源码 · 环形图",
        lang: "js",
        code: `const pie = d3.pie().value((d) => d.v).sort(null);
const arc = d3.arc().innerRadius(50).outerRadius(90);
g.selectAll("path")
  .data(pie(data))
  .join("path")
  .attr("d", arc)
  .attr("fill", (d, i) => color(i));`,
      },
      { type: "demo", kind: "pie", title: "动手：饼/环图" },
      {
        type: "quiz",
        questions: [
          {
            id: "p1",
            question: "环形图关键？",
            options: ["innerRadius > 0", "必须 scaleBand", "禁用 pie", "只用 rect"],
            answer: 0,
            explain: "内半径大于 0。",
          },
        ],
      },
    ],
  },
  {
    slug: "transitions",
    title: "过渡动画",
    summary: "transition / duration / ease / delay。",
    level: "进阶",
    track: "图表",
    minutes: 12,
    official: "https://d3js.org/d3-transition",
    blocks: [
      {
        type: "text",
        title: "过渡",
        body: "selection.transition() 创建过渡；duration、ease、delay 控制节奏。可链式 attrTween。数据更新时先 join 再 transition，观感专业很多。",
      },
      {
        type: "code",
        title: "对应源码 · 过渡",
        lang: "js",
        code: `bars.transition()
  .duration(600)
  .ease(d3.easeCubicOut)
  .attr("y", (d) => y(d))
  .attr("height", (d) => h - y(d));`,
      },
      { type: "demo", kind: "transitions", title: "动手：切换数据动画" },
      {
        type: "quiz",
        questions: [
          {
            id: "t1",
            question: "transition 作用？",
            options: ["改数据库", "在时间上插值属性", "编译 TS", "打包代码"],
            answer: 1,
            explain: "平滑插值视觉属性。",
          },
        ],
      },
    ],
  },
  {
    slug: "interactions",
    title: "交互与事件",
    summary: "on('pointerenter')、tooltip、高亮。",
    level: "进阶",
    track: "图表",
    minutes: 12,
    official: "https://d3js.org/d3-selection/events",
    blocks: [
      {
        type: "text",
        title: "指针事件",
        body: "用 selection.on 绑定 pointerenter/move/leave 或 click。tooltip 可用 HTML 浮层或 SVG title。注意移动端 pointer 事件更通用。",
      },
      {
        type: "code",
        title: "对应源码 · 悬停",
        lang: "js",
        code: `bars.on("pointerenter", function (event, d) {
  d3.select(this).attr("opacity", 1);
  tip.style("display", "block").text(d.name + ": " + d.value);
}).on("pointerleave", function () {
  d3.select(this).attr("opacity", 0.75);
  tip.style("display", "none");
});`,
      },
      { type: "demo", kind: "interactions", title: "动手：悬停高亮" },
      {
        type: "quiz",
        questions: [
          {
            id: "in1",
            question: "事件回调第二参数通常是？",
            options: ["CSS 类名", "绑定的数据 d", "窗口宽度", "颜色"],
            answer: 1,
            explain: "datum 作为第二参。",
          },
        ],
      },
    ],
  },
  {
    slug: "hierarchy",
    title: "层级数据 hierarchy",
    summary: "stratify / hierarchy 与 descendants。",
    level: "进阶",
    track: "布局",
    minutes: 12,
    official: "https://d3js.org/d3-hierarchy",
    blocks: [
      {
        type: "text",
        title: "层级",
        body: "树、包图、矩形树图都先把 JSON 变成 hierarchy 节点，再喂给 tree/cluster/pack/treemap 布局。",
      },
      {
        type: "code",
        title: "对应源码 · hierarchy",
        lang: "js",
        code: `const root = d3.hierarchy(data)
  .sum((d) => d.value ?? 0)
  .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
console.log(root.leaves());`,
      },
      { type: "demo", kind: "hierarchy", title: "动手：层级汇总" },
      {
        type: "quiz",
        questions: [
          {
            id: "h1",
            question: "sum 的作用？",
            options: ["排序颜色", "自底向上汇总 value", "画坐标轴", "做 force"],
            answer: 1,
            explain: "叶子值向上汇总。",
          },
        ],
      },
    ],
  },
  {
    slug: "tree",
    title: "树图 Tree",
    summary: "tree 布局与 linkHorizontal。",
    level: "进阶",
    track: "布局",
    minutes: 12,
    official: "https://d3js.org/d3-hierarchy/tree",
    blocks: [
      {
        type: "text",
        title: "树布局",
        body: "d3.tree().size([h, w]) 给每个节点 x/y。连线用 d3.linkHorizontal() 或 linkVertical。",
      },
      {
        type: "code",
        title: "对应源码 · tree",
        lang: "js",
        code: `const treeLayout = d3.tree().size([h, w - 80]);
const root = treeLayout(d3.hierarchy(data));
g.selectAll("path")
  .data(root.links())
  .join("path")
  .attr("d", d3.linkHorizontal().x((d) => d.y).y((d) => d.x));`,
      },
      { type: "demo", kind: "tree", title: "动手：树图" },
      {
        type: "quiz",
        questions: [
          {
            id: "tr1",
            question: "树节点位置由谁计算？",
            options: ["CSS flex", "tree 布局", "pie", "axis"],
            answer: 1,
            explain: "hierarchy tree layout。",
          },
        ],
      },
    ],
  },
  {
    slug: "force",
    title: "力导向图 Force",
    summary: "simulation 与多种力。",
    level: "进阶",
    track: "布局",
    minutes: 14,
    official: "https://d3js.org/d3-force",
    blocks: [
      {
        type: "text",
        title: "力模拟",
        body: "d3.forceSimulation(nodes) 迭代更新 x/y。常用 forceLink、forceManyBody、forceCenter、forceCollide。tick 回调里重绘。",
      },
      {
        type: "code",
        title: "对应源码 · force",
        lang: "js",
        code: `const sim = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id((d) => d.id).distance(60))
  .force("charge", d3.forceManyBody().strength(-180))
  .force("center", d3.forceCenter(w / 2, h / 2));

sim.on("tick", () => {
  link.attr("x1", (d) => d.source.x).attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x).attr("y2", (d) => d.target.y);
  node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
});`,
      },
      { type: "demo", kind: "force", title: "动手：力导向网络" },
      {
        type: "quiz",
        questions: [
          {
            id: "f1",
            question: "force 位置更新时机？",
            options: ["仅 CSS", "simulation tick", "仅 resize", "仅 scroll"],
            answer: 1,
            explain: "每帧 tick 更新坐标。",
          },
        ],
      },
    ],
  },
  {
    slug: "pack",
    title: "Pack 与 Treemap",
    summary: "圆形堆叠与矩形树图。",
    level: "进阶",
    track: "布局",
    minutes: 12,
    official: "https://d3js.org/d3-hierarchy/pack",
    blocks: [
      {
        type: "text",
        title: "空间填充布局",
        body: "pack 用圆表示层级；treemap 用矩形。都适合展示占比与层级，如磁盘占用、预算结构。",
      },
      {
        type: "code",
        title: "对应源码 · pack",
        lang: "js",
        code: `const pack = d3.pack().size([w, h]).padding(3);
const root = pack(d3.hierarchy(data).sum((d) => d.value));
g.selectAll("circle")
  .data(root.descendants())
  .join("circle")
  .attr("cx", (d) => d.x)
  .attr("cy", (d) => d.y)
  .attr("r", (d) => d.r);`,
      },
      { type: "demo", kind: "pack", title: "动手：圆堆叠" },
      {
        type: "quiz",
        questions: [
          {
            id: "pk1",
            question: "treemap 用什么形状？",
            options: ["圆", "矩形", "折线", "弧"],
            answer: 1,
            explain: "矩形填充。",
          },
        ],
      },
    ],
  },
  {
    slug: "responsive",
    title: "响应式图表",
    summary: "viewBox、resize、容器查询思维。",
    level: "实战",
    track: "交互进阶",
    minutes: 12,
    official: "https://d3js.org/d3-selection",
    blocks: [
      {
        type: "text",
        title: "自适应",
        body: "用 viewBox 让 SVG 缩放，或监听 ResizeObserver 重算 width 后重绘。移动端减少刻度、简化标签。",
      },
      {
        type: "code",
        title: "对应源码 · viewBox",
        lang: "js",
        code: `svg.attr("viewBox", \`0 0 \${width} \${height}\`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .style("width", "100%")
  .style("height", "auto");`,
      },
      { type: "demo", kind: "responsive", title: "动手：宽度变化重绘" },
      {
        type: "quiz",
        questions: [
          {
            id: "r1",
            question: "响应式常用？",
            options: ["写死 1920px", "viewBox 或 ResizeObserver", "禁用轴", "只用 png"],
            answer: 1,
            explain: "自适应容器宽度。",
          },
        ],
      },
    ],
  },
  {
    slug: "color-scale",
    title: "颜色比例尺与图例",
    summary: "ordinal / sequential / diverging。",
    level: "实战",
    track: "交互进阶",
    minutes: 10,
    official: "https://d3js.org/d3-scale-chromatic",
    blocks: [
      {
        type: "text",
        title: "配色",
        body: "分类：scaleOrdinal + schemeCategory。连续：scaleSequential + interpolateBlues。发散：scaleDiverging。记得做色盲友好与图例。",
      },
      {
        type: "code",
        title: "对应源码 · sequential",
        lang: "js",
        code: `const color = d3.scaleSequential(d3.interpolateTurbo)
  .domain(d3.extent(data, (d) => d.v));
rect.attr("fill", (d) => color(d.v));`,
      },
      { type: "demo", kind: "color-scale", title: "动手：颜色映射" },
      {
        type: "quiz",
        questions: [
          {
            id: "c1",
            question: "连续数值填色常用？",
            options: ["scaleBand", "scaleSequential", "forceLink", "pie"],
            answer: 1,
            explain: "sequential + interpolate。",
          },
        ],
      },
    ],
  },
  {
    slug: "brush",
    title: "刷选与缩放",
    summary: "brushX / zoom 过滤视图。",
    level: "实战",
    track: "交互进阶",
    minutes: 14,
    official: "https://d3js.org/d3-brush",
    blocks: [
      {
        type: "text",
        title: "探索式交互",
        body: "brush 用于框选时间范围或过滤散点；zoom 用于平移缩放。二者常与 scale 重新计算联用。",
      },
      {
        type: "code",
        title: "对应源码 · brushX",
        lang: "js",
        code: `const brush = d3.brushX().extent([[0, 0], [w, h]])
  .on("end", (event) => {
    if (!event.selection) return;
    const [x0, x1] = event.selection.map(x.invert);
    // filter data between x0 and x1
  });
g.append("g").call(brush);`,
      },
      { type: "demo", kind: "brush", title: "动手：刷选高亮" },
      {
        type: "quiz",
        questions: [
          {
            id: "br1",
            question: "brush 的 selection 是？",
            options: ["CSS 选择器", "像素范围坐标", "SQL", "路由"],
            answer: 1,
            explain: "屏幕坐标选区，再 invert 回数据域。",
          },
        ],
      },
    ],
  },
  {
    slug: "dashboard",
    title: "迷你仪表盘",
    summary: "多图联动：总览 + 明细。",
    level: "实战",
    track: "交互进阶",
    minutes: 16,
    official: "https://d3js.org",
    blocks: [
      {
        type: "text",
        title: "组合",
        body: "真实项目往往是多个小图共享同一数据过滤状态。点击柱状过滤 → 折线/散点重绘。状态可放 React/Zustand，渲染仍用 D3。",
      },
      {
        type: "code",
        title: "对应源码 · 过滤后重绘",
        lang: "js",
        code: `function render(filterCat) {
  const rows = filterCat
    ? data.filter((d) => d.cat === filterCat)
    : data;
  updateBars(rows);
  updateLine(rows);
}`,
      },
      { type: "demo", kind: "dashboard", title: "动手：联动仪表盘" },
      {
        type: "quiz",
        questions: [
          {
            id: "d1",
            question: "多图联动关键？",
            options: ["共享过滤状态", "每图独立假数据永不更新", "禁用事件", "只截图"],
            answer: 0,
            explain: "同一状态驱动多视图。",
          },
        ],
      },
    ],
  },
  {
    slug: "modules",
    title: "模块化图表函数",
    summary: "可复用 chart(selection, data, opts)。",
    level: "实战",
    track: "工程化",
    minutes: 12,
    official: "https://d3js.org",
    blocks: [
      {
        type: "text",
        title: "封装",
        body: "把「清空 → 量尺寸 → scale → join → axes」封成函数，便于在 React useEffect 中调用，也便于单测。",
      },
      {
        type: "code",
        title: "对应源码 · 图表函数",
        lang: "js",
        code: `export function barChart(el, data, { width = 400, height = 240 } = {}) {
  const root = d3.select(el);
  root.selectAll("*").remove();
  // ... build svg
  return { update(next) { /* re-join */ } };
}`,
      },
      { type: "demo", kind: "modules", title: "动手：可复用柱图组件" },
      {
        type: "quiz",
        questions: [
          {
            id: "m1",
            question: "React 里用 D3 常见做法？",
            options: ["在 useEffect 里操作 ref DOM", "在 render 里直接 d3.select(document)", "禁止 SVG", "只用 jQuery"],
            answer: 0,
            explain: "ref + effect 管理生命周期。",
          },
        ],
      },
    ],
  },
  {
    slug: "performance",
    title: "性能与最佳实践",
    summary: "大数据、Canvas、避免无效 join。",
    level: "实战",
    track: "工程化",
    minutes: 12,
    official: "https://d3js.org",
    blocks: [
      {
        type: "text",
        title: "性能要点",
        body: "万级点优先 Canvas/WebGL；SVG 适合千级内交互精细场景。避免每帧全量 selectAll 重建；用 key 稳定 join；过渡别叠太多。\n\n可访问性：标题、aria、对比度、键盘可达。",
      },
      {
        type: "code",
        title: "对应源码 · 减少重绘",
        lang: "js",
        code: `// 好：更新已有选择集
bars.data(data, (d) => d.id)
  .join("rect")
  .attr("height", (d) => y(d.v));

// 差：每次 remove 全部再 append
svg.selectAll("*").remove();`,
      },
      { type: "demo", kind: "performance", title: "动手：高效更新 vs 全量重建" },
      {
        type: "tip",
        body: "学完本路径后，去「图表工坊」完成闯关，并在 Playground 自由实验。",
      },
      {
        type: "quiz",
        questions: [
          {
            id: "pf1",
            question: "超大散点更合适？",
            options: ["纯 SVG 十万 circle", "Canvas / WebGL", "只用 pie", "禁用 scale"],
            answer: 1,
            explain: "大量图元 Canvas/WebGL 更合适。",
          },
          {
            id: "pf2",
            question: "应避免？",
            options: ["稳定 key", "每帧无脑全量 remove", "requestAnimationFrame", "抽公共函数"],
            answer: 1,
            explain: "全量销毁重建昂贵。",
          },
        ],
      },
    ],
  },
];

export const TRACKS = ["基础", "图表", "布局", "交互进阶", "工程化"] as const;

export function getLesson(slug: string): Lesson | undefined {
  return LESSONS.find((l) => l.slug === slug);
}

export function getLessonIndex(slug: string): number {
  return LESSONS.findIndex((l) => l.slug === slug);
}

export function getAdjacent(slug: string): { prev?: Lesson; next?: Lesson } {
  const i = getLessonIndex(slug);
  if (i < 0) return {};
  return {
    prev: i > 0 ? LESSONS[i - 1] : undefined,
    next: i < LESSONS.length - 1 ? LESSONS[i + 1] : undefined,
  };
}

export function getLessonsByTrack(track: Lesson["track"]) {
  return LESSONS.filter((l) => l.track === track);
}

export function getAllQuizQuestions(): Array<
  QuizQuestion & { lessonSlug: string; lessonTitle: string }
> {
  const out: Array<QuizQuestion & { lessonSlug: string; lessonTitle: string }> = [];
  for (const lesson of LESSONS) {
    for (const block of lesson.blocks) {
      if (block.type === "quiz") {
        for (const q of block.questions) {
          out.push({ ...q, lessonSlug: lesson.slug, lessonTitle: lesson.title });
        }
      }
    }
  }
  return out;
}
