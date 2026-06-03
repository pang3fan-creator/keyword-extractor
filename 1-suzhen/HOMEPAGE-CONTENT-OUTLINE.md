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
├── HowTo Schema（可选）
└── 字数目标: ~150 词

模块 2: Use Cases（扩充）
├── H2 标题
├── 4 个用户画像（H3）
└── 字数目标: ~250 词

模块 3: How It Works（扩充）
├── H2 标题
├── 3 个技术原理（H3）
└── 字数目标: ~200 词

模块 4: Why It Matters（保留精简）
├── H2 标题
├── 1 段概括
└── 字数目标: ~80 词

模块 5: FAQ（扩到 6 个）
├── H2 标题
├── 4 个现有 + 2 个新增
├── FAQPage Schema（更新）
└── 字数目标: ~200 词

模块 6: Bottom CTA（保留）
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
| Step 2 | Click "Extract Keywords" | 词频分析 / 过滤停用词 / 识别 bigram/trigram |
| Step 3 | Review, filter, and export your results | 筛选视图 / 排序 / CSV 导出 / 复制 |

### 覆盖关键词
| 关键词 | 搜索量 |
|--------|--------|
| `extract keywords from text` | 500 |
| `extract keywords from url` | 500 |
| `keyword extraction online` | 50 |

### Schema
可新增 `HowTo` JSON-LD（三步对应三个 HowToStep），但非必须

### 字数目标
~150 词

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
~250 词（每个 H3 约 60 词）

---

## 模块 3 — How It Works（扩充）

### H2 标题建议
`How the Website Keyword Extractor Works`

### 结构（3 个 H3）

| H3 | 技术原理 | 说明要点 |
|----|---------|---------|
| Word Frequency Analysis | 词频统计 | 统计每个词出现次数 / 计算密度百分比 |
| Stop-Word Filtering | 停用词过滤 | 过滤常见词（the, is, at...） |
| Multi-Word Phrase Detection | 短语检测 | 识别 2 词短语（bigram）和 3 词短语（trigram） |

### 覆盖关键词
| 关键词 | 搜索量 |
|--------|--------|
| `website keyword extractor` | 500 |
| `keyword extraction online` | 50 |
| `keywords extractor` | 500 |

### ⚠️ 注意
**不要写 TF-IDF**。后端实际是词频统计 + 停用词过滤 + density + bigram/trigram，不是 TF-IDF。

### 字数目标
~200 词（每个 H3 约 65 词）

---

## 模块 4 — Why It Matters（保留精简）

### H2 标题
`Why Keyword Extraction Matters for SEO`

### 内容
保留当前 1 段，不做扩充

### 字数目标
~80 词

---

## 模块 5 — FAQ（扩到 6 个）

### H2 标题
`Frequently Asked Questions About Keyword Extraction`

### 现有 4 个（保留不动）

| # | 问题主题 |
|---|---------|
| 1 | Is this tool really free? |
| 2 | How accurate is the keyword extraction? |
| 3 | Can I extract keywords from any website? |
| 4 | What formats can I download the results in? |

### 新增 2 个

| # | 问题主题 | 覆盖关键词 |
|---|---------|-----------|
| 5 | What's the difference between regular and AI keyword extraction? | `ai keyword extraction` |
| 6 | Do I need to sign up to use the keyword extractor? | `keywords extractor` |

### Schema
更新 `FAQPage` JSON-LD（mainEntity 从 4 扩到 6）

### ⚠️ 注意
避免与现有 FAQ 重复。不要新增 "Can I extract keywords from a website for free?"（与 #1 重复）。

### 字数目标
~200 词（每个 FAQ 约 30-35 词）

---

## Schema 改动汇总

| Schema | 状态 | 改动 |
|--------|------|------|
| WebApplication | ✅ 已有 | 保留 |
| FAQPage | ✅ 已有 | mainEntity 从 4 扩到 6 |
| Organization | ❌ 新增 | 品牌实体识别 |
| HowTo | ⚠️ 可选 | 三步操作指南（非必须） |

### ⚠️ 不要加 WebSite SearchAction
项目目前没有站内搜索功能，`SearchAction` Schema 不真实，建议暂不加。

### Organization Schema 结构

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ExtractKeywords",
  "url": "https://extractkeywords.com",
  "logo": "https://extractkeywords.com/logo.png"
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
    "seoHowFilterTitle": "...",
    "seoHowFilterDesc": "...",
    "seoHowPhraseTitle": "...",
    "seoHowPhraseDesc": "...",

    // 模块 5: FAQ 新增 2 个
    "seoFaq5Q": "...",
    "seoFaq5A": "...",
    "seoFaq6Q": "...",
    "seoFaq6A": "..."
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
├── How It Works（扩充，不含 TF-IDF）
├── Why It Matters（保留精简）
├── FAQ（扩到 6 个）
└── Bottom CTA（保留）
```

---

## 实施文件清单

| 文件 | 改动内容 |
|------|---------|
| `messages/en.json` | 新增 ~18 个翻译 key |
| `FaqSection.tsx` | 从 4 扩到 6 个 FAQ |
| `page.tsx` | 重排模块顺序 + 新增 How to Use + 追加 Organization Schema |

---

## 关键词覆盖汇总

| 关键词 | 搜索量 | 出现模块 |
|--------|--------|---------|
| `extract keywords` | 5,000 | H1 + 多处正文 |
| `extract keywords from text` | 500 | How to Use |
| `extract keywords from url` | 500 | How to Use |
| `website keyword extractor` | 500 | How It Works H2 + Use Cases |
| `find keywords in text` | 500 | Use Cases |
| `keywords extractor` | 500 | FAQ #6 |
| `ai keyword extraction` | 50 | FAQ #5 |
| `seo keyword extractor` | 50 | Use Cases |
| `keyword extraction nlp` | 50 | Use Cases |

---

## 字数预估

| 模块 | 字数 |
|------|------|
| How to Use | ~150 |
| Use Cases | ~250 |
| How It Works | ~200 |
| Why It Matters | ~80 |
| FAQ | ~200 |
| **总计** | **~880 词** |

加上 Hero + 工具区现有内容，首页总词数约 **1,100 词** ✅

---

## ⚠️ 待确认事项

### 免费版字符限制不一致

| 文档 | 免费版限制 |
|------|-----------|
| PRICING.md | 5,000 字符 |
| API 实际 | 50,000 字符 |

**需要主人确认最终值**，确保 FAQ 和文案与后端行为一致。

---

## ❌ 不做的事

| 项目 | 原因 |
|------|------|
| 内链模块 | 落地页尚未建立，放 `#` 对 SEO 无价值 |
| WebSite SearchAction | 项目无站内搜索功能，Schema 不真实 |
| FAQ 扩到 8 个 | 容易与现有内容重复，6 个足够 |
| TF-IDF 表述 | 后端实际不是 TF-IDF |
