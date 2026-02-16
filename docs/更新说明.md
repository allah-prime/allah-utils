# 更新说明

## 版本 0.0.15 (最新)

### 🚀 新功能

- **feat(cryptoUtils)**: 实现跨环境兼容的异步加密工具 (fd06359)
  - 支持浏览器和Node.js环境
  - 提供异步加密/解密功能

### 🔧 构建优化

- **build**: 更新打包规则，可以同时支持多种模块格式 (a35b70f)
  - 支持ESM、CJS、UMD等多种格式
  - 优化模块导出配置

### 🐛 问题修复

- **fix**: 修复日期格式化空值问题并优化云函数工具 (f7e7580)
  - 解决日期工具处理空值时的异常
  - 改进云函数响应处理逻辑

---

## 版本 0.0.7-0.0.14

### 🔄 重构优化

- **refactor**: 修复模块导入路径并优化云函数响应处理 (9decba2)
- **refactor(core)**: 重构日期工具函数使用dayjs替代原生Date (96d5cf4)
  - 提供更强大的日期处理能力
  - 统一日期格式化接口

### 🚀 新功能

- **feat(uniapp)**: 使validateRequiredFields的requiredFields参数可选，并导出pageUtils的defTableData (f44e03e)
- **feat**: 添加云函数工具类和提示工具类，优化加密工具和构建配置 (3834e86)
- **feat**: 添加新工具函数并更新版本号 (00b4d2c)
- **feat**: 更新包名和版本号并添加类型定义 (e072c68)

### 🔄 类型系统重构

- **refactor(types)**: 重构IOptions接口定义，提取公共属性 (9246927)
- **refactor(uniapp)**: 重构工具模块并添加类型定义 (800771d)
- **refactor(types)**: 移除未使用的request类型导出 (2778bc5)

### 🔧 构建配置

- **build**: 添加.npmignore并更新发布配置 (4293618)
- **refactor(build)**: 重构rollup配置并添加新模块结构 (14a6d45)
