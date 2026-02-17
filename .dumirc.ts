import { defineConfig } from 'dumi';

export default defineConfig({
  themeConfig: {
    name: 'allahjs-utils',
    footer: 'MIT Licensed | © allah-prime',
    socialLinks: {
      github: 'https://github.com/allah-prime/allah-utils',
    },
  },
  base: '/allah-utils/',
  publicPath: '/allah-utils/',
  locales: [{ id: 'zh-CN', name: '中文' }],
  favicons: ['https://avatars.githubusercontent.com/u/000000?v=4'],
});
