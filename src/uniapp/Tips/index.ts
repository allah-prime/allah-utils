// ==================== UniApp 提示工具函数 ====================

/**
 * 提示类型枚举
 */
export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  LOADING = 'loading'
}

/**
 * 提示位置枚举
 */
export enum ToastPosition {
  TOP = 'top',
  CENTER = 'center',
  BOTTOM = 'bottom'
}

/**
 * 模态框按钮配置
 */
export interface ModalButton {
  text: string
  color?: string
}

/**
 * 模态框配置选项
 */
export interface ModalOptions {
  title?: string
  content: string
  showCancel?: boolean
  cancelText?: string
  cancelColor?: string
  confirmText?: string
  confirmColor?: string
  editable?: boolean
  placeholderText?: string
}

/**
 * ActionSheet 选项配置
 */
export interface ActionSheetItem {
  text: string
  color?: string
}

/**
 * ActionSheet 配置选项
 */
export interface ActionSheetOptions {
  itemList: string[] | ActionSheetItem[]
  itemColor?: string
  title?: string
}

// ==================== Tips 主对象 ====================

/**
 * 统一的提示工具对象
 */
export const Tips = {
  // ==================== 基础提示 ====================
  
  /**
   * 显示成功提示
   */
  success: (title: string, duration: number = 1500, mask: boolean = false): void => {
    uni.showToast({
      title,
      icon: 'success',
      duration,
      mask
    })
  },

  /**
   * 显示错误提示
   */
  error: (title: string, duration: number = 2000, mask: boolean = false): void => {
    uni.showToast({
      title,
      icon: 'error',
      duration,
      mask
    })
  },

  /**
   * 显示警告提示
   */
  warning: (title: string, duration: number = 2000, mask: boolean = false): void => {
    uni.showToast({
      title,
      icon: 'none',
      duration,
      mask
    })
  },

  /**
   * 显示普通提示
   */
  info: (title: string, duration: number = 1500, mask: boolean = false): void => {
    uni.showToast({
      title,
      icon: 'none',
      duration,
      mask
    })
  },

  /**
   * 显示加载提示
   */
  loading: (title: string = '加载中...', mask: boolean = true): void => {
    uni.showLoading({
      title,
      mask
    })
  },

  /**
   * 隐藏加载提示
   */
  hideLoading: (): void => {
    uni.hideLoading()
  },

  /**
   * 隐藏所有提示
   */
  hide: (): void => {
    uni.hideToast()
  },

  // ==================== 模态框 ====================

  /**
   * 显示确认对话框
   */
  confirm: (content: string, title: string = '提示'): Promise<boolean> => {
    return new Promise((resolve) => {
      uni.showModal({
        title,
        content,
        success: (res) => {
          resolve(res.confirm)
        },
        fail: () => {
          resolve(false)
        }
      })
    })
  },

  /**
   * 显示自定义模态框
   */
  modal: (options: ModalOptions): Promise<{
    confirm: boolean
    cancel: boolean
    content?: string
  }> => {
    return new Promise((resolve) => {
      uni.showModal({
        title: options.title || '提示',
        content: options.content,
        showCancel: options.showCancel !== false,
        cancelText: options.cancelText || '取消',
        cancelColor: options.cancelColor || '#000000',
        confirmText: options.confirmText || '确定',
        confirmColor: options.confirmColor || '#576B95',
        editable: options.editable || false,
        placeholderText: options.placeholderText || '',
        success: (res) => {
          resolve({
            confirm: res.confirm,
            cancel: res.cancel,
            content: res.content
          })
        },
        fail: () => {
          resolve({
            confirm: false,
            cancel: true
          })
        }
      })
    })
  },

  /**
   * 显示输入框对话框
   */
  input: (
    content: string,
    placeholder: string = '',
    title: string = '请输入'
  ): Promise<{confirmed: boolean, content: string}> => {
    return new Promise((resolve) => {
      uni.showModal({
        title,
        content,
        editable: true,
        placeholderText: placeholder,
        success: (res) => {
          resolve({
            confirmed: res.confirm,
            content: res.content || ''
          })
        },
        fail: () => {
          resolve({
            confirmed: false,
            content: ''
          })
        }
      })
    })
  },

  // ==================== ActionSheet ====================

  /**
   * 显示操作菜单
   */
  actionSheet: (options: ActionSheetOptions): Promise<{
    tapIndex: number
    cancelled: boolean
  }> => {
    return new Promise((resolve) => {
      const itemList = Array.isArray(options.itemList) && options.itemList.length > 0
        ? options.itemList.map(item => typeof item === 'string' ? item : item.text)
        : []

      uni.showActionSheet({
        itemList,
        itemColor: options.itemColor || '#000000',
        title: options.title,
        success: (res) => {
          resolve({
            tapIndex: res.tapIndex,
            cancelled: false
          })
        },
        fail: () => {
          resolve({
            tapIndex: -1,
            cancelled: true
          })
        }
      })
    })
  },

  // ==================== 高级功能 ====================

  /**
   * 显示带回调的成功提示
   */
  successCallback: (
    title: string,
    callback: () => void,
    duration: number = 1500
  ): void => {
    Tips.success(title, duration)
    setTimeout(callback, duration)
  },

  /**
   * 显示带回调的错误提示
   */
  errorCallback: (
    title: string,
    callback: () => void,
    duration: number = 2000
  ): void => {
    Tips.error(title, duration)
    setTimeout(callback, duration)
  },

  /**
   * 显示加载提示并执行异步操作
   */
  async: async <T>(
    asyncFn: () => Promise<T>,
    loadingText: string = '加载中...',
    successText?: string,
    errorText?: string
  ): Promise<T> => {
    try {
      Tips.loading(loadingText)
      const result = await asyncFn()
      Tips.hideLoading()
      
      if (successText) {
        Tips.success(successText)
      }
      
      return result
    } catch (error) {
      Tips.hideLoading()
      
      if (errorText) {
        Tips.error(errorText)
      }
      
      throw error
    }
  },

  /**
   * 显示删除确认对话框
   */
  deleteConfirm: (itemName: string, title: string = '删除确认'): Promise<boolean> => {
    return Tips.confirm(`确定要删除"${itemName}"吗？此操作不可撤销。`, title)
  },

  /**
   * 显示网络错误提示
   */
  networkError: (customMessage?: string): void => {
    const message = customMessage || '网络连接失败，请检查网络设置'
    Tips.error(message, 3000)
  },

  /**
   * 显示权限请求提示
   */
  permission: (permissionName: string): Promise<boolean> => {
    return Tips.confirm(
      `需要获取${permissionName}权限才能正常使用此功能，是否前往设置？`,
      '权限申请'
    )
  },

  /**
   * 显示版本更新提示
   */
  update: (
    version: string,
    updateContent: string,
    isForced: boolean = false
  ): Promise<boolean> => {
    const title = isForced ? '强制更新' : '版本更新'
    const content = `发现新版本 ${version}\n\n${updateContent}\n\n${isForced ? '请立即更新' : '是否立即更新？'}`
    
    return Tips.modal({
      title,
      content,
      showCancel: !isForced,
      confirmText: '立即更新',
      cancelText: '稍后更新'
    }).then(res => res.confirm)
  },

  // ==================== 防抖功能 ====================

  /**
   * 防抖成功提示
   */
  successDebounced: (title: string, duration: number = 1500): void => {
    ToastDebouncer.show(title, (msg) => Tips.success(msg, duration))
  },

  /**
   * 防抖错误提示
   */
  errorDebounced: (title: string, duration: number = 2000): void => {
    ToastDebouncer.show(title, (msg) => Tips.error(msg, duration))
  },

  // ==================== 批量操作 ====================

  /**
   * 创建批量操作提示管理器
   */
  batch: () => new BatchOperationTips()
}

