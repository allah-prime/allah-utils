import axios, { AxiosError, AxiosResponse } from 'axios';

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
function settle(
  resolve: (value: AxiosResponse<any>) => void,
  reject: (reason?: any) => void,
  response: AxiosResponse<any>
) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(
      new AxiosError(
        `Request failed with status code ${response.status}`,
        [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][
        Math.floor(response.status / 100) - 4
        ],
        response.config,
        response.request,
        response
      )
    );
  }
}

const uniRequest = axios.create({
  withCredentials: false,
  timeout: 6000
});
// @ts-ignore
if (typeof uni !== 'undefined' && typeof uni.request !== 'undefined') {
  // 自定义适配器，用来适配uniapp的语法
  uniRequest.defaults.adapter = config => {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      uni.request({
        // @ts-ignore
        method: config.method!.toUpperCase(),
        // @ts-ignore
        url: config.url,
        header: { ...config.headers },
        data: config.data,
        // @ts-ignore
        responseType: config.responseType,
        complete: (response: any) => {
          // 处理响应
          const res: any = {
            data: response.data,
            status: response.statusCode,
            errMsg: response.errMsg,
            header: response.header,
            config: config,
            request: response.request
          };
          // 根据返回状态处理
          if (response.statusCode >= 200 && response.statusCode < 300) {
            settle(resolve, reject, res);
          } else {
            reject(
              new AxiosError(res.errMsg, AxiosError.ERR_BAD_RESPONSE, config, response.request, res)
            );
          }
        }
      });
    });
  };
}

export default uniRequest;
