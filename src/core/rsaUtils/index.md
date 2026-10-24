---
title: RSA 工具
description: 独立的非对称加密工具，提供 RSA 加解密、密钥对生成与签名验签能力
group:
  title: Core
---

## RSA 工具

### 业务场景与意图
为业务侧提供纯净的 RSA 非对称加密能力，从 `cryptoUtils` 中独立拆分，仅包含 RSA 相关功能。
适用于公钥加密敏感数据、私钥解密、私钥签名防篡改、公钥验签等场景。
浏览器环境基于 `jsencrypt`，Node.js 环境基于内置 `crypto` 模块，两端采用相同的 PKCS#1 v1.5 填充与签名约定，密文与签名可跨环境互通。

### 代码演示
```typescript
import rsaUtils from './index';

// 1. 生成密钥对
const keyPair = await rsaUtils.generateKeyPair(2048);
const { publicKey, privateKey } = keyPair!;

// 2. 加解密（公钥加密，私钥解密）
const encrypted = await rsaUtils.encrypt('Hello RSA', publicKey);
const decrypted = await rsaUtils.decrypt(encrypted!, privateKey);
console.log(decrypted); // "Hello RSA"

// 3. 签名验签（私钥签名，公钥验签）
const signature = await rsaUtils.sign('Hello RSA', privateKey, 'SHA256');
const isValid = await rsaUtils.verify('Hello RSA', signature!, publicKey, 'SHA256');
console.log(isValid); // true
```

### API 属性
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| encrypt | RSA 加密（公钥加密） | `(text: string, publicKey: string) => Promise<string \| false>` | - |
| decrypt | RSA 解密（私钥解密） | `(encryptedText: string, privateKey: string) => Promise<string \| false>` | - |
| generateKeyPair | 生成 RSA 密钥对 | `(keySize?: number) => Promise<{ publicKey: string; privateKey: string } \| null>` | `2048` |
| sign | RSA 签名（私钥签名） | `(text: string, privateKey: string, hashAlg?: 'SHA256' \| 'SHA1' \| 'MD5') => Promise<string \| false>` | `'SHA256'` |
| verify | RSA 验签（公钥验签） | `(text: string, signature: string, publicKey: string, hashAlg?: 'SHA256' \| 'SHA1' \| 'MD5') => Promise<boolean>` | `'SHA256'` |

### 边界条件与异常
* RSA 为**非对称加密**，加密使用公钥、解密使用私钥；签名使用私钥、验签使用公钥。
* 受 RSA 算法限制，单次加密明文长度不能超过密钥长度减去填充开销（2048 位密钥最多约 245 字节）。超长数据请使用 `cryptoUtils.aesEncrypt` 等对称加密，或采用 RSA+AES 混合方案。
* `encrypt`/`decrypt`/`sign` 失败时返回 `false`，不会抛出异常；具体错误信息输出到控制台。
* 浏览器端 `jsencrypt` 生成 2048 位及以上密钥较慢（纯 JS 实现），如需频繁生成建议在 Node 端预生成。
* 跨环境互通：浏览器端 `jsencrypt` 与 Node 端 `crypto` 生成的密钥对、密文、签名相互兼容。
* 验签时 `hashAlg` 必须与签名时一致，否则验签必然失败。
