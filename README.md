# allahjs-utils

一个功能丰富的 JavaScript/TypeScript 工具库，提供常用的工具函数，帮助开发者提高开发效率。

## 特性

- 🚀 **TypeScript 支持** - 完整的类型定义
- 📦 **模块化设计** - 支持按需导入
- 🌐 **多环境支持** - 支持 Node.js 和浏览器环境
- 🧪 **完整测试** - 高覆盖率的单元测试
- 📚 **详细文档** - 完整的 API 文档和示例

## 安装

```bash
# 使用 npm
pnpm install @allahjs/utils
```

## 使用方法

### 完整导入

```typescript
import * as utils from '@allahjs/utils';

// 使用字符串工具
const result = utils.capitalize('hello world'); // "Hello world"
```

### 按需导入

```typescript
import { capitalize, formatDate, unique } from '@allahjs/utils';

const text = capitalize('hello'); // "Hello"
const date = formatDate(new Date(), 'YYYY-MM-DD'); // "2024-01-01"
const arr = unique([1, 2, 2, 3]); // [1, 2, 3]
```

### 分模块导入

```typescript
import { capitalize, toCamelCase } from '@allahjs/utils/string';
import { unique, chunk } from '@allahjs/utils/array';
import { deepClone, merge } from '@allahjs/utils/object';
```

## API 文档

### 请求工具 (Request)

封装了跨平台的 HTTP 请求，根据运行环境自动选择合适的请求库：

