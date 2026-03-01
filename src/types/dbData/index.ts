import { IBaseFilter } from "../data";

export interface ISysDistrict {
  distId: string;

  /**
   * 编码
   */
  code: string;

  /**
   * 父编码
   */
  parentCode: string;

  /**
   * 节点类型
   */
  nodeType: string;

  /**
   * 地区名称
   */
  disName: string;

  /**
   * 地区编码
   */
  areaCode: string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 地区类型
   */
  disType: string;

  /**
   * 排序号
   */
  sequenceNo: number;

  /**
   * 创建人
   */
  createBy: string;

  /**
   * 创建时间
   */
  createAt: number;

  /**
   * 拼音名称
   */
  spellName: string;

  /**
   * 创建时间
   */
  updateAt: number;

  /**
   * 更新人
   */
  updateBy: string;

  /**
   * 其他属性
   */
  otherProperty: string;
}


export interface ISysDisFilter extends IBaseFilter {
  parentCode?: string;
  /**
   * 地区类型
   */
  disType?: string;
  /**
   * 其他属性
   */
  otherProperty?: string;
  /**
   * 搜索方式
   */
  searchType?: 'all' | '';
  /**
   * 地区编码
   */
  areaCode?: string;
  areaCodes?: string[];
}