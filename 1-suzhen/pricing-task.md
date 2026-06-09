# Pricing 定价页面

> **Pricing v1 定位：** 透明的定价与未来 Pro 说明页。
> **不接支付，不超卖。** Pro 功能全部标注 planned/coming soon，等 Creem 真正就绪后再开购买入口。

---

## 一、定价方案

### 1.1 定价层级

| 套餐 | 价格 | 结算周期 |
|-----|------|---------|
| Free | $0 | 永久免费 |
| Pro (planned) | $9.99/月 | 按月订阅 |
| Pro (planned) | $99/年 | 年付（省 $20，≈$8.25/月） |

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

| 功能 | Free | Pro (planned) |
|------|------|---------------|
| Text 关键词提取 | ✅ | ✅ |
| URL 关键词提取 | ✅ | ✅ |
| 2词/3词短语 | ✅ | ✅ |
| CSV 导出 / 复制 | ✅ | ✅ |
| 单次输入上限 | 10,000 字符 | Unlimited (planned) |
| AI 语义提取 | — | ✨ coming soon |
| PDF 提取 | — | planned |
| YouTube 提取 | — | planned |
| 30天提取历史 | — | planned |
| 优先支持 | — | planned |

---

## 三、免费版规则

### 3.1 字数限制

| 项目 | 限制 |
|-----|------|
| 单次输入上限 | 10,000 字符 |
| 超限提示 | "Your text exceeds 10,000 characters." |

### 3.2 注册要求

- **不强制注册**
- 用户可直接使用工具
- 当前免费版不做注册拦截或邮箱收集

### 3.3 使用限制

| 项目 | 限制 |
|-----|------|
| 每日请求次数 | 每 IP 每日 50 次（内存限流） |
| URL 抓取范围 | 仅支持公开可访问的 HTML 页面 |
| URL 抓取限制 | 遵守 robots.txt，拒绝 localhost / 私网地址 |

---

## 四、Pro 版规则

### 4.1 Pro 权益（planned，未上线）

| 权益 | 说明 |
|-----|------|
| 无限字数 | 无单次输入限制（planned） |
| AI 语义提取 | DeepSeek 驱动（planned） |
| PDF 提取 | 上传 PDF 提取关键词（planned） |
| YouTube 提取 | 从视频描述和字幕提取关键词（planned） |
| 提取历史 | 30 天历史记录（planned） |
| 优先支持 | 优先响应客服请求（planned） |

### 4.2 AI 成本测算（内部参考，不对外公开）

| 项目 | 值 |
|-----|------|
| 单次 DeepSeek 调用成本 | ≈ $0.0004 |
| 月上限 2000 次成本 | ≈ $0.8 |
| 售价 | $9.99 |
| 利润率 | > 90% |

---

## 五、支付集成（后续阶段）

**当前阶段（v1）：** 不接支付。Pro CTA 为 disabled 按钮，不触发任何流程。

**后续阶段（v2+）：** 待 Creem 就绪后再集成。

| 项目 | 详情 |
|-----|------|
| 支付网关 | Creem（已选定，未接入） |
| 支持卡种 | Visa, MasterCard, Amex |
| 可选方式 | PayPal |
| 货币 | USD |
| 认证 | Clerk（已接入） |
| 数据库 | Supabase（`subscriptions` 表已设计，未接入） |

---

## 六、未来考虑（暂不实现）

### 6.1 双层定价

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
| Metadata description | ExtractKeywords pricing: free and future Pro plans. Start with no signup required. (<=160 chars) |
| Schema | Free: `InStock` 或不写 availability；**Pro: `https://schema.org/PreOrder`**，description 明确 "planned for future release" |
| Sitemap | 包含 `/pricing` |
| llms.txt | **同时保留** `/pricing.md`（AI-readable 文档）和 `https://extractkeywords.com/pricing`（human-facing 页面） |

### 7.2 当前代码状态与改动清单

