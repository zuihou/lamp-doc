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

1. 根据自己的需求修改 [.env.dev](http://git.tangyh.top/zuihou/lamp-web-pro-soybean/blob/5.x/.env.dev) 文件。

   根据后端启动的方式，只需要修改 target 参数，其他参数不需要修改。

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

3. 打包

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





