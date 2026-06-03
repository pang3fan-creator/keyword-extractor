# 首页 SEO 内容提纲

> 基于以下资料综合制定：
> - KEYWORD-RESEARCH.md（关键词数据）
> - COMPETITOR-ANALYSIS.md（竞品结构分析）
> - GEO-AI-SEO.md（Schema + AI 爬虫策略）
> - SITE-STRUCTURE.md（站点架构）
> - 0-Develop_Doc/extract-keywords.md（Google Keyword Planner 长尾词数据）
> - 当前首页 page.tsx + messages/en.json（现有内容审计）

---

## 内容布局（自上而下）

```
Hero（不变）
├── H1: "Extract Keywords from Text or URL"
├── Subtitle: "Free online keyword extraction tool..."

工具区 ToolSection（不变）
├── Tabs: Text / URL / AI 🔒PRO
├── 输入区
└── 结果区

=== 以下为 SEO 内容区（新增/扩充）===

模块 1: How to Use（新增，~200 词）
├── 3 步骤操作指南
├── HowTo Schema
└── 底部"回到工具"锚点

模块 2: Use Cases（扩充，~300 词）
├── 4 个用户画像 + 场景说明
└── 覆盖 6 个长尾关键词

模块 3: How It Works（扩充，~300 词）
├── 3 个技术原理子模块
└── 主攻 nlp/tf-idf 长尾词

模块 4: Why It Matters（精简保留，~80 词）
├── 1 段概括
└── 保持简洁不重复

模块 5: FAQ（扩到 8 个，~250 词）
├── 4 个现有 + 4 个新增
└── FAQPage Schema（已有）

模块 6: 内链模块（新增，~100 词）
├── 4 个功能落地页卡片
└── 传递权重到子页面

模块 7: Bottom CTA（保留，~30 词）
└── 底部 CTA，不增加
```

---

## 模块 1 — How to Use（新增）

### H2 标题
`How to Extract Keywords from Text or URL in 3 Simple Steps`

### 结构

**Step 1 — Paste your text or enter a webpage URL**
- Text tab: paste any article, blog post, or document content directly
- URL tab: enter a webpage address to analyze its content
- Real-time character count and URL validation included

**Step 2 — Click "Extract Keywords"**
- The tool processes your content using TF-IDF statistical analysis
- Automatically filters out common stop words
- Identifies single keywords, 2-word phrases (bigrams), and 3-word phrases (trigrams)

**Step 3 — Review, filter, and export your results**
- Filter between All, 1-word, 2-word, and 3-word views
- Sort by keyword, frequency count, or density percentage
- Download as CSV file or copy to clipboard

### 关键词布局
| 关键词 | 搜索量 | 位置 |
|--------|--------|------|
| `extract keywords from text` | 500 | Step 1, Step 2 |
| `extract keywords from url` | 500 | Step 1 |
| `keyword extraction online` | 50 | Step 2 |
| `free keyword extractor` | 50 | 全文语境 |

