import { readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

/**
 * 扫描指定目录下的模块入口文件
 * @param {string} srcDir - 源代码目录路径
 * @param {string} entryFileName - 入口文件名，默认为 'index.ts'
 * @returns {Object} 模块入口映射对象
 */
export function scanModuleEntries(srcDir = 'src', entryFileName = 'index.ts') {
  const moduleEntries = {};
  
  try {
    // 读取源目录下的所有项目
    const items = readdirSync(srcDir);
    
    for (const item of items) {
      const itemPath = join(srcDir, item);
      const stat = statSync(itemPath);
      
      // 如果是目录
      if (stat.isDirectory()) {
        const entryFilePath = join(itemPath, entryFileName);
        
        try {
          // 检查入口文件是否存在
          statSync(entryFilePath);
          
          // 生成模块入口键名和路径
          const moduleKey = `${item}/index`;
          const modulePath = entryFilePath.replace(/\\/g, '/'); // 统一使用正斜杠
          
          moduleEntries[moduleKey] = modulePath;
        } catch (error) {
          // 入口文件不存在，跳过该目录
          console.warn(`警告: 目录 ${item} 中未找到 ${entryFileName} 文件`);
        }
      } else if (item === entryFileName) {
        // 如果是根目录的入口文件
        const modulePath = join(srcDir, item).replace(/\\/g, '/');
        moduleEntries['index'] = modulePath;
      }
    }
    
    return moduleEntries;
  } catch (error) {
    console.error(`扫描模块入口时发生错误: ${error.message}`);
    return {};
  }
}

/**
 * 获取模块入口配置（用于 rollup 配置）
 * @param {string} srcDir - 源代码目录路径
 * @returns {Object} 模块入口映射对象
 */
export function getModuleEntries(srcDir = 'src') {
  const entries = scanModuleEntries(srcDir);
  
  console.log('扫描到的模块入口:');
  Object.entries(entries).forEach(([key, path]) => {
    console.log(`  ${key}: ${path}`);
  });
  
  return entries;
}