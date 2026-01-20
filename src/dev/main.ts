import express, { Request, Response } from "express"
import nunjucks from "nunjucks";
import { addHandler, changeHandler, unlinkHandler, watcher } from "./hook.js";
import { useMockData } from "./utils.js";
import { sendEmail } from "./config.js";
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

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

const port = process.env.PORT ? parseInt(process.env.PORT) : 3007
app.listen(port, () => {
    console.log(`Templates 开发服务器已启动，端口: ${port}`);
    console.log(`访问示例: http://localhost:${port}/example/report_test`);
});

app.get('/email/:file', async (req: Request, res: Response) => {
    const { file } = req.params
    const mockData = useMockData({ path: `${process.cwd()}/src/examples/${file}.json` })

    // 使用时间戳避免缓存
    const cacheBuster = Date.now();
    const { templateText } = await import(`../template.dist.js?${cacheBuster}`)
    const { styleText } = await import(`../style.dist.js?${cacheBuster}`)

    let html = "<h1>渲染失败</h1>"
    try {
        html = styleText + nunjucks.renderString(templateText, { ctx: mockData })
    } catch (error) {
        console.error('模板渲染错误:', error);
        res.status(500).send('模板渲染失败')
        return
    }

    // 发送邮件
    await sendEmail(html, `njk-tool 模板渲染: ${file}`)

    res.send(html)
})

app.get('/example/:file', async (req: Request, res: Response) => {
    const { file } = req.params
    const mockData = useMockData({ path: `${process.cwd()}/src/examples/${file}.json` })

    // 使用时间戳避免缓存
    const cacheBuster = Date.now();
    const { templateText } = await import(`../template.dist.js?${cacheBuster}`)
    const { styleText } = await import(`../style.dist.js?${cacheBuster}`)

    let html = "<h1>渲染失败</h1>"
    try {
        html = nunjucks.renderString(templateText, { ctx: mockData })
    } catch (error) {
        console.error('模板渲染错误:', error);
        res.status(500).send('模板渲染失败')
        return
    }

    res.send(styleText + html)
})

// 健康检查端点
app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})
