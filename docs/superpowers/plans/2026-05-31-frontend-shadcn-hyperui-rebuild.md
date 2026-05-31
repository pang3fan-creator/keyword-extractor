# 前端重建计划：HyperUI 布局 + shadcn/ui 交互

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** 用 HyperUI HTML 模式 + shadcn/ui React 组件重建前端，替换全部手写 Tailwind，达到设计 spec 要求的最高标准。

**Architecture:** shadcn/ui 负责所有交互组件（Button/Input/Tabs/Table 等，自带 Radix UI 无障碍），HyperUI 提供营销布局模式（Header/Footer/Steps/FAQ/CTA）。page.tsx 和 ToolSection.tsx 引用新组件，业务逻辑不变。

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, shadcn/ui v4 (Radix UI base), HyperUI HTML patterns, next-intl

**兼容性确认：**
- shadcn/ui v4 **官方支持 Tailwind v4 + React 19**（2025年3月正式发布）
- CSS 变量方案直接兼容我们已有的 `@import "tailwindcss"` + `@custom-variant dark` 架构
- 需要调整部分 CSS 变量命名以匹配 shadcn/ui 约定

---

## Phase 0: shadcn/ui 环境初始化

### Task 0.1: 安装 shadcn/ui 依赖 + 初始化 CLI

**背景：** 当前项目没有组件库。需要 `npx shadcn@latest init` 创建配置，生成 `components.json`。

**文件：**
- 修改：`src/app/globals.css`（注入 shadcn/ui CSS 变量体系）
- 修改：`package.json`（新增 radix-ui deps）
- 新增：`components.json`
- 新增：`src/lib/utils.ts` 更新（已有 cn 函数，shadcn 会复用）

**操作：**

```bash
# 1. 安装 class-variance-authority（shadcn Button 依赖）和 tw-animate-css
npm install class-variance-authority
npm install -D tw-animate-css

# 2. 运行 shadcn init（跳过已存在的文件确认）
npx shadcn@latest init \
  --template next \
  --preset nova \
  --css-variables \
  --yes \
  --force
```

init 后的关键变化：
- `components.json` 新增（配置 aliases、style、tailwind 选项）
- `src/app/globals.css` **会被覆盖**为 shadcn 的 CSS 变量模板 → **需要手工合并**我们的绿主题 + dark variant

### Task 0.2: 合并 globals.css — 绿主题 + shadcn 变量体系

**背景：** `npx shadcn init` 会覆盖 globals.css。需要把我们的品牌绿色 `--primary` 等变量移植进 shadcn 的变量命名体系。

**文件：** `src/app/globals.css`

**映射表：**

