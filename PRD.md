# 产品需求文档 (PRD)

## ExtractKeywords - 关键词提取工具

**版本：** 1.0  
**日期：** 2026-05-28  
**作者：** 素贞  
**状态：** 待开发

---

## 一、产品概述

### 1.1 产品定位

ExtractKeywords 是一款在线关键词提取工具，帮助 SEO 从业者、内容创作者、数字营销人员从文本或网页中快速提取关键词。

**核心价值主张：**
- 免费使用基础功能，无需注册
- AI 语义提取（付费），超越简单词频统计
- 支持 URL 抓取，一键分析竞品内容
- 2 词/3 词短语分析，发现长尾关键词

### 1.2 目标关键词

| 关键词 | 月搜索量 | KD | 说明 |
|-------|---------|-----|------|
| extract keywords | 5,000 | 11% | 主词 |
| extract keywords from text | 500 | - | 功能词 |
| extract keywords from url | 500 | - | 功能词 |
| youtube keyword extractor | 5,000 | - | 差异化词 |
| ai keyword extraction | 50 | - | 付费转化词 |

### 1.3 项目信息

| 项目 | 值 |
|-----|-----|
| 域名 | extractkeywords.com |
| 品牌名 | ExtractKeywords |
| 项目邮箱 | support@extractkeywords.com |
| GitHub | https://github.com/pang3fan-creator/keyword-extractor |

---

## 二、市场分析

### 2.1 市场机会

**关键词数据（Semrush）：**
- 主词月搜索量：5,000（Google）+ 1,200（Semrush）
- KD 难度：11%（很低）
- 所需外链：0 个
- CPC：$3.47

**关键词变体：**
- 总变体数：370 个
- 总搜索量：6,600/月

**趋势判断：**
- Google Trends 显示过去一年上升趋势
- 近期热度达到峰值 100
- 年同比 -90% 是数据异常（去年同期峰值），实际稳步回升

### 2.2 竞品分析

| 竞品 | 定位 | 定价 | 我们的优势 |
|-----|------|------|----------|
| QuestionDB | AI 提取 | $0/$9.99/$69.99 | 价格更简单，单层定价 |
| Webaloha | 传统工具 | 免费 | AI 提取差异化 |
| Divhunt | API 向开发者 | 按次收费 | 面向终端用户，更易用 |
| TunePocket | YouTube 提取 | $39 一次性 | 订阅制更灵活 |

**差异化策略：**
1. AI 语义提取（付费功能）
2. PDF 文件提取
3. YouTube 视频提取
4. 2 词/3 词短语分析

### 2.3 目标用户

**主要用户群体：**

| 用户类型 | 使用场景 | 痛点 |
|---------|---------|------|
| SEO 从业者 | 分析竞品页面关键词 | 需要快速了解对手关键词策略 |
| 内容创作者 | 检查文章关键词密度 | 确保内容符合 SEO 要求 |
| 数字营销人员 | 市场研究、趋势分析 | 发现行业热门关键词 |
| 博主 | 博客内容优化 | 找到合适的焦点关键词 |

---

## 三、产品功能

### 3.1 功能矩阵

| 功能 | 免费 | 付费 | MVP 必须？ |
|-----|-----|-----|----------|
| 文本关键词提取 | ✅ | ✅ | ✅ |
| URL 抓取提取 | ✅ | ✅ | ✅ |
| 2 词短语分析 | ✅ | ✅ | ✅ |
| 3 词短语分析 | ✅ | ✅ | ✅ |
| CSV 导出 | ✅ | ✅ | ✅ |
| Copy to Clipboard | ✅ | ✅ | ✅ |
| AI 语义提取 | ❌ | ✅ | ✅ |
| 无限字数 | ❌ | ✅ | ✅ |
| PDF 提取 | ❌ | ✅ | ⚠️ 后期 |
| YouTube 提取 | ❌ | ✅ | ⚠️ 后期 |
| 提取历史记录 | ❌ | ✅ | ⚠️ 后期 |

### 3.2 核心功能详解

#### 功能 1：文本关键词提取

**输入：**
- 纯文本（免费版限 10,000 字符，Pro 无限）
- 支持语言：英文（MVP 只做英文）

**处理流程：**
1. 文本清洗（移除 HTML、特殊字符）
2. 分词（空格分隔）
3. 停用词过滤
4. 词频统计
5. 密度计算

**输出：**
- 关键词列表（表格形式）
- 包含：关键词、出现次数、密度百分比

#### 功能 2：URL 抓取提取

**输入：**
- HTTP/HTTPS URL

**处理流程：**
1. URL 格式校验
2. Robots.txt 检查（遵守目标网站规则）
3. 内容抓取（cheerio 解析）
4. 提取正文内容
5. 复用文本提取逻辑

**输出：**
- 关键词列表
- 页面标题
- 源 URL

