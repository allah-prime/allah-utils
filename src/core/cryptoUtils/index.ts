import CryptoJS from 'crypto-js';

/**
 * 检测是否为浏览器环境
 * @returns {boolean} 如果是浏览器环境返回 true，否则返回 false
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined';
}

/**
 * 动态导入 uuid 模块
 * @returns {Promise<any>} 返回 uuid 模块的 Promise
 */
async function loadUUID(): Promise<any> {
  try {
    // 动态导入 uuid 模块以解决 CommonJS/ESM 兼容性问题
    const uuid = await import('uuid');
    return uuid;
  } catch (error) {
    throw new Error(`加载 uuid 模块失败: ${error}`);
  }
}

/**
 * 检测是否支持 crypto.getRandomValues
 * @returns {boolean} 如果支持返回 true，否则返回 false
 */
function supportsCryptoGetRandomValues(): boolean {
  return typeof crypto !== 'undefined' &&
    typeof crypto.getRandomValues === 'function';
}

/**
 * 生成兼容性的随机字节数组
 * @param {number} size - 需要生成的字节数
 * @returns {Uint8Array} 随机字节数组
 */
function getRandomBytes(size: number): Uint8Array {
  const bytes = new Uint8Array(size);

  // 优先使用 crypto.getRandomValues（现代浏览器和 Node.js）
  if (supportsCryptoGetRandomValues()) {
    crypto.getRandomValues(bytes);
    return bytes;
  }

  // 降级方案：使用 Math.random()
  for (let i = 0; i < size; i++) {
    bytes[i] = Math.floor(Math.random() * 256);
  }

  return bytes;
}

/**
 * 生成兼容性的 UUID v4
 * 当 crypto.getRandomValues 不可用时使用降级方案
 * @returns {string} UUID v4 字符串
 */
function generateCompatibleUUID(): string {
  const bytes = getRandomBytes(16);

  // 设置版本号 (4) 和变体位
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // 版本 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // 变体位

  // 转换为十六进制字符串
  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // 格式化为标准 UUID 格式
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32)
  ].join('-');
}

/**
 * 延迟加载 JSEncrypt（仅在浏览器环境中）
 * @returns {Promise<any>} 返回 JSEncrypt 类的 Promise
 */
async function loadJSEncrypt(): Promise<any> {
  if (!isBrowser()) {
    throw new Error('JSEncrypt 只能在浏览器环境中使用');
  }

  try {
    // 动态导入 JSEncrypt
    const { default: JSEncrypt } = await import('jsencrypt');
    return JSEncrypt;
  } catch (error) {
    throw new Error(`加载 JSEncrypt 失败: ${error}`);
  }
}

/**
 * 延迟加载 Node.js crypto 模块（仅在 Node.js 环境中）
 * @returns {Promise<any>} 返回 crypto 模块的 Promise
 */
async function loadNodeCrypto(): Promise<any> {
  if (isBrowser()) {
    throw new Error('Node.js crypto 模块只能在 Node.js 环境中使用');
  }

  try {
    // 动态导入 Node.js crypto 模块
    const crypto = await import('crypto');
    return crypto;
  } catch (error) {
    throw new Error(`加载 Node.js crypto 模块失败: ${error}`);
  }
}

/**
 * Node.js 环境下的 RSA 加密
 * @param {string} text - 需要加密的文本
 * @param {string} publicKey - RSA 公钥（PEM 格式）
 * @returns {Promise<string | false>} 返回加密后的 Base64 字符串，失败返回 false
 */
async function rsaEncryptNode(text: string, publicKey: string): Promise<string | false> {
  try {
    const crypto = await loadNodeCrypto();
    const buffer = Buffer.from(text, 'utf8');
    const encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString('base64');
  } catch (error) {
    console.error('Node.js RSA 加密失败:', error);
    return false;
  }
}

/**
 * Node.js 环境下的 RSA 解密
 * @param {string} encryptedText - 需要解密的 Base64 字符串
 * @param {string} privateKey - RSA 私钥（PEM 格式）
 * @returns {Promise<string | false>} 返回解密后的原文，失败返回 false
 */
