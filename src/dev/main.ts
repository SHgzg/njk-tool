

import express from "express"
import nunjucks from "nunjucks";
import { addHandler, changeHandler, unlinkHandler, watcher } from "./hook.js";
import { useMockData } from "./utils.js";

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

app.get('/example/:file', async (req, res) => {
    const { file } = req.params
    const mockData = useMockData({ path: `${process.cwd()}/src/examples/${file}.json` })
    const { templateText } = await import("../template.dist.js?" + Date.now() as any)
    // console.log(templateText);

    const { styleText } = await import("../style.dist.js?" + Date.now() as any)
    let html = "<h1>渲染失败</h1>"
    try {
        html = nunjucks.renderString(templateText, { ctx: mockData })
    } catch (error) {
        console.log(error);
    }
    res.send(styleText + html)
})
