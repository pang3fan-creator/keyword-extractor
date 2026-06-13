# 开发任务拆分

## 任务概览

| Phase | 内容 | 预计工时 | 优先级 | 状态 |
|-------|------|---------|--------|------|
| Phase 0 | 项目初始化 | 0.5 天 | P0 | ✅ 完成 |
| Phase 1 | 核心功能 | 2 天 | P0 | ✅ 完成（Text/URL 提取、短语分析、CSV/clipboard、API、限流已可用） |
| Phase 2 | 用户系统 + 支付 | 2 天 | P0 | ✅ 完成（Clerk、Creem、Supabase 订阅同步、Billing 菜单、AI Pro 提取已接入） |
| Phase 3 | SEO 内容 | 1.5 天 | P1 | 🔄 基础完成（About/Privacy/Terms/Pricing、robots、sitemap、llms 已落地；内容页规划已完成，待实施） |
| Phase 4 | 差异化功能 | 3 天 | P2 | ⏳ 未开始（PDF、YouTube、历史记录） |

**MVP 上线范围：Phase 0-3**

---

## Phase 0: 项目初始化 ✅

~~### Task 0.1: 创建 Next.js 项目~~ ✅（Next.js 16.2.6 + TS + Tailwind + Turbopack）
~~### Task 0.2: 安装依赖~~ ✅（+ next-intl、tailwind-merge）
~~### Task 0.3: 配置环境变量~~ ✅（.env.local + .env.example）
~~### Task 0.4: 配置 Vercel 部署~~ ✅（extractkeywords.com 上线）

### Task 0.5: 创建基础组件结构 ✅ 已完成

**输入：** Task 0.4 完成

**已完成：**
- `src/app/layout.tsx`, `[locale]/layout.tsx`, `[locale]/page.tsx`, `globals.css`
- `src/app/[locale]/about/page.tsx` ✓
- `src/app/[locale]/pricing/page.tsx` ✓
- `src/app/[locale]/privacy/page.tsx` ✓
- `src/app/[locale]/terms/page.tsx` ✓
- `src/components/ui/` — Button, Input, Tabs, Table ✓
- `src/components/layout/` — Header, Footer, Logo ✓（额外）
- `src/components/extractor/ToolSection.tsx` — 文本/URL 输入、结果展示、CSV/clipboard 内联实现 ✓
- `src/components/extractor/AIInput.tsx`, `AIGatedPanel.tsx`, `AIResultTable.tsx`, `AIResultCard.tsx`, `AIQuotaDisplay.tsx`, `AIErrorDisplay.tsx` ✓
- `src/components/theme/` — ThemeProvider, ThemeToggle（额外）
- `src/components/billing/` — BillingProfilePanel, BillingPortalButton, PricingCheckoutActions ✓
- `src/types/index.ts` ✓
- `src/lib/utils.ts` ✓（cn 函数）
- `src/i18n/routing.ts`, `request.ts`, `proxy.ts`（额外）
- `src/lib/keyword-extractor.ts`, `url-fetcher.ts`, `robots-checker.ts` ✅
- `src/lib/rate-limiter.ts` ✅（额外）
- `src/lib/ai-extractor.ts`, `ai-usage.ts`, `entitlements.ts` ✅

---

## Phase 1: 核心功能 ✅

### Task 1.1: 实现关键词提取算法 ✅ 已完成

**输入：** 用户文本

**文件：** `src/lib/keyword-extractor.ts`

**功能：**
```typescript
interface ExtractionResult {
  totalWords: number;
  uniqueKeywords: number;
  keywords: Keyword[];
  bigrams?: Phrase[];
  trigrams?: Phrase[];
}

interface Keyword {
  word: string;
  count: number;
  density: number;
}

function extractKeywords(
  text: string,
  options?: {
    includeBigrams?: boolean;
    includeTrigrams?: boolean;
    minWordLength?: number;
  }
): ExtractionResult;
```

