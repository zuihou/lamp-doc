---
title: 单机版Nacos启动
icon: config2
category:
  - 快速启动
tag:
  - 快速启动
  - 单机版Nacos启动
---
<!-- #region base -->
## Nacos 安装

建议参考并认真阅读官方文档： [https://nacos.io/zh-cn/docs/quick-start.html](https://nacos.io/zh-cn/docs/quick-start.html)

::: danger 

- nacos和seata服务需要和项目服务（如lamp-base-server服务、lamp-gatwway-server服务等）通信的，请勿在开发电脑上连接阿里云等云环境的nacos和seata！ （除非开发者的网络也有公网ip！）
- 上面一条并不是说：不能在云环境部署项目，只要保证nacos、seata和SpringCloud 服务在内网可以互相访问的环境即可！
- 部署nacos 2.x的服务器，请保持7848、8848、9848、9849  等4个端口畅通。具体请参考官方文档： https://nacos.io/docs/latest/manual/admin/deployment/deployment-overview/
- 目前Nacos官方仅支持MySQL数据库，若你的项目业务使用其他数据库，
  
  - 建议1：单独部署MySQL给Nacos使用；
  - 建议2：修改Nacos源码适配其他数据库；
  - 建议3：去Nacos官方提Issue，让官方支持。

:::

## 安装步骤

1. 从官网下载官方安装包
   您可以从 [最新稳定版本](https://github.com/alibaba/nacos/releases) 下载==nacos-server-xxx.zip==包，解压到 D:\developer\nacos

```shell
unzip nacos-server-$version.zip 或者 tar -xvf nacos-server-$version.tar.gz
```

![](/images/start/nacos目录介绍.png)

2. 解压nacos压缩包， 进入nacos文件夹，并修改`D:/developer/nacos/conf/application.properties` 文件, 修复配置：

    ```properties
    spring.datasource.platform=mysql
    db.num=1
    db.url.0=jdbc:mysql://127.0.0.1:3306/lamp_nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
    db.user=root
    db.password=root
    
    nacos.core.auth.enabled=true
    nacos.core.auth.server.identity.key=nacos
    nacos.core.auth.server.identity.value=nacos
    nacos.core.auth.plugin.nacos.token.secret.key=lamp012345678901234567890123456789012345678901234567890123456789
    nacos.console.ui.enabled=true
    ```

3. 创建数据库

   ```sql
   CREATE DATABASE `lamp_nacos` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
   ```

4. 向lamp_nacos库中导入nacos需要的数据库脚本： `D:/developer/nacos/conf/mysql-schema.sql`  

   ::: tip

   - mysql-schema.sql 这个脚本位于 nacos 压缩包中，请认真查看nacos压缩包中的内容，找到该sql文件！
   - 若nacos/conf 目录中没有 mysql-schema.sql 文件，可以看看其他.sql结尾的文件，若里面含有创表SQL，也可以试试。
   
   :::
   
5. 启动nacos服务，进入`bin`目录，执行命令启动

- Linux/Unix/Mac: `sh startup.sh -m standalone`

- Windows: `cmd startup.cmd -m standalone` 运行文件。
6. 访问nacos管理台验证系统是否启动成功
   - 地址：[http://localhost:8848/nacos/](http://localhost:8848/nacos/)
   - 账号:   nacos
   - 密码：nacos

7. 从nacos2.0.0开始，需要确保7848、8848、9848、9849 四个端口可以正常访问，不能被防火墙等限制。
<!-- #endregion base -->