| 环境 | `reqEnv` 值 | 底层实现 |
|------|------------|---------|
| 浏览器 / Node.js（默认） | `'browser'` | [Axios](https://axios-http.com/) |
| Fetch | `'fetch'` | 原生 `fetch` API |
| React Native | `'rn'` | 原生 `fetch` API |
| UniApp / 微信小程序 | `'uni'` | `uni.request`（通过 Axios 适配器） |

```typescript
import { request } from '@allahjs/utils';

// POST 请求（默认，使用 Axios）
const data = await request('/api/list', {
  params: { pageNum: 1 },
  manner: 'json'
});

// GET 请求
const detail = await request('/api/detail', {
  method: 'get',
  params: { id: 1 }
});

// 指定环境
await request('/api/data', { reqEnv: 'fetch' });    // 使用 fetch
await request('/api/data', { reqEnv: 'rn' });       // React Native
await request('/api/data', { reqEnv: 'uni' });      // UniApp
```

### 字符串工具 (String)

- `capitalize(str)` - 首字母大写
- `toCamelCase(str)` - 转换为驼峰命名
- `toKebabCase(str)` - 转换为短横线命名
- `toSnakeCase(str)` - 转换为下划线命名
- `truncate(str, length, suffix)` - 截断字符串
- `trim(str)` - 移除两端空白
- `randomString(length, chars)` - 生成随机字符串

### 数组工具 (Array)

- `unique(arr)` - 数组去重
- `chunk(arr, size)` - 数组分块
- `flatten(arr, depth)` - 数组扁平化
- `shuffle(arr)` - 数组洗牌
- `intersection(arr1, arr2)` - 求交集
- `difference(arr1, arr2)` - 求差集
- `groupBy(arr, keyFn)` - 数组分组

### 对象工具 (Object)

- `deepClone(obj)` - 深拷贝
- `merge(target, ...sources)` - 合并对象
- `get(obj, path, defaultValue)` - 获取属性值
- `set(obj, path, value)` - 设置属性值
- `unset(obj, path)` - 删除属性
- `paths(obj)` - 获取所有路径

### 日期工具 (Date)

- `formatDate(date, format)` - 格式化日期
- `timeAgo(date)` - 相对时间
- `addTime(date, amount, unit)` - 添加时间
- `getDateRange(date, unit)` - 获取日期范围
- `isSameDay(date1, date2)` - 判断同一天
- `isLeapYear(year)` - 判断闰年
- `getDaysInMonth(year, month)` - 获取月份天数

### 数字工具 (Number)

- `formatNumber(num, separator)` - 格式化数字
- `toFixed(num, digits)` - 保留小数位
- `random(min, max, integer)` - 生成随机数
- `clamp(num, min, max)` - 限制范围
- `mapRange(value, fromMin, fromMax, toMin, toMax)` - 映射范围
- `isEven(num)` / `isOdd(num)` - 判断奇偶
- `percentage(value, total, digits)` - 计算百分比
- `formatBytes(bytes, digits)` - 格式化文件大小

### 验证工具 (Validation)

- `isEmail(email)` - 验证邮箱
- `isPhone(phone)` - 验证手机号
- `isIdCard(idCard)` - 验证身份证
- `isUrl(url)` - 验证URL
- `isIp(ip)` - 验证IP地址
- `passwordStrength(password, options)` - 密码强度
- `isBankCard(cardNumber)` - 验证银行卡
- `hasChinese(text)` / `isChineseOnly(text)` - 中文验证

### 异步工具 (Async)

- `delay(ms)` - 延迟执行
- `withTimeout(promise, timeout)` - 超时控制
- `retry(fn, maxRetries, delayMs)` - 重试机制
- `concurrent(tasks, concurrency)` - 并发控制
- `debounce(fn, delay)` - 防抖函数
- `throttle(fn, interval)` - 节流函数
- `AsyncQueue` - 异步队列类
- `memoizeAsync(fn, keyFn, ttl)` - 异步缓存

### DOM 工具 (DOM)

- `$(selector, parent)` / `$$(selector, parent)` - 元素查询
- `addClass(element, className)` - 添加CSS类
- `removeClass(element, className)` - 移除CSS类
- `toggleClass(element, className)` - 切换CSS类
- `hasClass(element, className)` - 检查CSS类
- `setStyle(element, styles)` - 设置样式
- `getStyle(element, property)` - 获取样式
- `createElement(tagName, attributes, children)` - 创建元素
- `getElementPosition(element)` - 获取位置
- `isInViewport(element, threshold)` - 检查是否在视口
- `scrollToElement(element, options)` - 滚动到元素
- `copyToClipboard(text)` - 复制到剪贴板
- `observeResize(element, callback)` - 监听大小变化

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式（监听文件变化）
pnpm run dev

# 构建
pnpm run build

# 运行测试
pnpm run test

# 监听测试
pnpm run test:watch

# 代码检查
pnpm run lint

# 修复代码风格
pnpm run lint:fix

# 类型检查
pnpm run type-check
```

## 发布到 NPM

### 首次发布

1. **检查当前 registry**：
   ```bash
   npm config get registry
   ```

2. **设置为 npm 官方源**：
   ```bash
   npm config set registry https://registry.npmjs.org/
   ```

3. **登录 npm 账号**：
   ```bash
   npm login --registry=https://registry.npmjs.org/
   ```

4. **验证登录状态**：
   ```bash
   npm whoami --registry=https://registry.npmjs.org/
   ```

5. **测试发布（推荐先执行）**：
   ```bash
   pnpm run publish:dry
   ```

6. **正式发布**：
   ```bash
   pnpm run publish:npm
   ```

### 后续版本发布

1. **更新版本号**：
   ```bash
   npm version patch   # 修复版本 1.0.0 -> 1.0.1
   npm version minor   # 功能版本 1.0.0 -> 1.1.0  
   npm version major   # 重大版本 1.0.0 -> 2.0.0
   ```

2. **发布新版本**：
   ```bash
   pnpm run publish:npm
   ```

### 发布前自动执行

- 🧹 清理旧的构建文件
- 🔨 重新构建项目
- 🧪 运行所有测试
- ✅ 只有测试通过才能发布

### 注意事项

- 📝 如果平时使用淘宝镜像源，发布时必须切换到 npm 官方源
- 🔐 登录时需要输入 npm 用户名、密码和邮箱
- ✅ 发布完成后可以切换回常用的镜像源：
  ```bash
  npm config set registry https://registry.npmmirror.com/
  ```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 更新日志

### 1.0.0

- 初始版本发布
- 包含字符串、数组、对象、日期、数字、验证、异步、DOM 等工具函数