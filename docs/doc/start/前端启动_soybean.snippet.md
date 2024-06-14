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

cd lamp-web-pro 

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

2. 修改 [.env.dev](http://git.tangyh.top/zuihou/lamp-web-pro-soybean/blob/master/.env.dev) 文件中：VITE_PROXY

   ::: tabs

   @tab lamp-cloud

   - 下方配置地址：http://localhost:18760 是后台服务 lamp-gateway-server 的地址

   - 可以将 http://localhost:18760 改成 https://datasource.tangyh.top 蹭lamp提供的后台服务

   ```properties
   # 若后端项目是 lamp-cloud-xxx，请使用这个配置
   VITE_PROXY=[["/api","http://localhost:18760"],["/basic-api","http://localhost:3000"],["/upload","http://localhost:3300/upload"]]
   ```

   @tab lamp-boot

   - 下方配置地址：http://localhost:18760 是后台服务 lamp-boot-server 的地址

   - 可以将 http://localhost:18760 改成 https://datasource.tangyh.top 蹭lamp提供的后台服务

   ```properties
   # 若后端项目是 lamp-boot-xxx
   VITE_PROXY=[[["/api/gateway", "/api/gateway", "/gateway"],"http://localhost:18760"], [["/api", "/api/[A-Za-z0-9]+", ""],"http://localhost:18760"]]
   ```

   :::

3. 启动

   启动命令只区分区分租户模式，无论后端是lamp-boot还是lamp-cloud。

   ::: code-tabs#tenantType

   @tab DATASOURCE

   ```bash
   pnpm dev:datasource
   ```

   @tab COLUMN

   ```bash
   pnpm dev:column
   ```

   @tab NONE

   ```bash
   pnpm dev:none
   ```

   :::

4. 打包

   打包命令只区分区分租户模式，无论后端是lamp-boot还是lamp-cloud。

   ::: code-tabs#tenantType

   @tab DATASOURCE

   ```bash
   pnpm build:datasource	
   ```

   @tab COLUMN

   ```bash
   pnpm build:column
   ```

   @tab NONE

   ```bash
   pnpm build:none
   ```

   :::





