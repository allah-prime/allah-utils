---
title: objectUtils
description: 提供深度克隆、合并、路径访问等对象操作功能的工具集合，简化复杂对象的处理逻辑。
group:
  title: core
  order: 1
---

## objectUtils 对象工具

### 业务场景与意图
在前端开发中，经常需要对复杂的嵌套对象进行操作，如状态管理中的不可变数据更新（深拷贝）、配置项的合并、安全地访问或修改深层属性等。`objectUtils` 提供了一套完整的解决方案，避免了手动处理 `null` 检查和类型转换的繁琐，同时增强了代码的健壮性。

### 代码演示

<code src="./demos/basic.tsx">基础用法演示：包含深拷贝、合并、路径操作等核心功能</code>

### 核心 API

#### deepClone(obj)
深度克隆对象，支持 `Date`、`Array` 和嵌套对象，自动处理 `null` 和非对象类型。

```typescript
const cloned = objectUtils.deepClone(originalObj);
```

#### merge(target, ...sources)
递归合并多个对象，支持深层属性合并。

```typescript
const merged = objectUtils.merge({}, defaultOption, userOption);
```

#### get(obj, path, defaultValue)
根据路径获取对象属性值，避免 `undefined` 报错。

```typescript
const val = objectUtils.get(data, 'user.profile.name', 'Guest');
```

#### set(obj, path, value)
根据路径设置对象属性值，自动创建缺少的中间路径。

```typescript
objectUtils.set(config, 'theme.color.primary', '#1890ff');
```

#### unset(obj, path)
根据路径删除对象属性。

```typescript
objectUtils.unset(user, 'secret.token');
```

#### paths(obj, prefix)
获取对象的所有叶子节点路径。

```typescript
const allPaths = objectUtils.paths(data);
// -> ['user.name', 'user.age', 'items.0.id', ...]
```

#### buildNullStr(obj, str)
将对象中的空字符串转换为指定字符串（默认为'无'），常用于表单展示。

```typescript
const viewData = objectUtils.buildNullStr(formData, '-');
```

#### deleteTime(obj, keys)
删除对象中的时间相关字段（默认包括 `createTime`, `updateTime` 等），常用于提交表单前清理数据。

```typescript
const submitData = objectUtils.deleteTime(formData);
```

#### enumToOptions(enumObj)
将枚举对象转换为 `{ label, value }` 数组，便于 Select 组件使用。

```typescript
const options = objectUtils.enumToOptions(StatusEnum);
```

#### isSameObj(obj1, obj2)
浅比较两个对象是否相等。

```typescript
const isChanged = !objectUtils.isSameObj(prevProps, nextProps);
```
