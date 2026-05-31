# 首页设计规格

## 一、页面定位

**工具页，非营销页**

用户进来直接看到功能界面，可立即操作。SEO 内容放在工具区下方，给爬虫看。

---

## 二、整体布局

```
┌─────────────────────────────────────────┐
│  Header: Logo | Pricing | Login         │
├─────────────────────────────────────────┤
│                                         │
│  H1: Extract Keywords from Text or URL  │
│  副标题: Free keyword extraction tool    │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│      工具区（Tab 切换）                   │
│      [Text] [URL] [AI 🔒]               │
│      ┌─────────────────────────────┐    │
│      │     文本框 / URL 输入         │    │
│      │                             │    │
│      │  [Extract Keywords]         │    │
│      └─────────────────────────────┘    │
│                                         │
│      结果区（提取后展示）                 │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│      SEO 内容区                          │
│      • How it works                     │
│      • Why it matters                   │
│      • Use cases                        │
│      • FAQ                              │
│                                         │
├─────────────────────────────────────────┤
│  Footer: © 2026 | Privacy | Terms       │
└─────────────────────────────────────────┘
```

---

## 三、Header 区域

### 导航栏元素

| 位置 | 元素 | 说明 |
|-----|------|------|
| 左 | Logo + 品牌名 | ExtractKeywords |
| 右 | Pricing \| Login / Sign Up | 登录状态切换 |

### Logo 方案

- 文字 Logo：**ExtractKeywords**（无图标，简洁）
- 链接到首页

### 登录状态

```
未登录: [Pricing] [Login]
已登录: [Pricing] [Dashboard ▼]
```

---

## 四、Hero 区域（H1 + 工具区）

### H1 标题

```html
<h1>Extract Keywords from Text or URL</h1>
<p class="subtitle">Free online keyword extraction tool - Instant results, no signup required</p>
```

**设计要点：**
- H1 正常显示，不隐藏
- 副标题说明工具价值：免费 + 即时 + 无需注册
- 字体：H1 用粗体大字，副标题用灰色小字

### 工具区 Tab 切换

| Tab | 功能 | 免费情况 | 图标 |
|-----|------|---------|------|
| **Text** | 粘贴文本提取关键词 | ✅ 免费 | 文档图标 |
| **URL** | 输入网址抓取后提取 | ✅ 免费 | 链接图标 |
| **AI** | AI 智能语义提取 | 🔒 付费 | AI 图标 + 锁 |

**Tab 样式：**
- 当前 Tab：高亮底色 + 粗体
- 未选中：灰色文字
- AI Tab：右侧显示 "PRO" 徽章（橙色/金色）

---

## 五、工具区详细设计

### 5.1 Text Tab（文本输入）

**输入区：**
- 多行文本框（textarea）
- 高度：250px
- Placeholder: `Paste your text here...`
- 右下角显示字数统计：`1,234 characters`

**示例：**
```
┌─────────────────────────────────────────┐
│ Paste your text here...                 │
│                                         │
│                                         │
│                                         │
│                                         │
│                            0 characters │
└─────────────────────────────────────────┘
```

**主按钮：**
```
┌──────────────────────────────┐
│   Extract Keywords           │
└──────────────────────────────┘
```
- 颜色：品牌主色（深蓝/绿色）
- 宽度：全宽或固定 300px 居中
- 点击后：按钮显示 loading 动画

---

### 5.2 URL Tab（网址输入）

**输入区：**
- 单行输入框
- Placeholder: `https://example.com/your-article`

**示例：**
```
┌─────────────────────────────────────────┐
│ https://example.com/your-article        │
└─────────────────────────────────────────┘
```

**验证：**
- 实时校验 URL 格式
- 无效 URL 显示红色边框 + 提示

**主按钮：**
同 Text Tab

---

### 5.3 AI Tab（付费功能）

**输入区：**
- 同 Text Tab（文本输入）

**差异：**
- 输入框上方显示："🔒 AI-Powered Extraction (Pro)"
- 未登录用户点击按钮 → 跳转登录/注册
- 已登录免费用户 → 显示升级提示

---

### 5.4 结果展示区

**展示时机：** 提取完成后，工具区下方展开