async function rsaDecryptNode(encryptedText: string, privateKey: string): Promise<string | false> {
  try {
    const crypto = await loadNodeCrypto();
    const buffer = Buffer.from(encryptedText, 'base64');
    const decrypted = crypto.privateDecrypt(privateKey, buffer);
    return decrypted.toString('utf8');
  } catch (error) {
    console.error('Node.js RSA 解密失败:', error);
    return false;
  }
}

/**
 * Node.js 环境下生成 RSA 密钥对
 * @param {number} keySize - 密钥长度
 * @returns {Promise<{ publicKey: string; privateKey: string } | null>} 返回包含公钥和私钥的对象，失败返回 null
 */
async function generateRSAKeyPairNode(keySize: number): Promise<{ publicKey: string; privateKey: string } | null> {
  try {
    const crypto = await loadNodeCrypto();
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: keySize,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });
    return { publicKey, privateKey };
  } catch (error) {
    console.error('Node.js RSA 密钥对生成失败:', error);
    return null;
  }
}

/**
 * 浏览器环境下的 RSA 加密
 * @param {string} text - 需要加密的文本
 * @param {string} publicKey - RSA 公钥（PEM 格式）
 * @returns {Promise<string | false>} 返回加密后的 Base64 字符串，失败返回 false
 */
async function rsaEncryptBrowser(text: string, publicKey: string): Promise<string | false> {
  try {
    const JSEncrypt = await loadJSEncrypt();
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    return encrypt.encrypt(text);
  } catch (error) {
    console.error('浏览器 RSA 加密失败:', error);
    return false;
  }
}

/**
 * 浏览器环境下的 RSA 解密
 * @param {string} encryptedText - 需要解密的 Base64 字符串
 * @param {string} privateKey - RSA 私钥（PEM 格式）
 * @returns {Promise<string | false>} 返回解密后的原文，失败返回 false
 */
async function rsaDecryptBrowser(encryptedText: string, privateKey: string): Promise<string | false> {
  try {
    const JSEncrypt = await loadJSEncrypt();
    const decrypt = new JSEncrypt();
    decrypt.setPrivateKey(privateKey);
    return decrypt.decrypt(encryptedText);
  } catch (error) {
    console.error('浏览器 RSA 解密失败:', error);
    return false;
  }
}

/**
 * 浏览器环境下生成 RSA 密钥对
 * @param {number} keySize - 密钥长度
 * @returns {Promise<{ publicKey: string; privateKey: string } | null>} 返回包含公钥和私钥的对象，失败返回 null
 */
async function generateRSAKeyPairBrowser(keySize: number): Promise<{ publicKey: string; privateKey: string } | null> {
  try {
    const JSEncrypt = await loadJSEncrypt();
    const encrypt = new JSEncrypt({ default_key_size: keySize.toString() });
    return {
      publicKey: encrypt.getPublicKey(),
      privateKey: encrypt.getPrivateKey()
    };
  } catch (error) {
    console.error('浏览器 RSA 密钥对生成失败:', error);
    return null;
  }
}

/**
 * 加密工具类
 * 提供 UUID 生成、MD5 哈希、RSA 加密解密、AES 对称加密等功能
 */
