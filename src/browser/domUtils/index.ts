/**
 * DOM工具函数（仅在浏览器环境中可用）
 */
const domUtils = {
  /**
   * 检查是否在浏览器环境
   * @returns 是否在浏览器环境
   */
  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  },

  /**
   * 查询元素
   * @param selector 选择器
   * @param parent 父元素，默认为document
   * @returns 元素或null
   */
  $(selector: string, parent: Document | Element = document): Element | null {
    if (!this.isBrowser()) return null;
    return parent.querySelector(selector);
  },

  /**
   * 查询所有元素
   * @param selector 选择器
   * @param parent 父元素，默认为document
   * @returns 元素数组
   */
  $$(selector: string, parent: Document | Element = document): Element[] {
    if (!this.isBrowser()) return [];
    return Array.from(parent.querySelectorAll(selector));
  },

  /**
   * 添加CSS类
   * @param element 元素
   * @param className 类名
   */
  addClass(element: Element, className: string): void {
    if (!this.isBrowser()) return;
    element.classList.add(className);
  },

  /**
   * 移除CSS类
   * @param element 元素
   * @param className 类名
   */
  removeClass(element: Element, className: string): void {
    if (!this.isBrowser()) return;
    element.classList.remove(className);
  },

  /**
   * 切换CSS类
   * @param element 元素
   * @param className 类名
   * @returns 是否添加了类
   */
  toggleClass(element: Element, className: string): boolean {
    if (!this.isBrowser()) return false;
    return element.classList.toggle(className);
  },

  /**
   * 检查是否包含CSS类
   * @param element 元素
   * @param className 类名
   * @returns 是否包含类
   */
  hasClass(element: Element, className: string): boolean {
    if (!this.isBrowser()) return false;
    return element.classList.contains(className);
  },

  /**
   * 设置元素样式
   * @param element 元素
   * @param styles 样式对象
   */
  setStyle(element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
    if (!this.isBrowser()) return;
    Object.assign(element.style, styles);
  },

  /**
   * 获取元素样式
   * @param element 元素
   * @param property 样式属性
   * @returns 样式值
   */
  getStyle(element: Element, property: string): string {
    if (!this.isBrowser()) return '';
    return window.getComputedStyle(element).getPropertyValue(property);
  },

  /**
   * 创建元素
   * @param tagName 标签名
   * @param attributes 属性对象
   * @param children 子元素或文本
   * @returns 创建的元素
   */
  createElement(
    tagName: string,
    attributes: Record<string, string> = {},
    children: (Element | string)[] = []
  ): HTMLElement | null {
    if (!this.isBrowser()) return null;

    const element = document.createElement(tagName);

    // 设置属性
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });

    // 添加子元素
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });

    return element;
  },

  /**
   * 获取元素位置信息
   * @param element 元素
   * @returns 位置信息
   */
  getElementPosition(element: Element): {
    top: number;
    left: number;
    width: number;
    height: number;
  } {
    if (!this.isBrowser()) return { top: 0, left: 0, width: 0, height: 0 };

    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height
    };
  },

  /**
   * 检查元素是否在视口中
   * @param element 元素
   * @param threshold 阈值（0-1），默认为0
   * @returns 是否在视口中
   */
  isInViewport(element: Element, threshold = 0): boolean {
    if (!this.isBrowser()) return false;

    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    const verticalThreshold = windowHeight * threshold;
    const horizontalThreshold = windowWidth * threshold;

    return (
      rect.top >= -verticalThreshold &&
      rect.left >= -horizontalThreshold &&
      rect.bottom <= windowHeight + verticalThreshold &&
      rect.right <= windowWidth + horizontalThreshold
    );
  },

  /**
   * 平滑滚动到元素
   * @param element 目标元素
   * @param options 滚动选项
   */
  scrollToElement(
    element: Element,
    options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'start' }
  ): void {
    if (!this.isBrowser()) return;
    element.scrollIntoView(options);
  },

  /**
   * 复制文本到剪贴板
   * @param text 要复制的文本
   * @returns 是否复制成功
   */
  async copyToClipboard(text: string): Promise<boolean> {
    if (!this.isBrowser()) return false;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    } catch {
      return false;
    }
  },

  /**
   * 监听元素大小变化
   * @param element 元素
   * @param callback 回调函数
   * @returns 取消监听的函数
   */
  observeResize(
    element: Element,
    callback: (entry: ResizeObserverEntry) => void
  ): () => void {
    if (!this.isBrowser() || !window.ResizeObserver) {
      return () => { };
    }

    const observer = new ResizeObserver(entries => {
      entries.forEach(callback);
    });

    observer.observe(element);

    return () => observer.disconnect();
  },

  /**
   * 导入cdn的方法
   * @param url 需要导入的文件
   * @param name 名称
   */
  importCDN(url: string, name: keyof Window): void {
    new Promise<number>(resolve => {
      const dom = document.createElement('script');
      dom.src = url;
      dom.type = 'text/javascript';
      dom.onload = () => {
        resolve(window[name]);
      };
      if (document.head !== null) {
        document.head.appendChild(dom);
      }
    });
  }
};

export default domUtils;