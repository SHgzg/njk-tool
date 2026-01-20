# HTML 组件使用说明

## 快速开始

HTML 组件用于在邮件模板中直接嵌入自定义 HTML 内容。

## 基本用法

```json
{
  "tag": "html",
  "html": "<div style=\"color: red;\">HTML 内容</div>"
}
```

或者使用 `code` 属性（功能相同）：

```json
{
  "tag": "html",
  "code": "<div style=\"color: blue;\">HTML 内容</div>"
}
```

## 配置属性

| 属性 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `tag` | string | ✅ | 固定值 `"html"` |
| `html` | string | ❌ | HTML 内容字符串 |
| `code` | string | ❌ | HTML 内容（与 html 二选一） |

**注意**：`html` 和 `code` 至少需要一个。

## 使用示例

### 示例 1：嵌入彩色卡片

```json
{
  "tag": "html",
  "html": "<div style=\"padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; text-align: center;\"><h3 style=\"margin: 0;\">标题</h3><p style=\"margin: 8px 0 0 0;\">内容</p></div>"
}
```

### 示例 2：嵌入自定义表格

```json
{
  "tag": "html",
  "code": "<table style=\"width: 100%; border-collapse: collapse;\"><tr style=\"background: #f5f7fa;\"><th style=\"padding: 12px; border: 1px solid #ddd;\">列1</th><th style=\"padding: 12px; border: 1px solid #ddd;\">列2</th></tr><tr><td style=\"padding: 12px; border: 1px solid #ddd;\">数据1</td><td style=\"padding: 12px; border: 1px solid #ddd;\">数据2</td></tr></table>"
}
```

### 示例 3：嵌入警告框

```json
{
  "tag": "html",
  "html": "<div style=\"padding: 16px; background: #fff3cd; border-left: 4px solid #ffc107; color: #856404;\"><strong>⚠️ 警告</strong><p style=\"margin: 8px 0 0 0;\">这是警告内容</p></div>"
}
```

### 示例 4：嵌入按钮

```json
{
  "tag": "html",
  "code": "<table style=\"margin: 20px 0;\"><tr><td style=\"padding: 12px 24px; background: #28a745; color: white; text-align: center; border-radius: 6px;\"><a href=\"#\" style=\"color: white; text-decoration: none; font-weight: bold;\">点击按钮 →</a></td></tr></table>"
}
```

## 完整示例

```json
[
  {
    "tag": "title",
    "type": "h1",
    "text": "我的报告"
  },
  {
    "tag": "html",
    "html": "<div style=\"padding: 20px; background: #f0f0f0; border-radius: 8px;\"><h4 style=\"margin: 0 0 10px 0;\">欢迎使用</h4><p style=\"margin: 0;\">这是一个 HTML 组件示例</p></div>"
  },
  {
    "tag": "table",
    "columns": ["Name", "Value"],
    "data": [
      {"Name": "项目A", "Value": "完成"},
      {"Name": "项目B", "Value": "进行中"}
    ]
  },
  {
    "tag": "html",
    "code": "<div style=\"margin-top: 20px; padding: 16px; background: #e8f4ff; border-left: 4px solid #1890ff;\"><p style=\"margin: 0; color: #0050b3;\"><strong>提示：</strong>报告已生成完毕</p></div>"
  }
]
```

## 重要提示

### ✅ 推荐做法

- **使用内联样式**：邮件客户端对外部样式表支持有限
- **使用 table 布局**：在邮件中 table 比 div 更稳定
- **简单即是好**：避免使用复杂的 HTML 和 CSS
- **测试兼容性**：在不同邮件客户端中测试

### ❌ 避免使用

- **外部样式表**（`<style>` 或 `<link>`）
- **JavaScript**（邮件客户端会屏蔽）
- **现代 CSS 特性**（flexbox 在部分邮件客户端中不支持）
- **iframe**（不适用于邮件）

### 📧 邮件兼容性

该组件专门为邮件模板设计，HTML 内容直接嵌入，不添加任何额外容器，确保在以下邮件客户端中正常显示：

- ✅ Outlook
- ✅ Gmail
- ✅ Foxmail
- ✅ QQ 邮箱
- ✅ 企业邮箱

## 测试

访问以下地址测试 HTML 组件：

```
http://localhost:3007/example/html_simple_test
```

## 代码示例

```typescript
import { njkRenderSync } from 'njk-tool';

const html = njkRenderSync([
  {
    tag: 'html',
    html: '<div style="color: red;">Hello HTML!</div>'
  }
]);

console.log(html);
```

## 技术细节

- HTML 内容使用 Nunjucks 的 `| safe` 过滤器直接渲染
- 不添加任何包装容器
- 不自动转义 HTML（请确保 HTML 内容安全）
- 完全支持内联样式和内联事件
