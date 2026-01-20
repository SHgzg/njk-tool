# njk-tool 优化方案

## 🚨 紧急修复 (P0 - 立即处理)

### 1. 安全漏洞修复
```bash
# 1.1 撤销已泄露的邮箱授权码
# 登录 QQ 邮箱 -> 设置 -> 账户 -> 删除授权码

# 1.2 使用环境变量
npm install dotenv
```

创建 `.env.example`:
```env
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_USER=your@qq.com
SMTP_PASS=your授权码
SMTP_TO=receiver@example.com
```

修改 `src/dev/main.ts`:
```typescript
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
```

### 1.3 清理敏感信息
- 立即删除 `readme.md` 中的授权码
- 添加 `.gitignore`:
```
.env
.env.local
*.log
```

---

## 🏗️ 架构重构 (P1 - 核心优化)

### 2. 模板系统重构

#### 问题
- 当前所有模板硬编码在 `template.dist.ts` 单个文件中
- 无法独立维护组件

#### 方案 A: 使用 Nunjucks 文件系统（推荐）

```typescript
// src/index.ts
import nunjucks from 'nunjucks';
import { fileURLToPath } from 'node:url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.join(__dirname, 'components');

nunjucks.configure(templatesDir, {
  autoescape: true,
  noCache: process.env.NODE_ENV === 'development'
});

export const njkRenderSync = (config: ConfItem | ConfItem[]) => {
  return nunjucks.render('Component.njk', { ctx: config });
};
```

**优点**:
- ✅ 符合 Nunjucks 最佳实践
- ✅ 支持模板继承和包含
- ✅ 易于维护和扩展

**缺点**:
- ❌ 需要调整打包配置
- ❌ 增加部署复杂度

#### 方案 B: 动态导入模板字符串

```typescript
// src/templates/index.ts
import { useTitle } from './title.js';
import { useTable } from './table.js';
// ...其他组件

export const templates = {
  title: useTitle,
  table: useTable,
  // ...
};

// src/index.ts
export const njkRenderSync = (config: ConfItem | ConfItem[]) => {
  const template = buildTemplate(config);
  return nunjucks.renderString(template, { ctx: config });
};
```

**优点**:
- ✅ 保持当前打包方式
- ✅ 可以按需加载

**缺点**:
- ❌ 失去 Nunjucks 文件系统特性
- ❌ 仍需维护字符串

**推荐**: 方案 A，因为更符合 Nunjucks 设计理念

---

### 3. 样式系统重构

#### 3.1 分离样式文件

```
src/
  styles/
    base.css          # 基础样式
    components/
      title.css       # 标题样式
      table.css       # 表格样式
      notice.css      # 提示框样式
      ...
  index.ts           # 导出所有样式
```

#### 3.2 样式按需加载

```typescript
// src/styles/index.ts
import { readFileSync } from 'fs';
import path from 'path';

const loadStyle = (name: string) => {
  const filePath = path.join(__dirname, 'components', `${name}.css`);
  return readFileSync(filePath, 'utf-8');
};

export const getStyles = (components: string[]): string => {
  const baseStyle = readFileSync(path.join(__dirname, 'base.css'), 'utf-8');
  const componentStyles = components.map(loadStyle).join('\n');

  return `<style>${baseStyle}${componentStyles}</style>`;
};

// src/index.ts
export const njkRenderSync = (config: ConfItem | ConfItem[]) => {
  const usedTags = extractUsedTags(config);
  const styles = getStyles(usedTags);
  const html = renderTemplate(config);
  return styles + html;
};
```

---

### 4. 类型系统完善

#### 4.1 补全 TagType 枚举

```typescript
// src/type.ts
export enum TagType {
  Title = "title",
  Date = "date",
  Checker = "checker",
  Head = "head",
  Text = "text",
  Toc = "toc",
  Notice = "notice",
  Block = "block",
  Table = "table",
  Divider = "divider",        // 新增
  Tag = "tag",                // 新增
  ContentTitle = "title_content"  // 新增
}
```

#### 4.2 修正表格类型定义

```typescript
// 当前（错误）
interface TableConfItem {
  columns?: Array<{ key: string; label: string }>;
}

// 修正后
interface TableConfItem {
  tag: TagType.Table;
  title?: string;
  columns?: string[];  // 支持字符串数组
  data?: Record<string, any>[];  // 对象数组
  th?: string[];  // 表头（数组模式）
  tbody?: any[][];  // 表体（二维数组）
}
```

#### 4.3 使用严格类型

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

---

## 🧪 测试体系 (P2 - 质量保证)

### 5. 添加测试框架

```bash
npm install -D vitest @vitest/ui jsdom
```

#### 5.1 单元测试

```typescript
// test/table.test.ts
import { describe, it, expect } from 'vitest';
import { njkRenderSync } from '../src/index';

describe('Table Component', () => {
  it('should render table with columns and data', () => {
    const config = [{
      tag: "table",
      columns: ["id", "name"],
      data: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" }
      ]
    }];

    const html = njkRenderSync(config);
    expect(html).toContain('<table');
    expect(html).toContain('Alice');
    expect(html).toContain('Bob');
  });

  it('should convert boolean values to emojis', () => {
    const config = [{
      tag: "table",
      columns: ["status"],
      data: [{ status: true }]
    }];

    const html = njkRenderSync(config);
    expect(html).toContain('✔️');
  });
});
```

