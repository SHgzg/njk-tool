# njk-tool

> Nunjucks 模板渲染工具，用于快速生成 HTML 报告和文档

## 特性

- 🎨 **丰富的组件系统** - 标题、表格、提示框、目录等
- 📧 **邮件集成** - 支持将渲染结果直接发送邮件
- 🔧 **零 JavaScript 编程** - 通过 JSON 配置即可生成 HTML
- 📱 **响应式设计** - 内置移动端适配样式

## 快速开始

### 安装

```bash
npm install njk-tool
```

### 基础用法

```typescript
import { njkRenderSync } from 'njk-tool';

const html = njkRenderSync([
  {
    tag: 'title',
    type: 'h1',
    text: '我的报告'
  },
  {
    tag: 'table',
    columns: ['Name', 'Age'],
    data: [
      { Name: 'Alice', Age: 25 },
      { Name: 'Bob', Age: 30 }
    ]
  }
]);
```

## 开发

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm run dev
```

访问 http://localhost:3007/example/report_test 查看示例

### 配置邮件功能（可选）

复制 `.env.example` 为 `.env` 并配置：

```env
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your@qq.com
SMTP_PASS=your授权码
SMTP_TO=receiver@example.com
```

## 组件列表

- `title` - 标题组件（h1-h6）
- `table` - 表格组件
- `notice` - 提示框（info/success/warning/error）
- `date` - 日期显示
- `checker` - 检查人信息
- `toc` - 目录导航
- `block` - 代码块
- `text` - 文本内容
- `divider` - 分隔线
- `tag` - 标签
- `title_content` - 可折叠内容块

## License

MIT
