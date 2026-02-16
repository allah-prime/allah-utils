/**
 * 数组工具函数
 */

import { IOptions2 } from "../../types/data";

/**
 * 数组工具对象
 */
const arrayUtils = {
  /**
   * 数组去重
   * @param arr 输入数组
   * @returns 去重后的数组
   */
  unique<T>(arr: T[]): T[] {
    return [...new Set(arr)];
  },

  /**
   * 数组分块
   * @param arr 输入数组
   * @param size 每块大小
   * @returns 分块后的二维数组
   */
  chunk<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  },

  /**
   * 数组扁平化
   * @param arr 输入数组
   * @param depth 扁平化深度，默认为 1
   * @returns 扁平化后的数组
   */
  flatten<T>(arr: any[], depth = 1): T[] {
    return depth > 0
      ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? arrayUtils.flatten(val, depth - 1) : val), [])
      : arr.slice();
  },

  /**
   * 数组洗牌
   * @param arr 输入数组
   * @returns 洗牌后的新数组
   */
  shuffle<T>(arr: T[]): T[] {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  },

  /**
   * 数组求交集
   * @param arr1 数组1
   * @param arr2 数组2
   * @returns 交集数组
   */
  intersection<T>(arr1: T[], arr2: T[]): T[] {
    return arr1.filter(item => arr2.includes(item));
  },

  /**
   * 数组求差集
   * @param arr1 数组1
   * @param arr2 数组2
   * @returns 差集数组
   */
  difference<T>(arr1: T[], arr2: T[]): T[] {
    return arr1.filter(item => !arr2.includes(item));
  },

  /**
   * 数组分组
   * @param arr 输入数组
   * @param keyFn 分组键函数
   * @returns 分组后的对象
   */
  groupBy<T, K extends string | number | symbol>(
    arr: T[],
    keyFn: (item: T) => K
  ): Record<K, T[]> {
    return arr.reduce((groups, item) => {
      const key = keyFn(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {} as Record<K, T[]>);
  },


  /**
   * 从optList中筛选出目标对象
   * @param s 需要筛选的目标字符串
   * @param optList 目标数组
   * @param key 数据的下标
   */
  getListId(s: string, optList: IOptions2[], key: string) {
    if (optList.length === 0 || !s) return null;
    const classList: any = optList.filter(item => item.text === s);
    if (classList.length > 0) {
      return classList[0][key];
    }
    return null;
  }
};

export default arrayUtils;