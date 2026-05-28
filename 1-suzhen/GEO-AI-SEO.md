# GEO & AI SEO 优化策略

## 1. 结构化数据（Schema.org）

| 页面 | Schema 类型 | 用途 |
|-----|------------|------|
| 首页 | `Organization` + `WebSite` | 品牌实体识别 |
| 工具页 | `SoftwareApplication` | AI 识别为工具 |
| 博客文章 | `Article` + `HowTo` | AI 引用内容 |
| FAQ 区 | `FAQPage` | 直接被 AI 引用 |
| 定价页 | `Product` + `Offer` | 价格信息结构化 |

---

## 2. 内容结构（AI 易提取）

每个页面结构：

```
├── H1 标题（唯一）
├── 简短描述（1-2 句话，AI 可直接引用）
├── 核心内容
│   ├── 步骤说明（HowTo 格式）
│   ├── 列表/表格（AI 友好）
│   └── FAQ（问答格式）
└── 相关链接
```

---

## 3. E-E-A-T 信号（权威性）

| 元素 | 实现方式 |
|-----|---------|
| 作者信息 | 博客文章标注作者 |
| 联系方式 | Contact 页面完整信息 |
| 社交链接 | 页脚链接到官方社交账号 |
| 用户评价 | 后续加入 testimonials |

---

## 4. AI 爬虫友好

| 优化项 | 说明 |
|-------|------|
| robots.txt | 允许所有 AI 爬虫 |
| sitemap.xml | 清晰的 URL 结构 |
| 内部链接 | 扁平化，3 次点击到达任意页面 |
| 页面加载速度 | Core Web Vitals 达标 |

---

## 5. robots.txt 配置

```txt
User-agent: *
Allow: /

# AI 爬虫友好
User-agent: GPTBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: https://extractkeywords.com/sitemap.xml
```

---

## 6. 首页 GEO 优化重点

| 元素 | 内容 |
|-----|------|
| meta description | 简短描述工具功能，AI 可引用 |
| H1 | Extract Keywords - Free Online Keyword Extractor Tool |
| 开头段落 | 一句话说清楚功能，便于 AI 提取 |
| FAQ Schema | 常见问题，AI 直接引用 |

---

## 7. 博客文章格式

```markdown
# [标题]

简短摘要（1-2 句话，AI 可引用）

## What is [主题]?

## How to [操作步骤]

1. 步骤一
2. 步骤二
3. 步骤三

## FAQ

### Q: 问题一?
A: 答案一

### Q: 问题二?
A: 答案二
```

---

## 决策日期

- 2026-05-28：确定网站结构和 GEO/AI SEO 策略
