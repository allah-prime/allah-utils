import { IOptions, ITreeNode } from "../types";
import { BaseRule } from "./rule";
import { FormItemProps } from "./formItem";

/**
 * JSON规则项配置
 * 用于定义表单字段的动态校验规则
 */
export type IJsonRuleItem = {
  /** 连接符，如 'and'、'or' */
  connect: string;
  /** 字段名称 */
  fact: string;
  /** 操作符，如 '='、'>'、'<'、'!=' 等 */
  operator: string;
  /** 比较值 */
  value: any;
  /**
   * 依赖字段的类型，比如text，select之类的
   * 用于确定如何处理和比较值
   */
  type: any;
};

/**
 * JSON规则列表项
 * 包含一组规则和对应的触发事件
 */
export type IJsonRuleListItem = {
  /**
   * 全部的规则集合
   * 当所有规则都满足时触发对应事件
   */
  all: IJsonRuleItem[];
  /**
   * 对应的事件类型
   * 如 'show'、'hide'、'required'、'disabled' 等
   */
  event: string;
};

/**
 * ProForm实例类型扩展
 * 在原有FormInstance基础上增加格式化相关方法
 * @template T 表单数据类型
 */
export type ProFormInstanceType<T> = {
  /**
   * 获取被 ProForm 格式化后的所有数据
   * @param nameList 是否获取所有数据，包括未被form托管的
   * @param omitNil 是否忽略空值
   * @returns 格式化后的表单数据
   *
   * @example getFieldsFormatValue() // 返回所有数据
   * @example getFieldsFormatValue(true) // 返回所有数据，即使没有被 form 托管的
   */
  getFieldsFormatValue?: (nameList?: true, omitNil?: boolean) => T;

  /**
   * 获取被 ProForm 格式化后的单个数据
   * @param nameList 字段路径数组
   * @returns 格式化后的字段值
   *
   * @example {a:{b:value}} -> getFieldFormatValue(['a', 'b']) -> value
   */
  getFieldFormatValue?: (nameList?: NamePath) => T;

  /**
   * 获取被 ProForm 格式化后的单个数据，包含完整的对象结构
   * @param nameList 字段路径数组
   * @returns 包含完整路径的格式化数据对象
   *
   * @example {a:{b:value}} -> getFieldFormatValueObject(['a','b']) -> {a:{b:value}}
   */
  getFieldFormatValueObject?: (nameList?: NamePath) => T;

  /**
   * 验证字段后返回格式化之后的所有数据
   * @param nameList 需要验证的字段路径数组
   * @returns Promise包装的格式化数据
   *
   * @example validateFieldsReturnFormatValue -> {a:{b:value}}
   */
  validateFieldsReturnFormatValue?: (nameList?: NamePath[]) => Promise<T>;
};

/**
 * ProForm实例类型
 * 结合了原生FormInstance和ProForm扩展功能
 * @template T 表单数据类型，默认为any
 */
export type ProFormInstance<T = any> = FormInstance<T> & ProFormInstanceType<T>;

/**
 * 内部字段数据接口
 * 包含字段值和元数据信息
 */
export interface InternalFieldData extends Meta {
  /** 字段值 */
  value: any;
}

/**
 * 字段数据接口
 * 用于 setFields 配置，不包含name的其他元数据
 */
export interface FieldData extends Partial<Omit<InternalFieldData, "name">> {
  /** 字段路径 */
  name: NamePath;
}

/**
 * 内部字段路径类型
 * 由字符串或数字组成的数组，用于定位嵌套字段
 */
export type InternalNamePath = (string | number)[];

/**
 * 字段元数据接口
 * 包含字段的状态信息
 */
export interface Meta {
  /** 是否已被触摸（用户交互过） */
  touched: boolean;
  /** 是否正在验证中 */
  validating: boolean;
  /** 错误信息数组 */
  errors: string[];
  /** 警告信息数组 */
  warnings: string[];
  /** 字段路径 */
  name: InternalNamePath;
  /** 是否已验证 */
  validated: boolean;
}

/**
 * 字段错误接口
 * 包含字段路径和对应的错误、警告信息
 */
export interface FieldError {
  /** 字段路径 */
  name: InternalNamePath;
  /** 错误信息数组 */
  errors: string[];
  /** 警告信息数组 */
  warnings: string[];
}

