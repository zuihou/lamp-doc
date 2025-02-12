<!-- #region common -->

## lamp-web-pro-soybean 简介

本项目是基于[soybean-admin](https://docs.soybeanjs.cn/)进行二次开发，作者基于ta集成了fast-crud、vxe-table等组件，重写了vben-admin项目中的众多优雅组件，目的是希望让管理端系统开发变得更快、更简单。

详情的使用文档请参考他们的官方文档：

- soybean-admin：[https://docs.soybeanjs.cn/](https://docs.soybeanjs.cn/)
- Fast-crud: [http://fast-crud.docmirror.cn/](http://fast-crud.docmirror.cn/)
- vxe-table: [https://vxetable.cn/](https://vxetable.cn/)
- Naive-ui： [https://www.naiveui.com/zh-CN/os-theme](https://www.naiveui.com/zh-CN/os-theme)

## 环境要求

- `Node.js`:  大于 `20.5.0`

- `pnpm` :  大于8.7.0

- 文档中指定的版本号只是作者写文档时需要的版本，具体的版本号，请参考package.json中定义的版本

  ```json
  # package.json
  {
     "engines": {
      "node": ">=20.5.0",
      "pnpm": ">=8.7.0"
    },
  }
  ```

  

## 工具配置

如果您使用的 IDE 是[vscode](https://code.visualstudio.com/)(推荐)的话，可以安装以下工具来提高开发效率及代码格式化

* [Iconify IntelliSense](https://marketplace.visualstudio.com/items?itemName=antfu.iconify)\- Iconify 图标插件
* [windicss IntelliSense](https://marketplace.visualstudio.com/items?itemName=voorjaar.windicss-intellisense)\- windicss 提示插件
* [I18n-ally](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally)\- i18n 插件
* [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)\- vue 开发必备 （也可以选择 Volar）
* [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)\- 脚本代码检查
* [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)\- 代码格式化
* [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)\- css 格式化
* [DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv)\- .env 文件 高亮

## 下载源码

::: warning

注意存放代码的目录及所有父级目录不能存在中文、韩文、日文以及空格，否则安装依赖后启动会出错。

:::

```shell
// 拉取项目代码
git clone http://git.tangyh.top/zuihou/lamp-web-pro-soybean.git

cd lamp-web-pro-soybean

// 安装依赖
pnpm install --registry=https://registry.npmmirror.com
```

<!-- #endregion common -->

## 修改配置

1. 根据自己的需求修改 [.env](http://git.tangyh.top/zuihou/lamp-web-pro/blob/master/.env) 文件。（首次启动建议不要修改此文件）

   ```properties
   VITE_BASE_URL=/
   
   VITE_APP_TITLE=lamp-web-pro-soybean
   
   VITE_APP_DESC=中后台快速开发系统
   
   VITE_ROUTER_HISTORY_MODE=hash
   
   # the prefix of the icon name
   VITE_ICON_PREFIX=icon
   
   # the prefix of the local svg icon component, must include VITE_ICON_PREFIX
   # format {VITE_ICON_PREFIX}-{local icon name}
   VITE_ICON_LOCAL_PREFIX=icon-local
   
   # auth route mode: static ｜ dynamic
   VITE_AUTH_ROUTE_MODE=dynamic
   
   # static auth route home
   VITE_ROUTE_HOME=index
   
   # default menu icon
   VITE_MENU_ICON=mdi:menu
   
   # 后台接口的统一前缀
   VITE_GLOB_API_URL=/api
   
   VITE_GLOB_GRAY_VERSION=zuihou
   
   # 多租户类型
   VITE_GLOB_MULTI_TENANT_TYPE=COLUMN
   
   # 登录页是否显示验证码
   VITE_GLOB_SHOW_CAPTCHA=Y
   
   # 客户端id&秘钥 VITE_GLOB_CLIENT_ID 和 VITE_GLOB_CLIENT_SECRET 务必和def_client表中的信息保持一致
   VITE_GLOB_CLIENT_ID=lamp_web_pro_soybean
   VITE_GLOB_CLIENT_SECRET=lamp_web_pro_soybean_secret
   
   # 默认登录时加载的默认应用ID，此ID需要事先在def_application中配置
   VITE_GLOB_DEF_APPLICATION_ID="1"
   # 基础平台的应用ID，此ID需要事先在def_application中配置
   VITE_GLOB_BASE_APPLICATION_ID="1"
   # 开发运营系统的应用ID，此ID需要事先在def_application中配置
   VITE_GLOB_DEV_OPERATION_APPLICATION_ID="2"
   
   # 第三方文件预览服务 需要自行安装kkFileView（https://gitee.com/kekingcn/file-online-preview）
   VITE_GLOB_PREVIEW_URL_PREFIX="http://106.53.26.9:8012/onlinePreview?url="
   
   # 请求头中携带的token(用户身份信息) key名称
   VITE_GLOB_TOKEN_KEY=Token
   
   # 请求头中携带的租户ID key名称
   VITE_GLOB_TENANT_ID_KEY=TenantId
   
   # 请求头中携带的应用ID key名称
   VITE_GLOB_APPLICATION_ID_KEY=ApplicationId
   
   # 请求头中携带的客户端信息 key名称
   VITE_GLOB_AUTHORIZATION_KEY=Authorization
   
   # axios 请求默认超时间： 10s
   VITE_GLOB_AXIOS_TIMEOUT=10000
   
   # sourcemap
   VITE_SOURCE_MAP=N
   
   # Used to differentiate storage across different domains
   VITE_STORAGE_PREFIX=LAMP_
   ```

3. 启动

   启动命令需要区分后端采用什么租户模式，还区分单体模式还是微服务模式。

   ::: code-tabs#tenantType

   @tab 数据源模式

   ```bash
   # 后端是 lamp-datasource-max 项目，以 单体模式 启动
   pnpm dev:boot:datasource
   
   # 后端是 lamp-datasource-max 项目，以 微服务模式 启动
   pnpm dev:cloud:datasource
   ```

   @tab 字段模式
   
   ```bash
   # 后端是 lamp-column-max 项目，以 单体模式 启动
   pnpm dev:boot:column
   # 后端是 lamp-column-max 项目，以 微服务模式 启动
   pnpm dev:cloud:column
   ```
   
   :::
   
4. 打包

   启动命令只区分后端采用什么租户模式，不区分是单体模式还是微服务模式。

   ::: code-tabs#tenantType

   @tab 数据源模式

   ```bash
   # 后端是 lamp-datasource-max 项目
   pnpm build:prod:datasource	
   ```
   
   @tab 字段模式
   
   ```bash
   # 后端是 lamp-column-max 项目
   pnpm build:prod:column
   ```

   
   
   :::





