import ReqQueue from './request/ReqQueue';

/**
 * 接口的配置
 */
export interface IRequestOption {
  /**
   * 请求环境，rn使用fetch，uni使用uniRequest，browser使用axios
   */
  reqEnv?: 'browser' | 'rn' | 'uni' | 'fetch';
  /**
   * 请求类型 sse | xhr
   */
  reqType?: 'sse' | 'xhr';
  signal?: any;
  /**
   * 遇到错误是否继续，不抛出异常
   */
  errorContinue?: boolean;
  /**
   * 请求地址
   */
  url?: string;
  /**
   * post request data type
   */
  requestType?: 'form' | 'json';
  /**
   * 请求的类型
   */
  method?:
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'options'
  | 'head'
  | 'trace'
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'OPTIONS'
  | 'HEAD'
  | 'TRACE';

  /**
   * 是否过滤空参数
   */
  isFilter?: boolean;
  /**
   * 不进行过滤的字段
   */
  noFilterField?: string[];
  /**
   * 是否删除不必要的字段
   * <br />
   * 可以传递一个数组进来，然后在处理参数的时候，删除数组中的字段
   */
  deleteField?: string[];
  /**
   * 是否删除时间字段
   * <br />
   * 如果是true，则删除所有的时间字段'createTime', 'updateTime', 'createDate', 'updateDate'
   */
  deleteTimeField?: boolean;
  /**
   * 数据格式
   */
  manner?: 'form' | 'json' | 'file';
  /**
   * 请求头
   */
  headers?: {
    'Content-Type'?: string;
    Authorization?: string | undefined | null;
    [key: string]: string | null | undefined;
  };
  /**
   * 是否设置token
   */
  setToken?: boolean;
  /**
   * 是否是文件
   */
  isFile?: boolean;
  /**
   * 响应数据类型
   */
  responseType?: string;
  /**
   * 请求参数
   */
  params?: any;
  data?: any;
  // 给fetch用的
  body?: any;
  /**
   * 返回数据格式
   */
  dataType?: string;
  /**
   * 跨域配置
   */
  mode?: 'no-cors' | 'cors';
  /**
   * 是否是外部接口
   */
  isExternal?: boolean;
  /**
   * 是否显示日志信息
   */
  showLog?: boolean;
  /**
   * 是否自动处理异常
   */
  autoCatch?: boolean;

  /**
   * 是否缓存数据
   */
  cacheData?: boolean;

  /**
   * 缓存的key
   */
  cacheKey?: string;

  /**
   * 缓存多久
   */
  cacheControl?: number;
  toHtml?: boolean;
  validateStatus?: (status: number) => void | boolean;
  // 请求超时限制
  timeout?: number;
  /**
   * 当前请求的唯一标识
   */
  reqUuid?: string;
  /**
   * 存储日志
   */
  cacheLog?: boolean;
  /**
   * 最大存储数量
   */
  maxCacheLog?: number;
  /**
   * 存储的方法，可以把日志存到本地来
   */
  cacheMethod?: (data: Record<string, any>) => void;

  /**
   * 是否携带cookie
   * 默认为true，设置为false时不携带cookie
   */
  withCredentials?: boolean;

  /**
   * 自定义cookie设置
   * 可以设置特定的cookie值
   */
  cookies?: Record<string, string>;

  /**
   * Cookie传递方式
   * 'credentials' - 通过withCredentials传递（需要服务器支持CORS）
   * 'header' - 通过请求头传递（推荐，避免CORS限制）
   * 'both' - 两种方式都使用
   * 默认为'header'
   */
  cookieMode?: 'credentials' | 'header' | 'both';

  /**
   * 自定义cookie请求头名称
   * 当cookieMode为'header'或'both'时使用
   * 默认为'X-Custom-Cookie'
   */
  cookieHeaderName?: string;

  /**
   * 是否自动从cookie中获取CSRF token
   */
  autoCSRF?: boolean;

  /**
   * CSRF token的cookie名称
   * 默认为'csrftoken'
   */
  csrfCookieName?: string;

  /**
   * CSRF token的header名称
   * 默认为'X-CSRFToken'
   */
  csrfHeaderName?: string;

  /**
   * 返回值处理
   */
  resProcess?: (res: any) => any;

  /**
   * 返回值 空 值替换 - 默认是 -
   */
  resNullReplace?: string;
  /**
   * 替换指定的字段为 -
   */
  resReplaceField?: string[];
}

