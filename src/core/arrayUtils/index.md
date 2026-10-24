---
title: 数组工具
description: 常用数组处理与集合运算工具集，涵盖去重、分组与交并差操作
group:
  title: Core
---

## 数组工具

### 业务场景与意图
提供数组去重、分块、扁平化、洗牌、交并差与分组等能力，适用于列表整理、数据聚合与筛选处理等通用场景。

### 代码演示
```typescript
import arrayUtils from './index';

const list = [1, 2, 2, 3];
const unique = arrayUtils.unique(list);
const groups = arrayUtils.groupBy(list, item => (item % 2 === 0 ? 'even' : 'odd'));
```

### API 属性
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| unique | 数组去重 | `<T>(arr: T[]) => T[]` | - |
| chunk | 数组分块 | `<T>(arr: T[], size: number) => T[][]` | - |
| flatten | 数组扁平化 | `<T>(arr: any[], depth?: number) => T[]` | `1` |
| shuffle | 数组洗牌 | `<T>(arr: T[]) => T[]` | - |
| intersection | 数组交集 | `<T>(arr1: T[], arr2: T[]) => T[]` | - |
| difference | 数组差集 | `<T>(arr1: T[], arr2: T[]) => T[]` | - |
| groupBy | 数组分组 | `<T, K extends string \| number \| symbol>(arr: T[], keyFn: (item: T) => K) => Record<K, T[]>` | - |
| getListId | 从选项列表取目标值 | `(s: string, optList: IOptions2[], key: string) => any \| null` | - |