| 项目 | 当前状态 | 需要改动 |
|------|---------|---------|
| Header 导航 `/pricing` | 已有链接，`isEnabled` 为 false | `CENTER_LINKS` 中 `/pricing` 加 `enabled: true`，blog 保持禁用 |
| Footer 导航 `Pricing` | `href="#"` 阻止跳转 | 改为真实链接 `/pricing` |
| `/pricing` 页面 | **不存在** | 新建 `src/app/[locale]/pricing/page.tsx` |
| `public/pricing.md` | Pro features 只列了 AI / 更高限制 / 优先 / 无限流 | 同步补全 planned features（PDF、YouTube、30天历史），或页面收窄到与它一致 — **以页面计划为准，同步更新 public/pricing.md** |
| Creem 支付 | 未接入 | **本次不做** |
| Clerk 用户系统 | 已接入 | Pricing v1 页面不显示登录状态差异，不嵌入 user button |

### 7.3 页面区块

#### 区块 1：Hero

```
H1: Simple, Transparent Pricing
副标题: Start free. Pro is planned for heavier workflows.
```
> 副标题不要写 "Upgrade when you need it"（暗示可立即升级）。

#### 区块 2：定价卡片

**Free 卡片：**
- 标题：Free
- 价格：$0 / forever
- 特点：3-4 项核心权益
- CTA：**Get Started** → 可点击，链接到首页 `#toolArea`
- 无高亮标签

**Pro 卡片：**
- 标题：Pro
- 标签：**Planned**（非 Popular）
- 价格：$9.99/mo（planned）/ $99/yr（planned），年付显示 "Save $20"
- 特点：7 项权益列表，全部标注 planned / coming soon
- CTA：**Coming Soon** → **disabled 按钮**，无点击事件，带 `aria-disabled` 属性
- 不高亮为"Popular"，改标"Planned"

#### 区块 3：功能对比表

| 功能 | Free | Pro (planned) |
|------|------|---------------|
| Text keyword extraction | ✅ | ✅ |
| URL keyword extraction | ✅ | ✅ |
| Word frequency & density | ✅ | ✅ |
| Bigram & trigram detection | ✅ | ✅ |
| CSV download & clipboard copy | ✅ | ✅ |
| Character limit per submission | 10,000 characters | Unlimited (planned) |
| AI-powered semantic extraction | — | ✨ coming soon |
| PDF keyword extraction | — | planned |
| YouTube keyword extraction | — | planned |
| 30-day extraction history | — | planned |
| Priority support | — | planned |

> 表头为 `Pro (planned)`，非裸写 `Pro`。字符限制写 `Unlimited (planned)`。

#### 区块 4：FAQ

5 个问题，围绕定价与 Pro 的未来规划：

1. Is there a Pro plan with more features?
2. How much will Pro cost?
3. What features will Pro include?
4. What is the free plan limit?
5. Do I need an account to use the tool?

#### 区块 5：底部 CTA

- 标题：Not sure yet?
- 文案：Start with the free plan — no signup, no credit card. Pro is planned for when you need more.
- 按钮：Try It Free → 可点击，链接到首页

### 7.4 翻译结构（messages/en.json）

> **注意**：Pro 状态（planned/coming soon）由代码常量控制，翻译文件只放显示文本，不放 `"planned": true` 这类逻辑标记。

