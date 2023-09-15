---
title: Axios
index: false
category:
  - 前端
tag:
  - 前端
  - Axios
---

**axios** 请求封装存放于 [src/utils/http/axios](http://git.tangyh.top/zuihou/lamp-web-pro/tree/master/src/utils/http/axios) 文件夹内部

除 `index.ts` 文件内容需要根据项目自行修改外，其余文件无需修改

```
├── Axios.ts // axios实例
├── axiosCancel.ts // axiosCancel实例，取消重复请求
├── axiosRetry.ts  // 请求失败重试
├── axiosTransform.ts // 数据转换类
├── checkStatus.ts // 返回状态值校验
├── helper.ts  // http请求工具类，封装axios模块的公共方法
├── index.ts // 接口返回统一处理
```

### index.ts 配置说明

```typescript
function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    // 深度合并
    deepMerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        // authenticationScheme: 'Bearer',
        authenticationScheme: '',
        timeout: globSetting.axiosTimeout,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,
        // 请求头
        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform: clone(transform),
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将 prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'message',
          // 接口地址
          apiUrl: globSetting.apiUrl,
          // 接口拼接地址
          urlPrefix: urlPrefix,
          // 是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 发送请求时请求头中是否携带token
          withToken: true,
          // 发送请求时请求头中是否携带Tenant
          withTenant: true,
          // 请求失败时重试配置
          retryRequest: {
            // 是否开启重试
            isOpenRetry: false,
            // 最大重试次数
            count: 5,
            // 每次重试等待时间
            waitTime: 100,
          },
        },
      },
      opt || {},
    ),
  );
}
```

### transform 数据处理说明

类型定义，见 **axiosTransform.ts** 文件

```typescript
export abstract class AxiosTransform {
  /**
   * @description: 请求之前处理配置
   */
  beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig;

  /**
   * @description: 请求成功处理
   */
  transformResponseHook?: (res: AxiosResponse<Result>, options: RequestOptions) => any;

  /**
   * @description: 请求失败处理
   */
  requestCatchHook?: (e: Error, options: RequestOptions) => Promise<any>;

  /**
   * @description: 请求之前的拦截器
   */
  requestInterceptors?: (
    config: InternalAxiosRequestConfig,
    options: CreateAxiosOptions,
  ) => InternalAxiosRequestConfig;

  /**
   * @description: 请求之后的拦截器
   */
  responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>;

  /**
   * @description: 请求之前的拦截器错误处理
   */
  requestInterceptorsCatch?: (error: Error) => void;

  /**
   * @description: 请求之后的拦截器错误处理
   */
  responseInterceptorsCatch?: (axiosInstance: AxiosInstance, error: Error) => void;
}
```

项目默认 transform 处理逻辑（见 **index.ts** 文件），可以根据各自项目进行处理。一般需要更改的部分为下方代码，见代码注释说明。

```typescript
/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理响应数据。如果数据不是预期格式，可直接抛出错误
   */
  transformResponseHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const { t } = useI18n();
    const { isTransformResponse, isReturnNativeResponse } = options;
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res?.data;
    }
    // 错误的时候返回

    const resData = res?.data;
    if (!resData) {
      // return '[HTTP] Request has no return value';
      throw new Error(t('sys.api.apiRequestFailed'));
    }
    //  这里 code，data，msg为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { code, data, msg } = resData;

    // 这里逻辑可以根据项目进行修改
    const hasSuccess = resData && Reflect.has(resData, 'code') && code === ResultEnum.SUCCESS;
    if (hasSuccess) {
      return data;
    }

    // 在此处根据自己项目的实际情况对不同的code执行不同的操作
    // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
    let timeoutMsg = '';
    switch (code) {
      case ResultEnum.TIMEOUT:
        timeoutMsg = t('sys.api.timeoutMessage');
        const userStore = useUserStoreWithOut();
        userStore.setToken(undefined);
        userStore.logout(true);
        break;
      default:
        if (msg) {
          timeoutMsg = msg;
        }
    }

    // errorMessageMode='modal'的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
    // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示
    if (options.errorMessageMode === 'modal') {
      createErrorModal({ title: t('sys.api.errorTip'), content: timeoutMsg });
    } else if (options.errorMessageMode === 'message') {
      createMessage.error(timeoutMsg);
    }

    throw new Error(msg || t('sys.api.apiRequestFailed'));
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true, urlPrefix } = options;

    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }
    const params = config.params || {};
    const data = config.data || false;
    formatDate && data && !isString(data) && formatRequestDate(data);
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      } else {
        // 兼容restful风格
        config.url =
          config.url +
          (params.startsWith('?') ? '' : '?') +
          params +
          '&' +
          `${joinTimestamp(joinTime, false)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        if (
          Reflect.has(config, 'data') &&
          config.data &&
          (Object.keys(config.data).length > 0 || config.data instanceof FormData)
        ) {
          config.data = data;
          config.params = params;
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data),
          );
        }
      } else {
        // 兼容restful风格
        config.url = config.url + (params.startsWith('?') ? '' : '?') + params;
        config.params = undefined;
      }
    }
    return config;
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config, options) => {
    const {
      multiTenantType,
      clientId,
      clientSecret,
      tokenKey,
      tenantIdKey,
      applicationIdKey,
      authorizationKey,
    } = globSetting;

    // 添加 Token
    const token = getToken();
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      (config as Recordable).headers[tokenKey] = options.authenticationScheme
        ? `${options.authenticationScheme} ${token}`
        : token;
    }

    // 增加租户编码
    if (
      (config as Recordable)?.requestOptions?.withTenant !== false &&
      multiTenantType !== MultiTenantTypeEnum.NONE
    ) {
      (config as Recordable).headers[tenantIdKey] = getTenantId();
    }

    (config as Recordable).headers[applicationIdKey] = getApplicationId();

    // 添加客户端信息
    (config as Recordable).headers[authorizationKey] = `${Base64.encode(
      `${clientId}:${clientSecret}`,
    )}`;

    // 当前请求地址#号后的路径，需要用户后台判断该页面的数据权限
    (config as Recordable).headers['Path'] = router?.currentRoute?.value?.fullPath;

    // 灰度参数，后台服务集群启动时，可以通过该参数固定请求某个节点！
    (config as Recordable).headers['gray_version'] = 'zuihou';

    return config;
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res;
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (axiosInstance: AxiosInstance, error: any) => {
    const { t } = useI18n();
    const errorLogStore = useErrorLogStoreWithOut();
    errorLogStore.addAjaxErrorInfo(error);
    const { code, message, config } = error || {};
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none';
    const err: string = error?.toString?.() ?? '';
    let errMessage = '';

    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        errMessage = t('sys.api.apiTimeoutMessage');
      }
      if (err?.includes('Network Error')) {
        errMessage = t('sys.api.networkExceptionMsg');
      }

      if (errMessage) {
        if (errorMessageMode === 'modal') {
          createErrorModal({ title: t('sys.api.errorTip'), content: errMessage });
        } else if (errorMessageMode === 'message') {
          createMessage.error(errMessage);
        }
        return Promise.reject(error);
      }
    } catch (error) {
      throw new Error(error as unknown as string);
    }

    checkStatus(error, errorMessageMode);

    // 添加自动重试机制 保险起见 只针对GET请求
    const retryRequest = new AxiosRetry();
    const { isOpenRetry } = config.requestOptions.retryRequest;
    config.method?.toUpperCase() === RequestEnum.GET &&
      isOpenRetry &&
      // @ts-ignore
      retryRequest.retry(axiosInstance, error);
    return Promise.reject(error);
  },
};
```

### 更改参数格式

项目接口默认为 Json 参数格式，即 `headers: { 'Content-Type': ContentTypeEnum.JSON }`,

如果需要更改为 `form-data` 格式，更改 headers 的 `'Content-Type` 为 `ContentTypeEnum.FORM_URLENCODED` 即可

