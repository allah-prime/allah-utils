import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');

// 获取目录下的子目录列表
function getSubDirectories(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
}

// 检查文件内容是否包含模块引用（export 或 import）
function checkModuleReference(fileContent, moduleName, parentDirName = '') {
  // 1. 检查 export ... from './moduleName'
  const exportRegex = new RegExp(`export\\s+.*from\\s+['"]\\.\\/${moduleName}(/index)?['"]`, 'g');
  if (exportRegex.test(fileContent)) return true;

  // 2. 检查 export ... from './parentDirName/moduleName' (针对 src/index.ts)
  if (parentDirName) {
      const exportDeepRegex = new RegExp(`export\\s+.*from\\s+['"]\\.\\/${parentDirName}\\/${moduleName}(/index)?['"]`, 'g');
      if (exportDeepRegex.test(fileContent)) return true;
  }

  // 3. 检查 import ... from './moduleName' (针对 core/index.ts 这种 export default {} 的情况)
  const importRegex = new RegExp(`import\\s+.*from\\s+['"]\\.\\/${moduleName}(/index)?['"]`, 'g');
  if (importRegex.test(fileContent)) return true;

  return false;
}

// 检查 package.json 是否导出指定模块
function checkPackageExports(packageJsonPath, moduleName) {
  if (!fs.existsSync(packageJsonPath)) return false;
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const exports = packageJson.exports || {};
  return !!exports[`./${moduleName}`];
}

async function main() {
  console.log('开始扫描缺失的导出项...\n');
  let hasError = false;

  const topLevelModules = getSubDirectories(srcDir);
  const srcIndexFile = path.join(srcDir, 'index.ts');
  const srcIndexContent = fs.readFileSync(srcIndexFile, 'utf-8');

  // 需要被 src/index.ts 导出的子模块目录
  // 通常 core 和 browser 下的子目录都需要在根 index.ts 导出
  const modulesToExportDeeply = ['core', 'browser'];

  console.log('--- 检查 src/index.ts 深度导出 ---');
  for (const parentModule of modulesToExportDeeply) {
      const parentDir = path.join(srcDir, parentModule);
      const subModules = getSubDirectories(parentDir);

      for (const subModule of subModules) {
          if (subModule === 'demos' || subModule === 'dist') continue;

          // 检查 src/index.ts 是否导出了 core/subModule
          if (!checkModuleReference(srcIndexContent, subModule, parentModule)) {
              console.warn(`[WARN] src/index.ts 未导出: ${parentModule}/${subModule}`);
              hasError = true;
          }
      }
  }

  console.log('\n--- 检查各模块内部导出 (index.ts) ---');
  for (const module of topLevelModules) {
    if (module === 'demos' || module === 'dist' || module === 'types') continue;

    const moduleDir = path.join(srcDir, module);
    const moduleIndexFile = path.join(moduleDir, 'index.ts');
    
    if (!fs.existsSync(moduleIndexFile)) continue;
    
    const moduleIndexContent = fs.readFileSync(moduleIndexFile, 'utf-8');
    const subModules = getSubDirectories(moduleDir);

    for (const subModule of subModules) {
      if (subModule === 'demos' || subModule === 'dist' || subModule === 'types') continue;

      // 检查 module/index.ts 是否引用了 subModule
      if (!checkModuleReference(moduleIndexContent, subModule)) {
         // 特殊处理：如果是 internal 模块可能不需要导出，但这里我们假设都需要
         console.warn(`[WARN] src/${module}/index.ts 未引用子模块: ${subModule}`);
         hasError = true;
      }
    }
  }

  // 3. 检查 package.json exports
  console.log('\n--- 检查 package.json exports ---');
  const packageJsonPath = path.join(rootDir, 'package.json');
  // 检查关键的一级模块是否在 package.json 中导出
  const keyModules = ['core', 'browser', 'request', 'uniapp', 'form', 'types', 'umijs'];
  for (const module of keyModules) {
      if (fs.existsSync(path.join(srcDir, module))) {
        if (!checkPackageExports(packageJsonPath, module)) {
            console.warn(`[WARN] package.json 未导出模块: ./${module}`);
            hasError = true;
        }
      }
  }

  if (!hasError) {
    console.log('\n太棒了！扫描完成，未发现明显的导出遗漏。');
  } else {
    console.log('\n扫描完成，请检查上述警告。');
  }
}

main().catch(console.error);
