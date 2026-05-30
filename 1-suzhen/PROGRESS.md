# 项目进度：Keyword Extractor Tool

## 项目概况

- **项目名称：** Keyword Extractor Tool
- **目标关键词：** `extract keywords` 及长尾词
- **项目类型：** 工具站（Freemium 模式）
- **创建日期：** 2026-05-28

---

## 进度记录

### 2026-05-28

#### ✅ 已完成

1. **关键词研究**
   - 数据收集：Semrush、Google Trends、Ahrefs、Google Keyword Planner
   - 数据分析：搜索量、KD、趋势、SERP
   - 结论：可以做，KD 11%，趋势回升

2. **竞品分析**
   - QuestionDB：AI 路线，Freemium 定价
   - Divhunt：API 路线，开发者向
   - Webaloha：传统工具 + 丰富 SEO 内容
   - 差异化机会：AI 提取、PDF 提取、YouTube 提取

3. **文档整理**
   - 创建项目文件夹
   - 保存关键词研究文档
   - 保存竞品分析文档

4. **项目基础信息**
   - 域名：extractkeywords.com ✅ 已购买
   - 品牌名：ExtractKeywords
   - 项目邮箱：support@extractkeywords.com

5. **技术栈选型**
   - 部署：Vercel
   - 框架：Next.js + Tailwind CSS
   - 认证：Clerk
   - 支付：Creem
   - 邮件：Resend
   - 数据库：Supabase
   - AI：DeepSeek / 阿里云

6. **网站结构设计**
   - 首页 + 功能落地页 + 博客
   - 必备页面：Privacy, Terms, Contact, Pricing
   - 内部链接策略

7. **GEO & AI SEO 策略**
   - Schema.org 结构化数据
   - AI 爬虫友好的 robots.txt
   - E-E-A-T 信号
   - 内容结构优化

#### ✅ 已完成（续）

8. **首页设计规格**
   - 工具页定位（非营销页）
   - H1 + 工具区 + SEO 内容区布局
   - Tab 切换：Text / URL / AI
   - 结果展示区设计
   - SEO 内容结构：How-to / Why / Use Cases / FAQ
   - 文档：`1-suzhen/HOMEPAGE-DESIGN.md`

9. **定价方案**
   - 单层定价：Free + Pro
   - 价格：$9.99/月，$99/年
   - 免费版：5000 字上限，不强制注册
   - AI 内部上限：2000 次/月（不告知用户）
   - 文档：`1-suzhen/PRICING.md`

10. **MVP 功能规格**
    - 文本提取、URL 提取、2词/3词短语
    - AI 语义提取（付费）
    - PDF/YouTube 提取（后期）
    - API 接口设计
    - 开发优先级划分
    - 文档：`1-suzhen/MVP-SPEC.md`

11. **开发任务拆分**
    - Phase 0: 项目初始化（5 个任务）
    - Phase 1: 核心功能（11 个任务）
    - Phase 2: 用户系统 + 支付（9 个任务）
    - Phase 3: SEO 内容（8 个任务）
    - Phase 4: 差异化功能（后期）
    - 数据库设计 + 验收标准
    - 文档：`../DEVELOPMENT-TASKS.md`

---

### 2026-05-29

#### ✅ 已完成

12. **UI 组件库选型**
    - 调研 Tailwind UI（付费）、HyperUI（免费）、shadcn/ui（免费）
    - 选择 HyperUI：免费、MIT 协议、覆盖 90% 组件需求
    - 文档：`1-suzhen/UI-COMPONENTS.md`
    - PRD 更新：技术栈添加 HyperUI

13. **Phase 0 项目初始化**（Claude Code 执行）
    - Next.js 16.2.6 + React 19.2 + Tailwind v4 + TypeScript（App Router、src 目录、Turbopack）
    - 实际版本说明：模板已升级到 Next 16，与 PRD 写的 14+ 相比有破坏性变化（Tailwind v4 CSS-first 配置、动态路由 `params` 为 Promise 等）
    - 安装运行时依赖：`@clerk/nextjs@^7.4.2`（注意：实际版本 7，PRD 写的 5 已过时）、`cheerio@^1.2.0`、`clsx@^2.1.1`、`tailwind-merge@^3.6.0`
    - 安装开发依赖：`prettier`、`prettier-plugin-tailwindcss`
    - 创建 `.env.example` 与 `.env.local`（Clerk / DeepSeek / Creem / Supabase / Resend / 应用 URL）
    - 整理 `.gitignore`（清掉 vim 状态栏污染段、保留 `.ccb/` `.clerk/` `.worktrees/` 等保护）
    - ESLint 忽略文档与 agent 沙箱目录
    - 建立目录骨架：`src/components/{ui,layout,extractor}` `src/lib` `src/types` `src/app/{pricing,privacy,terms}`
    - 通用工具：`src/lib/utils.ts`（cn 函数）、`src/types/index.ts`（共享类型）
    - 自检：`npm run dev` ✅、`npm run build` ✅、`npm run lint` ✅
    - 跳过：Task 0.4 Vercel 部署（需主人账号操作）

