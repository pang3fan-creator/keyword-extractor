# 竞品分析：Keyword Extractor 工具

## 竞品概览

| 竞品 | URL | 定位 | 类型 | 定价模式 |
|-----|-----|------|------|---------|
| QuestionDB | questiondb.io/keyword-extractor | AI Keyword Extractor | AI 工具 | Freemium |
| Divhunt | divhunt.com/tools/extract-keywords-from-text | Keyword Extractor API | 开发者工具 | Freemium + Credit |
| Webaloha | webaloha.co/tools/keyword-extractor | Keyword Extractor Tool | 传统工具 | **完全免费** |
| TunePocket | tunepocket.com/youtube-channel-keywords-copy | YouTube Keywords | 垂直工具 | 未知 |

---

## 1. QuestionDB - AI 路线

### 产品特点

- ✅ 支持**文本输入**和 **URL 输入**两种模式
- ✅ 使用 AI 语义理解（不是简单词频）
- ✅ 字符限制：35,000 字符
- ✅ 有完整的工具矩阵：
  - Keyword Extractor
  - Keyword Research
  - AI Entity Extractor
  - AI Content Analysis
  - AI Outline Generator

### 定价策略

| 套餐 | 价格 | 定位 |
|-----|------|------|
| Free | $0/mo | 试用 |
| Solo | $9.99/mo | 个人研究者 |
| Business | Popular | 小企业 |
| Enterprise | $69.99/mo | 大企业 |

### SEO 内容

- H1: "AI Keyword Extractor"
- H2: "Instantly extract keywords from your content or webpage URL..."
- FAQ 模块：
  - How accurate is the AI Keyword Extractor?
  - What types of content can I analyze?
  - What languages are supported?
- 功能说明模块：
  - What is AI Keyword Extractor?
  - Features & Benefits of Using AI Keyword Extractor

### 优势与劣势

| 优势 | 劣势 |
|-----|------|
| AI 加持，效果更智能 | 有成本，免费额度有限 |
| 工具矩阵完整 | 需要注册才能使用完整功能 |
| SEO 内容结构完整 | |

---

## 2. Divhunt - API 路线

### 产品特点

- ✅ 提供 **REST API**（开发者友好）
- ✅ 可配置参数：
  - `text`（必填）
  - `limit`（返回关键词数量）
  - `minLength`（最小词长）
- ✅ 返回 JSON 格式：`{"word": "...", "count": N}`
- ❌ **不是面向普通用户**的在线工具
- ❌ 无 URL 输入功能

### 示例响应

```json
{
  "keywords": [
    {"word": "learning", "count": 4},
    {"word": "machine", "count": 3},
    {"word": "models", "count": 1},
    {"word": "deep", "count": 1},
    {"word": "neural", "count": 1}
  ]
}
```

### 定价策略

| 套餐 | 价格 | 说明 |
|-----|------|------|
| Free | $0 Forever | 基础额度 |
| Custom | 联系销售 | 企业定制 |

- 按 Credit 计费：1 credit / run

### SEO 内容

- 较少，主要是 API 文档
- FAQ 模块：
  - What does the keyword extractor return?
  - Does it filter out common words?
  - Can I limit the number of keywords?
  - How do I call the keyword extractor API?
  - What is the minimum word length?

### 优势与劣势

| 优势 | 劣势 |
|-----|------|
| 开发者友好，API 可集成 | 面向开发者，不是 SEO 从业者 |
| 免费 | 无 URL 输入功能 |
| | 功能简单（纯词频） |

---

## 3. Webaloha - 传统工具 + SEO 内容

### 产品特点

- ✅ 支持文本和 URL 输入
- ✅ 显示词频、关键词密度
- ✅ 显示 1-word, 2-word, 3-word 短语
- ✅ **完全免费**（是 SEO Agency 的引流工具）
- ✅ 大量内部链接到其他工具

### 定价策略

**完全免费**，作为 Webaloha SEO Agency 的引流工具。

### SEO 内容（重点学习）

