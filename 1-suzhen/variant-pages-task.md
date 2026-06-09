# 变体页开发任务

## 背景

为 Extract Keywords 项目创建两个变体页面，针对长尾关键词获取流量。

## 目标页面

| 页面 | 路径 | 目标关键词 | 月搜索量 |
|------|------|-----------|---------|
| Website Keyword Extractor | `/tools/website-keyword-extractor` | website keyword extractor, extract keywords from web page | 500 + 500 |
| Text Keyword Extractor | `/tools/text-keyword-extractor` | extract keywords from text, find keywords in text | 500 + 500 |

---

## 战略调整（源自审核报告）

### 功能冲突应对

变体页使用的后端 API 和算法与首页相同，Google 可能判定变体页为 thin content（功能子集）。
**解决方案**：靠内容深度 + 内链漏斗，而非功能差异。

### 首页调整

首页 `seoHowTitle` 从 "How the **Website Keyword Extractor** Works" 改为 "How the **Keyword Extraction Tool** Works"，让出 `website keyword extractor` 关键词空间给变体页。

### FAQ 彻底差异化

- **变体页 FAQ**：只讲对应模式的专项技术细节（robots.txt、fetch 超时、文本长度限制等）
- **首页 FAQ**：保持通用，与变体页 FAQ **无话题重叠**

### 内链漏斗

- **首页 → 变体页**：Footer 新增 "More Tools" 区块，链接到变体页（"Learn more about website/text keyword extraction"）
- **变体页 → 首页**：底部 CTA 链接回首页（"Try other extraction modes"），构建父子关系信号

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

### 2. 组件复用策略

#### ToolSection — `allowedTabs` prop

```typescript
// ToolSection 接收 allowedTabs prop，控制显示哪些 Tab
type TabMode = 'text' | 'url' | 'ai';
interface ToolSectionProps {
  allowedTabs?: TabMode[];  // 默认 ['text', 'url', 'ai']
}
```

**调用示例**：
- Website 变体页：`<ToolSection allowedTabs={['url']} />`
- Text 变体页：`<ToolSection allowedTabs={['text']} />`

#### SEO 区块组件 — namespace prop

```
HowItWorksSection / UseCasesSection / FaqSection
→ 统一加 namespace prop，读不同翻译命名空间
```

- `HowItWorksSection`：server component，`getTranslations(namespace)`
- `UseCasesSection`：server component，`getTranslations(namespace)`
- `FaqSection`：client component，`useTranslations(namespace)`
- 变体页传入 `'website-extractor'` / `'text-extractor'`

### 3. 翻译结构

```json
{
  "website-extractor": {
    "hero": { ... },
    "howItWorks": { ... },
    "useCases": { ... },
    "faq": [ ... ]
  },
  "text-extractor": {
    "hero": { ... },
    "howItWorks": { ... },
    "useCases": { ... },
    "faq": [ ... ]
  },
  "footer": {
    "moreTools": "More Tools",
    "websiteExtractor": "Website Keyword Extractor",
    "textExtractor": "Text Keyword Extractor"
  }
}
```

### 4. Schema 结构化数据

变体页使用**独立** JSON-LD：
- `WebApplication`（URL 指向变体页自身，offer 只写 Free）
- `FAQPage`（用变体页 FAQ 内容）
- **不**重复首页的 `Organization` / `WebSite`

### 5. CTA 链接

- 变体页回首页：链接到 `/`（用 `buildUrl`），不是 `#toolArea`
- 首页 CTA 保持 `#toolArea`（同页滚动）

### 6. AI Tab 处理

变体页彻底不渲染 AI Tab，避免混淆。

### 7. Sitemap

更新 `src/app/sitemap.ts`，自动包含 `/tools/*` 路径：

```typescript
const toolPages = ['website-keyword-extractor', 'text-keyword-extractor'];
// 遍历 locales 为每个工具页生成条目
```

### 8. llms.txt

更新 `public/llms.txt`，添加新页面路径。

### 9. AGENTS.md

