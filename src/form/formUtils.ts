/**
 * 表单联动工具
 * 提供 JSON 规则校验、依赖配置构建与列分组能力
 */
import { validateRulesItem } from './ruleUtils';
import type { IFormColumns, IJsonRuleListItem } from './types';
import type { IDefSysDefinedAttributes } from './attributes';

/** validateActions 的动作结果 */
export type ActionResult = {
  show: boolean;
  hide: boolean;
  disable: boolean;
  clear: boolean;
};

/**
 * 表单规则校验方法
 * @param rules 规则组 - 包含多个规则项的数组
 * @param data 数据 - 需要校验的表单数据对象
 * @returns 返回符合条件的事件名称数组
 * @deprecated 应该使用 validateActions 方法
 */
export function validateRules(rules: IJsonRuleListItem[], data: Record<string, any>): string[] {
  if (!Array.isArray(rules)) return [];
  const eventList = new Set<string>();
  for (const { all: conditions, event } of rules) {
    if (!Array.isArray(conditions) || conditions.length === 0) continue;
    let result = true;
    let orBuffer = false;
    let inOr = false;
    for (let i = 0; i < conditions.length; i++) {
      const item = conditions[i];
      const valid = validateRulesItem(item, data);
      const nextConnect = conditions[i + 1]?.connect ?? 'and';
      if (item.connect === 'or' || nextConnect === 'or') {
        inOr = true;
        orBuffer || (orBuffer = valid);
      }
      if (nextConnect !== 'or') {
        if (inOr) {
          orBuffer || (orBuffer = valid);
          if (!orBuffer) {
            result = false;
            break;
          }
          orBuffer = false;
          inOr = false;
        } else if (!valid) {
          result = false;
          break;
        }
      }
    }
    if (result) eventList.add(event);
  }
  return [...eventList];
}

/**
 * 表单动作校验方法
 * @param rules 规则组
 * @param data 数据
 */
export function validateActions(rules: IJsonRuleListItem[], data: Record<string, any>): ActionResult {
  const res: ActionResult = {
    show: false,
    hide: false,
    disable: false,
    clear: false
  };
  for (const rule of rules) {
    const allItems = rule.all;
    if (!allItems || allItems.length === 0) continue;
    let groupResult = true;
    for (let j = 0; j < allItems.length; j++) {
      const item = allItems[j];
      const result = validateRulesItem(item, data);
      const nextConnect = allItems[j + 1]?.connect;
      const connect = nextConnect && nextConnect !== 'start' ? nextConnect : 'and';
      if (connect === 'or') {
        groupResult || (groupResult = result);
      } else if (!result) {
        groupResult = false;
        break;
      }
    }
    if (groupResult) {
      // 优先级处理
      if (rule.event === 'hide') {
        res.hide = true;
        res.show = false; // hide 优先于 show
      } else if (rule.event === 'clear') {
        res.clear = true;
      } else if (rule.event === 'disable') {
        res.disable = true;
      } else if (rule.event === 'show') {
        if (!res.hide) res.show = true; // 只有没 hide 才能 show
      }
    }
  }
  return res;
}

/**
 * 初始化自定义属性配置
 * @param configItem 配置项 - 系统定义的属性配置对象，可为 null
 * @param form 表单实例 - Antd Form 实例，用于设置表单字段值
 */
export const initAttributesConfig = (
  configItem: (IDefSysDefinedAttributes & { verRules?: Record<string, any>[] }) | null,
  form: any
) => {
  // 设置默认值
  if (configItem) {
    // 取出对象
    const verRulesObj = configItem.verRules?.[0] || {};
    // 将 verRulesObj 转成 rules_requiredIds 这种格式
    const rules2 = Object.keys(verRulesObj).reduce<Record<string, any>>((pre, cur) => {
      pre[`rules_${cur}`] = verRulesObj[cur];
      return pre;
    }, {});
    form.setFieldsValue({
      ...configItem,
      ...rules2,
      rules_required: rules2.required ? [true] : []
    });
  }
};

/**
 * 自定义属性中的选项发生变化时的处理函数
 * @param newOpt 新选项 - 新的选项数组
 * @param configItem 配置项 - 当前的属性配置对象，可为 null
 * @param setConfigItem 设置配置项函数 - 用于更新配置项的回调函数
 */
