import { defineConfig } from 'dumi';

export default defineConfig({
  themeConfig: {
    name: 'allahjs',
    footer: 'MIT Licensed | © allah-prime',
    socialLinks: {
      github: 'https://github.com/allah-prime/allah-utils',
    },
  },
  base: '/allah-utils/',
  publicPath: '/allah-utils/',
  resolve: {
    atomDirs: [
      { type: 'component', dir: 'src/core' },
      { type: 'component', dir: 'src/browser' },
      { type: 'component', dir: 'src/request' },
      { type: 'component', dir: 'src/uniapp' },
      { type: 'component', dir: 'src/types' },
    ],
  },
  locales: [{ id: 'zh-CN', name: '中文' }],
  favicons: ['https://avatars.githubusercontent.com/u/000000?v=4'],
});
