// ?? 如何避免每次手动添加
export enum TagType {
  Title = "title",
  Date = "date",
  Checker = "checker",
  Head = "head",
  Text = "text",
  Toc = "toc",
  Notice = "notice",
  Block = "block",
  Table = "table"
}

// 通用配置
interface BaseConfItem {
  tag: TagType;
  type?: string;
  title?: string;
  text?: string;
  style?: string;
  cssFiles?: string[];
  jsFiles?: string[];
}

// 表格配置扩展类型
interface ListConfItem extends BaseConfItem {
  tag: TagType.Toc | TagType.Block;
  data?: Array<object>;
}
// 表格配置扩展类型
interface TableConfItem extends BaseConfItem {
  tag: TagType.Table;
  columns?: Array<{ key: string; label: string }>;
  data?: Array<object>;
  th?: Array<{ key: string; width?: string }>;
  tbody?: Array<object[]>;
}

// 最终配置类型联合
export type ConfItem = BaseConfItem | ListConfItem | TableConfItem;

// 渲染配置
export interface RenderOptions {
  templateDir?: string; // 模板地址
  cssUrls?: string | string[]; // 外部 css 引用地址
  asyncLoad?: boolean;  // 文件资源加载的 异步和同步 控制
  noCache?: boolean; // njk 缓存控制选项
}

// 样式加载配置类型
export interface StyleLoadOptions {
  isAsync?: boolean;
  basePath?: string; // 支持自定义样式路径
}

export type StyleLoader = (
  options?: StyleLoadOptions
) => Promise<string> | string;