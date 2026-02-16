/**
 * 分页的数据
 */
export interface ITablePage<T> {
  /**
   * 列表数据
   */
  records: T[];
  /**
   * 列表数据-确保不为空
   */
  list: T[];
  /**
   * 单页大小
   */
  size: number;
  /**
   * 当前页数
   */
  current: number;
  /**
   * 总页数
   */
  pages: number;
  /**
   * 总条数
   */
  total: number;
  /**
   * 是否升序
   */
  asc?: boolean;
}

export const defTableData: ITablePage<any> = {
  current: 0,
  pages: 0,
  records: [],
  list: [],
  size: 0,
  total: 0
};

/**
 * 页面工具函数
 */

/**
 * 当前页是否是最后一页
 * @param data - 分页数据
 * @returns 是否为最后一页
 */
export const isLastPageData = (data: ITablePage<any>): boolean => {
  if (Object.keys(data).length > 0) {
    // 判断当前数据是否是最后一条
    const { records, current } = data;
    // 如果当前只有一条数据了并且当前页数大于一页
    return records.length === 1 && current > 1;
  }
  return false;
};

/**
 * 生成翻页配置数据
 * @param data - 后台传递的数据
 * @returns 翻页配置对象
 */
export const buildPageConfig = (data?: ITablePage<any>) => ({
  // 设置第几页
  current: data?.current || 0,
  // 设置每页条数
  pageSize: data?.size || 0,
  // 设置总页数
  total: data?.total || 0,
  // 页数跳转
  showQuickJumper: true,
  //是否支持切换每页的大小
  showSizeChanger: false,
  // 总页数显示
  showTotal: (total: number, range: number[]) =>
    `${Number(total).toLocaleString('en-US')} 条数据中的第${range[0]}-${range[1]}条 `
});

/**
 * 默认的表格数据
 */
export const defaultTableData: ITablePage<any> = {
  current: 0,
  pages: 0,
  records: [],
  list: [],
  size: 0,
  total: 0
};

/**
 * 页面工具对象
 */
const pageUtils = {
  isLastPageData,
  buildPageConfig,
  defaultTableData
};

export default pageUtils;