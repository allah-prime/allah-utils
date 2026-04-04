import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { domToPng } from 'modern-screenshot';

// 高清截图放大比例
const SCREENSHOT_SCALE = 3;

/**
 * 创建带字体缓存的 fetchFn，避免截图时重复加载字体/图片资源
 */
const createFontCachingFetch = () => {
  const cache = new Map<string, Promise<string | false>>();

  return (url: string): Promise<string | false> => {
    if (!cache.has(url)) {
      cache.set(
        url,
        globalThis
          .fetch(url)
          .then(r => r.blob())
          .then(
            blob =>
              new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              })
          )
          .catch((): false => false)
      );
    }
    return cache.get(url)!;
  };
};

/**
 * 图片工具函数（仅在浏览器环境中可用）
 */
const imageUtils = {
  /**
   * 检查是否在浏览器环境
   * @returns 是否在浏览器环境
   */
  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  },

  /**
   * 将 DOM 元素渲染为 PNG DataURL
   * @param element 目标 DOM 元素
   * @param scale 放大倍数，默认为 3（高清）
   * @returns PNG 格式的 DataURL
   */
  async domToDataUrl(element: HTMLElement, scale = SCREENSHOT_SCALE): Promise<string> {
    if (!this.isBrowser()) return '';
    const fetchFn = createFontCachingFetch();
    return domToPng(element, { scale, fetchFn });
  },

  /**
   * 将 DOM 元素截图并下载为 PNG 文件
   * @param element 目标 DOM 元素
   * @param filename 文件名，默认为 'screenshot.png'
   * @param scale 放大倍数，默认为 3（高清）
   */
  async downloadDomAsPng(
    element: HTMLElement,
    filename = 'screenshot.png',
    scale = SCREENSHOT_SCALE
  ): Promise<void> {
    if (!this.isBrowser()) return;
    const dataUrl = await this.domToDataUrl(element, scale);
    const response = await globalThis.fetch(dataUrl);
    const blob = await response.blob();
    saveAs(blob, filename);
  },

  /**
   * 下载网络图片到本地
   * @param url 图片地址
   * @param filename 保存的文件名
   */
  downloadImage(url: string, filename?: string): void {
    if (!this.isBrowser()) return;
    saveAs(url, filename);
  },

  /**
   * 将多张网络图片打包为 ZIP 并下载
   * @param images 图片列表，每项包含 url 和 filename
   * @param zipName ZIP 文件名，默认为 'images.zip'
   */
  async downloadImagesAsZip(
    images: { url: string; filename: string }[],
    zipName = 'images.zip'
  ): Promise<void> {
    if (!this.isBrowser()) return;
    const zip = new JSZip();
    await Promise.all(
      images.map(async ({ url, filename }) => {
        const response = await globalThis.fetch(url);
        const blob = await response.blob();
        zip.file(filename, blob);
      })
    );
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, zipName);
  },

  /**
   * 将多个 DOM 元素截图并打包为 ZIP 下载
   * @param items 截图列表，每项包含 element 和 filename
   * @param zipName ZIP 文件名，默认为 'screenshots.zip'
   * @param scale 放大倍数，默认为 3（高清）
   */
  async downloadDomsAsZip(
    items: { element: HTMLElement; filename: string }[],
    zipName = 'screenshots.zip',
    scale = SCREENSHOT_SCALE
  ): Promise<void> {
    if (!this.isBrowser()) return;
    const zip = new JSZip();
    const fetchFn = createFontCachingFetch();
    await Promise.all(
      items.map(async ({ element, filename }) => {
        const dataUrl = await domToPng(element, { scale, fetchFn });
        const response = await globalThis.fetch(dataUrl);
        const blob = await response.blob();
        zip.file(filename, blob);
      })
    );
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    saveAs(zipBlob, zipName);
  },

  /**
   * 将图片 URL 转换为 Base64 DataURL
   * @param url 图片地址
   * @returns Base64 DataURL
   */
  async urlToBase64(url: string): Promise<string> {
    if (!this.isBrowser()) return '';
    const response = await globalThis.fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  },

  /**
   * 将 Base64 字符串转换为 Blob 对象
   * @param base64 Base64 字符串（可带 DataURL 前缀）
   * @param mimeType MIME 类型，默认为 'image/png'
   * @returns Blob 对象
   */
  base64ToBlob(base64: string, mimeType = 'image/png'): Blob {
    const data = base64.includes(',') ? base64.split(',')[1] : base64;
    const byteString = atob(data);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeType });
  },

  /**
   * 压缩图片文件
   * @param file 图片文件
   * @param quality 压缩质量（0-1），默认为 0.8
   * @param maxWidth 最大宽度，默认为 1920
   * @param maxHeight 最大高度，默认为 1080
   * @returns 压缩后的 Blob 对象
   */
  compressImage(
    file: File,
    quality = 0.8,
    maxWidth = 1920,
    maxHeight = 1080
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.isBrowser()) {
        reject(new Error('compressImage is only available in browser environment'));
        return;
      }
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context is not available'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          blob => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to compress image'));
          },
          file.type || 'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = url;
    });
  },

  /**
   * 获取图片的原始宽高
   * @param src 图片地址或 DataURL
   * @returns 包含 width 和 height 的对象
   */
  getImageSize(src: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      if (!this.isBrowser()) {
        reject(new Error('getImageSize is only available in browser environment'));
        return;
      }
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = src;
    });
  }
};

export default imageUtils;
