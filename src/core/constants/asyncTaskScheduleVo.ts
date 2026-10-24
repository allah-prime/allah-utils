/**
 * 异步任务进度信息
 */
export interface IAsyncTaskScheduleVo<T = any> {
  /**
   * 是否是拆分任务
   */
  splitTask: boolean;
  /**
   * 拆分任务数量是否是合并任务
   */
  splitTaskCount: number;
  /**
   * 当前执行的拆分任务
   */
  currentSplitTask: number;
  /**
   * 总页数
   */
  pages: number;
  /**
   * 总数量
   */
  count: number;
  redisKey: string;
  /**
   * 每页数据量
   */
  pageSize: number;
  /**
   * 当前是第几个
   */
  current: number;
  /**
   * 更新数量
   */
  updateNum: number;
  /**
   * 当前是第几页
   */
  currentPage: number;
  /**
   * 当前数据的总数
   */
  currentSize: number;
  /**
   * 状态；1 新任务，2旧任务
   */
  type: number;
  typeText: string;
  /**
   * 状态；0 未创建，1 正在载入数据，2 正在处理，3 已结束 4 异常
   */
  status: 0 | 1 | 2 | 3 | 4;
  statusText: string;
  /**
   * 异常信息
   */
  errorMessage: string;
  /**
   *文件id
   */
  dbFileId: string;
  /**
   * 错误总数
   */
  errorTotal: number;
  /**
   *用户id
   */
  userId: string;
  /**
   * 异步任务类型
   */
  timeConsuming: number;

  /**
   * 预计耗时多少秒
   */
  expectTime: number;
  /**
   * 额外数据
   */
  extraData?: T;
  /**
   * 超时时间
   */
  timeOut:number;
  /**
   * 进度，0-100
   */
  progress: number;
  /**
   * 异步任务
   */
  asyncTask: boolean;
}
