# ExtractKeywords

## 技术栈

- **框架**: Next.js 16 (App Router, Turbopack)
- **样式**: Tailwind CSS v4（CSS-first 配置，`@import "tailwindcss"`）
- **认证**: Clerk (`@clerk/nextjs` v7)
- **网页抓取**: Cheerio
- **AI**: DeepSeek（语义关键词提取）
- **数据库**: Supabase（用户数据、提取历史，待安装）
- **支付**: Creem（Pro 订阅，待安装）
- **邮件**: Resend（事务邮件，待安装）
- **国际化**: next-intl（MVP 仅英文，预留法/西/阿拉伯语 + RTL）
- **部署**: Vercel（域名 `extractkeywords.com`）

## `Commands`

```bash
npm install          # 安装依赖
npm run dev          # 启动开发服务器 (http://localhost:3000)
npm run build        # 生产环境构建
npm run start        # 启动生产服务器
npm run lint         # 代码检查
```

## 浏览器测试

- `agent-browser` CLI 已安装（`~/.agent-browser/browsers` 含 Chrome）。UI 问题优先用 `agent-browser open <url>` + `agent-browser snapshot -i` + `agent-browser eval` 验证视觉效果而非推算
- `npx playwright` 也可用（浏览器在 `~/Library/Caches/ms-playwright/`）

## 端口清理

- `pkill -f "next dev"` — 杀残留的 dev server 进程（端口被占时用）

## 关键文件

| 区域 | 关键路径 |
|------|---------|
| 页面 | `src/app/[locale]/page.tsx`（首页）, `src/app/pricing/`, `src/app/privacy/`, `src/app/terms/` |
| 组件 | `src/components/ui/`（Button, Input, Tabs, Table）, `src/components/layout/`（Header, Footer, Logo）, `src/components/extractor/`（ToolSection）, `src/components/theme/`（ThemeProvider, ThemeToggle） |
| 类型定义 | `src/types/index.ts`（Keyword, Phrase, ExtractionResult, AIExtractionResult 等） |
| 工具函数 | `src/lib/utils.ts`（cn 函数） |
| 提取逻辑 | `src/lib/keyword-extractor.ts`, `src/lib/url-fetcher.ts`, `src/lib/ai-extractor.ts`（规划中） |
| 国际化 | `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/proxy.ts`, `messages/en.json` |
| SEO | `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/llms.txt/route.ts`（规划中） |
| 规划文档 | `PRD.md`, `DEVELOPMENT-TASKS.md`, `1-suzhen/`（MVP-SPEC / HOMEPAGE-DESIGN / PRICING / COMPETITOR-ANALYSIS / GEO-AI-SEO / KEYWORD-RESEARCH / SITE-STRUCTURE / TECH-STACK / UI-COMPONENTS / WORKFLOW / PROGRESS） |

## 关键架构决策

| # | 议题 | 决策 |
|---|------|------|
| D-001 | 暗色模式 | class 切换 + Tailwind v4 `@custom-variant dark` + ThemeProvider 三态（light/dark/system），FOUC 用 `<script>` 内联预热 |
| D-002 | 多语言 | next-intl + `[locale]` 路由 + RTL 预留，MVP 仅英文。使用 `proxy.ts`（Next.js 16 约定），`app/page.tsx` 提供 `/` 兜底路由 |
| D-003 | AI Tab 可见性 | 显示但禁用 + PRO 徽章；未登录弹登录、已登录未付费弹升级 |
| D-004 | Vercel | 已上线，暂不提交 GSC（等 SEO 内容就绪后再提交） |

## 常见坑点

### next-intl 路由规则（Next.js 16）

- Next.js 16 新增 `proxy.ts` 替代 `middleware.ts`，next-intl 在 `proxy.ts` 中 `createMiddleware(routing)`
- 根布局 `app/layout.tsx` 含 `<html>`/`<body>` + FOUC 脚本；`app/[locale]/layout.tsx` 注入 `NextIntlClientProvider` + `ThemeProvider`
- `app/page.tsx` 提供 `/` 兜底路由——即使 middleware 在 Vercel 边缘层未完全生效，`/` 也有文件系统级别的路由入口
- `/` → 英文首页（middleware rewrite 或 app/page.tsx 兜底）
- `/en` → 英文首页，重定向到 `/`
- 不要在 `[locale]` 目录下直接创建 `en/` 文件夹
- `usePathname()` 返回的路径包含语言前缀（如 `/es/about`），解析时需过滤
- 过滤语言段: `segments.filter((s, i) => i !== 0 || !SUPPORTED_LOCALES.includes(s))`
- **非 locale 路径**（如 `/auth/*`）需要在 `proxy.ts` 的 matcher 中显式排除，且需要自己的 layout（含 `<html>`/`<body>` 标签）
- 组件用 Tailwind logical 属性 `ms-*/me-*` 替代 `ml-*/mr-*`，兼容未来 RTL 语言

