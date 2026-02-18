---
title: 异步工具
description: 异步流程控制与缓存工具集，提供延迟、重试、并发与队列能力
group:
  title: Core
---

## 异步工具

### 业务场景与意图
面向异步任务编排场景，提供延迟执行、超时控制、重试机制、并发控制、防抖节流与异步队列，适用于请求聚合、批处理与资源限流等场景。

### 代码演示
```typescript
import asyncUtils from './index';

await asyncUtils.retry(() => fetch('/api').then(r => r.json()), 3, 500);
const results = await asyncUtils.concurrent([() => Promise.resolve(1), () => Promise.resolve(2)], 2);
```

### API 属性
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| delay | 延迟执行 | `(ms: number) => Promise<void>` | - |
| withTimeout | 超时控制 | `<T>(promise: Promise<T>, timeout: number, timeoutMessage?: string) => Promise<T>` | `'Operation timed out'` |
| retry | 重试机制 | `<T>(fn: () => Promise<T>, maxRetries?: number, delayMs?: number) => Promise<T>` | `3, 1000` |
| concurrent | 并发控制 | `<T>(tasks: (() => Promise<T>)[], concurrency?: number) => Promise<T[]>` | `3` |
| debounce | 防抖函数 | `<T extends (...args: any[]) => any>(fn: T, delay: number) => (...args: Parameters<T>) => void` | - |
| throttle | 节流函数 | `<T extends (...args: any[]) => any>(fn: T, interval: number) => (...args: Parameters<T>) => void` | - |
| createQueue | 创建异步队列实例 | `() => AsyncQueue` | - |
| memoizeAsync | 异步函数缓存 | `<T extends (...args: any[]) => Promise<any>>(fn: T, keyFn?: (...args: Parameters<T>) => string, ttl?: number) => T` | `ttl = 0` |
| AsyncQueue | 异步队列类 | `class AsyncQueue { add<T>(task: () => Promise<T>): Promise<T> }` | - |
