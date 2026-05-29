# UI 组件参考 - HyperUI

## 一、组件来源

- **主要来源**：HyperUI（免费，MIT 协议）
- **网站**：https://www.hyperui.dev/
- **使用方式**：直接复制 HTML 代码，粘贴到项目中

---

## 二、组件清单

### 2.1 Header 导航栏

**链接**：https://www.hyperui.dev/components/marketing/headers

**推荐款式**：
- Header 1-8 任选，推荐简洁款
- 需要包含：Logo + Pricing + Login

**示例结构**：
```
Logo (左) | Pricing | Login (右)
```

---

### 2.2 Hero 区（需自己写）

**说明**：HyperUI 没有独立的 Hero 组件，需要自己写。

**参考代码**：
```html
<section class="py-12 text-center">
  <h1 class="text-4xl font-bold text-gray-900">
    Extract Keywords from Text or URL
  </h1>
  <p class="mt-4 text-lg text-gray-600">
    Free online keyword extraction tool - Instant results, no signup required
  </p>
</section>
```

---

### 2.3 Tab 切换组件

**链接**：https://www.hyperui.dev/components/application/tabs

**推荐款式**：Tab 样式简单的款（如 Base）

**用途**：
- Text / URL / AI 三个 Tab 切换
- AI Tab 需要添加 "PRO" 徽章

---

### 2.4 文本输入框（Textarea）

**链接**：https://www.hyperui.dev/components/application/textareas

**推荐款式**：Base 或带 label 的款式

**需求**：
- 高度约 250px
- 右下角显示字数统计
- Placeholder: "Paste your text here..."

---

### 2.5 URL 输入框（Input）

**链接**：https://www.hyperui.dev/components/application/inputs

**推荐款式**：带 label 的 input

**需求**：
- 单行输入
- Placeholder: "https://example.com/your-article"
- URL 格式校验

---

### 2.6 按钮

**链接**：https://www.hyperui.dev/components/marketing/buttons

**推荐款式**：Primary 样式的大按钮

**用途**：
- 主按钮："Extract Keywords"
- 次要按钮："Download CSV"、"Copy to Clipboard"

---

### 2.7 结果表格

**链接**：https://www.hyperui.dev/components/application/tables

**推荐款式**：Bordered 或 Striped

**表格字段**：
| Keyword | Count | Density |
|---------|-------|---------|
| keyword | 15 | 2.3% |

**需求**：
- 支持排序（点击表头）
- 响应式设计

---

### 2.8 How it Works 步骤

**链接**：https://www.hyperui.dev/components/application/steps

**推荐款式**：横向或纵向步骤条

**内容**：
1. Paste Text or Enter URL
2. Click Extract
3. Download Results

---

### 2.9 FAQ 手风琴

**链接**：https://www.hyperui.dev/components/marketing/faqs

**推荐款式**：带箭头展开的手风琴

**需求**：
- 6-8 个 FAQ 问题
- 需要添加 FAQPage Schema

---

### 2.10 Pricing 定价表

**链接**：https://www.hyperui.dev/components/marketing/pricing

**推荐款式**：两列对比（Free vs Pro）

**内容**：
| Free | Pro |
|------|-----|
| $0 | $9.99/月 |
| 基础功能 | 全部功能 |

---

### 2.11 CTA 区块

**链接**：https://www.hyperui.dev/components/marketing/ctas

**推荐款式**：简洁的 CTA 区块

**内容**：
- 标题："Start Extracting Keywords Now"
- 副标题："No signup required. Free forever."
- 按钮："Try Free Tool"

---

### 2.12 Footer 页脚

**链接**：https://www.hyperui.dev/components/marketing/footers

**推荐款式**：简洁的三列布局

**内容**：
```
ExtractKeywords
Free keyword extraction tool

Product    Resources    Legal
Pricing    Blog         Privacy
           Guides       Terms
                        Contact

© 2026 ExtractKeywords. All rights reserved.
```

---

### 2.13 加载动画

**链接**：https://www.hyperui.dev/components/application/loaders

**推荐款式**：Spinner 或 Dots

**用途**：
- 点击 "Extract Keywords" 按钮后显示
- API 请求期间

---

### 2.14 下拉菜单（用户菜单）

**链接**：https://www.hyperui.dev/components/application/dropdowns

**推荐款式**：带用户头像的下拉菜单

**用途**：
- 登录后显示用户名
- 下拉菜单：Dashboard、Settings、Logout

---

## 三、开发指引

### 3.1 使用步骤

1. 打开组件链接
2. 选择喜欢的款式
3. 点击 "Copy HTML" 按钮
4. 粘贴到项目中
5. 根据需求修改内容和样式

### 3.2 注意事项

- HyperUI 使用 Tailwind CSS，确保项目已安装
- 组件是纯 HTML，需要自己添加交互逻辑（React/Next.js）
- 样式可以根据品牌色调整（主色建议：#2563eb 蓝色）

### 3.3 品牌色配置

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        'primary-dark': '#1d4ed8',
      },
    },
  },
}
```

---

## 四、组件优先级

| 优先级 | 组件 | 页面位置 |
|-------|------|---------|
| P0 | Header | 全站 |
| P0 | Hero | 首页顶部 |
| P0 | Tabs | 首页工具区 |
| P0 | Textarea/Input | 首页工具区 |
| P0 | Button | 首页工具区 |
| P0 | Tables | 首页结果区 |
| P1 | Steps | 首页 SEO 区 |
| P1 | FAQ | 首页 SEO 区 |
| P1 | CTA | 首页底部 |
| P1 | Footer | 全站 |
| P2 | Pricing | /pricing 页 |
| P2 | Loaders | 全站交互 |
| P2 | Dropdowns | 登录后导航 |

---

*文档创建：2026-05-29*
*供 Claude Code 开发参考*
