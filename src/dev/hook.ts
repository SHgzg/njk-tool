import { watch } from "chokidar";
import { readFileSync, writeFileSync } from "node:fs";
import { relative } from "node:path";
import { styleStringWrapper, templateStringWrapper } from "./utils.js";


const TARGET_PATH = `${process.cwd()}/src`
export const watcher = watch(TARGET_PATH, {
    persistent: true,         // 持续监听
    awaitWriteFinish: {       // 等待文件写入完成再触发
        stabilityThreshold: 2000,
        pollInterval: 100
    }
})

function getRelativePath(path: string) {
    return relative(TARGET_PATH, path)
}

function splitPath(filePath: string) {
    const folders = filePath.split("\\")
    const [, name,] = folders

    return name
}

class CompTool {
    relativePath: string;
    name: string;
    regexp: RegExp;
    contentStr: string;
    constructor(path: string) {
        this.relativePath = getRelativePath(path)
        this.name = splitPath(this.relativePath)
        this.regexp = new RegExp(`<\!--\\s*${this.name}\\s*-->(.*?)<\!--\\s*\/\\s*${this.name}\\s*-->`, "s");
        this.contentStr = this.init(path)
    }

    static is(path: string) {
        return path.endsWith(".njk")
    }

    init(path: string) {
        try {
            return readFileSync(path, "utf-8")
        } catch (error) {
            return ""
        }
    }

    wrapper() {
        return `<!-- ${this.name} -->\n${this.contentStr}\n<!-- /${this.name} -->\n`
    }

    isMatch(target: Template) {
        return target.template.match(this.regexp)
    }

    update(target: Template) {
        target.setComponent(this.name, this.wrapper())
    }

    delate(target: Template) {
        target.setComponent(this.name, "")

    }

    create(target: Template) {
        target.setComponent(this.name, this.wrapper())

    }
}

class StyleTool {
    relativePath: string;
    name: string;
    regexp: RegExp;
    contentStr: string;
    constructor(path: string) {
        this.relativePath = getRelativePath(path)
        this.name = splitPath(this.relativePath)
        this.regexp = new RegExp(`\\/\\*\\s*${this.name}\\s*\\*\\/([\\s\\S]*?)\\/\\*\\s*END-${this.name}\\s*\\*\\/`, "s");
        this.contentStr = this.init(path)
    }

    static is(path: string) {
        return path.endsWith(".css")
    }

    init(path: string) {
        try {
            return readFileSync(path, "utf-8")
        } catch (error) {
            return ""
        }
    }

    wrapper() {
        return `/* ${this.name} */\n${this.contentStr}\n/* END-${this.name} */\n`
    }

    isMatch(target: Template) {
        
        return target.style.match(this.regexp)
    }

    update(target: Template) {
        target.setStyle(this.name, this.wrapper())
    }

    delate(target: Template) {
        target.setStyle(this.name, "")

    }

    create(target: Template) {
        target.setStyle(this.name, this.wrapper())

    }
}

export class Template {
    template_root_path = `${process.cwd()}/src/template.dist.ts`;
    style_root_path = `${process.cwd()}/src/style.dist.ts`
    sortComp = [
        "Text.njk",
        "Divider.njk",
        "Tag.njk",
        "Title.njk",
        "Notice.njk",
        "Block.njk",
        "Date.njk",
        "Table.njk",
        "SideBar.njk",
        "Tab.njk",
        "ContentTitle.njk",
        "Component.njk",
    ]
    sortCss = [
        "Base.css",
        "Text.css",
        "Title.css",
        "Notice.css",
        "Block.css",
        "Date.css",
        "Table.css",
        "SideBar.css",
        "Tab.css",
        "Component.css",
    ]
    componentsMap = new Map()
    styleMap = new Map()
    template: string
    style: string
    constructor() {
        this.template = this.getTemplate()
        this.style = this.getStyle()
    }

    getTemplate() {
        try {
            return readFileSync(this.template_root_path, "utf-8")
        } catch (error) {
            console.log(error);
            return ""
        }
    }
    getStyle() {
        try {
            return readFileSync(this.style_root_path, "utf-8")
        } catch (error) {
            console.log(error);
            return ""
        }
    }

    setComponent(name: string, str: string) {
        this.componentsMap.set(name, str)
    }

    setStyle(name: string, str: string) {
        this.styleMap.set(name, str)
    }

    wrapper(str:string,pre="",after=""){
        return pre + str + after
    }

    compileComponent() {
        const getNum = ([k, v]: [string, string]) => this.sortComp.findIndex(key => key === k) || 999
        const res = Array.from(this.componentsMap)
            .sort((a, b) => {
                return getNum(a) - getNum(b)
            })
            .map(([k, v]) => v)
            .join("\n")
        return templateStringWrapper(res)
    }

    compileStyle() {
        const getNum = ([k, v]: [string, string]) => this.sortCss.findIndex(key => key === k) || 999
        const res = Array.from(this.styleMap)
            .sort((a, b) => {
                return getNum(a) - getNum(b)
            })
            .map(([k, v]) => {
                return v
            })
            .join("\n")
        return styleStringWrapper(res)
    }

    buildComponent() {
        writeFileSync(this.template_root_path, this.compileComponent(), "utf-8")
    }

    buildStyle() {
        writeFileSync(this.style_root_path, this.compileStyle(), "utf-8")
    }
}

const template = new Template()

type FactoryKey = 'Style' | 'Component';
type ToolConstructor = typeof StyleTool | typeof CompTool; // 构造函数类型
const FactoryMap: Record<FactoryKey, ToolConstructor> = {
    Style: StyleTool,
    Component: CompTool,
};

function HandlerFactory(type:FactoryKey) {
    const Factory = FactoryMap[type]
    return function (event:string, path:string) {
        if (!Factory.is(path)) return
        const instance = new Factory(path)
        switch (event) {
            case 'add':
                instance.isMatch(template) ? instance.update(template)
                    : instance.create(template)
                template?.[`build${type}`]()
                break;
            case 'change':
                if (!instance.isMatch(template)) return
                instance.update(template)
                template?.[`build${type}`]()
                break;
            case 'unlink':
                if (!instance.isMatch(template)) return
                instance.delate(template)
                template?.[`build${type}`]()
                break;
        }
    }
}

const compHandler = HandlerFactory("Component")
const styleHandler = HandlerFactory("Style")


export function addHandler(path:string) {
    if (CompTool.is(path)) {
        return compHandler("add", path)
    } else if (StyleTool.is(path)) {
        return styleHandler("add", path)
    }
}

export function changeHandler(path:string) {
    if (CompTool.is(path)) {
        return compHandler("change", path)
    } else if (StyleTool.is(path)) {
        return styleHandler("change", path)
    }
}

export function unlinkHandler(path:string) {
    if (CompTool.is(path)) {
        return compHandler("unlink", path)
    } else if (StyleTool.is(path)) {
        return styleHandler("unlink", path)
    }
}