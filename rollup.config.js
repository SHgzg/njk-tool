// 导入依赖
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import copy from 'rollup-plugin-copy'
import { defineConfig } from 'rollup';

const plugins = [
    typescript({
        tsconfig: './tsconfig.json', // 指定配置文件路径
        sourceMap: true,             // 生成 Source Map
        inlineSources: true,         // 内联源码到 Source Map
    }),
    json(),
    resolve(),
    commonjs(),
    copy({
        targets: [
            { src: 'src/index.html', dest: 'dist/bundle/src' },
            { src: 'src/base.style', dest: 'dist/bundle/src' }
        ]
    })
]


const config = defineConfig(
    {
        input: 'src/index.ts',
        output: [{
            file: 'dist/bundle/app.min.js',
            format: 'esm',
            sourcemap: true,
            exports: 'named',
        }, {
            file: 'dist/bundle/app.min.cjs',
            format: 'cjs',
            sourcemap: true,
            exports: 'named',
        }],
        plugins,
    },

)

export default config