import { IBaseFilter } from "../data";

/**
 * 行政区划（对齐后端 sys_district 契约字段）
 */
export interface ISysDistrict {
  /** 行政区 */
  disId: string;
  /** 编码 */
  code: string;
  /** 父编码 */
  pcode: string;
  /** 节点类型 */
  nodeType: string;
  /** 部门名称 */
  disName: string;
  /** 地区码 */
  adminCode: string;
  /** 备注 */
  remark: string;
  /** 部门类型 */
  disType: string;
  /** 排序号 */
  seqNo: number;
  /** 创建人 */
  creUser: string;
  /** 创建时间 */
  creTime: number;
  /** 拼音名称 */
  spellName: string;
  /** 更新时间 */
  upTime: number;
  /** 更新人 */
  upUser: string;
  /** 其他属性 */
  otherProperty: string;
}

export interface ISysDisFilter extends IBaseFilter {
  pcode?: string;
  /** 地区类型 */
  depType?: string;
  /** 其他属性 */
  otherProperty?: string;
  /** 搜索方式 */
  searchType?: 'all' | '';
  /** 地区编码 */
  adminCode?: string;
  adminCodes?: string[];
  /** 层级 */
  disType?: string;
}
