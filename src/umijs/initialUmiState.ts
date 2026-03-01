import { AppRunModeEnum, StorageKeyEnum } from '../core/constants/systemEnum';
import storageUtils from '../core/storageUtils';

const loginPath = '/user/login';

export const getJwtToken = (): string | null => {
  return sessionStorage.getItem('jwtToken') || localStorage.getItem('jwtToken');
};

// 生成登录地址
export const buildLoginPath = (isHash: boolean, path: string = loginPath) => {
  if (isHash) {
    return `${window?.location.origin}${window?.location.pathname}#${path}`;
  }
  return `${window?.location.origin}${path}`;
};

/**
 * 登录成功后跳转页面
 * @param isHash 是否是hash
 * @param url 地址
 */
export const loginOk = (isHash: boolean, url: string) => {
  if (isHash) {
    const path = window.location.href.replace(window.location.hash, '');
    url = `${path}#${url}`;
  }
  window.location.href = url;
};

export const isLogin = () => {
  return window.location.pathname.includes(loginPath);
};

// 去登录页面
export const toLogin = (isHash: boolean, path: string) => {
  if (!isLogin()) {
    window.location.replace(buildLoginPath(isHash, path));
  }
};

export interface IInitialUmiState<U = any> {
  settings: Partial<any>;
  currentUser: U;
  loading?: boolean;
  fetchUserInfo: () => Promise<U>;
  loginVisible?: boolean;
  /**
   * 是否需要修改密码
   */
  padVisible?: boolean;
  /**
   * 是否是登录状态
   */
  isLogin?: boolean;
  /**
   * 当前的主题配置
   */
  theme: any;
  /**
   * 当前的应用信息
   */
  appInfo: IInitialUmiStateParams['appInfo'];
  /**
   * 当前应用运行的模式 - 正常模式，开发者模式 - 抢先体验模式
   */
  APP_RUN_MODE: IInitialUmiStateParams['otherInfo'];
  /**
   * 其他信息
   */
  otherInfo: IInitialUmiStateParams['otherInfo'];
  /**
   * 是否是开发者模式
   */
  isDevMode?: IInitialUmiStateParams['isDevMode'];
  /**
   * 是否是体验版模式
   */
  isAdvancedMode?: IInitialUmiStateParams['isAdvancedMode'];
}

export type IInitialUmiStateParams = {
  /**
   * 获取用户信息的方法
   */
  queryCurrent: () => Promise<any | undefined>;
  /**
   * 默认的全局配置
   */
  defaultSettings: any;
  /**
   * 是否是hash路由
   */
  isHash: boolean;
  /**
   * 白名单正则表达式，如果页面地址包含这个白名单，就不会提示进行登录
   * <br />
   * 默认值：/user/login
   */
  whiteReg?: string;
  /**
   * 触发登录的回调函数
   * <br />
   * 默认值：toLogin 跳转到登录页面
   */
  errCallback?: (e: any) => void;
  /**
   * 是否自动跳转登录页面：默认值：true
   */
  autoToLogin?: boolean;
  /**
   * 登录页面地址 - 默认值：/user/login
   */
  autoLoginPath?: string;
  /**
   * 默认的主题配置
   */
  defaultTheme?: any;
  /**
   * 当前的应用信息
   */
  appInfo: {
    name: string;
    version: string;
    buildTime: string;
  };
  /**
   * 当前应用运行的模式 - 正常模式，开发者模式 - 抢先体验模式
   */
  APP_RUN_MODE?: AppRunModeEnum;
  /**
   * 是否是开发者模式
   */
  isDevMode?: boolean;
  /**
   * 是否是体验版模式
   */
  isAdvancedMode?: boolean;
  /**
   * 其他信息
   */
  otherInfo?: any;
};

/**
 * <h3>初始化页面全局状态的方法</h3>
 * <br />
 * 当页面第一次打开的时候，会调用改方法，用于获取用户信息，并且初始化全局状态
 * <br />
 * 获取token的方法会从sessionStorage和localStorage中获取，如果获取不到，则会初始化空的用户信息。
 * <br />
 * 存储的token如果过期了，那么就会触发errCallback的回调，以便对过期的token进行处理。
 * <br />
 * 当然，如果页面是在白名单里面的，代码不会进行任何额外的操作。
 * <br />
 * 方法支持以下参数
 * <br />
 * @param queryCurrent 查用户信息的方法
 * <br />
 * @param defaultSettings 默认的全局配置
 * <br />
 * @param isHash 是否是hash路由
 * <br />
 * @param whiteReg 白名单正则
 * <br />
 * @param errCallback 异常的回调，一般是用户信息获取失败的时候触发
 * <br />
 * @param autoToLogin 是否自动跳转登录页面：默认值：true
 * <br />
 * @param autoLoginPath 登录页面地址 - 默认值：/user/login
 * <br />
 * @param defaultTheme 默认的主题配置
 * <br />
 * @param appInfo 应用的信息
 */
export const initialUmiState = async ({
  queryCurrent,
  defaultSettings,
  isHash,
  whiteReg = '/user/login',
  errCallback,
  autoToLogin = true,
  autoLoginPath = loginPath,
  defaultTheme = {},
  appInfo = {} as IInitialUmiStateParams['appInfo']
}: IInitialUmiStateParams): Promise<IInitialUmiState> => {
  // 白名单正则，用于判断是否需要跳转到登录页面
  const whiteRegExp = new RegExp(whiteReg);
  // 定义变量，判断是否是白名单地址
  const fetchUserInfo = async (): Promise<any | undefined> => {
    try {
      return await queryCurrent();
    } catch (error) {
      console.error(error);
      if (errCallback) {
        errCallback(error);
        return Promise.resolve({} as any);
      } else if (!whiteRegExp.test(window.location.href)) {
        // 如果不在白名单里面，并且开启了自动跳转登录页面，那么就会跳转到登录页面
        if (autoToLogin) {
          toLogin(isHash, autoLoginPath);
        }
      }
    }
  };
  const currentUser = await fetchUserInfo();

  // 设置当前的应用模式
  const appRunMode = storageUtils.getItem(StorageKeyEnum.APP_RUN_MODE) || AppRunModeEnum.normal;
  return {
    fetchUserInfo,
    currentUser,
    isLogin: !!currentUser?.userName,
    settings: defaultSettings,
    theme: defaultTheme,
    appInfo,
    APP_RUN_MODE: appRunMode,
    isAdvancedMode: appRunMode === AppRunModeEnum.advanced,
    isDevMode: appRunMode === AppRunModeEnum.dev,
    otherInfo: {}
  };
};

export default initialUmiState;
