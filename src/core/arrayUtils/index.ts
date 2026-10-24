import { IEnumObj } from "../../form";
import { IOptions, IOptions2, ITreeNode } from "../../types/data";

/**
 * 列表变化的数据
 */
export interface IListChangeVo {
  /**
   * 需要新增的数据
   */
  insertList: string[];

  /**
   * 需要删除的数据
   */
  deleteList: string[];

  /**
   * 没有变的数据
   */
  noChangeList: string[];
}

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
  },

  /**
   * 根据指定的字段进行去重
   * @param arr 数组
   * @param key 去重字段
   */
  uniqueBy: (arr: any[], key: string) => {
    const keys: string[] = [];
    const newArr: any[] = [];
    for (let i = 0; i < arr.length; i++) {
      if (keys.includes(arr[i][key])) {
        continue;
      }
      keys.push(arr[i][key]);
      newArr.push(arr[i]);
    }
    return newArr;
  },

    /**
   * 更新数组,若item已存在则将其从数组中删除,若不存在则将其添加到数组
   * **/
  updateArray: <T = any>(array: T[], item: T) => {
    for (let i = 0, len = array.length; i < len; i++) {
      const temp = array[i];
      if (item === temp) {
        array.splice(i, 1);
        return;
      }
    }
    array.push(item);
  },

  /**
   * 将数组中指定元素移除
   * @param array
   * @param item 要移除的item
   * @param id 要对比的属性，缺省则比较地址
   * @returns {*}
   */
  remove: (array: any[], item: any, id: any) => {
    if (!array) return;
    for (let i = 0, l = array.length; i < l; i++) {
      const val = array[i];
      if (item === val || (val && val[id] && val[id] === item[id])) {
        array.splice(i, 1);
      }
    }
    return array;
  },

  /**
   * 判断两个数组的是否相等
   * @return boolean true 数组长度相等且对应元素相等
   * */
  isEqual: (arr1?: any[], arr2?: any[]) => {
    if (!(arr1 && arr2)) return false;
    if (arr1.length !== arr2.length) return false;
    // 对数组进行排序
    arr1.sort();
    arr2.sort();
    //转成字符串进行比较
    return arr1.toString() === arr2.toString();
  },

  /**
   * clone 数组
   * @return Array 新的数组
   * */
  clone: (from: any[]) => {
    if (!from) return [];
    const newArray = [];
    for (let i = 0, l = from.length; i < l; i++) {
      newArray[i] = from[i];
    }
    return newArray;
  },

  /**
   *获取两个数组的差集
   * @param arr1
   * @param arr2
   */
  subSet: (arr1: any[], arr2: any[]) => {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    const subset = [];
    for (const item of set1) {
      if (!set2.has(item)) {
        subset.push(item);
      }
    }
    return subset;
  },

  /**
   * 获取数组中符合要求的项目
   * @param itemList 条目数组
   * @param v 比较值
   * @param k 比较的字段
   */
  getItemByKey: <T = any>(itemList: T[], v: any, k: string = 'id'): T => {
    let item: T = {} as T;
    for (let i = 0; i < itemList.length; i++) {
      if ((itemList[i] as any)[k] === v) {
        item = itemList[i];
        break;
      }
    }
    return item;
  },

  /**
   * 树形数据降维
   */
  dimTreeReduction: (treeData: ITreeNode[], nodeKeys: string[], nodes: ITreeNode[]) => {
    if (!Array.isArray(treeData)) return;
    treeData.forEach(item => {
      nodeKeys.push(item.key);
      nodes.push(item);
      if (Array.isArray(item.children)) {
        arrayUtils.dimTreeReduction(item.children, nodeKeys, nodes);
      }
    });
  },

  /**
   * 树形数据降维 - 返回一个完整的数组
   */
  dimTreeReduction2: (
    treeData: ITreeNode[]
  ): {
    nodes: ITreeNode[];
    nodeKeys: string[];
  } => {
    const nodeKeys: string[] = [];
    const nodes: ITreeNode[] = [];
    arrayUtils.dimTreeReduction(treeData, nodeKeys, nodes);
    return {
      nodes,
      nodeKeys
    };
  },

  /**
   * 移除父节点
   */
  removePNode: (nodeList: any[]) => {
    // 收集全部的父亲
    const pList = nodeList.map(item => item.data.pCode);
    // 如果我的父亲在里面，我就不需要存在了
    const newNode: any[] = [];
    nodeList.forEach(item => {
      if (pList.indexOf(item.data.code) != -1) {
        newNode.push(item);
      }
    });
    return newNode;
  },

  /**
   * 数组转枚举
   */
  toEnum: (arr: IOptions<string>[]): IEnumObj => {
    const enumObj: Record<string, any> = {};
    arr.forEach(item => {
      enumObj[item.value] = {
        text: item.label,
        disabled: item.disabled,
        ...item
      };
    });
    return enumObj;
  },

  /**
   * 把对象里面指定的属性转换成数组
   * @param obj 原始数据
   * @param keys 哪些字段要转换
   */
  toArrayByKeys: (obj: Record<string, any>, keys: string[]) => {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      // 如果是字符串就进行处理
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].split(';').filter((item: string) => item);
      } else if (!obj[key]) {
        // 如果这个数据不存在，就设置为空数组
        obj[key] = [];
      }
    }
  },

  /**
   * 把对象里面指定的属性转换成数字数组
   * @param obj 原始数据
   * @param keys 哪些字段要转换
   */
  toNumArrayByKeys: (obj: Record<string, any>, keys: string[]) => {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      // 如果是字符串就进行处理
      if (typeof obj[key] === 'string') {
        const split: string[] = obj[key].split(';');
        const newArr: number[] = [];
        for (let j = 0; j < split.length; j++) {
          if (split[j]) {
            newArr.push(Number(split[j]));
          }
        }
        obj[key] = newArr;
      } else if (!obj[key]) {
        // 如果这个数据不存在，就设置为空数组
        obj[key] = [];
      }
    }
  },

  /**
   * 把对象里面指定的属性转换成字符串
   * @param obj 原始数据
   * @param keys 哪些字段要转换
   * @param str 分隔符
   * @param joinAll 是否前后都加
   */
  toStringByKeys: (
    obj: Record<string, any>,
    keys: string[],
    str: string = ';',
    joinAll = false
  ) => {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      // 如果是字符串就进行处理
      if (Array.isArray(obj[key])) {
        obj[key] = obj[key].join(str);
      }
      //如果end为true，最后一个加分号
      if (joinAll) {
        obj[key] = str + obj[key] + str;
      }
    }
  },

  /**
   * 把对象里面指定的属性转换成字符串 - 这个方法会在前后都补充对应的符号
   * <p>
   * ["a", "b"] => ";a;b;c;"
   * @param obj 原始数据
   * @param keys 哪些字段要转换
   */
  joinAll: (obj: Record<string, any>, keys: string[]) => {
    arrayUtils.toStringByKeys(obj, keys, ';', true);
  },

  /**
   * 把对象里面指定的属性转换成字符串
   * <p>
   * ["a", "b"] => "a;b;c"
   * @param obj 原始数据
   * @param keys 哪些字段要转换
   */
  join: (obj: Record<string, any>, keys: string[]) => {
    arrayUtils.toStringByKeys(obj, keys);
  },

  /**
   * 查找出两个数组中需要删除的，需要更新的，没有变化的
   */
  findChangeData: (oldData: string[], newData: string[], key: string): IListChangeVo => {
    const deleteSet = new Set<string>();
    const insertSet = new Set<string>();
    const noChangeSet = new Set<string>();
    // 遍历旧的数据，如果新的数据中没有，就是需要删除的
    oldData.forEach(item => {
      if (newData.includes(item)) {
        noChangeSet.add(item);
      } else {
        deleteSet.add(item);
      }
    });
    // 遍历新的数据，如果旧的数据中没有，就是需要新增的
    newData.forEach(item => {
      if (oldData.includes(item)) {
        noChangeSet.add(item);
      } else {
        insertSet.add(item);
      }
    });
    return {
      insertList: Array.from(insertSet),
      deleteList: Array.from(deleteSet),
      noChangeList: Array.from(noChangeSet)
    };
  },
  /**
   * 将字符串或者数组转成数组
   * @param str 字符串或者数组
   * @param splitStr 分隔符
   */
  toArray: (str: string | string[] | undefined | null, splitStr = ';') => {
    if (str === null || str === undefined) {
      return null;
    }
    let strList: string[];
    if (Array.isArray(str)) {
      strList = str;
    } else {
      // 字符串的情况
      if (str.startsWith(splitStr)) {
        str = str.substring(1, str.length);
      }
      strList = str.split(splitStr);
    }
    return strList;
  },

  /**
   * 判断对象里面的数组是否发生了变化
   * <br />
   * 一般来说，用在资源关联里面，比如判断下现在新的资源和旧的资源是否有变化，如果没有变化，就不需要重新请求接口
   */
  isChangeArray: (oldObj: Record<string, any[]>, newObj: Record<string, any[]>): boolean => {
    const keys = Object.keys(oldObj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      // 比较事项是否有变化
      const b = arrayUtils.isEqual(oldObj[key], newObj[key]);
      if (!b) {
        return true;
      }
    }
    return false;
  },

  /**
   * 数组移动位置
   * @param array 数组
   * @param from 从哪个位置
   * @param to 移动到哪个位置
   */
  arrayMove<T>(array: T[], from: number, to: number): T[] {
    const newArray = array.slice();
    newArray.splice(to < 0 ? newArray.length + to : to, 0, newArray.splice(from, 1)[0]);
    return newArray;
  }
};

export default arrayUtils;