/**
 * 过滤函数类型
 * 用于过滤字段元数据
 * @param meta 字段元数据
 * @returns 是否通过过滤
 */
export type FilterFunc = (meta: Meta) => boolean;

/**
 * 字段路径类型
 * 可以是任意类型，通常为字符串、数字或它们的数组
 * @template T 路径类型，默认为any
 */
export type NamePath = any;

/**
 * 验证选项接口
 * 用于配置字段验证行为
 */
export interface ValidateOptions {
  /**
   * 仅验证，不触发UI和字段状态更新
   */
  validateOnly?: boolean;
  /**
   * 递归验证。会验证包含提供路径的所有字段
   * 例如：[['a']] 会验证 ['a']、['a', 'b'] 和 ['a', 1]
   */
  recursive?: boolean;
  /** 仅验证脏字段（已验证或已触摸的字段） */
  dirty?: boolean;
}

/**
 * 获取字段值的配置
 * 用于 getFieldsValue 方法
 */
export type GetFieldsValueConfig = {
  /** 严格模式，是否严格按照字段定义获取值 */
  strict?: boolean;
  /** 过滤函数，用于过滤需要获取的字段 */
  filter?: FilterFunc;
};

/**
 * 验证字段函数类型
 * 支持多种调用方式的字段验证
 * @template Values 表单值类型，默认为any
 */
export type ValidateFields<Values = any> = {
  /** 验证所有字段 */
  (opt?: ValidateOptions): Promise<Values>;
  /** 验证指定字段 */
  (nameList?: NamePath[], opt?: ValidateOptions): Promise<Values>;
};

/**
 * React Hook Form 实例接口
 * 提供表单的核心操作方法
 * @template Values 表单值类型，默认为any
 */
export interface RcFormInstance<Values = any> {
  /** 获取单个字段值 */
  getFieldValue: (name: NamePath) => any;
  /** 获取多个字段值，支持多种调用方式 */
  getFieldsValue: (() => Values) &
    ((nameList: NamePath[] | true, filterFunc?: FilterFunc) => any) &
    ((config: GetFieldsValueConfig) => any);
  /** 获取字段错误信息 */
  getFieldError: (name: NamePath) => string[];
  /** 获取多个字段错误信息 */
  getFieldsError: (nameList?: NamePath[]) => FieldError[];
  /** 获取字段警告信息 */
  getFieldWarning: (name: NamePath) => string[];
  /** 检查字段是否被触摸 */
  isFieldsTouched: ((
    nameList?: NamePath[],
    allFieldsTouched?: boolean
  ) => boolean) &
    ((allFieldsTouched?: boolean) => boolean);
  /** 检查单个字段是否被触摸 */
  isFieldTouched: (name: NamePath) => boolean;
  /** 检查字段是否正在验证 */
  isFieldValidating: (name: NamePath) => boolean;
  /** 检查多个字段是否正在验证 */
  isFieldsValidating: (nameList?: NamePath[]) => boolean;
  /** 重置字段值 */
  resetFields: (fields?: NamePath[]) => void;
  /** 设置字段数据 */
  setFields: (fields: FieldData[]) => void;
  /** 设置单个字段值 */
  setFieldValue: (name: NamePath, value: any) => void;
  /** 设置多个字段值 */
  setFieldsValue: (values: any) => void;
  /** 验证字段 */
  validateFields: ValidateFields<Values>;
  /** 提交表单 */
  submit: () => void;
}

/**
 * 表单实例接口
 * 在RcFormInstance基础上增加滚动和获取字段实例功能
 * @template Values 表单值类型，默认为any
 */
export interface FormInstance<Values = any> extends RcFormInstance<Values> {
  /** 滚动到指定字段 */
  scrollToField: (name: NamePath, options?: ScrollOptions) => void;
  /** 获取字段实例 */
  getFieldInstance: (name: NamePath) => any;
}

/**
 * 以上类型定义从 antdForm.d.ts 迁移而来
 * 提供了完整的表单实例和字段管理功能
 */

/**
 * 尺寸类型
 * 定义组件的大小规格
 */
export type ISizeType = "small" | "middle" | "large" | undefined;

/**
 * 表单字段类型
 * 定义特殊的表单字段类型
 */
