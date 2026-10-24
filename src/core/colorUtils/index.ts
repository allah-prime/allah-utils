/**
 * 常用颜色
 */
const binColor = [
  '#5470c6',
  '#fd6f6f',
  '#7aad62',
  '#7ed3f4',
  '#91c7ae',
  '#ff915a',
  '#a868c5',
  '#fa541c',
  '#ffa940',
  '#ffc53d',
  '#d4b106',
  '#7cb305',
  '#08979c',
  '#1d39c4',
  '#eb2f96',
  '#ffdc60'
];

const colorUtils = {
  /**
   * 从颜色数组中获取颜色
   * @param index 颜色数组下标
   * @returns 颜色值
   */
  getColor(index: number): string {
    return binColor[index % binColor.length];
  }
};

export default colorUtils;