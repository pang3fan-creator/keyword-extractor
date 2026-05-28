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
- [ ] Header 组件（Logo + 导航）
- [ ] Hero 区域（H1 + 副标题）
- [ ] Footer 组件

### Phase 2: 工具区
- [ ] Tab 切换组件
- [ ] Text Tab（文本输入 + 按钮）
- [ ] URL Tab（URL 输入 + 按钮）
- [ ] 结果展示区（表格 + 导出）

### Phase 3: SEO 内容区
- [ ] How it Works 模块
- [ ] Why it Matters 模块
- [ ] Use Cases 模块
- [ ] FAQ 模块（含 Schema）
- [ ] 底部 CTA

### Phase 4: 功能实现
- [ ] 文本提取算法（词频统计）
- [ ] URL 抓取 + 提取
- [ ] CSV 导出
- [ ] Copy to Clipboard

---

## 十一、待确认事项

1. **品牌主色：** 蓝色 or 绿色？
2. **Logo：** 纯文字 or 文字+图标？
3. **免费版限制：** 是否限制字数/次数？
4. **AI 功能：** 付费后才显示 Tab，或显示但锁定？

---

*文档创建：2026-05-28*
*待主人审阅后交给 Claude Code 执行*
