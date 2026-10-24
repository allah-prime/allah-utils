import { Change, diffArrays, diffChars } from 'diff';
import arrayUtils from '../arrayUtils';

export default class DiffUtils {
  /**
   * 生成对象对数据
   * @param oldObj 旧的对象
   * @param newObj 新的对象
   */
  static buildDiffObj = (oldObj: any, newObj: any): any => {
    const diffObj: any = {};
    const keys = Object.keys(newObj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      // 如果两个相等
      if (oldObj[key] === newObj[key]) {
        continue;
      }
      // 都是null
      if (oldObj[key] === null && newObj[key] === null) {
        continue;
      }
      // 都是undefined
      if (oldObj[key] === undefined && newObj[key] === undefined) {
        continue;
      }
      if (typeof oldObj[key] === 'string') {
        // 如果是空字符串和null或者undefined
        if (oldObj[key] === '' && (newObj[key] === null || newObj[key] === undefined)) {
          continue;
        }
        diffObj[key] = diffChars(oldObj[key], newObj[key] || '');
      } else if (typeof newObj[key] === 'number') {
        diffObj[key] = [
          {
            count: 1,
            removed: true,
            value: oldObj[key]
          },
          {
            count: 1,
            added: true,
            value: newObj[key]
          }
        ];
      } else if (
        (oldObj[key] === undefined || oldObj[key] === null) &&
        typeof newObj[key] === 'string'
      ) {
        diffObj[key] = diffChars('', newObj[key]);
      } else if (Array.isArray(oldObj[key]) || Array.isArray(newObj[key])) {
        // 比较两个数组是否相同
        const b = arrayUtils.isEqual(oldObj[key], newObj[key]);
        if (b) {
          continue;
        }
        if (!oldObj?.[key]) {
          oldObj[key] = [];
        }
        if (typeof oldObj[key][0] === 'string' || typeof newObj[key][0] === 'string') {
          diffObj[key] = this.buildDiffArray(oldObj[key], newObj[key]);
        } else {
          // 智能对比对象数组：基于唯一标识字段判断新增、删除、修改
          diffObj[key] = this.buildDiffObjectArray(oldObj[key], newObj[key]);
        }
      }
    }
    return diffObj;
  };

  /**
   * 构建全是添加的数据
   * @param obj 操作的对象
   */
  static buildNewDiffObj = (obj: any): any => {
    const changeDate: any = {};
    Object.keys(obj).forEach(key => {
      if (Array.isArray(obj[key])) {
        changeDate[key] = {
          added: obj[key],
          removed: [],
          noed: []
        };
      } else {
        changeDate[key] = [
          {
            count: 1,
            added: true,
            value: obj[key]
          }
        ];
      }
    });
    return changeDate;
  };

  static buildDiffArray = (
    oldArray: any[],
    newArray: any[]
  ): {
    added: any[];
    removed: any[];
    noed: any[];
    change: boolean;
  } => {
    const diffList = diffArrays(oldArray, newArray);
    const diffObj: {
      added: any[];
      removed: any[];
      noed: any[];
      change: boolean;
    } = {
      added: [],
      removed: [],
      noed: [],
      change: false
    };
    diffList.forEach((item: any) => {
      if (item.added) {
        if (Array.isArray(item.value)) {
          diffObj.added.push(...item.value);
        } else {
          diffObj.added.push(item.value);
        }
      } else if (item.removed) {
        diffObj.change = true;
        if (Array.isArray(item.value)) {
          diffObj.removed.push(...item.value);
        } else {
          diffObj.removed.push(item.value);
        }
      } else {
        diffObj.change = true;
        if (Array.isArray(item.value)) {
          diffObj.noed.push(...item.value);
        } else {
          diffObj.noed.push(item.value);
        }
      }
    });
    return diffObj;
  };
  /**
   * 比较对象数组，基于唯一标识字段判断新增、删除、无变化，，老的会存在同一组数据被误判为"删除+新增"
   * @param oldArray 旧的对象数组
   * @param newArray 新的对象数组
   * @returns 包含added（新增）、removed（删除）、noed（无变化）的对象
   */
  static buildDiffObjectArray = (
    oldArray: any[],
    newArray: any[]
  ): {
    added: any[][];
    removed: any[][];
    noed: any[][];
  } => {
    // 常见的唯一标识字段名
    const idFields = ['id', 'code', 'adminCode', 'disId', 'key', '_id'];

    // 自动识别唯一标识字段
    let idField = '';
    if (newArray.length > 0) {
      for (const field of idFields) {
        if (newArray[0]?.[field] !== undefined) {
          idField = field;
          break;
        }
      }
    }

    // 如果没有找到唯一标识字段，降级为简单的 JSON 字符串比较
    if (!idField) {
      const oldStrList = oldArray.map((item: any) => JSON.stringify(item));
      const newStrList = newArray.map((item: any) => JSON.stringify(item));
      const diffList = diffArrays(oldStrList, newStrList);
      const result = {
        added: [] as any[][],
        removed: [] as any[][],
        noed: [] as any[][]
      };
      diffList.forEach(item => {
        if (item.added) {
          result.added.push(item.value.map((item2: any) => JSON.parse(item2)));
        } else if (item.removed) {
          result.removed.push(item.value.map((item2: any) => JSON.parse(item2)));
        } else {
          result.noed.push(item.value.map((item2: any) => JSON.parse(item2)));
        }
      });
      return result;
    }

    // 基于唯一标识字段进行智能比较
    const oldMap = new Map(oldArray.map(item => [item[idField], item]));
    const newMap = new Map(newArray.map(item => [item[idField], item]));

    const result = {
      added: [] as any[][],
      removed: [] as any[][],
      noed: [] as any[][]
    };

    // 找出新增和无变化的记录
    newArray.forEach(newItem => {
      const idValue = newItem[idField];
      const oldItem = oldMap.get(idValue);

      if (!oldItem) {
        // 新增的记录
        result.added.push([newItem]);
      } else {
        // 唯一标识相同即认为无变化（忽略字段值的变化）
        result.noed.push([newItem]);
      }
    });

    // 找出删除的记录
    oldArray.forEach(oldItem => {
      const idValue = oldItem[idField];
      if (!newMap.has(idValue)) {
        // 删除的记录
        result.removed.push([oldItem]);
      }
    });

    return result;
  };
}

export type DiffData = Change & { key: string };
