# Pricing 定价页面

> 合并自 `PRICING.md`（定价方案） + `pricing-task.md`（定价页开发任务）
> 创建日期：2026-06-09

---

## 一、定价方案

### 1.1 定价层级

**单层定价（MVP 阶段）：** 先上线单一 Pro 套餐，简化决策流程。后续根据数据再考虑是否增加层级。

| 套餐 | 价格 | 结算周期 |
|-----|------|---------|
| Free | $0 | 永久免费 |
| Pro | $9.99/月 | 按月订阅 |
| Pro | $99/年 | 年付（省 $20，≈$8.25/月） |

### 1.2 定价决策记录

| 决策 | 理由 | 日期 |
|-----|------|------|
| 单层定价 | 简化决策，先验证需求 | 2026-05-28 |
| $9.99/月 | 心理舒适区，低于 $10 | 2026-05-28 |
| $99/年 | 相当于 $8.25/月，促进年付 | 2026-05-28 |
| 免费版 10,000 字 | 覆盖 95% 用例，避免滥用 | 2026-05-28 |
| 不强制注册 | 降低门槛，提升试用率 | 2026-05-28 |
| AI 内部上限 | 控制成本，不让用户焦虑 | 2026-05-28 |

---

## 二、功能矩阵

| 功能 | Free | Pro |
|------|------|-----|
| Text 关键词提取 | ✅ | ✅ |
| URL 关键词提取 | ✅ | ✅ |
| 2词/3词短语 | ✅ | ✅ |
| CSV 导出 / 复制 | ✅ | ✅ |
| 单次输入上限 | ⚠️ 10,000 字符 | 🔓 无限 |
| AI 语义提取 | ❌ | ✨ DeepSeek |
| PDF 提取 | ❌ | 📄 |
| YouTube 提取 | ❌ | 🎬 |
| 30天提取历史 | ❌ | 📜 |
| 优先支持 | ❌ | ⚡ |

---

## 三、免费版规则

### 3.1 字数限制

| 项目 | 限制 |
|-----|------|
| 单次输入上限 | 10,000 字符 |
| 超限提示 | "Your text exceeds 10,000 characters. Upgrade to Pro for unlimited extraction." |

### 3.2 注册要求

- **不强制注册**
- 用户可直接使用工具
- 当前免费版不做注册拦截或邮箱收集

### 3.3 使用限制

| 项目 | 限制 |
|-----|------|
| 每日请求次数 | 每 IP 每日 50 次（MVP 内存限流） |
| URL 抓取范围 | 仅支持公开可访问的 HTML 页面 |
| URL 抓取限制 | 遵守 robots.txt，拒绝 localhost / 私网地址 |

---

## 四、Pro 版规则

### 4.1 Pro 权益

| 权益 | 说明 |
|-----|------|
| 无限字数 | 无单次输入限制 |
| AI 语义提取 | DeepSeek 驱动，月上限 2000 次（内部限制） |
| PDF 提取 | 上传 PDF 提取关键词 |
| YouTube 提取 | 从视频描述和字幕提取关键词 |
| 提取历史 | 30 天历史记录 |
| 优先支持 | 优先响应客服请求 |

### 4.2 AI 提取限制（内部，不告知用户）

- 月上限：2000 次（足够覆盖 99% 用户）
- 超限后：降级到普通提取 + 提示 "AI limit reached this month"

### 4.3 成本测算

| 项目 | 值 |
|-----|------|
| 单次 DeepSeek 调用成本 | ≈ $0.0004 |
| 月上限 2000 次成本 | ≈ $0.8 |
| 售价 | $9.99 |
| 利润率 | > 90% |

### 4.4 订阅管理

- 月付：随时取消，下月不再续费
- 年付：随时取消，剩余时间可用至年末
- 退款政策：7 天无理由退款

---

## 五、支付集成

| 项目 | 详情 |
|-----|------|
| 支付网关 | **Creem**（已选定） |
| 支持卡种 | Visa, MasterCard, Amex |
| 可选方式 | PayPal |
| 货币 | USD（后续可考虑 EUR, GBP） |
| 认证 | Clerk（已接入） |
| 数据库 | Supabase（`subscriptions` 表已设计） |

