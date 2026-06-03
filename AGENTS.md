# ExtractKeywords

## Stack

- Next.js 16 App Router + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui v4 + HyperUI layout references
- next-intl, Clerk, Cheerio, Vitest
- Planned: DeepSeek AI, Supabase, Creem, Resend
- Deploy: Vercel, domain `extractkeywords.com`

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
- Root fallback: `src/app/page.tsx`
- Layout/i18n: `src/app/layout.tsx`, `src/app/[locale]/layout.tsx`, `src/proxy.ts`
- UI: `src/components/ui/`, `src/components/layout/`, `src/components/extractor/`, `src/components/seo/`, `src/components/theme/`
- Extraction backend: `src/lib/keyword-extractor.ts`, `src/lib/url-fetcher.ts`, `src/lib/robots-checker.ts`, `src/lib/rate-limiter.ts`
- API: `src/app/api/extract/text/route.ts`, `src/app/api/extract/url/route.ts`
- i18n text: `messages/en.json`
- Docs/plans: `PRD.md`, `DEVELOPMENT-TASKS.md`, `1-suzhen/`

## Project Rules

- 每次回复必须称呼用户为“主人”。
- UI/SEO/aria/metadata/Schema 文案必须来自 `messages/en.json`，不要硬编码用户可见文本。
- 涉及 UI/UX 改动必须用浏览器验证，优先 `agent-browser`。
- 不要改 `.opencode/*`、全局配置或无关 dirty files，除非用户明确要求。
- 用 `cn()` 合并动态 className，不要用模板字符串拼接 class。
- 组件用 logical spacing `ms-*` / `me-*`，预留 RTL。

## next-intl / Routing

- Next.js 16 用 `proxy.ts`，不要新增 `middleware.ts`。
- `/` 由 `app/page.tsx` 兜底；`/[locale]` 负责本地化首页。
- 不要在 `[locale]` 下创建 `en/` 文件夹。
- 非 locale 路径如 `/auth/*` 要在 proxy matcher 排除，并提供自己的 root layout。
- 拼本地化 URL 用 `buildUrl(locale, "/path")` from `@/lib/url`，不要手写 `/${locale}/path`。

## Theme / CSS

- Dark mode: `.dark` class + Tailwind v4 `@custom-variant dark`.
- FOUC 脚本放 `<head>` 内直接 `<script dangerouslySetInnerHTML>`。
- ThemeProvider 初始 state 固定为 `'system'`；localStorage 读取放 `useEffect`。
- 用户提供的 HTML 是视觉权威；CSS 变量按语义映射，不按名字硬翻。

## Tool UI Gotchas

- Tab 面板避免高度跳动：用 CSS Grid 同格叠放 + `visibility`，不要 `display: none/block`。
- `.tab-btn` 始终保留 `border: 1px solid transparent`；active 只改 `border-color`。
- 卡片内容居中用 `flex flex-col items-center text-center`，不要只写 `text-center`。

## SEO Rules

- 新页面需覆盖 metadata/schema/sitemap/llms.txt；meta description <=160 chars。
- 首页 SEO 内容不要写：TF-IDF, inverse document frequency, natural language processing, contextual relevance, semantic analysis。
- 正确免费算法描述：word frequency, stop-word filtering, keyword density, multi-word phrase detection (bigrams/trigrams)。
- AI 未上线时不要写：is available, is a Pro feature, will be available, AI Pro mode uses。
- 正确 AI 表述：planned as a Pro feature, for future release, planned for a future Pro plan which may require an account。
- 不要加 `WebSite SearchAction`，除非站内搜索真实存在。
- 不要放 `#` 作为 SEO 内链占位；不存在的落地页不要链接。

## URL Extraction

- URL fetcher must keep SSRF protections: only http/https, reject localhost/private IPs.
- robots.txt missing/fetch failed defaults allow; explicit Disallow blocks extraction.
- Fetch only HTML, cap response size, extract readable main/article/body text with Cheerio.
- API errors use `{ errorCode, error }`; frontend maps `errorCode` to i18n text.

## Testing

- Use Vitest for unit/API tests.
- For behavior changes, prefer TDD: write failing test, watch it fail, then implement.
- Final checks for code changes: `npm run test`, `npm run lint`, `npm run build`.
- UI changes additionally require browser validation with desktop/mobile checks.

## Common Recovery

- Turbopack/cache weirdness after layout/page moves: `rm -rf .next/cache`; severe cases `rm -rf .next`.
- `agent-browser screenshot [path]`; valid flags include `--full` and `--annotate`, not `--full-page` or `--viewport`.

## Git Safety

- Do not revert unrelated user changes.
- Prefer simple direct edits; avoid stash/reset/rebase unless necessary.
- After `git reset --soft`, clear staged files with `git restore --staged .` before staging a single-file commit.