**实现要点：**
1. 文本清洗（移除 HTML、特殊字符）
2. 分词（空格分隔）
3. 停用词过滤
4. 词频统计
5. 密度计算
6. Bigram/Trigram 分析

**验证：** 单元测试通过

> ✅ 已实现 `src/lib/keyword-extractor.ts`，导出 `extractKeywords(text, options?)`。支持文本清洗、英文分词、停用词过滤、词频统计、density、bigram、trigram。短语分析保留停用词，避免 `to` 等连接词从 2-word/3-word 短语中丢失。已添加 Vitest 单元测试。

---

### Task 1.2: 实现停用词列表 ✅ 已完成

**输入：** 无

**文件：** `src/lib/stop-words.ts`

**内容：**
```typescript
export const ENGLISH_STOP_WORDS = [
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'this',
  'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
  'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each',
  'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
  'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just'
];
```

**验证：** 导出正确

> ✅ 已实现 `src/lib/stop-words.ts`，导出英文停用词列表与 Set，供后端提取模块复用。

---

### Task 1.3: 实现 URL 抓取功能 ✅ 已完成

**输入：** URL 字符串

**文件：** `src/lib/url-fetcher.ts`

**功能：**
```typescript
interface URLFetchResult {
  success: boolean;
  content?: string;
  title?: string;
  error?: string;
}

async function fetchURLContent(url: string): Promise<URLFetchResult>;
```

**实现要点：**
1. URL 格式校验
2. Robots.txt 检查
3. 内容抓取（fetch + cheerio）
4. 提取正文内容
5. 提取页面标题
6. 错误处理

**验证：** 测试用例通过

> ✅ 已实现 `src/lib/url-fetcher.ts`。包含 URL 安全校验、SSRF 防护、fetch 超时、重定向限制、HTML content-type 检查、响应大小限制、Cheerio 正文抽取与 title 提取。已修复 `https://heicpdf.to/blog/heic-vs-jpeg` 的文章导语漏抓问题。

---

### Task 1.4: 实现 Robots.txt 检查 ✅ 已完成

**输入：** URL

**文件：** `src/lib/robots-checker.ts`

**功能：**
```typescript
async function checkRobotsTxt(url: string): Promise<boolean>;
```

**实现要点：**
1. 解析域名
2. 获取 robots.txt
3. 解析规则
4. 判断是否允许抓取

**缓存：** 内存缓存，24 小时过期

> ✅ 已实现 `src/lib/robots-checker.ts`。MVP 支持 `User-agent: *`、`Allow`、`Disallow`，robots 缺失或抓取失败时默认允许，明确 disallow 当前路径时拒绝。

---

### Task 1.5: 创建文本输入组件 ✅ 已完成（内联在 ToolSection）

**输入：** 无

**文件：** `src/components/extractor/text-input.tsx`

**功能：**
```tsx
interface TextInputProps {
  onSubmit: (text: string) => void;
  maxLength?: number;
  isLoading?: boolean;
}

export function TextInput({ onSubmit, maxLength = 10000, isLoading }: TextInputProps);
```

**UI 要素：**
- 多行文本框
- 字数统计
- 提交按钮
- Loading 状态

> ✅ 功能已在 `src/components/extractor/ToolSection.tsx` 内联实现。当前不拆独立 `text-input.tsx`，避免为单一工具流程增加不必要组件边界。

---

### Task 1.6: 创建 URL 输入组件 ✅ 已完成（内联在 ToolSection）

**输入：** 无

**文件：** `src/components/extractor/url-input.tsx`

**功能：**
```tsx
interface URLInputProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
}

export function URLInput({ onSubmit, isLoading }: URLInputProps);
```

**UI 要素：**
- 单行输入框
- URL 格式校验
- 提交按钮
- Loading 状态

> ✅ 功能已在 `src/components/extractor/ToolSection.tsx` 内联实现，并接入 `/api/extract/url`。当前不拆独立 `url-input.tsx`。

---

