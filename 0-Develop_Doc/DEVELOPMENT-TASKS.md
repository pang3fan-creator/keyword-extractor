# 开发任务拆分

## 任务概览

| Phase | 内容 | 预计工时 | 优先级 |
|-------|------|---------|--------|
| Phase 0 | 项目初始化 | 0.5 天 | P0 |
| Phase 1 | 核心功能 | 2 天 | P0 |
| Phase 2 | 用户系统 + 支付 | 2 天 | P0 |
| Phase 3 | SEO 内容 | 1.5 天 | P1 |
| Phase 4 | 差异化功能 | 3 天 | P2 |

**MVP 上线范围：Phase 0-3**

---

## Phase 0: 项目初始化

### Task 0.1: 创建 Next.js 项目

**输入：** 无

**命令：**
```bash
npx create-next-app@latest keyword-extractor --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

**输出：**
- Next.js 项目骨架
- Tailwind CSS 配置
- TypeScript 配置

**验证：** `npm run dev` 正常启动

---

### Task 0.2: 安装依赖

**输入：** Task 0.1 完成

**依赖列表：**
```json
{
  "dependencies": {
    "@clerk/nextjs": "^5.x",
    " cheerio": "^1.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x"
  },
  "devDependencies": {
    "@types/node": "^20.x",
    "eslint": "^8.x",
    "prettier": "^3.x"
  }
}
```

**输出：** package.json 更新

---

### Task 0.3: 配置环境变量

**输入：** Task 0.2 完成

**创建文件：** `.env.local`

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxx
CLERK_SECRET_KEY=sk_xxx

# DeepSeek
DEEPSEEK_API_KEY=sk-xxx

# Creem
CREEM_API_KEY=xxx

# App
NEXT_PUBLIC_APP_URL=https://extractkeywords.com
```

**创建文件：** `.env.example`（脱敏版本）

---

### Task 0.4: 配置 Vercel 部署

**输入：** Task 0.3 完成

**操作：**
1. 连接 GitHub 仓库
2. 配置环境变量
3. 设置域名 `extractkeywords.com`

**输出：** Vercel 项目创建完成

---

### Task 0.5: 创建基础组件结构

**输入：** Task 0.4 完成

**目录结构：**
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── pricing/
│   │   └── page.tsx
│   ├── privacy/
│   │   └── page.tsx
│   └── terms/
│       └── page.tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── tabs.tsx
│   │   └── table.tsx
│   ├── layout/
│   │   ├── header.tsx
│   │   └── footer.tsx
│   └── extractor/
│       ├── text-input.tsx
│       ├── url-input.tsx
│       ├── results-table.tsx
│       └── export-buttons.tsx
├── lib/
│   ├── utils.ts
│   ├── keyword-extractor.ts
│   ├── url-fetcher.ts
│   └── ai-extractor.ts
└── types/
    └── index.ts
```

**输出：** 基础文件结构创建

---

## Phase 1: 核心功能

### Task 1.1: 实现关键词提取算法

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

---

### Task 1.2: 实现停用词列表

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

---

### Task 1.3: 实现 URL 抓取功能

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

---

### Task 1.4: 实现 Robots.txt 检查

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

---

### Task 1.5: 创建文本输入组件

**输入：** 无

**文件：** `src/components/extractor/text-input.tsx`

**功能：**
```tsx
interface TextInputProps {
  onSubmit: (text: string) => void;
  maxLength?: number;
  isLoading?: boolean;
}