14. **基础架构 4 条关键决策**（主人 2026-05-29 拍板）

    | # | 议题 | 决策 | 关键影响 |
    |---|------|------|---------|
    | D-001 | 暗色模式 | 手动切换（class 策略） + 默认跟随系统 + 三态选择（亮/暗/系统） | 移除 `prefers-color-scheme` CSS、改用 Tailwind v4 `@custom-variant dark`、新增 ThemeProvider、Header 加切换按钮 |
    | D-002 | 多语言 | 装 `next-intl`、路由套 `/[locale]/`、MVP 只发布英文，预留法/西/阿拉伯语；阿拉伯语为 RTL，组件用 logical 属性 | 全站路由结构改造、组件用 `useTranslations`、Header 加语言切换、SEO 加 hreflang、Tailwind 类用 `ms-*/me-*` 替代 `ml-*/mr-*` |
    | D-003 | AI Tab 未登录可见性 | 显示但禁用 + PRO 徽章；点击未登录弹登录、登录但未付费弹升级 | 转化漏斗清晰、不烧 API 钱、Tabs 组件状态机简单 |
    | D-004 | Vercel 部署 | 已部署上线（域名 `extractkeywords.com` 在 Cloudflare 托管），暂不提交 GSC | Phase 2 的 Clerk/Creem 回调可直接用生产域名；GSC 等 SEO 内容齐再提交 |

15. **Phase 0 收尾**
    - Task 0.4 Vercel 部署 ✅（主人执行，已上线 `extractkeywords.com`）
    - 项目级 [CLAUDE.md](../CLAUDE.md) / [AGENTS.md](../AGENTS.md) 检视：仅保留 Next 16 警示
    - 全局 `~/.claude/CLAUDE.md` 主人已删除"亮暗模式硬约束"条款

#### 🔄 进行中

- 准备阶段：刷新策略文档（PRD / DEVELOPMENT-TASKS / UI-COMPONENTS / TECH-STACK / SITE-STRUCTURE / HOMEPAGE-DESIGN / MVP-SPEC），把 4 条决策与 Next 16 破坏性变更同步进去
- UI 设计：等品牌主色与 Logo 形式两项确认（已不再阻塞 AI Tab 决策）

#### 📋 待办

1. [x] 域名选择 → `extractkeywords.com` ✅
2. [x] 技术栈选择 → Next.js 16 + Tailwind v4 + Clerk 7 + Creem + next-intl ✅
3. [x] 网站结构设计 ✅
4. [x] 首页设计规格 ✅
5. [x] 定价方案 ✅
6. [x] MVP 功能详细规格 ✅
7. [x] 技术决策确认 ✅
8. [x] 开发任务拆分 ✅
9. [x] UI 组件库选型 → HyperUI ✅
10. [x] Claude Code 开发启动 → Phase 0 完成 ✅
11. [x] 基础架构 4 决策（暗色 / i18n / AI Tab / Vercel）✅
12. [x] Vercel 部署上线 ✅
13. [ ] 文档刷新（同步 4 条决策）
14. [ ] UI 设计（待定品牌主色 + Logo 形式）
15. [ ] Phase 1 启动（关键词提取算法）

---

## 项目决策记录

### 决策 1：选择 `extract keywords` 而非 `keyword extraction`

**原因：**
- `extract keywords` 搜索意图是"使用工具"
- `keyword extraction` 搜索意图是"学习/研究"
- 工具站更适合前者

**日期：** 2026-05-28

---

### 决策 2：采用 Freemium 模式

**免费版：**
- 词频统计
- 2-word/3-word 短语分析
- URL 输入

**付费版：**
- AI 提取
- PDF 提取
- YouTube 提取

**原因：**
- 免费版捕获流量
- 付费版差异化变现
- 成本可控（只有付费用户消耗 API）

**日期：** 2026-05-28

---

### 决策 3：暂停 niche-mining-pipeline 自动任务

**原因：** 专注关键词分析，避免干扰

**日期：** 2026-05-28

---

### 决策 4：MVP 技术决策

| 问题 | 决策 |
|-----|------|
| 语言支持 | 只做英语，不做中文分词 |
| AI 模型 | DeepSeek |
| Robots.txt | 遵守目标网站的 robots.txt |
| 免费版限制 | 未登录用户每日10次，注册后不限 |

**原因：**
- 英语分词简单（空格分隔），中文需要额外处理
- DeepSeek 成本低，性能好
- 遵守 robots.txt 避免法律风险和 IP 被封
- 注册后不限，降低用户抵触心理