**布局：**
```
┌─────────────────────────────────────────┐
│ Results: 42 keywords found              │
│                                         │
│ [All] [1-word] [2-word] [3-word]       │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Keyword       │ Count │ Density    │ │
│ ├─────────────────────────────────────┤ │
│ │ keyword       │ 15    │ 2.3%       │ │
│ │ extraction    │ 12    │ 1.8%       │ │
│ │ tool          │ 10    │ 1.5%       │ │
│ │ ...           │ ...   │ ...        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Download CSV] [Copy to Clipboard]      │
└─────────────────────────────────────────┘
```

**表格字段：**
| 字段 | 说明 |
|-----|------|
| Keyword | 关键词 |
| Count | 出现次数 |
| Density | 密度百分比 |

**操作按钮：**
- Download CSV：导出 CSV 文件
- Copy to Clipboard：复制到剪贴板

**排序：**
- 默认按 Count 降序
- 点击表头可切换排序

---

## 六、SEO 内容区

**位置：** 工具区下方，视觉弱化

**设计原则：**
- 内容充实（目标 1500 词）
- 模块清晰，标题醒目
- 不过度营销，无多个 CTA
- 底部一个 CTA 即可

---

### 6.1 How it Works（3 步流程）

```html
<h2>How to Extract Keywords in 3 Simple Steps</h2>

<div class="steps">
  <div class="step">
    <span class="step-number">1</span>
    <h3>Paste Text or Enter URL</h3>
    <p>Add your content directly or paste a webpage URL.</p>
  </div>
  
  <div class="step">
    <span class="step-number">2</span>
    <h3>Click Extract</h3>
    <p>Our algorithm analyzes word frequency and phrases instantly.</p>
  </div>
  
  <div class="step">
    <span class="step-number">3</span>
    <h3>Download Results</h3>
    <p>Export your keywords as CSV or copy them to clipboard.</p>
  </div>
</div>
```

---

### 6.2 Why Keyword Extraction Matters

```html
<h2>Why Keyword Extraction Matters</h2>

<p>Keyword extraction is essential for...</p>

<ul>
  <li><strong>SEO Optimization</strong> - Identify focus keywords for your content</li>
  <li><strong>Competitor Analysis</strong> - Understand what keywords competitors target</li>
  <li><strong>Content Strategy</strong> - Plan your content around high-value keywords</li>
  <li><strong>Market Research</strong> - Discover trending topics in your niche</li>
</ul>
```

**目标关键词：**
- keyword extraction
- SEO optimization
- competitor analysis
- content strategy

---

### 6.3 Use Cases

```html
<h2>Who Uses Keyword Extraction?</h2>

<div class="use-cases">
  <div class="use-case">
    <h3>Bloggers & Content Writers</h3>
    <p>Find focus keywords to optimize blog posts and articles for search engines.</p>
  </div>
  
  <div class="use-case">
    <h3>SEO Specialists</h3>
    <p>Analyze competitor pages to identify keyword gaps and opportunities.</p>
  </div>
  
  <div class="use-case">
    <h3>Digital Marketers</h3>
    <p>Research market trends and discover what your audience is searching for.</p>
  </div>
  
  <div class="use-case">
    <h3>Students & Researchers</h3>
    <p>Extract key terms from academic papers and research documents.</p>
  </div>
</div>
```

---

### 6.4 FAQ

```html
<h2>Frequently Asked Questions</h2>

<details>
  <summary>What is keyword extraction?</summary>
  <p>Keyword extraction is the process of identifying...</p>
</details>

<details>
  <summary>Is this tool free?</summary>
  <p>Yes! Basic keyword extraction from text and URLs is completely free...</p>
</details>

<details>
  <summary>What's the difference between free and AI extraction?</summary>
  <p>Free extraction uses word frequency analysis, while AI extraction...</p>
</details>

<details>
  <summary>Can I extract keywords from a URL?</summary>
  <p>Yes, simply paste any webpage URL and we'll fetch and analyze the content.</p>
</details>

<details>
  <summary>Is my data stored?</summary>
  <p>No, we don't store your text or extracted keywords. All processing is done in real-time.</p>
</details>

<details>
  <summary>How accurate is the extraction?</summary>
  <p>Our algorithm provides accurate frequency-based results. AI extraction offers deeper semantic analysis.</p>
</details>
```

**FAQ Schema：** 需要添加 FAQPage 结构化数据

---

### 6.5 底部 CTA

**位置：** SEO 内容区最底部

```html
<div class="cta">
  <h2>Start Extracting Keywords Now</h2>
  <p>No signup required. Free forever.</p>
  <a href="#tool" class="button">Try Free Tool</a>
</div>
```

