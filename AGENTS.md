# ExtractKeywords

## Stack

- `Next.js 16 App Router` + `React 19` + `TypeScript`
- `Tailwind CSS v4` + `shadcn/ui v4` + `HyperUI layout references` + `lucide`
- next-intl, Cheerio, Vitest
- Planned: DeepSeek AI
- Billing/storage: Clerk + Creem + Supabase
- Deploy: Vercel, domain `extractkeywords.com`
- Resend

## Commands

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run test
```

- Dev server may already occupy 3000/3001; use `pkill -f "next dev"` only when needed.
- `npm run lint` may report unrelated `.opencode/plugins/auto-lint.js` warnings.

## Key Paths

- Home: `src/app/[locale]/page.tsx`
- About: `src/app/[locale]/about/page.tsx`
- Pricing: `src/app/[locale]/pricing/page.tsx`
- Privacy: `src/app/[locale]/privacy/page.tsx`
- Terms: `src/app/[locale]/terms/page.tsx`
- 404: `src/app/not-found.tsx`
- Layout/i18n: `src/app/layout.tsx`, `src/app/[locale]/layout.tsx`, `src/proxy.ts`
- UI: `src/components/ui/`, `src/components/layout/`, `src/components/extractor/`, `src/components/seo/`, `src/components/theme/`
- Breadcrumb UI: `src/components/layout/Breadcrumbs.tsx`
- Schema helpers: `src/lib/schema.ts`
- Extraction backend: `src/lib/keyword-extractor.ts`, `src/lib/url-fetcher.ts`, `src/lib/robots-checker.ts`, `src/lib/rate-limiter.ts`
- API: `src/app/api/extract/text/route.ts`, `src/app/api/extract/url/route.ts`
- Billing: `src/components/billing/`, `src/app/api/billing/*`, `src/app/api/webhook/creem`, `src/lib/{creem,subscription,supabase-admin}.ts`, `supabase/*.sql`
- i18n text: `messages/en.json`
- Docs/plans: `PRD.md`, `DEVELOPMENT-TASKS.md`, `1-suzhen/`
- Public: `public/pricing.md`, `public/llms.txt`

## Project Rules

- 每次回复必须称呼用户为“主人”。
- UI/SEO/aria/metadata/Schema 文案必须来自 `messages/en.json`，不要硬编码用户可见文本。
- 涉及 UI/UX 改动必须用浏览器验证，优先 `agent-browser`。
- 不要改 `.opencode/*`、全局配置或无关 dirty files，除非用户明确要求。
- 不要改 `.ccb/*` 缓存/代理状态目录；其中的 AGENTS.md 不是本项目上下文。
- 用 `cn()` 合并动态 className，不要用模板字符串拼接 class。
- 组件用 logical spacing `ms-*` / `me-*`，预留 RTL。

## Environment

- Clerk auth requires `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`.
- Clerk local login requires matching publishable/secret keys; mismatches can cause session refresh redirect loops.
- Billing env vars: `CREEM_API_KEY`, `CREEM_WEBHOOK_SECRET`, `CREEM_PRO_MONTHLY_PRODUCT_ID`, `CREEM_PRO_YEARLY_PRODUCT_ID`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL`; document in `.env.example`, do not edit real `.env*`.
- Production persistent rate limiting uses `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`; missing values fall back to memory.

## next-intl / Routing

- Next.js 16 用 `proxy.ts`，不要新增 `middleware.ts`。
- `localePrefix: 'as-needed'` 下 `/` 即默认 locale，由 `[locale]/page.tsx` 直接处理，不要新增 `app/page.tsx`。
- 不要在 `[locale]` 下创建 `en/` 文件夹。
- 非 locale 路径如 `/auth/*` 要在 proxy matcher 排除，并提供自己的 root layout。
- 拼本地化 URL 用 `buildUrl(locale, "/path")` from `@/lib/url`，不要手写 `/${locale}/path`。

## 常见坑

- JSON 编辑后验证: `python3 -m json.tool messages/en.json`；大量嵌套数组/对象替换易遗留 orphan data
- `.privacy-*` CSS 在 Privacy/Terms 两页的 inline `<style>` 中各有一份，改一处记得同步另一处
- Home active 逻辑: `item.href === '/' ? pathname === '/' : pathname.endsWith(item.href)`；不要用 `CENTER_LINKS.some()` 方式
- `seo-insight-block` 已全局废弃（CSS/组件/翻译全删），改用普通 `<p>` + Tailwind
- 所有 `#fff` 必须用 `var(--primary-foreground)`；出现邮箱必须 `mailto:` 链接
- Login/Signup 由 Clerk `useAuth().isLoaded`/`isSignedIn` 控制；Pricing checkout signed-out opens Clerk auth, signed-in creates Creem checkout, active Pro returns `ALREADY_SUBSCRIBED`.
- Visible breadcrumbs: use `src/components/layout/Breadcrumbs.tsx`; non-home pages show `Home / Current`, root `/` does not.
- Breadcrumb UI must stay in sync with `createBreadcrumbList()` JSON-LD; keep one `application/ld+json` script per page.
- Billing lives in Clerk `UserButton.UserProfilePage`; do not use `UserButton.Link` or recreate `/account` for billing UI.
- `/account` should 404; Creem checkout success redirects to `/pricing?checkout=success`.
- Creem webhook path is singular `/api/webhook/creem`; do not add `/api/webhooks/creem`.
- `subscriptions` stores one current row per `clerk_user_id`; webhook history belongs in `payment_events`.

## 页面布局模式

- Document 页 (Privacy/Terms): `.privacy-card` layout + 内联 `<style>` 块
- Marketing 页 (About): homepage 风格，`seo-section` / `hero` 布局，无内联样式

## 页面底部 CTA

- 营销页底部 CTA 跟随首页 `bottom-cta` 模板: `<div className="bottom-cta"><Link href="...">text</Link><p className="text-muted-foreground mt-4 text-center text-xs">date</p></div>` — 只有链接+日期，不要另加 h2/button。

## HTML 设计稿

- 用户的设计稿放在 `2-gitignore/设计UI/` 目录，写页面前必须先读取设计稿
- HTML 设计稿是视觉权威；先理解设计才能写代码

## 状态/逻辑模式

- 禁止用展示文案驱动逻辑（如 `str === 'Coming soon'`、`includes('(planned)')`）。用代码常量/查询表驱动，翻译文件只放展示文本

## Design System

- `.interface-design/system.md` 为唯一设计系统参考。
- Table: th/td 必须 `font-size: 13px` + `font-family: var(--font-mono)`; wrapper `border-radius: var(--radius)` (10px); corner radii 同步 wrapper.
- h2 (seo): `text-[24px] font-bold tracking-[-0.03em]`，不要 28px.
- Content widths: `max-w-[960px]` (tool/SEO), `max-w-[880px]` (doc pages), `max-w-[640px]` (insight block). 新增 container 优先用这些值.

## Theme / CSS

- Dark mode: `.dark` class + Tailwind v4 `@custom-variant dark`.
- FOUC 脚本放 `<head>` 内直接 `<script dangerouslySetInnerHTML>`。
- ThemeProvider 初始 state 固定为 `'system'`；localStorage 读取放 `useEffect`。
- 用户提供的 HTML 是视觉权威；CSS 变量按语义映射，不按名字硬翻。
- HTML design drafts are visual authority: extract and preserve layout CSS values before translating to React/Tailwind.

## Tool UI Gotchas

- Tab 面板避免高度跳动：用 CSS Grid 同格叠放 + `visibility`，不要 `display: none/block`。
- `.tab-btn` 始终保留 `border: 1px solid transparent`；active 只改 `border-color`。
- 卡片内容居中用 `flex flex-col items-center text-center`，不要只写 `text-center`。

## CSS 陷阱

- `globals.css` 中无 `@layer` 包裹的规则（如 `a { color: var(--primary); }`）优先级高于 Tailwind `@layer utilities`，会覆盖 `text-*` 类。用内联 `style={}` 兜底。
- Tailwind spacing utilities can be overridden by unlayered `globals.css` reset; verify computed padding/margins, use scoped classes when exact HTML CSS must survive.
- When migrating HTML mockups, do not replace native tables/forms with shadcn components unless browser screenshots confirm matching behavior.
- For HTML-to-Next UI migrations, validate desktop/mobile screenshots plus computed styles for key spacing (`padding`, `margin`, `width`, `border-radius`).

## 404 / not-found

- Root `not-found.tsx` 不在 `NextIntlClientProvider` 内，client 子组件不能用 `useTranslations()` → 用 prop 传 label。

## SEO Rules

- 新页面需覆盖 metadata/schema/sitemap/llms.txt；meta description <=160 chars。
- 首页 SEO 内容不要写：TF-IDF, inverse document frequency, natural language processing, contextual relevance, semantic analysis。
- 正确免费算法描述：word frequency, stop-word filtering, keyword density, multi-word phrase detection (bigrams/trigrams)。
- AI 未上线时不要写：is available, is a Pro feature, will be available, AI Pro mode uses。
- 正确 AI 表述：planned as a Pro feature, for future release, planned for a future Pro plan which may require an account。
- 不要加 `WebSite SearchAction`，除非站内搜索真实存在。
- 不要放 `#` 作为 SEO 内链占位；不存在的落地页不要链接。
- Schema helpers live in `src/lib/schema.ts`; use `createJsonLdGraph()` / `createBreadcrumbList()` instead of hand-rolling page schema wrappers.

## Meta Title Length

- Root layout `title.template: '%s | ExtractKeywords'` adds 18 chars. Keep page meta title ≤ 41 chars so rendered ≤ 60 chars (Google display limit).

## URL Extraction

- URL fetcher must keep SSRF protections: only http/https, reject localhost/private IPs.
- robots.txt missing/fetch failed defaults allow; explicit Disallow blocks extraction.
- Fetch only HTML, cap response size, extract readable main/article/body text with Cheerio.
- API errors use `{ errorCode, error }`; frontend maps `errorCode` to i18n text.
- Rate limiting uses async `checkRateLimit()` with Upstash REST env fallback: `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`; missing or failing Redis falls back to memory.

## Testing

- Use Vitest for unit/API tests.
- For behavior changes, prefer TDD: write failing test, watch it fail, then implement.
- Final checks for code changes: `npm run test`, `npm run lint`, `npm run build`.
- Payment checks: `npm run test -- src/app/api/billing/checkout/route.test.ts src/app/api/webhook/creem/route.test.ts src/lib/subscription.test.ts src/lib/creem.test.ts`.
- UI changes additionally require browser validation with desktop/mobile checks.

## Common Recovery

- Turbopack/cache weirdness after layout/page moves: `rm -rf .next/cache`; severe cases `rm -rf .next`.
- `agent-browser screenshot [path]`; valid flags include `--full` and `--annotate`, not `--full-page` or `--viewport`.
- `npx playwright screenshot --viewport-size=390,844 URL file.png` works for viewport screenshots; `require('playwright')` may fail if not installed locally.
- `agent-browser click` 不总是触发 React 合成事件。对 React `onClick` handler 改用 `agent-browser focus` + `agent-browser press Enter`。
- If `agent-browser` is unavailable inside shell loops, set `AB=$(command -v agent-browser)` first and call `$AB ...`.

## Git Safety

- Do not revert unrelated user changes.
- Prefer simple direct edits; avoid stash/reset/rebase unless necessary.
- After `git reset --soft`, clear staged files with `git restore --staged .` before staging a single-file commit.
