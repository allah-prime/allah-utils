/**
 * 表单 JSON 联动规则工具
 * 提供 show/hide/required 等事件的规则比较与校验能力
 */
import type { IJsonRuleItem } from './types';

export const showPicker: string[] = ['date', 'dateYear', 'dateTime', 'datetime', 'dateRange'];

const selectRuleOptions: { label: string; value: string }[] = [
  { label: '等于', value: 'eq' },
  { label: '不等于', value: 'neq' },
  { label: '包含', value: 'in' },
  { label: '不包含', value: 'nin' }
];

const digitOptions: { label: string; value: string }[] = [
  { label: '等于', value: 'eq' },
  { label: '不等于', value: 'neq' },
  { label: '大于', value: 'gt' },
  { label: '大于等于', value: 'gte' },
  { label: '小于', value: 'lt' },
  { label: '小于等于', value: 'lte' }
];

const switchOptions: { label: string; value: string }[] = [
  { label: '等于', value: 'eq' },
  { label: '不等于', value: 'neq' }
];

const formRuleObj: Record<string, { label: string; value: string }[]> = {
  checkbox: selectRuleOptions,
  select: selectRuleOptions,
  radio: selectRuleOptions,
  text: selectRuleOptions,
  textarea: selectRuleOptions,
  digit: digitOptions,
  date: digitOptions,
  dateYear: digitOptions,
  switch: switchOptions,
  customRender: selectRuleOptions
};

export type IFormRuleObjKey = keyof typeof formRuleObj;

/** 年份的类型 */
export const useYearTypeList: string[] = ['date', 'dateYear'];

/**
 * 通用比较操作符处理函数
 * @param operator 操作符 - 比较操作类型
 * @param actualValue 实际值 - 需要比较的值
 * @param expectedValue 期望值 - 用于比较的目标值
 * @returns 返回比较结果，true表示符合条件，false表示不符合
 */
const executeComparison = (operator: string, actualValue: any, expectedValue: any): boolean => {
  switch (operator) {
    case 'eq':
      return actualValue === expectedValue;
    case 'neq':
      return actualValue !== expectedValue;
    case 'gt':
      return actualValue > expectedValue;
    case 'gte':
      return actualValue >= expectedValue;
    case 'lt':
      return actualValue < expectedValue;
    case 'lte':
      return actualValue <= expectedValue;
    default:
      return false;
  }
};

/**
 * 对数字类型字段的校验
 * @returns 返回校验结果，true表示通过，false表示不通过
 */
const validateRulesDigit = (item: IJsonRuleItem, value: any): boolean => {
  return executeComparison(item.operator, value, item.value);
};

/**
 * 对年份进行比较校验
 * @param value 需要校验的日期值，会提取年份进行比较
 * @returns 返回校验结果，true表示通过，false表示不通过
 */
const validateRulesDateYear = (item: IJsonRuleItem, value: any): boolean => {
  const actualYear = new Date(value).getFullYear();
  const expectedYear = new Date(item.value).getFullYear();
  return executeComparison(item.operator, actualYear, expectedYear);
};

/**
 * 对日期进行比较校验
 * @param value 需要校验的日期值，会转换为时间戳进行比较
 * @returns 返回校验结果，true表示通过，false表示不通过
 */
const validateRulesDate = (item: IJsonRuleItem, value: any): boolean => {
  const actualDate = new Date(value).getTime();
  const expectedDate = new Date(item.value).getTime();
  return executeComparison(item.operator, actualDate, expectedDate);
};

/**
 * 对开关类型字段的校验
 * @returns 返回校验结果，true表示通过，false表示不通过
 */
const validateRulesSwitch = (item: IJsonRuleItem, value: any): boolean => {
  return executeComparison(item.operator, value, item.value);
};

/**
 * 对文本类型字段（text、textarea）的校验
 * @returns 返回校验结果，true表示通过，false表示不通过
 */
const validateRulesText = (item: IJsonRuleItem, value: any): boolean => {
  // 将值转换为字符串进行比较
  const stringValue = String(value);
  const stringItemValue = String(item.value);
  switch (item.operator) {
    case 'eq':
      return stringItemValue === stringValue;
    case 'neq':
      return stringItemValue !== stringValue;
    case 'in':
      return stringItemValue.includes(stringValue);
    case 'nin':
      return !stringItemValue.includes(stringValue);
  }
  return false;
};

/**
 * 对自定义渲染类型字段的校验（使用正则表达式）
 * @param item 规则项，value 为正则表达式字符串
 * @returns 返回校验结果，true表示通过，false表示不通过
 */
const validateRulesCustomRender = (item: IJsonRuleItem, value: any): boolean => {
  if (!value && value !== 0 && value !== false) {
    return false;
  }
  const stringValue = String(value);
  const regexPattern = String(item.value);
  try {
    const regex = new RegExp(regexPattern);
    switch (item.operator) {
      case 'eq':
        return regex.test(stringValue);
      case 'neq':
        return !regex.test(stringValue);
      case 'in':
        return regex.test(stringValue);
      case 'nin':
        return !regex.test(stringValue);
    }
  } catch (e) {
    console.error('正则表达式错误', regexPattern, e);
    return false;
  }
  return false;
};

/**
 * 对选择类型字段（select、checkbox、radio）的校验
 * @param value 需要校验的选项值数组，默认为空数组
 * @returns 返回校验结果，true表示通过，false表示不通过
 */
const validateRulesOptions = (item: IJsonRuleItem, value: any[] = []): boolean => {
  if (value.length === 0) {
    return false;
  }
  let newValue: any[] = value;
  if (!Array.isArray(newValue)) {
    newValue = [{ value: newValue, label: newValue }];
  }
  // 如果是对象数组就要取出 value 组成一个新的数组
  if (newValue[0].value) {
    newValue = newValue.map((v: any) => v.value);
  }

  // 将所有值转换为字符串进行比较
  const stringNewValue = newValue.map((v: any) => String(v));
  const stringItemValue = (item.value as any[]).map((v: any) => String(v));
  switch (item.operator) {
    case 'eq':
      return stringItemValue.every((v) => stringNewValue.includes(v));
    case 'neq':
      return stringItemValue.some((v) => !stringNewValue.includes(v));
    case 'in':
      return stringItemValue.some((v) => stringNewValue.includes(v));
    case 'nin':
      return stringItemValue.every((v) => !stringNewValue.includes(v));
  }
  return false;
};

/**
 * 校验单个规则项
 * @param item 规则项 - 包含校验条件的规则对象
 * @param data 数据 - 需要校验的表单数据对象
 * @returns 返回校验结果，true表示通过，false表示不通过
 */
const validateRulesItem = (item: IJsonRuleItem, data: any): boolean => {
  // 被校验的数据
  const value = data?.[item.fact];
  if (!item.type) {
    console.error('规则配置错误，缺少 type 字段', item);
  }
  switch (item.type) {
    case 'select':
      return validateRulesOptions(item, value);
    case 'checkbox':
      return validateRulesOptions(item, value);
    case 'radio':
      return validateRulesOptions(item, value);
    case 'text':
      return validateRulesText(item, value);
    case 'textarea':
      return validateRulesText(item, value);
    case 'customRender':
      return validateRulesCustomRender(item, value);
    case 'digit':
      return validateRulesDigit(item, value);
    case 'date':
      return validateRulesDate(item, value);
    case 'dateYear':
      return validateRulesDateYear(item, value);
    case 'switch':
      return validateRulesSwitch(item, value);
  }
  return false;
};

export { validateRulesItem };
