---
title: 文件工具
description: 提供文件类型判断能力，聚焦图片文件后缀识别
group:
  title: Core
---

## 文件工具

### 业务场景与意图
该模块面向“文件类型快速识别”的业务诉求，尤其适合上传前校验、图片预览列表过滤、素材管理等场景。核心意图是通过文件名后缀判断是否为图片类型，以降低对文件内容读取的成本，并在前端交互链路中提前拦截不符合要求的文件。

常见使用流程如下：
- 用户选择文件后，先用 isImageFile 进行粗筛
- 通过的文件进入预览或上传队列
- 未通过的文件提示用户或进入其他处理流程

### 边界条件与注意事项
- 该方法仅基于文件名后缀判断，不会解析文件内容
- 对大小写不敏感，可识别 JPG/JPEG/PNG/GIF/BMP/HEIC 等后缀
- 仅截取最后一个点号后的内容作为扩展名
- 如果文件名为空或没有扩展名，应自行在调用侧做防御处理

### 代码演示

以下示例覆盖多种真实业务输入形态，便于直接拷贝使用。

最基础的判断示例，展示图片与非图片的区分结果。
```typescript
import { fileUtils } from './index';

const isAvatar = fileUtils.isImageFile('avatar.png');
const isDoc = fileUtils.isImageFile('report.pdf');

console.log(isAvatar); // true
console.log(isDoc); // false
```

批量文件名判断，常用于上传列表或资源库的批处理筛选。
```typescript
import { fileUtils } from './index';

const imageNames = [
  'a.jpg',
  'b.jpeg',
  'c.png',
  'd.gif',
  'e.bmp',
  'f.heic',
  'g.JPG',
  'h.JPEG'
];

const results = imageNames.map((name) => ({
  name,
  ok: fileUtils.isImageFile(name)
}));

console.log(results);
```

包含多段后缀与带查询参数的文件名示例，展示真实 URL/文件名输入时的结果。
```typescript
import { fileUtils } from './index';

const filenames = [
  'cover.photo.png',
  'archive.tar.gz',
  'avatar.png?size=120',
  'report.final.v2.PDF'
];

const map = filenames.map((name) => fileUtils.isImageFile(name));
console.log(map);
```

混合列表过滤，快速得到仅图片文件的子集。
```typescript
import { fileUtils } from './index';

const mixedList = [
  'cat.png',
  'dog.jpg',
  'readme.md',
  'data.json',
  'movie.mp4',
  'icon.GIF'
];

const onlyImages = mixedList.filter((name) => fileUtils.isImageFile(name));
console.log(onlyImages);
```

结合上传队列对象结构，只对 name 字段做判断。
```typescript
import { fileUtils } from './index';

const uploadQueue = [
  { name: '自拍.heic', size: 120_000 },
  { name: '名片.JPG', size: 32_000 },
  { name: '合同.pdf', size: 88_000 }
];

const imageQueue = uploadQueue.filter((item) => fileUtils.isImageFile(item.name));
console.log(imageQueue);
```

集合判定场景，检查一组文件名是否全部为图片。
```typescript
import { fileUtils } from './index';

const set = new Set([
  'cover.png',
  'cover.PNG',
  'notes.txt'
]);

const isAllImages = [...set].every((name) => fileUtils.isImageFile(name));
console.log(isAllImages);
```

空值防御示例，避免在调用侧传入空字符串导致误判。
```typescript
import { fileUtils } from './index';

const optionalName = '';
const safeCheck = optionalName ? fileUtils.isImageFile(optionalName) : false;
console.log(safeCheck);
```

根据是否为图片进行分组，适用于图库与非图库分离展示。
```typescript
import { fileUtils } from './index';

const nameList = [
  '2024-01-01.png',
  '2024-01-01.jpg',
  '2024-01-01.xlsx'
];

const grouped = nameList.reduce(
  (acc, name) => {
    if (fileUtils.isImageFile(name)) acc.images.push(name);
    else acc.others.push(name);
    return acc;
  },
  { images: [] as string[], others: [] as string[] }
);

console.log(grouped);
```

快速判断是否包含任意图片文件，用于开关逻辑或提示。
```typescript
import { fileUtils } from './index';

const batch = [
  'A.B.C.PNG',
  'D.E.F.jpeg',
  'G.H.I.docx'
];

const hasAnyImage = batch.some((name) => fileUtils.isImageFile(name));
console.log(hasAnyImage);
```
