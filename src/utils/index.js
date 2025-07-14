import { readFileSync } from "node:fs";

export const useMockData = (param) => {
    const {name,path} = param
    const filePath =path? path : join(`${process.cwd()}/src/mock`, `${name}.json`)
    try {
        const fileContent = readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
    } catch (err) {
        if (err.code === 'ENOENT') {
            throw new Error(`文件不存在: ${filePath}`);
        } else if (err instanceof SyntaxError) {
            throw new Error(`JSON 解析失败: ${err.message}`);
        } else {
            throw new Error(`读取文件失败: ${err.message}`);
        }
    }
}