### 多语言 URL 拼接

错误: `/${locale}/path` → 产生 `/frpath`
错误: `/${locale === "en" ? "" : locale}/path` → 产生 `//path`
正确: 使用 `buildUrl(locale, "/path")` 从 `@/lib/url` 导入

### Meta description

严格控制在 160 字符以内（SEO 要求）

### metadata 本地化

`layout.tsx` 的 `generateMetadata` 中 title.default、description、openGraph、twitter 均需用 `getTranslations` 获取翻译，不可硬编码

### 正文内链本地化

- `dangerouslySetInnerHTML` 中的链接不会被 `getLocalizedPath` 处理
- 在翻译正文中用具名占位符替换 `href`，组装时 replace 为本地化路径

### `.next` 缓存损坏

- 修改布局/服务端组件后可能出现模块找不到错误
- **删除/移动页面文件时 Turbopack 可能 panic**（`Cell no longer exists in directory_tree_to_loader_tree`）
- 清除缓存: `rm -rf .next/cache` 后重新 `npm run build`
- 严重时 `rm -rf .next` 冷重启

### 主题系统（暗色模式）

- Tailwind v4 使用 `@custom-variant dark (&:where(.dark, .dark *))`
- ThemeProvider 把 `light` / `dark` / `system` 三态的最终结果写到 `<html class="dark">`
- FOUC 防护：`<script>` 内联预热，在 hydrate 前先打 class
- **不要用 `<Script strategy="beforeInteractive">`** 做 FOUC 脚本——它会被渲染成 `<html>` 的直接子元素，导致非法 HTML 嵌套和 hydration 错误。用 `<head>` 内直接 `<script dangerouslySetInnerHTML>`。React dev 端的 "script inside component" warning 是已知无害的
- **Hydration 陷阱**：ThemeProvider 的 `useState` 初始值必须固定为 `'system'`，不能直接从 `localStorage` 读取（SSR 无 `window` → 服务端 `'system'` vs 客户端 `'dark'` = hydration mismatch）。`localStorage` 读取放在 `useEffect` 中，FOUC 脚本负责视觉防护，ThemeProvider 负责交互状态
- **ESLint `react-hooks/set-state-in-effect`**：在 `useEffect` 中读 `localStorage` 后 `setState` 会触发此规则。这是标准模式，加 `// eslint-disable-next-line` 即可

### 全屏覆盖层滚动锁定

- 全屏 fixed 覆盖层打开时，需锁定 body 滚动
- `document.body.style.overflow = 'hidden'`
- 计算滚动条宽度 `window.innerWidth - document.documentElement.clientWidth`，补偿到 `paddingRight` 防止页面抖动
- useEffect cleanup 中恢复原始 overflow 和 paddingRight

### Split Button 下拉菜单

- 交互：鼠标悬停展开（`onMouseEnter`）、150ms 延迟关闭（`onMouseLeave` + `setTimeout`）
- 无箭头按钮，无 pinned 状态——悬停即显，移出即收

### 安全响应头 / CSP

- `next.config.ts` 的 `async headers()` 注入 CSP 等响应头
- 修改 CSP 后需 `npm run build` 验证构建

## SEO 规范

### 基础配置

- 每个路由使用 Metadata API 动态生成 TDK
- 使用 `title.template` 自动追加品牌后缀：`title: { template: "%s | ExtractKeywords", default: "Free Online Keyword Extraction Tool | ExtractKeywords" }`
- Meta title（含品牌后缀）应控制在 40-60 字符之间

### JSON-LD Schema 规范

- **注入位置**：全局 Organization schema 在 `layout.tsx` 的 `<head>` 注入；页面级 schema（WebApplication/FAQPage/WebPage/BlogPosting）在各 `page.tsx` 的 `<main>` 前注入

