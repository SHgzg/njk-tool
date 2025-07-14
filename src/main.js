

import express from "express"
import { readFileSync } from "fs";
import nunjucks from "nunjucks";
import { join } from "path";
import { addHandler, changeHandler, unlinkHandler, watcher } from "./dev/index.js";
import { useMockData } from "./utils/index.js";

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
    .on('change',changeHandler)
    .on('unlink', unlinkHandler)
    // .on('addDir', console.log(`新建目录: ${path}`))
    // .on('unlinkDir', path => console.log(`删除目录: ${path}`));

const port = 3007
app.listen(port, () => {
    console.log(`Templates 开发服务器已启动 ${port}`);
});

app.get('/example/:file', (req, res) => {
     const { file } = req.params
    const mockData = useMockData({path:`${process.cwd()}/src/examples/${file}.json`})
    const html = nunjucks.render(`./templates/template.html`, { ctx: mockData })
    const css = getBaseCss()
    res.send(html + css)
})

function getBaseCss(){
     const css = readFileSync(join(`${process.cwd()}/src/templates`, `base.css`), 'utf8')
    return  `<style>${css}</style>`
}







// http://localhost:3005/test/index/index
// http://localhost:3005/test/index/tab

// http://localhost:3005/comp/title

// windows
//  netstat -ano | findstr ":3005"  
// Stop-Process -Id 33108 -Force