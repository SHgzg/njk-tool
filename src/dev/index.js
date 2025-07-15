import { watch } from "chokidar";
import { readFileSync, writeFileSync } from "node:fs";
import { relative } from "node:path";


const TARGET_PATH = `${process.cwd()}/src/templates`
export const watcher = watch(TARGET_PATH, {
    persistent: true,         // 持续监听
    recursive: true,          // 递归监听子目录
    awaitWriteFinish: {       // 等待文件写入完成再触发
        stabilityThreshold: 2000,
        pollInterval: 100
    }
})

function getRelativePath(path) {
    return relative(TARGET_PATH, path)
}

function dividPath(filePath) {
    const folders = filePath.split("\\")
    const [type, componentName, fileName] = folders

    return {
        type,
        componentName,
        fileName
    }
}

// const parts = text.split(/(Depends\[.*?\])/);
class CompTool {
    constructor(path) {
        const relativePath = getRelativePath(path)
        const { type, componentName } = dividPath(relativePath)
        this.path = path
        this.type = type
        this.name = componentName
        this.regex = this.genRegx(componentName)
        const { deps, compStr } = this.init(path)
        this.deps = deps
        this.compStr = compStr
    }

    static is(path) {
        return path.endsWith(".njk")
    }

    genRegx(componentName) {
        const regexStr = `<\!--\\s*${componentName}\\s*-->(.*?)<\!--\\s*\/\\s*${componentName}\\s*-->`
        return new RegExp(regexStr, "s")
    }

    init(path) {
        const res = { deps: '', compStr: '' }
        try {
            res.compStr = readFileSync(path, "utf-8")
        } catch (error) {
            console.log(error);
        } finally {

            return res
        }
    }

    wrapper() {
        return `<!-- ${this.name} -->\n${this.compStr}\n<!-- /${this.name} -->\n`
    }

    isMatch(target) {
        return target.template.match(this.regex)
    }

    update(target) {
        target.setCompont(this.name, this.wrapper())
    }

    delate(target) {
        target.setCompont(this.name, "")

    }

    create(target) {
        target.setCompont(this.name, this.wrapper())

    }

    anlyDep(target) {
        const hasDep = this.compStr.startsWith('Depends')
        const deps = []
        for (let index = 0; index < array.length; index++) {
            const path = deps[index];
            const component = new CompTool(path)
            if (!component.isMatch(template)) {
                component.create(target)
            }
        }
    }
}

class StyleTool {
    constructor(path) {
        const relativePath = getRelativePath(path)
        const { type, componentName } = dividPath(relativePath)
        this.path = path
        this.type = type
        this.name = componentName
        this.regex = this.genRegx(componentName)
        const { deps, styleStr } = this.init(path)
        this.deps = deps
        this.styleStr = styleStr
    }

    static is(path) {
        return path.endsWith(".css")
    }

    genRegx(name) { 
        const regexStr = `\/\* ${name} \*\/([\s\S]*?)\/\* END-${name} \*\/`
        return new RegExp(regexStr, "s")
    }

    init(path) {
        const res = { deps: '', styleStr: '' }
        try {
            res.styleStr = readFileSync(path, "utf-8")
        } catch (error) {
            console.log(error);
        } finally {

            return res
        }
    }

    wrapper() {
        return `/* ${this.name} */\n${this.styleStr}\n/* END-${this.name} */\n`
    }

    isMatch(target) {
        return target.template.match(this.regex)
    }

    update(target) {
        target.setStyle(this.name, this.wrapper())
    }

    delate(target) {
        target.setStyle(this.name, "")

    }

    create(target) {
        target.setStyle(this.name, this.wrapper())

    }
}

export class Template {
    constructor() {
        this.template_root = `${process.cwd()}/src/templates/template.html`
        this.style_root = `${process.cwd()}/src/templates/base.style`
        this.template = this.getTemplate()
        this.style = this.getStyle()
        this.componentsMap = new Map()
        this.styleMap = new Map()
        this.sortComp = [
            "Text.njk",
            "Title.njk",
            "Notice.njk",
            "Block.njk",
            "Date.njk",
            "Table.njk",
            "SideBar.njk",
            "Tab.njk",
            "Component.njk",
        ]
        this.sortCss = [
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
    }

    getTemplate() {
        try {
            return readFileSync(this.template_root, "utf-8")
        } catch (error) {
            console.log(error);
            return ""
        }
    }
    getStyle() {
        try {
            return readFileSync(this.style_root, "utf-8")
        } catch (error) {
            console.log(error);
            return ""
        }
    }

    setCompont(name, str) {
        this.componentsMap.set(name, str)
    }

    setStyle(name, str) {
        this.styleMap.set(name, str)
    }

    complierComponent() {
        const getNum = ([k, v]) => this.sortComp.findIndex(v => v === k) || 999
        const res = Array.from(this.componentsMap)
            .sort((a, b) => {
                return getNum(a) - getNum(b)
            })
            .map(([k, v]) => v)
            .join("\n")
        return res
    }

    complierStyle() {
        const getNum = ([k, v]) => this.sortCss.findIndex(v => v === k) || 999
        const res = Array.from(this.styleMap)
            .sort((a, b) => {
                return getNum(a) - getNum(b)
            })
            .map(([k, v]) => {
                return v
            })
            .join("\n")
        return res
    }

    buildComponent() {
        writeFileSync(this.template_root, this.complierComponent(), "utf-8")
    }

    buildStyle() {
        writeFileSync(this.style_root, this.complierStyle(), "utf-8")
    }
}

const template = new Template()

const FactoryMap = {
    Style: StyleTool,
    Component: CompTool,
}

function HandlerFactory(type) {
    const Factory = FactoryMap[type]
    return function (evnt, path) {
        if (!Factory.is(path)) return
        const instance = new Factory(path)
        switch (evnt) {
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


export function addHandler(path) {
    if (CompTool.is(path)) {
        return compHandler("add", path)
    } else if (StyleTool.is(path)) {
        return styleHandler("add", path)
    }
}

export function changeHandler(path) {
    if (CompTool.is(path)) {
        return compHandler("change", path)
    } else if (StyleTool.is(path)) {
        return styleHandler("change", path)
    }
}

export function unlinkHandler(path) {
    if (CompTool.is(path)) {
        return compHandler("unlink", path)
    } else if (StyleTool.is(path)) {
        return styleHandler("unlink", path)
    }
}