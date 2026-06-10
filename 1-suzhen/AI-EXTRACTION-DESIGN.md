# AI 提取功能设计方案

> 本文档整理 AI 语义提取功能的前端设计、后端规划与实现要点。

---

## 一、功能定位

| 对比项 | 普通提取 | AI 提取 |
|--------|----------|---------|
| **方法** | 词频统计 | 语义理解 |
| **结果** | 高频词 | 核心主题词 |
| **适用** | 长文本 | 中短文本（≤20,000 字符） |
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

**桌面端**：
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

**移动端**（< 640px）：
- 改为 stacked row 布局，每行显示一个关键词卡片
- 隐藏 Relevance 进度条，只保留数值
- 卡片结构：
```
┌─────────────────────────────┐
│ SEO services         [topic]│
│ Relevance: 0.95             │
└─────────────────────────────┘
```

**移动端 CSS**：
```css
@media (max-width: 640px) {
  .ai-results-table {
    display: none;
  }
  .ai-results-cards {
    display: block;
  }
  .ai-keyword-card {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 12px;
    margin-bottom: 8px;
  }
  .ai-keyword-card .keyword {
    font-weight: 600;
    font-size: 14px;
  }
  .ai-keyword-card .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 6px;
    font-size: 13px;
  }
}
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

### 3.4 权限控制（Gated Tab 模式）

**AI Tab 改为"可点击 gated tab"，不做 disabled 灰色锁定**：

| 用户状态 | 点击 AI Tab 行为 |
|----------|------------------|
| 未登录 | 弹出 Clerk 登录弹层 |
| 已登录 Free | 切换到 AI 面板，显示升级提示 + Pricing CTA |
| 已登录 Pro | 显示 AI 输入框和提取按钮，正常使用 |

**设计理由**：
- 比 disabled 更自然，不打断用户探索流程
- 更能转化 Pro（用户看到 AI 面板内容后再决定是否升级）

**AI 面板升级提示（Free 用户）**：
```
┌─────────────────────────────────────────┐
│  🔒 AI Semantic Extraction              │
│                                         │
│  Unlock AI-powered keyword extraction   │
│  with semantic understanding.           │
│                                         │
│  [Upgrade to Pro →]                     │
└─────────────────────────────────────────┘
```

### 3.5 加载状态

**普通提取**：spinner（现有）

**AI 提取**：spinner + 文字提示 "AI is analyzing..." + 三点跳动动画

### 3.6 配额提示

Pro 用户有月配额（2000 次），结果区底部显示：
```
✨ {count} AI extractions remaining this month
```

### 3.7 错误处理（不自动降级）

**AI 失败时明确提示，让用户自己选择**：

| 情况 | 处理 |
|------|------|
| AI 超时 | 提示 "AI extraction timed out. Please try again." + "Use basic extraction" 按钮 |
| AI 错误 | 提示 "AI extraction failed." + "Use basic extraction" 按钮 |
| 配额用尽 | 提示 "AI limit reached this month." |

**不静默降级**：AI 结果和普通词频结果本质不同，不能自动替换。提供 "Use basic extraction" 按钮让用户主动选择。

---

## 四、字符限制

| 功能 | Free | Pro |
|------|------|-----|
| Text/URL 提取 | 10,000 字符 | 50,000 字符 |
| AI 提取 | - | 20,000 字符（单独限制） |

**说明**：
- 50,000 字符 ≈ 7,500-10,000 words，覆盖长博客、落地页、报告章节
- AI 输入单独设 20,000，因 AI 成本和上下文更敏感
- AI 仅 Pro 可用

**需同步修改的文件**（实现时已同步为 50,000 字符）：

| 文件 | 修改内容 |
|------|----------|
| `src/lib/entitlements.ts` | 将 Pro 字符限制同步为 50,000 |
| `messages/en.json` | 更新字符限制相关的提示文案 |
| `DEVELOPMENT-TASKS.md` | 更新任务中的字符限制说明 |
| `src/app/[locale]/terms/page.tsx` | 更新 Terms 中的字符限制说明 |
| `src/app/[locale]/pricing/page.tsx` | 更新 Pricing 页面的字符限制展示 |
| `public/pricing.md` | 更新公开 pricing 文档 |
| `public/llms.txt` | 更新 LLM 可读的站点描述 |
| 相关测试文件 | 更新测试用例中的字符限制值 |

---

## 五、后端规划

### 5.1 AI 模型选择

来自 `MVP-SPEC.md`：
- **首选**：DeepSeek
- **备选**：阿里云通义千问

### 5.2 Prompt 设计

```
You are a keyword extraction expert. Extract the most important 
keywords and phrases from the following text. Focus on:

1. Main topics and themes
2. Industry-specific terms
3. Action words and concepts
4. Named entities (products, brands, etc.)

Return a JSON object with keywords sorted by relevance.
Maximum 20 keywords.

Text: {user_input}

Output format:
{
  "keywords": [
    {"keyword": "...", "relevance": 0.95, "category": "topic"},
    ...
  ]
}