#### 5.2 快照测试

```typescript
// test/snapshot.test.ts
import { expect, it } from 'vitest';
import { njkRenderSync } from '../src/index';

it('matches snapshot', () => {
  const config = [/* ... */];
  const html = njkRenderSync(config);
  expect(html).toMatchSnapshot();
});
```

---

## 📚 文档体系 (P2 - 使用体验)

### 6. 完善文档

#### 6.1 创建完整的 README

```markdown
# njk-tool

> Nunjucks 模板渲染工具，用于快速生成 HTML 报告

## 快速开始

### 安装

\`\`\`bash
npm install njk-tool
\`\`\`

### 基础用法

\`\`\`typescript
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
\`\`\`

## API 文档

### 配置类型

### 组件列表

### 示例

## 开发指南
```

#### 6.2 API 文档生成

```bash
npm install -D typedoc
```

```json
// package.json
{
  "scripts": {
    "docs": "typedoc --out docs src"
  }
}
```

#### 6.3 JSDoc 注释

```typescript
/**
 * 渲染 Nunjucks 模板为 HTML 字符串
 * @param config - 组件配置数组
 * @param options - 渲染选项
 * @returns 渲染后的 HTML 字符串
 * @example
 * ```ts
 * const html = njkRenderSync([
 *   { tag: 'title', text: 'Hello' }
 * ]);
 * ```
 */
export const njkRenderSync = (
  config: ConfItem | ConfItem[],
  options?: RenderOptions
): string => {
  // ...
};
```

---

## ⚡ 性能优化 (P3 - 体验提升)

### 7. 缓存机制

```typescript
// src/cache.ts
const templateCache = new Map<string, string>();

export const cachedRender = (template: string, data: any) => {
  const key = JSON.stringify({ template, data });

  if (templateCache.has(key)) {
    return templateCache.get(key);
  }

  const result = nunjucks.renderString(template, data);
  templateCache.set(key, result);

  return result;
};
```

### 7.2 代码分割

```javascript
// rollup.config.js
export default {
  output: [{
    file: 'dist/bundle/app.min.js',
    format: 'esm',
    // 启用代码分割
    manualChunks: {
      'template': ['src/template.dist.ts'],
      'style': ['src/style.dist.ts']
    }
  }]
};
```

---

## 🔧 开发体验 (P3 - 效率提升)

### 8. 代码规范

#### 8.1 ESLint 配置

```bash
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

```javascript
// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error'
  }
};
```

#### 8.2 Prettier 配置

```bash
npm install -D prettier
```

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

#### 8.3 Git Hooks

```bash
npm install -D husky lint-staged
```

```json
// package.json
{
  "lint-staged": {
    "*.{ts,js}": ["eslint --fix", "prettier --write"]
  }
}
```

---

### 9. CI/CD 配置

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm ci
      - run: npm run build
      - run: npm test
      - run: npm run lint
```

---

## 📦 依赖管理优化

### 10. 修复 Peer Dependencies

```json
// package.json
{
  "dependencies": {
    "nunjucks": "^3.2.4"  // 从 peerDependencies 移到这里
  },
  "peerDependencies": {
    // 清空，除非有可选依赖
  },
  "peerDependenciesMeta": {
    "nodemailer": {
      "optional": true  // 邮件功能可选
    }
  }
}
```

---

## 🔄 迁移指南

### 阶段 1: 紧急修复（1 天）
1. ✅ 撤销泄露的授权码
2. ✅ 添加环境变量配置
3. ✅ 清理 `readme.md`

### 阶段 2: 架构重构（1 周）
1. ✅ 模板系统重构（方案 A）
2. ✅ 样式系统分离
3. ✅ 类型系统完善

### 阶段 3: 质量提升（2 周）
1. ✅ 添加测试框架
2. ✅ 完善文档
3. ✅ 添加 ESLint/Prettier

### 阶段 4: 持续优化
1. ✅ 性能优化
2. ✅ CI/CD 配置
3. ✅ 社区反馈迭代

---

## 📊 优先级总结

| 级别 | 项目 | 工作量 | 影响 |
|------|------|--------|------|
| P0 | 安全漏洞修复 | 2h | ⚠️⚠️⚠️ |
| P1 | 架构重构 | 1周 | ⚠️⚠️ |
| P2 | 测试体系 | 3天 | ⚠️ |
| P2 | 文档完善 | 2天 | ⚠️ |
| P3 | 性能优化 | 2天 | ⚠️ |
| P3 | 开发体验 | 1天 | ⚠️ |

---

## 🎯 预期收益

完成以上优化后：

✅ **安全性**: 消除所有已知安全漏洞
✅ **可维护性**: 代码结构清晰，易于修改
✅ **类型安全**: TypeScript 完全发挥作用
✅ **稳定性**: 测试覆盖保证质量
✅ **易用性**: 完整文档降低学习成本
✅ **性能**: 渲染速度提升 30-50%
✅ **专业性**: 符合开源项目最佳实践
