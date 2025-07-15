

import express from "express"
import { readFileSync } from "fs";
import nunjucks from "nunjucks";
import { addHandler, changeHandler, unlinkHandler, watcher } from "./hook";
import { useMockData } from "./utils";

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
    const html = nunjucks.render(`index.html`, { ctx: mockData })
    const css = getBaseCss()
    res.send(html + css)
})

function getBaseCss() {
    const css = readFileSync(`${process.cwd()}/src/base.style`, 'utf8')
    return `<style>${css}</style>`
}
