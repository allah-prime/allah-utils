import CryptoJS from 'crypto-js';

/**
 * RSA 哈希算法类型
 */
type RSAHashAlgorithm = 'SHA256' | 'SHA1' | 'MD5';

/**
 * 哈希算法映射表
 * - cryptojs: crypto-js 对应的哈希函数，用于浏览器端 jsencrypt 签名验签时计算摘要
 * - jsencryptName: jsencrypt 内部识别的摘要名称，用于附加 ASN.1 算法标识前缀
 * - node: Node.js crypto 模块 createSign/createVerify 接受的算法名
 */
const HASH_DIGEST_MAP: Record<
  RSAHashAlgorithm,
  { cryptojs: (input: string) => CryptoJS.lib.WordArray; jsencryptName: string; node: string }
> = {
  SHA256: { cryptojs: CryptoJS.SHA256, jsencryptName: 'sha256', node: 'SHA256' },
  SHA1: { cryptojs: CryptoJS.SHA1, jsencryptName: 'sha1', node: 'SHA1' },
  MD5: { cryptojs: CryptoJS.MD5, jsencryptName: 'md5', node: 'MD5' }
};

/**
 * 检测是否为浏览器环境
 * @returns {boolean} 浏览器环境返回 true，否则返回 false
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined';
}

/**
 * 延迟加载 JSEncrypt（仅在浏览器环境中）
 * 动态 import 避免在 Node 环境引入浏览器专属依赖
 * @returns {Promise<any>} 返回 JSEncrypt 类
 */
async function loadJSEncrypt(): Promise<any> {
  if (!isBrowser()) {
    throw new Error('JSEncrypt 只能在浏览器环境中使用');
  }
  try {
    const { default: JSEncrypt } = await import('jsencrypt');
    return JSEncrypt;
  } catch (error) {
    throw new Error(`加载 JSEncrypt 失败: ${error}`);
  }
}

/**
 * 延迟加载 Node.js crypto 模块（仅在 Node.js 环境中）
 * @returns {Promise<typeof import('crypto')>} 返回 Node.js crypto 模块
 */
async function loadNodeCrypto(): Promise<typeof import('crypto')> {
  if (isBrowser()) {
    throw new Error('Node.js crypto 模块只能在 Node.js 环境中使用');
  }
  try {
    return await import('crypto');
  } catch (error) {
    throw new Error(`加载 Node.js crypto 模块失败: ${error}`);
  }
}

// ============================================================
// 浏览器环境实现（基于 jsencrypt）
// ============================================================

/**
 * 浏览器环境 RSA 加密
 * @param {string} text - 待加密明文
 * @param {string} publicKey - RSA 公钥（PEM 格式）
 * @returns {Promise<string | false>} 加密后的 Base64 字符串，失败返回 false
 */
