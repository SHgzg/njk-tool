import { readFileSync } from "fs";
import { join } from "path";

export const useMockData = (param: {
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
    const fileErr = err as { code: string, message: string };
    if (fileErr.code === 'ENOENT') {
      throw new Error(`文件不存在: ${filePath}`);
    } else if (err instanceof SyntaxError) {
      throw new Error(`JSON 解析失败: ${err.message}`);
    } else {
      throw new Error(`读取文件失败: ${fileErr.message}`);
    }
  }
};

const wrapper = (str: string, pre = "", after = "") => {
  return pre + str + after
}

export const templateStringWrapper = (tempalte: string) => wrapper(tempalte, "export const templateText = `", "`").replace(/(\r?\n\s*)+/g, '\n').trim()
export const styleStringWrapper = (tempalte: string) => wrapper(tempalte, "export const styleText = `<style>", "</style>`").replace(/(\r?\n\s*)+/g, '\n').trim()