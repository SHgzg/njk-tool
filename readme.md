// import { readdirSync } from "fs"
// import { render as nunjucksRender } from "nunjucks"
// import { parse } from "path"

// export interface CmposeConfig {
//     name: string
//     slot: string
// }

// const BasePath = `${process.cwd()}/src/templates/pages/`
// const FilesMap = readdirSync(BasePath)
//     .filter((fileName) => fileName.endsWith('.html'))
//     .reduce((fileMap: any, filename: string) => {
//         const path = BasePath + filename
//         const name = parse(path).name
//         fileMap[name] = path
//         return fileMap
//     }, {})

// export class RenderTool {
//     basePath = BasePath
//     templateMap = FilesMap
    
//     render(templateName: string,data:any):string{
//         console.log(this.templateMap);
        
//         console.log(this.templateMap[templateName]);
        
//         return nunjucksRender(this.templateMap[templateName], data)
//     }
//     composeTmplatas(conf:any) {

//     }
// }




import { app } from "./server";
// import { RenderTool, } from "./transformer";


const data = [
    {
        title:"标题 1",
        id:"tab1",
        content_id:"content1",
        content:[123,123,123,123,123],
        type:"table"
    },
    {
        title:"标题 2",
        id:"tab2",
        content_id:"content2",
        content:["asdf",123,123,123,123],
        type:"table"
    },
    {
        title:"标题 3",
        id:"tab3",
        content_id:"content3",
        content:["asdf",123,123,123,123],
        type:"table"
    },
]


// const tool = new RenderTool()
// // app.get('/', function(req, res){
// //    const rep = tool.render("report",{data,tabs:data})
// // res.send(rep);
// // });
// app.get('/test/page/*page', function(req, res){
//    console.log(req.params);
   
// });