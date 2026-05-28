# 项目进度：Keyword Extractor Tool

## 项目概况

- **项目名称：** Keyword Extractor Tool
- **目标关键词：** `extract keywords` 及长尾词
- **项目类型：** 工具站（Freemium 模式）
- **创建日期：** 2026-05-28

---

## 进度记录

### 2026-05-28

#### ✅ 已完成

1. **关键词研究**
   - 数据收集：Semrush、Google Trends、Ahrefs、Google Keyword Planner
   - 数据分析：搜索量、KD、趋势、SERP
   - 结论：可以做，KD 11%，趋势回升

2. **竞品分析**
   - QuestionDB：AI 路线，Freemium 定价
   - Divhunt：API 路线，开发者向
   - Webaloha：传统工具 + 丰富 SEO 内容
   - 差异化机会：AI 提取、PDF 提取、YouTube 提取

3. **文档整理**
   - 创建项目文件夹
   - 保存关键词研究文档
   - 保存竞品分析文档

4. **项目基础信息**
   - 域名：extractkeywords.com ✅ 已购买
   - 品牌名：ExtractKeywords
   - 项目邮箱：support@extractkeywords.com

5. **技术栈选型**
   - 部署：Vercel
   - 框架：Next.js + Tailwind CSS
   - 认证：Clerk
   - 支付：Creem
   - 邮件：Resend
   - 数据库：Supabase
   - AI：DeepSeek / 阿里云

6. **网站结构设计**
   - 首页 + 功能落地页 + 博客
   - 必备页面：Privacy, Terms, Contact, Pricing
   - 内部链接策略

7. **GEO & AI SEO 策略**
   - Schema.org 结构化数据
   - AI 爬虫友好的 robots.txt
   - E-E-A-T 信号
   - 内容结构优化

#### ✅ 已完成（续）

8. **首页设计规格**
   - 工具页定位（非营销页）
   - H1 + 工具区 + SEO 内容区布局
   - Tab 切换：Text / URL / AI
   - 结果展示区设计
   - SEO 内容结构：How-to / Why / Use Cases / FAQ
   - 文档：`1-suzhen/HOMEPAGE-DESIGN.md`

9. **定价方案**
   - 单层定价：Free + Pro
   - 价格：$9.99/月，$99/年
   - 免费版：5000 字上限，不强制注册
   - AI 内部上限：2000 次/月（不告知用户）
   - 文档：`1-suzhen/PRICING.md`

10. **MVP 功能规格**
    - 文本提取、URL 提取、2词/3词短语
    - AI 语义提取（付费）
    - PDF/YouTube 提取（后期）
    - API 接口设计
    - 开发优先级划分
    - 文档：`1-suzhen/MVP-SPEC.md`

11. **开发任务拆分**
    - Phase 0: 项目初始化（5 个任务）
    - Phase 1: 核心功能（11 个任务）
    - Phase 2: 用户系统 + 支付（9 个任务）
    - Phase 3: SEO 内容（8 个任务）
    - Phase 4: 差异化功能（后期）
    - 数据库设计 + 验收标准
    - 文档：`0-Develop_Doc/DEVELOPMENT-TASKS.md`

#### 🔄 进行中

- 等待主人确认开发任务

#### 📋 待办

1. [x] 域名选择 → `extractkeywords.com` ✅
2. [x] 技术栈选择 → Next.js + Tailwind + Clerk + Creem ✅
3. [x] 网站结构设计 ✅
4. [x] 首页设计规格 ✅
5. [x] 定价方案 ✅
6. [x] MVP 功能详细规格 ✅
7. [x] 技术决策确认 ✅
8. [x] 开发任务拆分 ✅
9. [ ] Claude Code 开发启动

---

## 项目决策记录

### 决策 1：选择 `extract keywords` 而非 `keyword extraction`

**原因：**
- `extract keywords` 搜索意图是"使用工具"
- `keyword extraction` 搜索意图是"学习/研究"
- 工具站更适合前者

**日期：** 2026-05-28

---

### 决策 2：采用 Freemium 模式

**免费版：**
- 词频统计
- 2-word/3-word 短语分析
- URL 输入

**付费版：**
- AI 提取
- PDF 提取
- YouTube 提取

**原因：**
- 免费版捕获流量
- 付费版差异化变现
- 成本可控（只有付费用户消耗 API）

**日期：** 2026-05-28

---

### 决策 3：暂停 niche-mining-pipeline 自动任务

**原因：** 专注关键词分析，避免干扰

**日期：** 2026-05-28

---

### 决策 4：MVP 技术决策

| 问题 | 决策 |
|-----|------|
| 语言支持 | 只做英语，不做中文分词 |
| AI 模型 | DeepSeek |
| Robots.txt | 遵守目标网站的 robots.txt |
| 免费版限制 | 未登录用户每日10次，注册后不限 |

**原因：**
- 英语分词简单（空格分隔），中文需要额外处理
- DeepSeek 成本低，性能好
- 遵守 robots.txt 避免法律风险和 IP 被封
- 注册后不限，降低用户抵触心理

**日期：** 2026-05-28

---

## 关键数据速查

| 指标 | 数值 |
|-----|------|
| 月搜索量（主词） | 5,000 |
| KD 难度 | 11% |
| 所需外链 | 0 |
| CPC | $3.47 |
| 趋势 | 回升中 |

---

## 下次会议议题

- [x] 域名选择 → `extractkeywords.com` ✅ 已购买
- [x] 技术栈选择 → Next.js + Tailwind + Clerk + Creem + Resend + Supabase
- [x] 网站结构设计 ✅
- [x] GEO & AI SEO 策略 ✅
- [x] 首页设计细节 ✅
- [x] MVP 功能详细规格 ✅
- [x] 技术决策确认 ✅
- [ ] 开发任务拆分
- [ ] Claude Code 开发启动