export const onAttributesConfigListOptionsChange = (
  newOpt: { label: string; value: any }[],
  configItem: IDefSysDefinedAttributes | null,
  setConfigItem: (item: IDefSysDefinedAttributes) => void
) => {
  if (configItem) {
    const eum: Record<string, any> = {};
    newOpt.forEach((item) => {
      eum[item.value] = item.label;
    });
    configItem.options = {
      value: newOpt,
      eum: eum
    };
    setConfigItem(configItem);
  }
};

function extracted(item: { regexp?: string; value?: string }, value: any) {
  // 判断是否符合校验
  if (item.regexp) {
    return new RegExp(item.regexp).test(String(value));
  }

  // 如果值是数组（如 checkbox），检查数组中是否包含目标值
  if (Array.isArray(value)) {
    return value.some((v) => String(v) === String(item.value));
  }

  // 统一转换为字符串进行比较，避免类型不匹配问题
  return String(value) === String(item.value);
}

/**
 * 根据用户选择的值，生成新的表单配置（改进版）
 * @param value 当前表单的数据
 * @param config 默认的配置
 * @returns 更新后的表单配置
 */
export const buildNewFormItemPropsVer = ({ value }: any, config: IFormColumns): IFormColumns => {
  const newConfig: IFormColumns = { ...config };
  newConfig.request = config.request;

  // 优先处理 ahRules（新的规则系统）
  if (config.ahRules && config.ahRules.length > 0) {
    const actionResult = validateActions(config.ahRules, value || {});

    // 根据 validateActions 的结果设置表单项属性
    // hide 优先级最高
    if (actionResult.hide) {
      newConfig.show = false;
    } else if (actionResult.show) {
      newConfig.show = true;
    }

    // 设置禁用状态
    if (actionResult.disable) {
      newConfig.disabled = true;
    }

    // 处理清空动作
    if (actionResult.clear && newConfig.fieldProps) {
      // 可以在这里添加清空逻辑，比如重置字段值
      newConfig.initialValue = undefined;
    }
    return newConfig;
  }

  // 兼容旧的 dependent 系统
  const dependent = newConfig.dependent || [];

  // 默认隐藏有依赖关系的字段
  newConfig.show = dependent.length === 0;

  // 依赖校验
  for (let i = 0; i < dependent.length; i++) {
    const item = dependent[i];
    const itemValue = value ? value[item.field] : undefined;
    let flag = false;
    console.log('依赖检查:', {
      field: item.field,
      expectedValue: item.value,
      actualValue: itemValue,
      formValues: value
    });

    // 如果 itemValue 是数组，那么就是循环判断，只要有一个符合就行
    if (Array.isArray(itemValue)) {
      flag = itemValue.some((v) => extracted(item, v));
    } else {
      flag = extracted(item, itemValue);
    }

    // 获取所依赖的值符合依赖的正则规则
    if (flag) {
      // 设置显示和隐藏
      newConfig.show = item.show;
      // 如果之前配置没有，那么就设置新的配置
      if (!newConfig.formItemProps) {
        newConfig.formItemProps = {};
      }
      newConfig.formItemProps.rules = [
        {
          required: item.required,
          message: item.message || `${newConfig.title}是必填的`
        }
      ];
      // 找到匹配的依赖条件就退出循环
      break;
    }
  }
  return newConfig;
};

/**
 * 按照 title 类型的列对数据进行分组
 * @param columns 列配置数组
 * @returns 分组后的数据结构数组
 */
export const groupColumnsByTitle = <T extends Record<string, any>>(
  columns: IFormColumns<T>[]
): Array<IFormColumns<T> & { columns: IFormColumns<T>[] }> => {
  const groups: Array<IFormColumns<T> & { columns: IFormColumns<T>[] }> = [];
  let currentGroup: IFormColumns<T>[] = [];
  // title 的配置
  let currentTitleConfig: IFormColumns<T> | undefined;
  columns.forEach((column) => {
    if (column.valueType === 'title') {
      // 如果遇到 title 类型，先保存之前的分组
      if (currentGroup.length > 0) {
        groups.push({ ...currentTitleConfig, columns: currentGroup });
      }
      // 开始新的分组
      currentTitleConfig = column;
      currentGroup = [];
    } else {
      // 普通列加入当前分组
      currentGroup.push(column);
    }
  });

  // 处理最后一个分组
  if (currentGroup.length > 0) {
    groups.push({ ...currentTitleConfig, columns: currentGroup });
  }
  return groups;
};
