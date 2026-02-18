---
title: DOM 工具
description: 浏览器 DOM 操作与查询的通用工具集，覆盖查询、样式、位置与交互能力
group:
  title: Browser
---

## DOM 工具

### 业务场景与意图
提供浏览器环境下的 DOM 查询、样式读写、位置计算、视口判断与交互能力，适用于页面布局控制、滚动定位、轻量交互和兼容性处理等前端场景。

### 代码演示
```typescript
import domUtils from './index';

const node = domUtils.$('#app');
if (node) {
  domUtils.addClass(node, 'active');
  const pos = domUtils.getElementPosition(node);
  domUtils.scrollToElement(node);
}
```

### API 属性
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| isBrowser | 判断是否浏览器环境 | `() => boolean` | - |
| $ | 查询单个元素 | `(selector: string, parent?: Document \| Element) => Element \| null` | `document` |
| $$ | 查询多个元素 | `(selector: string, parent?: Document \| Element) => Element[]` | `document` |
| addClass | 添加 CSS 类 | `(element: Element, className: string) => void` | - |
| removeClass | 移除 CSS 类 | `(element: Element, className: string) => void` | - |
| toggleClass | 切换 CSS 类 | `(element: Element, className: string) => boolean` | - |
| hasClass | 判断是否包含 CSS 类 | `(element: Element, className: string) => boolean` | - |
| setStyle | 设置内联样式 | `(element: HTMLElement, styles: Partial<CSSStyleDeclaration>) => void` | - |
| getStyle | 获取计算样式 | `(element: Element, property: string) => string` | - |
| createElement | 创建元素并附加属性子节点 | `(tagName: string, attributes?: Record<string, string>, children?: (Element \| string)[]) => HTMLElement \| null` | `{}` |
| getElementPosition | 获取元素位置信息 | `(element: Element) => { top: number; left: number; width: number; height: number }` | - |
| isInViewport | 判断元素是否在视口 | `(element: Element, threshold?: number) => boolean` | `0` |
| scrollToElement | 平滑滚动到元素 | `(element: Element, options?: ScrollIntoViewOptions) => void` | `{ behavior: 'smooth', block: 'start' }` |
| copyToClipboard | 复制文本到剪贴板 | `(text: string) => Promise<boolean>` | - |
| observeResize | 监听元素尺寸变化 | `(element: Element, callback: (entry: ResizeObserverEntry) => void) => () => void` | - |
| importCDN | 动态加载 CDN 脚本 | `(url: string, name: keyof Window) => void` | - |
