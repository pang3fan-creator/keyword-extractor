# 网站结构设计

## 页面层级

### 核心页面

| 页面 | URL | 目标关键词 | 说明 |
|-----|-----|-----------|------|
| 首页 | `/` | extract keywords | 工具 + SEO 内容 |
| 文本提取 | `/extract-keywords-from-text` | extract keywords from text | 功能落地页 |
| URL 提取 | `/extract-keywords-from-url` | extract keywords from url | 功能落地页 |
| PDF 提取 | `/extract-keywords-from-pdf` | extract keywords from pdf | 差异化功能 |
| YouTube | `/youtube-keyword-extractor` | youtube keyword extractor | 差异化功能 |
| 定价 | `/pricing` | - | 付费方案 |
| 博客 | `/blog/` | 长尾内容 | 文章列表 |

### 必备页面

| 页面 | URL | 用途 |
|-----|-----|------|
| Privacy Policy | `/privacy` | 法律合规，GDPR/CCPA |
| Terms of Service | `/terms` | 法律合规 |
| Contact | `/contact` | 用户联系 |
| About | `/about` | 品牌可信度（可选） |
| Sitemap | `/sitemap.xml` | SEO 爬虫索引 |
| Robots | `/robots.txt` | 爬虫规则 |

---

## 首页结构

```
首页 (/)
├── 工具区（用户直接用）
│   ├── 文本输入
│   ├── URL 输入
│   └── AI 提取（付费）
│
├── SEO 内容区（给爬虫看）
│   ├── How it works
│   ├── Why keyword extraction matters
│   ├── How to use results
│   └── FAQ
│
└── 页脚
    ├── © 2026 ExtractKeywords
    └── Privacy | Terms | Contact
```

---

## 流量策略

| 页面类型 | 目标 | 关键词示例 |
|---------|------|-----------|
| 首页 | 主词排名 | extract keywords |
| 功能落地页 | 长尾词排名 | extract keywords from text, PDF |
| 博客文章 | 内容流量 | how to extract keywords, best tools |

**层级关系：**
```
首页（权重最高）
    ↓ 内链传递
落地页（功能页，承接长尾词）
    ↓ 内链传递
博客文章（内容页，覆盖更多长尾）
```

---

## 内部链接策略

- 首页链接到所有落地页
- 落地页之间互链
- 博客文章链接到相关落地页
- 页脚全局导航
- 扁平化结构：3 次点击到达任意页面
