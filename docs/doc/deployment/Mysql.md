---
title: Mysql
index: false
category:
  - 部署
tag:
  - 部署
  - Mysql
---

MySQL可以通过以下方式进行安装

1. 购买云MYSQL服务（推荐）
2. 服务器编译安装MySQL
3. 服务器上通过Docker安装MySQL

本文介绍第三方安装方式，其他安装方式我相信你一定能自行解。



## 下载

[点我下载](http://git.tangyh.top/zuihou/docs/tree/master/%E8%B5%84%E6%BA%90%E6%96%87%E4%BB%B6/04dockerfile/mysql8) MySQL的配置文件和启动脚本



## 配置

1. 在宿主机上创建目录

   此目录用于存放mysql的数据，重启docker时数据不会丢失。

   ```shell
   mkdir -p /data/docker-data/mysql8-data/
   ```

2. 修改启动文件

   vim start.sh 

   ```shell
   #!/bin/bash
   cur_dir=`pwd`
   
   # docker stop lamp_mysql
   # docker rm lamp_mysql
   
   docker run --name lamp_mysql --restart=always \
       -v `pwd`/conf:/etc/mysql/conf.d \
       -v /data/docker-data/mysql8-data/:/var/lib/mysql \					# 宿主机上数据存放路径
       -p 3218:3306 \              															  # 映射出来的 MySQL端口
       -e MYSQL_ROOT_PASSWORD="root" \															# root账号的密码
       -e TZ=Asia/Shanghai \
       -d mysql:8.0.19
   ```

   

## 启动

```shell
./start.sh
```



## 停止

```shell
docker stop lamp_mysql
```

