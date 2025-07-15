"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Template = exports.watcher = void 0;
exports.addHandler = addHandler;
exports.changeHandler = changeHandler;
exports.unlinkHandler = unlinkHandler;
const chokidar_1 = require("chokidar");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const TARGET_PATH = `${process.cwd()}/src/templates`;
exports.watcher = (0, chokidar_1.watch)(TARGET_PATH, {
    persistent: true, // 持续监听
    awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100
    }
});
function getRelativePath(path) {
    return (0, node_path_1.relative)(TARGET_PATH, path);
}
function splitPath(filePath) {
    const folders = filePath.split("\\");
    const [, name,] = folders;
    return name;
}
class CompTool {
    constructor(path) {
        this.relativePath = getRelativePath(path);
        this.name = splitPath(this.relativePath);
        this.regexp = new RegExp(`<\!--\\s*${this.name}\\s*-->(.*?)<\!--\\s*\/\\s*${this.name}\\s*-->`, "s");
        this.contentStr = this.init(path);
    }
    static is(path) {
        return path.endsWith(".njk");
    }
    init(path) {
        try {
            return (0, node_fs_1.readFileSync)(path, "utf-8");
        }
        catch (error) {
            return "";
        }
    }
    wrapper() {
        return `<!-- ${this.name} -->\n${this.contentStr}\n<!-- /${this.name} -->\n`;
    }
    isMatch(target) {
        return target.template.match(this.regexp);
    }
    update(target) {
        target.setComponent(this.name, this.wrapper());
    }
    delate(target) {
        target.setComponent(this.name, "");
    }
    create(target) {
        target.setComponent(this.name, this.wrapper());
    }
}
class StyleTool {
    constructor(path) {
        this.relativePath = getRelativePath(path);
        this.name = splitPath(this.relativePath);
        this.regexp = new RegExp(`<\!--\\s*${this.name}\\s*-->(.*?)<\!--\\s*\/\\s*${this.name}\\s*-->`, "s");
        this.contentStr = this.init(path);
    }
    static is(path) {
        return path.endsWith(".css");
    }
    init(path) {
        try {
            return (0, node_fs_1.readFileSync)(path, "utf-8");
        }
        catch (error) {
            return "";
        }
    }
    wrapper() {
        return `/* ${this.name} */\n${this.contentStr}\n/* END-${this.name} */\n`;
    }
    isMatch(target) {
        return target.template.match(this.regexp);
    }
    update(target) {
        target.setStyle(this.name, this.wrapper());
    }
    delate(target) {
        target.setStyle(this.name, "");
    }
    create(target) {
        target.setStyle(this.name, this.wrapper());
    }
}
class Template {
    constructor() {
        this.template_root_path = `${process.cwd()}/src/templates/template.html`;
        this.style_root_path = `${process.cwd()}/src/templates/base.style`;
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
        ];
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
        ];
        this.componentsMap = new Map();
        this.styleMap = new Map();
        this.template = this.getTemplate();
        this.style = this.getStyle();
    }
    getTemplate() {
        try {
            return (0, node_fs_1.readFileSync)(this.template_root_path, "utf-8");
        }
        catch (error) {
            console.log(error);
            return "";
        }
    }
    getStyle() {
        try {
            return (0, node_fs_1.readFileSync)(this.style_root_path, "utf-8");
        }
        catch (error) {
            console.log(error);
            return "";
        }
    }
    setComponent(name, str) {
        this.componentsMap.set(name, str);
    }
    setStyle(name, str) {
        this.styleMap.set(name, str);
    }
    compileComponent() {
        const getNum = ([k, v]) => this.sortComp.findIndex(key => key === k) || 999;
        const res = Array.from(this.componentsMap)
            .sort((a, b) => {
            return getNum(a) - getNum(b);
        })
            .map(([k, v]) => v)
            .join("\n");
        return res;
    }
    compileStyle() {
        const getNum = ([k, v]) => this.sortCss.findIndex(key => key === k) || 999;
        const res = Array.from(this.styleMap)
            .sort((a, b) => {
            return getNum(a) - getNum(b);
        })
            .map(([k, v]) => {
            return v;
        })
            .join("\n");
        return res;
    }
    buildComponent() {
        (0, node_fs_1.writeFileSync)(this.template_root_path, this.compileComponent(), "utf-8");
    }
    buildStyle() {
        (0, node_fs_1.writeFileSync)(this.style_root_path, this.compileStyle(), "utf-8");
    }
}
exports.Template = Template;
const template = new Template();
const FactoryMap = {
    Style: StyleTool,
    Component: CompTool,
};
function HandlerFactory(type) {
    const Factory = FactoryMap[type];
    return function (event, path) {
        if (!Factory.is(path))
            return;
        const instance = new Factory(path);
        switch (event) {
            case 'add':
                instance.isMatch(template) ? instance.update(template)
                    : instance.create(template);
                template === null || template === void 0 ? void 0 : template[`build${type}`]();
                break;
            case 'change':
                if (!instance.isMatch(template))
                    return;
                instance.update(template);
                template === null || template === void 0 ? void 0 : template[`build${type}`]();
                break;
            case 'unlink':
                if (!instance.isMatch(template))
                    return;
                instance.delate(template);
                template === null || template === void 0 ? void 0 : template[`build${type}`]();
                break;
        }
    };
}
const compHandler = HandlerFactory("Component");
const styleHandler = HandlerFactory("Style");
function addHandler(path) {
    if (CompTool.is(path)) {
        return compHandler("add", path);
    }
    else if (StyleTool.is(path)) {
        return styleHandler("add", path);
    }
}
function changeHandler(path) {
    if (CompTool.is(path)) {
        return compHandler("change", path);
    }
    else if (StyleTool.is(path)) {
        return styleHandler("change", path);
    }
}
function unlinkHandler(path) {
    if (CompTool.is(path)) {
        return compHandler("unlink", path);
    }
    else if (StyleTool.is(path)) {
        return styleHandler("unlink", path);
    }
}
