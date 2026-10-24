/**
 * URL工具函数
 */

/**
 * 获取url的参数
 * @param url - URL字符串，默认为当前页面URL
 * @returns 参数对象
 */
export function getUrlParams<T = any>(url?: string): T {
  if (!url && typeof window !== 'undefined') {
    url = window.location.href;
  }
  const theRequest: any = {};
  if (!url) {
    console.error('无效的url');
    return theRequest;
  }
  const queryIndex = url.indexOf('?');
  if (queryIndex !== -1) {
    const str = url.slice(queryIndex + 1);
    const pairs = str.split('&');
    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      if (key) {
        theRequest[decodeURIComponent(key)] = decodeURIComponent(value || '');
      }
    }
  }
  return theRequest;
}

/**
 * 从url中获取指定位置的路径字符串
 * @param url - 需要获取的url
 * @param index - 如果是-1则是最后一个，如果是0则是第一个
 * @returns 路径字符串
 */
export const getLocalPath = (url: string, index: number = -1): string => {
  // url要去掉开头的//和后面的参数。然后用剩下的。如果它有的话
  if (url.startsWith('http')) {
    // 说明是完整的url。现在只需要pathname
    url = new URL(url).pathname;
  }
  // 去掉开头的/
  url = url.replace(/^\//, '');
  // 拆成数组
  const urlArr = url.split('/');
  // 如果是-1则返回最后一个
  if (index === -1) {
    return urlArr[urlArr.length - 1];
  }
  return urlArr[index];
};

/**
 * 从当前页面URL中获取指定位置的路径字符串
 * @param index - 如果是-1则是最后一个，如果是0则是第一个，默认是最后一个
 * @returns 路径字符串
 */
export const getWebLocalPath = (index: number = -1): string => {
  if (!window) {
    return '';
  }
  return getLocalPath(window.location.pathname, index);
};

/**
 * 刷新url的状态
 * @param data - 需要更新的参数对象
 */
export function refreshUrlState(data: Record<string, string>) {
  if (!window) {
    return;
  }
  const searchStr = window.location.href;
  // 问号前面的
  const url = searchStr.substring(0, searchStr.indexOf('?'));
  const newUrl = setUrlParams({ pathname: url, query: data });
  window.history.replaceState(null, '', newUrl);
}

type TSetUrlParams = { pathname: string; query: Record<string, any> };

/**
 * 设置URL参数
 * @param params - 包含路径和查询参数的对象
 * @returns 完整的URL字符串
 */
export function setUrlParams(params: TSetUrlParams): string {
  const { query } = params;
  let { pathname } = params;
  if (typeof query === 'object') {
    // 开始拼接
    Object.keys(query).forEach((key, index) => {
      // 判断数据是否存在
      if (query[key] !== undefined && query[key] !== null && query[key] !== '') {
        if (index === 0) {
          pathname = `${pathname}?${key}=${query[key]}`;
        } else {
          pathname = `${pathname}&${key}=${query[key]}`;
        }
      }
    });
  }
  return pathname;
}

/**
 * 构建查询参数字符串
 * 该函数接收一个对象，将对象中的键值对转换为URL编码格式的查询参数字符串。
 * 对于对象中的数组值，采用`repeat`模式，即数组中的每个元素都会单独形成一个键值对。
 * @param params - 包含查询参数的对象，键为字符串类型，值可以是基本类型（如string、number、boolean等）或数组类型
 * @returns 拼接好的URL查询参数字符串
 */
export function buildQueryParams(params: any) {
  const paramPairs = [];
  for (const key in params) {
    const value = params[key];
    if (Array.isArray(value)) {
      value.forEach(v => {
        paramPairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
      });
    } else {
      paramPairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  }
  return paramPairs.join('&');
}

/**
 * 获取页面URL中的查询参数
 * 该函数通过解析当前页面URL中 `?` 符号后的部分，提取出所有的查询参数，并以对象形式返回。
 * 如果URL中不存在查询参数部分，则返回一个空对象。
 * @param queryString - 查询字符串
 * @returns 解析后的查询参数对象，键为参数名，值为对应的参数值，重复的参数名将被合并到一个数组中
 */
export function getPageQueryParams(queryString: string) {
  // 如果没有查询字符串，说明没有查询参数，直接返回一个空对象
  if (!queryString) {
    return {};
  }

  const queryParams = {} as any;
  // 将查询字符串按 '&' 分割成多个键值对
  const pairs = queryString.split('&');
  pairs.forEach(pair => {
    // 对每一个键值对按 '=' 分开，分别得到键和值
    const [key, value] = pair.split('=');
    // 对键和值进行URL解码
    const decodedKey = decodeURIComponent(key);
    const decodedValue = decodeURIComponent(value);

    // 处理重复参数：如果某个键已经存在于 queryParams 中
    if (queryParams[decodedKey]) {
      // 检查它是不是数组
      if (Array.isArray(queryParams[decodedKey])) {
        // 如果是数组，直接把新值 push 进去
        queryParams[decodedKey].push(decodedValue);
      } else {
        // 如果不是数组，把它变成数组，再把新值 push 进去
        queryParams[decodedKey] = [queryParams[decodedKey], decodedValue];
      }
    } else {
      // 如果是新键，直接赋值
      queryParams[decodedKey] = decodedValue;
    }
  });

  return queryParams;
}

/**
 * 更新URL中的参数 -> 得到新的url
 * @param href - 原始URL
 * @param params - 需要更新的参数
 * @returns 新的URL
 */
export function getUpdateUrl(href: string, params: Record<string, string>): string {
  if (!window) {
    return '';
  }
  const searchStr = href || window.location.href;
  const oldParams = getUrlParams(searchStr);
  const newParams = { ...oldParams, ...params };
  // 问号前面的
  const url = searchStr.substring(0, searchStr.indexOf('?'));
  return setUrlParams({ pathname: url, query: newParams });
}

/**
 * 将对象转换为URL参数字符串
 * @param param - 将要转为URL参数字符串的对象
 * @param prefix - URL参数字符串的前缀
 * @param encode - 是否进行URL编码，默认为true
 * @returns URL参数字符串
 */
export function urlEncode(param: any, prefix?: string, encode: boolean = true) {
  if (param === null) return '';
  let paramStr = '';
  const t: string = typeof param;
  if (t === 'string' || t === 'number' || t === 'boolean') {
    paramStr += `&${prefix}=${encode ? encodeURIComponent(param) : param}`;
  } else {
    Object.keys(param).forEach(key => {
      key = prefix === null ? key : prefix + (param instanceof Array ? `[${key}]` : `.${key}`);
      paramStr += urlEncode(param[key], key, encode);
    });
  }
  return paramStr;
}

/**
 * URL转换为路径列表
 * @param url - URL字符串
 * @returns 路径数组
 */
export const urlToList = (url?: string): string[] => {
  if (!url || url === '/') {
    return ['/'];
  }
  // 去掉协议、域名、查询串和 hash，只保留 pathname
  let pathname = url;
  try {
    // 如果是完整 URL，用 URL 对象解析
    if (url.startsWith('http://') || url.startsWith('https://')) {
      pathname = new URL(url).pathname;
    }
  } catch {
    // 如果解析失败，继续用原字符串
  }
  // 去掉开头的 /
  pathname = pathname.replace(/^\/+/, '');
  // 拆成数组并过滤空串
  const urlList = pathname.split('/').filter(Boolean);
  // 逐级拼接返回
  return urlList.map((_, index) => `/${urlList.slice(0, index + 1).join('/')}`);
};

/**
 * URL工具对象
 */
const urlUtils = {
  getUrlParams,
  getLocalPath,
  getWebLocalPath,
  refreshUrlState,
  setUrlParams,
  buildQueryParams,
  getPageQueryParams,
  getUpdateUrl,
  urlEncode,
  urlToList
};

export default urlUtils;