async function encryptBrowser(text: string, publicKey: string): Promise<string | false> {
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
 * 浏览器环境 RSA 解密
 * @param {string} encryptedText - 待解密的 Base64 密文
 * @param {string} privateKey - RSA 私钥（PEM 格式）
 * @returns {Promise<string | false>} 解密后的原文，失败返回 false
 */
async function decryptBrowser(encryptedText: string, privateKey: string): Promise<string | false> {
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
 * 浏览器环境生成 RSA 密钥对
 * @param {number} keySize - 密钥长度（位）
 * @returns {Promise<{ publicKey: string; privateKey: string } | null>} 密钥对对象，失败返回 null
 */
async function generateKeyPairBrowser(
  keySize: number
): Promise<{ publicKey: string; privateKey: string } | null> {
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
 * 浏览器环境 RSA 签名（私钥签名）
 * jsencrypt 的 sign 方法需要传入一个摘要函数，返回哈希的十六进制字符串
 * @param {string} text - 待签名原文
 * @param {string} privateKey - RSA 私钥（PEM 格式）
 * @param {RSAHashAlgorithm} hashAlg - 哈希算法
 * @returns {Promise<string | false>} 签名后的 Base64 字符串，失败返回 false
 */
async function signBrowser(
  text: string,
  privateKey: string,
  hashAlg: RSAHashAlgorithm
): Promise<string | false> {
  try {
    const JSEncrypt = await loadJSEncrypt();
    const signer = new JSEncrypt();
    signer.setPrivateKey(privateKey);
    const { cryptojs, jsencryptName } = HASH_DIGEST_MAP[hashAlg];
    // digestMethod 必须返回十六进制字符串，jsencrypt 内部会将其转回字节并附加 ASN.1 算法标识
    const digestMethod = (str: string): string => cryptojs(str).toString();
    return signer.sign(text, digestMethod, jsencryptName);
  } catch (error) {
    console.error('浏览器 RSA 签名失败:', error);
    return false;
  }
}

/**
 * 浏览器环境 RSA 验签（公钥验签）
 * @param {string} text - 原文
 * @param {string} signature - Base64 签名
 * @param {string} publicKey - RSA 公钥（PEM 格式）
 * @param {RSAHashAlgorithm} hashAlg - 哈希算法
 * @returns {Promise<boolean>} 验签通过返回 true，否则返回 false
 */
async function verifyBrowser(
  text: string,
  signature: string,
  publicKey: string,
  hashAlg: RSAHashAlgorithm
): Promise<boolean> {
  try {
    const JSEncrypt = await loadJSEncrypt();
    const verifier = new JSEncrypt();
    verifier.setPublicKey(publicKey);
    const { cryptojs } = HASH_DIGEST_MAP[hashAlg];
    const digestMethod = (str: string): string => cryptojs(str).toString();
    return verifier.verify(text, signature, digestMethod);
  } catch (error) {
    console.error('浏览器 RSA 验签失败:', error);
    return false;
  }
}

// ============================================================
// Node.js 环境实现（基于内置 crypto 模块）
// ============================================================

/**
 * Node.js 环境 RSA 加密
 * 使用 PKCS#1 v1.5 填充，与浏览器端 jsencrypt 默认填充方式一致，保证两端互通
 * @param {string} text - 待加密明文
 * @param {string} publicKey - RSA 公钥（PEM 格式）
 * @returns {Promise<string | false>} 加密后的 Base64 字符串，失败返回 false
 */
async function encryptNode(text: string, publicKey: string): Promise<string | false> {
  try {
    const crypto = await loadNodeCrypto();
    const buffer = Buffer.from(text, 'utf8');
    const encrypted = crypto.publicEncrypt(
      { key: publicKey, padding: crypto.constants.RSA_PKCS1_PADDING },
      buffer
    );
    return encrypted.toString('base64');
  } catch (error) {
    console.error('Node.js RSA 加密失败:', error);
    return false;
  }
}

/**
 * Node.js 环境 RSA 解密
 * @param {string} encryptedText - 待解密的 Base64 密文
 * @param {string} privateKey - RSA 私钥（PEM 格式）
 * @returns {Promise<string | false>} 解密后的原文，失败返回 false
 */
async function decryptNode(encryptedText: string, privateKey: string): Promise<string | false> {
  try {
    const crypto = await loadNodeCrypto();
    const buffer = Buffer.from(encryptedText, 'base64');
    const decrypted = crypto.privateDecrypt(
      { key: privateKey, padding: crypto.constants.RSA_PKCS1_PADDING },
      buffer
    );
    return decrypted.toString('utf8');
  } catch (error) {
    console.error('Node.js RSA 解密失败:', error);
    return false;
  }
}

/**
 * Node.js 环境生成 RSA 密钥对
 * @param {number} keySize - 密钥长度（位）
 * @returns {Promise<{ publicKey: string; privateKey: string } | null>} 密钥对对象，失败返回 null
 */
async function generateKeyPairNode(
  keySize: number
): Promise<{ publicKey: string; privateKey: string } | null> {
  try {
    const crypto = await loadNodeCrypto();
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: keySize,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
    return { publicKey, privateKey };
  } catch (error) {
    console.error('Node.js RSA 密钥对生成失败:', error);
    return null;
  }
}

/**
 * Node.js 环境 RSA 签名（私钥签名）
 * createSign 会自动对原文做哈希并附加 ASN.1 算法标识，与 jsencrypt 的签名结果互通
 * @param {string} text - 待签名原文
 * @param {string} privateKey - RSA 私钥（PEM 格式）
 * @param {RSAHashAlgorithm} hashAlg - 哈希算法
 * @returns {Promise<string | false>} 签名后的 Base64 字符串，失败返回 false
 */
async function signNode(
  text: string,
  privateKey: string,
  hashAlg: RSAHashAlgorithm
): Promise<string | false> {
  try {
    const crypto = await loadNodeCrypto();
    const { node } = HASH_DIGEST_MAP[hashAlg];
    const signer = crypto.createSign(node);
    signer.update(text);
    return signer.sign(privateKey, 'base64');
  } catch (error) {
    console.error('Node.js RSA 签名失败:', error);
    return false;
  }
}

/**
 * Node.js 环境 RSA 验签（公钥验签）
 * @param {string} text - 原文
 * @param {string} signature - Base64 签名
 * @param {string} publicKey - RSA 公钥（PEM 格式）
 * @param {RSAHashAlgorithm} hashAlg - 哈希算法
 * @returns {Promise<boolean>} 验签通过返回 true，否则返回 false
 */
async function verifyNode(
  text: string,
  signature: string,
  publicKey: string,
  hashAlg: RSAHashAlgorithm
): Promise<boolean> {
  try {
    const crypto = await loadNodeCrypto();
    const { node } = HASH_DIGEST_MAP[hashAlg];
    const verifier = crypto.createVerify(node);
    verifier.update(text);
    return verifier.verify(publicKey, signature, 'base64');
  } catch (error) {
    console.error('Node.js RSA 验签失败:', error);
    return false;
  }
}

/**
 * RSA 工具类
 * 独立的非对称加密工具，仅提供 RSA 相关能力（加解密、密钥对生成、签名验签）。
 * 浏览器环境基于 jsencrypt，Node.js 环境基于内置 crypto 模块，
 * 两端采用相同的填充方式（PKCS#1 v1.5）与签名约定，密文与签名可跨环境互通。
 */
const rsaUtils = {
  /**
   * RSA 加密（公钥加密）
   * @param {string} text - 需要加密的明文
   * @param {string} publicKey - RSA 公钥（PEM 格式）
   * @returns {Promise<string | false>} 返回加密后的 Base64 字符串，失败返回 false
   * @example
   * ```typescript
   * const encrypted = await rsaUtils.encrypt('Hello World', publicKey);
   * ```
   */
  async encrypt(text: string, publicKey: string): Promise<string | false> {
    return isBrowser() ? encryptBrowser(text, publicKey) : encryptNode(text, publicKey);
  },

  /**
   * RSA 解密（私钥解密）
   * @param {string} encryptedText - 需要解密的 Base64 密文
   * @param {string} privateKey - RSA 私钥（PEM 格式）
   * @returns {Promise<string | false>} 返回解密后的原文，失败返回 false
   * @example
   * ```typescript
   * const decrypted = await rsaUtils.decrypt(encryptedText, privateKey);
   * ```
   */
  async decrypt(encryptedText: string, privateKey: string): Promise<string | false> {
    return isBrowser()
      ? decryptBrowser(encryptedText, privateKey)
      : decryptNode(encryptedText, privateKey);
  },

  /**
   * 生成 RSA 密钥对
   * @param {number} [keySize=2048] - 密钥长度（位），默认 2048，推荐使用 2048 及以上
   * @returns {Promise<{ publicKey: string; privateKey: string } | null>} 返回密钥对对象，失败返回 null
   * @example
   * ```typescript
   * const keyPair = await rsaUtils.generateKeyPair(2048);
   * if (keyPair) {
   *   console.log(keyPair.publicKey);  // "-----BEGIN PUBLIC KEY-----..."
   *   console.log(keyPair.privateKey); // "-----BEGIN PRIVATE KEY-----..."
   * }
   * ```
   */
  async generateKeyPair(
    keySize: number = 2048
  ): Promise<{ publicKey: string; privateKey: string } | null> {
    return isBrowser() ? generateKeyPairBrowser(keySize) : generateKeyPairNode(keySize);
  },

  /**
   * RSA 签名（私钥签名）
   * @param {string} text - 需要签名的原文
   * @param {string} privateKey - RSA 私钥（PEM 格式）
   * @param {RSAHashAlgorithm} [hashAlg='SHA256'] - 哈希算法，默认 SHA256
   * @returns {Promise<string | false>} 返回签名后的 Base64 字符串，失败返回 false
   * @example
   * ```typescript
   * const signature = await rsaUtils.sign('Hello World', privateKey, 'SHA256');
   * ```
   */
  async sign(
    text: string,
    privateKey: string,
    hashAlg: RSAHashAlgorithm = 'SHA256'
  ): Promise<string | false> {
    return isBrowser()
      ? signBrowser(text, privateKey, hashAlg)
      : signNode(text, privateKey, hashAlg);
  },

  /**
   * RSA 验签（公钥验签）
   * @param {string} text - 原文
   * @param {string} signature - Base64 签名
   * @param {string} publicKey - RSA 公钥（PEM 格式）
   * @param {RSAHashAlgorithm} [hashAlg='SHA256'] - 哈希算法，需与签名时一致，默认 SHA256
   * @returns {Promise<boolean>} 验签通过返回 true，否则返回 false
   * @example
   * ```typescript
   * const isValid = await rsaUtils.verify('Hello World', signature, publicKey, 'SHA256');
   * console.log(isValid); // true
   * ```
   */
  async verify(
    text: string,
    signature: string,
    publicKey: string,
    hashAlg: RSAHashAlgorithm = 'SHA256'
  ): Promise<boolean> {
    return isBrowser()
      ? verifyBrowser(text, signature, publicKey, hashAlg)
      : verifyNode(text, signature, publicKey, hashAlg);
  }
};

export default rsaUtils;
export type { RSAHashAlgorithm };