- H1: "Keyword Extractor Tool Online"
- H2: "How the Keyword Extractor Works"
- H2: "Why Keyword Extraction Matters for SEO"
- H2: "How to Use Keyword Extraction Results"
- H2: "Keyword Extractor: FAQ"
- H2: "Need Help with Keyword Strategy?"

### 内部链接策略

工具内部链接：
- Meta Tag Checker
- Schema Markup Validator
- Keyword Generator
- Website Word Counter

服务页面链接：
- SEO Services
- GEO Services
- Web Design

### 优势与劣势

| 优势 | 劣势 |
|-----|------|
| 免费 + SEO 内容丰富 | 功能简单（词频统计），无 AI |
| 内部链接策略完善 | 是引流工具，不是核心产品 |
| 内容结构清晰 | |

---

## 功能对比矩阵

| 功能 | QuestionDB | Divhunt | Webaloha | 机会 |
|-----|-----------|---------|----------|------|
| 文本输入 | ✅ | ✅ | ✅ | 必备 |
| URL 输入 | ✅ | ❌ | ✅ | 必备 |
| AI 提取 | ✅ | ❌ | ❌ | **差异化点** |
| 词频统计 | ❌ | ✅ | ✅ | 基础功能 |
| 2-word/3-word 短语 | ❓ | ❌ | ✅ | **可加** |
| PDF 提取 | ❌ | ❌ | ❌ | **差异化点** |
| YouTube 提取 | ❌ | ❌ | ❌ | **差异化点** |
| 多语言支持 | ✅ | ❌ | ❓ | 可考虑 |
| API 接口 | ❌ | ✅ | ❌ | V3 功能 |
| 导出功能 | ❓ | ❌ | ❓ | 必备 |

---

## SEO 对比矩阵

| 维度 | QuestionDB | Divhunt | Webaloha | 学习方向 |
|-----|-----------|---------|----------|---------|
| SEO 内容丰富度 | 中 | 低 | **高** | 学习 Webaloha |
| 内部链接 | 中 | 低 | **高** | 学习 Webaloha |
| FAQ 模块 | ✅ | ✅ | ✅ | 必备 |
| 工具矩阵 | ✅ | ✅ | ✅ | 必备 |

---

## 差异化策略建议

### 产品定位

| 版本 | 功能 | 定位 | 参考对象 |
|-----|------|------|---------|
| **免费版** | 词频统计 + 2-word/3-word 短语 | 流量入口 | Webaloha |
| **付费版** | AI 提取 + PDF/YouTube 提取 | 增值变现 | QuestionDB |

### 功能优先级

#### MVP（必须有）
- [x] 文本输入 → 词频统计
- [x] URL 输入 → 抓取后统计
- [x] 2-word/3-word 短语分析
- [x] 导出功能（CSV/TXT）
- [x] SEO 内容（How it works, Why it matters, FAQ）

#### V2（差异化）
- [ ] AI 提取（付费）
- [ ] PDF 提取
- [ ] YouTube 视频/频道关键词提取

#### V3（护城河）
- [ ] 批量 URL 提取
- [ ] 关键词对比（竞品分析）
- [ ] API 接口

### SEO 策略

#### 内容结构（学习 Webaloha）

1. **How the Keyword Extractor Works**
   - 技术原理说明
   - 使用步骤

2. **Why Keyword Extraction Matters for SEO**
   - SEO 价值说明
   - 使用场景

3. **How to Use Keyword Extraction Results**
   - 实操指南
   - 最佳实践

4. **FAQ**
   - 常见问题解答
   - 长尾词覆盖

#### 长尾词覆盖

| 关键词 | 搜索量 | 优先级 |
|--------|--------|--------|
| extract keywords from text | 500 | 高 |
| extract keywords from URL | 50 | 高 |
| extract keywords from PDF | 50 | **中（差异化）** |
| YouTube keyword extractor | 500 | **高（差异化）** |
| ai keyword extraction | 50 | 中 |
| keyword extraction online | 50 | 中 |

---

## 下一步行动

1. [ ] 确定域名
2. [ ] 设计首页布局（参考 Webaloha 的工具页）
3. [ ] 开发 MVP 功能
4. [ ] 编写 SEO 内容
5. [ ] 部署上线
