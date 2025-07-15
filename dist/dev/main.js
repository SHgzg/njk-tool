"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = require("fs");
const nunjucks_1 = __importDefault(require("nunjucks"));
const path_1 = require("path");
const hook_1 = require("./hook");
const useMockData = (param) => {
    const { name, path } = param;
    // 构建文件路径
    const filePath = path
        ? path
        : (0, path_1.join)(`${process.cwd()}/src/mock`, `${name}.json`);
    try {
        // 同步读取文件内容
        const fileContent = (0, fs_1.readFileSync)(filePath, 'utf8');
        // 解析 JSON 并返回
        return JSON.parse(fileContent);
    }
    catch (err) {
        // 错误处理
        const fileErr = err;
        if (fileErr.code === 'ENOENT') {
            throw new Error(`文件不存在: ${filePath}`);
        }
        else if (err instanceof SyntaxError) {
            throw new Error(`JSON 解析失败: ${err.message}`);
        }
        else {
            throw new Error(`读取文件失败: ${fileErr.message}`);
        }
    }
};
const app = (0, express_1.default)();
app.set('view engine', 'html');
const externalTemplatesDir = `${process.cwd()}/src`;
nunjucks_1.default.configure(externalTemplatesDir, {
    autoescape: true,
    express: app,
    noCache: true
});
// 监听事件
hook_1.watcher
    .on('add', hook_1.addHandler)
    .on('change', hook_1.changeHandler)
    .on('unlink', hook_1.unlinkHandler);
// .on('addDir', console.log(`新建目录: ${path}`))
// .on('unlinkDir', path => console.log(`删除目录: ${path}`));
const port = 3007;
app.listen(port, () => {
    console.log(`Templates 开发服务器已启动 ${port}`);
});
app.get('/example/:file', (req, res) => {
    const { file } = req.params;
    const mockData = useMockData({ path: `${process.cwd()}/src/examples/${file}.json` });
    const html = nunjucks_1.default.render(`./templates/template.html`, { ctx: mockData });
    const css = getBaseCss();
    res.send(html + css);
});
function getBaseCss() {
    const css = (0, fs_1.readFileSync)((0, path_1.join)(`${process.cwd()}/src/templates`, `base.style`), 'utf8');
    return `<style>${css}</style>`;
}
// build()
function build() {
    const writePath = `${process.cwd()}/dist/template.html`;
    const css = (0, fs_1.readFileSync)((0, path_1.join)(`${process.cwd()}/src/templates`, `base.style`), 'utf8');
    const template = (0, fs_1.readFileSync)((0, path_1.join)(`${process.cwd()}/src/templates`, `template.html`), 'utf8');
    const res = `<style>${css}</style>` + template;
    (0, fs_1.writeFileSync)(writePath, res, "utf-8");
}
