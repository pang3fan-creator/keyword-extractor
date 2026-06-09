# 变体页开发任务

## 背景

为 Extract Keywords 项目创建两个变体页面，针对长尾关键词获取流量。

## 目标页面

| 页面 | 路径 | 目标关键词 | 月搜索量 |
|------|------|-----------|---------|
| Website Keyword Extractor | `/tools/website-keyword-extractor` | website keyword extractor, extract keywords from web page | 500 + 500 |
| Text Keyword Extractor | `/tools/text-keyword-extractor` | extract keywords from text, find keywords in text | 500 + 500 |

---

## 战略调整

### 核心原则

变体页不能做成"首页少一个 Tab 的版本"，否则 Google 判定 thin content。
需要 **首页降级为父级总览页** + **变体页吃透各自长尾**。

### 首页定位 → 父级页 "Keyword Extraction Tool"

首页从"功能入口"变为"总览页"，系统性地降低精确长尾词密度：

**需要修改的首页内容**（在 `messages/en.json` 的 `home` namespace 中）：

| 位置 | 当前文案问题 | 改为 |
|------|------------|------|
| Hero title | "Keyword Extractor" | 保持，没问题（宽泛词） |
| Hero subtitle | "Extract keywords from any **text or URL**" | 调弱，去具体化 |
| Use Case 卡片 | "any webpage"、"URL extractor"、"**website keyword extractor**" | 改为通用表述，让出长尾关键词空间 |

**首页 FAQ 改为通用问题**（与变体页 FAQ 完全无话题重叠）：

| # | 新首页 FAQ（通用） | 对应的变体页 FAQ 话题 |
|---|-------------------|---------------------|
| 1 | Is this tool free? No signup required? | — |
| 2 | Can I download or export the results? | — |
| 3 | Is there an AI-powered version planned? | — |
| 4 | What do the columns in the results table mean? | — |
| 5 | How is my data handled? Privacy overview | 隐私话题留给变体页讲细节 |

### 变体页 FAQ → 专项技术细节

Website 页 FAQ 只讲 URL 模式专项：
1. What happens if the website blocks crawlers (robots.txt)?
2. How long does it take to fetch and analyze a page?
3. What is the maximum URL length supported?
4. Can I extract keywords from PDF or image URLs?
5. What content does the extractor actually analyze from the page?

Text 页 FAQ 只讲 Text 模式专项：
1. What is the maximum text length the tool can process?
2. Is the tool suitable for languages other than English?
3. How are keywords ranked — by frequency, relevance, or both?
4. Does the tool detect multi-word phrases (bigrams and trigrams)?
5. Is my pasted text stored, logged, or sent to any server besides extraction?

### 真实内容承诺

**Website 页文案不能写 "any URL / any website"**，必须如实说明：
- 只支持公开 HTTP/HTTPS 网页
- 受 robots.txt、10 秒超时、1MB 内容大小限制
- 只分析 HTML 内容（不支持 PDF/图片）
- Metadata/Hero 用 **"public webpage URL"** 或 **"public HTML page"**

**Text 页不能声称多语言支持**，必须如实说明：
- 当前算法以英文 stop words + `a-z0-9-` 字符过滤为基础
- FAQ 写 **"currently best suited for English text"**
- 未来可扩展多语言支持

### 变体页独特内容

每个变体页加一块首页没有的独特内容：

**Website 页：** "What Gets Analyzed" 区块 — 说明提取范围（title、meta description、headings、body text、alt text），解释不分析的内容（images、PDFs、scripts、JS-rendered），以及什么 URL 适合/不适合提取。

**Text 页：** "How Keywords Are Ranked" 区块 — 用简单例子展示 word frequency、stop-word filtering、bigram/trigram detection 如何工作，给出一个 50 词的示例文本和它的输出结果。

### 内链漏斗

- **首页 → 变体页**：Footer 新增 "More Tools" 区块，链接到变体页
- **变体页 → 首页**：底部 CTA "Try other extraction modes" 链接回首页
- 构建清晰的父子关系信号

---

## 技术实现

### 1. 路由结构

```
src/app/[locale]/tools/[slug]/page.tsx
```

