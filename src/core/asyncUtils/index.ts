/**
 * 异步工具函数
 */

/**
 * 异步队列类
 */
class AsyncQueue {
  private queue: (() => Promise<any>)[] = [];
  private running = false;
  
  /**
   * 添加任务到队列
   * @param task 异步任务
   * @returns Promise
   */
  add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.process();
    });
  }
  
  private async process(): Promise<void> {
    if (this.running || this.queue.length === 0) return;
    
    this.running = true;
    
    while (this.queue.length > 0) {
      const task = this.queue.shift()!;
      await task();
    }
    
    this.running = false;
  }
}

/**
 * 异步工具对象
 */
const asyncUtils = {
  /**
   * 延迟执行
   * @param ms 延迟毫秒数
   * @returns Promise
   */
  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  /**
   * 超时控制
   * @param promise Promise对象
   * @param timeout 超时时间（毫秒）
   * @param timeoutMessage 超时错误信息
   * @returns 带超时控制的Promise
   */
  withTimeout<T>(
    promise: Promise<T>,
    timeout: number,
    timeoutMessage = 'Operation timed out'
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(timeoutMessage)), timeout)
      )
    ]);
  },

  /**
   * 重试机制
   * @param fn 要重试的函数
   * @param maxRetries 最大重试次数
   * @param delayMs 重试间隔（毫秒）
   * @returns Promise
   */
  async retry<T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    delayMs = 1000
  ): Promise<T> {
    let lastError: Error;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries) {
          await this.delay(delayMs);
        }
      }
    }
    
    throw lastError!;
  },

  /**
   * 并发控制
   * @param tasks 任务数组
   * @param concurrency 并发数
   * @returns Promise数组结果
   */
  async concurrent<T>(
    tasks: (() => Promise<T>)[],
    concurrency = 3
  ): Promise<T[]> {
    const results: T[] = [];
    const executing: Promise<void>[] = [];
    
    for (const [index, task] of tasks.entries()) {
      const promise = task().then(result => {
        results[index] = result;
      });
      
      executing.push(promise);
      
      if (executing.length >= concurrency) {
        await Promise.race(executing);
        executing.splice(executing.findIndex(p => p === promise), 1);
      }
    }
    
    await Promise.all(executing);
    return results;
  },

  /**
   * 防抖函数
   * @param fn 要防抖的函数
   * @param delay 延迟时间（毫秒）
   * @returns 防抖后的函数
   */
  debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  },

  /**
   * 节流函数
   * @param fn 要节流的函数
   * @param interval 间隔时间（毫秒）
   * @returns 节流后的函数
   */
  throttle<T extends (...args: any[]) => any>(
    fn: T,
    interval: number
  ): (...args: Parameters<T>) => void {
    let lastTime = 0;
    
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastTime >= interval) {
        lastTime = now;
        fn(...args);
      }
    };
  },

  /**
   * 创建异步队列实例
   * @returns AsyncQueue实例
   */
  createQueue(): AsyncQueue {
    return new AsyncQueue();
  },

  /**
   * 缓存装饰器（基于Promise）
   * @param fn 要缓存的异步函数
   * @param keyFn 生成缓存键的函数
   * @param ttl 缓存时间（毫秒），0表示永不过期
   * @returns 带缓存的函数
   */
  memoizeAsync<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    keyFn: (...args: Parameters<T>) => string = (...args) => JSON.stringify(args),
    ttl = 0
  ): T {
    const cache = new Map<string, { value: any; expiry: number }>();
    
    return ((...args: Parameters<T>) => {
      const key = keyFn(...args);
      const cached = cache.get(key);
      
      if (cached && (ttl === 0 || Date.now() < cached.expiry)) {
        return Promise.resolve(cached.value);
      }
      
      const promise = fn(...args);
      
      promise.then(result => {
        cache.set(key, {
          value: result,
          expiry: ttl > 0 ? Date.now() + ttl : Infinity
        });
      });
      
      return promise;
    }) as T;
  }
};

export default asyncUtils;
export { AsyncQueue };