### Task 1.7: 创建结果展示组件 ✅ 已完成（内联在 ToolSection）

**输入：** 提取结果数据

**文件：** `src/components/extractor/results-table.tsx`

**功能：**
```tsx
interface ResultsTableProps {
  result: ExtractionResult;
  onExport?: (format: 'csv' | 'json') => void;
}

export function ResultsTable({ result, onExport }: ResultsTableProps);
```

**UI 要素：**
- Tab 切换（All / 1-word / 2-word / 3-word）
- 表格展示
- 排序功能
- 导出按钮

> ✅ 结果展示、短语 Tab、表格与操作按钮已在 `src/components/extractor/ToolSection.tsx` 内联实现。当前不拆独立 `results-table.tsx`。

---

### Task 1.8: 创建导出功能 ✅ 已完成（内联在 ToolSection）

**输入：** 提取结果数据

**文件：** `src/lib/export.ts`

**功能：**
```typescript
function exportToCSV(result: ExtractionResult): void;
function copyToClipboard(result: ExtractionResult): void;
```

**实现要点：**
- CSV 格式生成
- Blob 下载
- 剪贴板 API

> ✅ CSV 下载与 clipboard copy 已在 `src/components/extractor/ToolSection.tsx` 内联实现。当前不拆独立 `src/lib/export.ts`。

---

### Task 1.9: 创建 API 路由 - 文本提取 ✅ 已完成

**输入：** POST 请求

**文件：** `src/app/api/extract/text/route.ts`

**功能：**
```typescript
export async function POST(request: Request) {
  const { text, options } = await request.json();
  
  // 1. 检查使用次数限制（未登录用户）
  // 2. 执行提取
  // 3. 更新使用次数
  // 4. 返回结果
}
```

**验证：** 路由测试已覆盖，当前测试口径需与 10,000 字符限制保持一致

> ✅ 已实现 `src/app/api/extract/text/route.ts`。接收 `{ text, options }`，统一返回 `{ errorCode, error }` 错误结构；空文本返回 400，超过 10,000 字符返回 400，成功返回 `ExtractionResult`。已接入轻量内存限流并添加 API route 测试。

---

### Task 1.10: 创建 API 路由 - URL 提取 ✅ 已完成

**输入：** POST 请求

**文件：** `src/app/api/extract/url/route.ts`

**功能：**
```typescript
export async function POST(request: Request) {
  const { url, options } = await request.json();
  
  // 1. 检查使用次数限制
  // 2. 检查 robots.txt
  // 3. 抓取内容
  // 4. 执行提取
  // 5. 返回结果
}
```

> ✅ 已实现 `src/app/api/extract/url/route.ts`。接收 `{ url, options }`，先做 URL 安全校验，再检查 robots.txt，抓取 HTML 后复用 `extractKeywords`，返回 `sourceUrl`、`pageTitle`、`totalWords`、`uniqueKeywords`、`keywords`、`bigrams`、`trigrams`。统一返回 `{ errorCode, error }` 错误结构，已接入轻量内存限流并添加 API route 测试。

---

### Task 1.11: 创建使用次数限制逻辑 ✅ 已完成（MVP 版本）

**输入：** 请求信息

**文件：** `src/lib/rate-limiter.ts`

**功能：**
```typescript
interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
}

async function checkRateLimit(
  userId?: string,
  ipAddress?: string
): Promise<RateLimitResult>;

async function incrementRateLimit(
  userId?: string,
  ipAddress?: string
): Promise<void>;
```

**实现要点：**
- 内存 `Map` 记录请求次数
- 优先使用 `x-forwarded-for` / `x-real-ip`
- 按 UTC 次日零点重置
- 同时保护 `/api/extract/text` 和 `/api/extract/url`

> ✅ 已实现 MVP 级轻量内存限流。默认每 IP 每日 50 次免费提取，超限返回 `429` 与 `RATE_LIMIT_EXCEEDED`。当前方案仅用于单实例/单进程保护，不保证多实例全局一致。