**设计要点：**
- 简单直接，不过度营销
- 链接到工具区（锚点）

---

## 七、Footer 区域

```
┌─────────────────────────────────────────┐
│                                         │
│  ExtractKeywords                        │
│  Free keyword extraction tool           │
│                                         │
│  Product | Resources | Legal            │
│  Pricing    Blog       Privacy          │
│             Guides     Terms            │
│                        Contact          │
│                                         │
│  © 2026 ExtractKeywords. All rights reserved.
│                                         │
└─────────────────────────────────────────┘
```

**链接分组：**
- Product: Pricing
- Resources: Blog, Guides
- Legal: Privacy, Terms, Contact

---

## 八、技术实现要点

### 8.1 响应式设计

| 设备 | 布局 |
|-----|------|
| 桌面 | 工具区居中，宽度 700px |
| 平板 | 工具区宽度 90% |
| 手机 | 全宽，Tab 垂直堆叠 |

### 8.2 性能优化

- 工具区优先加载
- SEO 内容区延迟加载（lazy load）
- 图片使用 Next.js Image 组件

### 8.3 无障碍

- Tab 键可切换 Tab
- 表格有 `<thead>` 和 `<caption>`
- 按钮 aria-label

### 8.4 SEO 元素

```html
<title>Extract Keywords from Text or URL - Free Keyword Extraction Tool</title>
<meta name="description" content="Free online keyword extraction tool. Extract keywords from text or URL instantly. No signup required. Download results as CSV.">
```

**Schema.org:**
- WebApplication schema（工具）
- FAQPage schema（FAQ）
- BreadcrumbList（面包屑）

---

## 九、视觉设计参考

### 颜色方案

| 用途 | 颜色 |
|-----|------|
| 主色 | #2563eb (蓝色) 或 #059669 (绿色) |
| 背景 | #ffffff 或 #f9fafb |
| 文字 | #111827 |
| 副文字 | #6b7280 |
| 边框 | #e5e7eb |
| PRO 徽章 | #f59e0b (橙色) |

### 字体

- H1: Inter / system-ui, 粗体, 32-40px
- 正文: Inter / system-ui, 常规, 16px
- 代码/表格: JetBrains Mono / monospace

---

## 十、开发任务拆分（待 Claude Code 执行）

### Phase 1: 基础结构
- [x] Header 组件（Logo + 导航）
- [x] Hero 区域（H1 + 副标题）
- [x] Footer 组件

### Phase 2: 工具区
- [x] Tab 切换组件
- [x] Text Tab（文本输入 + 按钮）
- [x] URL Tab（URL 输入 + 按钮）
- [x] 结果展示区（表格 + 导出）

### Phase 3: SEO 内容区
- [x] How it Works 模块
- [x] Why it Matters 模块
- [x] Use Cases 模块
- [x] FAQ 模块（含 Schema） ~~Schema 部分 ❌~~
- [x] 底部 CTA

### Phase 4: 功能实现
- [x] 文本提取算法（词频统计）
- [ ] URL 抓取 + 提取（使用硬编码占位文本）
- [x] CSV 导出
- [x] Copy to Clipboard

---

## 十一、待确认事项

1. **品牌主色：** 蓝色 or 绿色？→ **已确认：绿色 #059669**
2. **Logo：** 纯文字 or 文字+图标？→ **已实现：文字+SVG 图标**
3. **免费版限制：** 是否限制字数/次数？→ **待确认**
4. **AI 功能：** 付费后才显示 Tab，或显示但锁定？→ **已确认：显示但锁定 + PRO 徽章**

---

## 十二、首页完成度审计（2026-05-31）

### ✅ 已完成（25 项）

