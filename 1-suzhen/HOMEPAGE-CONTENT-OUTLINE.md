# 首页 SEO 内容提纲

> 基于以下资料综合制定：
> - KEYWORD-RESEARCH.md（关键词数据）
> - COMPETITOR-ANALYSIS.md（竞品结构分析）
> - GEO-AI-SEO.md（Schema + AI 爬虫策略）
> - SITE-STRUCTURE.md（站点架构）
> - 0-Develop_Doc/extract-keywords.md（Google Keyword Planner 长尾词数据）

---

## 内容布局（自上而下）

```
Hero（不变）
├── H1: "Extract Keywords from Text or URL"
└── Subtitle: "Free online keyword extraction tool..."

工具区 ToolSection（不变）
├── Tabs: Text / URL / AI 🔒PRO
├── 输入区
└── 结果区

=== 以下为 SEO 内容区（新增/扩充）===

模块 1: How to Use（新增）
├── H2 标题
├── 3 步骤（Step 1 / Step 2 / Step 3）
├── HowTo Schema
└── 字数目标: ~200 词

模块 2: Use Cases（扩充）
├── H2 标题
├── 4 个用户画像（H3）
└── 字数目标: ~300 词

模块 3: How It Works（扩充）
├── H2 标题
├── 3 个技术原理（H3）
└── 字数目标: ~300 词

模块 4: Why It Matters（保留精简）
├── H2 标题
├── 1 段概括
└── 字数目标: ~80 词

模块 5: FAQ（扩到 8 个）
├── H2 标题
├── 4 个现有 + 4 个新增
├── FAQPage Schema（更新）
└── 字数目标: ~250 词

模块 6: 内链模块（新增）
├── H2 标题
├── 4 个功能落地页卡片
└── 字数目标: ~100 词

模块 7: Bottom CTA（保留）
└── 字数目标: ~30 词
```

---

## 模块 1 — How to Use（新增）

### H2 标题建议
`How to Extract Keywords from Text or URL in 3 Simple Steps`

### 结构
| Step | 标题 | 说明要点 |
|------|------|---------|
| Step 1 | Paste your text or enter a webpage URL | Text tab 粘贴内容 / URL tab 输入网址 |
| Step 2 | Click "Extract Keywords" | TF-IDF 分析 / 过滤停用词 / 识别 bigram/trigram |
| Step 3 | Review, filter, and export your results | 筛选视图 / 排序 / CSV 导出 / 复制 |

### 覆盖关键词
| 关键词 | 搜索量 |
|--------|--------|
| `extract keywords from text` | 500 |
| `extract keywords from url` | 500 |
| `keyword extraction online` | 50 |
| `free keyword extractor` | 50 |

### Schema
新增 `HowTo` JSON-LD（三步对应三个 HowToStep）

### 字数目标
~200 词

---

## 模块 2 — Use Cases（扩充）

### H2 标题建议
`Who Uses a Keyword Extraction Tool?`

### 结构（4 个 H3）

| H3 | 用户画像 | 覆盖关键词 |
|----|---------|-----------|
| For SEO Professionals | SEO 从业者分析竞品、验证内容 | `seo keyword extractor`, `extract seo keywords from website` |
| For Content Creators & Bloggers | 博客作者优化文章 | `extract keywords from article`, `find keywords in text` |
| For Academic Researchers | 学术研究者提取主题 | `keyword extraction nlp`, `extract keywords from document` |
| For Digital Marketers | 营销人员分析落地页 | `website keyword extractor`, `extract keywords from web page` |

### 视觉建议
4 个 H3 用卡片式布局（Grid 2×2），每个卡片含图标 + 标题 + 2-3 句描述

### 字数目标
~300 词（每个 H3 约 70-80 词）

---

## 模块 3 — How It Works（扩充）

### H2 标题建议
`How the Website Keyword Extractor Works`

### 结构（3 个 H3）

| H3 | 技术原理 | 说明要点 |
|----|---------|---------|
| Statistical Text Analysis | TF-IDF 词频统计 | 过滤停用词 / 按频率+相关性排序 |
| Multi-Word Phrase Detection | Bigram/Trigram 短语检测 | 长尾关键词发现 |
| URL Content Extraction | URL 内容抓取 | 遵守 robots.txt / 提取正文 |

### 覆盖关键词
| 关键词 | 搜索量 |
|--------|--------|
| `website keyword extractor` | 500 |
| `keyword extraction online` | 50 |
| `keyword extraction nlp` | 50 |

### 字数目标
~300 词（每个 H3 约 100 词）

---

## 模块 4 — Why It Matters（保留精简）

### H2 标题
`Why Keyword Extraction Matters for SEO`

### 内容
保留当前 1 段，不做扩充

### 字数目标
~80 词

---

## 模块 5 — FAQ（扩到 8 个）

### H2 标题
`Frequently Asked Questions About Keyword Extraction`

### 现有 4 个（保留不动）

| # | 问题主题 |
|---|---------|
| 1 | Is this tool really free? |
| 2 | How accurate is the keyword extraction? |
| 3 | Can I extract keywords from any website? |
| 4 | What formats can I download the results in? |

### 新增 4 个

| # | 问题主题 | 覆盖关键词 |
|---|---------|-----------|
| 5 | Can I extract keywords from a website for free? | `extract keywords from website free` |
| 6 | What's the difference between regular and AI keyword extraction? | `ai keyword extraction` |
| 7 | Do I need to sign up to use the keyword extractor? | `keywords extractor` |
| 8 | What is the maximum text length supported? | - |