::: code-tabs

@tab 全局修改

```typescript{5-7}
function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    // 深度合并
    deepMerge(
      	headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
      },
      opt || {},
    ),
  );
}
```

@tab 局部修改

```typescript
export const importDict = (id: string) =>
  defHttp.request<boolean>({
    ...Api.ImportDict,
    params: { id },
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  });
```

:::

### 多个接口地址

当项目中需要用到多个接口地址时, 可以在 [src/utils/http/axios/index.ts](http://git.tangyh.top/zuihou/lamp-web-pro/blob/master/src/utils/http/axios/index.ts) 导出多个 axios 实例

```typescript
// 目前只导出一个默认实例，接口地址对应的是环境变量中的 VITE_GLOB_API_URL 接口地址
export const defHttp = createAxios();

// 需要有其他接口地址的可以在后面添加

// other api url
export const otherHttp = createAxios({
  requestOptions: {
    apiUrl: 'xxx',
  },
});
```

### 删除请求 URL 携带的时间戳参数

如果不需要 url 上面默认携带的时间戳参数 `?_t=xxx`

```typescript
const axios = new VAxios({
  requestOptions: {
    // 是否加入时间戳
    joinTime: false,
  },
});
```

### 配置超时时间

1. 修改全局超时时间

   .env 文件:

   ```properties
   # axios 请求默认超时间： 10s
   VITE_GLOB_AXIOS_TIMEOUT=10000
   ```

2. 修改单个接口的超时时间

   ```typescript
   export const selectTableList = (params: PageParams<DefGenTablePageQuery>) =>
     defHttp.request<PageResult<DefGenTableResultVO>>({
       url: `${ServicePrefixEnum.GENERATOR}/${MODULAR}/selectTableList`,
       method: RequestEnum.POST,
       timeout: 60000,   // 前端等待 60s 
       params 
     });
   
   ```

   