### Schema
新增 `HowTo` JSON-LD（三步对应三个 step）：

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Extract Keywords from Text or URL",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Paste your text or enter a webpage URL",
      "text": "Choose the Text tab to paste content directly, or the URL tab to analyze a webpage."
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Click Extract Keywords",
      "text": "The tool processes your content using TF-IDF analysis, filtering stop words and identifying single keywords, bigrams, and trigrams."
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Review, filter, and export your results",
      "text": "Filter between All, 1-word, 2-word, and 3-word views. Sort by keyword, count, or density. Download as CSV or copy to clipboard."
    }
  ]
}
```

### 页面位置
`page.tsx` 中，紧接在 `</section>`（工具区）之后，在 `seo-content` section **之前**。

### 组件
可新建 `src/components/seo/HowToSection.tsx`，或直接嵌入 `page.tsx`。

---

## 模块 2 — Use Cases（扩充）

### H2 标题
`Who Uses a Keyword Extraction Tool?`

### H3 子模块

**H3 — For SEO Professionals**
> Analyze competitor content to understand their keyword strategy. Validate that your content targets the right search terms. Discover untapped long-tail keyword opportunities by comparing keyword density across pages.
>
> → 关联关键词: `seo keyword extractor` (50), `extract seo keywords from website` (50)

**H3 — For Content Creators & Bloggers**
> Ensure every blog post is optimized before publishing. Quickly identify the main themes in your draft, check keyword distribution, and avoid over-optimization. Use the URL mode to see what keywords competitor articles are ranking for.
>
> → 关联关键词: `extract keywords from article` (50), `find keywords in text` (500)

**H3 — For Academic Researchers**
> Extract key themes from research papers and academic articles. Speed up literature reviews by identifying core concepts across multiple sources at a glance. The bigram and trigram analysis helps surface multi-word technical terms.
>
> → 关联关键词: `keyword extraction nlp` (50), `extract keywords from document` (50)

**H3 — For Digital Marketers**
> Analyze landing pages and marketing copy for keyword optimization. Research competitor websites to identify content gaps. Build data-backed content strategies with actual keyword frequency data rather than intuition.
>
> → 关联关键词: `website keyword extractor` (500), `extract keywords from web page` (500)

### 关键词布局
| 关键词 | 搜索量 | 位置 |
|--------|--------|------|
| `website keyword extractor` | 500 | Digital Marketers |
| `find keywords in text` | 500 | Content Creators |
| `seo keyword extractor` | 50 | SEO Professionals |
| `extract seo keywords from website` | 50 | SEO Professionals |
| `extract keywords from article` | 50 | Content Creators |
| `extract keywords from web page` | 500 | Digital Marketers |
| `extract keywords from document` | 50 | Academic Researchers |
| `keyword extraction nlp` | 50 | Academic Researchers |

### 视觉建议
4 个 H3 可以用卡片式布局（Grid 2×2），每个卡片含图标 + 标题 + 2-3 句描述。卡片背景白色，与现有工具区风格一致。

---

## 模块 3 — How It Works（扩充）

### H2 标题
`How the Website Keyword Extractor Works`

> ⚡ **说明：** H2 标题加了 "Website" 是为了利用 `website keyword extractor` (500/mo) 这个高价值长尾词，同时不偏离主词。也可以不用，看主人偏好。

### H3 子模块

**H3 — Statistical Text Analysis**
> The tool applies TF-IDF (Term Frequency-Inverse Document Frequency) analysis to identify the most significant words. It filters out common English stop words (the, is, at, which) and ranks remaining terms by a combination of frequency and relevance. The result is a clean, ranked list of keywords that truly represent your content.

**H3 — Multi-Word Phrase Detection**
> Beyond single words, the keyword extractor automatically detects 2-word phrases (bigrams) and 3-word phrases (trigrams). This is especially useful for SEO professionals who target long-tail keywords. For example, from "keyword extraction tool online" it extracts both "keyword extraction" and "extraction tool online."

**H3 — URL Content Extraction**
> When you enter a webpage URL, the tool fetches the page content (respecting robots.txt rules), extracts the readable text by removing navigation, scripts, and styling, then runs the same keyword analysis. This makes it easy to analyze competitor pages or your own content without manual copy-pasting.

### 关键词布局
| 关键词 | 搜索量 | 位置 |
|--------|--------|------|
| `website keyword extractor` | 500 | H2 |
| `keyword extraction online` | 50 | 全文语境 |
| `keyword extraction nlp` | 50 | 正文提及 |
| `keywords extractor` | 500 | 正文提及 |

---

## 模块 4 — Why It Matters（保留精简）

### H2 标题
`Why Keyword Extraction Matters for SEO`

### 内容
保留当前 1 段（约 80 词），不做扩充。内容已足够概括价值，且与其他模块不重复。

> Keyword extraction is essential for SEO optimization, content analysis, and research. Understanding which terms dominate your content helps you align with search intent, improve readability, and target the right audience. Marketers, writers, and researchers use keyword extraction to validate content strategy and discover untapped opportunities.

---

## 模块 5 — FAQ（扩到 8 个）

### H2 标题
`Frequently Asked Questions About Keyword Extraction`

### 现有 4 个（保留不动）

| # | Q | A 概要 |
|---|----|--------|
| 1 | Is this tool really free? | Text/URL 免费；AI 提取是 Pro 功能 |
| 2 | How accurate is the keyword extraction? | 基于 TF-IDF 词频统计，AI Pro 模式用语义理解 |
| 3 | Can I extract keywords from any website? | 可提取公开页面，付费墙/反爬虫可能受限 |
| 4 | What formats can I download the results in? | CSV 或剪贴板复制 |

### 新增 4 个

**#5 — Can I extract keywords from a website for free?**
> Yes. Simply enter the website URL in the URL tab and click Extract. The tool fetches the page content and analyzes it for free. No signup or account required. Results include single keywords, bigrams, and trigrams with frequency count and density percentage.

| → 覆盖关键词 | 搜索量 |
|-------------|--------|
| `extract keywords from website free` | 50 |
| `extract keywords from website` | 50 |

**#6 — What's the difference between regular and AI keyword extraction?**
> Regular extraction uses statistical TF-IDF analysis to identify frequently occurring terms. AI extraction (Pro feature) uses semantic understanding — it doesn't just count word frequency but understands the context and meaning of the content, extracting topic-level keywords that capture the essence of your text even if they appear only a few times.

| → 覆盖关键词 | 搜索量 |
|-------------|--------|
| `ai keyword extraction` | 50 |

**#7 — Do I need to sign up to use the keyword extractor?**
> No. The basic Text and URL extraction features are completely free and require no signup. Create an account only if you want to unlock AI-powered extraction or remove daily usage limits.

| → 覆盖关键词 | 搜索量 |
|-------------|--------|
| `keywords extractor` | 500（问题中自然出现） |

**#8 — What is the maximum text length supported?**
> The free text input supports up to 50,000 characters. For longer content, you can enter a URL instead, or upgrade to Pro for unlimited text analysis. The URL mode works with most standard web pages regardless of length.

---

## 模块 6 — 内链模块（新增）

### H2 标题
`Try These Keyword Extraction Tools`

### 结构
4 个卡片式链接，指向功能落地页：

| 卡片标题 | 链接 | 说明 |
|---------|------|------|
| Extract Keywords from Text | `/extract-keywords-from-text` | Analyze any text content |
| Extract Keywords from URL | `/extract-keywords-from-url` | Analyze any webpage |
| YouTube Keyword Extractor | `/youtube-keyword-extractor` | Extract keywords from videos（V2） |
| PDF Keyword Extractor | `/extract-keywords-from-pdf` | Extract keywords from documents（V2） |

> ⚡ **注意：** 落地页当前尚未建立。内链模块可以先加上，链接暂时指向 `#` 或首页锚点，等落地页上线后再改回真实链接。

