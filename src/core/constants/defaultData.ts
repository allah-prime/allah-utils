import { ITablePage } from "../pageUtils";

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