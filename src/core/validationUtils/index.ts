/**
 * 验证工具函数
 */

/**
 * 验证工具对象
 */
const validationUtils = {
  /**
   * 验证邮箱格式
   * @param email 邮箱地址
   * @returns 是否为有效邮箱
   */
  isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * 验证手机号格式（中国大陆）
   * @param phone 手机号
   * @returns 是否为有效手机号
   */
  isPhone(phone: string): boolean {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  },

  /**
   * 验证身份证号格式（中国大陆）
   * @param idCard 身份证号
   * @returns 是否为有效身份证号
   */
  isIdCard(idCard: string): boolean {
    const idCardRegex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return idCardRegex.test(idCard);
  },

  /**
   * 验证URL格式
   * @param url URL地址
   * @returns 是否为有效URL
   */
  isUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * 验证IP地址格式
   * @param ip IP地址
   * @returns 是否为有效IP地址
   */
  isIp(ip: string): boolean {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
  },

  /**
   * 验证密码强度
   * @param password 密码
   * @param options 选项
   * @returns 密码强度等级 0-4
   */
  passwordStrength(
    password: string,
    options: {
      minLength?: number;
      requireUppercase?: boolean;
      requireLowercase?: boolean;
      requireNumbers?: boolean;
      requireSpecialChars?: boolean;
    } = {}
  ): number {
    const {
      minLength = 8,
      requireUppercase = true,
      requireLowercase = true,
      requireNumbers = true,
      requireSpecialChars = true
    } = options;
    
    let score = 0;
    
    // 长度检查
    if (password.length >= minLength) score++;
    
    // 大写字母
    if (!requireUppercase || /[A-Z]/.test(password)) score++;
    
    // 小写字母
    if (!requireLowercase || /[a-z]/.test(password)) score++;
    
    // 数字
    if (!requireNumbers || /\d/.test(password)) score++;
    
    // 特殊字符
    if (!requireSpecialChars || /[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    
    return score;
  },

  /**
   * 验证银行卡号格式
   * @param cardNumber 银行卡号
   * @returns 是否为有效银行卡号
   */
  isBankCard(cardNumber: string): boolean {
    // 移除空格和连字符
    const cleaned = cardNumber.replace(/[\s-]/g, '');
    
    // 检查是否全为数字且长度在13-19位之间
    if (!/^\d{13,19}$/.test(cleaned)) return false;
    
    // Luhn算法验证
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  },

  /**
   * 验证中文字符
   * @param text 文本
   * @returns 是否包含中文字符
   */
  hasChinese(text: string): boolean {
    return /[\u4e00-\u9fa5]/.test(text);
  },

  /**
   * 验证只包含中文字符
   * @param text 文本
   * @returns 是否只包含中文字符
   */
  isChineseOnly(text: string): boolean {
    return /^[\u4e00-\u9fa5]+$/.test(text);
  },

  /**
   * 验证数字范围
   * @param value 值
   * @param min 最小值
   * @param max 最大值
   * @returns 是否在范围内
   */
  isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  },

  /**
   * 验证字符串长度范围
   * @param str 字符串
   * @param min 最小长度
   * @param max 最大长度
   * @returns 是否在长度范围内
   */
  isLengthInRange(str: string, min: number, max: number): boolean {
    return str.length >= min && str.length <= max;
  }
};

export default validationUtils;