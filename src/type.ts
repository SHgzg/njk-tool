/**
 * 组件标签类型枚举
 * 包含所有支持的组件类型
 */
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
  Divider = "divider",
  Tag = "tag",
  ContentTitle = "title_content",
  Html = "html"
}

/**
 * 基础配置接口
 * 所有组件共享的基础属性
 */
interface BaseConfItem {
  tag: TagType;
  type?: string;
  title?: string;
  text?: string;
  style?: string;
  cssFiles?: string[];
  jsFiles?: string[];
}

/**
 * 目录和代码块配置
 */
interface ListConfItem extends BaseConfItem {
  tag: TagType.Toc | TagType.Block;
  data?: Array<object>;
}

/**
 * 表格配置接口
 * 支持两种数据格式：
 * 1. 对象数组格式：columns + data
 * 2. 二维数组格式：th + tbody
 */
interface TableConfItem extends BaseConfItem {
  tag: TagType.Table;
  title?: string;
  // 对象数组格式（常用）
  columns?: string[];
  data?: Record<string, any>[];
  // 二维数组格式（备用）
  th?: string[];
  tbody?: any[][];
}

/**
 * 标签组件配置
 */
interface TagConfItem extends BaseConfItem {
  tag: TagType.Tag;
  color?: string;
  size?: 'small' | 'medium' | 'large';
}

/**
 * 内容标题配置
 */
interface ContentTitleConfItem extends BaseConfItem {
  tag: TagType.ContentTitle;
  type?: 'h3' | 'hover_h3' | 'remain_h3' | 'hover' | 'remain';
  hover?: boolean;
  remain?: boolean;
}

/**
 * 分隔符配置
 */
interface DividerConfItem extends BaseConfItem {
  tag: TagType.Divider;
}

/**
 * HTML 组件配置
 * 直接嵌入 HTML 代码，适用于邮件模板
 */
interface HtmlConfItem extends BaseConfItem {
  tag: TagType.Html;

  // HTML 内容（二选一）
  html?: string;         // HTML 内容字符串
  code?: string;         // 代码内容（与 html 二选一）
}

/**
 * 组件配置联合类型
 */
export type ConfItem =
  | BaseConfItem
  | ListConfItem
  | TableConfItem
  | TagConfItem
  | ContentTitleConfItem
  | DividerConfItem
  | HtmlConfItem;

/**
 * 渲染选项接口
 */
export interface RenderOptions {
  templateDir?: string;
  cssUrl?: string | string[];
  asyncLoad?: boolean;
  noCache?: boolean;
}

/**
 * 样式加载选项接口
 */
export interface StyleLoadOptions {
  isAsync?: boolean;
  basePath?: string;
}

/**
 * 样式加载器类型
 */
export type StyleLoader = (
  options?: StyleLoadOptions
) => Promise<string> | string;
