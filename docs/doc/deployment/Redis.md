---
title: Redis
index: false
category:
  - 部署
tag:
  - 部署
  - Redis
---

Redis 可以通过以下方式进行安装

1. 购买云Redis服务（推荐）
2. 服务器编译安装Redis
3. 服务器上通过Docker安装Redis

本文介绍第三方安装方式，其他安装方式我相信你一定能自行解。



## 下载

[点我下载](http://git.tangyh.top/zuihou/docs/tree/master/%E8%B5%84%E6%BA%90%E6%96%87%E4%BB%B6/04dockerfile/redis) Redis的配置文件和启动脚本



## 配置

1. 在宿主机上创建目录

   此目录用于存放mysql的数据，重启docker时数据不会丢失。

   ```shell
   mkdir -p /data/docker-data/redis-data/
   ```

2. 修改启动文件

   vim start.sh 

   ```shell
   #!/bin/bash
   cur_dir=`pwd`
   
   # docker stop lamp_redis
   # docker rm lamp_redis
   
   docker run -idt -p 16379:16379 --name lamp_redis --restart=always \   # 映射端口
       -v `pwd`/redis.conf:/etc/redis/redis_default.conf \
       -v /data/docker-data/redis-data/:/data \  												# 宿主机上 存放数据目录
       -e TZ="Asia/Shanghai" \
       redis:4.0.12 redis-server /etc/redis/redis_default.conf --appendonly yes
   ```

   

## 启动

```shell
./start.sh
```



## 停止

```shell
docker stop lamp_redis
```