#### 功能 3：AI 语义提取（付费）

**输入：**
- 文本内容

**处理流程：**
- 调用 DeepSeek API
- 使用语义理解提取关键词
- 返回主题词、服务词、行业词等

**输出：**
- 关键词 + 相关度评分 + 分类

---

## 四、技术方案

### 4.1 技术栈

| 用途 | 技术选型 | 说明 |
|-----|---------|------|
| 部署平台 | Vercel | 免费，自动部署，全球 CDN |
| 框架 | Next.js 14+ | React 全栈框架，SEO 友好 |
| 样式 | Tailwind CSS | 快速开发，响应式 |
| UI 组件库 | HyperUI + shadcn/ui | 免费，HyperUI 区块 + shadcn/ui 组件 |
| 认证 | Clerk | 用户登录、注册、管理 |
| 支付 | Creem | 订阅付费 |
| 邮件 | Resend | 邮件通知 |
| 数据库 | Supabase | PostgreSQL，实时同步 |
| AI | DeepSeek | 语义提取 |

### 4.2 系统架构

```
┌─────────────────────────────────────────┐
│              用户浏览器                  │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│           Vercel Edge Network            │
│  ┌─────────────────────────────────┐    │
│  │      Next.js App Router         │    │
│  │  ┌──────────┐  ┌──────────────┐│    │
│  │  │  Pages   │  │  API Routes  ││    │
│  │  └──────────┘  └──────────────┘│    │
│  └─────────────────────────────────┘    │
└─────────────┬───────────────────────────┘
              │
    ┌─────────┼─────────┬─────────┐
    ▼         ▼         ▼         ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│ Clerk │ │Supabase│ │DeepSeek│ │ Creem │
└───────┘ └───────┘ └───────┘ └───────┘
```

### 4.3 数据库设计

**subscriptions 表：**
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  plan TEXT CHECK (plan IN ('free', 'pro')),
  status TEXT CHECK (status IN ('active', 'canceled', 'expired')),
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**ip_usage 表：**
```sql
CREATE TABLE ip_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address TEXT NOT NULL,
  date DATE NOT NULL,
  count INTEGER DEFAULT 0,
  UNIQUE(ip_address, date)
);
```

**ai_usage 表：**
```sql
CREATE TABLE ai_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  month TEXT NOT NULL,
  count INTEGER DEFAULT 0,
  UNIQUE(user_id, month)
);
```

### 4.4 API 接口

**POST /api/extract/text**
```typescript
Request: {
  text: string;
  options?: {
    includeBigrams?: boolean;
    includeTrigrams?: boolean;
  };
}

Response: {
  success: boolean;
  data: {
    totalWords: number;
    uniqueKeywords: number;
    keywords: Keyword[];
    bigrams?: Phrase[];
    trigrams?: Phrase[];
  };
}
```

**POST /api/extract/url**
```typescript
Request: {
  url: string;
  options?: {
    includeBigrams?: boolean;
    includeTrigrams?: boolean;
  };
}

Response: {
  success: boolean;
  data: {
    sourceUrl: string;
    pageTitle: string;
    wordCount: number;
    keywords: Keyword[];
    bigrams?: Phrase[];
    trigrams?: Phrase[];
  };
}
```

**POST /api/extract/ai**
```typescript
Request: {
  text: string;
}

Response: {
  success: boolean;
  data: {
    keywords: AIKeyword[];
  };
}
```

---

## 五、商业模式

### 5.1 定价方案

**单层定价（MVP 阶段）：**

| 套餐 | 价格 | 说明 |
|-----|------|------|
| Free | $0 | 永久免费 |
| Pro | $9.99/月 | 按月订阅 |
| Pro | $99/年 | 年付（省 $20） |

### 5.2 免费版规则

| 限制项 | 规则 |
|-------|------|
| 字数上限 | 10,000 字符/次 |
| 使用次数 | 未登录用户每日 10 次 |
| 注册要求 | 不强制注册 |
| 功能范围 | 文本/URL 提取、2词/3词短语、CSV 导出 |

### 5.3 Pro 版权益

| 权益 | 说明 |
|-----|------|
| 无限字数 | 无单次输入限制 |
| AI 语义提取 | DeepSeek 驱动，月上限 2000 次（内部限制） |
| PDF 提取 | 上传 PDF 提取关键词 |
| YouTube 提取 | 从视频描述和字幕提取关键词 |
| 提取历史 | 30 天历史记录 |
| 优先支持 | 优先响应客服请求 |

### 5.4 成本测算

**AI 提取成本（DeepSeek）：**
- 单次成本：≈ $0.0004
- 2000 次/月：≈ $0.8
- 售价：$9.99
- 利润率：> 90%

