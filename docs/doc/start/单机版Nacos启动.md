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
- 部署nacos 2.x的服务器，需要使其防火墙开通7848、8848、9848、9849  四个端口。
- 目前Nacos官方仅支持MySQL数据库，若你的项目业务使用其他数据库，
  
  - 建议1：单独部署MySQL给Nacos使用；
  - 建议2：修改Nacos源码适配其他数据库；
  - 建议3：去Nacos官方提Issue，让官方支持。

:::

## 安装步骤

1. 从官网下载官方安装包
   您可以从 [最新稳定版本](https://github.com/alibaba/nacos/releases) 下载==nacos-server-2.2.0.zip==包，解压到 D:\developer\nacos2020

```shell
unzip nacos-server-$version.zip 或者 tar -xvf nacos-server-$version.tar.gz
```

![](/images/start/nacos目录介绍.png)

2. 伸手党可以从  [视频软件下载](/doc/info/视频软件下载) 中下载 nacos220.zip ，里面的nacos已经给你配置好了，只需要修改数据库的账号密码即可

3. 解压nacos压缩包， 进入nacos文件夹，并修改`D:/developer/nacos220/conf/application.properties` 文件, 调整数据库配置：

    ```properties
    spring.datasource.platform=mysql
    db.num=1
    db.url.0=jdbc:mysql://127.0.0.1:3306/lamp_nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
    db.user=root
    db.password=root
    ```

4. 创建数据库

   ```sql
   CREATE DATABASE `lamp_nacos` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
   ```

5. 向lamp_nacos库中导入nacos需要的数据库脚本： `D:/developer/nacos220/conf/nacos-mysql.sql`  

   ::: tip

   nacos-mysql.sql 这个脚本位于 nacos 压缩包中，请认真查看nacos压缩包中的内容，找到该sql文件！

   :::

6. 启动nacos服务，进入`bin`目录，执行命令启动

- Linux/Unix/Mac: `sh startup.sh -m standalone`

- Windows: `cmd startup.cmd -m standalone` 运行文件。
7. 访问nacos管理台验证系统是否启动成功
   - 地址：[http://localhost:8848/nacos/](http://localhost:8848/nacos/)
   - 账号:   nacos
   - 密码：nacos

8. 从nacos2.0.0开始，需要开通7848、8848、9848、9849 四个端口。
<!-- #endregion base -->