### 关键词布局
每个卡片标题本身就是目标关键词的精确匹配，爬虫可识别。

---

## 页面布局改动（`page.tsx`）

```tsx
export default async function HomePage() {
  // ... 现有代码 ...

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* 现有 JSON-LD */}
        <script type="application/ld+json">{webApplicationJsonLd}</script>
        <script type="application/ld+json">{/* Organization + WebSite */}</script>
        <script type="application/ld+json">{faqJsonLd}</script>

        {/* 1. Hero (不变) */}
        <section className="hero">...</section>

        {/* 2. 工具区 (不变) */}
        <section aria-label={t('title')}>
          <ToolSection />
        </section>

        {/* 3.【新增】How to Use */}
        <section id="howToUse" aria-label="How to use">
          <h2>{t('seoHowToUseTitle')}</h2>
          {/* 三步内容 */}
        </section>

        {/* 4. SEO 内容区 (扩充) */}
        <section className="seo-content" id="seoContent" aria-label="About this tool">
          <div className="container">
            {/* Use Cases (原 Why It Matters 之前) */}
            <div className="seo-section">
              <h2>{t('seoUseTitle')}</h2>
              {/* 4 个 H3 卡片 */}
            </div>

            {/* How It Works (扩充) */}
            <div className="seo-section">
              <h2>{t('seoHowTitle')}</h2>
              {/* 3 个 H3 + 说明 */}
            </div>

            {/* Why It Matters (保留精简) */}
            <div className="seo-section">
              <h2>{t('seoWhyTitle')}</h2>
              <p>{t('seoWhyDesc')}</p>
            </div>

            {/* FAQ (扩到 8 个) */}
            <FaqSection />

            {/* 【新增】内链模块 */}
            <div className="seo-section">
              <h2>{t('seoToolsTitle')}</h2>
              {/* 4 个工具卡片 */}
            </div>

            {/* Bottom CTA (保留) */}
            <div className="bottom-cta">...</div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
```

