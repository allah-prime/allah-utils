---
title: 加密工具
description: 跨环境加密与标识工具集，支持 UUID、MD5、RSA 与 AES 能力
group:
  title: Core
---

## 加密工具

### 业务场景与意图
为业务侧提供统一的标识生成与加密能力，兼容浏览器与 Node.js 环境的 RSA 加解密与密钥生成，适用于签名、敏感信息保护与临时标识生成等场景。

### 代码演示
```typescript
import cryptoUtils from './index';

const uuid = await cryptoUtils.uuid();
const hash = cryptoUtils.md5('hello');
const encrypted = cryptoUtils.aesEncrypt('secret', 'key123');
const decrypted = cryptoUtils.aesDecrypt(encrypted, 'key123');
```

### API 属性
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| uuid | 生成 UUID v4 | `() => Promise<string>` | - |
| md5 | 生成 MD5 哈希 | `(input: string, salt?: string) => string` | - |
| miniUuid | 生成 8 位短 UUID | `() => string` | - |
| isValidUUID | 校验 UUID 格式 | `(uuid: string) => Promise<boolean>` | - |
| rsaEncrypt | RSA 加密（跨环境） | `(text: string, publicKey: string) => Promise<string \| false>` | - |
| rsaDecrypt | RSA 解密（跨环境） | `(encryptedText: string, privateKey: string) => Promise<string \| false>` | - |
| generateRSAKeyPair | 生成 RSA 密钥对 | `(keySize?: number) => Promise<{ publicKey: string; privateKey: string } \| null>` | `1024` |
| aesEncrypt | AES 加密 | `(text: string, key: string) => string` | - |
| aesDecrypt | AES 解密 | `(encryptedText: string, key: string) => string` | - |

### 边界条件与异常
* RSA 能力在浏览器与 Node.js 环境走不同实现，非对应环境将抛出错误
* AES 解密若密钥错误或数据损坏会抛出异常
