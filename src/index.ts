// 主入口文件 - 导出所有工具函数

// 核心工具函数（适用于 Node.js、UniApp、React Native 等）
export { default as stringUtils } from './core/stringUtils';
export { default as arrayUtils } from './core/arrayUtils';
export { default as objectUtils } from './core/objectUtils';
export { default as dateUtils } from './core/dateUtils';
export { default as numberUtils } from './core/numberUtils';
export { default as validationUtils } from './core/validationUtils';
export { default as asyncUtils } from './core/asyncUtils';
export { default as colorUtils } from './core/colorUtils';
export { default as cryptoUtils } from './core/cryptoUtils';
export { default as pageUtils, defTableData } from './core/pageUtils';
export type { ITablePage } from './core/pageUtils';

// 浏览器专用工具函数
export { default as domUtils } from './browser/domUtils';
export { default as cookieUtils } from './browser/cookieUtils';
export { default as urlUtils } from './browser/urlUtils';

// 请求工具函数
export { default as request } from './request';

// UniApp 工具函数
export * from './uniapp';

// 类型定义
export * from './types';

// 版本信息
export const version = '1.0.0';