**其他成本：**
- Vercel：免费套餐（前期）
- Supabase：免费套餐（前期）
- Clerk：免费套餐（前期）
- 域名：已购买

**结论：边际成本极低，规模化后利润率极高**

---

## 六、开发计划

### 6.1 开发阶段

| Phase | 内容 | 预计工时 | 优先级 |
|-------|------|---------|--------|
| Phase 0 | 项目初始化 | 0.5 天 | P0 |
| Phase 1 | 核心功能 | 2 天 | P0 |
| Phase 2 | 用户系统 + 支付 | 2 天 | P0 |
| Phase 3 | SEO 内容 | 1.5 天 | P1 |
| Phase 4 | 差异化功能 | 3 天 | P2 |

**MVP 上线范围：Phase 0-3（6 天）**

### 6.2 关键里程碑

| 里程碑 | 日期 | 交付物 |
|-------|------|-------|
| M1: 项目初始化 | Day 1 | Next.js 项目 + 部署配置 |
| M2: 核心功能 | Day 3 | 文本/URL 提取功能可用 |
| M3: 用户系统 | Day 5 | 登录/注册/支付流程 |
| M4: MVP 上线 | Day 6 | 完整网站上线 |
| M5: 差异化功能 | Day 9 | PDF/YouTube 提取 |

### 6.3 任务分配

**素贞职责：**
- 产品规划
- 文档编写
- 设计审阅
- 测试验收

**Claude Code 职责：**
- 代码实现
- 功能开发
- Bug 修复

---

## 七、网站结构

### 7.1 页面规划

| 页面 | URL | 目标关键词 | 说明 |
|-----|-----|----------|------|
| 首页 | `/` | extract keywords | 工具 + SEO 内容 |
| 文本提取 | `/extract-keywords-from-text` | extract keywords from text | 功能落地页 |
| URL 提取 | `/extract-keywords-from-url` | extract keywords from url | 功能落地页 |
| PDF 提取 | `/extract-keywords-from-pdf` | extract keywords from pdf | Pro 功能页 |
| YouTube 提取 | `/youtube-keyword-extractor` | youtube keyword extractor | Pro 功能页 |
| 定价 | `/pricing` | - | 付费方案 |
| 博客 | `/blog/` | 长尾内容 | 文章列表 |
| Privacy | `/privacy` | - | 法律合规 |
| Terms | `/terms` | - | 法律合规 |

### 7.2 首页结构

```
┌─────────────────────────────────────────┐
│  Header: Logo | Pricing | Login         │
├─────────────────────────────────────────┤
│  H1: Extract Keywords from Text or URL  │
│  副标题: Free keyword extraction tool    │
├─────────────────────────────────────────┤
│  工具区（Tab 切换）                       │
│  [Text] [URL] [AI 🔒]                   │
│  ┌─────────────────────────────────┐    │
│  │     文本框 / URL 输入             │    │
│  │  [Extract Keywords]             │    │
│  └─────────────────────────────────┘    │
│  结果区（提取后展示）                     │
├─────────────────────────────────────────┤
│  SEO 内容区                              │
│  • How it works (3 步流程)               │
│  • Why it matters                       │
│  • Use cases                            │
│  • FAQ                                  │
├─────────────────────────────────────────┤
│  Footer: © 2026 | Privacy | Terms       │
└─────────────────────────────────────────┘
```

---

## 八、SEO 策略

### 8.1 On-Page SEO

**元数据：**
```html
<title>Extract Keywords from Text or URL - Free Keyword Extraction Tool</title>
<meta name="description" content="Free online keyword extraction tool. Extract keywords from text or URL instantly. No signup required. Download results as CSV.">
```

**结构化数据：**
- WebApplication Schema
- FAQPage Schema
- BreadcrumbList Schema

### 8.2 内容策略

**首页 SEO 内容模块：**
1. How it Works（3 步流程）
2. Why Keyword Extraction Matters
3. Use Cases（4 种用户场景）
4. FAQ（6-8 个问题）

**目标关键词密度：**
- 主词 `keyword extraction` / `extract keywords` ≥ 2%
- 总内容长度：1500+ 词

### 8.3 技术优化

- robots.txt 配置
- sitemap.xml 自动生成
- Open Graph / Twitter Card
- 响应式设计（移动优先）
- Core Web Vitals 优化

---

## 九、风险评估

### 9.1 技术风险

| 风险 | 影响 | 应对措施 |
|-----|------|---------|
| DeepSeek API 不稳定 | 中 | 添加重试机制 + 降级方案 |
| URL 抓取失败率高 | 中 | 优化错误提示 + 用户引导 |
| Vercel 函数超时 | 低 | 优化算法，减少处理时间 |

### 9.2 商业风险