### 5.1 数据库表

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  plan TEXT CHECK (plan IN ('free', 'pro')),
  status TEXT CHECK (status IN ('active', 'canceled', 'expired')),
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ai_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  month TEXT NOT NULL,
  count INTEGER DEFAULT 0,
  UNIQUE(user_id, month)
);
```

---

## 六、未来考虑（暂不实现）

### 6.1 双层定价

如果数据显示需要：

| 套餐 | 价格 | 差异 |
|-----|------|------|
| Pro Basic | $9.99/月 | AI 100 次/月 |
| Pro Unlimited | $29.99/月 | AI 无限 |

### 6.2 团队套餐

- 多用户协作
- 共享提取历史
- API 访问

---

## 七、页面开发任务

### 7.1 页面基础

| 属性 | 值 |
|------|-----|
| 路径 | `/pricing` |
| 路由 | `src/app/[locale]/pricing/page.tsx` |
| 设计风格 | Marketing 页风格（参照 About 页），非 Document 页 |
| Metadata title | Pricing · ExtractKeywords — Simple, Transparent Pricing |
| Metadata description | ExtractKeywords pricing: free and Pro plans. Start with no signup required. Upgrade when you need unlimited extraction and AI. (<=160 chars) |
| Schema | `Product` + `Offer` + `PriceSpecification` |

### 7.2 当前代码状态

| 项目 | 状态 |
|------|------|
| Header 导航 `/pricing` | 已有链接占位，但 `isEnabled` 为 false（禁用状态）→ 需改为启用 |
| Pricing 页面 | **不存在**，需新建 |
| Creem 支付集成 | **未开始** |
| Clerk 用户系统 | 已接入，`isSignedIn` 可用，但无登录墙 |
| Supabase 数据库 | 已配置但未接入 |
| `public/pricing.md` | 已有基础定价说明（用于 llms.txt） |

### 7.3 页面区块

#### 区块 1：Hero

```
H1: Simple, Transparent Pricing
副标题: Start free. Upgrade when you need it.
```

#### 区块 2：定价卡片（核心）

**布局：** Free / Pro 并排双卡片。月付/年付切换标签。

**Free 卡片：**
- 标题：Free
- 价格：$0 / forever
- 特点：3-4 项核心权益（Text & URL extraction, bigram/trigram, CSV download）
- CTA：Get Started → 链接到首页 `#toolArea`
- 无高亮

**Pro 卡片：**
- 标题：Pro
- 价格：$9.99/mo / $99/yr（年付显示 "Save $20" 折扣标签）
- 特点：7 项权益列表
- CTA：Upgrade to Pro → 触发 Creem 支付流程
- 高亮标签：Popular

#### 区块 3：功能对比表

全功能行对比，行名 + Free/Pro 两列。

| 功能 | Free | Pro |
|------|------|-----|
| Text keyword extraction | ✅ | ✅ |
| URL keyword extraction | ✅ | ✅ |
| Word frequency & density | ✅ | ✅ |
| Bigram & trigram detection | ✅ | ✅ |
| CSV download & clipboard copy | ✅ | ✅ |
| Character limit per submission | 10,000 characters | Unlimited |
| AI-powered semantic extraction | — | ✅ |
| PDF keyword extraction | — | ✅ |
| YouTube keyword extraction | — | ✅ |
| 30-day extraction history | — | ✅ |
| Priority support | — | ✅ |

#### 区块 4：FAQ

5 个问题，围绕付费订阅的常见疑虑：

1. Can I cancel my subscription anytime?
2. What payment methods do you accept?
3. What is your refund policy?
4. Is my data safe with Pro?
5. What happens when I upgrade or downgrade?

#### 区块 5：底部 CTA

- 标题：Not sure yet?
- 文案：Start with the free plan — no signup, no credit card. Upgrade anytime.
- 按钮：Try It Free → 链接到首页

### 7.4 翻译结构（messages/en.json）

