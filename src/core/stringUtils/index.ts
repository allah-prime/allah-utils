/**
 * 字符串工具函数
 */

import dateUtils from "./../dateUtils";

/**
 * 字符串工具对象
 */
const stringUtils = {
  /**
   * 首字母大写
   * @param str 输入字符串
   * @returns 首字母大写的字符串
   */
  capitalize(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  /**
   * 驼峰命名转换
   * @param str 输入字符串
   * @returns 驼峰命名的字符串
   */
  toCamelCase(str: string): string {
    return str.replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '');
  },

  /**
   * 短横线命名转换
   * @param str 输入字符串
   * @returns 短横线命名的字符串
   */
  toKebabCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  },

  /**
   * 下划线命名转换
   * @param str 输入字符串
   * @returns 下划线命名的字符串
   */
  toSnakeCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  },

  /**
   * 截断字符串
   * @param str 输入字符串
   * @param length 最大长度
   * @param suffix 后缀，默认为 '...'
   * @returns 截断后的字符串
   */
  truncate(str: string, length: number, suffix = '...'): string {
    if (str.length <= length) return str;
    return str.slice(0, length - suffix.length) + suffix;
  },

  /**
   * 移除字符串两端空白字符
   * @param str 输入字符串
   * @returns 处理后的字符串
   */
  trim(str: string): string {
    return str.replace(/^\s+|\s+$/g, '');
  },

  /**
   * 生成随机字符串
   * @param length 长度
   * @param chars 字符集，默认为字母数字
   * @returns 随机字符串
   */
  randomString(length: number, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  /**
   * 构建金额字符串
   * @param num 金额数值
   * @returns 金额字符串
   */
  buildMoneyStr(str: number | string): string {
    if (!str) return '0';
    str = str.toString();
    // 先找到小数点的位置
    let smallMoney = '';
    let money = '';
    if (str.indexOf('.') > 0) {
      smallMoney = str.substring(str.indexOf('.'));
      // 计算前面那部分的钱
      money = str.substring(0, str.indexOf('.'));
    } else {
      money = str;
    }
    let num = (money || 0).toString();
    let result = '';
    while (num.length > 3) {
      result = `,${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result + smallMoney;
    }
    return result;
  },


  /**
   * 替换对象或者数组中的空值
   */
  replaceEmpty: (data: any, replaceStr: string = '-') => {
    if (data) {
      if (Array.isArray(data)) {
        data.forEach((item, index) => {
          // 只对对象进行处理
          if (typeof item === 'object') {
            data[index] = stringUtils.replaceEmpty(item, replaceStr);
          }
        });
      } else if (typeof data === 'object') {
        Object.keys(data).forEach(key => {
          // 不对时间进行处理
          if (key.includes('date') || key.includes('Date')) {
            // 使用安全的时间格式化
            data[key] = dateUtils.safeFormat(data[key]);
          } else if (key.includes('time') || key.includes('Time')) {
            // 使用安全的时间格式化
            data[key] = dateUtils.safeFormat(data[key], 'YYYY-MM-DD HH:mm:ss');
          } else if (data[key] === null || data[key] === undefined || data[key] === '') {
            data[key] = replaceStr;
          } else if (typeof data[key] === 'object') {
            data[key] = stringUtils.replaceEmpty(data[key], replaceStr);
          }
        });
      }
    }
    return data;
  },

  /**
   * 替换指定的字段为 -
   */
  replaceFieldsEmpty: (data: any, fields: string[], replaceStr: string = '-') => {
    if (data && fields && fields.length > 0) {
      fields.forEach(field => {
        if (data[field] === null || data[field] === undefined || data[field] === '') {
          data[field] = replaceStr;
        }
      });
    }
    return data;
  },
};

export default stringUtils;