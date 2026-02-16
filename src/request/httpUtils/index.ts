import { ICacheData, ICallBack, IRequestOption } from './../typings';
import { codeMessage, defOption } from './../httpCode';
import ReqQueue from './../ReqQueue';
import cookieUtils from '../../browser/cookieUtils';
import uniRequest from './../uniRequest';
import axios from 'axios';
import { buildQueryParams } from '../../browser/urlUtils';
import stringUtils from '../../core/stringUtils';

const isExit = (str?: string | number) => {
  if (str === '') {
    return false;
  }
  if (str === 0) {
    return true;
  }
  return str;
};

/**
 * 参数去空
 * @param params 参数
 * @param deleteField 需要删除的字段
 * @param deleteTimeField 是否删除时间字段
 */
const buildParamsNull = (
  params: any,
  deleteField: string[] | undefined,
  deleteTimeField: boolean | undefined
) => {
  const defKeys: string[] = [];
  if (deleteTimeField) {
    defKeys.push('createTime', 'creTime', 'updateTime', 'createDate', 'updateDate');
  }
  if (Array.isArray(deleteField)) {
    defKeys.push(...deleteField);
  }
  const newParams: Record<string, any> = {};
  if (params) {
    Object.keys(params).forEach(key => {
      // 如果字段在defKeys里面，那就直接跳过，不赋值了
      if (defKeys.length > 0 && defKeys.includes(key)) {
        return;
      }
      if (isExit(params[key])) {
        newParams[key] = params[key];
      }
    });
  }
  return newParams;
};

/**
 * 请求拦截
 * @param url 请求地址
 * @param options 请求配置
 * @return {{options: *, url: *}}
 */
