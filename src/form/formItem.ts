import { IOptions } from "../types";
import { BaseRule } from "./rule";

/**
 * 必填标记类型
 * 用于控制表单项的必填显示方式
 */
export declare type RequiredMark = boolean | "optional";

/**
 * 工具提示属性接口
 * 用于配置提示框的样式和行为
 */
export interface TooltipProps {
  /** 样式对象 */
  style?: any;
  /** CSS类名 */
  className?: string;
  /** 背景颜色 */
  color?: string;
  /** 打开状态的CSS类名 */
  openClassName?: string;
  /** 箭头是否指向中心 */
  arrowPointAtCenter?: boolean;
  /** 是否自动调整溢出 */
  autoAdjustOverflow?: boolean;
  /** 获取弹出容器的函数 */
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  /** 子元素 */
  children?: any;
  /** 标题内容 */
  title?: any;
  /** 覆盖层内容 */
  overlay?: any;
}

/**
 * 包装工具提示属性
 * 在基础TooltipProps上增加图标配置
 */
export declare type WrapperTooltipProps = TooltipProps & {
  /** 图标元素 */
  icon?: any;
};

/**
 * 表单项标签属性接口
 * 用于配置表单项的标签显示
 */
export interface FormItemLabelProps {
  /** 是否显示冒号 */
  colon?: boolean;
  /** HTML for属性 */
  htmlFor?: string;
  /** 标签内容 */
  label?: any | string;
  /** 必填标记配置 */
  requiredMark?: RequiredMark;
}

/**
 * 验证状态类型
 * 表示字段的验证结果状态
 */
export type ValidateStatus = "success" | "warning" | "error" | "validating" | "";

/**
 * 文件上传配置接口
 * 用于配置文件上传相关参数
 */
export interface IUploadProps {
  /** 上传组件引用 */
  uploadRef?: any;
  /**
   * 业务场景枚举
   * 用于区分不同的上传场景
   */
  busiScene?: string;
  /**
   * 权限枚举
   * 基于EPermissionEnum的权限控制
   */
  permission?: string;
  /** 文件大小限制，单位MB，默认10MB */
  fileSize?: number;
  /** 接受的文件类型 */
  accept?: string;
  /** 是否支持多文件上传 */
  multiple?: boolean;
}

/**
 * 表单项属性接口
 * 继承标签属性和上传属性，提供完整的表单项配置
 */
export interface FormItemProps extends FormItemLabelProps, IUploadProps {
  /** 样式前缀 */
  prefixCls?: string;
  /** 是否无样式模式 */
  noStyle?: boolean;
  /** 内联样式 */
  style?: any;
  /** CSS类名 */
  className?: string;
  /** 子元素 */
  children?: any;
  /** 元素ID */
  id?: string;
  /** 是否有反馈效果 */
  hasFeedback?: boolean;
  /** 验证状态 */
  validateStatus?: ValidateStatus;
  /** 是否必填 */
  required?: boolean;
  /** 是否隐藏 */
  hidden?: boolean;
  /** 初始值 */
  initialValue?: any;
  /** 消息变量映射 */
  messageVariables?: Record<string, string>;
  /** 工具提示内容 */
  tooltip?: any;
  /** 字段键值 */
  fieldKey?: (string | number | bigint) | (string | number | bigint)[];
  /**
   * 级联选择最少选择层级
   * 如果不设置，则需要选择到最底层
   */
  minLevel?: number;
  /**
   * 点击事件回调
   */
  onPress?: () => void;
  /**
   * 可上传的文件数量限制
   */
  maxNum?: number;
  /** 验证规则数组 */
  rules?: BaseRule[];
  /**
   * 值格式化函数
   * 用于显示时格式化值
   */
  format?: (value: any) => string;
  /**
   * 货币符号
   * 用于金额类型字段
   */
  moneySymbol?: string;
  /**
   * 选项数组
   * 用于选择类型字段
   */
  options?: IOptions<any>[];
  /**
   * 点击事件
   */
  onClick?: () => void;
  /**
   * 禁用
   */
  disabled?: boolean;
  /**
   * 占位
   */
  placeholder?: string;
}