---

## Phase 2: 用户系统 + 支付 🔄

### Task 2.1: 集成 Clerk 认证 ✅ 已完成

**输入：** Clerk 账号

**文件：** `src/proxy.ts`, `src/app/layout.tsx`, `src/components/layout/Header.tsx`

**功能：**
- 配置 Clerk Provider
- 配置 Clerk + next-intl proxy
- Header 接入登录/注册按钮与用户菜单
- 使用 Clerk prebuilt modal，不新增自定义登录/注册页面

**验证：** 登录/注册流程正常

> ✅ 已在根 `layout.tsx` 中配置 `ClerkProvider`，在 `src/proxy.ts` 中组合 Clerk 与 next-intl，并在 Header 中接入 `SignInButton`、`SignUpButton`、`UserButton`。免费提取功能仍保持匿名可用。

---

### Task 2.2: 创建 Header 组件 ✅ 已完成

**输入：** 无

**文件：** `src/components/layout/Header.tsx`

**功能：**
```tsx
export function Header() {
  // Logo
  // 导航链接（Pricing）
  // 登录/用户信息
}
```

**UI 要素：**
- Logo 文字
- Pricing 链接
- 登录按钮 / 用户头像下拉

> ✅ 已实现 Logo、导航、ThemeToggle、LocaleSwitcher、桌面/移动端登录注册入口、登录后用户菜单。Pricing 导航已启用，Blog 保持禁用占位。

---

### Task 2.3: 创建 Footer 组件 ✅ 已完成

**输入：** 无

**文件：** `src/components/layout/footer.tsx`

**功能：**
- 品牌信息
- 导航链接
- 版权声明

> ✅ 完整实现。3 列网格布局（Product / Resources / Legal），含所有导航链接和版权行。

---

### Task 2.4: 实现 AI 提取功能 ✅ 已完成（Pro）

**输入：** 用户文本

**文件：** `src/lib/ai-extractor.ts`

**功能：**
```typescript
interface AIExtractionResult {
  keywords: AIKeyword[];
}

interface AIKeyword {
  keyword: string;
  relevance: number;
  category: 'topic' | 'service' | 'industry' | 'entity';
}

async function extractWithAI(text: string): Promise<AIExtractionResult>;
```

**实现要点：**
- 调用 DeepSeek API（OpenAI-compatible Chat Completions）
- Prompt 设计
- JSON 输出归一化：relevance clamp、category fallback、去重、最多 20 个
- 错误处理与 15 秒超时设置

> ✅ 已实现 `src/lib/ai-extractor.ts`，默认使用 `deepseek-v4-flash`，服务端 fetch 直连，不新增 OpenAI SDK。

---

### Task 2.5: 创建 API 路由 - AI 提取 ✅ 已完成

**输入：** POST 请求

**文件：** `src/app/api/extract/ai/route.ts`

**功能：**
```typescript
export async function POST(request: Request) {
  // 1. 检查用户登录状态
  // 2. 检查用户订阅状态
  // 3. 原子 reserve AI 使用配额
  // 4. 执行 AI 提取
  // 5. 成功保留消耗；失败或超时 refund
  // 6. 返回结果
}
```

**权限：** 仅 Pro 用户可访问

> ✅ 已实现 `POST /api/extract/ai`，接收 `{ text }`，返回 `{ keywords, usage }`。AI 单次输入限制 20,000 字符，月配额通过 Supabase `ai_usage` RPC reserve/refund 管理。

---

### Task 2.6: 集成 Creem 支付 ✅ 已完成（Pro v1）

**输入：** Creem 账号

**文件：**
- `src/app/api/billing/checkout/route.ts`
- `src/app/api/billing/subscription/route.ts`
- `src/app/api/billing/portal/route.ts`
- `src/app/api/webhook/creem/route.ts`
- `src/lib/creem.ts`
- `src/lib/supabase-admin.ts`
- `src/lib/subscription.ts`

