/**
 * 路由的定义
 */
export interface IRoute {
  /**
   * 地址
   */
  path: string;
  /**
   * 对应组件地址，相对路径
   */
  component?: string;
  /**
   * 子路由
   */
  routes?: IRoute[];
  Routes?: string[];
  redirect?: string;
  /**
   * 名称
   */
  name?: string;
  /**
   * 展示的图标
   */
  icon?: string;
  /**
   * 路由权限
   */
  authority?: string[];
  /**
   * 是否隐藏子目录
   */
  hideChildrenInMenu?: boolean;
}

export declare type SingleValueType = (string | number)[];

export declare type ValueType = SingleValueType | SingleValueType[];
export type UploadFileStatus = 'error' | 'success' | 'done' | 'uploading' | 'removed' | 'waiting';

/**
 * 权限枚举 - 同后端的 com.theling.common.constant。ZlPermissions
 */
export enum ZlPermissionEnum {
  /**
   * 公有
   */
  PUBLIC = 0,
  /**
   * 私有
   */
  PRIVATE = 1,
  /**
   * 登录后可以查看
   */
  LOGIN = 2,
  /**
   * 本部门可见/部门内可见
   */
  DEPT = 3
}

export interface UploadFile<T = any> {
  uid: string;
  size?: number;
  name: string;
  fileName?: string;
  lastModified?: number;
  lastModifiedDate?: Date;
  url?: string;
  status?: UploadFileStatus;
  percent?: number;
  thumbUrl?: string;
  crossOrigin?: any;
  originFileObj?: any;
  response?: T;
  error?: any;
  linkProps?: any;
  type?: string;
  xhr?: T;
  preview?: string;
}
/**
 * 文件上传的基本对象
 */
export interface IFileObjVoBase extends UploadFile {
  /**
   * 文件id
   */
  fileId: string;
  /**
   * 文件大小
   */
  fileSize: number;
  /**
   * 是否是旧的文件
   */
  oldFile: boolean;
  /**
   * 文件的id，这个是后端生成的，不是文件的uid
   */
  dbFileId: string;

  /**
   * 业务场景 -新）
   */
  busiScene?: string;

  cosKey: string;

  /**
   * 带水印的key
   */
  cosWaterKey: string;

  /**
   * 文件的预览图访问地址
   */
  previewUrl: string;

  /**
   * 文件的桶 - cycm会用到
   */
  bucket: string;

  /**
   * 文件的权限 - 0 公开，1 私有，2 登录后可以查看
   */
  permission?: ZlPermissionEnum;
  /**
   * 后缀
   */
  suffix?: string;
  /**
   * 文件关联的id - cycm会用到
   */
  relId?: string;
  /**
   * md5
   */
  md5?: string;
  /**
   * 创建时间
   */
  creTime?: string;
  /**
   * 给ReactNative用的
   */
  uri?: string;
  /**
   * 文件时长
   */
  videoDuration?: number;
  /**
   * 文件的formdata格式
   */
  formData?: FormData;
}

/**
 * 高德地图中国城市数据
 */
export interface IAMapCountryTree {
  /**
   * 地区码
   */
  adcode: string;
  /**
   * 层级
   */
  level: string;
  /**
   * 中心点
   */
  center: number[];
  /**
   * 中文
   */
  name: string;
  /**
   * 父级地区码
   */
  pcode: string;

  idealzoom: number;
  /**
   * 父级地区码
   */
  acroutes: number[];

  bbox: number[];

  children?: IAMapCountryTree[];
}

/**
 * 通用的标准资源项
 */
export interface ICommonAssistItem<T = any> {
  /**
   * =======基础数据部分========
   */
  /**
   * 资源主键
   */
  value?: string;
  /**
   * 全局唯一id
   */
  unionId?: string;
  /**
   * 资源主键
   */
  id?: string;
  /**
   * 资源名称
   */
  label?: string;
  /**
   * 是否系统关联
   */
  sysRel?: boolean;
  /**
   * 状态
   */
  statusText?: string;
  /**
   * 状态
   */
  status?: number | string;
  /**
   * 是否有效
   */
  valid?: boolean;
  /**
   * 资源类型
   */
  sourceType?: string;
  sourceTypeText?: string;
  /**
   * 其他的一些属性
   */
  other?: T;
  /**
   * 是否是新数据
   */
  isNew?: boolean;
  /**
   * 数据的操作 0 删除，1 新增，null 无变化
   */
  actionType?: 0 | 1 | null | undefined;
  /**
   * 关联关系
   */
  relationship?: string;
  /**
   * 关联关系的中文
   */
  relationshipText?: string;
  /**
   * 关联依据
   */
  relationshipBasic?: string;
  /**
   * 关联来源
   */
  relationshipSource?: string;
  /**
   * ===========下面的是组件可能会用到的属性=========
   */
  /**
   * 详情数据(目前是由行业表述使用)
   */
  infoReq?: any;
  /**
   * 关联的类型 1，主动关联，2，被动关联
   */
  relType?: 1 | 2;
  key?: string;
  /**
   * 关联的资源id
   */
  sourceId?: string;
}

export interface FileUpload2Fun {
  /**
   * 开始上传
   * @param relId 关联的id
   * @param config 额外的配置
   */
  startUpload: (
    relId?: string,
    config?: {
      tipsStart?: boolean;
      tipsEnd?: boolean;
    }
  ) => Promise<IFileObjVoBase[]>;
}

interface MutableRefObject<T> {
  current: T;
}

/**
 * 文件上传组件上传的钩子，因为这个文件上传是在Service包中使用的，然后会导致在Vue的项目找不到React报错
 */
export type IUploadRef = MutableRefObject<FileUpload2Fun | undefined>;

/**
 * StringKeys<T>
 * ----------------
 * 从对象类型 T 中挑选出值类型为 string 或 string | undefined 的键
 *
 * 例子：
 *   type ICloudAccount = {
 *     accessKey?: string;
 *     balance?: number;
 *     secretKey?: string;
 *   }
 *
 *   type Keys = StringKeys<ICloudAccount>
 *   // 结果: "accessKey" | "secretKey"
 */
export type StringKeys<T> = {
  [K in keyof T]: T[K] extends string | undefined ? K : never;
}[keyof T];
