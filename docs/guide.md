# 指南

## 安装

```bash
pnpm add @allahjs/utils
```

## 使用

```ts
import { capitalize, formatDate, unique } from "@allahjs/utils";
```

## 模块

- core
- browser
- request
- uniapp

## 自动发布与版本更新

项目使用 `semantic-release` + GitHub Actions 自动完成版本计算、打标签与 npm 发布。

### 触发条件

- 代码合并并推送到 `main` 分支后触发发布流程。
- 发布由 CI 自动执行，不需要手动修改版本号。

### 版本号如何更新

版本号由 **Conventional Commits** 提交信息自动计算：

- `fix:` -> 补丁版本（patch），例如 `0.0.2 -> 0.0.3`
- `feat:` -> 次版本（minor），例如 `0.0.2 -> 0.1.0`
- `BREAKING CHANGE:` -> 主版本（major），例如 `0.0.2 -> 1.0.0`

### 自动发布流程

CI 中大致会执行以下步骤：

1. 分析提交记录并计算下一个版本号
2. 更新 `CHANGELOG.md`
3. 创建 GitHub Release 与 Git Tag
4. 发布到 npm

### 提交建议

为了让版本更新符合预期，请使用规范化提交信息，例如：

```bash
feat: add xxx utility
fix: handle edge case in string utils
```

### 注意事项

- 不要手动修改 `package.json` 中的 `version` 字段。
- 若需要发布权限，仓库 CI 环境需配置 `NPM_TOKEN`。
