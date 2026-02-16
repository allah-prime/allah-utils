import { defineConfig } from 'dumi';

export default defineConfig({
  themeConfig: {
    name: 'allah-utils',
    footer: 'MIT Licensed | © allah-prime',
    socialLinks: {
      github: 'https://github.com/allah-prime/allah-utils',
    },
  },
  base: '/',
  publicPath: '/',
  locales: [{ id: 'zh-CN', name: '中文' }],
  favicons: ['https://avatars.githubusercontent.com/u/000000?v=4'],
});
