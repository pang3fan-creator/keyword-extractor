# 变体页开发任务

## 背景

为 Extract Keywords 项目创建两个变体页面，针对长尾关键词获取流量。

## 目标页面

| 页面 | 路径 | 目标关键词 | 月搜索量 |
|------|------|-----------|---------|
| Website Keyword Extractor | `/tools/website-keyword-extractor` | website keyword extractor, extract keywords from web page | 500 + 500 |
| Text Keyword Extractor | `/tools/text-keyword-extractor` | extract keywords from text, find keywords in text | 500 + 500 |

---

## 技术实现

### 1. 路由结构

- 创建 `/tools/[slug]/page.tsx` 动态路由
- 支持静态生成（generateStaticParams）

### 2. 模板组件

- 复用首页组件结构
- 通过 props 控制显示哪个 Tab：
  - `mode: 'url' | 'text'` 
  - URL 模式：只显示 URL Tab
  - Text 模式：只显示 Text Tab

### 3. 内链

- Footer 新增 "More Tools" 区块，链接到变体页
- 变体页底部链接回首页

### 4. Sitemap

- 更新 `src/app/sitemap.ts`，自动包含 `/tools/*` 路径

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
| 工具区 | 只显示 URL Tab（隐藏 Text/AI） |
| How it works | 1. Paste URL → 2. We fetch content → 3. Get keywords |
| Use cases | Competitor analysis, Content research, SEO audit, Backlink research |
| FAQ | 5 个问题（见下方） |
| CTA | Link back to homepage |

### FAQ 问题

1. What types of websites are supported?
2. How accurate is the keyword extraction?
3. Is there a limit on URL length?
4. What if the website blocks the extraction?
5. Can I extract keywords from password-protected pages?

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
| 工具区 | 只显示 Text Tab（隐藏 URL/AI） |
| How it works | 1. Paste text → 2. We analyze it → 3. Get keywords |
| Use cases | Content optimization, Blog writing, Academic writing, Resume keywords |
| FAQ | 5 个问题（见下方） |
| CTA | Link back to homepage |

### FAQ 问题

1. What is the maximum text length?
2. What languages are supported?
3. How are keywords ranked?
4. Can I extract phrases (2-3 words)?
5. Is my text stored or saved?

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

- [ ] 两个页面可正常访问
- [ ] 每个页面只显示对应的 Tab
- [ ] Metadata 正确（title, description, OG）
- [ ] Schema.org 结构化数据（WebApplication, FAQPage）
- [ ] Footer 内链正确
- [ ] Sitemap 包含新页面
- [ ] Lighthouse SEO score >= 90
- [ ] 移动端适配正常

---

## 注意事项

- 不要复制首页内容，保证每个页面有独特价值
- 遵循项目 AGENTS.md 规范
- UI 文案必须来自 `messages/en.json`
- 使用 `cn()` 合并 className
- 测试：`npm run build` 成功
