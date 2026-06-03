# MVP 功能规格

## 一、功能概览

| 功能 | 免费/付费 | MVP 必须？ | 说明 |
|-----|----------|----------|------|
| 文本关键词提取 | 免费 | ✅ 必须 | 核心功能 |
| URL 抓取提取 | 免费 | ✅ 必须 | 核心功能 |
| 2词/3词短语分析 | 免费 | ✅ 必须 | 差异化 |
| AI 语义提取 | 付费 | ✅ 必须 | 变现核心 |
| PDF 提取 | 付费 | ⚠️ 可后期 | 差异化 |
| YouTube 提取 | 付费 | ⚠️ 可后期 | 差异化 |
| 提取历史记录 | 付费 | ⚠️ 可后期 | 用户留存 |

**MVP 第一版范围：**
- 文本提取 + URL 提取 + 2词/3词短语 ✅
- AI 语义提取 ✅
- PDF 提取 ⚠️ 后期
- YouTube 提取 ⚠️ 后期
- 提取历史 ⚠️ 后期

---

## 二、功能 1：文本关键词提取

### 2.1 功能描述

用户粘贴文本，系统提取关键词并展示词频统计。

### 2.2 输入

| 项目 | 规格 |
|-----|------|
| 输入类型 | 纯文本 |
| 字数上限 | 免费版 10,000 字符，Pro 无限 |
| 支持语言 | 英文为主，中文支持基础版 |
| 格式 | 纯文本，自动过滤 HTML 标签 |

### 2.3 处理逻辑

**Step 1: 文本清洗**
```
1. 移除 HTML 标签（如 <p>, <div>）
2. 移除特殊字符（保留字母、数字、连字符）
3. 统一大小写（转小写）
4. 移除多余空格
```

**Step 2: 分词**
```
英文：按空格分词
中文：使用 jieba 分词（基础支持）
```

**Step 3: 停用词过滤**
```
使用标准停用词列表：
- 英文停用词：the, is, at, which, on...
- 中文停用词：的、是、在、有...
```

**Step 4: 词频统计**
```
统计每个词出现次数
计算词频密度 = (词出现次数 / 总词数) × 100%
```

**Step 5: 排序输出**
```
按词频降序排列
相同词频按字母升序
```

### 2.4 输出

**表格形式：**

| Keyword | Count | Density |
|---------|-------|---------|
| keyword | 15 | 2.3% |
| extraction | 12 | 1.8% |
| tool | 10 | 1.5% |

**JSON 格式（API 内部）：**
```json
{
  "total_words": 654,
  "unique_keywords": 42,
  "keywords": [
    {"word": "keyword", "count": 15, "density": 2.3},
    {"word": "extraction", "count": 12, "density": 1.8}
  ]
}
```

### 2.5 边界情况

| 情况 | 处理方式 |
|-----|---------|
| 空输入 | 提示 "Please enter some text" |
| 仅停用词 | 提示 "No keywords found. Try adding more content." |
| 超长文本 | 免费版提示升级，Pro 正常处理 |
| 特殊语言 | 仅支持英文 + 中文，其他语言提示不支持 |

### 2.6 性能要求

| 指标 | 目标 |
|-----|------|
| 处理时间 | < 1 秒（10,000 字内） |
| 最大支持 | 100,000 字符（Pro） |

---

## 三、功能 2：URL 抓取提取

### 3.1 功能描述

用户输入 URL，系统抓取网页内容并提取关键词。

### 3.2 输入

| 项目 | 规格 |
|-----|------|
| 输入类型 | URL 字符串 |
| 协议 | http / https |
| 格式校验 | 实时校验 URL 格式 |

### 3.3 处理逻辑

**Step 1: URL 校验**
```
1. 检查 URL 格式（正则匹配）
2. 检查协议（仅允许 http/https）
3. 检查域名（禁止内网 IP、localhost）
```

**Step 2: 内容抓取**
```
使用 fetch 或 axios 抓取
超时设置：10 秒
User-Agent: ExtractKeywordsBot/1.0
```

**Step 3: 内容提取**
```
使用 cheerio 或 jsdom 解析 HTML
提取 <body> 内容
移除 <script>, <style>, <nav>, <footer> 等非正文区域
提取 <meta description> 作为补充
```

**Step 4: 复用文本提取逻辑**
```
调用功能 1 的处理逻辑
```

### 3.4 输出

同功能 1（表格 + JSON）

**额外信息：**
```json
{
  "source_url": "https://example.com/article",
  "page_title": "Article Title",
  "word_count": 1234,
  "keywords": [...]
}
```

### 3.5 边界情况

| 情况 | 处理方式 |
|-----|---------|
| 无效 URL | 提示 "Please enter a valid URL" |
| 抓取失败 | 提示 "Failed to fetch content. Please check the URL." |
| 超时 | 提示 "Request timed out. Try again later." |
| 403/404 | 提示 "Page not accessible" |
| JS 渲染页面 | 提示 "Dynamic pages not supported yet" |

