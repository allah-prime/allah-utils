/**
 * 验证规则类型枚举
 * 定义了支持的数据类型验证
 */
export type RuleType =
  | "string" // 字符串
  | "number" // 数字
  | "boolean" // 布尔值
  | "method" // 方法
  | "regexp" // 正则表达式
  | "integer" // 整数
  | "float" // 浮点数
  | "object" // 对象
  | "enum" // 枚举
  | "date" // 日期
  | "url" // URL
  | "hex" // 十六进制
  | "email"; // 邮箱


/**
 * 基础验证规则接口
 * 定义字段验证的各种规则配置
 */
export interface BaseRule {
  /** 是否仅警告，不阻止提交 */
  warningOnly?: boolean;
  /** 枚举值数组 */
  enum?: any[];
  /** 精确长度 */
  len?: number;
  /** 最大值/长度 */
  max?: number;
  /** 错误消息 */
  message?: string | any;
  /** 最小值/长度 */
  min?: number;
  /** 正则表达式模式 */
  pattern?: RegExp;
  /** 是否必填 */
  required?: boolean;
  /** 值转换函数 */
  transform?: (value: any) => any;
  /** 验证类型 */
  type?: RuleType;
  /** 是否检查空白字符 */
  whitespace?: boolean;
  /** 自定义验证触发时机，必须是字段validateTrigger的子集 */
  validateTrigger?: string | string[];
}


/**
 * 验证状态常量数组
 */
declare const ValidateStatuses: [
  "success",
  "warning",
  "error",
  "validating",
  ""
];