| 风险 | 影响 | 应对措施 |
|-----|------|---------|
| 付费转化率低 | 高 | 优化免费版限制，突出 Pro 价值 |
| 竞品模仿 | 中 | 快速迭代，建立品牌壁垒 |
| 流量获取困难 | 中 | SEO + 内容营销 + 社交媒体 |

### 9.3 法律风险

| 风险 | 影响 | 应对措施 |
|-----|------|---------|
| GDPR/CCPA 合规 | 中 | Privacy Policy + Cookie 同意 |
| Robots.txt 违规 | 低 | 严格遵守，添加检查机制 |
| 用户数据处理 | 中 | 不存储用户文本，明确告知 |

---

## 十、成功指标

### 10.1 MVP 阶段目标（上线 1 个月）

| 指标 | 目标 |
|-----|------|
| 日活用户 | 100+ |
| 月活用户 | 1,000+ |
| 付费用户 | 10+ |
| 付费转化率 | ≥ 1% |
| Google 收录页面 | 10+ |
| 主词排名 | 前 50 |

### 10.2 成长阶段目标（上线 3 个月）

| 指标 | 目标 |
|-----|------|
| 月活用户 | 5,000+ |
| 付费用户 | 50+ |
| MRR | $500+ |
| 主词排名 | 前 20 |
| 长尾词排名 | 10+ 个进入前 10 |

### 10.3 盈利阶段目标（上线 6 个月）

| 指标 | 目标 |
|-----|------|
| 月活用户 | 10,000+ |
| 付费用户 | 100+ |
| MRR | $1,000+ |
| 主词排名 | 前 10 |

---

## 十一、后续规划

### 11.1 Phase 4 功能（上线后迭代）

1. **PDF 提取**
   - 文件上传
   - PDF 解析
   - 文本提取

2. **YouTube 提取**
   - 视频 URL 解析
   - 描述和字幕提取
   - 关键词分析

3. **提取历史**
   - 30 天历史记录
   - 搜索和筛选
   - 批量导出

### 11.2 未来功能（待验证）

- API 接口开放
- 团队协作功能
- 浏览器扩展
- 多语言支持
- 关键词建议（基于提取结果）

---

## 十二、附录

### 12.1 相关文档

| 文档 | 路径 | 说明 |
|-----|------|------|
| 关键词研究 | `1-suzhen/KEYWORD-RESEARCH.md` | Semrush/Ahrefs 数据 |
| 竞品分析 | `1-suzhen/COMPETITOR-ANALYSIS.md` | 4 家竞品详细对比 |
| 网站结构 | `1-suzhen/SITE-STRUCTURE.md` | 页面层级和内链策略 |
| 首页设计 | `1-suzhen/HOMEPAGE-DESIGN.md` | UI/UX 设计规格 |
| UI 组件 | `1-suzhen/UI-COMPONENTS.md` | HyperUI 组件参考 |
| 定价方案 | `1-suzhen/PRICING.md` | 详细定价逻辑 |
| MVP 规格 | `1-suzhen/MVP-SPEC.md` | 功能详细规格 |
| 开发任务 | `DEVELOPMENT-TASKS.md` | 33 个开发任务 |
| 技术栈 | `1-suzhen/TECH-STACK.md` | 技术选型说明 |
| SEO 策略 | `1-suzhen/GEO-AI-SEO.md` | GEO 和 AI SEO 策略 |

### 12.2 决策记录

| 决策 | 选择 | 理由 | 日期 |
|-----|------|------|------|
| 主关键词 | `extract keywords` | 搜索意图是"使用工具" | 2026-05-28 |
| 商业模式 | Freemium | 免费捕获流量，付费变现 | 2026-05-28 |
| 定价层级 | 单层 | 简化决策，先验证需求 | 2026-05-28 |
| 定价 | $9.99/月 | 心理舒适区，低于 $10 | 2026-05-28 |
| 语言支持 | 只做英语 | 英语分词简单，MVP 聚焦 | 2026-05-28 |
| AI 模型 | DeepSeek | 成本低，性能好 | 2026-05-28 |
| Robots.txt | 遵守 | 避免法律风险和 IP 被封 | 2026-05-28 |
| 免费版限制 | 未登录每日 10 次 | 平衡体验和转化 | 2026-05-28 |
| UI 组件库 | HyperUI + shadcn/ui | 免费，区块 + 组件覆盖全面 | 2026-05-29 |

---

## 十三、联系方式

| 角色 | 联系方式 |
|-----|---------|
| 产品负责人 | 主人 (Stefan) |
| 文档作者 | 素贞 |
| 开发执行 | Claude Code |

---

**文档版本历史：**

| 版本 | 日期 | 修改内容 |
|-----|------|---------|
| 1.0 | 2026-05-28 | 初版创建 |
| 1.1 | 2026-05-29 | 添加 UI 组件库选型（HyperUI） |

---

*本文档整合自项目所有规划文档，作为产品开发的权威参考。*
