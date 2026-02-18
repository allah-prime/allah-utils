---
title: URL 工具
description: URL 参数解析与拼接工具集，支持查询串构建、更新与路径拆分
group:
  title: Browser
---

## URL 工具

### 业务场景与意图
提供 URL 查询参数的解析、构建与更新能力，帮助在路由、筛选、分享链接与参数同步等场景中稳定处理 URL 数据。

### 代码演示
```typescript
import urlUtils, { getUrlParams } from './index';

const params = getUrlParams<{ token?: string }>('https://a.com?a=1&token=xx');
const nextUrl = urlUtils.setUrlParams({ pathname: '/list', query: { page: 2 } });
```

### API 属性
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| getUrlParams | 解析 URL 查询参数 | `<T = any>(url?: string) => T` | `window.location.href` |
| getLocalPath | 获取路径指定段 | `(url: string, index?: number) => string` | `-1` |
| getWebLocalPath | 从当前页面路径获取指定段 | `(index?: number) => string` | `-1` |
| refreshUrlState | 用新参数刷新地址栏 | `(data: Record<string, string>) => void` | - |
| setUrlParams | 拼接路径与查询参数 | `(params: { pathname: string; query: Record<string, any> }) => string` | - |
| buildQueryParams | 构建查询参数字符串 | `(params: any) => string` | - |
| getPageQueryParams | 解析查询字符串 | `(queryString: string) => Record<string, any>` | - |
| getUpdateUrl | 更新 URL 中的参数 | `(href: string, params: Record<string, string>) => string` | - |
| urlEncode | 对象转 URL 编码字符串 | `(param: any, prefix?: string, encode?: boolean) => string` | `true` |
| urlToList | URL 转路径层级数组 | `(url?: string) => string[]` | - |