export const requestErrorIntercept = (url: string, options: IRequestOption) => {
  // 覆盖默认值
  const newOptions: IRequestOption = { ...defOption, ...options };
  const { isFile } = newOptions;
  // 如果是文件，那就是说明要下载文件
  if (isFile) {
    // 设置响应类型
    newOptions.responseType = 'blob';
  }
  // 如果不是上传文件
  if (newOptions.manner !== 'file') {
    const noFilterField: any = {};
    if (Array.isArray(newOptions.noFilterField)) {
      newOptions.noFilterField.forEach((item: any) => {
        noFilterField[item] = newOptions.params[item];
      });
    }
    if (newOptions.isFilter) {
      // 去除无效的参数
      newOptions.params = buildParamsNull(
        newOptions.params,
        newOptions.deleteField,
        newOptions.deleteTimeField
      );
    }
    // 合并下
    newOptions.params = { ...noFilterField, ...newOptions.params };
  }

  // 处理cookie相关逻辑
  if (typeof document !== 'undefined') {
    // 根据cookieMode决定withCredentials的设置
    const cookieMode = newOptions.cookieMode || 'header';

    if (cookieMode === 'credentials' || cookieMode === 'both') {
      // 使用withCredentials方式（需要服务器CORS支持）
      newOptions.withCredentials = true;
    } else if (newOptions.withCredentials === true) {
      // 用户明确设置了withCredentials为true
      newOptions.withCredentials = true;
    } else {
      // 默认不使用withCredentials，避免CORS问题
      newOptions.withCredentials = false;
    }

    // 处理自定义cookie
    if (newOptions.cookies && Object.keys(newOptions.cookies).length > 0) {
      if (cookieMode === 'credentials' || cookieMode === 'both') {
        // 方式1：设置到浏览器cookie（受同源策略限制）
        Object.entries(newOptions.cookies).forEach(([name, value]) => {
          cookieUtils.set(name, value as any);
        });
      }

      if (cookieMode === 'header' || cookieMode === 'both') {
        // 方式2：通过请求头传递cookie值（推荐，避免CORS限制）
        if (!newOptions.headers) {
          newOptions.headers = {};
        }
        const cookieString = Object.entries(newOptions.cookies)
          .map(([name, value]) => `${name}=${value}`)
          .join('; ');
        const headerName = newOptions.cookieHeaderName || 'X-Custom-Cookie';
        newOptions.headers[headerName] = cookieString;
      }
    }

    // 处理CSRF token
    if (newOptions.autoCSRF) {
      const csrfToken = cookieUtils.read(newOptions.csrfCookieName || 'csrftoken');
      if (csrfToken) {
        if (!newOptions.headers) {
          newOptions.headers = {};
        }
        newOptions.headers[newOptions.csrfHeaderName || 'X-CSRFToken'] = csrfToken;
      }
    }
  }

  if (typeof sessionStorage !== 'undefined') {
    // 获取要添加token的url
    const tokenUrl: string = sessionStorage.getItem('tokenUrl') || '';
    // 请求的地址判断
    if (url.search(tokenUrl) !== -1) {
      // 如果没有配置请求头，就给一个默认的对象
      if (!newOptions.headers) {
        newOptions.headers = {};
      }
      if (!newOptions.headers.Authorization) {
        const authorization =
          sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');
        if (authorization) {
          newOptions.headers.Authorization = authorization;
        }
        delete newOptions.headers.authorization;
      }
    } else {
      delete newOptions.headers!.usertoken;
    }
  }
  newOptions.method = newOptions.method?.toLowerCase() as IRequestOption['method'];
  if (newOptions.method === 'get') {
    if (typeof newOptions.params === 'object') {
      // 如果是get请求，那就把参数拼接到url上
      url = `${url}?${buildQueryParams(newOptions.params)}`;
      delete newOptions.params;
    }
  } else if (newOptions.manner === 'json') {
    newOptions.requestType = 'json';
    // json格式
    newOptions.headers = {
      ...newOptions.headers,
      ...{ 'Content-Type': 'application/json;charset=utf-8' }
    };
    if (!newOptions.params) {
      newOptions.params = {};
    }
    if (options.reqEnv === 'rn') {
      newOptions.body = JSON.stringify(newOptions.params);
    } else {
      newOptions.data = newOptions.params;
    }
    delete newOptions.params;
  } else if (newOptions.manner === 'form') {
    newOptions.requestType = 'form';
    if (typeof newOptions.params === 'object' && Object.keys(newOptions.params).length > 0) {
      // json格式
      newOptions.headers = {
        ...newOptions.headers,
        ...{ 'Content-Type': 'application/x-www-form-urlencoded' }
      };
      if (newOptions.reqEnv === 'rn') {
        newOptions.body = buildQueryParams(newOptions.params);
      } else {
        newOptions.data = buildQueryParams(newOptions.params);
      }
    }
    delete newOptions.params;
  }
  // 如果是上传的文件
  if (newOptions.manner === 'file') {
    // 完整表单
    const formData = new FormData();
    if (Array.isArray(newOptions.params)) {
      newOptions.params.forEach((item: any) => {
        if (newOptions.reqEnv === 'rn') {
          formData.append('file', {
            uri: item.uri,
            type: 'application/octet-stream',
            name: item.name
          } as any);
          formData.append('fileId', item.fileId);
        } else {
          formData.append('file', item);
        }
      });
    } else if (newOptions.reqEnv === 'rn') {
      formData.append('file', {
        uri: newOptions.params.uri,
        type: 'application/octet-stream',
        name: newOptions.params.name
      } as any);
      formData.append('fileId', newOptions.params.fileId);
    } else {
      formData.append('file', newOptions.params);
      formData.append('fileId', newOptions.params.fileId);
    }
    newOptions.params = formData;
    newOptions.data = formData;
    newOptions.body = formData;
    // 设置请求头为：multipart/form-data;charset=utf-8
    newOptions.headers = {
      ...newOptions.headers,
      ...{ 'Content-Type': 'multipart/form-data;charset=utf-8' }
    };
  }
  delete newOptions.setToken;
  newOptions.url = url;
  return newOptions;
};

export const colorList = [
  '#2db7f5',
  '#87d068',
  '#108ee9',
  '#f50',
  '#e6f7ff',
  '#d4387e',
  '#ffc1a5',
  '#781db3',
  '#096de0',
  '#e79908'
];

/**
 * 请求错误拦截——后台返回错误数据的拦截，到这里的话，相当于http状态码的校验已经通过了
 * @param data 后台传递的结果数据
 * @param url 请求的地址
 * @param newOptions 请求的配置项
 * @param callback 回调函数
 */