---

## Schema 改动汇总

| Schema | 状态 | 改动 |
|--------|------|------|
| WebApplication | ✅ 已有 | 保留 |
| FAQPage | ✅ 已有 | 更新 mainEntity 数组（从 4 扩到 8） |
| Organization | ❌ 新增 | 品牌实体识别（GEO/AI SEO 策略要求） |
| WebSite | ❌ 新增 | 站点识别 + 搜索动作 |
| HowTo | ❌ 新增 | 配合 How to Use 模块 |

### Organization + WebSite Schema（新增）
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ExtractKeywords",
  "url": "https://extractkeywords.com",
  "logo": "https://extractkeywords.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "support@extractkeywords.com",
    "contactType": "customer support"
  }
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
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://extractkeywords.com/?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

---

## `messages/en.json` 新增 Key 清单

结构建议：

```json
{
  "home": {
    // ... 现有 key 保留不动 ...

    // 模块 1: How to Use
    "seoHowToUseTitle": "How to Extract Keywords from Text or URL in 3 Simple Steps",
    "seoHowToUseStep1Title": "Paste your text or enter a webpage URL",
    "seoHowToUseStep1Desc": "Choose the Text tab to paste content directly, or the URL tab to enter a webpage address. The tool supports both plain text and live URL analysis.",
    "seoHowToUseStep2Title": "Click \"Extract Keywords\"",
    "seoHowToUseStep2Desc": "The tool processes your content using TF-IDF statistical analysis, automatically filters out common stop words, and identifies single keywords, 2-word phrases (bigrams), and 3-word phrases (trigrams).",
    "seoHowToUseStep3Title": "Review, filter, and export your results",
    "seoHowToUseStep3Desc": "Switch between All, 1-word, 2-word, and 3-word views. Sort by keyword, count, or density. Download your keyword list as a CSV file or copy it to your clipboard.",
    "seoHowToUseCta": "Try the Tool Now",

    // 模块 2: Use Cases (当前 seoUse1-5 替换为 4 个 H3 模块)
    // seoUseTitle 保留不动
    "seoUseSeoTitle": "For SEO Professionals",
    "seoUseSeoDesc": "Analyze competitor content to understand their keyword strategy. Validate that your content targets the right search terms. Discover untapped long-tail keyword opportunities by comparing keyword density across pages.",
    "seoUseContentTitle": "For Content Creators & Bloggers",
    "seoUseContentDesc": "Ensure every blog post is optimized before publishing. Quickly identify the main themes in your draft, check keyword distribution, and avoid over-optimization. Use the URL mode to see what keywords competitor articles are ranking for.",
    "seoUseAcademicTitle": "For Academic Researchers",
    "seoUseAcademicDesc": "Extract key themes from research papers and academic articles. Speed up literature reviews by identifying core concepts across multiple sources at a glance. The bigram and trigram analysis helps surface multi-word technical terms.",
    "seoUseMarketingTitle": "For Digital Marketers",
    "seoUseMarketingDesc": "Analyze landing pages and marketing copy for keyword optimization. Research competitor websites to identify content gaps. Build data-backed content strategies with actual keyword frequency data rather than intuition.",

    // 模块 3: How It Works (扩充)
    // seoHowTitle 改为 "How the Website Keyword Extractor Works"
    // seoHowDesc1, seoHowDesc2 替换为 3 个 H3
    "seoHowStatsTitle": "Statistical Text Analysis",
    "seoHowStatsDesc": "The tool applies TF-IDF (Term Frequency-Inverse Document Frequency) analysis to identify the most significant words. It filters out common English stop words and ranks remaining terms by a combination of frequency and relevance.",
    "seoHowPhraseTitle": "Multi-Word Phrase Detection",
    "seoHowPhraseDesc": "Beyond single words, the tool automatically detects 2-word phrases (bigrams) and 3-word phrases (trigrams). This is essential for SEO professionals targeting long-tail keywords.",
    "seoHowUrlTitle": "URL Content Extraction",
    "seoHowUrlDesc": "When you enter a webpage URL, the tool fetches the page content while respecting robots.txt rules, extracts readable text, then runs the same keyword analysis — no manual copy-pasting needed.",

    // 模块 5: FAQ 新增 4 个
    "seoFaq5Q": "Can I extract keywords from a website for free?",
    "seoFaq5A": "Yes. Simply enter the website URL in the URL tab and click Extract. The tool fetches the page content and analyzes it for free. No signup or account required. Results include single keywords, bigrams, and trigrams with frequency count and density percentage.",
    "seoFaq6Q": "What is the difference between regular and AI keyword extraction?",
    "seoFaq6A": "Regular extraction uses statistical TF-IDF analysis to identify frequently occurring terms. AI extraction (Pro feature) uses semantic understanding — it understands the context and meaning of the content, extracting topic-level keywords that capture the essence of your text even if they appear only a few times.",
    "seoFaq7Q": "Do I need to sign up to use the keyword extractor?",
    "seoFaq7A": "No. The basic Text and URL extraction features are completely free and require no signup. Create an account only if you want to unlock AI-powered extraction or remove daily usage limits.",
    "seoFaq8Q": "What is the maximum text length supported?",
    "seoFaq8A": "The free text input supports up to 50,000 characters. For longer content, you can enter a URL instead. The URL mode works with most standard web pages regardless of length.",

    // 模块 6: 内链模块
    "seoToolsTitle": "Try These Keyword Extraction Tools",
    "seoToolText": "Extract Keywords from Text",
    "seoToolTextDesc": "Analyze any text content for keyword frequency and density",
    "seoToolUrl": "Extract Keywords from URL",
    "seoToolUrlDesc": "Analyze any webpage for keyword optimization",
    "seoToolYoutube": "YouTube Keyword Extractor",
    "seoToolYoutubeDesc": "Extract keywords from video descriptions and transcripts",
    "seoToolPdf": "PDF Keyword Extractor",
    "seoToolPdfDesc": "Extract keywords from PDF documents"
  }
}
```