**功能：**
- 创建 Creem Checkout（monthly/yearly）
- 处理单数路径 Webhook：`/api/webhook/creem`
- 验证 Creem webhook 签名，按 `payment_events.event_id` 幂等处理
- 同步当前用户订阅状态到 Supabase
- 创建 Creem Customer Portal 链接
- 已订阅 active/trialing Pro 时阻止重复 checkout，返回 `ALREADY_SUBSCRIBED`
- Checkout 成功回跳 `/pricing?checkout=success`

**验证：** API/订阅/Webhook 单测通过；本地真实 Creem 流程已完成到 Supabase active 订阅写入。Creem 后台如已产生重复 active subscription，仍需在 Creem dashboard 手动取消不保留的订阅。

---

### Task 2.7: 创建 Pricing 页面 ✅ 已完成（支付版）

**输入：** 无

**文件：** `src/app/[locale]/pricing/page.tsx`

**功能：**
- 价格对比表
- Free / Pro 方案说明
- 登录用户可直接发起 monthly/yearly checkout
- 未登录用户点击 Pro CTA 打开 Clerk 登录
- `checkout=success` 成功提示
- FAQ 部分

> ✅ 已创建 `/pricing` 页面并接入 `PricingCheckoutActions`。Pro v1 已上线付费订阅，解锁 Text/URL 50,000 字符限制和 AI semantic extraction；PDF、YouTube、历史记录、优先支持仍明确标记为未来计划。

---

### Task 2.8: 创建用户订阅管理 ✅ 已完成（当前权益状态）

**输入：** 用户 ID

**文件：**
- `src/lib/subscription.ts`
- `src/components/billing/BillingProfilePanel.tsx`
- `src/components/billing/BillingPortalButton.tsx`
- `src/components/layout/Header.tsx`

**功能：**
```typescript
async function getUserSubscription(clerkUserId: string): Promise<Subscription | null>;
async function hasActiveProSubscription(clerkUserId: string | null): Promise<boolean>;
function isActiveProSubscription(subscription: Subscription | null): boolean;
async function processCreemSubscriptionEvent(event: NormalizedCreemSubscription): Promise<{ processed: boolean }>;
```

**数据库：** Supabase `subscriptions` + `payment_events`

> ✅ 已实现。`subscriptions` 只保存每个 `clerk_user_id` 的当前订阅/权益状态，`payment_events` 保存 webhook 历史。Billing 不再使用 `/account` 页面，而是嵌入 Clerk `UserButton.UserProfilePage`；旧 `/account` 页面已移除，访问应返回 404。

---

### Task 2.9: 创建权限/权益控制 ✅ 已完成（当前 Pro 场景）

**输入：** 无

**文件：** `src/lib/entitlements.ts`, `src/hooks/usePro.ts`

**功能：**
```typescript
function usePro() {
  return {
    isSignedIn: boolean;
    isPro: boolean;
    isLoading: boolean;
  };
}
```

> ✅ 服务端权益已接入：`src/lib/entitlements.ts` 定义 Free 10,000 / Pro 50,000 / AI 20,000 字符限制，Text、URL、AI API 通过 Clerk userId + Supabase subscription 判断 Pro 权益。客户端当前使用 `src/hooks/usePro.ts` 为 AI Tab 提供登录/Pro gating。后续如果增加历史记录、团队席位或更复杂配额展示，再扩展为 `usePermissions()`。

---

## Phase 3: SEO 内容 🔄

### Task 3.1: 创建首页布局 ✅ 已完成

**输入：** 无

**文件：** `src/app/[locale]/page.tsx`

**功能：**
- Hero 区域（H1 + 副标题）
- 工具区（Tab 切换）
- SEO 内容区
- CTA

> ✅ 首页完整实现。Hero + ToolSection（Text/URL/AI Tab） + how-it-works + how-to-use + use-cases + FAQ + CTA，全部从 i18n 翻译文件驱动。

---

### Task 3.2: 创建 SEO 内容组件 ✅ 已完成