```typescript
export async function generateStaticParams() {
  const slugs = ['website-keyword-extractor', 'text-keyword-extractor'];
  const params = [];
  for (const locale of routing.locales) {
    for (const slug of slugs) {
      params.push({ slug, locale });
    }
  }
  return params;
}

// 未知 slug 返回 404
export const dynamicParams = false;
```

- 动态路由带 `[locale]` 层
- 所有 URL 拼写必须使用 `buildUrl(locale, "/tools/...")`，禁止手写 `/${locale}/tools/...`
- 未知 slug 直接 404（`dynamicParams = false`）

### 2. Canonical / Hreflang / OG

**关键**：`[locale]/layout.tsx` 的 canonical 固定到首页，变体页必须在 `generateMetadata` 中覆盖：

```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 设置自己的 canonical / hreflang / OG / Twitter
  // 不能继承 layout.tsx 的 fallback canonical
}
```

### 3. 组件复用策略

#### ToolSection — `allowedTabs` prop

```typescript
type TabMode = 'text' | 'url' | 'ai';
interface ToolSectionProps {
  allowedTabs?: TabMode[];  // 默认 ['text', 'url', 'ai']
}
```

- Website 变体页：`<ToolSection allowedTabs={['url']} />`
- Text 变体页：`<ToolSection allowedTabs={['text']} />`

#### SEO 区块组件 — namespace prop

以下组件统一加 `namespace` prop：

| 组件 | 类型 | 首页传入 | 变体页传入 |
|------|------|---------|-----------|
| `HowItWorksSection` | server component | `'home'` | `'website-extractor'` / `'text-extractor'` |
| `HowToUseSection` | server component | `'home'` | 同上 |
| `UseCasesSection` | server component | `'home'` | 同上 |
| `FaqSection` | client component | `'home'` | 同上 |

### 4. 翻译结构

```json
{
  "website-extractor": {
    "hero": { ... },
    "howItWorks": { ... },
    "howToUse": { ... },
    "useCases": { ... },
    "whatGetsAnalyzed": { ... },
    "faq": [ ... ]
  },
  "text-extractor": {
    "hero": { ... },
    "howItWorks": { ... },
    "howToUse": { ... },
    "useCases": { ... },
    "howKeywordsRanked": { ... },
    "faq": [ ... ]
  },
  "footer": {
    "moreTools": "More Tools",
    "websiteExtractor": "Website Keyword Extractor",
    "textExtractor": "Text Keyword Extractor"
  }
}
```

### 5. Schema 结构化数据

**变体页**使用独立 JSON-LD：
- `WebApplication`（URL 指向变体页自身，offer 只写 Free）
- `FAQPage`（用变体页 FAQ 内容）
- **不**重复首页的 `Organization` / `WebSite`

**首页** `FAQPage` schema **同步更新**为新的首页通用 FAQ 内容。

### 6. CTA 链接

- 变体页回首页：链接到 `/`（用 `buildUrl`），不是 `#toolArea`
- 首页 CTA 保持 `#toolArea`（同页滚动）

### 7. AI Tab 处理

变体页彻底不渲染 AI Tab，避免混淆。

### 8. Sitemap

更新 `src/app/sitemap.ts`，自动包含 `/tools/*` 路径。

### 9. llms.txt

更新 `public/llms.txt`，添加新页面路径。

### 10. AGENTS.md

实现后更新 Key Paths，添加：
```
- Tools 变体页: `src/app/[locale]/tools/[slug]/page.tsx`
```

---

## 页面 1: Website Keyword Extractor

### Metadata

```
Title: Website Keyword Extractor - Extract Keywords from Public Webpages Free
Description: Free website keyword extractor tool. Paste a public webpage URL and extract keywords instantly. Analyzes HTML content including titles, headings, and body text. No signup required.
```

### 页面结构

| 区块 | 内容要点 |
|------|---------|
| Hero | H1: Website Keyword Extractor<br>副标题: Extract keywords from any public webpage URL |
| 工具区 | 只显示 URL Tab（不渲染 Text/AI） |
| How it works | 1. Paste a public webpage URL → 2. We fetch & analyze the HTML → 3. Get keywords |
| What Gets Analyzed | 说明提取范围 + 不支持的内容类型（独特内容区块） |
| Use cases | Competitor analysis, Content research, SEO audit, Backlink research |
| FAQ | 5 个问题（URL 模式专项技术细节） |
| CTA | Link back to homepage |

