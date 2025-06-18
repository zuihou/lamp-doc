---
title: 用Docker部署
index: false
category:
  - 部署
tag:
  - 部署
  - 用Docker部署
---

## 验证docker安装是否成功

```shell
docker version

Client: Docker Engine - Community
 Version:           18.09.0
 API version:       1.39
 Go version:        go1.10.4
 Git commit:        4d60db4
 Built:             Wed Nov  7 00:46:51 2018
 OS/Arch:           linux/amd64
 Experimental:      false

Server: Docker Engine - Community
 Engine:
  Version:          18.09.0
  API version:      1.39 (minimum version 1.12)
  Go version:       go1.10.4nux/amd64
  Experimental:     false
```

## 初始化路径

```
mkdir -p /data/
```

## 将jar制作成镜像

1. 编译项目

   ```shell
   clean install -DskipTests=true -T8 -f pom.xml
   ```

2. 执行镜像

   :::code-tabs

   @tab lamp-cloud

   ```shell
   cd lamp-base/lamp-base-server
   docker build --build-arg JAR_FILE=target/lamp-base-server.jar -t zuihou/lamp-base-server:4.13.1 .
   
   cd lamp-oauth/lamp-oauth-server
   docker build --build-arg JAR_FILE=target/lamp-oauth-server.jar -t zuihou/lamp-oauth-server:4.13.1 .
   
   cd lamp-system/lamp-system-server
   docker build --build-arg JAR_FILE=target/lamp-system-server.jar -t zuihou/lamp-system-server:4.13.1 .
   
   cd lamp-generator/lamp-generator-server
   docker build --build-arg JAR_FILE=target/lamp-generator-server.jar -t zuihou/lamp-generator-server:4.13.1 .
   
   cd lamp-gateway/lamp-gateway-server
   docker build --build-arg JAR_FILE=target/lamp-gateway-server.jar -t zuihou/lamp-gateway-server:4.13.1 .
   ```

   @tab lamp-boot

   ```shell
   cd lamp-boot-server
   docker build --build-arg JAR_FILE=target/lamp-boot-server.jar -t zuihou/lamp-boot-server:4.13.1 .
   ```

   :::

## 使用docker启动项目

1.  将 nacos、mysql、redis 启动， 并将 nacos 里面的 redis、mysql 等IP地址修改为正确的IP

   切记：使用docker时，所有的IP都不能为127.0.0.1

2. 在 nacos 里面新建  zuihou-authority-server-docker.yml ,并将所有zuihou-authority-server-dev.yml 里面的配置复制过去，修改docker环境和dev环境的差异部分部分。

   ```shell
   docker run -idt  --name lamp-base-server --restart=always \
           -e NACOS_IP=192.168.1.181 \
           -e NACOS_PORT=8848 \
           -e NACOS_NAMESPACE=19f17008-8ed9-4ba5-a7e6-a09308b97e8d \
           -p 18764:18764 \
           -v /data/:/Users/tangyh/data/projects/ \
           zuihou/lamp-base-server:4.13.1
   
   docker run -idt  --name lamp-oauth-server --restart=always \
           -e NACOS_IP=192.168.1.181 \
           -e NACOS_PORT=8848 \
           -e NACOS_NAMESPACE=19f17008-8ed9-4ba5-a7e6-a09308b97e8d  \
           -p 18773:18773 \
           -v /data/:/Users/tangyh/data/projects/ \
           zuihou/lamp-oauth-server:4.13.1
           
   docker run -idt  --name lamp-system-server --restart=always \
           -e NACOS_IP=192.168.1.181 \
           -e NACOS_PORT=8848 \
           -e NACOS_NAMESPACE=19f17008-8ed9-4ba5-a7e6-a09308b97e8d  \
           -p 18778:18778 \
           -v /data/:/Users/tangyh/data/projects/ \
           zuihou/lamp-system-server:4.13.1 
           
   docker run -idt  --name lamp-generator-server --restart=always \
           -e NACOS_IP=192.168.1.181 \
           -e NACOS_PORT=8848 \
           -e NACOS_NAMESPACE=19f17008-8ed9-4ba5-a7e6-a09308b97e8d \
           -p 18780:18780 \
           -v /data/:/Users/tangyh/data/projects/ \
           zuihou/lamp-generator-server:4.13.1      
           
   docker run -idt  --name lamp-gateway-server --restart=always \
           -e NACOS_IP=192.168.1.181 \
           -e NACOS_PORT=8848 \
           -e NACOS_NAMESPACE=19f17008-8ed9-4ba5-a7e6-a09308b97e8d  \
           -p 18760:18760 \
           -v /data/:/Users/tangyh/data/projects/ \
           zuihou/lamp-gateway-server:4.13.1               
   ```

   参数介绍

   - `-e NACOS_IP=192.168.1.181 `  

     指定服务器启动时连接那个nacos

   - `-e NACOS_PORT=8848`

     指定服务器启动时连接nacos的端口号

   - `-e NACOS_NAMESPACE=19f17008-8ed9-4ba5-a7e6-a09308b97e8d`

     指定服务器启动时连接nacos的命名空间

   - `-v /data/:/Users/tangyh/data/projects/`

     /data/ 表示宿主机的目录，/Users/tangyh/data/projects/ 表示容器内部的文件日志目录

     ```properties
     文件： src/main/filters/config-dev.properties
     
     # 日志存储路径 将此目录映射到宿主机 /data/logs/ 方便查看日志
     logging.file.path=/Users/tangyh/data/projects/logs
     ```

     