### 3.6 性能要求

| 指标 | 目标 |
|-----|------|
| 抓取时间 | < 5 秒 |
| 超时设置 | 10 秒 |
| 重试机制 | 无重试，直接返回错误 |

### 3.7 Robots.txt 合规

**遵守目标网站的 robots.txt**

```
用户输入URL → 解析域名 → 获取 robots.txt →
  ├─ 允许抓取 → 执行抓取
  └─ 禁止抓取 → 返回提示 "This site doesn't allow automated extraction"
```

**实现方式：**

```javascript
async function checkRobotsTxt(url) {
  const domain = new URL(url).origin;
  const robotsUrl = `${domain}/robots.txt`;

  try {
    const response = await fetch(robotsUrl);
    const robotsTxt = await response.text();

    // 解析 robots.txt
    const parser = new RobotsParser(robotsTxt);
    const allowed = parser.canFetch('ExtractKeywordsBot', url);

    return allowed;
  } catch (error) {
    // robots.txt 不存在，默认允许
    return true;
  }
}
```

**User-Agent：** `ExtractKeywordsBot/1.0`

**注意事项：**
- robots.txt 不存在时默认允许
- 检查结果可缓存 24 小时
- 避免 Crawl-delay 过长的网站

---

## 四、功能 3：2词/3词短语分析

### 4.1 功能描述

在单字关键词基础上，增加 2 词短语（bigram）和 3 词短语（trigram）分析。

### 4.2 处理逻辑

**2 词短语（Bigram）：**
```
文本: "keyword extraction tool"
短语: "keyword extraction", "extraction tool"
```

**3 词短语（Trigram）：**
```
文本: "keyword extraction tool online"
短语: "keyword extraction tool", "extraction tool online"
```

**过滤规则：**
- 短语必须包含至少 1 个非停用词
- 出现次数 ≥ 2 才显示
- 按频次降序排列

### 4.3 输出

**Tab 切换展示：**

```
[All Keywords] [1-word] [2-word] [3-word]
```

**2-word 表格：**

| Phrase | Count | Density |
|--------|-------|---------|
| keyword extraction | 8 | 1.2% |
| content strategy | 5 | 0.8% |

**3-word 表格：**

| Phrase | Count | Density |
|--------|-------|---------|
| keyword extraction tool | 4 | 0.6% |

### 4.4 边界情况

| 情况 | 处理方式 |
|-----|---------|
| 无 2 词短语 | 隐藏 2-word Tab |
| 无 3 词短语 | 隐藏 3-word Tab |
| 短文本 | 可能无短语，正常提示 |

---

## 五、功能 4：AI 语义提取（付费）

### 5.1 功能描述

使用 AI 模型提取语义关键词，不仅仅是词频统计，而是理解文本主题。

### 5.2 与普通提取的区别

| 对比项 | 普通提取 | AI 提取 |
|-------|---------|--------|
| 方法 | 词频统计 | 语义理解 |
| 结果 | 高频词 | 核心主题词 |
| 适用 | 长文本 | 任意长度 |
| 速度 | < 1 秒 | 3-5 秒 |

**示例：**
```
文本: "Our company provides SEO services including keyword research, 
       link building, and content optimization for small businesses."

普通提取: SEO (2), keyword (1), link (1), content (1)
AI 提取: SEO services, keyword research, link building, 
         content optimization, digital marketing
```

### 5.3 输入

同功能 1（文本输入）

### 5.4 处理逻辑

**AI 模型：** DeepSeek 或 阿里云通义千问

**Prompt 设计：**
```
You are a keyword extraction expert. Extract the most important 
keywords and phrases from the following text. Focus on:

1. Main topics and themes
2. Industry-specific terms
3. Action words and concepts
4. Named entities (products, brands, etc.)

Return a JSON array with keywords sorted by importance.
Maximum 20 keywords.

Text: {user_input}

Output format:
{
  "keywords": [
    {"keyword": "...", "relevance": 0.95, "category": "topic"},
    ...
  ]
}
```

### 5.5 输出

**表格形式：**

| Keyword | Relevance | Category |
|---------|-----------|----------|
| SEO services | 0.95 | topic |
| keyword research | 0.89 | service |
| digital marketing | 0.82 | industry |

### 5.6 边界情况

| 情况 | 处理方式 |
|-----|---------|
| AI 超时 | 提示 "AI extraction taking longer. Please try again." |
| AI 错误 | 降级到普通提取 + 提示 "AI unavailable, showing basic results" |
| 配额用尽 | 提示 "AI limit reached this month" |

### 5.7 性能要求

