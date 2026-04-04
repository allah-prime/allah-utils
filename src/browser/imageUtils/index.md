---
title: Image
description: 浏览器图片处理工具集，支持 DOM 截图、图片下载、ZIP 打包、压缩与格式转换
group:
  title: 浏览器相关
---

## Image

### 业务场景与意图

提供浏览器环境下的图片处理能力，涵盖将 DOM 元素截图为 PNG、批量打包下载、图片压缩、Base64 与 Blob 互转等常见场景，适用于报表导出、数据可视化截图、图片批量管理等前端业务。

### 代码演示

```typescript
import imageUtils from './index';

// 截图并下载
const el = document.getElementById('chart');
if (el) {
  await imageUtils.downloadDomAsPng(el, 'chart.png');
}

// 多个 DOM 截图打包下载
await imageUtils.downloadDomsAsZip([
  { element: document.getElementById('page1')!, filename: 'page1.png' },
  { element: document.getElementById('page2')!, filename: 'page2.png' },
], 'export.zip');

// 压缩图片
const input = document.querySelector<HTMLInputElement>('input[type=file]');
if (input?.files?.[0]) {
  const compressed = await imageUtils.compressImage(input.files[0], 0.7);
  imageUtils.downloadImage(URL.createObjectURL(compressed), 'compressed.jpg');
}
```

### API 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| isBrowser | 判断是否浏览器环境 | `() => boolean` | - |
| domToDataUrl | 将 DOM 元素渲染为 PNG DataURL | `(element: HTMLElement, scale?: number) => Promise<string>` | `scale: 3` |
| downloadDomAsPng | 将 DOM 元素截图并下载为 PNG | `(element: HTMLElement, filename?: string, scale?: number) => Promise<void>` | `filename: 'screenshot.png', scale: 3` |
| downloadImage | 下载网络图片到本地 | `(url: string, filename?: string) => void` | - |
| downloadImagesAsZip | 将多张网络图片打包为 ZIP 下载 | `(images: { url: string; filename: string }[], zipName?: string) => Promise<void>` | `zipName: 'images.zip'` |
| downloadDomsAsZip | 将多个 DOM 元素截图打包为 ZIP 下载 | `(items: { element: HTMLElement; filename: string }[], zipName?: string, scale?: number) => Promise<void>` | `zipName: 'screenshots.zip', scale: 3` |
| urlToBase64 | 图片 URL 转 Base64 DataURL | `(url: string) => Promise<string>` | - |
| base64ToBlob | Base64 转 Blob 对象 | `(base64: string, mimeType?: string) => Blob` | `mimeType: 'image/png'` |
| compressImage | 压缩图片文件 | `(file: File, quality?: number, maxWidth?: number, maxHeight?: number) => Promise<Blob>` | `quality: 0.8, maxWidth: 1920, maxHeight: 1080` |
| getImageSize | 获取图片原始宽高 | `(src: string) => Promise<{ width: number; height: number }>` | - |
