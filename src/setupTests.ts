/**
 * Jest 测试设置文件
 * 在所有测试运行前执行的配置
 */

// 全局测试配置
global.console = {
  ...console,
  // 在测试中禁用 console.log，但保留 error 和 warn
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: console.warn,
  error: console.error,
};

// 模拟浏览器环境（如果需要）
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// 设置测试超时时间
jest.setTimeout(10000);