// ==================== 兼容性导出（保持向后兼容） ====================

/**
 * 显示成功提示
 * @deprecated 建议使用 Tips.success
 */
export const showSuccessToast = (title: string, duration: number = 1500, mask: boolean = false): void => {
  Tips.success(title, duration, mask)
}

/**
 * 显示错误提示
 * @deprecated 建议使用 Tips.error
 */
export const showErrorToast = (title: string, duration: number = 2000, mask: boolean = false): void => {
  Tips.error(title, duration, mask)
}

/**
 * 显示警告提示
 * @deprecated 建议使用 Tips.warning
 */
export const showWarningToast = (title: string, duration: number = 2000, mask: boolean = false): void => {
  Tips.warning(title, duration, mask)
}

/**
 * 显示普通提示（无图标）
 * @deprecated 建议使用 Tips.info
 */
export const showToast = (title: string, duration: number = 1500, mask: boolean = false): void => {
  Tips.info(title, duration, mask)
}

/**
 * 显示加载提示
 * @deprecated 建议使用 Tips.loading
 */
export const showLoading = (title: string = '加载中...', mask: boolean = true): void => {
  Tips.loading(title, mask)
}

/**
 * 隐藏加载提示
 * @deprecated 建议使用 Tips.hideLoading
 */
export const hideLoading = (): void => {
  Tips.hideLoading()
}

/**
 * 隐藏所有提示
 * @deprecated 建议使用 Tips.hide
 */
export const hideToast = (): void => {
  Tips.hide()
}

/**
 * 显示确认对话框
 * @deprecated 建议使用 Tips.confirm
 */
export const showConfirmDialog = (content: string, title: string = '提示'): Promise<boolean> => {
  return Tips.confirm(content, title)
}

/**
 * 显示自定义模态框
 * @deprecated 建议使用 Tips.modal
 */
export const showModal = (options: ModalOptions): Promise<{
  confirm: boolean
  cancel: boolean
  content?: string
}> => {
  return Tips.modal(options)
}