export declare type FormFieldType =
  | "group"
  | "formList"
  | "formSet"
  | "divider"
  | "dependency";

/**
 * ProField值类型与字段属性映射
 * 定义了各种字段类型对应的属性配置
 */
export interface ProFieldValueTypeWithFieldProps {
  /** 文本类型 */
  text: Record<string, any>;
  /** 密码类型 */
  password: Record<string, any>;
  /** 金额类型 */
  money: Record<string, any>;
  /** 索引类型 */
  index: Record<string, any>;
  /** 带边框索引类型 */
  indexBorder: Record<string, any>;
  /** 选项类型 */
  option: Record<string, any>;
  /** 文本域类型 */
  textarea: Record<string, any>;
  /** 日期类型 */
  date: Record<string, any>;
  /** 周选择类型 */
  dateWeek: Record<string, any>;
  /** 月份选择类型 */
  dateMonth: Record<string, any>;
  /** 季度选择类型 */
  dateQuarter: Record<string, any>;
  /** 年份选择类型 */
  dateYear: Record<string, any>;
  /** 日期时间类型 */
  dateTime: Record<string, any>;
  /** 相对时间类型 */
  fromNow: Record<string, any>;
  /** 日期范围类型 */
  dateRange: Record<string, any>;
  /** 日期时间范围类型 */
  dateTimeRange: Record<string, any>;
  /** 时间类型 */
  time: Record<string, any>;
  /** 时间范围类型 */
  timeRange: Record<string, any>;
  /** 选择器类型 */
  select: Record<string, any>;
  /** 复选框类型 */
  checkbox: Record<string, any>;
  /** 评分类型 */
  rate: Record<string, any>;
  /** 滑块类型 */
  slider: Record<string, any>;
  /** 单选框类型 */
  radio: Record<string, any>;
  /** 单选按钮类型 */
  radioButton: Record<string, any>;
  /** 进度条类型 */
  progress: Record<string, any>;
  /** 百分比类型 */
  percent: Record<string, any>;
  /** 数字类型 */
  digit: Record<string, any>;
  /** 数字范围类型 */
  digitRange: Record<string, any>;
  /** 秒数类型 */
  second: Record<string, any>;
  /** 代码类型 */
  code: Record<string, any>;
  /** JSON代码类型 */
  jsonCode: Record<string, any>;
  /** 头像类型 */
  avatar: Record<string, any>;
  /** 开关类型 */
  switch: Record<string, any>;
  /** 图片类型 */
  image: Record<string, any>;
  /** 级联选择类型 */
  cascader: Record<string, any>;
  /** 树选择类型 */
  treeSelect: Record<string, any>;
  /** 颜色选择类型 */
  color: Record<string, any> & {
    /** 当前颜色值 */
    value?: string;
    /** 弹出框属性 */
    popoverProps?: any;
    /** 模式：只读或编辑 */
    mode?: "read" | "edit";
    /** 颜色变化回调 */
    onChange?: (color: string) => void;
    /** 预设颜色数组 */
    colors?: string[];
  };
}

/**
 * 基础表单项属性接口
 * 定义了表单项的通用配置
 * @template T 值类型，默认为any
 */
export interface IAhFormItemProps<T = any> {
  /** 当前值 */
  value?: T;
  /** 值变化回调 */
  onChange?: (v: T) => void;
  /** 标签文本 */
  label?: string | any;
  /** 标题文本 */
  title?: string;
  /** 右侧DOM元素 */
  rightDom?: any;
  /** 左侧DOM元素 */
  leftDom?: any;
  /**
   * 是否显示分隔线
   * @default false
   */
  showDivider?: boolean;
  /**
   * 请求远程数据的函数
   * 可以返回枚举对象、树节点数组或选项数组
   */
  request?: (
    v?: any
  ) =>
    | Promise<ProSchemaValueEnumObj>
    | Promise<ITreeNode[] | Promise<IOptions<any>[]>>;
  /**
   * 值枚举配置
   * 支持 object 和 Map，Map 支持其他基础类型作为 key
   */
  valueEnum?: ProSchemaValueEnumObj;
  /**
   * 布局方式
   * @default 'horizontal'
   */
  layout?: "horizontal" | "vertical";
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * 是否是详情模式
   */
  details?: boolean;
  /**
   * 占位符文本
   */
  placeholder?: string;
  /** 是否必填 */
  required?: boolean;
  /**
   * 自定义字典 - 配置这个组件会自动调用 DicUtilService.opt7ListByKey 来获取数据
   * 需要配合 request 使用
   */
  dicGroupMap?: string;
}

