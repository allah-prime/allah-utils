/**
 * Cookie操作工具类
 * 提供cookie的读取、设置、删除等功能
 */
const cookieUtils = {
  /**
   * 读取指定名称的cookie值
   * @param name cookie名称
   * @returns cookie值，如果不存在则返回null
   */
  read(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`));
    return match ? decodeURIComponent(match[3]) : null;
  },

  /**
   * 设置cookie
   * @param name cookie名称
   * @param value cookie值
   * @param options cookie选项
   */
  set(
    name: string,
    value: string,
    options: {
      expires?: Date | number;
      path?: string;
      domain?: string;
      secure?: boolean;
      sameSite?: 'Strict' | 'Lax' | 'None';
    } = {}
  ): void {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.expires) {
      if (typeof options.expires === 'number') {
        // 如果是数字，表示天数
        const date = new Date();
        date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
        cookieString += `; expires=${date.toUTCString()}`;
      } else {
        cookieString += `; expires=${options.expires.toUTCString()}`;
      }
    }

    if (options.path) {
      cookieString += `; path=${options.path}`;
    }

    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
      cookieString += '; secure';
    }

    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }

    document.cookie = cookieString;
  },

  /**
   * 删除指定名称的cookie
   * @param name cookie名称
   * @param options cookie选项（path和domain需要与设置时一致）
   */
  remove(
    name: string,
    options: {
      path?: string;
      domain?: string;
    } = {}
  ): void {
    this.set(name, '', {
      ...options,
      expires: new Date(0)
    });
  },

  /**
   * 获取所有cookie
   * @returns 包含所有cookie的对象
   */
  getAll(): Record<string, string> {
    const cookies: Record<string, string> = {};
    if (document.cookie) {
      document.cookie.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name && value) {
          cookies[decodeURIComponent(name)] = decodeURIComponent(value);
        }
      });
    }
    return cookies;
  },

  /**
   * 检查cookie是否存在
   * @param name cookie名称
   * @returns 是否存在
   */
  exists(name: string): boolean {
    return this.read(name) !== null;
  },

  /**
   * 清除所有cookie
   * @param options cookie选项
   */
  clearAll(
    options: {
      path?: string;
      domain?: string;
    } = {}
  ): void {
    const cookies = this.getAll();
    Object.keys(cookies).forEach(name => {
      this.remove(name, options);
    });
  }
};

export default cookieUtils;