**输入：** 无

**文件：** `src/components/seo/`

**组件列表：**
- `HowItWorksSection.tsx` - 3 步流程
- `HowToUseSection.tsx` - 操作步骤
- `UseCasesSection.tsx` - 使用场景
- `FaqSection.tsx` - 常见问题

> ✅ 已拆分为 `src/components/seo/` 下独立组件，并已完成首页接线。当前仍在持续微调 spacing、内容层级和 SEO 文案细节。

---

### Task 3.3: 添加 Schema.org 结构化数据 ✅ 基础完成

**输入：** 无

**文件：** `src/lib/schema.ts`

**功能：**
- WebApplication Schema
- FAQPage Schema
- BreadcrumbList Schema

> ✅ 已抽出 `createJsonLdGraph()` / `createBreadcrumbList()` helper。首页、About、Privacy、Terms、Pricing 与 404 已注入 JSON-LD；非首页已同步可见 Breadcrumb UI 与 BreadcrumbList。后续新增内容页时继续复用同一 helper。

---

### Task 3.4: 创建 Privacy Policy 页面 ✅ 已完成

**输入：** 无

**文件：** `src/app/[locale]/privacy/page.tsx`

**内容：**
- 数据收集说明
- Cookie 使用
- 第三方服务
- 用户权利

> ✅ 已迁移为 Next.js + next-intl 页面，含 Header/Footer、metadata、canonical/alternates、JSON-LD、隐私正文和表格结构；文案已按当前真实后端行为修正。

---

### Task 3.5: 创建 Terms of Service 页面 ✅ 已完成

**输入：** 无

**文件：** `src/app/[locale]/terms/page.tsx`

**内容：**
- 使用条款
- 付费条款
- 免责声明
- 知识产权

> ✅ 已迁移为 Next.js + next-intl 页面，复用 Privacy 文档页布局模式，含 metadata、canonical/alternates 与 JSON-LD。

---

### Task 3.6: 创建 robots.txt ✅ 已完成

**输入：** 无

**文件：** `src/app/robots.ts`

```
User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://extractkeywords.com/sitemap.xml
```

> ✅ 已使用 Next.js metadata route 生成 robots，并补充对常见 AI crawler 的规则声明。

---

### Task 3.7: 创建 sitemap.xml ✅ 已完成

**输入：** 无

**文件：** `src/app/sitemap.ts`

**功能：**
- 动态生成 sitemap
- 包含所有已上线静态页面

> ✅ 已实现，当前包含 `/`、`/privacy`、`/terms`、`/about`、`/pricing`，并输出 locale alternates。

---

### Task 3.8: 创建 SEO 元数据 ✅ 基础完成

**输入：** 无

**文件：** `src/app/layout.tsx`

**内容：**
```tsx
export const metadata: Metadata = {
  title: 'Extract Keywords from Text or URL - Free Keyword Extraction Tool',
  description: 'Free online keyword extraction tool. Extract keywords from text or URL instantly. No signup required.',
  keywords: ['keyword extraction', 'extract keywords', 'keyword tool'],
  openGraph: {
    title: 'Extract Keywords from Text or URL',
    description: 'Free online keyword extraction tool',
    url: 'https://extractkeywords.com',
    siteName: 'ExtractKeywords',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Extract Keywords from Text or URL',
    description: 'Free online keyword extraction tool',
  },
};
```

> ✅ 根 `layout.tsx`、首页、About、Privacy、Terms、Pricing 均已配置 metadata、canonical/alternates 或页面级 SEO 信息。仍需注意：根布局目前采用静态导入 `messages/en.json` 作为默认英文文案，尚未做完整 locale 动态化。

---

### Task 3.9: 创建 llms.txt / AI-readable pricing 文档 ✅ 已完成

**输入：** 无

**文件：** `public/llms.txt`, `public/pricing.md`

