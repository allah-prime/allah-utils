---
title: numberUtils
description: 提供数字格式化、范围限制、随机数生成、数学计算（GCD/LCM）及单位转换等常用数字处理工具函数。
group:
  title: core
  order: 2
---

## numberUtils 数字工具

### 业务场景与意图
本模块旨在提供一套通用的数字处理工具，解决前端开发中常见的数字格式化（千分位、文件大小）、数学计算（最大公约数、最小公倍数、百分比）以及数值范围控制（Clamp、MapRange）等问题。适用于数据展示、图表计算、随机模拟等多种业务场景。

### 代码演示

#### formatNumber 数字格式化
将数字格式化为带千分位分隔符的字符串，常用于金额展示。

```typescript
import { numberUtils } from '@allahjs/utils';

// 默认使用逗号分隔
console.log(numberUtils.formatNumber(1234567.89)); // "1,234,567.89"

// 自定义分隔符
console.log(numberUtils.formatNumber(1234567.89, '_')); // "1_234_567.89"
```

#### toFixed 保留小数位数
保留指定的小数位数，返回数字类型（注意不是字符串）。

```typescript
import { numberUtils } from '@allahjs/utils';

// 保留2位小数
console.log(numberUtils.toFixed(3.14159, 2)); // 3.14

// 不足位数不会补0，因为返回的是 number 类型
console.log(numberUtils.toFixed(3.1, 2)); // 3.1
```

#### formatBytes 文件大小格式化
将字节数转换为人类可读的文件大小字符串（KB, MB, GB等）。

```typescript
import { numberUtils } from '@allahjs/utils';

// 自动转换单位
console.log(numberUtils.formatBytes(1024)); // "1 KB"
console.log(numberUtils.formatBytes(1234567)); // "1.18 MB"
console.log(numberUtils.formatBytes(0)); // "0 Bytes"
```

#### percentage 计算百分比
计算数值在总数中的百分比，默认保留2位小数。

```typescript
import { numberUtils } from '@allahjs/utils';

// 计算 50 在 200 中的百分比
console.log(numberUtils.percentage(50, 200)); // 25

// 计算 1 在 3 中的百分比
console.log(numberUtils.percentage(1, 3)); // 33.33
```

#### random 生成随机数
生成指定范围内的随机数，支持生成整数。

```typescript
import { numberUtils } from '@allahjs/utils';

// 生成 1 到 10 之间的随机浮点数
console.log(numberUtils.random(1, 10)); // e.g. 5.67

// 生成 1 到 10 之间的随机整数
console.log(numberUtils.random(1, 10, true)); // e.g. 7
```

#### clamp 限制数值范围
将数值限制在指定的最小值和最大值之间。

```typescript
import { numberUtils } from '@allahjs/utils';

// 数值在范围内，返回原值
console.log(numberUtils.clamp(5, 1, 10)); // 5

// 数值小于最小值，返回最小值
console.log(numberUtils.clamp(-5, 1, 10)); // 1

// 数值大于最大值，返回最大值
console.log(numberUtils.clamp(15, 1, 10)); // 10
```

#### mapRange 数值映射
将数值从一个范围线性映射到另一个范围。

```typescript
import { numberUtils } from '@allahjs/utils';

// 将 0-100 的数值 50 映射到 0-1000 的范围
console.log(numberUtils.mapRange(50, 0, 100, 0, 1000)); // 500
```

#### gcd & lcm 最大公约数与最小公倍数
用于数学计算场景。

```typescript
import { numberUtils } from '@allahjs/utils';

// 最大公约数 (Greatest Common Divisor)
console.log(numberUtils.gcd(12, 18)); // 6

// 最小公倍数 (Least Common Multiple)
console.log(numberUtils.lcm(12, 18)); // 36
```

#### isEven & isOdd 奇偶判断
简单的布尔值判断。

```typescript
import { numberUtils } from '@allahjs/utils';

// 判断偶数
console.log(numberUtils.isEven(2)); // true
console.log(numberUtils.isEven(3)); // false

// 判断奇数
console.log(numberUtils.isOdd(3)); // true
console.log(numberUtils.isOdd(2)); // false
```
