import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import dts from 'rollup-plugin-dts';
import { readFileSync } from 'fs';
import { getModuleEntries } from './scripts/scan-modules.mjs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

/**
 * 动态获取所有模块的入口文件
 * 自动扫描 src 目录下的子目录，查找 index.ts 文件作为模块入口
 */
const moduleEntries = getModuleEntries('src');

export default [
  // 构建 JavaScript 文件 - 支持多入口
  {
    input: moduleEntries,
    output: [
      {
        dir: 'dist',
        format: 'cjs',
        sourcemap: true,
        entryFileNames: (chunkInfo) => {
          // 保持原目录结构，CommonJS 使用 .cjs 扩展名
          const name = chunkInfo.name;
          if (name === 'index') {
            return 'index.cjs';
          }
          return `${name}.cjs`;
        },
        chunkFileNames: 'chunks/[name]-[hash].js',
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
      {
        dir: 'dist/esm',
        format: 'esm',
        sourcemap: true,
        entryFileNames: (chunkInfo) => {
          // 保持原目录结构
          const name = chunkInfo.name;
          if (name === 'index') {
            return 'index.js';
          }
          return `${name}.js`;
        },
        chunkFileNames: 'chunks/[name]-[hash].js',
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    ],
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          // 替换 Node.js 环境检查
          'typeof process': '"undefined"',
          'process.env.NODE_ENV': '"production"',
        }
      }),
      alias({
        entries: [
          // 为浏览器环境提供 stream 的空实现
          { find: 'stream', replacement: 'stream-browserify' },
          { find: 'util', replacement: 'util' },
        ]
      }),
      resolve({
        browser: true, // 优先使用浏览器版本
        preferBuiltins: false, // 不优先使用 Node.js 内置模块
        exportConditions: ['browser', 'module', 'import', 'default'],
        // 确保能够解析 axios 内部的相对路径
        dedupe: ['axios']
      }),
      commonjs(),
      json(),
      typescript({
        tsconfig: './tsconfig.json',
        exclude: ['**/*.test.ts', '**/*.spec.ts'],
        declaration: false, // 禁用 TypeScript 插件的声明文件生成
        declarationMap: false, // 禁用声明映射文件
        outDir: null, // 让 Rollup 处理输出目录
      }),
    ],
    external: (id) => {
      // 对于 Node.js 内置模块，标记为外部
      const nodeBuiltins = ['fs', 'path', 'url', 'crypto', 'util', 'stream', 'events', 'buffer', 'querystring', 'http', 'https', 'zlib', 'os', 'child_process'];
      if (nodeBuiltins.includes(id)) {
        return true;
      }
      // 将主要依赖标记为外部，避免打包进来
      const externalDeps = ['axios', 'crypto-js', 'dayjs', 'jsencrypt', 'uuid'];
      return externalDeps.includes(id);
    },
  },
  // 构建 CommonJS 类型定义文件
  {
    input: moduleEntries,
    output: {
      dir: 'dist',
      format: 'esm',
      entryFileNames: (chunkInfo) => {
        // 保持原目录结构
        const name = chunkInfo.name;
        if (name === 'index') {
          return 'index.d.ts';
        }
        return `${name}.d.ts`;
      },
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    plugins: [dts()],
  },
  // 构建 ESM 类型定义文件
  {
    input: moduleEntries,
    output: {
      dir: 'dist/esm',
      format: 'esm',
      entryFileNames: (chunkInfo) => {
        // 保持原目录结构
        const name = chunkInfo.name;
        if (name === 'index') {
          return 'index.d.ts';
        }
        return `${name}.d.ts`;
      },
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    plugins: [dts()],
  },
];