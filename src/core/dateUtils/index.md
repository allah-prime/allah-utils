---
title: 日期工具
description: 统一的日期格式化与时间范围计算工具集，覆盖相对时间、范围格式化与时间片段判断
group:
  title: Core
---

## 日期工具

### 业务场景与意图
提供格式化与计算能力，支持前端展示层的时间文案、报表筛选的区间起止、时间序列的基准对比等场景。适用于列表时间展示、筛选控件、统计报表与时间段归档等业务。

### 代码演示
```typescript
import dateUtils from './index';

const createdAt = dateUtils.formatDate(Date.now(), 'YYYY-MM-DD');
const ago = dateUtils.timeAgo(Date.now() - 3 * 60 * 60 * 1000);
const nextWeek = dateUtils.addTime(new Date(), 7, 'days');
const { start, end } = dateUtils.getDateRange(new Date(), 'month');

const isToday = dateUtils.isSameDay(Date.now(), new Date());
const days = dateUtils.getDaysInMonth(2026, 1);
const yearOptions = dateUtils.getYearOptions(3);
const pastYearOptions = dateUtils.getPastYearOptions(3);

const displayTime = dateUtils.formatTime(Date.now() - 2 * 24 * 60 * 60 * 1000);
const daytime = dateUtils.getDayTimeStr();

const safe = dateUtils.safeFormat('2026-02-18', 'YYYY/MM/DD');
const safeTime = dateUtils.safeFormatTime('2026-02-18 13:30:00');
const range = dateUtils.formatDateRange('2026-02-01', '2026-02-18');
```

### API 属性
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| formatDate | 格式化日期 | `(date: Date \| number \| string, format?: string) => string` | `'YYYY-MM-DD HH:mm:ss'` |
| timeAgo | 相对时间文案 | `(date: Date \| number \| string) => string` | - |
| addTime | 添加时间并返回新日期 | `(date: Date \| number \| string, amount: number, unit: 'years' \| 'months' \| 'days' \| 'hours' \| 'minutes' \| 'seconds') => Date` | - |
| getDateRange | 获取单位粒度的起止范围 | `(date: Date \| number \| string, unit: 'day' \| 'week' \| 'month' \| 'year') => { start: Date; end: Date }` | - |
| isSameDay | 判断是否同一天 | `(date1: Date \| number \| string, date2: Date \| number \| string) => boolean` | - |
| isLeapYear | 判断是否闰年 | `(year: number) => boolean` | - |
| getDaysInMonth | 获取指定月份天数 | `(year: number, month: number) => number` | - |
| getYearOptions | 生成未来年份选项 | `(num?: number) => Array<{ id: number; text: number }>` | `3` |
| getPastYearOptions | 生成过去年份选项 | `(num?: number) => Array<{ id: number; text: number }>` | `3` |
| formatTime | 将时间戳格式化为相对文案 | `(timestamp: string \| number) => string` | - |
| getDayTimeStr | 获取时间段文案 | `(date?: Dayjs) => string` | - |
| safeFormat | 安全格式化日期 | `(date: any, format?: string) => string` | `'YYYY-MM-DD'` |
| safeFormatTime | 安全格式化时间 | `(date: any, format?: string) => string` | `'YYYY-MM-DD HH:mm:ss'` |
| formatDateRange | 格式化日期范围 | `(startTime?: string, endTime?: string) => string` | - |

### 边界条件与异常
* formatDate 传入空值时返回 `未知`
* safeFormat 输入无效日期时返回 `-`
* formatDateRange 支持起止缺失的区间展示
