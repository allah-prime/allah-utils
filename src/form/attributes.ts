/**
 * 基本的自定义属性对象
 */
export type IDefSysDefinedAttributes<T = any> = {
  id: string;
  attLabel: string;
  attType: T;
  attTypeText: string;
  description: string;
  weight: number;
  /**
   * 基本的自定义对象对象的默认值
   */
  defaultValue?: any;
  dicGroupKey?: string;
  options?: {
    value: any;
    eum: any;
  };
  /**
   * 数据库中的字段名
   */
  dbKey: string;
  resValue: any;
  showSearch?: boolean;
  /**
   * 表单的额外配置
   */
  fieldProps: Record<string, any>;
};
