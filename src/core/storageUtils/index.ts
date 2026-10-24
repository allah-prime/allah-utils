type IDataType = 'object' | 'array' | 'string';

type ICache = 'local' | 'session';

// 获取适当的存储对象（localStorage 或 uni）
const getStorage = (type: ICache = 'local') => {
  if (typeof window !== 'undefined') {
    if (type === 'local') {
      return {
        getItem: (key: string) => localStorage.getItem(key),
        setItem: (key: string, value: string) => localStorage.setItem(key, value),
        removeItem: (key: string) => localStorage.removeItem(key)
      };
    }
    return {
      getItem: (key: string) => sessionStorage.getItem(key),
      setItem: (key: string, value: string) => sessionStorage.setItem(key, value),
      removeItem: (key: string) => sessionStorage.removeItem(key)
    };
  } else if (typeof uni !== 'undefined') {
    return {
      getItem: (key: string) => uni.getStorageSync(key),
      setItem: (key: string, value: string) => uni.setStorageSync(key, value),
      removeItem: (key: string) => uni.removeStorageSync(key)
    };
  }
  throw new Error('No storage mechanism available');
};

const storageUtils = {
  /**
   * 获取存储的项目并解析为相应的数据类型
   * @param key 存储项的键
   * @param cacheType
   * @returns 存储项的值，解析后的数据
   */
  getItem: <T = any>(key: string, cacheType?: ICache): T => {
    const storage = getStorage(cacheType);
    const str = storage.getItem(key) || '';
    if (str) {
      try {
        const parsed = JSON.parse(str);
        switch (parsed.type) {
          case 'object':
            return parsed.data as T;
          case 'array':
            return parsed.data as T;
          case 'string':
            return parsed.data as T;
          default:
            return parsed.data as T;
        }
      } catch (e) {
        return str;
      }
    }
    return null as T;
  },

  /**
   * 从sessionStorage中获取数据
   * @param key
   */
  getSItem: <T = any>(key: string): T => {
    return storageUtils.getItem<T>(key, 'session');
  },

  /**
   * 存储项目，并自动识别数据类型
   * @param key 存储项的键
   * @param value 要存储的值
   * @param cacheType
   */
  setItem: (key: string, value: any, cacheType?: ICache): void => {
    let type: IDataType;
    if (Array.isArray(value)) {
      type = 'array';
    } else if (typeof value === 'object') {
      type = 'object';
    } else {
      type = 'string';
    }
    const serializedValue = JSON.stringify({ type, data: value });
    const storage = getStorage(cacheType);
    storage.setItem(key, serializedValue);
  },

  /**
   * 将数据存储到 sessionStorage
   * @param key 存储项的键
   * @param value 存储项的值
   */
  setSItem: (key: string, value: any): void => {
    storageUtils.setItem(key, value, 'session');
  },

  /**
   * 删除存储项
   * @param key 存储项的键
   * @param cacheType
   */
  removeItem: (key: string, cacheType?: ICache): void => {
    const storage = getStorage(cacheType);
    storage.removeItem(key);
  },

  /**
   * 从 sessionStorage 中移除数据
   * @param key 存储项的键
   */
  removeSItem: (key: string): void => {
    storageUtils.removeItem(key, 'session');
  },

  /**
   * 检查存储项是否存在
   * @param key 存储项的键
   * @param cacheType
   * @returns 如果存储项存在则返回 true，否则返回 false
   */
  existsItem: (key: string, cacheType?: ICache): boolean => {
    const storage = getStorage(cacheType);
    const value = storage.getItem(key);
    return value !== null;
  },

  /**
   * 检查数据是否存在于 sessionStorage 中
   * @param key 存储项的键
   * @returns 如果存在则返回 true，否则返回 false
   */
  existsSItem: (key: string): boolean => {
    const item = storageUtils.getItem(key, 'session');
    return item !== null;
  }
};

export default storageUtils;
