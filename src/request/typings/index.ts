import ReqQueue from '../ReqQueue';

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
    reqQueue: ReqQueue;
    wx: any;
  }
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