**功能：**
- 为 AI crawler 提供站点摘要、关键页面与 sitemap 链接
- 提供 human-facing `/pricing` 与 AI-readable `/pricing.md`
- 保持 Pro 当前权益与未来计划说明同 Pricing 页面一致

> ✅ 已创建 `public/llms.txt` 与 `public/pricing.md`，当前包含 `/pricing`、`/pricing.md`、`/sitemap.xml` 等关键入口，并已同步 Pro 付费订阅、50,000 字符限制、AI semantic extraction、Creem billing 与未来 PDF/YouTube 计划边界。

---

### Task 3.10: Blog 内容体系 🔄 前端框架完成，正式文章待实施

**输入：** SEO / AI SEO 内容集群规划

**文件：** `1-suzhen/content-pages-task.md`

**已完成：**
- `/blog` 前端入口页
- `/blog/[slug]` 文章详情页骨架
- 占位文章 `/blog/how-to-extract-keywords-from-a-webpage`
- Header / Footer Blog 链接启用
- Blog metadata、canonical、BreadcrumbList、Blog JSON-LD
- 当前无正式文章，因此 `/blog` 和占位文章均暂设 `noindex`，不进 sitemap / llms.txt

**计划文章：**
- `/blog/how-to-extract-keywords-from-a-webpage`（P0）
- `/blog/keyword-density-checker`（P1）
- `/blog/bigrams-and-trigrams-in-seo`（P1）
- `/blog/competitor-content-keyword-analysis`（P2）

> 🔄 Blog 前端框架和文章详情页骨架已落地。下一步是替换第一篇文章的占位正文；正式文章上线后再加入 sitemap 和 `public/llms.txt`。

---

## Phase 4: 差异化功能（后期）

### Task 4.1: PDF 提取功能

**预计工时：** 1 天

**要点：**
- 文件上传
- PDF 解析（pdf-parse）
- 文本提取
- 复用现有提取逻辑

---

### Task 4.2: YouTube 提取功能

**预计工时：** 1.5 天

**要点：**
- YouTube URL 解析
- 视频描述获取（YouTube Data API）
- 字幕获取（YouTube Transcript API）
- 合并内容后提取

---

### Task 4.3: 提取历史记录

**预计工时：** 1 天

**要点：**
- Supabase 表创建
- 历史记录保存
- 历史记录展示
- 30 天自动过期

---

## 数据库设计

### Supabase 表结构

**subscriptions 表：**
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL UNIQUE,
  plan TEXT NOT NULL CHECK (plan IN ('pro')),
  interval TEXT CHECK (interval IN ('monthly', 'yearly')),
  status TEXT NOT NULL CHECK (
    status IN (
      'active',
      'trialing',
      'past_due',
      'canceled',
      'unpaid',
      'incomplete',
      'incomplete_expired',
      'paused',
      'expired'
    )
  ),
  provider TEXT NOT NULL DEFAULT 'creem' CHECK (provider IN ('creem')),
  provider_customer_id TEXT,
  provider_subscription_id TEXT,
  provider_checkout_id TEXT,
  product_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_subscription_id)
);
```

> ✅ SQL 已提交在 `supabase/payment-system.sql`。若已有重复订阅行，先执行 `supabase/fix-subscription-uniqueness.sql`：按 `clerk_user_id` 保留最新当前行，删除旧重复行，再创建唯一索引。

**payment_events 表：**
```sql
CREATE TABLE payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT NOT NULL UNIQUE,
  provider TEXT NOT NULL DEFAULT 'creem' CHECK (provider IN ('creem')),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**基础提取限流：**

> ✅ Text/URL 基础提取限流由 `src/lib/rate-limiter.ts` 处理。生产环境优先使用 Upstash Redis REST（`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`），缺失或 Redis 请求失败时回退内存限流；不再规划 Supabase `ip_usage` 表。

**ai_usage 表：**
```sql
CREATE TABLE ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  month TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (clerk_user_id, month)
);
```

