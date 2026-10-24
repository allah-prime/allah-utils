import cryptoUtils from "../../core/cryptoUtils";

type IReqQueueInit = {
  maxQueueLength?: number;
  cacheMethod?: (v: Record<string, any>) => void;
};

// 请求队列，最多存储30个请求，超过30个请求，最早的请求将被删除
export default class ReqQueue {
  private static instance: ReqQueue;

  private static reqQueue: Record<string, any> = {};

  private static maxQueueLength = 30;

  private static cacheMethod: (v: Record<string, any>) => void = () => { };

  constructor(p: IReqQueueInit) {
    if (!ReqQueue.instance) {
      ReqQueue.instance = this;
      ReqQueue.maxQueueLength = p.maxQueueLength || 30;
      ReqQueue.cacheMethod = p.cacheMethod || (() => { });
    }
    return ReqQueue.instance;
  }

  static init(p: IReqQueueInit) {
    return this.getInstance(p);
  }

  static getInstance(p: IReqQueueInit) {
    if (!this.instance) {
      if (window) {
        window.ReqQueue = this.reqQueue;
      }
      return (this.instance = new ReqQueue(p));
    }
    return this.instance;
  }

  /**
   * 获取下日志队列
   */
  static getReqQueue() {
    return this.reqQueue;
  }

  /**
   * 添加或者更新一条记录
   * @param data
   * @param key
   */
  static async addReqQueue(data: any, key?: string) {
    if (!key) {
      key = await cryptoUtils.uuid();
    }
    const keys = Object.keys(this.reqQueue);
    if (keys.length >= this.maxQueueLength) {
      // 移除keys里面的第一个
      delete this.reqQueue[keys[0]];
    }
    // 获取下当前的时间戳
    const now = new Date().getTime();
    if (!this.reqQueue[key!]) {
      this.reqQueue[key!] = {};
    }
    this.reqQueue[key!][now] = data;
    this.cacheMethod(this.reqQueue);
  }
}