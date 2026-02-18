---
title: Cookie 工具
description: 浏览器 Cookie 读写删除的轻量工具集，覆盖设置、获取与清理场景
group:
  title: Browser
---

## Cookie 工具

### 业务场景与意图
面向浏览器环境的 Cookie 管理能力，覆盖读取、写入、删除与批量清理等常见场景，便于在登录态、偏好配置与埋点标识等场景中统一处理 Cookie。

### 代码演示
```typescript
import cookieUtils from './index';

cookieUtils.set('token', 'abc', { path: '/', expires: 7 });
const token = cookieUtils.read('token');
const exists = cookieUtils.exists('token');
cookieUtils.remove('token', { path: '/' });
```

### API 属性
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| read | 读取指定名称的 Cookie | `(name: string) => string \| null` | - |
| set | 设置 Cookie 与可选项 | `(name: string, value: string, options?: { expires?: Date \| number; path?: string; domain?: string; secure?: boolean; sameSite?: 'Strict' \| 'Lax' \| 'None' }) => void` | `{}` |
| remove | 删除指定 Cookie | `(name: string, options?: { path?: string; domain?: string }) => void` | `{}` |
| getAll | 获取当前域下全部 Cookie | `() => Record<string, string>` | - |
| exists | 判断 Cookie 是否存在 | `(name: string) => boolean` | - |
| clearAll | 清除当前域下全部 Cookie | `(options?: { path?: string; domain?: string }) => void` | `{}` |
