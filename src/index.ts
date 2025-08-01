import nunjucks from "nunjucks";
import { ConfItem, TagType } from "./type";
import { fileURLToPath } from "node:url";
import { styleText } from "./style.dist.js";
import { templateText } from "./template.dist.js";
const externalTemplatesDir = fileURLToPath(new URL("../bundle/src", `${import.meta.url}`));
nunjucks.configure(externalTemplatesDir, {
    autoescape: true,
    noCache: true
})

interface Options {
    cssUrl?: string | string[]
    templateDir?: string
    asyncLoad?: boolean
}

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

export const njkRenderSync = (config: ConfItem | ConfItem[], options: Options = {}): string => {
    const { cssUrl } = options;
    const processedConfig = Array.isArray(config)
        ? processConfig(config, cssUrl as string[])
        : processConfig([config], cssUrl as string[]);

    const html = nunjucks.renderString(templateText, {
        ctx: processedConfig,
    });
    return styleText + html
};