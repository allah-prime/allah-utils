import { handleError, safeGetResponseData } from "../uniUtils"

/**
 * 云函数调用参数接口
 * 用于统一封装调用云函数时所需的参数
 */
type ICallParams<T> = {
  /** 云函数名称 */
  function: string
  /** 云函数内部操作类型 */
  action: string
  /** 传递给云函数的额外参数 */
  params?: any,
  /**
   * 异常的时候的默认值
   */
  errorDefault?: T,
  /**
   * 成功时的提示
   */
  successMessage?: string,
  /**
   * 失败时的提示
   */
  errorMessage?: string,
}

/**
 * 云函数工具类
 * 提供云函数调用、重试、响应处理等功能
 */
export const cloudUtils = {
  /**
   * 调用云函数
   * @param app CloudBase 应用实例
   * @param params 操作参数
   * @returns 云函数执行结果
   */
  async call<T = any>(app: any, params: ICallParams<T>
  ): Promise<T> {
    try {
      const result = await app.callFunction({
        name: params.function,
        data: {
          action: params.action,
          params: params.params
        }
      })
      // 提示信息处理
      if(params.successMessage){
        return cloudUtils.handleResponse(result.result, params.successMessage)
      }
      // 使用 safeGetResponseData 确保返回安全的数据结构
      return safeGetResponseData(result.result, params.errorDefault) as T
    } catch (error) {
      handleError(error, `调用云函数 ${params.function} 失败`)
    }
    return null as T
  },

  /**
   * 带重试机制调用云函数
   * @param app CloudBase 应用实例
   * @param functionName 云函数名称
   * @param action 操作类型
   * @param params 参数
   * @param retryCount 重试次数，默认3次
   * @returns 云函数执行结果
   */
  async callWithRetry(
    app: any,
    functionName: string,
    action: string,
    params?: any,
    retryCount: number = 3
  ): Promise<any> {
    let lastError: any

    for (let i = 0; i < retryCount; i++) {
      try {
        return await this.call(app, {
          function: functionName,
          action,
          params
        })
      } catch (error) {
        lastError = error
        if (i < retryCount - 1) {
          // 等待一段时间后重试
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        }
      }
    }

    throw lastError
  },

  /**
   * 处理响应
   * @param data 云函数返回结果
   * @param successMessage 成功提示消息
   * @returns 处理后的结果数据
   */
  handleResponse(data: any, successMessage?: string) {
    if (data?.code === 0) {
      if (successMessage) {
        uni.showToast({
          title: successMessage,
          icon: 'success'
        })
      }
      return data.result
    }
    const errorMessage = data?.message || '操作失败'
    uni.showToast({
      title: errorMessage,
      icon: 'none'
    })
    throw new Error(errorMessage)
  }
}