

import express from "express"
import { readFileSync, writeFileSync } from "fs";
import nunjucks from "nunjucks";
import { join } from "path";
import { addHandler, changeHandler, unlinkHandler, watcher } from "./hook";

const useMockData = (param: {
  name?: string;       // 必须的 mock 文件名(不带.json后缀)
  path: string;      // 可选的完整文件路径(如果提供则忽略name)
}): unknown => {      // 返回类型为 unknown，因为 JSON 内容可以是任意结构
  const { name, path } = param;
  
  // 构建文件路径
  const filePath = path 
    ? path 
    : join(`${process.cwd()}/src/mock`, `${name}.json`);

  try {
    // 同步读取文件内容
    const fileContent = readFileSync(filePath, 'utf8');
    // 解析 JSON 并返回
    return JSON.parse(fileContent);
  } catch (err) {
    // 错误处理
    const fileErr = err as { code: string,message:string };
    if (fileErr.code === 'ENOENT') {
      throw new Error(`文件不存在: ${filePath}`);
    } else if (err instanceof SyntaxError) {
      throw new Error(`JSON 解析失败: ${err.message}`);
    } else {
      throw new Error(`读取文件失败: ${fileErr.message}`);
    }
  }
};

const app = express()
app.set('view engine', 'html')
const externalTemplatesDir = `${process.cwd()}/src`;
nunjucks.configure(externalTemplatesDir, {
    autoescape: true,
    express: app,
    noCache: true
})

// 监听事件
watcher
    .on('add', addHandler)
    .on('change', changeHandler)
    .on('unlink', unlinkHandler)
// .on('addDir', console.log(`新建目录: ${path}`))
// .on('unlinkDir', path => console.log(`删除目录: ${path}`));

const port = 3007
app.listen(port, () => {
    console.log(`Templates 开发服务器已启动 ${port}`);
});

app.get('/example/:file', (req, res) => {
    const { file } = req.params
    const mockData = useMockData({ path: `${process.cwd()}/src/examples/${file}.json` })
    const html = nunjucks.render(`./templates/template.html`, { ctx: mockData })
    const css = getBaseCss()
    res.send(html + css)
})

function getBaseCss() {
    const css = readFileSync(join(`${process.cwd()}/src/templates`, `base.style`), 'utf8')
    return `<style>${css}</style>`
}

// build()

function build() {
    const writePath = `${process.cwd()}/dist/template.html`
    const css = readFileSync(join(`${process.cwd()}/src/templates`, `base.style`), 'utf8')
    const template = readFileSync(join(`${process.cwd()}/src/templates`, `template.html`), 'utf8')
    const res = `<style>${css}</style>` + template
    writeFileSync(writePath, res, "utf-8")

}