### Schema
更新 `FAQPage` JSON-LD（mainEntity 从 4 扩到 8）

### 字数目标
~250 词（每个 FAQ 约 30-35 词）

---

## 模块 6 — 内链模块（新增）

### H2 标题建议
`Try These Keyword Extraction Tools`

### 结构（4 个卡片）

| 卡片标题 | 链接 | 覆盖关键词 |
|---------|------|-----------|
| Extract Keywords from Text | `/extract-keywords-from-text` | `extract keywords from text` |
| Extract Keywords from URL | `/extract-keywords-from-url` | `extract keywords from url` |
| YouTube Keyword Extractor | `/youtube-keyword-extractor` | `youtube keyword extractor` |
| PDF Keyword Extractor | `/extract-keywords-from-pdf` | `extract keywords from pdf` |

> ⚡ 落地页尚未建立，链接暂时指向 `#` 或首页锚点

### 字数目标
~100 词（每个卡片标题 + 一句简短说明）

---

## Schema 改动汇总

| Schema | 状态 | 改动 |
|--------|------|------|
| WebApplication | ✅ 已有 | 保留 |
| FAQPage | ✅ 已有 | mainEntity 从 4 扩到 8 |
| Organization | ❌ 新增 | 品牌实体识别 |
| WebSite | ❌ 新增 | 站点识别 + 搜索动作 |
| HowTo | ❌ 新增 | 三步操作指南 |

### Organization + WebSite Schema 结构

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ExtractKeywords",
  "url": "https://extractkeywords.com",
  "logo": "https://extractkeywords.com/logo.png"
}
```

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ExtractKeywords",
  "url": "https://extractkeywords.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://extractkeywords.com/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

---

## `messages/en.json` 新增 Key 清单

```json
{
  "home": {
    // 模块 1: How to Use
    "seoHowToUseTitle": "...",
    "seoHowToUseStep1Title": "...",
    "seoHowToUseStep1Desc": "...",
    "seoHowToUseStep2Title": "...",
    "seoHowToUseStep2Desc": "...",
    "seoHowToUseStep3Title": "...",
    "seoHowToUseStep3Desc": "...",
    "seoHowToUseCta": "...",

    // 模块 2: Use Cases（替换现有 seoUse1-5）
    "seoUseSeoTitle": "...",
    "seoUseSeoDesc": "...",
    "seoUseContentTitle": "...",
    "seoUseContentDesc": "...",
    "seoUseAcademicTitle": "...",
    "seoUseAcademicDesc": "...",
    "seoUseMarketingTitle": "...",
    "seoUseMarketingDesc": "...",

    // 模块 3: How It Works（扩充）
    "seoHowStatsTitle": "...",
    "seoHowStatsDesc": "...",
    "seoHowPhraseTitle": "...",
    "seoHowPhraseDesc": "...",
    "seoHowUrlTitle": "...",
    "seoHowUrlDesc": "...",

    // 模块 5: FAQ 新增 4 个
    "seoFaq5Q": "...",
    "seoFaq5A": "...",
    "seoFaq6Q": "...",
    "seoFaq6A": "...",
    "seoFaq7Q": "...",
    "seoFaq7A": "...",
    "seoFaq8Q": "...",
    "seoFaq8A": "...",

    // 模块 6: 内链模块
    "seoToolsTitle": "...",
    "seoToolText": "...",
    "seoToolTextDesc": "...",
    "seoToolUrl": "...",
    "seoToolUrlDesc": "...",
    "seoToolYoutube": "...",
    "seoToolYoutubeDesc": "...",
    "seoToolPdf": "...",
    "seoToolPdfDesc": "..."
  }
}
```

---

## 页面布局改动（`page.tsx`）

```
Hero (不变)
↓
工具区 ToolSection (不变)
↓
【新增】How to Use
↓
SEO 内容区
├── Use Cases（移到 How It Works 之前）
├── How It Works（扩充）
├── Why It Matters（保留精简）
├── FAQ（扩到 8 个）
├── 【新增】内链模块
└── Bottom CTA（保留）
```

---

## 实施文件清单

| 文件 | 改动内容 |
|------|---------|
| `messages/en.json` | 新增 ~25 个翻译 key |
| `FaqSection.tsx` | 从 4 扩到 8 个 FAQ |
| `page.tsx` | 重排模块顺序 + 新增 How to Use + 内链模块 + 追加 Schema |

---

## 关键词覆盖汇总

| 关键词 | 搜索量 | 出现模块 |
|--------|--------|---------|
| `extract keywords` | 5,000 | H1 + 多处正文 |
| `extract keywords from text` | 500 | How to Use + 内链 |
| `extract keywords from url` | 500 | How to Use + 内链 |
| `website keyword extractor` | 500 | How It Works H2 + Use Cases |
| `find keywords in text` | 500 | Use Cases |
| `keywords extractor` | 500 | FAQ |
| `extract keywords from website free` | 50 | FAQ #5 |
| `ai keyword extraction` | 50 | FAQ #6 |
| `seo keyword extractor` | 50 | Use Cases |
| `keyword extraction nlp` | 50 | How It Works + Use Cases |

---

## 字数预估

| 模块 | 字数 |
|------|------|
| How to Use | ~200 |
| Use Cases | ~300 |
| How It Works | ~300 |
| Why It Matters | ~80 |
| FAQ | ~250 |
| 内链模块 | ~100 |
| **总计** | **~1,230 词** |

加上 Hero + 工具区现有内容，首页总词数约 **1,600 词** ✅
