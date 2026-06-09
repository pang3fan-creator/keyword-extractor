# 反面教材

六轮审核，每一轮都在挖"首页和变体页的冲突"。

从 H1 到 metadata、从 FAQ 到 HowItWorks、从 seoHowStep1 到 footer tagline……每次以为扫干净了，下一轮又发现一处残留。这不是计划写得不细的问题，而是**这个项目首页本身已经把长尾空间占得太满了**——它同时是一个工具页（Text/URL 两种模式）又是一个 SEO 内容页，导致无论如何切割，变体页都只能是首页的功能子集。

与其硬造两个吃流量的页面被 Google 判 thin content，不如不建。

Git 历史里那个文档留着也行，以后有类似需求时能参考那六轮的思路。

> # 变体页开发任务
>
> ## 背景
>
> 为 Extract Keywords 项目创建两个变体页面，针对长尾关键词获取流量。
>
> ## 目标页面
>
> | 页面                      | 路径                               | 目标关键词                                                | 月搜索量  |
> | ------------------------- | ---------------------------------- | --------------------------------------------------------- | --------- |
> | Website Keyword Extractor | `/tools/website-keyword-extractor` | website keyword extractor, extract keywords from web page | 500 + 500 |
> | Text Keyword Extractor    | `/tools/text-keyword-extractor`    | extract keywords from text, find keywords in text         | 500 + 500 |
>
> ---
>
> ## 战略调整
>
> ### 核心原则
>
> 变体页不能做成"首页少一个 Tab 的版本"，否则 Google 判定 thin content。
> 需要 **首页降级为父级总览页** + **变体页吃透各自长尾**。
>
> ### 首页定位 → 父级页 "Keyword Extraction Tool"
>
> 首页从"功能入口"变为"总览页"，系统性地降低精确长尾词密度。
>
> **首页 H1 修改**（关键）：实际 H1 当前为 "Extract keywords from **text or URL**"，直接覆盖了变体页的长尾意图。改为 "Extract Keywords" 或 "Keyword Extraction Tool" 等更父级的表述。
>
> **首页 metadata 同步降级**：当前 `<title>`、description、OG/Twitter 来自 `messages/en.json` 的 `metadata` namespace，仍是 "Extract Keywords from Text & URL"。同步修改：
>
> | 字段                            | 当前（需改）                     | 改为                                                         |
> | ------------------------------- | -------------------------------- | ------------------------------------------------------------ |
> | `metadata.titleDefault`         | Extract Keywords from Text & URL | Keyword Extraction Tool — Free Online Keyword Analysis       |
> | `metadata.description`          | (当前含 text or URL 暗示)        | Free keyword extraction tool for quick content analysis. Get instant keyword insights, density, and exportable results. No signup needed. |
> | `metadata.openGraphTitle`       | 同上                             | Keyword Extraction Tool — Free Keyword Analysis Online       |
> | `metadata.openGraphDescription` | 同上                             | Free online keyword extraction tool. Get instant keyword analysis and exportable results. No signup required. |
>
> **首页其他需要修改的文案**（在 `messages/en.json` 的 `home` namespace 中）：
>
> | 位置                                   | 当前文案问题                                                 | 改为                                                  |
> | -------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------- |
> | Hero title                             | "Keyword Extractor"                                          | 保持（宽泛词，没问题）                                |
> | H1                                     | "Extract keywords from **text or URL**"                      | 更父级表述，去掉 "text or URL" 直接暗示               |
> | Use Case 卡片                          | "any webpage"、"URL extractor"、"**website keyword extractor**" | 改为通用表述，让出长尾关键词空间                      |
> | `seoHowStep1Title` / `seoHowStep1Desc` | 直接写 "**Text tab**" / "**URL tab**"                        | 改为通用步骤，如 "Paste your content" / "Enter a URL" |
> | `seoHowToUseTitle`                     | "Text or URL"                                                | 改为父级表述，如 "How to Use"                         |
> | `seoHowUrlNote`                        | 专讲 URL extraction / robots.txt                             | 删除或降级为通用提示，URL 细节留给 Website 变体页     |
> | `seoHowTextNote`                       | 如有 text 相关细节                                           | 同样降级，细节留给 Text 变体页                        |
>
> **首页 WebApplication schema 同步降级**：当前 `WebApplication.offers` 在页面代码中硬编码 "Text and URL keyword extraction..."，既违反"Schema 文案来自 messages.json"的项目规则，也持续强化 Text/URL 信号。
>
> - 将 `WebApplication` 的 offer name、description、browserRequirements 等可见语义文案迁移到 `messages.en.json` 的 `home.schema` 字段
> - 改为父级表述，不再提 "Text or URL"
>
> **Footer tagline 同步降级**：当前全站 footer tagline 为 "Extract keywords from text or URL"，全站重复推送 Text/URL 信号。改为父级描述如 "Extract keywords with our free online tool."
>
> **首页 FAQ 改为通用问题**（与变体页 FAQ 完全无话题重叠）：
>
> | #    | 新首页 FAQ（通用）                             | 确保不重叠                                           |
> | ---- | ---------------------------------------------- | ---------------------------------------------------- |
> | 1    | Is this tool free? No signup required?         | —                                                    |
> | 2    | Can I download or export the results?          | —                                                    |
> | 3    | Is there an AI-powered version planned?        | —                                                    |
> | 4    | What do the columns in the results table mean? | —                                                    |
> | 5    | Where can I find your privacy policy?          | 只提隐私政策入口，具体"文本是否存储"留给 Text 页 FAQ |
>
> ### 变体页 FAQ → 专项技术细节
>
> Website 页 FAQ 只讲 URL 模式专项：
>
> 1. What happens if the website blocks crawlers (robots.txt)?
> 2. How long does it take to fetch and analyze a page?
> 3. Can I extract keywords from PDF or image URLs?
> 4. What content does the extractor actually analyze from the page?
> 5. What types of webpages work best for keyword extraction?
>
> Text 页 FAQ 只讲 Text 模式专项：
>
> 1. What is the maximum text length the tool can process?
> 2. Is the tool suitable for languages other than English?
> 3. How are keywords ranked — by frequency, relevance, or both?
> 4. Does the tool detect multi-word phrases (bigrams and trigrams)?
> 5. Is my pasted text stored, logged, or sent to any server besides extraction?
>
> ### 真实内容承诺
>
> **Website 页文案不能写 "any URL / any website"**，必须如实说明：
>
> - 只支持公开 HTTP/HTTPS 网页
> - 受 robots.txt、10 秒超时、1MB 内容大小限制
> - 只分析 HTML 内容（不支持 PDF/图片）
> - Metadata/Hero 用 **"public webpage URL"** 或 **"public HTML page"**
>
> **Text 页不能声称多语言支持**，必须如实说明：
>
> - 当前算法以英文 stop words + `a-z0-9-` 字符过滤为基础
> - FAQ 写 **"currently best suited for English text"**
> - 未来可扩展多语言支持
>
> ### 变体页独特内容
>
> 每个变体页加一块首页没有的独特内容：
>
> **Website 页 — "What Gets Analyzed" 区块**
> 说明实际分析范围：页面主体可读文本（通常来自 `<main>`、`<article>`、`<body>` 区域，包含正文里的 headings、list items、段落文本）。解释不分析的内容：meta description、image alt text、PDF、图片、脚本或纯 JS 渲染内容。以及什么 URL 适合/不适合提取。
>
> > 注意：不能写会分析 title/meta/alt，实际代码只把 `<title>` 作为 pageTitle 返回（不送进提取），实际分析的是 `main/article/body` 的可读文本内容。
>
> **Text 页 — "How Keywords Are Ranked" 区块**
> 用简单例子展示 word frequency、stop-word filtering、bigram/trigram detection 如何工作。给出一个 50 词的示例文本和它的输出结果。
>
> ### 内链漏斗
>
> - **首页 → 变体页**：Footer 新增 "More Tools" 区块，链接到变体页
> - **变体页 → 首页**：底部 CTA "Try other extraction modes" 链接回首页
> - 构建清晰的父子关系信号
>
> ---
>
> ## 技术实现
>
> ### 1. 路由结构
>
> ```
> src/app/[locale]/tools/[slug]/page.tsx
> ```
>
> ```typescript
> export async function generateStaticParams() {
>   const slugs = ['website-keyword-extractor', 'text-keyword-extractor'];
>   const params = [];
>   for (const locale of routing.locales) {
>     for (const slug of slugs) {
>       params.push({ slug, locale });
>     }
>   }
>   return params;
> }
> 
> // 未知 slug 返回 404
> export const dynamicParams = false;
> ```
>
> - 动态路由带 `[locale]` 层
> - 所有 URL 拼写必须使用 `buildUrl(locale, "/tools/...")`，禁止手写 `/${locale}/tools/...`
> - 未知 slug 直接 404（`dynamicParams = false`）
>
> ### 2. 旧路径废弃与重定向
>
> 旧路径 `/extract-keywords-from-url` 和 `/extract-keywords-from-text` **废弃**，实施 **301 永久重定向**到对应新路径：
>
> | 旧路径                        | 新路径                             |
> | ----------------------------- | ---------------------------------- |
> | `/extract-keywords-from-url`  | `/tools/website-keyword-extractor` |
> | `/extract-keywords-from-text` | `/tools/text-keyword-extractor`    |
>
> **实现方案**：使用 `next.config.ts` 的 `redirects()` 方法实现，不要动 `proxy.ts`（现有 Clerk + next-intl 组合逻辑不应受干扰）。
>
> ```typescript
> // next.config.ts
> async redirects() {
>   return [
>     {
>       source: '/extract-keywords-from-url',
>       destination: '/tools/website-keyword-extractor',
>       permanent: true,
>     },
>     {
>       source: '/extract-keywords-from-text',
>       destination: '/tools/text-keyword-extractor',
>       permanent: true,
>     },
>   ];
> }
> ```
>
> ### 3. Canonical / Hreflang / OG
>
> **关键**：`[locale]/layout.tsx` 的 canonical 固定到首页，变体页必须在 `generateMetadata` 中覆盖：
>
> ```typescript
> export async function generateMetadata({ params }: Props): Promise<Metadata> {
>   // 设置自己的 canonical / hreflang / OG / Twitter
>   // 不能继承 layout.tsx 的 fallback canonical
> }
> ```
>
> **链接模式区分**：
>
> - **schema/canonical/sitemap**：使用 `buildUrl(locale, '/tools/...')` 生成绝对 URL
> - **UI 内链**（`<Link>`、`href`）：使用项目现有的本地化链接模式，不要全部写成绝对外链
>
> ### 4. 组件复用策略
>
> #### ToolSection — `allowedTabs` prop
>
> ```typescript
> type TabMode = 'text' | 'url' | 'ai';
> interface ToolSectionProps {
>   allowedTabs?: TabMode[];  // 默认 ['text', 'url', 'ai']
> }
> ```
>
> **重要**：`activeTab` 初始值必须取 `allowedTabs[0]`（而非硬编码 `'text'`），且 tab 切换只能在 allowed tabs 范围内发生。
>
> - Website 变体页：`<ToolSection allowedTabs={['url']} />`
> - Text 变体页：`<ToolSection allowedTabs={['text']} />`
>
> #### SEO 区块组件 — namespace prop + 数据结构统一
>
> 以下组件统一加 `namespace` prop：
>
> | 组件                | 类型             | 首页传入 | 变体页传入                                 |
> | ------------------- | ---------------- | -------- | ------------------------------------------ |
> | `HowItWorksSection` | server component | `'home'` | `'website-extractor'` / `'text-extractor'` |
> | `HowToUseSection`   | server component | `'home'` | 同上                                       |
> | `UseCasesSection`   | server component | `'home'` | 同上                                       |
> | `FaqSection`        | client component | `'home'` | 同上                                       |
>
> **数据结构约定**：
>
> 现有 SEO 组件使用 flat key 命名（`seoHowStatsTitle`、`seoHowStep1Title`、`seoHowUrlNote` 等），而计划翻译结构使用嵌套对象。实施时 **统一采用 flat key 风格**（保持与现有组件一致，最小化改动），不切换到嵌套对象读取。
>
> **`seoHowUrlNote` 的处理**：
>
> - 不直接删除该 key（组件必定读取，删 key 运行时报错）
> - 保留 key 但内容降级为通用提示，如 "Results include word frequency, keyword density, and multi-word phrases"
> - URL 模式的技术细节（robots.txt、fetch 超时等）只放在 Website 变体页的 FAQ 中
>
> **`FaqSection` 改造为动态 FAQ 数组**：
>
> - 当前 `FaqSection.tsx` 硬编码 `Array.from({ length: 6 })` 渲染 6 个 FAQ
> - JSON-LD 的 `FAQPage` 也硬编码 6 个问题
> - **改为从 `messages/en.json` 读取 `faq` 数组**（每个元素为 `{ question, answer }`），数量和内容由翻译文件决定
> - 首页 FAQ 改为 5 条后自动渲染 5 条，变体页也各自读自己的 FAQ 数组
> - JSON-LD 的 `mainEntity` 也从同一个 `faq` 数组生成
>
> ### 5. 翻译结构
>
> 每个变体 namespace 需要覆盖以下字段（包含 metadata/schema/cta，所有 UI 文案必须来自 `messages/en.json`）：
>
> ```json
> {
>   "website-extractor": {
>     "metadata": {
>       "title": "Website Keyword Extractor - Extract Keywords from Public Webpages Free",
>       "description": "Free website keyword extractor. Paste a public webpage URL and get keywords instantly. Analyzes page body text. No signup required.",
>       "openGraphTitle": "...",
>       "openGraphDescription": "..."
>     },
>     "hero": {
>       "title": "Website Keyword Extractor",
>       "subtitle": "Extract keywords from any public webpage URL"
>     },
>     "howItWorks": { ... },
>     "howToUse": { ... },
>     "useCases": { ... },
>     "whatGetsAnalyzed": { ... },
>     "faq": [
>       { "question": "...", "answer": "..." },
>       ...
>     ],
>     "schema": {
>       "applicationName": "Website Keyword Extractor",
>       "description": "...",
>       "offerDescription": "Free online tool"
>     },
>     "cta": {
>       "backToHome": "...",
>       "tryOtherModes": "..."
>     }
>   },
>   "text-extractor": {
>     "metadata": {
>       "title": "Text Keyword Extractor - Find Keywords in Any Text Free",
>       "description": "Free text keyword extractor. Paste text and find keywords — best suited for English text. Up to 10K chars with phrase detection. No signup.",
>       "openGraphTitle": "...",
>       "openGraphDescription": "..."
>     },
>     "hero": { ... },
>     "howItWorks": { ... },
>     "howToUse": { ... },
>     "useCases": { ... },
>     "howKeywordsRanked": { ... },
>     "faq": [ ... ],
>     "schema": { ... },
>     "cta": { ... }
>   },
>   "footer": {
>     "moreTools": "More Tools",
>     "websiteExtractor": "Website Keyword Extractor",
>     "textExtractor": "Text Keyword Extractor"
>   }
> }
> ```
>
> ### 6. Schema 结构化数据
>
> **变体页**使用独立 JSON-LD，所有文案来自 `messages/en.json` 的 `schema` 字段：
>
> - `WebApplication`（URL 指向变体页自身，offer 只写 Free）
> - `FAQPage`（从变体页的 `faq` 字符串生成 `mainEntity`）
> - **不**重复首页的 `Organization` / `WebSite`
>
> **首页**所有 Schema 同步更新并从 `messages/en.json` 读取：
>
> - `FAQPage` `mainEntity` → 从新的 5 条首页 FAQ 数组生成
> - `WebApplication` offer name/description/browserRequirements → 迁移到 `messages/en.json` 的 `home.schema` 字段，改为父级表述（不再提 "Text or URL"）
>
> ### 7. CTA 链接
>
> - 变体页回首页：链接到 `/`（UI 内链用项目现有本地化模式，schema/canonical 用 `buildUrl`）
> - 首页 CTA 保持 `#toolArea`（同页滚动）
>
> ### 8. AI Tab 处理
>
> 变体页彻底不渲染 AI Tab，避免混淆。
>
> ### 9. Sitemap
>
> 更新 `src/app/sitemap.ts`，自动包含 `/tools/*` 路径。旧路径不再出现在 sitemap 中。
>
> ### 10. llms.txt
>
> 更新 `public/llms.txt`，添加新页面路径。
>
> ### 11. AGENTS.md
>
> 实现后更新 Key Paths，添加：
>
> ```
> - Tools 变体页: `src/app/[locale]/tools/[slug]/page.tsx`
> ```
>
> ---
>
> ## 页面 1: Website Keyword Extractor
>
> ### Metadata
>
> ```
> Title: Website Keyword Extractor - Extract Keywords from Public Webpages Free
> Description: Free website keyword extractor. Paste a public webpage URL and get keywords instantly. Analyzes page body text. No signup required.
> ```
>
> > Description 控制在 160 字符以内。
>
> ### 页面结构
>
> | 区块               | 内容要点                                                     |
> | ------------------ | ------------------------------------------------------------ |
> | Hero               | H1: Website Keyword Extractor<br>副标题: Extract keywords from any public webpage URL |
> | 工具区             | 只显示 URL Tab（不渲染 Text/AI）                             |
> | How it works       | 1. Paste a public webpage URL → 2. We fetch & analyze the HTML → 3. Get keywords |
> | What Gets Analyzed | 说明实际分析范围 + 不支持的内容类型（独特内容区块）          |
> | Use cases          | Competitor analysis, Content research, SEO audit, Backlink research |
> | FAQ                | 5 个问题（URL 模式专项技术细节）                             |
> | CTA                | Link back to homepage                                        |
>
> ### FAQ 问题
>
> 1. What happens if the website blocks crawlers (robots.txt)?
> 2. How long does it take to fetch and analyze a page?
> 3. Can I extract keywords from PDF or image URLs?
> 4. What content does the extractor actually analyze from the page?
> 5. What types of webpages work best for keyword extraction?
>
> ### 示例 URL
>
> 使用真实博客文章 URL 作为 placeholder
>
> ---
>
> ## 页面 2: Text Keyword Extractor
>
> ### Metadata
>
> ```
> Title: Text Keyword Extractor - Find Keywords in Any Text Free
> Description: Free text keyword extractor. Paste text and find keywords — best suited for English text. Up to 10K chars with phrase detection. No signup.
> ```
>
> > Description 控制在 160 字符以内。
>
> ### 页面结构
>
> | 区块                    | 内容要点                                                     |
> | ----------------------- | ------------------------------------------------------------ |
> | Hero                    | H1: Text Keyword Extractor<br>副标题: Find keywords in any text, article, or document |
> | 工具区                  | 只显示 Text Tab（不渲染 URL/AI）                             |
> | How it works            | 1. Paste text → 2. We analyze it → 3. Get keywords           |
> | How Keywords Are Ranked | word frequency、stop-word filtering、bigram/trigram + 示例（独特内容区块） |
> | Use cases               | Content optimization, Blog writing, Academic writing, Resume keywords |
> | FAQ                     | 5 个问题（Text 模式专项技术细节）                            |
> | CTA                     | Link back to homepage                                        |
>
> ### FAQ 问题
>
> 1. What is the maximum text length the tool can process?
> 2. Is the tool suitable for languages other than English?
> 3. How are keywords ranked — by frequency, relevance, or both?
> 4. Does the tool detect multi-word phrases (bigrams and trigrams)?
> 5. Is my pasted text stored, logged, or sent to any server besides extraction?
>
> ### 示例文本
>
> 提供一段 150-200 词的示例文本（博客段落风格），配合 "How Keywords Are Ranked" 展示实际输出。
>
> ---
>
> ## SEO 文案（英文）
>
> **由主人指定的 AI 工具（OpenCode）撰写具体文案，素贞只提供结构。**
>
> 所有文案写入 `messages/en.json`，按页面分组。
>
> ---
>
> ## 验收标准
>
> ### 构建与代码检查
>
> - [ ] `python3 -m json.tool messages/en.json` — JSON 格式校验通过
> - [ ] `npm run test` — 通过
> - [ ] `npm run lint` — 通过
> - [ ] `npm run build` — 通过
>
> ### 页面功能
>
> - [ ] 两个页面可正常访问（`/tools/website-keyword-extractor`、`/tools/text-keyword-extractor`）
> - [ ] 旧路径 `/extract-keywords-from-url` 和 `/extract-keywords-from-text` 301 重定向到新路径
> - [ ] 未知 slug（如 `/tools/whatever`）返回 404
> - [ ] 每个页面只显示对应的 Tab（URL 页面只显示 URL Tab，Text 页面只显示 Text Tab）
> - [ ] `allowedTabs` 实现：`activeTab` 初始值取 `allowedTabs[0]`
>
> ### SEO & Schema
>
> - [ ] Metadata 正确（title, description <= 160 chars, OG, Twitter）
> - [ ] 变体页 `generateMetadata` 正确覆盖 canonical / hreflang / OG / Twitter
> - [ ] Schema.org 渲染正确（WebApplication + FAQPage，不重复 Organization/WebSite）
> - [ ] 首页 FAQPage schema 同步更新为新的通用 FAQ
> - [ ] sitemap 包含新页面，排除旧路径
> - [ ] `public/llms.txt` 已添加新页面
> - [ ] **`FaqSection` 改为动态 FAQ 数组**：首页 5 条、变体页各 5 条，从 messages.json 读取 `faq` 数组，JSON-LD `mainEntity` 同步生成
> - [ ] Lighthouse SEO score >= 90
>
> ### 首页降级
>
> - [ ] H1 从 "Extract keywords from text or URL" 改为更父级表述
> - [ ] `metadata.titleDefault` / `metadata.description` / OG 同步改为父级意图
> - [ ] `seoHowTitle` 改为 "How the Keyword Extraction Tool Works"
> - [ ] `seoHowStep1Title` / `seoHowStep1Desc` 改为通用步骤，不提"Text tab/URL tab"
> - [ ] `seoHowToUseTitle` 改为父级表述，不提"Text or URL"
> - [ ] `seoHowUrlNote` 保留 key，内容降级为通用提示；`seoHowTextNote` 同样降级，技术细节只放在对应变体页 FAQ
> - [ ] 首页 WebApplication schema 去硬编码，offer name/description 迁至 messages.json，改为父级表述
> - [ ] Footer tagline 改为父级描述，不提"text or URL"
> - [ ] Hero 副标题去具体化
> - [ ] Use Cases 去掉精确长尾词（"website keyword extractor"、"URL extractor" 等）
> - [ ] 首页 FAQ 改为 5 个通用问题（free/export/AI planned/columns/privacy policy），与变体页无话题重叠
>
> ### 变体页内容真实性
>
> - [ ] Website 页写 "public webpage URL" 而非 "any URL"
> - [ ] Website "What Gets Analyzed" 如实写（分析 `main/article/body` 可读文本，不写 meta/alt）
> - [ ] Text 页写 "best suited for English" 而非多语言支持
> - [ ] 变体页有独特内容区块（What Gets Analyzed / How Keywords Are Ranked）
>
> ### UI & 内链
>
> - [ ] Footer 新增 "More Tools" 区块，内链正确
> - [ ] 变体页 CTA 链接回首页，模式正确（UI 内链用本地化模式，非绝对 URL）
> - [ ] 移动端适配正常
> - [ ] 浏览器验证桌面端 + 移动端截图检查
>
> ### 文档更新
>
> - [ ] `AGENTS.md` Key Paths 已更新
> - [ ] `1-suzhen/SITE-STRUCTURE.md` 已更新为 `/tools/*` 路径
>
> ---
>
> ## 注意事项
>
> - 不要复制首页内容，保证每个页面有独特价值
> - 遵循项目 AGENTS.md 规范
> - UI/SEO/metadata/Schema 文案必须来自 `messages/en.json`，不要硬编码
> - 使用 `cn()` 合并 className
> - AI Tab 在变体页不渲染
> - 旧路径 `/extract-keywords-from-*` 用 `next.config.ts redirects()` 301 重定向，不动 `proxy.ts`
> - schema/canonical/sitemap 用 `buildUrl()` 生成绝对 URL；UI 内链用项目现有本地化模式
> - 最终检查：JSON 校验 → test → lint → build → 浏览器验证（桌面+移动端）