| 指标 | 目标 |
|-----|------|
| 响应时间 | 3-5 秒 |
| 超时设置 | 15 秒 |
| 月配额 | 2000 次（内部限制） |

---

## 六、功能 5：PDF 提取（后期）

### 6.1 功能描述

用户上传 PDF 文件，系统提取文本后分析关键词。

### 6.2 输入

| 项目 | 规格 |
|-----|------|
| 文件格式 | PDF |
| 文件大小 | 最大 10MB |
| 页数限制 | 最大 100 页 |

### 6.3 处理逻辑

```
1. 上传 PDF 到临时存储
2. 使用 pdf-parse 或 pymupdf 提取文本
3. 调用文本提取逻辑
4. 删除临时文件
```

### 6.4 MVP 阶段

**暂不实现，后期添加**

---

## 七、功能 6：YouTube 提取（后期）

### 7.1 功能描述

用户输入 YouTube 视频链接，提取视频描述和字幕中的关键词。

### 7.2 输入

| 项目 | 规格 |
|-----|------|
| URL 格式 | youtube.com/watch?v=xxx 或 youtu.be/xxx |

### 7.3 处理逻辑

```
1. 解析视频 ID
2. 调用 YouTube Data API 获取视频描述
3. 调用 YouTube Transcript API 获取字幕
4. 合并描述 + 字幕文本
5. 调用文本提取逻辑
```

### 7.4 边界情况

| 情况 | 处理方式 |
|-----|---------|
| 无字幕视频 | 仅提取描述内容 |
| 私有视频 | 提示 "Video not accessible" |
| API 限制 | 提示 "YouTube API limit reached" |

### 7.5 MVP 阶段

**暂不实现，后期添加**

---

## 八、功能 7：提取历史记录（后期）

### 8.1 功能描述

付费用户可查看过去 30 天的提取历史。

### 8.2 数据存储

**Supabase 表结构：**

```sql
CREATE TABLE extraction_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  input_type TEXT CHECK (input_type IN ('text', 'url', 'pdf', 'youtube')),
  input_preview TEXT, -- 前 100 字符
  keyword_count INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '30 days'
);
```

### 8.3 MVP 阶段

**暂不实现，后期添加**

---

## 九、结果导出

### 9.1 CSV 导出

**格式：**
```csv
keyword,count,density
keyword,15,2.3
extraction,12,1.8
tool,10,1.5
```

**文件名：** `keywords_YYYYMMDD_HHMMSS.csv`

### 9.2 Copy to Clipboard

点击按钮，复制关键词列表到剪贴板

**格式：**
```
keyword, extraction, tool, content, analysis...
```

---

## 十、用户系统

### 10.1 认证方式

**Clerk 认证**

| 项目 | 规格 |
|-----|------|
| 登录方式 | Email + Password, Google OAuth |
| 邮箱验证 | 可选（不强制） |
| 密码重置 | Clerk 自带 |

### 10.2 用户角色

| 角色 | 说明 |
|-----|------|
| Guest | 未登录，可使用免费功能 |
| Free User | 已登录，免费功能 |
| Pro User | 已付费，全部功能 |

### 10.3 权限控制

| 功能 | Guest | Free User | Pro User |
|-----|-------|-----------|----------|
| 文本提取 | ✅ 每日10次 | ✅ 无限 | ✅ 无限 |
| URL 提取 | ✅ 每日10次 | ✅ 无限 | ✅ 无限 |
| AI 提取 | ❌ | ❌ | ✅ |
| PDF 提取 | ❌ | ❌ | ✅ |
| YouTube 提取 | ❌ | ❌ | ✅ |
| 提取历史 | ❌ | ❌ | ✅ |

### 10.4 次数限制实现

**未登录用户：每日 10 次**

**统计方式：Cookie + IP 双重方案**

```javascript
// 1. 优先读取 Cookie
const cookieCount = getCookie('daily_usage_count');

// 2. Cookie 不存在，读取 IP 记录
if (!cookieCount) {
  const ipCount = await getIPUsageCount(userIP);
  return ipCount;
}

// 3. 返回当前使用次数
return cookieCount;
```

**限制逻辑：**

```
用户访问 → 检查是否登录
  ├─ 已登录 → 无限制（免费用户）/ 无限（付费用户）
  └─ 未登录 → 检查今日使用次数
       ├─ < 10 次 → 正常使用，计数 +1
       └─ ≥ 10 次 → 提示注册
```

**Cookie 设置：**
- 过期时间：当日 23:59:59
- 内容：`daily_usage_count=5`
- 路径：`/`

**IP 记录（后端）：**
```sql
CREATE TABLE ip_usage (
  ip_address TEXT PRIMARY KEY,
  date DATE,
  count INTEGER DEFAULT 0
);
```

**每日凌晨自动清理过期记录**

---

## 十一、API 接口设计（内部）