**日期：** 2026-05-28

---

### 决策 5（D-001）：暗色模式 = class 切换 + 三态

**方案：** Tailwind v4 `@custom-variant dark (&:where(.dark, .dark *))`，由 ThemeProvider 把 `light` / `dark` / `system` 的最终结果写到 `<html class="dark">`。FOUC 用 `<script>` 内联预热（在 hydrate 前先打 class）。

**为什么：**
- 主人覆盖了原 CLAUDE.md 关于 `dark:` 前缀的硬约束，但保留"亮暗都要做"
- 工具站重度用户（SEO 从业者、夜间写稿）需要暗色
- `prefers-color-scheme` 单 media query 不支持用户主动覆盖偏好

**影响范围：**
- [src/app/globals.css](../src/app/globals.css) 重写 `@theme` + 加 `@custom-variant`
- 新增 `src/components/theme/theme-provider.tsx` + `theme-toggle.tsx`
- Header 增加亮暗切换按钮

**日期：** 2026-05-29

---

### 决策 6（D-002）：多语言 = next-intl + `[locale]` 路由 + RTL 预留

**方案：**
- 装 [`next-intl`](https://next-intl.dev/)（与 Next.js 官方文档推荐之一）
- 路由全部套 `/[locale]/...`，MVP 只发 `en`，但 `messages/{en,fr,es,ar}.json` 框架就绪
- Next.js 16 把 `middleware.ts` 改名 `proxy.ts`，next-intl 在 `proxy.ts` 里 `createMiddleware(routing)`
- 阿拉伯语 RTL：`<html dir>` 由 locale 决定，组件用 Tailwind 的 logical 属性 `ms-*/me-*/ps-*/pe-*` 而不是 `ml-*/mr-*`
- SEO：每个 locale 一份 metadata，`alternates.languages` 输出 hreflang

**为什么从原"30 行 helper"升级到 next-intl：**
- 主人明确"未来含阿拉伯语"，等同于"必须 RTL + 必须 ICU 复数/格式化"
- 自写 helper 撑不住 ICU 消息格式（复数、性别、日期）
- next-intl 与 App Router/Server Components 适配最稳

**关键风险记录：**
- SEO 关键词不能跨语言直译——西语 `extraer palabras clave` 与英语 `extract keywords` 是不同的搜索市场，KD/搜索量需重新调研。后期开非英语版本前，必须先做对应市场关键词研究。

**日期：** 2026-05-29

---

### 决策 7（D-003）：AI Tab 未登录显示但禁用

**方案：** Tabs 第三项 `<button disabled>` + 右上角 `PRO` 徽章。点击：
- 未登录 → 弹 Clerk 登录模态
- 已登录但未付费 → 弹 `/pricing` 升级模态
- 已付费 → 进入 AI 提取流程

**为什么：**
- SEO：搜 "ai keyword extractor" 进来的人能在落地页看到 AI 字样
- 成本：未登录不烧 DeepSeek API
- 转化：可见即承诺（Visible Promise），漏斗清晰

**日期：** 2026-05-29

---

### 决策 8（D-004）：Vercel 已上线，暂不提交 GSC

**现状：**
- 项目已部署到 Vercel
- 域名 `extractkeywords.com` 已在 Cloudflare 托管并指向 Vercel
- 未提交 Google Search Console

**为什么暂不交 GSC：**
- 当前页面还是 create-next-app 默认页，提交了反而被收录"空站"
- 等 Phase 3 SEO 内容齐了（首页 + 落地页 + 博客骨架）再提交

**日期：** 2026-05-29

---

## 关键数据速查

| 指标 | 数值 |
|-----|------|
| 月搜索量（主词） | 5,000 |
| KD 难度 | 11% |
| 所需外链 | 0 |
| CPC | $3.47 |
| 趋势 | 回升中 |

---

## 下次会议议题

- [x] 域名选择 → `extractkeywords.com` ✅ 已购买
- [x] 技术栈选择 → Next.js + Tailwind + Clerk + Creem + Resend + Supabase
- [x] 网站结构设计 ✅
- [x] GEO & AI SEO 策略 ✅
- [x] 首页设计细节 ✅
- [x] MVP 功能详细规格 ✅
- [x] 技术决策确认 ✅
- [x] 开发任务拆分 ✅
- [x] UI 组件库选型 → HyperUI ✅
- [x] Claude Code 开发启动 → Phase 0 ✅
- [x] 4 条基础架构决策（D-001 ~ D-004）✅
- [ ] 品牌主色（#2563eb 蓝 / #059669 绿 / 其他）
- [ ] Logo 形式（纯文字 / 文字 + 图标）
- [ ] Phase 1 启动节奏
