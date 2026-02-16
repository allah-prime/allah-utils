import type { Dayjs } from "dayjs";

/**
 * 由id和text组成的选项
 */
export interface IOptions2 {
  /**
   * 文本
   */
  text: any;
  /**
   * 值
   */
  id: any;
  /**
   * 判断类型
   */
  type?: string;
  remark?: string;
  /**
   * 循环用的key，不一定有值，需要和后端确认！
   */
  key?: string;
}


/**
 * 初始筛选
 */
export interface IBaseFilter {
  /**
   * 搜索的关键词
   */
  keyword?: string;
  /**
   * 开始日期
   */
  startDay?: string | Dayjs;
  startDayStr?: string | Dayjs;
  /**
   * 结束日期
   */
  endDay?: string | Dayjs;
  endDayStr?: string | Dayjs;
  /**
   * 页码
   */
  pageNum?: number;
  /**
   * 时间 -  除开始时间和结束时间外 其他的可以这么传
   */
  time?: string[] | Dayjs[];
  /**
   * 创建 时间
   */
  creTimeArr?: string[];
  /**
   * 更新 时间
   */
  updateTimeArr?: string[];
  /**
   * 单页文件大小，最大不超过20
   */
  pageSize?: number;
  /**
   * 当前页数
   */
  current?: number;
  /**
   * 排序，传递一个字段，和一个是否升序的布尔值
   */
  sort?: Record<string, boolean>;
  /**
   * 地区码
   */
  areaCode?: string;
}

export const defBaseFilter: IBaseFilter = {
  keyword: undefined,
  startDay: undefined,
  endDay: undefined,
  pageNum: 1,
  pageSize: 10,
  current: 1,
  sort: undefined,
  areaCode: undefined
}

/**
 * 由label和value和key组成的选项
 */
export interface IOptions61<T> {
  label: string;
  value: T;
  key: string;
}


/**
 * 由label和value和checked和disabled组成的选项
 */
export interface IOptions<T, O = Record<string, any>, K = string | number | bigint> {
  label: any;
  value: T;
  checked?: boolean;
  disabled?: boolean;
  text?: string;
  /**
   * 循环用的key，不一定有值，需要和后端确认！
   */
  key: K;
  /**
   * 颜色
   */
  color?: string;
  /**
   * 描述信息
   */
  description?: string;
  /**
   * 这个是为了兼容异步多级联动组件加上去的
   */
  loading?: boolean;
  /**
   * 额外的信息
   */
  other?: O;
  /**
   * 提示文本
   */
  tipText?: string;
}

/**
 * 数字有效性
 */
export type IValidityNum = 0 | 1;

/**
 * 天气
 */
export interface IWaterInfo {
  /**
   * 返回状态值为0或11：成功；0：失败
   */
  status: IValidityNum;
  /**
   * 返回结果总数目
   */
  count: number;

  /**
   * 返回的状态信息
   */
  info: string;

  /**
   * 返回状态说明,10000代表正确
   */
  infocode: string;

  /**
   * 实况天气数据信息
   */
  lives: IWaterLives[];
}


export interface IWaterLives {
  /**
   * 省份名
   */
  province: string;
  /**
   * 城市名
   */
  city: string;
  /**
   * 区域编码
   */
  adcode: string;
  /**
   * 天气现象（汉字描述）
   */
  weather: string;
  /**
   * 实时气温，单位：摄氏度
   */
  temperature: string;
  /**
   * 风向描述
   */
  winddirection: string;
  /**
   * 风力级别，单位：级
   */
  windpower: string;
  /**
   * 空气湿度
   */
  humidity: string;
  /**
   * 数据发布的时间
   */
  reporttime: string;
}