import { codeMessage } from './httpCode';
import { ICacheData, ICallBack, IRequestOption } from './typings';
import { generateFetchRequest, getRequestUtils, requestErrorIntercept, responseErrorIntercept } from './httpUtils';
import ReqQueue from './ReqQueue';
import cryptoUtils from '../core/cryptoUtils';

/**
 * 状态码检测
 * @param response 返回值
 * @param opt 请求配置
 * @return {*}
 */
const checkStatus = async (response: any, opt: IRequestOption) => {
  if (opt.cacheLog && !opt.isFile) {
    // 存储下日志
    await ReqQueue.addReqQueue(response, opt.reqUuid);
  }
  if (response.status >= 200 && response.status < 300) {
    // 如果是浏览器，并且没有指定fetch，就返回data
    if (opt.reqEnv === 'fetch') {
      return response.json();
    }
    if (opt.reqEnv !== 'rn') {
      return response.data;
    }
    return response.json();
  }
  // 请求异常
  const msg = response.data?.msg || codeMessage[response.status];
  const errorData = {
    msg: msg,
    message: msg,
    url: response.url,
    status: response.status,
    code: response.status,
    statusText: codeMessage[response.status],
    response
  };
  return Promise.reject(errorData);
};

export type IZlResponse = {
  code: number;
  msg: string;
  message: string;
  result: any;
  url: string;
  status: number;
  statusText: string;
};

const binRequest = async (
  url: string,
  option: IRequestOption = {},
  errorHandler?: (error: IZlResponse, opt: IRequestOption) => void,
  callback?: ICallBack
): Promise<any> => {
  // 判断是否开启了日志
  if (option.cacheLog) {
    option.reqUuid = await cryptoUtils.uuid();
    ReqQueue.init({
      cacheMethod: option.cacheMethod,
      maxQueueLength: option.maxCacheLog
    });
    await ReqQueue.addReqQueue(url, option.reqUuid);
    // 存储下日志
    await ReqQueue.addReqQueue(option, option.reqUuid);
  }
  // 地址拦截
  if (url.length === 0) {
    return Promise.reject(new Error('无效的请求地址'));
  }
  // 如果开启了缓存
  if (option.cacheData && typeof sessionStorage !== 'undefined') {
    const cacheKey = url + JSON.stringify(option.params);
    option.cacheKey = cacheKey;
    // 拿到缓存的数据
    const cacheData: ICacheData = JSON.parse(sessionStorage.getItem(cacheKey) || '{}');
    // 判断是否有效
    if (new Date().getTime() < cacheData.expires) {
      // 有效
      return new Promise(resolve => resolve(cacheData.data));
    }
  }
  const requestUtil: any = getRequestUtils(option);
  // 判断是否外部接口
  if (option.isExternal) {
    return requestUtil(url, option as any).then((resJson: any) => {
      if (callback) {
        return callback(resJson);
      }
      return resJson;
    });
  }
  // 检查参数
  const newOptions = requestErrorIntercept(url, option);
  if (typeof AbortController !== 'undefined') {
    const controller = new AbortController();
    newOptions.signal = controller.signal;
    if (option.reqEnv !== 'rn') {
      setTimeout(() => {
        controller.abort();
      }, newOptions.timeout);
    }
  }
  if (option.reqType === 'sse') {
    try {
      const fetchObj = {
        method: newOptions.method,
        headers: newOptions.headers,
        body: JSON.stringify(newOptions.data)
      };
      const originalFetch = generateFetchRequest()
      const response = await originalFetch(newOptions.url!, fetchObj as any);
      const decoder = new TextDecoder('utf-8');
      const encoder = new TextEncoder();
      const reader = response.body?.getReader();
      if (reader) {
        const readableStream = new ReadableStream({
          async start(controller) {
            function push() {
              reader!.read().then(({ done, value }: any) => {
                if (done) {
                  controller.close();
                  return;
                }
                const chunk = decoder.decode(value, { stream: true });
                controller.enqueue(encoder.encode(chunk));
                push();
              });
            }
            push();
          }
        });
        return new Response(readableStream);
      }
      return Error('无效的reader');
    } catch (e) {
      console.log('e', e);
      // 抛出异常
      return Promise.reject(e);
    }
  }
  return (
    requestUtil(newOptions.url!, newOptions as any)
      // 先对请求状态码进行检查
      .then(async (res: any) => await checkStatus(res, newOptions))
      // 检查响应数据
      .then((resJson: any) => responseErrorIntercept(resJson, newOptions, url, callback))
      .catch((e: any) => {
        if (e.code === 'ECONNABORTED' || e.code === 20) {
          e = {
            ...e,
            code: 20,
            meg: codeMessage[20],
            message: codeMessage[20]
          };
        }
        if (e.code === 'transitional' || e.message === 'Failed to fetch') {
          e = {
            ...e,
            code: 'transitional',
            meg: codeMessage['transitional'],
            message: codeMessage['transitional']
          };
        }
        if (option.cacheLog) {
          // 存储下日志
          ReqQueue.addReqQueue(e, option.reqUuid);
        }
        if (errorHandler) {
          errorHandler(e, newOptions);
          if (!newOptions.errorContinue) {
            return Promise.reject(e);
          }
          return { code: 0 };
        }
        return Promise.reject(e);
      })
  );
};

export default binRequest;