> ⚡ **特别注意：** 以上 key 名建议使用 `seoHowStatsTitle`、`seoHowPhraseTitle` 等前缀（区别于现有 `seoHowTitle`），避免命名冲突。实际 key 名 Claude Code 可根据代码风格调整。

---

## 实施顺序

建议分 **2 个 PR** 完成，避免一次性改动过大难以 review：

### PR 1（内容优先）
1. `messages/en.json` — 新增所有翻译 key
2. `FaqSection.tsx` — 从 4 扩到 8 个
3. `page.tsx` — 重新排列模块顺序 + 新增 How to Use 和内链模块
4. Schema 补充（Organization + WebSite + HowTo）

### PR 2（工程完善）
1. 建落地页（text / url 两个落地页）
2. 更新内链模块的链接
3. `robots.txt` + `sitemap.xml`
4. 提交 Google Search Console

---

## 关键词密度预估

| 模块 | 词数 | 包含关键词 |
|------|------|-----------|
| Hero + 工具区 | ~50 | `extract keywords` × 2 |
| How to Use | ~200 | `extract keywords from text` × 2, `extract keywords from url` × 1 |
| Use Cases | ~300 | `website keyword extractor`, `find keywords in text`, `seo keyword extractor` 等 |
| How It Works | ~300 | `website keyword extractor` × 1 (H2), `keyword extraction online` × 1 |
| Why It Matters | ~80 | `keyword extraction` × 2 |
| FAQ (8个) | ~400 | `extract keywords from website free`, `ai keyword extraction`, `keywords extractor` |
| 内链模块 | ~100 | 4 个精确匹配工具名 |
| **总计** | **~1,630** | 主词 + 10+ 长尾词覆盖 |

> **关键词密度估算：** `extract keywords` 出现 6-8 次 / 1,630 词 ≈ **0.4%-0.5%**。但主词出现在 H1 和多个 H2 中，Google 重视标题权重，实际效果会高于纯密度数值。如需要达到 2% 密度，需在正文额外加入 25-30 次，但可能影响可读性——**不推荐**刻意堆砌。