/**
 * ProField值类型
 * 从ProFieldValueTypeWithFieldProps中提取的键名
 */
export type ProFieldValueType = keyof ProFieldValueTypeWithFieldProps;

/**
 * 值类型联合
 * 包含ProField类型和自定义扩展类型
 */
export type IValueType =
  | ProFieldValueType
  | "group"
  | "reference"
  | "array"
  | "string"
  | "customRender"
  | "formList"
  | "formSet"
  | "stepper"
  | "divider"
  | "dependency"
  | "cascader"
  | "boolean"
  | "button"
  | "money"
  | "text"
  | "title"
  | "datetime";

/**
 * ProSchema值枚举类型配置
 * 用于配置选项的显示和行为
 */
export declare type ProSchemaValueEnumType = {
  /** 唯一键值 */
  key?: string;
  /** 显示标签 */
  label?: string;
  /** 选项值 */
  value: string | number;
  /** 显示文本 */
  text: string;
  /**
   * 预定义状态颜色
   * 如 'success'、'error'、'warning' 等
   */
  status?: string;
  /**
   * 自定义颜色值
   * 支持十六进制、RGB等格式
   */
  color?: string;
  /**
   * 是否禁用该选项
   * @default false
   */
  disabled?: boolean;
};

/**
 * ProSchema值枚举对象类型
 * 支持 Map 和 Object 两种数据结构
 */
export declare type ProSchemaValueEnumObj = Record<
  string,
  | ProSchemaValueEnumType
  | (Omit<IOptions<any>, "text"> & {
      /** 显示文本 */
      text: string;
    })
>;

/**
 * ProSchema值枚举Map类型
 * 支持 Map 数据结构，键可以是多种基础类型
 */
export declare type ProSchemaValueEnumMap = Map<
  string | number | bigint,
  ProSchemaValueEnumType
>;

/**
 * 依赖关系配置接口
 * 用于配置字段间的依赖逻辑
 */
export interface IDependent {
  /** 依赖的字段名 */
  field: string;
  /**
   * 校验正则表达式
   * 用于匹配依赖字段的值
   */
  regexp?: string;
  /**
   * 依赖的具体值
   */
  value?: string;
  /** 是否显示当前字段 */
  show: boolean;
  /** 是否设为必填 */
  required: boolean;
  /**
   * 提示信息
   * 当依赖条件不满足时显示
   */
  message?: string;
}

/**
 * 表单列配置接口
 * 定义表单列的完整配置选项
 * @template Entity 实体类型，默认为Record<string, any>
 */
export interface IAhFormColumns<Entity = Record<string, any>> {
  /**
   * 列的唯一标识符
   * 一般用于 dataIndex 重复的情况
   */
  key?: string | number | bigint;

  /**
   * 与实体映射的键值
   * 数组会被转化为嵌套访问，如 [a,b] => Entity.a.b
   */
  dataIndex?: (string | number | bigint) | (string | number | bigint)[];

  /**
   * 字段依赖关系配置
   * 用于实现字段间的联动效果
   */
  dependent?: IDependent[];

  /**
   * 数据的渲染方式
   * 支持内置类型和自定义valueType
   */
  valueType?: IValueType;

  /**
   * 标题内容
   * 在表单中作为字段标签显示
   */
  title: any | string;

  /**
   * 工具提示内容
   * 会在 title 旁边展示一个图标，鼠标悬停时显示提示
   */
  tooltip?: string;

  /**
   * 值枚举配置
   * 支持函数、对象和Map三种形式
   */
  valueEnum?:
    | ((row: Entity) => ProSchemaValueEnumObj | ProSchemaValueEnumMap)
    | ProSchemaValueEnumObj
    | ProSchemaValueEnumMap;

  /** 表单项属性配置 */
  formItemProps?: FormItemProps & {
    usage?: string;
  };

  /** 子列配置，用于嵌套表单结构 */
  columns?: IAhFormColumns<Entity>[];

