import { IRequestOption } from "./../typings";

/**
 * HTTP编码属性
 */
export const codeMessage: any = {
  20: '请求超时，请检查网络。',
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器无法响应操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '请求的接口不存在。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  415: '请求的方式错误',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '服务响应超时，请稍后再试。',
  transitional: '网络错误，请检查网络。',
  ERR_NETWORK: '网络错误，请检查网络。',
  ERR_CANCELED: '请求超时，请稍后再试。'
};

// 默认的配置项
export const defOption: IRequestOption = {
  method: 'post',
  manner: 'form',
  requestType: 'form',
  setToken: false,
  isFile: false,
  headers: {},
  mode: 'cors',
  isFilter: true,
  toHtml: true,
  validateStatus: () => true,
  reqEnv: 'browser',
  timeout: 6500,
  withCredentials: false,
  cookieMode: 'header',
  cookieHeaderName: 'X-Custom-Cookie',
  autoCSRF: false,
  csrfCookieName: 'csrftoken',
  csrfHeaderName: 'X-CSRFToken'
};
