---
title: 请求模块
description: HTTP 请求工具函数
group:
  title: Request
---

# 请求模块

## 请求模块

### 业务场景与意图

封装了跨平台的 HTTP 请求功能，根据运行环境自动选择合适的请求库：

- **浏览器 / Node.js 环境**：默认使用 [Axios](https://axios-http.com/)（v1.x）
- **React Native 环境**（`reqEnv: 'rn'`）：使用原生 `fetch` API
- **Fetch 环境**（`reqEnv: 'fetch'`）：使用原生 `fetch` API
- **UniApp / 微信小程序环境**（`reqEnv: 'uni'`）：通过自定义 Axios 适配器调用 `uni.request`

### 快速上手

```typescript
import { request } from '@allahjs/utils';

// 发送 POST 请求（默认）
const data = await request('/api/user/list', {
  params: { pageNum: 1, pageSize: 10 },
  manner: 'json'
});

// 发送 GET 请求
const detail = await request('/api/user/detail', {
  method: 'get',
  params: { id: 1 }
});
```

### 环境配置

通过 `reqEnv` 参数指定请求环境：

```typescript
// 浏览器环境（默认，使用 Axios）
await request('/api/data', { reqEnv: 'browser' });

// Fetch 环境
await request('/api/data', { reqEnv: 'fetch' });

// React Native 环境
await request('/api/data', { reqEnv: 'rn' });

// UniApp / 微信小程序环境
await request('/api/data', { reqEnv: 'uni' });
```

### 代码演示

<code src="./index.ts"></code>