  /** 字段初始值 */
  initialValue?: any;

  /**
   * 请求远程数据的函数
   * 用于动态获取选项数据
   */
  request?: IAhFormItemProps["request"];

  /**
   * 是否禁用字段
   * @default false
   */
  disabled?: boolean;

  /**
   * 是否显示字段
   * @default true
   */
  show?: boolean;

  /**
   * 布局方式
   * @default 'horizontal'
   */
  layout?: "horizontal" | "vertical";

  /**
   * 是否显示分隔线
   * @default false
   */
  showDivider?: boolean;

  /**
   * 选项数组
   * 用于选择类型字段的静态选项
   */
  options?: IOptions<any>[];

  /**
   * 字段属性配置
   * 传递给 Form.Item 的属性
   */
  fieldProps?: FormItemProps;

  /**
   * 验证规则配置
   */
  rules?: BaseRule[];

  /**
   * 校验规则 - 最后转成form的rules格式
   */
  verRules?: {
    required?: boolean;
    pattern?: string;
    max?: number;
    min?: number;
    type?: string;
  };

  /**
   * 值变化事件回调
   * @param v 新的字段值
   */
  onChange?: (v: any) => void;

  /**
   * 搜索模式配置
   * - local: 强制使用本地搜索，即使有 request 函数
   * - remote: 强制使用远程搜索，需要配合 request 函数
   * - auto: 自动判断，有 request 时使用远程搜索，否则使用本地搜索
   * @default 'auto'
   */
  searchMode?: "local" | "remote" | "auto";

  /**
   * 自定义渲染函数
   * 用于完全自定义字段的显示和交互
   * @param value 字段值
   * @param record 当前记录数据
   * @param index 索引
   * @param form 表单实例
   * @param extra 额外信息，包含类型（读取或写入）
   * @returns 渲染结果
   */
  render?: (
    value: unknown,
    record: Entity,
    index: number,
    form: FormInstance,
    extra: {
      /** 渲染类型：读取模式或编辑模式 */
      type: "read" | "write";
    }
  ) => any;

  /**
   * 业务场景标识
   * 用于区分不同的业务场景，如用户头像可能有注册、评论、订单等不同场景
   */
  busiScene?: string;

  /**
   * 自定义渲染函数 - 前端代码预设一些函数的名字，然后可以通过这个字段来调用
   */
  renderFunKey?: string;
  /**
   * 自定义字典 - 配置这个组件会自动调用 DicUtilService.opt7ListByKey 来获取数据
   * 需要配合 request 使用
   */
  dicGroupMap?: string;
}

/**
 * 表单列接口
 * IAhFormColumns的别名，提供更简洁的命名
 * @template T 实体类型，默认为any
 */
export interface IFormColumns<T = any> extends IAhFormColumns<T> {}

/**
 * 级联选择器属性接口
 * 继承基础表单项属性，专门用于级联选择组件
 */
export type IAhCascaderProps = IAhFormItemProps<string> & {
  /**
   * 选择模式
   * - multiple: 多选模式
   * - tags: 标签模式
   */
  mode?: "multiple" | "tags";

  /**
   * 是否在每级菜单选择时都触发变化
   * 仅在单选时生效，具体行为参考 Ant Design Cascader 组件文档
   * @default false
   */
  changeOnSelect?: boolean;

  /**
   * 值变化回调
   * @param value 选中的值数组
   */
  onChange?: (value: string[]) => void;

  /**
   * 当前选中值
   */
  value?: string[];

  /**
   * 请求远程数据函数
   * 返回树形结构的选项数据
   * @param v 查询参数
   * @returns Promise包装的树节点数组
   */
  request?: (v?: any) => Promise<ITreeNode[]>;
};

/**
 * 枚举对象联合类型
 * 支持多种枚举数据结构
 */
export type IEnumObjAll =
  | ProSchemaValueEnumMap
  | ProSchemaValueEnumObj
  | Record<
      string,
      IOptions<any> & {
        /** 显示文本 */
        text: string;
      }
    >;

/**
 * 标准枚举对象类型
 * 基于IOptions扩展的枚举配置
 */
export type IEnumObj = Record<
  string,
  IOptions<any> & {
    /** 显示文本 */
    text: string;
  }
>;
