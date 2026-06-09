# Pricing 页面开发任务

## 背景

为 ExtractKeywords 项目创建定价页面（`/pricing`），展示 Free / Pro 功能对比，接入 Creem 支付，为后续 AI 语义提取等付费功能做准备。

---

## 已有信息汇总

### 定价方案

| 套餐 | 价格 | 结算 |
|------|------|------|
| Free | $0 | 永久免费 |
| Pro | $9.99/月 | 按月订阅 |
| Pro | $99/年 | 年付（省 $20，≈$8.25/月） |

### 功能对比

| 功能 | Free | Pro |
|------|------|-----|
| Text 关键词提取 | ✅ | ✅ |
| URL 关键词提取 | ✅ | ✅ |
| 2词/3词短语 | ✅ | ✅ |
| CSV 导出 | ✅ | ✅ |
| Copy to Clipboard | ✅ | ✅ |
| 单次字数 | ⚠️ 10,000 上限 | 🔓 无限 |
| AI 语义提取（DeepSeek） | ❌ | ✨ |
| PDF 提取 | ❌ | 📄 |
| YouTube 提取 | ❌ | 🎬 |
| 30天提取历史 | ❌ | 📜 |
| 优先支持 | ❌ | ⚡ |

### 支付集成

- 网关：**Creem**（已选定）
- 支付方式：信用卡（Visa/MC/Amex），PayPal（可选）
- 货币：USD
- 退款政策：7 天无理由退款
- 订阅管理：月付随时取消，年付取消后剩余时间可用至年末
- 数据库：`subscriptions` 表已设计（Supabase）
- 认证：Clerk 已接入，`isSignedIn` 可用

### AI 成本测算（内部参考，不对外公开）

- 单次 DeepSeek 调用：≈ $0.0004
- 月上限 2000 次：≈ $0.8/月
- 利润率：> 90%

### 当前代码状态

| 项目 | 状态 |
|------|------|
| Header 导航 `/pricing` | 已有链接占位，但 `isEnabled` 为 false（禁用状态） |
| Pricing 页面 `/pricing` | **不存在** |
| Creem 支付集成 | **未开始** |
| Clerk 用户系统 | 已接入，有登录/注册按钮 |
| Supabase 数据库 | 已配置但未接入 |
| `public/pricing.md` | 已有基础定价说明（用于 llms.txt） |
| `1-suzhen/PRICING.md` | 已有完整定价方案文档 |

---

## 页面结构

### 页面基础

| 属性 | 值 |
|------|-----|
| 路径 | `/pricing` |
| 路由 | `src/app/[locale]/pricing/page.tsx` |
| 设计风格 | Marketing 页风格（参照 About 页），非 Document 页 |
| Metadata title | Pricing · ExtractKeywords — Simple, Transparent Pricing |
| Metadata description | ExtractKeywords pricing: free and Pro plans. Start with no signup required. Upgrade when you need unlimited extraction and AI. |
| Schema | `Product` + `Offer` + `PriceSpecification` |

---

### 页面区块

#### 1. Hero

| 字段 | 内容要点 |
|------|---------|
| H1 | Simple, Transparent Pricing |
| 副标题 | Start free. Upgrade when you need it. |

#### 2. 定价卡片（核心）

**布局**：左右双卡片，Free / Pro 并排。

**Free 卡片：**

| 字段 | 内容 |
|------|------|
| 标题 | Free |
| 价格 | $0 |
| 周期 | forever |
| 特点 | 短列表（3-4 项核心权益） |
| CTA | Get Started（链接到首页 `#toolArea`） |
| 高亮 | 无 |

**Pro 卡片：**

| 字段 | 内容 |
|------|------|
| 标题 | Pro |
| 价格 | $9.99/mo / $99/yr |
| 周期切换 | 月付 / 年付（年付显示 "Save $20" 折扣标签） |
| 特点 | 中列表（6-7 项核心权益） |
| CTA | Upgrade to Pro（触发 Creem 支付流程） |
| 高亮 | Popular（推荐标签） |

#### 3. 功能对比表

全功能行对比表格，行名为功能描述，列名为 Free / Pro。

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

#### 4. FAQ

5 个问题，围绕付费订阅的常见疑虑：

1. Can I cancel my subscription anytime?
2. What payment methods do you accept?
3. What is your refund policy?
4. Is my data safe with Pro?
5. What happens when I upgrade or downgrade?

#### 5. CTA

底部 CTA 区块，引导未决定用户从免费开始：
- 标题：Not sure yet?
- 文案：Start with the free plan — no signup, no credit card. Upgrade anytime.
- 按钮：Try It Free（链接到首页）

---

## 翻译结构（messages/en.json）

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
  },
  "nav": {
    "pricing": "Pricing"
  }
}
```

> **注意**：`nav.pricing` 翻译键已在 `messages/en.json` 中，Header 已有 `/pricing` 链接。实施时只需将 `Header.tsx` 中 `/pricing` 的 `isEnabled` 状态改为启用即可。

---

## 验收标准

- [ ] `/pricing` 页面正常访问
- [ ] Header 中 Pricing 导航链接可用（`isEnabled = true`）
- [ ] Metadata 正确（title, description <= 160 chars, OG, Twitter）
- [ ] Free / Pro 双卡片布局，响应式适配
- [ ] 月付/年付切换正常，年付显示 "Save $20" 标签
- [ ] 功能对比表渲染正确，所有行数据来自 `messages/en.json`
- [ ] FAQ 可以展开/收起
- [ ] Creem 支付集成：
  - [ ] Free CTA 链接到首页 `#toolArea`
  - [ ] Pro CTA 触发 Creem 支付流程
  - [ ] 支付成功后重定向回站内
  - [ ] 支付失败/取消有合理提示
- [ ] Schema 结构化数据（Product + Offer + PriceSpecification）
- [ ] `npm run build` 通过
- [ ] 浏览器验证桌面端 + 移动端

---

## 注意事项

- 遵循项目 AGENTS.md 规范
- UI/SEO/metadata/Schema 文案必须来自 `messages/en.json`
- 使用 `cn()` 合并 className
- Pricing 页面设计风格参照 About 页（Marketing 风格），非 Document 页
- AI 未上线时：文案中写 "planned" / "coming soon" 等表述，遵循 AGENTS.md 的 SEO 规则
- 价格文案中 "free" / "pro" 不要硬编码大小写，由翻译文件控制
- 支付流程需要 Creem 的 API key 和 webhook endpoint