Category must be one of: topic, service, industry, entity
Relevance must be between 0 and 1
```

**后端 Schema 校验**：
```typescript
const AI_KEYWORD_SCHEMA = z.object({
  keyword: z.string().min(1).max(100),
  relevance: z.number().min(0).max(1),
  category: z.enum(['topic', 'service', 'industry', 'entity']),
});

const AI_RESPONSE_SCHEMA = z.object({
  keywords: z.array(AI_KEYWORD_SCHEMA).max(20),
});
```

**校验规则**：
- 先 normalize 模型输出，再用 schema 校验，避免模型轻微格式偏差直接导致失败
- `keyword`：trim 后非空，最大 100 字符
- `relevance`：转换为数字后 clamp 到 0-1
- `category`：仅允许四个枚举值；其他值归一为 `topic`
- `keywords` 数组：去重后最多保留 20 个元素

### 5.3 API 设计

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
  ],
  "usage": {
    "remaining": 1847,
    "limit": 2000,
    "resetAt": "2026-07-01T00:00:00Z"
  }
}
```

**错误响应**：
```json
{
  "errorCode": "AI_LIMIT_REACHED",
  "error": "AI limit reached this month"
}
```

**处理流程**：
1. 检查用户登录状态
2. 检查用户订阅状态（Pro）
3. 原子 reserve AI 使用额度
4. 执行 AI 提取
5. 成功则保留额度消耗；失败或超时则 refund
6. 返回结果

### 5.4 性能指标

| 指标 | 目标 |
|------|------|
| 响应时间 | 3-5 秒 |
| 超时设置 | 15 秒 |
| 月配额 | 2,000 次（内部限制） |

### 5.4-A API 错误码

**新增错误码（纳入 `src/lib/api-errors.ts`）**：

| 错误码 | HTTP 状态 | 说明 |
|--------|-----------|------|
| `PRO_REQUIRED` | 403 | 需要 Pro 订阅才能使用 AI 功能 |
| `AI_LIMIT_REACHED` | 429 | 当月 AI 配额已用尽 |
| `AI_TIMEOUT` | 504 | AI 提取超时（15 秒） |
| `AI_FAILED` | 502 | AI 提取失败（模型错误） |
| `AI_CONFIG_MISSING` | 500 | AI 服务配置缺失（API Key 未配置） |

**前端错误码映射**：
```typescript
const AI_ERROR_TRANSLATION_KEYS: Record<AIAPIErrorCode, string> = {
  PRO_REQUIRED: 'errors.proRequired',
  AI_LIMIT_REACHED: 'errors.aiLimitReached',
  AI_TIMEOUT: 'errors.aiTimeout',
  AI_FAILED: 'errors.aiFailed',
  AI_CONFIG_MISSING: 'errors.aiConfigMissing',
};
```

### 5.5 AI 配额数据库

**新建 `ai_usage` 表**：

```sql
create table public.ai_usage (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  month text not null,  -- 格式: '2026-06'
  count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (clerk_user_id, month)
);

-- 索引
create index idx_ai_usage_user_month on public.ai_usage (clerk_user_id, month);
```

**配额逻辑**：
- AI 调用前先原子 reserve 1 次额度，避免并发请求同时通过检查后打爆模型成本
- AI 调用成功后保留本次消耗
- AI 调用失败（超时、模型错误、解析失败）后 refund 本次 reserve
- 每月 1 号重置（新建当月记录）

**并发安全**：
- 使用 Supabase RPC 或 SQL transaction 做原子 reserve/refund
- 避免"同时检查都有额度，最后超扣"的问题
- 行不存在时先 `insert ... on conflict do nothing`，再 `select ... for update`，避免并发首个请求撞唯一约束

**原子 reserve 示例（Supabase RPC）**：
```sql
create or replace function reserve_ai_usage(
  p_user_id text,
  p_month text
) returns json as $$
declare
  v_current_count integer;
  v_limit integer := 2000;
begin
  -- 确保当月记录存在；并发时由 unique(clerk_user_id, month) 兜底
  insert into ai_usage (clerk_user_id, month, count)
  values (p_user_id, p_month, 0)
  on conflict (clerk_user_id, month) do nothing;

  -- 获取当前计数（加锁）
  select count into v_current_count
  from ai_usage
  where clerk_user_id = p_user_id and month = p_month
  for update;

  -- 检查配额
  if v_current_count >= v_limit then
    return json_build_object('success', false, 'reason', 'limit_reached');
  end if;

  -- 原子 reserve
  update ai_usage
  set count = count + 1, updated_at = now()
  where clerk_user_id = p_user_id and month = p_month;

  return json_build_object(
    'success', true,
    'remaining', v_limit - v_current_count - 1
  );
end;
$$ language plpgsql;
```

**失败 refund 示例（Supabase RPC）**：
```sql
create or replace function refund_ai_usage(
  p_user_id text,
  p_month text
) returns void as $$
begin
  update ai_usage
  set count = greatest(count - 1, 0), updated_at = now()
  where clerk_user_id = p_user_id and month = p_month;
end;
$$ language plpgsql;
```

