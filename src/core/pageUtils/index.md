---
title: PageUtils 分页工具
description: 提供标准化的分页数据结构定义、Ant Design Table 分页配置生成器及分页临界状态判断工具。
group:
  title: Core
  order: 1
---

## PageUtils 分页工具

### 业务场景与意图

在后台管理系统中，表格分页是最高频的交互场景之一。本模块旨在解决以下核心问题：

1.  **数据结构标准化**：统一前后端分页数据的契约（`ITablePage`），确保字段命名一致（如 `current`, `size`, `total`, `records`）。
2.  **UI 配置自动化**：通过 `buildPageConfig` 将后端分页数据直接转化为 Ant Design Table 组件所需的 `pagination` 配置对象，减少重复样板代码。
3.  **交互体验优化**：通过 `isLastPageData` 智能识别"当前页仅剩最后一条数据"的临界状态，主要用于删除操作后的页码自动回退（如从第 2 页最后一条删除后自动跳回第 1 页），防止表格出现空页。

### 代码演示

<code src="./demos/basic.tsx">分页配置生成与临界状态检测</code>

### API 属性

#### ITablePage<T> (分页数据接口)

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| records | 当前页的数据列表 | `T[]` | `[]` |
| current | 当前页码（从 1 开始） | `number` | `0` |
| size | 每页条数 | `number` | `0` |
| total | 数据总条数 | `number` | `0` |
| pages | 总页数 | `number` | `0` |
| asc | 是否升序排序（可选） | `boolean` | `-` |

#### isLastPageData (函数)

判断当前页数据是否为该页的最后一条（且非第一页）。常用于删除操作后的页面跳转判断。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 分页数据对象 | `ITablePage<any>` | - |

**返回**: `boolean` - 如果是最后一条且 `current > 1` 返回 `true`，否则返回 `false`。

#### buildPageConfig (函数)

生成 Ant Design Table 组件所需的 `pagination` 配置对象。

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 分页数据对象 | `ITablePage<any>` | - |

**返回**: `TablePaginationConfig` - 包含 `current`, `pageSize`, `total`, `showTotal` 等配置。

#### defaultTableData (常量)

提供一个初始化的空分页对象，用于 React State 的初始值。

```typescript
const defaultTableData = {
  current: 0,
  pages: 0,
  records: [],
  list: [],
  size: 0,
  total: 0
};
```
