<!-- #region common -->

## lamp-web-max-vben 简介

基于vue-vben-admin 5.x版本进行二次开发的系统。该项目是基于 radix-vue、Vue3.x、Vite、 Ant-Design-Vue4.x 、TypeScript 的中后台解决方案，目标是为中大型项目开发,提供现成的开箱解决方案及丰富的示例。  

详情的使用文档请参考他们的官方文档：

- vben：[https://doc.vben.pro/](https://doc.vben.pro/)
- ant-design-vue： [https://www.antdv.com/](https://www.antdv.com/)

## 环境要求

- `Node.js`:  >= `20.10.0`  
- `pnpm` :  >= `9.12.0`
- 推荐使用 [fnm](https://github.com/Schniz/fnm) 、 [nvm](https://github.com/nvm-sh/nvm) 或者直接使用[pnpm](https://pnpm.io/cli/env) 进行版本管理。

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

- 注意存放代码的目录及所有父级目录不能存在中文、韩文、日文以及空格，否则安装依赖后启动会出错。

- 项目只支持使用 `pnpm` 进行依赖安装，默认会使用 `corepack` 来安装指定版本的 `pnpm`。:
- 如果你的网络环境无法访问npm源，你可以设置系统的环境变量`COREPACK_NPM_REGISTRY=https://registry.npmmirror.com`，然后再执行`pnpm install`。
- 如果你不想使用`corepack`，你需要禁用`corepack`，然后使用你自己的`pnpm`进行安装。

:::

```shell
# 拉取项目代码
git clone http://git.tangyh.top/zuihou/lamp-web-max-vben.git

cd lamp-web-max-vben

# 使用项目指定的pnpm版本进行依赖安装
corepack enable

# 安装依赖
pnpm install --registry=https://registry.npmmirror.com
```

<!-- #endregion common -->

## 修改配置

1. 根据自己的需求修改 [.env.development](http://git.tangyh.top/zuihou/lamp-web-max-vben/blob/main/apps/web-antd/.env.development) 文件，VITE_PROXY 参数改成跟后端对应的模式

   根据后端启动的方式，只需要修改 ==target== 参数，其他参数不需要修改。

   ![](/images/start/后端启动方式.png)

   单体版：配置为BootServerApplication的端口

   微服务版：配置为GatewayServerApplication的端口

   ```properties{7,13,18}
   # 本地启动时，代理地址
   VITE_PROXY=`{
   "cloud": [{
     "proxyKey": "/api",
     "rewriteBefore": "/api",
     "rewriteAfter": "/api",
     "target": "http://localhost:18760"
   }],
   "boot": [{
       "proxyKey": "/api/gateway",
       "rewriteBefore": "/api/gateway",
       "rewriteAfter": "/gateway",
       "target": "http://localhost:18760"
     },{
     "proxyKey": "/api",
     "rewriteBefore": "/api/[A-Za-z0-9]+",
     "rewriteAfter": "",
     "target": "http://localhost:18760"
   }]
   }`
   ```

   

2. 启动

   启动命令需要区分后端采用什么租户模式，还区分单体模式还是微服务模式。

   ::: tip

   若采用文档中的命令启动，无法正常访问时，请阅读package.json中的源码，观察命令是否与代码中一致，最终使用的命令，请使用源码中存在的。

   :::

   ::: code-tabs#tenantType

   @tab 数据源模式

   ```bash
   # 后端是 lamp-datasource-max 项目，以 单体模式（BootServerApplication） 启动
   pnpm dev:antd:cloud:datasource
   
   # 后端是 lamp-datasource-max 项目，以 微服务模式（GatewayServerApplication） 启动
   pnpm dev:antd:cloud:datasource
   ```

   @tab 字段模式

   ```bash
   # 后端是 lamp-column-max 项目，以 单体模式（BootServerApplication） 启动
   pnpm dev:antd:boot:column
   # 后端是 lamp-column-max 项目，以 微服务模式（GatewayServerApplication） 启动
   pnpm dev:antd:cloud:column
   ```

   :::

3. 打包

   启动命令只区分后端采用什么租户模式，不区分是单体模式还是微服务模式。

   ::: tip

      - pnpm build:prod:xx 会读取 .env 和 .env.production
      - pnpm build:boot 会读取.env 和 .env.boot
      - pnpm build:test 会读取.env 和 .env.test 
      - 当然，你可以通过修改 --mode xxx 来修改配置文件
   
   :::
   
   ::: code-tabs#tenantType
   
   @tab 数据源模式
   
   ```bash
   # 后端 微服务 方式部署
   pnpm build:antd:datasource	
   
   # 后端 单体 方式部署
   pnpm build:antd:boot:datasource
   ```
   
   @tab 字段模式
   
   ```bash
   # 后端 微服务 方式部署
   pnpm build:antd:column
   
   # 后端 单体 方式部署
   pnpm build:antd:boot:column
   ```
   
   :::
