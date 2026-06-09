# AI 提取功能设计方案

> 本文档整理 AI 语义提取功能的前端设计、后端规划与实现要点。

---

## 一、功能定位

| 对比项 | 普通提取 | AI 提取 |
|--------|----------|---------|
| **方法** | 词频统计 | 语义理解 |
| **结果** | 高频词 | 核心主题词 |
| **适用** | 长文本 | 任意长度 |
| **速度** | < 1 秒 | 3-5 秒 |
| **权限** | 免费 | Pro 付费 |

**本质区别**：
- 普通提取：出现次数多 = 重要
- AI 提取：理解文本主题 = 重要

**示例**：
```
文本: "Our company provides SEO services including keyword research, 
       link building, and content optimization for small businesses."

普通提取: SEO (2), keyword (1), link (1), content (1), services (1)
AI 提取: SEO services (0.95, topic), keyword research (0.89, service), 
         link building (0.82, service), digital marketing (0.78, industry)
```

---

## 二、输出数据结构

### 普通提取（现有）

| 字段 | 说明 |
|------|------|
| Keyword | 关键词 |
| Count | 出现次数 |
| Density | 关键词密度 (%) |

### AI 提取（新增）

| 字段 | 说明 |
|------|------|
| Keyword | 关键词/短语 |
| Relevance | 语义相关性 (0-1) |
| Category | 分类标签 |

**Category 分类**：
- `topic` - 主题词
- `service` - 服务/功能词
- `industry` - 行业词
- `entity` - 实体（品牌、产品名等）

**JSON 格式**：
```json
{
  "keywords": [
    { "keyword": "SEO services", "relevance": 0.95, "category": "topic" },
    { "keyword": "keyword research", "relevance": 0.89, "category": "service" },
    { "keyword": "digital marketing", "relevance": 0.82, "category": "industry" }
  ]
}
```

---

## 三、前端设计

### 3.1 表格结构

```
┌─────────────────────────────────────────────────────┐
│  Keyword          Relevance         Category        │
├─────────────────────────────────────────────────────┤
│  SEO services     ████████░░ 0.95   [topic]         │
│  keyword research ███████░░░ 0.89   [service]       │
│  digital market   ██████░░░░ 0.82   [industry]      │
│  content optim    █████░░░░░ 0.75   [service]       │
│  small business   ████░░░░░░ 0.68   [entity]        │
└─────────────────────────────────────────────────────┘

          ✨ 1,847 AI extractions remaining this month
```

### 3.2 Relevance 进度条

**视觉效果**：横向进度条 + 数值，三档颜色

| 相关性 | 颜色 | 说明 |
|--------|------|------|
| > 0.8 | `var(--primary)` | 高相关性，深色 |
| 0.5 - 0.8 | `var(--accent)` | 中相关性 |
| < 0.5 | `var(--muted-foreground)` | 低相关性，浅色 |

**CSS 类名**：
- `.relevance-cell` - 单元格容器
- `.relevance-bar` - 进度条背景
- `.relevance-fill` - 进度条填充（`.high` / `.medium` / `.low`）
- `.relevance-value` - 数值文字

### 3.3 Category Pill

**视觉效果**：小圆角标签，不同 category 用不同颜色

| Category | 背景色 | 文字色 |
|----------|--------|--------|
| topic | primary 12% | primary |
| service | accent 15% | accent-foreground |
| industry | success 12% | success |
| entity | pro 12% | pro |

**CSS 类名**：
- `.category-pill` - 基础样式
- `.category-pill.topic` / `.service` / `.industry` / `.entity`

### 3.4 权限控制

**点击 AI Tab 时**：

| 用户状态 | 行为 |
|----------|------|
| 未登录 | 弹出 Clerk 登录框 |
| 已登录但 Free | 提示 "Upgrade to Pro" + 跳转 `/pricing` |
| Pro 用户 | 正常切换到 AI Tab |

