import { promises as fs } from 'fs';
import path from 'path';

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function isDirectory(p) {
  try {
    const stat = await fs.stat(p);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

async function listDir(p) {
  try {
    return await fs.readdir(p, { withFileTypes: true });
  } catch (e) {
    console.error(`读取目录失败: ${p}`, e.message);
    return [];
  }
}

async function moveFileToModuleFolder(moduleDir, fileName) {
  const ext = path.extname(fileName);
  const base = path.basename(fileName, ext);
  const from = path.join(moduleDir, fileName);
  const toDir = path.join(moduleDir, base);
  const toTs = path.join(toDir, 'index.ts');
  const toMd = path.join(toDir, 'index.md');

  // Skip non-.ts or .d.ts
  if (ext !== '.ts' || fileName.endsWith('.d.ts')) return false;
  // Skip module index.ts
  if (fileName === 'index.ts') return false;

  if (!(await isDirectory(moduleDir))) return false;

  // If already moved, skip
  if (await isDirectory(path.join(moduleDir, base))) {
    const existsIndexTs = await fs
      .stat(toTs)
      .then(s => s.isFile())
      .catch(() => false);
    if (existsIndexTs) {
      console.log(`[已存在] 跳过: ${from} -> ${toTs}`);
      return false;
    }
  }

  await ensureDir(toDir);

  // Move file to index.ts
  await fs.rename(from, toTs);
  console.log(`[移动] ${from} -> ${toTs}`);

  // Create index.md if not exists
  const mdExists = await fs
    .stat(toMd)
    .then(s => s.isFile())
    .catch(() => false);
  if (!mdExists) {
    const title = `# ${base}\n\n`;
    await fs.writeFile(toMd, title, 'utf8');
    console.log(`[创建] ${toMd}`);
  }

  return true;
}

async function main() {
  const root = process.cwd();
  const srcDir = path.join(root, 'src');

  if (!(await isDirectory(srcDir))) {
    console.error(`未找到 src 目录: ${srcDir}`);
    process.exit(1);
  }

  const entries = await listDir(srcDir);
  const moduleDirs = entries.filter(e => e.isDirectory()).map(e => path.join(srcDir, e.name));

  let movedCount = 0;
  for (const moduleDir of moduleDirs) {
    const files = await listDir(moduleDir);
    for (const f of files) {
      if (f.isFile()) {
        const changed = await moveFileToModuleFolder(moduleDir, f.name);
        if (changed) movedCount += 1;
      }
    }
  }

  console.log(`\n完成。共移动 ${movedCount} 个文件。`);
}

main().catch(err => {
  console.error('执行失败:', err);
  process.exit(1);
});