**审计表（建议 MVP 做）**：

```sql
create table public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null,
  created_at timestamptz not null default now(),
  status text not null,  -- 'success' | 'failed' | 'timeout'
  input_chars integer,
  keywords_count integer,
  error_message text
);
```

---

## 六、新增翻译 Key

文件：`messages/en.json`

翻译 key 不使用平铺结构，按现有 `useTranslations('home')` 习惯放入 `home.ai.*` 与 `home.errors.*`。具体结构见第七节“翻译结构建议”。

---

## 六-A、隐私与条款更新

**AI 功能涉及第三方数据处理，需更新以下文档**：

| 文件 | 更新内容 |
|------|----------|
| `src/app/[locale]/privacy/page.tsx` | 说明 AI 提取功能会将用户输入发送给第三方 AI provider（DeepSeek/通义千问），明确是否存储输入/结果 |
| `src/app/[locale]/terms/page.tsx` | 补充 AI 功能使用条款，包括配额限制、服务可用性免责 |
| `src/app/[locale]/pricing/page.tsx` | FAQ 中说明 AI 提取的隐私处理方式 |

**隐私声明要点**：
- 明确告知用户：AI 提取功能会将提交的文本发送给第三方 AI 服务提供商
- 数据存储策略：输入文本和提取结果是否存储、存储时长
- 第三方处理：列出 AI provider（DeepSeek/通义千问）及其隐私政策链接
- 用户控制：用户可选择使用普通提取（不发送给第三方 AI provider）而非 AI 提取

**建议文案**（Privacy 页面新增段落）：
```
AI Semantic Extraction: When you use our AI-powered keyword extraction 
feature, your submitted text is sent to our AI service provider 
(DeepSeek or Alibaba Tongyi Qianwen) for processing. We do not store 
your input text or extraction results after processing. You may choose
to use our basic extraction feature, which processes your text without
sending it to a third-party AI provider.
```

---

## 七、代码改动清单

| 文件 | 改动类型 | 说明 |
|------|----------|------|
| `src/components/extractor/ToolSection.tsx` | 修改 | AI Tab 激活逻辑、新结果表格、权限判断 |
| `src/app/globals.css` | 新增 | Relevance 进度条、Category pill、加载动画样式 |
| `messages/en.json` | 修改 | AI 相关翻译，建议放在 `home.ai.*` 与 `home.errors.*` |
| `.env.example` | 修改 | 新增 AI provider 配置示例 |
| `src/app/api/extract/ai/route.ts` | 新建 | AI 提取 API 端点 |
| `src/lib/ai-extractor.ts` | 新建 | AI 调用逻辑（DeepSeek/通义千问） |
| `supabase/ai-usage.sql` | 新建 | AI 配额数据库表 |

**环境变量**：
```bash
DEEPSEEK_API_KEY=
TONGYI_API_KEY=
AI_PROVIDER=deepseek
AI_REQUEST_TIMEOUT_MS=15000
AI_MONTHLY_LIMIT=2000
```

**翻译结构建议**：
```json
{
  "home": {
    "ai": {
      "relevance": "Relevance",
      "category": "Category",
      "quotaRemaining": "{count} AI extractions remaining this month",
      "analyzing": "AI is analyzing",
      "useBasicExtraction": "Use basic extraction",
      "unlockTitle": "AI Semantic Extraction",
      "unlockDesc": "Unlock AI-powered keyword extraction with semantic understanding.",
      "upgradeToPro": "Upgrade to Pro"
    },
    "errors": {
      "proRequired": "Pro is required to use AI extraction.",
      "aiLimitReached": "AI limit reached this month.",
      "aiTimeout": "AI extraction timed out. Please try again.",
      "aiFailed": "AI extraction failed.",
      "aiConfigMissing": "AI extraction is not configured yet."
    }
  }
}
```

---

## 八、参考资料

- `1-suzhen/MVP-SPEC.md` 第 285-367 行：AI 功能规划
- `1-suzhen/COMPETITOR-ANALYSIS.md`：QuestionDB AI Keyword Extractor 分析
- `DEVELOPMENT-TASKS.md` Task 2.4-2.5：AI 提取开发任务

---

## 九、更新日志

| 日期 | 说明 |
|------|------|
| 2026-06-09 | 初版，整理前端设计、后端规划、实现要点 |
| 2026-06-09 | 根据审核意见修订：字符限制、Gated Tab 模式、不自动降级、AI 配额数据库 |
| 2026-06-09 | 第二轮修订：修复"任意长度"矛盾、补充字符限制同步清单、隐私条款更新、并发安全原子扣减、API 配额返回、错误码定义、Prompt schema 校验、移动端表格设计 |
| 2026-06-09 | 第三轮修订：配额改为 reserve/refund，修复 RPC 并发空行问题，补充环境变量、翻译结构与隐私文案 |
