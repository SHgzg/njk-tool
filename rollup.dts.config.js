import dts from 'rollup-plugin-dts';
import { defineConfig } from 'rollup';

const config = defineConfig(
    {
        input: 'src/index.ts',         // 入口文件
        output: [
            {
                file: 'dist/bundle/type.d.ts',  // 输出 .d.ts 文件
                format: 'esm'              // 格式与 JS 保持一致
            }
        ],
        plugins: [dts()]
    }

)

export default config