```json
{
  "pricing": {
    "metadata": {
      "title": "Pricing · ExtractKeywords — Simple, Transparent Pricing",
      "description": "ExtractKeywords pricing: free and future Pro plans. Start with no signup required."
    },
    "hero": {
      "title": "Simple, Transparent Pricing",
      "subtitle": "Start free. Pro is planned for heavier workflows."
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
        "badge": "Planned",
        "priceMonthly": "$9.99",
        "priceYearly": "$99",
        "periodMonthly": "/month",
        "periodYearly": "/year",
        "saveLabel": "Save $20",
        "cta": "Coming Soon",
        "features": [
          "Everything in Free",
          "Unlimited character limit (planned)",
          "AI-powered semantic extraction (coming soon)",
          "PDF keyword extraction (planned)",
          "YouTube keyword extraction (planned)",
          "30-day extraction history (planned)",
          "Priority support (planned)"
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
        { "feature": "Character limit per submission", "free": "10,000 characters", "pro": "Unlimited (planned)" },
        { "feature": "AI-powered semantic extraction", "free": false, "pro": "Coming soon" },
        { "feature": "PDF keyword extraction", "free": false, "pro": "Planned" },
        { "feature": "YouTube keyword extraction", "free": false, "pro": "Planned" },
        { "feature": "30-day extraction history", "free": false, "pro": "Planned" },
        { "feature": "Priority support", "free": false, "pro": "Planned" }
      ]
    },
    "faq": [
      {
        "question": "Is there a Pro plan with more features?",
        "answer": "Yes, a Pro plan is planned with unlimited character limits, AI-powered keyword extraction, PDF and YouTube extraction, 30-day history, and priority support. We'll announce pricing and availability when it's ready."
      },
      {
        "question": "How much will Pro cost?",
        "answer": "Pro is planned at $9.99 per month or $99 per year (save $20). Exact pricing may change before launch."
      },
      {
        "question": "What features will Pro include?",
        "answer": "Pro is planned to include: unlimited character limit per submission, AI-powered semantic keyword extraction using advanced language models, PDF document keyword extraction, YouTube video keyword extraction, 30-day extraction history, and priority support. We'll share the final feature set closer to launch."
      },
      {
        "question": "What is the free plan limit?",
        "answer": "The free plan supports up to 10,000 characters per submission with text and URL keyword extraction, bigram and trigram analysis, CSV download, and clipboard copy. No account or signup required."
      },
      {
        "question": "Do I need an account to use the tool?",
        "answer": "No. The free Text and URL extraction modes work without any account or signup. An account may be needed for future Pro features."
      }
    ],
    "cta": {
      "title": "Not sure yet?",
      "subtitle": "Start with the free plan — no signup, no credit card. Pro is planned for when you need more.",
      "button": "Try It Free"
    }
  },
  "nav": {
    "pricing": "Pricing"
  }
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
- [ ] Header 中 Pricing 导航可用（`CENTER_LINKS` 中 `/pricing` 加 `enabled: true`）
- [ ] Footer 中 Pricing 链接从 `href="#"` 改为真实路径 `/pricing`
- [ ] Free / Pro 双卡片布局，响应式适配（桌面 + 移动端）
- [ ] Pro 卡片标签为 "Planned"，非 "Popular"
- [ ] 月付/年付切换正常，年付显示 "Save $20" 标签
- [ ] Pro CTA（Coming Soon）为 **disabled 按钮**，无点击事件，带 `aria-disabled`
- [ ] Free CTA（Get Started）可点击，链接到首页 `#toolArea`
- [ ] 功能对比表表头为 `Pro (planned)`，字符限制行写 `Unlimited (planned)`
- [ ] FAQ 可以展开/收起
- [ ] 底部 CTA 按钮链接到首页

### SEO & Schema

- [ ] Metadata 正确（title, description <= 160 chars, OG, Twitter）
- [ ] Schema.org：Free Offer 用 `InStock` 或不写 availability；**Pro Offer 用 `https://schema.org/PreOrder`**，description 含 "planned for future release"
- [ ] Sitemap 包含 `/pricing`
- [ ] `public/llms.txt`：同时保留 `/pricing.md` 并新增 `/pricing`
- [ ] `public/pricing.md`：Pro features 同步补全（与页面计划一致）
- [ ] 浏览器验证桌面端 + 移动端截图

### 文案规范

- [ ] Pro 所有未上线功能标注 planned / coming soon，不写成已可用
- [ ] Hero 副标题不写 "Upgrade" 暗示
- [ ] 遵循 AGENTS.md SEO 规则（AI 表述规范等）
- [ ] 所有 UI/SEO/aria/metadata/Schema 文案来自 `messages/en.json`
- [ ] Pro 状态（planned/coming soon）由代码常量控制，翻译文件不包含逻辑标记

---

## 九、注意事项

- **Pricing v1 不接支付**：Pro CTA 是 disabled 按钮，不触发任何流程
- 设计风格参照 About 页（Marketing 风格），非 Document 页
- `Header.tsx`：只在 `/pricing` 加 `enabled: true`，blog 保持禁用
- `Footer.tsx` 中 Pricing 链接改为 `href="/pricing"`
- Pricing v1 页面不显示登录状态差异，不嵌入 user button
- `public/pricing.md` 与页面计划的 Pro features 保持一致
- 遵循 AGENTS.md 规范
- 最终检查：JSON 校验 → test → lint → build → 浏览器验证（桌面+移动端）