```json
{
  "pricing": {
    "metadata": {
      "title": "Pricing · ExtractKeywords — Simple, Transparent Pricing",
      "description": "ExtractKeywords pricing: free and Pro plans. Start with no signup required. Upgrade when you need unlimited extraction and AI."
    },
    "hero": {
      "title": "Simple, Transparent Pricing",
      "subtitle": "Start free. Upgrade when you need it."
    },
    "cards": {
      "free": {
        "title": "Free",
        "price": "$0",
        "period": "forever",
        "cta": "Get Started",
        "features": [
          "Text & URL keyword extraction",
          "Bigram & trigram analysis",
          "CSV download and clipboard copy"
        ]
      },
      "pro": {
        "title": "Pro",
        "priceMonthly": "$9.99",
        "priceYearly": "$99",
        "periodMonthly": "/month",
        "periodYearly": "/year",
        "saveLabel": "Save $20",
        "badge": "Popular",
        "cta": "Upgrade to Pro",
        "features": [
          "Everything in Free",
          "Unlimited character limit",
          "AI-powered semantic extraction",
          "PDF keyword extraction",
          "YouTube keyword extraction",
          "30-day extraction history",
          "Priority support"
        ]
      }
    },
    "comparison": {
      "title": "Compare Features",
      "rows": [
        { "feature": "Text keyword extraction", "free": true, "pro": true },
        { "feature": "URL keyword extraction", "free": true, "pro": true },
        { "feature": "Word frequency & density", "free": true, "pro": true },
        { "feature": "Bigram & trigram detection", "free": true, "pro": true },
        { "feature": "CSV download & clipboard copy", "free": true, "pro": true },
        { "feature": "Character limit per submission", "free": "10,000 characters", "pro": "Unlimited" },
        { "feature": "AI-powered semantic extraction", "free": false, "pro": true },
        { "feature": "PDF keyword extraction", "free": false, "pro": true },
        { "feature": "YouTube keyword extraction", "free": false, "pro": true },
        { "feature": "30-day extraction history", "free": false, "pro": true },
        { "feature": "Priority support", "free": false, "pro": true }
      ]
    },
    "faq": [
      {
        "question": "Can I cancel my subscription anytime?",
        "answer": "Yes. You can cancel your Pro subscription at any time. Monthly plans stop at the end of the current billing period. Annual plans continue until the end of the paid year — no prorated refunds for partial years."
      },
      {
        "question": "What payment methods do you accept?",
        "answer": "We accept major credit cards including Visa, MasterCard, and American Express. Payments are processed securely by Creem Inc."
      },
      {
        "question": "What is your refund policy?",
        "answer": "We offer a 7-day money-back guarantee. If you are not satisfied with Pro within 7 days of purchase, contact support for a full refund."
      },
      {
        "question": "Is my data safe with Pro?",
        "answer": "Yes. We process extraction requests in real time and do not store pasted text, fetched page content, submitted URLs, or extraction results. Pro users' data is handled exactly like free users' data — no logging, no storage, no third-party sharing."
      },
      {
        "question": "What happens when I upgrade or downgrade?",
        "answer": "When upgrading, Pro features are available immediately. When downgrading back to Free at the end of your billing period, your character limit reverts to 10,000 characters and Pro-only features (AI, PDF, YouTube extraction) are no longer available. Your extraction history is not retained."
      }
    ],
    "cta": {
      "title": "Not sure yet?",
      "subtitle": "Start with the free plan — no signup, no credit card. Upgrade anytime.",
      "button": "Try It Free"
    }
  }
}
```

### 7.5 注意：nav.pricing 翻译键

```json
// 已在 messages/en.json 中，Header 已有 `/pricing` 链接占位
// 实施时将 Header.tsx 中 isEnabled 改为 true 即可启用
"nav": {
  "pricing": "Pricing"
}
```

---

## 八、验收标准

### 构建与代码检查

- [ ] `python3 -m json.tool messages/en.json` — JSON 格式校验通过
- [ ] `npm run test` — 通过
- [ ] `npm run lint` — 通过
- [ ] `npm run build` — 通过

### 页面功能

- [ ] `/pricing` 页面正常访问
- [ ] Header 中 Pricing 导航链接可用（`isEnabled = true`）
- [ ] Free / Pro 双卡片布局，响应式适配（桌面 + 移动端）
- [ ] 月付/年付切换正常，年付显示 "Save $20" 标签
- [ ] 功能对比表渲染正确，所有行数据来自 `messages/en.json`
- [ ] FAQ 可以展开/收起

### 支付与用户

- [ ] Free CTA（Get Started）链接到首页 `#toolArea`
- [ ] Pro CTA（Upgrade to Pro）触发 Creem 支付流程
- [ ] Creem 支付成功后重定向回站内
- [ ] Creem 支付失败/取消有合理提示
- [ ] Clerk 登录用户在 Pricing 页正确显示登录状态

### SEO & Schema

- [ ] Metadata 正确（title, description <= 160 chars, OG, Twitter）
- [ ] Schema.org 结构化数据（Product + Offer + PriceSpecification）
- [ ] Sitemap 包含 `/pricing`
- [ ] `public/llms.txt` 已添加 `/pricing`

### 文案规范

- [ ] AI 功能文案遵循 AGENTS.md 规则（planned / coming soon 等表述）
- [ ] "free" / "pro" 大小写由翻译文件控制，非硬编码
- [ ] 所有 UI 文案来自 `messages/en.json`

---

## 九、注意事项

- 遵循项目 AGENTS.md 规范
- 设计风格参照 About 页（Marketing 风格），非 Document 页
- 实施时需准备 Creem API key 和 webhook endpoint
- AI 未上线时文案写 "planned" / "coming soon"，遵循 AGENTS.md SEO 规则
- 最终检查：JSON 校验 → test → lint → build → 浏览器验证（桌面+移动端）