# ExtractKeywords

## 技术栈

- **框架**: Next.js 16 (App Router, Turbopack)
- **样式**: Tailwind CSS v4（CSS-first 配置，`@import "tailwindcss"`）+ shadcn/ui v4（`@base-ui/react` 底层）
- **UI 布局模式**: HyperUI（HTML 片段，营销页面参考）
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

## 端口清理

- `pkill -f "next dev"` — 杀残留的 dev server 进程（端口被占时用）

## 关键文件

| 区域     | 关键路径                                                                                                                                                                                                                                                                                          |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 页面     | `src/app/[locale]/page.tsx`（首页）, `src/app/pricing/`, `src/app/privacy/`, `src/app/terms/`                                                                                                                                                                                                     |
| 组件     | `src/components/ui/`（shadcn/ui v4：Button, Input, Textarea, Tabs, Table, Accordion, Badge, Separator）+ `src/components/layout/`（Header, Footer, Logo）+ `src/components/extractor/`（ToolSection）+ `src/components/seo/`（FaqSection）+ `src/components/theme/`（ThemeProvider, ThemeToggle） |
| 类型定义 | `src/types/index.ts`（Keyword, Phrase, ExtractionResult, AIExtractionResult 等）                                                                                                                                                                                                                  |
| 工具函数 | `src/lib/utils.ts`（cn 函数）                                                                                                                                                                                                                                                                     |
| 提取逻辑 | `src/lib/keyword-extractor.ts`, `src/lib/url-fetcher.ts`                                                                                                                                                                                                                                          |
| 国际化   | `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/proxy.ts`, `messages/en.json`                                                                                                                                                                                                                  |
| 规划文档 | `PRD.md`, `DEVELOPMENT-TASKS.md`, `1-suzhen/`                                                                                                                                                                                                                                                     |

## 关键架构决策

| #     | 议题          | 决策                                                                                                                                                                  |
| ----- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-001 | 暗色模式      | class 切换 + Tailwind v4 `@custom-variant dark` + ThemeProvider 三态（light/dark/system），FOUC 用 `<script>` 内联预热。shadcn/ui CSS 变量通过 `.dark` 选择器同步切换 |
| D-002 | 多语言        | next-intl + `[locale]` 路由 + RTL 预留，MVP 仅英文。使用 `proxy.ts`（Next.js 16 约定），`app/page.tsx` 提供 `/` 兜底路由                                              |
| D-003 | AI Tab 可见性 | 显示但禁用 + PRO 徽章；未登录弹登录、已登录未付费弹升级                                                                                                               |
| D-004 | Vercel        | 已上线，暂不提交 GSC（等 SEO 内容就绪后再提交）                                                                                                                       |

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

## SEO 规范

- 新增页面使用 `@gen-seo-page` 技能，自动覆盖 metadata/schema/sitemap/llms.txt
- Meta description ≤160 字符，所有用户可见文本从 `messages/en.json` 取，零硬编码
- 详细流程（JSON-LD 类型选择/hreflang/博客清单/sitemap 规则/`buildUrl`）见技能内嵌文档

## Git 操作陷阱

- **简单跨分支修改**：直接 `git checkout target-branch` 编辑提交，不要用 stash——stash 增加了不必要的复杂度，容易丢失工作区内容
- **`git reset --soft` 后 index 内有全部已暂存内容**：此时 `git add` 只是追加暂存，`git commit` 会包含所有已暂存文件，不是只有刚 `git add` 的那个。如需只提交单文件，先 `git restore --staged .` 清空暂存，再 `git add <file>`
- **同 commit 的两个分支间切换**：`git checkout` 会携带未提交的工作区变更（包括 index 和 working tree），注意分支隔离
- **简单场景**：不要用 stash/reset/rebase 等复杂操作，优先用直接编辑 + 提交