**ai_usage_events 表：**
```sql
CREATE TABLE ai_usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT NOT NULL,
  month TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'timeout', 'refunded')),
  input_chars INTEGER,
  keywords_count INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

> ✅ SQL 已提交在 `supabase/ai-usage.sql`。AI 月配额通过 `reserve_ai_usage(...)` / `refund_ai_usage(...)` RPC 原子处理：成功保留消耗，失败/超时/模型错误 refund。

---

## 开发流程建议

### 每日开发流程

1. **开始前：** `git pull` 同步代码
2. **开发中：** 小步提交，每个 Task 一个 commit
3. **完成后：** `git push` + Vercel 自动部署
4. **测试：** 使用预览域名测试

### 分支策略

```
main (生产)
  └── dev (开发)
       ├── feature/text-extraction
       ├── feature/url-extraction
       ├── feature/ai-extraction
       └── feature/payment
```

### Commit 规范

```
feat: 实现文本关键词提取
fix: 修复停用词过滤问题
docs: 更新 API 文档
style: 格式化代码
refactor: 重构提取逻辑
test: 添加单元测试
```

---

## 验收标准

### Phase 0 验收

- [x] Next.js 项目可正常启动
- [x] Tailwind CSS 生效
- [x] 环境变量配置正确

### Phase 1 验收

- [x] 文本提取功能正常
- [x] URL 提取功能正常
- [x] 2词/3词短语分析正常
- [x] CSV 导出正常
- [x] Clipboard copy 正常
- [x] 使用次数限制生效

### Phase 2 验收

- [x] Clerk 登录/注册正常
- [x] Creem checkout API 可创建 monthly/yearly checkout
- [x] Creem webhook 使用 `/api/webhook/creem` 单数路径
- [x] Supabase subscription 当前状态同步可用
- [x] Pro Text/URL 50,000 字符限制生效，Free 仍为 10,000
- [x] Billing 嵌入 Clerk 用户菜单
- [x] `/account` 页面已移除，应返回 404
- [x] AI 提取 API、Pro 权益、20,000 字符限制、月配额 reserve/refund 已接入
- [x] 客户端 `usePro()` Hook 已接入 AI Tab gating

### Phase 3 验收

- [x] 首页渲染正常
- [x] SEO 基础内容完整（首页、About、Privacy、Terms、Pricing）
- [x] Schema.org 基础可用
- [x] BreadcrumbList 与统一 schema helper 已接入
- [x] robots.txt/sitemap.xml 可访问
- [x] llms.txt 与 pricing.md 可访问
- [x] Blog 内容体系规划已完成
- [x] `/blog` 前端框架已完成
- [x] `/blog/[slug]` 文章详情页骨架已完成
- [ ] 首批 `/blog/*` 正式文章待实现

---

## 风险与注意事项

### 技术风险

| 风险 | 应对 |
|-----|------|
| DeepSeek API 不稳定 | 添加重试机制 + 降级方案 |
| URL 抓取失败率高 | 添加错误提示 + 用户友好信息 |
| Vercel 函数超时 | 优化算法，减少处理时间 |
| Creem 后台重复订阅 | 应用侧阻止 active Pro 重复 checkout；历史重复 active subscription 需在 Creem dashboard 手动取消 |
| Clerk 本地 key/session 不匹配 | 确认 `.env.local` 中 publishable/secret key 属于同一 Clerk app，必要时清理浏览器会话 |

### 注意事项

1. **环境变量安全：** 不要提交 `.env.local`
2. **API 密钥保护：** Creem、Supabase service role、Clerk secret 仅服务端使用，不暴露客户端
3. **错误日志：** 使用 Vercel Analytics 监控错误
4. **性能监控：** 使用 Web Vitals 追踪性能
5. **支付 Webhook：** Creem 后台统一配置 `/api/webhook/creem`，不要再使用复数 `/api/webhooks/creem`

---

*文档创建：2026-05-28*
*预计总工时：9 天*
*MVP 上线：Phase 0-3（6 天）*