export const responseErrorIntercept = (
  data: any,
  newOptions: IRequestOption,
  url: string,
  callback?: ICallBack
) => {
  if (newOptions.cacheLog && !newOptions.isFile) {
    // 存储下日志
    ReqQueue.addReqQueue(data, newOptions.reqUuid);
  }
  // 判断是否是开发环境
  if (newOptions.showLog && !newOptions.isFile) {
    // 获取0到5之间的随机数
    const random = Math.floor(Math.random() * colorList.length);
    console.log(`%c ${new Date().toLocaleString()}本次请求信息：`, `color:${colorList[random]}`, {
      url,
      req: newOptions.params,
      res: data,
      opt: newOptions
    });
  }
  // 如果有自定义回调，使用自定义回调即可
  if (callback) {
    return callback(data);
  }
  let jsonData: any = null;
  if (typeof data === 'undefined' || data === null) {
    // 没有返回数据
    data = { code: 504, msg: codeMessage[504] };
  }
  // 判断是否文件下载
  if (newOptions.isFile) {
    jsonData = data;
  } else if (Number(data.code) === 0) {
    // 缓存操作
    if (newOptions.cacheData && newOptions.cacheKey && typeof sessionStorage !== 'undefined') {
      newOptions.cacheControl = newOptions.cacheControl || 30000;
      const cacheData: ICacheData = {
        // 30秒内不会有新请求出去
        expires: new Date().getTime() + newOptions.cacheControl,
        data: data.result
      };
      sessionStorage.setItem(newOptions.cacheKey, JSON.stringify(cacheData));
    }
    jsonData = data.result;
  } else {
    const status = data.code || data.status;
    const errorData = {
      msg: data.msg || data.errmsg || (codeMessage as any)[status],
      url,
      status,
      code: status,
      statusText: data.msg
    };
    return Promise.reject({ ...data, ...errorData });
  }
  if (newOptions.resNullReplace) {
    stringUtils.replaceEmpty(jsonData, newOptions.resNullReplace);
  }
  if (newOptions.resReplaceField) {
    stringUtils.replaceFieldsEmpty(jsonData, newOptions.resReplaceField, newOptions.resNullReplace);
  }
  // 返回数据
  return jsonData;
};

/**
 * 处理请求列表的参数 - 分页和排序参数
 * @param v 参数
 * @param sort 排序
 */
export const handleReqListParams = (v: any, sort: any) => {
  if (v.current) {
    v.pageNum = v.current;
  }
  if (sort && Object.keys(sort).length > 0) {
    const newSort: any = {};
    Object.keys(sort).forEach(key => {
      newSort[key] = sort[key] === 'ascend';
    });
    v.sort = newSort;
  }
  return v;
};

// 生成fetch请求
export const generateFetchRequest = () => {
  let originalFetch: any = undefined;

  if (typeof window !== 'undefined' && window?.fetch) {
    originalFetch = window.fetch;
  } else if (typeof fetch !== 'undefined') {
    originalFetch = fetch;
  }
  return originalFetch;
};



export const getRequestUtils = (option: IRequestOption) => {
  let requestUtil: any = axios;
  if (option.reqEnv === 'browser') {
    requestUtil = axios;
  } else if (option.reqEnv === 'rn') {
    requestUtil = generateFetchRequest();
  } else if (option.reqEnv === 'fetch') {
    requestUtil = generateFetchRequest();
  } else if (option.reqEnv === 'uni') {
    // 使用uniRequest
    requestUtil = uniRequest;
  } else {
    // 对环境进行判断
    // eslint-disable-next-line no-lonely-if
    if (typeof window !== 'undefined') {
      requestUtil = axios;
    } else if (typeof fetch !== 'undefined') {
      requestUtil = generateFetchRequest();
      // @ts-ignore
    } else if (typeof uni !== 'undefined' && typeof uni.request !== 'undefined') {
      requestUtil = uniRequest;
    } else {
      requestUtil = axios;
    }
  }
  return requestUtil;
};