---
title: 颜色工具
description: 常用色板访问工具，提供基于索引的颜色获取能力
group:
  title: Core
---

## 颜色工具

### 业务场景与意图
提供内置色板的稳定取色能力，适用于图表、标签、分类配色等需要一致颜色序列的场景。

### 代码演示
```typescript
import colorUtils from './index';

const primary = colorUtils.getColor(0);
const seriesColor = colorUtils.getColor(3);
```

### API 属性
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| getColor | 按索引获取颜色 | `(index: number) => string` | - |
