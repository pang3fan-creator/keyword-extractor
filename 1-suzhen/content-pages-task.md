# 支付前内容页规划

## Summary

本计划用于支付功能开发前的内容准备。目标不是复制首页的 Text/URL 提取功能，也不创建会和首页抢转化入口的变体工具页，而是补充解释型、教程型、可被搜索引擎和 AI 引用的内容页。

当前阶段只做规划，不新增页面路由。

## 内容原则

- 首页继续承载核心免费工具：Text extraction、URL extraction、CSV、clipboard。
- 内容页只解释方法、场景、判断标准和 SEO 背景，不重复放置完整工具 UI。
- 页面 CTA 统一指向首页 `/#toolArea`，不做独立 extractor。
- AI/Pro 只写 planned / future release，不写 available、active、purchasable。
- 所有页面上线时必须补 metadata、canonical、schema、sitemap、llms.txt。

## 推荐优先级

### P0: How to Extract Keywords from a Webpage

**建议路径：** `/guides/how-to-extract-keywords-from-a-webpage`

**目标意图：** 用户想分析某个网页或竞争对手页面，但不确定 URL extraction 的流程、限制和注意事项。

**内容要点：**
- 什么是 webpage keyword extraction
- 如何用公开 URL 提取关键词
- robots.txt、paywall、login-required 页面为什么可能失败
- 如何解读 word frequency、density、bigrams、trigrams
- 何时应该改用 pasted text

**CTA：** Try the free keyword extractor，链接到 `/#toolArea`

### P1: Keyword Density Checker Guide

**建议路径：** `/guides/keyword-density-checker`

**目标意图：** 用户想理解 keyword density 是什么、多少算合理、如何避免 keyword stuffing。

**内容要点：**
- keyword density 的定义
- frequency 与 density 的区别
- 为什么 density 只能作为辅助信号
- 如何结合 bigrams/trigrams 判断内容主题
- 常见误区：追求固定百分比、过度堆词

**CTA：** Analyze your text for free，链接到 `/#toolArea`

### P1: Bigrams and Trigrams in SEO

**建议路径：** `/guides/bigrams-and-trigrams-in-seo`

**目标意图：** 用户想知道 2-word/3-word phrases 为什么比单词频率更有用。

**内容要点：**
- bigram / trigram 的简单定义
- 为什么 multi-word phrases 更接近真实搜索词
- 如何用 phrases 发现内容主题和长尾机会
- phrase extraction 与 AI semantic extraction 的区别
- Pro AI 只作为 future planned capability 提及

**CTA：** Extract keyword phrases，链接到 `/#toolArea`

### P2: Keyword Extraction for Competitor Content Analysis

**建议路径：** `/guides/competitor-content-keyword-analysis`

**目标意图：** SEO/marketing 用户想审计竞争对手页面。

**内容要点：**
- 如何选择可公开访问的 competitor page
- 如何比较自己页面和对方页面的 keyword profile
- density、frequency、phrases 分别说明什么
- 内容差距如何转化为 outline / brief
- 合规提醒：尊重 robots.txt 和公开可访问边界

**CTA：** Compare a webpage keyword profile，链接到 `/#toolArea`

## 暂不推荐

- `/tools/text-keyword-extractor`
- `/tools/website-keyword-extractor`
- `/text-keyword-extractor`
- `/url-keyword-extractor`

这些页面会和首页的核心工具体验高度重叠，容易造成内容重复、内链意图混乱和转化入口分散。等首页排名、工具转化和内容集群稳定后，再考虑是否需要程序化页面。

## 上线验收

- 每页必须有唯一 H1，不复用首页 H1。
- 每页必须有清晰教程正文，而不是工具功能换皮。
- 每页必须有 FAQ 或 step-by-step 结构，方便 AI 系统摘取。
- 每页必须使用真实内链，不使用 `#` 占位。
- 每页必须进入 sitemap 和 `public/llms.txt`。
- 不新增 checkout、login gate、email collection 或 Pro purchase CTA。
