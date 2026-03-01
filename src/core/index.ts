/**
 * 核心工具函数库
 * 统一导出所有工具对象
 */

import arrayUtils from './arrayUtils';
import stringUtils from './stringUtils';
import objectUtils from './objectUtils';
import numberUtils from './numberUtils';
import colorUtils from './colorUtils';
import dateUtils from './dateUtils';
import diffUtils from './diffUtils';
import fileUtils from './fileUtils';
import cryptoUtils from './cryptoUtils';
import pageUtils from './pageUtils';
import storageUtils from './storageUtils';
import asyncUtils, { AsyncQueue } from './asyncUtils';
import * as constants from './constants';
import validationUtils from './validationUtils';

/**
 * 默认导出所有工具对象的集合
 */
export default {
  arrayUtils,
  stringUtils,
  objectUtils,
  numberUtils,
  dateUtils,
  diffUtils,
  fileUtils,
  cryptoUtils,
  pageUtils,
  storageUtils,
  asyncUtils,
  colorUtils,
  validationUtils,
  AsyncQueue,
  constants
};