### 11.1 文本提取 API

```
POST /api/extract/text

Request:
{
  "text": "user input text...",
  "options": {
    "include_bigrams": true,
    "include_trigrams": true
  }
}

Response:
{
  "success": true,
  "data": {
    "total_words": 654,
    "keywords": [...],
    "bigrams": [...],
    "trigrams": [...]
  }
}
```

### 11.2 URL 提取 API

```
POST /api/extract/url

Request:
{
  "url": "https://example.com/article",
  "options": {
    "include_bigrams": true,
    "include_trigrams": true
  }
}

Response:
{
  "success": true,
  "data": {
    "source_url": "...",
    "page_title": "...",
    "keywords": [...],
    ...
  }
}
```

### 11.3 AI 提取 API

```
POST /api/extract/ai

Request:
{
  "text": "user input text..."
}

Response:
{
  "success": true,
  "data": {
    "keywords": [
      {"keyword": "...", "relevance": 0.95, "category": "topic"}
    ]
  }
}
```

---

## 十二、错误处理

### 12.1 错误码

| 错误码 | 说明 |
|-------|------|
| 400 | 请求参数错误 |
| 401 | 未授权（需登录） |
| 403 | 权限不足（需付费） |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

### 12.2 错误响应格式

```json
{
  "success": false,
  "error": {
    "code": "INVALID_URL",
    "message": "Please enter a valid URL"
  }
}
```

---

## 十三、MVP 开发优先级

### Phase 1: 核心功能（必须）

| 优先级 | 功能 | 预计工时 |
|-------|------|---------|
| P0 | 文本关键词提取 | 1 天 |
| P0 | 2词/3词短语分析 | 0.5 天 |
| P0 | 结果展示 + 导出 | 0.5 天 |
| P0 | URL 抓取提取 | 1 天 |

### Phase 2: 付费功能（必须）

| 优先级 | 功能 | 预计工时 |
|-------|------|---------|
| P0 | 用户认证（Clerk） | 0.5 天 |
| P0 | AI 提取集成 | 1 天 |
| P0 | 支付集成（Creem） | 1 天 |
| P0 | 权限控制 | 0.5 天 |

### Phase 3: 差异化功能（后期）

| 优先级 | 功能 | 预计工时 |
|-------|------|---------|
| P1 | PDF 提取 | 1 天 |
| P1 | YouTube 提取 | 1.5 天 |
| P2 | 提取历史记录 | 1 天 |

### Phase 4: SEO 完善（后期）

| 优先级 | 功能 | 预计工时 |
|-------|------|---------|
| P1 | 博客系统 | 1 天 |
| P1 | 落地页 SEO 内容 | 2 天 |
| P2 | Schema.org 结构化数据 | 0.5 天 |

---

## 十四、技术实现细节

### 14.1 停用词列表

**英文停用词（部分）：**
```javascript
const ENGLISH_STOP_WORDS = [
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
  'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'this',
  'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
  'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all', 'each',
  'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no',
  'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just'
];
```

**中文停用词（部分）：**
```javascript
const CHINESE_STOP_WORDS = [
  '的', '是', '在', '有', '和', '与', '了', '不', '这', '那', '我', '你',
  '他', '她', '它', '我们', '你们', '他们', '什么', '怎么', '如何', '为',
  '因为', '所以', '但', '而', '或', '如果', '就', '也', '都', '又', '还'
];
```

### 14.2 词频统计算法

```javascript
function extractKeywords(text, options = {}) {
  // 1. 文本清洗
  const cleanedText = text
    .toLowerCase()
    .replace(/<[^>]*>/g, '') // 移除 HTML
    .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ') // 保留中文
    .replace(/\s+/g, ' ')
    .trim();

  // 2. 分词
  const words = cleanedText.split(' ').filter(w => w.length > 0);

  // 3. 过滤停用词
  const filteredWords = words.filter(w => 
    !ENGLISH_STOP_WORDS.includes(w) && 
    !CHINESE_STOP_WORDS.includes(w)
  );

  // 4. 词频统计
  const wordCount = {};
  filteredWords.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // 5. 排序
  const sorted = Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .map(([word, count]) => ({
      word,
      count,
      density: ((count / filteredWords.length) * 100).toFixed(1)
    }));

  return {
    total_words: filteredWords.length,
    unique_keywords: sorted.length,
    keywords: sorted
  };
}
```

---

## 十五、已确认事项

| 问题 | 决策 |
|-----|------|
| 语言支持 | MVP 只做英语，不做中文分词 |
| AI 模型 | DeepSeek |
| Robots.txt | 遵守目标网站的 robots.txt |
| 免费版限制 | 未登录用户每日10次，注册后不限 |

---

*功能规格文档创建：2026-05-28*
*决策确认：2026-05-28*
*待主人审阅后交给 Claude Code 开发*