/**
 * 显示输入框对话框
 * @deprecated 建议使用 Tips.input
 */
export const showInputDialog = (
  content: string,
  placeholder: string = '',
  title: string = '请输入'
): Promise<{confirmed: boolean, content: string}> => {
  return Tips.input(content, placeholder, title)
}

/**
 * 显示操作菜单
 * @deprecated 建议使用 Tips.actionSheet
 */
export const showActionSheet = (options: ActionSheetOptions): Promise<{
  tapIndex: number
  cancelled: boolean
}> => {
  return Tips.actionSheet(options)
}

/**
 * 显示带回调的成功提示
 * @deprecated 建议使用 Tips.successCallback
 */
export const showSuccessToastWithCallback = (
  title: string,
  callback: () => void,
  duration: number = 1500
): void => {
  Tips.successCallback(title, callback, duration)
}

/**
 * 显示带回调的错误提示
 * @deprecated 建议使用 Tips.errorCallback
 */
export const showErrorToastWithCallback = (
  title: string,
  callback: () => void,
  duration: number = 2000
): void => {
  Tips.errorCallback(title, callback, duration)
}

/**
 * 显示加载提示并执行异步操作
 * @deprecated 建议使用 Tips.async
 */
export const showLoadingWithAsync = async <T>(
  asyncFn: () => Promise<T>,
  loadingText: string = '加载中...',
  successText?: string,
  errorText?: string
): Promise<T> => {
  return Tips.async(asyncFn, loadingText, successText, errorText)
}

/**
 * 显示删除确认对话框
 * @deprecated 建议使用 Tips.deleteConfirm
 */
export const showDeleteConfirm = (itemName: string, title: string = '删除确认'): Promise<boolean> => {
  return Tips.deleteConfirm(itemName, title)
}

/**
 * 显示网络错误提示
 * @deprecated 建议使用 Tips.networkError
 */
export const showNetworkError = (customMessage?: string): void => {
  Tips.networkError(customMessage)
}

/**
 * 显示权限请求提示
 * @deprecated 建议使用 Tips.permission
 */
export const showPermissionRequest = (permissionName: string): Promise<boolean> => {
  return Tips.permission(permissionName)
}

/**
 * 显示版本更新提示
 * @deprecated 建议使用 Tips.update
 */
export const showUpdateDialog = (
  version: string,
  updateContent: string,
  isForced: boolean = false
): Promise<boolean> => {
  return Tips.update(version, updateContent, isForced)
}

// ==================== 工具函数 ====================

/**
 * 防抖提示 - 防止短时间内重复显示相同提示
 */
class ToastDebouncer {
  private static lastToast: { message: string; timestamp: number } | null = null
  private static readonly DEBOUNCE_TIME = 1000 // 1秒内不重复显示相同提示

  /**
   * 防抖显示提示
   * @param message 提示信息
   * @param showFn 显示函数
   */
  static show(message: string, showFn: (msg: string) => void): void {
    const now = Date.now()
    
    if (
      this.lastToast &&
      this.lastToast.message === message &&
      now - this.lastToast.timestamp < this.DEBOUNCE_TIME
    ) {
      return
    }
    
    this.lastToast = { message, timestamp: now }
    showFn(message)
  }
}

/**
 * 防抖成功提示
 * @deprecated 建议使用 Tips.successDebounced
 */
export const showSuccessToastDebounced = (title: string, duration: number = 1500): void => {
  Tips.successDebounced(title, duration)
}

/**
 * 防抖错误提示
 * @deprecated 建议使用 Tips.errorDebounced
 */
export const showErrorToastDebounced = (title: string, duration: number = 2000): void => {
  Tips.errorDebounced(title, duration)
}

/**
 * 批量操作提示管理器
 */
export class BatchOperationTips {
  private total: number = 0
  private current: number = 0
  private operation: string = ''

  /**
   * 开始批量操作
   * @param total 总数量
   * @param operation 操作名称
   */
  start(total: number, operation: string = '处理'): void {
    this.total = total
    this.current = 0
    this.operation = operation
    Tips.loading(`${operation}中... (0/${total})`)
  }

  /**
   * 更新进度
   * @param increment 增加的数量，默认1
   */
  progress(increment: number = 1): void {
    this.current += increment
    if (this.current <= this.total) {
      Tips.loading(`${this.operation}中... (${this.current}/${this.total})`)
    }
  }

  /**
   * 完成批量操作
   * @param successMessage 成功提示信息
   */
  complete(successMessage?: string): void {
    Tips.hideLoading()
    const message = successMessage || `${this.operation}完成！共处理 ${this.total} 项`
    Tips.success(message)
  }

  /**
   * 批量操作失败
   * @param errorMessage 错误提示信息
   */
  error(errorMessage?: string): void {
    Tips.hideLoading()
    const message = errorMessage || `${this.operation}失败，已处理 ${this.current}/${this.total} 项`
    Tips.error(message)
  }
}