const cryptoUtils = {
  /**
   * 生成 UUID v4
   * @returns {Promise<string>} 返回一个随机生成的 UUID v4 字符串
   * @example
   * ```typescript
   * const uuid = await cryptoUtils.uuid();
   * console.log(uuid); // "550e8400e29b41d4a716446655440000"
   * ```
   */
  async uuid(): Promise<string> {
    try {
      // 优先尝试使用 uuid 库
      if (supportsCryptoGetRandomValues()) {
        const { v4: uuidv4 } = await loadUUID();
        return uuidv4().replace(/-/g, '');
      }
      // 在不支持 crypto.getRandomValues 的环境中使用兼容性方案
      console.warn('crypto.getRandomValues 不可用，使用兼容性 UUID 生成方案');
      return generateCompatibleUUID().replace(/-/g, '');
    } catch (error) {
      // 如果 uuid 库加载失败，也使用兼容性方案
      console.warn('UUID 库加载失败，使用兼容性 UUID 生成方案:', error);
      return generateCompatibleUUID().replace(/-/g, '');
    }
  },

  /**
   * 同步生成 UUID (浏览器端/兼容模式)
   * 优先使用 crypto.getRandomValues，不支持时回退到 Math.random
   * @param {boolean} [removeHyphens=true] - 是否移除连字符，默认为 true (保持与 uuid() 一致)
   * @returns {string} UUID 字符串
   * @example
   * ```typescript
   * const uuid = cryptoUtils.uuidSync();
   * console.log(uuid); // "550e8400e29b41d4a716446655440000"
   * 
   * const standardUuid = cryptoUtils.uuidSync(false);
   * console.log(standardUuid); // "550e8400-e29b-41d4-a716-446655440000"
   * ```
   */
  uuidSync(removeHyphens: boolean = true): string {
    const uuid = generateCompatibleUUID();
    return removeHyphens ? uuid.replace(/-/g, '') : uuid;
  },

  /**
   * 生成字符串的 MD5 哈希值
   * @param {string} input - 需要进行 MD5 加密的输入字符串
   * @param {string} [salt] - 可选的盐值，用于增强安全性
   * @returns {string} 返回 MD5 哈希值的十六进制字符串
   * @example
   * ```typescript
   * // 基础 MD5
   * const hash1 = cryptoUtils.md5('hello world');
   * console.log(hash1); // "5d41402abc4b2a76b9719d911017c592"
   * 
   * // 带盐值的 MD5
   * const hash2 = cryptoUtils.md5('password', 'mysalt');
   * console.log(hash2); // "a1b2c3d4e5f6..."
   * ```
   */
  md5(input: string, salt?: string): string {
    const data = salt ? input + salt : input;
    return CryptoJS.MD5(data).toString();
  },

  /**
   * 生成简短的 UUID（8位）
   * @returns {string} 返回一个8位的短 UUID 字符串
   * @example
   * ```typescript
   * const shortUuid = cryptoUtils.miniUuid();
   * console.log(shortUuid); // "a1b2c3d4"
   * ```
   */
  miniUuid(): string {
    return Math.random().toString(36).substring(2, 10);
  },

  /**
   * 验证 UUID 格式是否正确
   * @param {string} uuid - 需要验证的 UUID 字符串
   * @returns {Promise<boolean>} 如果格式正确返回 true，否则返回 false
   * @example
   * ```typescript
   * const isValid = await cryptoUtils.isValidUUID('550e8400-e29b-41d4-a716-446655440000');
   * console.log(isValid); // true
   * ```
   */
  async isValidUUID(uuid: string): Promise<boolean> {
    try {
      const { validate: validateUUID } = await loadUUID();
      return validateUUID(uuid);
    } catch (error) {
      console.warn(`UUID 库加载失败:${error}`);
      // 如果 uuid 库不可用，使用正则表达式验证
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(uuid);
    }
  },

  /**
   * RSA 加密（跨环境兼容）
   * 在 Node.js 环境中使用内置 crypto 模块，在浏览器环境中使用 jsencrypt
   * @param {string} text - 需要加密的文本
   * @param {string} publicKey - RSA 公钥（PEM 格式）
   * @returns {Promise<string | false>} 返回加密后的 Base64 字符串，失败返回 false
   * @example
   * ```typescript
   * const publicKey = `-----BEGIN PUBLIC KEY-----
   * MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC7vbqajDw4o...
   * -----END PUBLIC KEY-----`;
   * 
   * const encrypted = await cryptoUtils.rsaEncrypt('Hello World', publicKey);
   * console.log(encrypted); // "base64 encrypted string"
   * ```
   */
  async rsaEncrypt(text: string, publicKey: string): Promise<string | false> {
    if (isBrowser()) {
      return await rsaEncryptBrowser(text, publicKey);
    }
    return await rsaEncryptNode(text, publicKey);
  },

  /**
   * RSA 解密（跨环境兼容）
   * 在 Node.js 环境中使用内置 crypto 模块，在浏览器环境中使用 jsencrypt
   * @param {string} encryptedText - 需要解密的 Base64 字符串
   * @param {string} privateKey - RSA 私钥（PEM 格式）
   * @returns {Promise<string | false>} 返回解密后的原文，失败返回 false
   * @example
   * ```typescript
   * const privateKey = `-----BEGIN PRIVATE KEY-----
   * MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAL...
   * -----END PRIVATE KEY-----`;
   * 
   * const decrypted = await cryptoUtils.rsaDecrypt(encryptedText, privateKey);
   * console.log(decrypted); // "Hello World"
   * ```
   */
  async rsaDecrypt(encryptedText: string, privateKey: string): Promise<string | false> {
    if (isBrowser()) {
      return await rsaDecryptBrowser(encryptedText, privateKey);
    }
    return await rsaDecryptNode(encryptedText, privateKey);
  },

  /**
   * 生成 RSA 密钥对（跨环境兼容）
   * 在 Node.js 环境中使用内置 crypto 模块，在浏览器环境中使用 jsencrypt
   * @param {number} [keySize=1024] - 密钥长度，默认 1024 位
   * @returns {Promise<{ publicKey: string; privateKey: string } | null>} 返回包含公钥和私钥的对象，失败返回 null
   * @example
   * ```typescript
   * const keyPair = await cryptoUtils.generateRSAKeyPair(2048);
   * if (keyPair) {
   *   console.log(keyPair.publicKey);  // "-----BEGIN PUBLIC KEY-----..."
   *   console.log(keyPair.privateKey); // "-----BEGIN PRIVATE KEY-----..."
   * }
   * ```
   */
  async generateRSAKeyPair(keySize: number = 1024): Promise<{ publicKey: string; privateKey: string } | null> {
    if (isBrowser()) {
      return await generateRSAKeyPairBrowser(keySize);
    }
    return await generateRSAKeyPairNode(keySize);
  },

  /**
   * AES 加密（使用字符串密钥）
   * @param {string} text - 需要加密的文本
   * @param {string} key - 加密密钥（字符串）
   * @returns {string} 返回加密后的文本（包含 IV 和密文）
   * @example
   * ```typescript
   * const encrypted = cryptoUtils.aesEncrypt('Hello World', 'mySecretKey123');
   * console.log(encrypted); // "iv:ciphertext"
   * ```
   */
  aesEncrypt(text: string, key: string): string {
    try {
      // 使用 CryptoJS 进行 AES 加密
      const encrypted = CryptoJS.AES.encrypt(text, key).toString();
      return encrypted;
    } catch (error) {
      console.error('AES 加密失败:', error);
      throw new Error('AES 加密失败');
    }
  },

  /**
   * AES 解密（使用字符串密钥）
   * @param {string} encryptedText - 需要解密的文本（包含 IV 和密文）
   * @param {string} key - 解密密钥（字符串）
   * @returns {string} 返回解密后的原文
   * @example
   * ```typescript
   * const decrypted = cryptoUtils.aesDecrypt(encryptedText, 'mySecretKey123');
   * console.log(decrypted); // "Hello World"
   * ```
   */
  aesDecrypt(encryptedText: string, key: string): string {
    try {
      // 使用 CryptoJS 进行 AES 解密
      const decrypted = CryptoJS.AES.decrypt(encryptedText, key);
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

      if (!decryptedText) {
        throw new Error('解密失败，可能是密钥错误或数据损坏');
      }

      return decryptedText;
    } catch (error) {
      console.error('AES 解密失败:', error);
      throw new Error('AES 解密失败');
    }
  }
};

export default cryptoUtils;