| 规范 | 说明 |
|------|------|
| Schema 类型 | 工具页面用 `WebApplication`，博客用 `BlogPosting` |
| BlogPosting 必填 | headline, image (ImageObject 1200×630), datePublished, author |
| 日期格式 | ISO 8601 含时区 (`2026-03-16T00:00:00+00:00`) |
| 多语言支持 | Schema 文本从翻译文件获取，`inLanguage` 标识语言 |
| @graph 模式 | 多 Schema 用 `@graph` 组织，配合 `@id` 引用 |
| @graph 与 @context | `@context` 放在 `@graph` 外层 wrapper 上，graph 内条目不重复添加 |
| BreadcrumbList | 只包含实际存在的页面，不支持 `inLanguage` 属性 |
| SearchAction | 仅当有实际搜索功能时添加 |
| 全局 Schema 本地化 | `layout.tsx` 的 Organization 需用 `getTranslations()` 动态获取描述，不能硬编码 |
| isPartOf 引用检查 | 引用 `#website` 等 ID 前需确认该 ID 在全局 schema 中存在（当前仅 `#organization`） |

### hreflang 规范

- 所有页面都应包含 x-default 指向默认语言版本
- 使用 `buildUrl(locale, "/path")` 生成 canonical/hreflang URL

### sitemap 维护

新增页面时需同步更新 `src/app/sitemap.ts` 的 `pages` 数组

- sitemap 中每种语言版本的 URL 都需添加 `alternates.languages`（含 hreflang 标签），不只是默认语言
- `lastModified` 使用每页实际修改日期，不用 `new Date()`

### 新增博客文章检查清单

- `messages/en.json` → `blog.<slug>` 命名空间（SEO title ≤46 chars + brand = ≤60，description ~155 chars）
- `messages/fr.json` 等各语言 → 同上，`article.sections` 需完整翻译
- `src/app/[locale]/blog/<slug>/page.tsx` → BLOG_PATH, generateMetadata（BlogPosting + image + OG image + twitter image）, breadcrumb
- `src/app/[locale]/blog/<slug>/page.test.tsx`
- `src/app/sitemap.ts` → pages 数组新增，固定 lastMod 日期
- `messages/en.json` + 各语言 → `blog.index.posts` 和 `sidebar.mostRead` 各加一条
- `src/app/llms.txt/route.ts` → Useful Links 新增
- 侧边栏 mostRead 只保留真实存在的文章，related 可暂空（模块保留）

### 删除博客文章检查清单

- 删除 `src/app/[locale]/blog/<slug>/` 目录
- `messages/en.json` + 各语言 → 删除 `blog.<slug>` 命名空间，更新 `blog.index`（posts, mostRead, topics）
- `src/app/sitemap.ts` → 移除对应条目
- `src/app/llms.txt/route.ts` → 移除或替换引用
- 全文 grep `<slug>` 确认无遗留引用

### Open Graph / Twitter Card

- 通过 Next.js Metadata API 的 `openGraph` 和 `twitter` 字段注入，在 `[locale]/layout.tsx` 的 `generateMetadata` 中配置
- OG 图片占位 URL：`https://extractkeywords.com/og-image.png`，需在 `public/` 放 1200×630 图片

### llms.txt

- AI 搜索引擎（ChatGPT、Perplexity）使用 `/llms.txt` 获取网站摘要
- 实现方式：Route Handler `src/app/llms.txt/route.ts`，返回 `text/plain`，内联纯文本内容
- proxy.ts matcher 排除 `.*\\..*`（含点号 URL），所以路由不受 next-intl 影响

### Vercel 部署注意事项

- NEXT_LOCALE cookie 可能缺失导致 404：`npm run build` 确认 build 通过且有 Proxy (Middleware) 检测
- 部署后如果 ALL 路径（含 `/_next/static/`）都 404，说明不是路由问题，是部署没挂上；检查 Vercel Domains 设置和项目是否存在

## Git 操作陷阱

- **简单跨分支修改**：直接 `git checkout target-branch` 编辑提交，不要用 stash——stash 增加了不必要的复杂度，容易丢失工作区内容
- **`git reset --soft` 后 index 内有全部已暂存内容**：此时 `git add` 只是追加暂存，`git commit` 会包含所有已暂存文件，不是只有刚 `git add` 的那个。如需只提交单文件，先 `git restore --staged .` 清空暂存，再 `git add <file>`
- **同 commit 的两个分支间切换**：`git checkout` 会携带未提交的工作区变更（包括 index 和 working tree），注意分支隔离
- **简单场景**：不要用 stash/reset/rebase 等复杂操作，优先用直接编辑 + 提交