export declare type ICallBack = (data: any) => void;

export declare const DEV_LOG: 'show' | undefined;

declare global {
  interface Window {
    WebKitMutationObserver?: any;
    ReqQueue: ReqQueue;
    wx: any;
  }

  /**
   * UniApp 全局对象类型定义
   */
  const uni: {
    /**
     * 发起网络请求
     * @param options 请求配置
     */
    request: (options: {
      /** 请求的绝对路径 */
      url: string;
      /** 请求的参数 */
      data?: any;
      /** 请求的 header，header 中不能设置 Referer */
      header?: Record<string, string>;
      /** 请求方法 */
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'HEAD' | 'OPTIONS' | 'TRACE';
      /** 响应的数据类型 */
      dataType?: string;
      /** 响应的数据类型 */
      responseType?: 'text' | 'arraybuffer';
      /** 超时时间，单位 ms */
      timeout?: number;
      /** 接口调用成功的回调函数 */
      success?: (result: {
        /** 开发者服务器返回的数据 */
        data: any;
        /** 开发者服务器返回的 HTTP 状态码 */
        statusCode: number;
        /** 开发者服务器返回的 HTTP Response Header */
        header: Record<string, string>;
        /** 网络请求过程中一些调试信息 */
        cookies?: string[];
      }) => void;
      /** 接口调用失败的回调函数 */
      fail?: (error: {
        /** 错误信息 */
        errMsg: string;
      }) => void;
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: (result: any) => void;
    }) => void;

    /**
     * 显示消息提示框
     * @param options 提示配置
     */
    showToast: (options: {
      /** 提示的内容 */
      title: string;
      /** 图标 */
      icon?: 'success' | 'loading' | 'none' | string;
      /** 自定义图标的本地路径 */
      image?: string;
      /** 提示的延迟时间 */
      duration?: number;
      /** 是否显示透明蒙层，防止触摸穿透 */
      mask?: boolean;
      /** 接口调用成功的回调函数 */
      success?: () => void;
      /** 接口调用失败的回调函数 */
      fail?: () => void;
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: () => void;
    }) => void;

    /**
     * 隐藏消息提示框
     */
    hideToast: () => void;

    /**
     * 显示 loading 提示框
     * @param options loading配置
     */
    showLoading: (options: {
      /** 提示的内容 */
      title: string;
      /** 是否显示透明蒙层，防止触摸穿透 */
      mask?: boolean;
      /** 接口调用成功的回调函数 */
      success?: () => void;
      /** 接口调用失败的回调函数 */
      fail?: () => void;
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: () => void;
    }) => void;

    /**
     * 隐藏 loading 提示框
     */
    hideLoading: () => void;

    /**
     * 显示模态对话框
     * @param options 对话框配置
     */
    showModal: (options: {
      /** 提示的标题 */
      title?: string;
      /** 提示的内容 */
      content?: string;
      /** 是否显示取消按钮 */
      showCancel?: boolean;
      /** 取消按钮的文字，最多 4 个字符 */
      cancelText?: string;
      /** 取消按钮的文字颜色，必须是 16 进制格式的颜色字符串 */
      cancelColor?: string;
      /** 确认按钮的文字，最多 4 个字符 */
      confirmText?: string;
      /** 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串 */
      confirmColor?: string;
      /** 是否显示输入框 */
      editable?: boolean;
      /** 输入框的 placeholder */
      placeholderText?: string;
      /** 接口调用成功的回调函数 */
      success?: (result: {
        /** 为 true 时，表示用户点击了确定按钮 */
        confirm: boolean;
        /** 为 true 时，表示用户点击了取消 */
        cancel: boolean;
        /** 如果 editable 为 true，用户输入的内容 */
        content?: string;
      }) => void;
      /** 接口调用失败的回调函数 */
      fail?: () => void;
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: () => void;
    }) => void;
    /**
     * 从底部向上弹出操作菜单
     */
    showActionSheet: (options: {
      /** 提示的标题 */
      title?: string;
      /**
       * 警示文案（同菜单标题）微信小程序（仅真机有效）、抖音小程序、小红书小程序
       */
      alertText?: string;
      /** 操作菜单的配置项 */
      itemList: string[];
      /**
       * 按钮的文字颜色，字符串格式，默认为"#000000"
       */
      itemColor?: string;
      /** 接口调用成功的回调函数 */
      success?: (result: {
        /** 用户点击的操作菜单的索引 */
        tapIndex: number;
      }) => void;
      /** 接口调用失败的回调函数 */
      fail?: () => void;
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: () => void;
      /**
       * 大屏设备弹出原生选择按钮框的指示区域，默认居中显示
       */
      popover?: {
        /** 指示区域坐标，使用原生 navigationBar 时一般需要加上 navigationBar 的高度 */
        top?: number;
        /** 指示区域坐标 */
        left?: number;
        /** 指示区域宽度 */
        width?: number;
        /** 指示区域高度 */
        height?: number;
      };
    }) => void;
    /**
     * 将数据存储在本地缓存中指定的 key 中
     * @param options 存储配置
     */
    setStorage: (options: {
      /** 本地缓存中指定的 key */
      key: string;
      /** 需要存储的内容 */
      data: any;
      /** 接口调用成功的回调函数 */
      success?: () => void;
      /** 接口调用失败的回调函数 */
      fail?: () => void;
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: () => void;
    }) => void;

    /**
     * 将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口
     * @param key 本地缓存中指定的 key
     * @param data 需要存储的内容
     */
    setStorageSync: (key: string, data: any) => void;

    /**
     * 从本地缓存中异步获取指定 key 的内容
     * @param options 获取配置
     */
    getStorage: (options: {
      /** 本地缓存中指定的 key */
      key: string;
      /** 接口调用成功的回调函数 */
      success?: (result: { data: any }) => void;
      /** 接口调用失败的回调函数 */
      fail?: () => void;
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: () => void;
    }) => void;

    /**
     * 从本地缓存中同步获取指定 key 的内容
     * @param key 本地缓存中指定的 key
     * @returns 缓存的内容
     */
    getStorageSync: (key: string) => any;

    /**
     * 从本地缓存中移除指定 key
     * @param options 移除配置
     */
    removeStorage: (options: {
      /** 本地缓存中指定的 key */
      key: string;
      /** 接口调用成功的回调函数 */
      success?: () => void;
      /** 接口调用失败的回调函数 */
      fail?: () => void;
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: () => void;
    }) => void;

    /**
     * 从本地缓存中同步移除指定 key
     * @param key 本地缓存中指定的 key
     */
    removeStorageSync: (key: string) => void;

    /**
     * 清理本地数据缓存
     * @param options 清理配置
     */
    clearStorage: (options?: {
      /** 接口调用成功的回调函数 */
      success?: () => void;
      /** 接口调用失败的回调函数 */
      fail?: () => void;
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: () => void;
    }) => void;

    /**
     * 同步清理本地数据缓存
     */
    clearStorageSync: () => void;

    /**
     * 获取当前的地理位置、速度
     * @param options 位置配置
     */
    getLocation: (options: {
      /** 默认为 wgs84 的 gps 坐标，如果要返回直接给 openLocation 用的火星坐标，可传入 'gcj02' */
      type?: 'wgs84' | 'gcj02';
      /** 传入 true 会返回高度信息，由于获取高度需要较高精确度，会减慢接口返回速度 */
      altitude?: boolean;
      /** 接口调用成功的回调函数 */
      success?: (result: {
        /** 纬度，范围为 -90~90，负数表示南纬 */
        latitude: number;
        /** 经度，范围为 -180~180，负数表示西经 */
        longitude: number;
        /** 速度，单位 m/s */
        speed: number;
        /** 位置的精确度 */
        accuracy: number;
        /** 高度，单位 m */
        altitude?: number;
        /** 垂直精度，单位 m（Android 无法获取，返回 0） */
        verticalAccuracy?: number;
        /** 水平精度，单位 m */
        horizontalAccuracy?: number;
      }) => void;
      /** 接口调用失败的回调函数 */
      fail?: () => void;
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: () => void;
    }) => void;

    /**
     * 保存图片到系统相册
     * @param options 保存配置
     */
    saveImageToPhotosAlbum: (options: {
      /** 图片文件路径，可以是临时文件路径或永久文件路径，不支持网络图片路径 */
      filePath: string;
      /** 接口调用成功的回调函数 */
      success?: () => void;
      /** 接口调用失败的回调函数 */
      fail?: () => void;
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: () => void;
    }) => void;

    /**
     * 获取系统信息
     * @param options 获取配置
     */
    getSystemInfo: (options: {
      /** 接口调用成功的回调函数 */
      success?: (result: {
        /** 设备品牌 */
        brand: string;
        /** 设备型号 */
        model: string;
        /** 设备像素比 */
        pixelRatio: number;
        /** 屏幕宽度，单位px */
        screenWidth: number;
        /** 屏幕高度，单位px */
        screenHeight: number;
        /** 可使用窗口宽度，单位px */
        windowWidth: number;
        /** 可使用窗口高度，单位px */
        windowHeight: number;
        /** 状态栏的高度，单位px */
        statusBarHeight: number;
        /** 微信设置的语言 */
        language: string;
        /** 微信版本号 */
        version: string;
        /** 操作系统及版本 */
        system: string;
        /** 客户端平台 */
        platform: string;
        /** 用户字体大小（单位px）。以微信客户端「我-设置-通用-字体大小」中的设置为准 */
        fontSizeSetting: number;
        /** 客户端基础库版本 */
        SDKVersion: string;
      }) => void;
      /** 接口调用失败的回调函数 */
      fail?: () => void;
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: () => void;
    }) => void;

    /**
     * 获取系统信息同步接口
     * @returns 系统信息
     */
    getSystemInfoSync: () => {
      /** 设备品牌 */
      brand: string;
      /** 设备型号 */
      model: string;
      /** 设备像素比 */
      pixelRatio: number;
      /** 屏幕宽度，单位px */
      screenWidth: number;
      /** 屏幕高度，单位px */
      screenHeight: number;
      /** 可使用窗口宽度，单位px */
      windowWidth: number;
      /** 可使用窗口高度，单位px */
      windowHeight: number;
      /** 状态栏的高度，单位px */
      statusBarHeight: number;
      /** 微信设置的语言 */
      language: string;
      /** 微信版本号 */
      version: string;
      /** 操作系统及版本 */
      system: string;
      /** 客户端平台 */
      platform: string;
      /** 用户字体大小（单位px）。以微信客户端「我-设置-通用-字体大小」中的设置为准 */
      fontSizeSetting: number;
      /** 客户端基础库版本 */
      SDKVersion: string;
    };

    /**
     * 关闭当前页面，跳转到应用内的某个页面
     * @param options 跳转配置
     */
    redirectTo: (options: {
      /** 需要跳转的应用内非 tabBar 的页面的路径，路径后可以带参数 */
      url: string;
      /** 接口调用成功的回调函数 */
      success?: () => void;
      /** 接口调用失败的回调函数 */
      fail?: () => void;
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: () => void;
    }) => void;

    /**
     * 保留当前页面，跳转到应用内的某个页面
     * @param options 跳转配置
     */
    navigateTo: (options: {
      /** 需要跳转的应用内非 tabBar 的页面的路径，路径后可以带参数 */
      url: string;
      /** 接口调用成功的回调函数 */
      success?: () => void;
      /** 接口调用失败的回调函数 */
      fail?: () => void;
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: () => void;
    }) => void;

    /**
     * 关闭当前页面，返回上一页面或多级页面
     * @param options 返回配置
     */
    navigateBack: (options?: {
      /** 返回的页面数，如果 delta 大于现有页面数，则返回到首页 */
      delta?: number;
      /** 接口调用成功的回调函数 */
      success?: () => void;
      /** 接口调用失败的回调函数 */
      fail?: () => void;
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: () => void;
    }) => void;

    /**
     * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
     * @param options 跳转配置
     */
    switchTab: (options: {
      /** 需要跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面），路径后不能带参数 */
      url: string;
      /** 接口调用成功的回调函数 */
      success?: () => void;
      /** 接口调用失败的回调函数 */
      fail?: () => void;
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: () => void;
    }) => void;

    /**
     * 关闭所有页面，打开到应用内的某个页面
     * @param options 跳转配置
     */
    reLaunch: (options: {
      /** 需要跳转的应用内页面路径，路径后可以带参数 */
      url: string;
      /** 接口调用成功的回调函数 */
      success?: () => void;
      /** 接口调用失败的回调函数 */
      fail?: () => void;
      /** 接口调用结束的回调函数（调用成功、失败都会执行） */
      complete?: () => void;
    }) => void;
  };
}

/**
 * 缓存数据
 */
export interface ICacheData {
  /**
   * 到期时间
   */
  expires: number;

  /**
   * 缓存的数据
   */
  data: any;
}
