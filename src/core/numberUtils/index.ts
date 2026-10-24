/**
 * 数字工具函数
 */

/**
 * 数字工具对象
 */
const numberUtils = {
  /**
   * 格式化数字（添加千分位分隔符）
   * @param num 数字
   * @param separator 分隔符，默认为 ','
   * @returns 格式化后的字符串
   */
  formatNumber(num: number, separator = ','): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  },

  /**
   * 保留指定小数位数
   * @param num 数字
   * @param digits 小数位数
   * @returns 处理后的数字
   */
  toFixed(num: number, digits: number): number {
    return Number(num.toFixed(digits));
  },

  /**
   * 生成指定范围内的随机数
   * @param min 最小值
   * @param max 最大值
   * @param integer 是否为整数，默认为 false
   * @returns 随机数
   */
  random(min: number, max: number, integer = false): number {
    const result = Math.random() * (max - min) + min;
    return integer ? Math.floor(result) : result;
  },

  /**
   * 限制数字在指定范围内
   * @param num 数字
   * @param min 最小值
   * @param max 最大值
   * @returns 限制后的数字
   */
  clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
  },

  /**
   * 数字映射到新范围
   * @param value 原值
   * @param fromMin 原范围最小值
   * @param fromMax 原范围最大值
   * @param toMin 新范围最小值
   * @param toMax 新范围最大值
   * @returns 映射后的值
   */
  mapRange(
    value: number,
    fromMin: number,
    fromMax: number,
    toMin: number,
    toMax: number
  ): number {
    return ((value - fromMin) * (toMax - toMin)) / (fromMax - fromMin) + toMin;
  },

  /**
   * 判断是否为偶数
   * @param num 数字
   * @returns 是否为偶数
   */
  isEven(num: number): boolean {
    return num % 2 === 0;
  },

  /**
   * 判断是否为奇数
   * @param num 数字
   * @returns 是否为奇数
   */
  isOdd(num: number): boolean {
    return num % 2 !== 0;
  },

  /**
   * 计算百分比
   * @param value 值
   * @param total 总数
   * @param digits 小数位数，默认为 2
   * @returns 百分比
   */
  percentage(value: number, total: number, digits = 2): number {
    if (total === 0) return 0;
    return numberUtils.toFixed((value / total) * 100, digits);
  },

  /**
   * 数字转换为文件大小格式
   * @param bytes 字节数
   * @param digits 小数位数，默认为 2
   * @returns 文件大小字符串
   */
  formatBytes(bytes: number, digits = 2): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${numberUtils.toFixed(bytes / Math.pow(k, i), digits)} ${sizes[i]}`;
  },

  /**
   * 求最大公约数
   * @param a 数字a
   * @param b 数字b
   * @returns 最大公约数
   */
  gcd(a: number, b: number): number {
    return b === 0 ? a : numberUtils.gcd(b, a % b);
  },

  /**
   * 求最小公倍数
   * @param a 数字a
   * @param b 数字b
   * @returns 最小公倍数
   */
  lcm(a: number, b: number): number {
    return Math.abs(a * b) / numberUtils.gcd(a, b);
  }
};

export default numberUtils;