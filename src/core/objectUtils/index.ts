/**
 * 对象工具函数
 */

/**
 * 判断是否为对象
 * @param item - 要判断的项
 * @returns 是否为对象
 */
function isObject(item: any): item is Record<string, any> {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * 对象工具对象
 */
const objectUtils = {
  /**
   * 深度克隆对象
   * @param obj - 要克隆的对象
   * @returns 克隆后的对象
   */
  deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime()) as T;
    }

    if (obj instanceof Array) {
      return obj.map(item => objectUtils.deepClone(item)) as T;
    }

    if (typeof obj === 'object') {
      const cloned = {} as T;
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          cloned[key] = objectUtils.deepClone(obj[key]);
        }
      }
      return cloned;
    }

    return obj;
  },

  /**
   * 合并多个对象
   * @param target - 目标对象
   * @param sources - 源对象数组
   * @returns 合并后的对象
   */
  merge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
      for (const key in source) {
        if (isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          objectUtils.merge(target[key] as Record<string, any>, source[key] as Record<string, any>);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return objectUtils.merge(target, ...sources);
  },

  /**
   * 根据路径获取对象属性值
   * @param obj - 目标对象
   * @param path - 属性路径
   * @param defaultValue - 默认值
   * @returns 属性值
   */
  get<T = any>(obj: Record<string, any>, path: string, defaultValue?: T): T {
    const keys = path.split('.');
    let result = obj;

    for (const key of keys) {
      if (result === null || typeof result !== 'object') {
        return defaultValue as T;
      }
      result = result[key];
    }

    return result === undefined ? (defaultValue as T) : (result as T);
  },

  /**
   * 根据路径设置对象属性值
   * @param obj - 目标对象
   * @param path - 属性路径
   * @param value - 要设置的值
   */
  set(obj: Record<string, any>, path: string, value: any): void {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;
  },

  /**
   * 根据路径删除对象属性
   * @param obj - 目标对象
   * @param path - 属性路径
   * @returns 是否删除成功
   */
  unset(obj: Record<string, any>, path: string): boolean {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        return false;
      }
      current = current[key];
    }

    const lastKey = keys[keys.length - 1];
    if (lastKey in current) {
      delete current[lastKey];
      return true;
    }

    return false;
  },

  /**
   * 获取对象的所有路径
   * @param obj - 目标对象
   * @param prefix - 路径前缀
   * @returns 路径数组
   */
  paths(obj: Record<string, any>, prefix = ''): string[] {
    const result: string[] = [];

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const currentPath = prefix ? `${prefix}.${key}` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          result.push(...objectUtils.paths(obj[key], currentPath));
        } else {
          result.push(currentPath);
        }
      }
    }

    return result;
  },

  /**
   * 将数据中的''转换成指定的字符串
   * @param obj - 需要转换的对象
   * @param str - 需要转换的字符串，默认是无
   * @returns 转换后的对象
   */
  buildNullStr<T = any>(obj: any, str = '无'): T {
    const newObj: any = obj;
    Object.keys(obj).forEach((key: string) => {
      if (obj[key] === '') {
        newObj[key] = str;
      }
    });
    return newObj;
  },

  /**
   * 将对象的key变成数字
   * @param obj - 需要转换的对象
   * @returns 转换后的对象
   */
  objToNum(obj: any) {
    const newObj: any = {};
    Object.keys(obj).forEach(key => {
      newObj[Number(key)] = obj[key];
    });
    return newObj;
  },

  /**
   * 给vuex进行刷新的方法
   * @param state - 状态对象
   * @param payload - 载荷数据
   */
  refreshState(state: any, payload: any) {
    Object.keys(payload).forEach(key => {
      if (Array.isArray(payload[key])) {
        // 这里需要引入ArrayUtil，暂时使用简单的克隆
        state[key] = [...payload[key]];
      } else if (typeof payload[key] === 'object') {
        Object.keys(payload[key]).forEach(key2 => {
          state[key][key2] = payload[key][key2];
        });
      } else {
        state[key] = payload[key];
      }
    });
  },

  /**
   * 删除对象里面的时间字段
   * @param obj - 需要处理的对象
   * @param keys - 额外需要删除的字段
   * @returns 处理后的对象
   */
  deleteTime(obj: any, keys: string[] = []) {
    const defKeys = ['createTime', 'updateTime', 'createDate', 'updateDate', ...keys];
    const newObj = { ...obj };
    defKeys.forEach(key => {
      if (newObj[key]) {
        delete newObj[key];
      }
    });
    return newObj;
  },

  /**
   * 枚举转option的函数
   * @param enumObj - 枚举对象
   * @returns 选项数组
   */
  enumToOptions(enumObj: any) {
    const keys = Object.keys(enumObj);
    return keys.map(key => ({
      ...enumObj[key],
      label: enumObj[key].text,
      value: key
    }));
  },

  /**
   * 比较两个对象是否相同
   * @param obj1 - 第一个对象
   * @param obj2 - 第二个对象
   * @returns 是否相同
   */
  isSameObj(obj1: any, obj2: any) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (let i = 0; i < keys1.length; i++) {
      if (obj1[keys1[i]] !== obj2[keys2[i]]) {
        return false;
      }
    }
    return true;
  }
};

export default objectUtils;