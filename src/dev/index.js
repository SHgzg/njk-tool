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
        const {deps,compStr} = this.getComp(path)
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
        try {
            return readFileSync(path, "utf-8")
        } catch (error) {
            console.log(error);
            return ""
        }
    }

    wrapperComp() {
        return `<!-- ${this.name} -->\n${this.compStr}\n<!-- /${this.name} -->\n`
    }

    isMatch(target) {
        return target.template.match(this.regex)
    }

    updateComp(target) {
        const newTemp = target.template.replace(this.regex, this.wrapperComp())
        target.set(newTemp)
    }

    delateComp(target) {
        const newTemp = target.template.replace(this.regex, "")
        target.set(newTemp)
    }

    createComp(target) {
        const newTemp = target.template += this.wrapperComp()
        target.set(newTemp)
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
    }

    getTemplate() {
        try {
            return readFileSync(this.root, "utf-8")
        } catch (error) {
            console.log(error);
            return ""
        }
    }

    set(str) {
        this.template = str
    }

    add(str) {
        this.template += str
    }

    build() {
        writeFileSync(this.root, this.template, "utf-8")
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
    template.build()
    return
}

export function changeHandler(path) {
    if (!CompTool.isComp(path)) return
    const component = new CompTool(path)
    if (component.isMatch(template)) {
        component.updateComp(template)
    }
    template.build()
    return
}

export function unlinkHandler(path) {
    if (!CompTool.isComp(path)) return
    const component = new CompTool(path)
    if (component.isMatch(template)) {
        component.delateComp(template)
    }
    template.build()
    return
}