| 我们当前变量 | shadcn/ui 变量 | 值 |
|------------|---------------|-----|
| `--background` | `--background` | `hsl(0 0% 100%)` / `.dark: hsl(0 0% 10%)` |
| `--foreground` | `--foreground` | `hsl(0 0% 10%)` / `.dark: hsl(0 0% 98%)` |
| `--primary` | `--primary` | `hsl(163 94% 30%)` (绿色 #059669) |
| `--primary-fg` | `--primary-foreground` | `hsl(0 0% 100%)` 白字 |
| `--surface` | `--card` | `hsl(0 0% 96%)` / `.dark: hsl(0 0% 15%)` |
| `--muted` | `--muted` | 保持 |
| — | `--muted-foreground` | (新增) `hsl(0 0% 45%)` |
| — | `--secondary` | (新增) `hsl(0 0% 96%)` |
| — | `--secondary-foreground` | (新增) `hsl(0 0% 10%)` |
| — | `--accent` | (新增) `hsl(163 94% 95%)` |
| — | `--accent-foreground` | (新增) `hsl(163 94% 20%)` |
| `--border` | `--border` | 保持 |
| `--ring` | `--ring` | 保持 `--primary` |
| `--radius` | `--radius` | `0.5rem` |

**最终 globals.css 结构：**

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(0 0% 10%);
  --card: hsl(0 0% 97%);
  --card-foreground: hsl(0 0% 10%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(0 0% 10%);
  --primary: hsl(163 94% 30%);
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(0 0% 96%);
  --secondary-foreground: hsl(0 0% 10%);
  --muted: hsl(0 0% 96%);
  --muted-foreground: hsl(0 0% 45%);
  --accent: hsl(163 94% 95%);
  --accent-foreground: hsl(163 94% 20%);
  --destructive: hsl(0 84% 60%);
  --destructive-foreground: hsl(0 0% 98%);
  --border: hsl(0 0% 90%);
  --input: hsl(0 0% 90%);
  --ring: hsl(163 94% 30%);
  --radius: 0.5rem;
  --sidebar-background: hsl(0 0% 98%);
  --sidebar-foreground: hsl(240 5% 26%);
  --sidebar-primary: hsl(240 6% 10%);
  --sidebar-primary-foreground: hsl(0 0% 98%);
  --sidebar-accent: hsl(240 5% 96%);
  --sidebar-accent-foreground: hsl(240 6% 10%);
  --sidebar-border: hsl(220 13% 91%);
  --sidebar-ring: hsl(217 91% 60%);
}

.dark {
  --background: hsl(0 0% 10%);
  --foreground: hsl(0 0% 98%);
  --card: hsl(0 0% 15%);
  --card-foreground: hsl(0 0% 98%);
  --popover: hsl(0 0% 10%);
  --popover-foreground: hsl(0 0% 98%);
  --primary: hsl(163 94% 30%);
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(0 0% 15%);
  --secondary-foreground: hsl(0 0% 98%);
  --muted: hsl(0 0% 20%);
  --muted-foreground: hsl(0 0% 63%);
  --accent: hsl(163 94% 15%);
  --accent-foreground: hsl(163 94% 80%);
  --destructive: hsl(0 62% 40%);
  --destructive-foreground: hsl(0 0% 98%);
  --border: hsl(0 0% 20%);
  --input: hsl(0 0% 20%);
  --ring: hsl(163 94% 30%);
  --sidebar-background: hsl(240 6% 10%);
  --sidebar-foreground: hsl(240 5% 84%);
  --sidebar-primary: hsl(0 0% 98%);
  --sidebar-primary-foreground: hsl(240 6% 10%);
  --sidebar-accent: hsl(240 4% 16%);
  --sidebar-accent-foreground: hsl(240 5% 84%);
  --sidebar-border: hsl(240 4% 16%);
  --sidebar-ring: hsl(217 91% 60%);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-sidebar-background: var(--sidebar-background);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}
```

**验证：** `npm run build` 通过，CSS 变量全部生效，暗色模式切换正常。

### Task 0.3: 安装 shadcn/ui 组件

```bash
npx shadcn@latest add button --yes
npx shadcn@latest add input --yes
npx shadcn@latest add textarea --yes
npx shadcn@latest add tabs --yes
npx shadcn@latest add table --yes
```

输出文件：
- `src/components/ui/button.tsx`（覆盖我们的）
- `src/components/ui/input.tsx`（覆盖）
- `src/components/ui/textarea.tsx`（新增）
- `src/components/ui/tabs.tsx`（覆盖）
- `src/components/ui/table.tsx`（覆盖）

**验证：** import 所有新组件，无 TypeScript 错误。

---

## Phase 1: 适配 shadcn/ui 组件

### Task 1.1: 适配 Button 组件

**文件：** `src/components/ui/button.tsx`（由 shadcn 生成，覆盖手写版）

shadcn 的 Button：
- variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
- sizes: `default`, `xs`, `sm`, `lg`, `icon`
- 自带 `asChild` prop（配合 Radix Slot，支持作为 `<Link>` 渲染）

**迁移要点：** 当前代码中所有 `<Button variant="primary">` → `<Button>`（shadcn default 就是 primary），`<Button variant="outline">` → `<Button variant="outline">`。`size="sm"` → `size="sm"`（兼容）。

**改动范围：**
- `src/components/extractor/ToolSection.tsx` — 按钮 variant 改名
- `src/app/[locale]/page.tsx` — CTA 按钮
- `src/components/layout/Header.tsx` — Login 按钮

### Task 1.2: 适配 Input 组件

**文件：** `src/components/ui/input.tsx`（shadcn 覆盖）

shadcn 的 Input 不含 `error` prop。需要在上层包裹处理：
- `ToolSection.tsx` URL 输入的 error 态：用 wrapper div + 额外 className 实现红色边框

**改动：** `ToolSection.tsx` 中 URL Input 的 error 态改为条件 className。

### Task 1.3: 适配 Tabs 组件

**文件：** `src/components/ui/tabs.tsx`（shadcn 覆盖）

shadcn 的 Tabs 基于 Radix：`<Tabs>` + `<TabsList>` + `<TabsTrigger>` + `<TabsContent>`。

与当前 API 差异：
- 当前：`<Tabs tabs={[...]} defaultTab="text" />`（配置式）
- shadcn：`<Tabs defaultValue="text"><TabsList>...</TabsList></Tabs>`（组合式）

**迁移策略：** 保留一个薄的封装层（`src/components/extractor/ExtractorTabs.tsx`），内部用 shadcn Tabs 实现，保持现有 ToolSection 的调用方式基本不变。

```tsx
// ExtractorTabs.tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export function ExtractorTabs({ tabs, defaultValue }: ...) {
  return (
    <Tabs defaultValue={defaultValue}>
      <TabsList className="w-full flex-col sm:flex-row">
        {tabs.map(tab => (
          <TabsTrigger key={tab.id} value={tab.id} disabled={tab.disabled}>
            {tab.label}
            {tab.badge && <Badge>{tab.badge}</Badge>}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(tab => (
        <TabsContent key={tab.id} value={tab.id}>{tab.content}</TabsContent>
      ))}
    </Tabs>
  );
}
```

**改动文件：**
- `src/components/extractor/ToolSection.tsx` — 用 ExtractorTabs 替换当前 Tabs
- `src/components/extractor/ExtractorTabs.tsx` — 新增薄封装

### Task 1.4: 适配 Table 组件

**文件：** `src/components/ui/table.tsx`（shadcn 覆盖）

shadcn Table：`<Table>` + `<TableHeader>` + `<TableBody>` + `<TableRow>` + `<TableHead>` + `<TableCell>` + `<TableCaption>`

与当前差异：命名从 `Tr`/`Td`/`Th` 改为 `TableRow`/`TableCell`/`TableHead`。

**改动：** `ToolSection.tsx` 中结果表格的 Tr/Td/Th 改为 shadcn 名称。

---

## Phase 2: HyperUI 布局组件

### Task 2.1: Header — HyperUI 营销导航栏

**参考：** HyperUI Headers 组件 #2（简洁 Logo + 导航 + CTA）

**文件：** `src/components/layout/Header.tsx`

替换为 HyperUI 风格的 sticky header：左侧 text Logo（已实现），右侧 Pricing 链接 + Login 按钮 + ThemeToggle。基本结构已接近 HyperUI，主要调整：
- Log-in 按钮改用 shadcn `<Button variant="secondary" size="sm">`
- 导航链接间距微调
- 移动端：下一步规划汉堡菜单（本次暂不做，单独任务）

### Task 2.2: Footer — HyperUI 三列页脚

**参考：** HyperUI Footers 组件 #1（品牌 + 三列链接 + 版权）

**文件：** `src/components/layout/Footer.tsx`

当前 Footer 已接近 HyperUI 三列模式。调整：
- 品牌区使用更大的字体权重
- 链接 hover 态微调
- 版权行加 border-t 分隔

### Task 2.3: Steps — HyperUI 步骤指示器

**参考：** HyperUI Steps 组件 #4（编号圆圈 + 连接线 + 标题描述）

**文件：** `src/app/[locale]/page.tsx`

当前已实现连接线版本。对照 HyperUI HTML 片段微调：
- 圆圈尺寸和对齐
- 连接线颜色（HyperUI 用渐变灰）
- 响应式：移动端垂直堆叠

### Task 2.4: FAQ — 改用 shadcn Accordion

**文件：** `src/components/seo/FaqSection.tsx`

HyperUI FAQ 本质是 accordion。直接用 **shadcn Accordion**（基于 Radix）替代，获得：键盘导航、无障碍、平滑动画。

```bash
npx shadcn@latest add accordion --yes
```

重写 FaqSection.tsx 使用：
```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export function FaqSection() {
  const t = useTranslations('home');
  return (
    <Accordion type="single" collapsible>
      {[1,2,3,4,5,6].map(i => (
        <AccordionItem key={i} value={`faq-${i}`}>
          <AccordionTrigger>{t(`seoFaq${i}Q` as never)}</AccordionTrigger>
          <AccordionContent>{t(`seoFaq${i}A` as never)}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
```

### Task 2.5: CTA — HyperUI CTA 区块

**参考：** HyperUI CTAs 组件 #1

**文件：** `src/app/[locale]/page.tsx`

当前 CTA 已接近 HyperUI 模式。微调：按钮用 shadcn `<Button size="lg">`。

---

## Phase 3: 整合 & QA

### Task 3.1: 全量构建验证

```bash
rm -rf .next && npm run build
```

Expected: 无 TypeScript 错误，无 CSS 变量缺失警告，所有路由正常。

### Task 3.2: Lint 验证

```bash
npm run lint
```

### Task 3.3: 视觉回归测试（暗色 + 亮色）

```bash
npm run dev
agent-browser open http://localhost:3000
agent-browser snapshot -i  # 验证布局完整
```

切换暗色模式验证。

### Task 3.4: 移除旧组件 + 清理

删除不再需要的文件：
- 旧的手写 Tabs / Table / Button / Input 组件（已被 shadcn 覆盖）
- `src/components/theme/ThemeToggle.tsx` — 确认与 shadcn 暗色模式兼容（不需要 next-themes，我们已有 ThemeProvider）

### Task 3.5: 更新 AGENTS.md

记录新架构：shadcn/ui + HyperUI 技术栈，组件来源，CSS 变量规范。

---

## 影响范围总览

| 文件 | 操作 | 风险 |
|------|------|------|
| `src/app/globals.css` | 重写为 shadcn + 绿主题变量 | ⚠️ 高 — 所有组件依赖此文件 |
| `components.json` | 新增 shadcn 配置 | 低 |
| `src/components/ui/button.tsx` | shadcn 覆盖 | 中 — 下游所有 Button 引用 |
| `src/components/ui/input.tsx` | shadcn 覆盖 | 中 |
| `src/components/ui/tabs.tsx` | shadcn 覆盖 | ⚠️ 高 — API 完全不同 |
| `src/components/ui/table.tsx` | shadcn 覆盖 | 中 — 命名变更 |
| `src/components/ui/textarea.tsx` | shadcn 新增 | 低 |
| `src/components/ui/accordion.tsx` | shadcn 新增 | 低 |
| `src/components/seo/FaqSection.tsx` | 重写为 shadcn Accordion | 低 |
| `src/components/extractor/ToolSection.tsx` | 适配新组件 | ⚠️ 高 — 核心业务组件 |
| `src/components/extractor/ExtractorTabs.tsx` | 新增 shadcn Tabs 封装 | 低 |
| `src/components/layout/Header.tsx` | HyperUI 微调 | 低 |
| `src/components/layout/Footer.tsx` | HyperUI 微调 | 低 |
| `src/app/[locale]/page.tsx` | CTA/Steps 微调 | 低 |
| `messages/en.json` | **不变** | — |

---

## 预估工时

| Phase | 内容 | 预计 |
|-------|------|------|
| Phase 0 | shadcn 初始化 + CSS 合并 | 1h |
| Phase 1 | 适配 shadcn 组件 | 2h |
| Phase 2 | HyperUI 布局组件 | 1.5h |
| Phase 3 | 整合 QA + 清理 | 0.5h |
| **总计** | | **~5h** |