实现后更新 Key Paths，添加：
```
- Tools 变体页: `src/app/[locale]/tools/[slug]/page.tsx`
```

---

## 页面 1: Website Keyword Extractor

### Metadata

```
Title: Website Keyword Extractor - Extract Keywords from Any URL Free
Description: Free website keyword extractor tool. Paste any URL and extract keywords from web pages instantly. No signup required. Try now.
```

### 页面结构

| 区块 | 内容要点 |
|------|---------|
| Hero | H1: Website Keyword Extractor<br>副标题: Extract keywords from any website or URL in seconds |
| 工具区 | 只显示 URL Tab（不渲染 Text/AI） |
| How it works | 1. Paste URL → 2. We fetch content → 3. Get keywords |
| Use cases | Competitor analysis, Content research, SEO audit, Backlink research |
| FAQ | 5 个问题（只讲 URL 模式专项技术细节，不与首页 FAQ 重叠） |
| CTA | Link back to homepage |

### FAQ 问题（专项技术细节，不与首页重叠）

1. What happens if the website blocks crawlers (robots.txt)?
2. How long does it take to fetch and analyze a page?
3. What is the maximum URL length supported?
4. Can I extract keywords from PDF or image URLs?
5. What content does the extractor actually analyze from the page?

### 示例 URL

使用真实博客文章 URL 作为 placeholder

---

## 页面 2: Text Keyword Extractor

### Metadata

```
Title: Text Keyword Extractor - Find Keywords in Any Text Free
Description: Free text keyword extractor tool. Paste any text and find keywords instantly. Supports long articles, blog posts, and documents. No signup required.
```

### 页面结构

| 区块 | 内容要点 |
|------|---------|
| Hero | H1: Text Keyword Extractor<br>副标题: Find keywords in any text, article, or document |
| 工具区 | 只显示 Text Tab（不渲染 URL/AI） |
| How it works | 1. Paste text → 2. We analyze it → 3. Get keywords |
| Use cases | Content optimization, Blog writing, Academic writing, Resume keywords |
| FAQ | 5 个问题（只讲 Text 模式专项技术细节，不与首页 FAQ 重叠） |
| CTA | Link back to homepage |

### FAQ 问题（专项技术细节，不与首页重叠）

1. What is the maximum text length the tool can process?
2. What languages are supported for keyword extraction?
3. How are keywords ranked — by frequency, relevance, or both?
4. Does the tool detect multi-word phrases (bigrams and trigrams)?
5. Is my pasted text stored, logged, or sent to any server besides extraction?

### 示例文本

提供一段 150-200 词的示例文本（博客段落风格）

---

## SEO 文案（英文）

**由主人指定的 AI 工具（OpenCode）撰写具体文案，素贞只提供结构。**

所有文案写入 `messages/en.json`，按页面分组：

```json
{
  "website-extractor": {
    "hero": { ... },
    "howItWorks": { ... },
    "useCases": { ... },
    "faq": [ ... ]
  },
  "text-extractor": {
    "hero": { ... },
    "howItWorks": { ... },
    "useCases": { ... },
    "faq": [ ... ]
  }
}
```

---

## 验收标准

- [ ] 两个页面可正常访问（`/tools/website-keyword-extractor`、`/tools/text-keyword-extractor`）
- [ ] 每个页面只显示对应的 Tab（URL 页面只显示 URL Tab，Text 页面只显示 Text Tab）
- [ ] Metadata 正确（title, description, OG，<= 160 chars）
- [ ] Schema.org 结构化数据（WebApplication + FAQPage，不重复 Organization/WebSite）
- [ ] Footer 新增 "More Tools" 区块，内链正确
- [ ] Sitemap 包含新页面
- [ ] Lighthouse SEO score >= 90
- [ ] 移动端适配正常
- [ ] **首页 H2 标题已调整**（"How the Website Keyword Extractor Works" → "How the Keyword Extraction Tool Works"）
- [ ] **变体页 FAQ 与首页 FAQ 无话题重合**
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