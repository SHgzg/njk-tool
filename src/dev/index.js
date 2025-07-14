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
        this.getComp(path)
        const relativePath = getRelativePath(path)
        const { type, componentName } = dividPath(relativePath)
        this.path = path
        this.type = type
        this.name = componentName
        this.regex = this.genRegx(componentName)
        const { deps, compStr } = this.getComp(path)
        this.deps = deps
        this.compStr = compStr
    }

    static isComp(path) {
        return path.endsWith(".njk")
    }

    genRegx(componentName) {
        const regexStr = `<\!--\\s*${componentName}\\s*-->(.*?)<\!--\\s*\/\\s*${componentName}\\s*-->`
        return new RegExp(regexStr, "s")
    }

    getComp(path) {
        const res = { deps: '', compStr: '' }
        try {
            res.compStr = readFileSync(path, "utf-8")
        } catch (error) {
            console.log(error);
        } finally {

            return res
        }
    }

    wrapperComp() {
        return `<!-- ${this.name} -->\n${this.compStr}\n<!-- /${this.name} -->\n`
    }

    isMatch(target) {
        return target.template.match(this.regex)
    }

    updateComp(target) {
        target.setCompont(this.name, this.wrapperComp())
    }

    delateComp(target) {
        target.setCompont(this.name, this.wrapperComp())

    }

    createComp(target) {
        target.setCompont(this.name, this.wrapperComp())

    }

    anlyDep(target) {
        const hasDep = this.compStr.startsWith('Depends')
        const deps = []
        for (let index = 0; index < array.length; index++) {
            const path = deps[index];
            const component = new CompTool(path)
            if (!component.isMatch(template)) {
                component.createComp(target)
            }
        }
    }
}

class Template {
    constructor() {
        this.root = `${process.cwd()}/src/templates/template.html`
        this.template = this.getTemplate()
        this.componentsMap = new Map()
        this.sortQueue = ["Text.njk", "Title.njk", "Table.njk", "SideBar.njk", "Component.njk"]
    }

    getTemplate() {
        try {
            return readFileSync(this.root, "utf-8")
        } catch (error) {
            console.log(error);
            return ""
        }
    }

    setCompont(name, str) {
        this.componentsMap.set(name, str)
    }

    complierTemplate() {
        const getNum =([k,v])=>this.sortQueue.findIndex(v=>v===k)
        const res = Array.from(this.componentsMap)
        .sort((a,b)=>{
            return getNum(a)-getNum(b)
        })
        .map(([k,v])=>v)
        .join("\n")
        return res
    }

    buildTemplate() {
        writeFileSync(this.root, this.complierTemplate(), "utf-8")
    }
}

const template = new Template()

export function addHandler(path) {
    if (!CompTool.isComp(path)) return
    const component = new CompTool(path)
    if (component.isMatch(template)) {
        component.updateComp(template)
    } else {
        component.createComp(template)
    }
    template.buildTemplate()
    return
}

export function changeHandler(path) {
    if (!CompTool.isComp(path)) return
    const component = new CompTool(path)
    if (component.isMatch(template)) {
        component.updateComp(template)
    }
    template.buildTemplate()
    return
}

export function unlinkHandler(path) {
    if (!CompTool.isComp(path)) return
    const component = new CompTool(path)
    if (component.isMatch(template)) {
        component.delateComp(template)
    }
    template.buildTemplate()
    return
}