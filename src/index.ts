import { readFileSync } from "node:fs";
import nunjucks from "nunjucks";
import { ConfItem, StyleLoader, StyleLoadOptions, TagType } from "./type";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
const externalTemplatesDir = fileURLToPath(new URL("../bundle/src",`${import.meta.url}`));
nunjucks.configure(externalTemplatesDir, {
    autoescape: true,
    noCache: true
})


interface Options {
    cssUrl?: string | string[]
    templateDir?: string
    asyncLoad?: boolean
}

const BASE_STYLE_PATH = join(externalTemplatesDir,"base.style");
const TEMPLATES_DIR = join(externalTemplatesDir,"index.html");
console.log({externalTemplatesDir});
console.log({BASE_STYLE_PATH});
console.log({TEMPLATES_DIR});

const loadStyle = async (basePath: string): Promise<string> => {
    try {
        return await import("fs/promises").then(({ readFile }) =>
            readFile(basePath, "utf8"));
    } catch (error) {
        console.error(`[样式加载失败] ${basePath}:`, error);
        return "";
    }
};

// 同步版本（保留备用）
const loadStyleSync = (basePath: string) => {
    try {
        return readFileSync(basePath, "utf8");
    } catch (error) {
        console.error(`[样式加载失败] ${basePath}:`, error);
        return "";
    }
};

// 样式处理优化
const getStyleContent: StyleLoader = ({
    isAsync = false,
    basePath = BASE_STYLE_PATH,
} = {} as StyleLoadOptions): Promise<string> | string =>
    isAsync ? loadStyle(basePath) : Promise.resolve(loadStyleSync(basePath));

// 配置验证函数
const validateConfig = (config: ConfItem | ConfItem[]): void => {
    if (!Array.isArray(config) && !("tag" in config)) {
        throw new Error("无效的配置结构：必须为ConfItem数组或单个ConfItem对象");
    }
};

// 样式注入逻辑优化
const processConfig = (config: ConfItem[], cssUrls: string[]): ConfItem[] => {
    const headConf: ConfItem = {
        tag: TagType.Head,
        cssFiles: Array.isArray(cssUrls) ? cssUrls : [cssUrls]
    };

    return Array.isArray(config)
        ? [headConf, ...config]
        : [headConf, config];
};

// 主渲染函数
export const njkRender = async (
    config: ConfItem | ConfItem[],
    options: Options = {}
): Promise<string> => {
    const { cssUrl, templateDir = TEMPLATES_DIR } = options;

    // 配置验证
    validateConfig(config);

    // 处理配置
    const processedConfig = Array.isArray(config)
        ? processConfig(config, cssUrl as string[])
        : processConfig([config], cssUrl as string[]);

    // 动态配置nunjucks
    nunjucks.configure(templateDir, {
        autoescape: true,
        noCache: process.env.NODE_ENV !== "production" // 生产环境启用缓存
    });

    // 异步加载样式
    const styleContent = await getStyleContent();

    return nunjucks.render("index.html", {
        ctx: processedConfig,
        style: styleContent || ""
    });
};

// 同步版本（保留备用）
export const njkRenderSync = (config: ConfItem | ConfItem[], options: Options = {}): string => {
    const { cssUrl, templateDir = TEMPLATES_DIR } = options;
    const processedConfig = Array.isArray(config)
        ? processConfig(config, cssUrl as string[])
        : processConfig([config], cssUrl as string[]);

    const html = nunjucks.render('index.html', {
        ctx: processedConfig,
    });
    return getStyleContent({ isAsync: true }) + html
};