| # | 项目 | 规格来源 | 实现位置 |
|---|------|---------|---------|
| 1 | Header（Logo + Pricing + Login） | §三 | `Header.tsx` |
| 2 | ThemeToggle（额外，未在 spec） | — | `Header.tsx` |
| 3 | H1 + 副标题 | §四 | `[locale]/page.tsx:15-20` |
| 4 | Tab 切换（Text/URL/AI） | §四 | `Tabs.tsx` + `ToolSection.tsx:93-165` |
| 5 | AI Tab + PRO 徽章 + 锁定 | §四 | `Tabs.tsx:51-54`, `ToolSection.tsx:142-164` |
| 6 | Text Tab（多行文本框 250px+） | §5.1 | `ToolSection.tsx:98-121` |
| 7 | 字数统计右下角 | §5.1 | `ToolSection.tsx:106-108` |
| 8 | Extract Keywords 按钮 + Loading | §5.1 | `ToolSection.tsx:109-119` |
| 9 | URL Tab（单行输入框） | §5.2 | `ToolSection.tsx:127-140` |
| 10 | 结果表格（Keyword/Count/Density） | §5.4 | `ToolSection.tsx:186-201` |
| 11 | CSV 导出 + 复制到剪贴板 | §5.4 | `ToolSection.tsx:69-87` |
| 12 | 默认按 Count 降序 | §5.4 | `ToolSection.tsx:62` |
| 13 | How it Works（3 步） | §6.1 | `[locale]/page.tsx:29-48` |
| 14 | Why it Matters | §6.2 | `[locale]/page.tsx:50-65` |
| 15 | Use Cases（4 卡片） | §6.3 | `[locale]/page.tsx:67-83` |
| 16 | FAQ（6 项 accordion） | §6.4 | `[locale]/page.tsx:85-112` |
| 17 | 底部 CTA | §6.5 | `[locale]/page.tsx:114-125` |
| 18 | Footer（3 列 + 版权） | §七 | `Footer.tsx` |
| 19 | 暗色模式（ThemeProvider 三态） | — | `ThemeProvider.tsx` |
| 20 | i18n（next-intl, en.json ~55 翻译键） | — | `messages/en.json` |
| 21 | Button（primary/outline, sm/md/lg） | UI | `Button.tsx` |
| 22 | Table（compound 子组件） | UI | `Table.tsx` |
| 23 | Input（error 态） | UI | `Input.tsx` |
| 24 | Logo（SVG icon + 文字） | — | `Logo.tsx` |
| 25 | 词频统计算法（清洗/分词/停用词/密度） | §5.4 | `ToolSection.tsx:31-66` |

### ❌ 缺失 / 未达标（14 项）

| # | 问题 | 严重程度 | 对应规格 |
|---|------|---------|---------|
| 1 | **URL 抓取未实现**（硬编码占位文本 "Sample content from URL extraction results."） | 🔴 功能 | §5.2, §5.4 |
| 2 | **URL 格式实时校验缺失**（仅 browser default `type="url"`） | 🔴 交互 | §5.2 |
| 3 | **结果区无子 Tab**（All / 1-word / 2-word / 3-word） | 🔴 UI | §5.4 |
| 4 | **结果表头点击排序缺失** | 🔴 交互 | §5.4 |
| 5 | **Schema.org 全部缺失**（WebApplication / FAQPage / BreadcrumbList） | 🔴 SEO | §八.4 |
| 6 | **定价/隐私/条款页缺失**（目录存在，page.tsx 空） | 🔴 页面 | §七 |
| 7 | JSON 导出缺失（仅有 CSV） | 🟡 | Task 1.8 |
| 8 | Bigram/Trigram 分析缺失 | 🟡 | Task 1.1 |
| 9 | 表格缺少 `<caption>` | 🟡 无障碍 | §八.3 |
| 10 | 按钮缺少 aria-label | 🟡 无障碍 | §八.3 |
| 11 | SEO 内容区无 lazy load | 🟢 性能 | §八.2 |
| 12 | 内容量约 600-700 词（spec 要求 1500） | 🟢 | §六 |
| 13 | 移动端 Tab 未垂直堆叠 | 🟢 响应式 | §八.1 |
| 14 | 移动端无汉堡菜单 | 🟢 响应式 | 未在 spec 但有益 |

### 基于 UI-COMPONENTS.md 优先级

| 等级 | 组件 | 状态 |
|------|------|------|
| P0 | Header, Hero, Tabs, Textarea, Input, Button, Table | ✅ 7/7 |
| P1 | Steps, FAQ, CTA, Footer | ✅ 4/4 |
| P2 | Pricing, Loaders, Dropdowns | 1/3（仅 Loaders ✅） |

### 总评

- **页面视觉还原度：~85%**。布局、组件、暗色模式、i18n 完整对齐设计 spec。
- **功能实现度：~40%**。URL 抓取硬编码、无 API 路由、无 n-gram、无排序。
- 首页作为 **演示原型（Demo）** 已足够；作为 **生产工具** 需补齐 🔴 标记项。