**AI Tab 按钮状态**：
- Free/未登录：🔒 灰色 disabled + Pro badge
- Pro 用户：可点击，正常 Tab 样式

### 3.5 加载状态

**普通提取**：spinner（现有）

**AI 提取**：spinner + 文字提示 "AI is analyzing..." + 三点跳动动画

### 3.6 配额提示

Pro 用户有月配额（2000 次），结果区底部显示：
```
✨ {count} AI extractions remaining this month
```

### 3.7 错误降级

| 情况 | 处理 |
|------|------|
| AI 超时 | 提示 "AI extraction taking longer. Please try again." |
| AI 错误 | 降级到普通提取 + 提示 "AI unavailable, showing basic results" |
| 配额用尽 | 提示 "AI limit reached this month" |

---

## 四、后端规划

### 4.1 AI 模型选择

来自 `MVP-SPEC.md`：
- **首选**：DeepSeek
- **备选**：阿里云通义千问

### 4.2 Prompt 设计

```
You are a keyword extraction expert. Extract the most important 
keywords and phrases from the following text. Focus on:

1. Main topics and themes
2. Industry-specific terms
3. Action words and concepts
4. Named entities (products, brands, etc.)

Return a JSON array with keywords sorted by importance.
Maximum 20 keywords.

Text: {user_input}

Output format:
{
  "keywords": [
    {"keyword": "...", "relevance": 0.95, "category": "topic"},
    ...
  ]
}
```

### 4.3 API 设计

**端点**：`POST /api/extract/ai`

**请求体**：
```json
{
  "text": "用户输入文本"
}
```

**响应**：
```json
{
  "keywords": [
    { "keyword": "...", "relevance": 0.95, "category": "topic" }
  ]
}
```

**处理流程**：
1. 检查用户登录状态
2. 检查用户订阅状态（Pro）
3. 检查 AI 使用配额
4. 执行 AI 提取
5. 更新配额
6. 返回结果

### 4.4 性能指标

| 指标 | 目标 |
|------|------|
| 响应时间 | 3-5 秒 |
| 超时设置 | 15 秒 |
| 月配额 | 2000 次（内部限制） |

---

## 五、新增翻译 Key

文件：`messages/en.json`

```json
{
  "aiRelevance": "Relevance",
  "aiCategory": "Category",
  "aiCategoryTopic": "Topic",
  "aiCategoryService": "Service",
  "aiCategoryIndustry": "Industry",
  "aiCategoryEntity": "Entity",
  "aiQuotaRemaining": "{count} AI extractions remaining this month",
  "aiAnalyzing": "AI is analyzing",
  "aiUnavailable": "AI unavailable, showing basic results",
  "aiLimitReached": "AI limit reached this month",
  "aiTimeout": "AI extraction taking longer. Please try again."
}
```

---

## 六、代码改动清单

| 文件 | 改动类型 | 说明 |
|------|----------|------|
| `src/components/extractor/ToolSection.tsx` | 修改 | AI Tab 激活逻辑、新结果表格、权限判断 |
| `src/app/globals.css` | 新增 | Relevance 进度条、Category pill、加载动画样式 |
| `messages/en.json` | 新增 | AI 相关翻译 |
| `src/app/api/extract/ai/route.ts` | 新建 | AI 提取 API 端点 |
| `src/lib/ai-extractor.ts` | 新建 | AI 调用逻辑（DeepSeek/通义千问） |

---

## 七、参考资料

- `1-suzhen/MVP-SPEC.md` 第 285-367 行：AI 功能规划
- `1-suzhen/COMPETITOR-ANALYSIS.md`：QuestionDB AI Keyword Extractor 分析
- `DEVELOPMENT-TASKS.md` Task 2.4-2.5：AI 提取开发任务

---

## 八、更新日志

| 日期 | 说明 |
|------|------|
| 2026-06-09 | 初版，整理前端设计、后端规划、实现要点 |