### FAQ 问题

1. What happens if the website blocks crawlers (robots.txt)?
2. How long does it take to fetch and analyze a page?
3. Can I extract keywords from PDF or image URLs?
4. What content does the extractor actually analyze from the page?
5. What types of webpages work best for keyword extraction?

### 示例 URL

使用真实博客文章 URL 作为 placeholder

---

## 页面 2: Text Keyword Extractor

### Metadata

```
Title: Text Keyword Extractor - Find Keywords in Any Text Free
Description: Free text keyword extractor tool. Paste any text and find keywords — best suited for English. Supports up to 10,000 characters with word frequency and phrase detection. No signup required.
```

### 页面结构

| 区块 | 内容要点 |
|------|---------|
| Hero | H1: Text Keyword Extractor<br>副标题: Find keywords in any text, article, or document |
| 工具区 | 只显示 Text Tab（不渲染 URL/AI） |
| How it works | 1. Paste text → 2. We analyze it → 3. Get keywords |
| How Keywords Are Ranked | word frequency、stop-word filtering、bigram/trigram + 示例（独特内容区块） |
| Use cases | Content optimization, Blog writing, Academic writing, Resume keywords |
| FAQ | 5 个问题（Text 模式专项技术细节） |
| CTA | Link back to homepage |

### FAQ 问题

1. What is the maximum text length the tool can process?
2. Is the tool suitable for languages other than English?
3. How are keywords ranked — by frequency, relevance, or both?
4. Does the tool detect multi-word phrases (bigrams and trigrams)?
5. Is my pasted text stored, logged, or sent to any server besides extraction?

### 示例文本

提供一段 150-200 词的示例文本（博客段落风格），配合 "How Keywords Are Ranked" 展示实际输出。

---

## SEO 文案（英文）

**由主人指定的 AI 工具（OpenCode）撰写具体文案，素贞只提供结构。**

所有文案写入 `messages/en.json`，按页面分组。

---

## 验收标准

- [ ] 两个页面可正常访问（`/tools/website-keyword-extractor`、`/tools/text-keyword-extractor`）
- [ ] 每个页面只显示对应的 Tab（URL 页面只显示 URL Tab，Text 页面只显示 Text Tab）
- [ ] Metadata 正确（title, description, OG，<= 160 chars）
- [ ] 变体页 `generateMetadata` 正确覆盖 canonical / hreflang / OG / Twitter
- [ ] Schema.org 结构化数据（WebApplication + FAQPage，不重复 Organization/WebSite）
- [ ] 首页 FAQPage schema 同步更新为新的通用 FAQ
- [ ] Footer 新增 "More Tools" 区块，内链正确
- [ ] Sitemap 包含新页面
- [ ] Lighthouse SEO score >= 90
- [ ] 移动端适配正常
- [ ] **首页内容已降级为父级总览页**：
  - [ ] `seoHowTitle` 改为 "How the Keyword Extraction Tool Works"
  - [ ] Hero 副标题去具体化
  - [ ] Use Cases 去掉精确长尾词（"website keyword extractor"、"URL extractor" 等）
  - [ ] 首页 FAQ 改为 5 个通用问题（free/export/AI planned/privacy/columns），与变体页无话题重叠
- [ ] **变体页内容真实**：
  - [ ] Website 页写 "public webpage URL" 而非 "any URL"
  - [ ] Text 页写 "best suited for English" 而非多语言支持
- [ ] **变体页有独特内容区块**（What Gets Analyzed / How Keywords Are Ranked）
- [ ] **未知 slug 返回 404**（访问 `/tools/whatever` → 404）
- [ ] **`public/llms.txt` 已添加新页面**
- [ ] **`AGENTS.md` Key Paths 已更新**
- [ ] **`npm run build` 通过**

---

## 注意事项

- 不要复制首页内容，保证每个页面有独特价值
- 遵循项目 AGENTS.md 规范
- UI 文案必须来自 `messages/en.json`，不要硬编码
- 使用 `cn()` 合并 className
- 所有 URL 使用 `buildUrl()`，禁止手写 `/${locale}/...`
- AI Tab 在变体页不渲染
- CTA 链接回首页用 `/`，不是 `#toolArea`
- 测试：`npm run build` 成功