export function TextInput({ onSubmit, maxLength = 5000, isLoading }: TextInputProps);
```

**UI 要素：**
- 多行文本框
- 字数统计
- 提交按钮
- Loading 状态

---

### Task 1.6: 创建 URL 输入组件

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

---

### Task 1.7: 创建结果展示组件

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

---

### Task 1.8: 创建导出功能

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

---

### Task 1.9: 创建 API 路由 - 文本提取

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

**验证：** API 测试通过

---

### Task 1.10: 创建 API 路由 - URL 提取

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

---

### Task 1.11: 创建使用次数限制逻辑

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
- Cookie 读取/设置
- IP 记录（Supabase）
- 每日重置逻辑

---

## Phase 2: 用户系统 + 支付

### Task 2.1: 集成 Clerk 认证

**输入：** Clerk 账号

**文件：** `src/middleware.ts`, `src/app/layout.tsx`

**功能：**
- 配置 Clerk Provider
- 配置中间件
- 创建登录/注册页面

**验证：** 登录/注册流程正常

---

### Task 2.2: 创建 Header 组件

**输入：** 无

**文件：** `src/components/layout/header.tsx`

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

---

### Task 2.3: 创建 Footer 组件

**输入：** 无

**文件：** `src/components/layout/footer.tsx`

**功能：**
- 品牌信息
- 导航链接
- 版权声明

---

### Task 2.4: 实现 AI 提取功能

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
- 调用 DeepSeek API
- Prompt 设计
- 错误处理
- 超时设置

---

### Task 2.5: 创建 API 路由 - AI 提取

**输入：** POST 请求

**文件：** `src/app/api/extract/ai/route.ts`

**功能：**
```typescript
export async function POST(request: Request) {
  // 1. 检查用户登录状态
  // 2. 检查用户订阅状态
  // 3. 检查 AI 使用配额
  // 4. 执行 AI 提取
  // 5. 更新配额
  // 6. 返回结果
}
```

**权限：** 仅 Pro 用户可访问

---

### Task 2.6: 集成 Creem 支付

**输入：** Creem 账号

**文件：** `src/app/api/webhooks/creem/route.ts`

**功能：**
- 创建 Checkout Session
- 处理 Webhook
- 更新用户订阅状态

**验证：** 支付流程完整

---

### Task 2.7: 创建 Pricing 页面

**输入：** 无

**文件：** `src/app/pricing/page.tsx`

**功能：**
- 价格对比表
- 月付/年付切换
- 升级按钮
- FAQ 部分

---

### Task 2.8: 创建用户订阅管理

**输入：** 用户 ID

**文件：** `src/lib/subscription.ts`

**功能：**
```typescript
async function getUserSubscription(userId: string): Promise<Subscription>;
async function createSubscription(userId: string, plan: string): Promise<void>;
async function cancelSubscription(userId: string): Promise<void>;
```

**数据库：** Supabase subscriptions 表

---

### Task 2.9: 创建权限控制 Hook

**输入：** 无

**文件：** `src/hooks/use-permissions.ts`

**功能：**
```typescript
function usePermissions() {
  const { user } = useUser();
  
  return {
    isPro: boolean;
    canUseAI: boolean;
    dailyLimit: number | null;
    dailyRemaining: number;
  };
}
```

---

## Phase 3: SEO 内容

### Task 3.1: 创建首页布局

**输入：** 无

**文件：** `src/app/page.tsx`

**功能：**
- Hero 区域（H1 + 副标题）
- 工具区（Tab 切换）
- SEO 内容区
- CTA

---

### Task 3.2: 创建 SEO 内容组件

**输入：** 无

**文件：** `src/components/seo/`

**组件列表：**
- `how-it-works.tsx` - 3 步流程
- `why-it-matters.tsx` - 价值说明
- `use-cases.tsx` - 使用场景
- `faq.tsx` - 常见问题

---

### Task 3.3: 添加 Schema.org 结构化数据

**输入：** 无

**文件：** `src/components/seo/schema.tsx`

**功能：**
- WebApplication Schema
- FAQPage Schema
- BreadcrumbList Schema

---

### Task 3.4: 创建 Privacy Policy 页面

**输入：** 无

**文件：** `src/app/privacy/page.tsx`

**内容：**
- 数据收集说明
- Cookie 使用
- 第三方服务
- 用户权利

---

### Task 3.5: 创建 Terms of Service 页面

**输入：** 无

**文件：** `src/app/terms/page.tsx`

**内容：**
- 使用条款
- 付费条款
- 免责声明
- 知识产权

---

### Task 3.6: 创建 robots.txt

**输入：** 无

**文件：** `public/robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://extractkeywords.com/sitemap.xml
```

---

### Task 3.7: 创建 sitemap.xml

**输入：** 无

**文件：** `src/app/sitemap.ts`

**功能：**
- 动态生成 sitemap
- 包含所有静态页面

---

### Task 3.8: 创建 SEO 元数据

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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  plan TEXT CHECK (plan IN ('free', 'pro')),
  status TEXT CHECK (status IN ('active', 'canceled', 'expired')),
  stripe_subscription_id TEXT,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**ip_usage 表：**
```sql
CREATE TABLE ip_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address TEXT NOT NULL,
  date DATE NOT NULL,
  count INTEGER DEFAULT 0,
  UNIQUE(ip_address, date)
);
```

**ai_usage 表：**
```sql
CREATE TABLE ai_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  month TEXT NOT NULL, -- YYYY-MM
  count INTEGER DEFAULT 0,
  UNIQUE(user_id, month)
);
```

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

- [ ] Next.js 项目可正常启动
- [ ] Tailwind CSS 生效
- [ ] 环境变量配置正确

### Phase 1 验收

- [ ] 文本提取功能正常
- [ ] URL 提取功能正常
- [ ] 2词/3词短语分析正常
- [ ] CSV 导出正常
- [ ] 使用次数限制生效

### Phase 2 验收

- [ ] Clerk 登录/注册正常
- [ ] AI 提取功能正常
- [ ] Creem 支付流程正常
- [ ] 权限控制正确

### Phase 3 验收

- [ ] 首页渲染正常
- [ ] SEO 内容完整
- [ ] Schema.org 正确
- [ ] robots.txt/sitemap.xml 可访问

---

## 风险与注意事项

### 技术风险

| 风险 | 应对 |
|-----|------|
| DeepSeek API 不稳定 | 添加重试机制 + 降级方案 |
| URL 抓取失败率高 | 添加错误提示 + 用户友好信息 |
| Vercel 函数超时 | 优化算法，减少处理时间 |

### 注意事项

1. **环境变量安全：** 不要提交 `.env.local`
2. **API 密钥保护：** 使用 Server Actions，不暴露客户端
3. **错误日志：** 使用 Vercel Analytics 监控错误
4. **性能监控：** 使用 Web Vitals 追踪性能

---

*文档创建：2026-05-28*
*预计总工时：9 天*
*MVP 上线：Phase 0-3（6 天）*
