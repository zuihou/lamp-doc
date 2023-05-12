---
title: FastDFS
index: false
category:
  - 部署
tag:
  - 部署
  - FastDFS
---

## FastDFS

FastDFS 是一个开源的高性能分布式文件系统（DFS）。 它的主要功能包括：文件存储，文件同步和文件访问，以及高容量和负载平衡。主要解决了海量数据存储问题，特别适合以中小文件（建议范围：4KB < file_size <500MB）为载体的在线服务。

FastDFS 系统有三个角色：跟踪服务器(Tracker Server)、存储服务器(Storage Server)和客户端(Client)。

- Tracker Server：跟踪服务器，主要做调度工作，起到均衡的作用；负责管理所有的 storage server和 group，每个 storage 在启动后会连接 Tracker，告知自己所属 group 等信息，并保持周期性心跳。
- Storage Server：存储服务器，主要提供容量和备份服务；以 group 为单位，每个 group 内可以有多台 storage server，数据互为备份。
- Client：客户端，上传下载数据的服务器，也就是我们自己的项目所部署在的服务器。



### 安装服务器

| 软件             |         机器         |  系统  |
| :--------------- | :------------------: | :----: |
| Tracker          | 192.168.65.129:22122 | CentOS |
| FashDHT          | 192.168.65.129:22122 | CentOS |
| Group1-Storage11 | 192.168.65.130:23000 | CentOS |

### 所需安装包

* db-6.2.32.tar.gz
* fastdht-master.zip
* libfastcommon-master.zip
* FastDFS_v5.05.tar.gz
* fastdfs-nginx-module_v1.16.tar.gz
* ngx_cache_purge-2.1.tar.gz  (可选)
* nginx-1.10.3.tar.gz

### 文件夹初始化

* 配置tracker所需的base_path:
    + 192.168.65.129机子上创建 /home/zuihou/fastdfs/tracker/
* 配置storage所需的日志目录:
    + 192.168.65.130机子上创建/home/zuihou/fastdfs/storage/logs
* 配置storage所需的存储文件目录:
    + 192.168.65.130机子上创建/home/zuihou/fastdfs/storage/data

### 安装libfastcommon-1.0.7.zip

在2台服务器上同时安装libfastcommon

```shell
 unzip libfastcommon-master.zip
 sudo mv libfastcommon-master /usr/local/src/
 cd /usr/local/src/libfastcommon-master
 ./make.sh
 sudo ./make.sh install
 
 sudo ln -s /usr/lib64/libfastcommon.so /usr/local/lib/libfastcommon.so
 sudo ln -s /usr/lib64/libfastcommon.so /usr/lib/libfastcommon.so
 sudo ln -s /usr/lib64/libfdfsclient.so /usr/local/lib/libfdfsclient.so   # 未安装
 sudo ln -s /usr/lib64/libfdfsclient.so /usr/lib/libfdfsclient.so         # 未安装
```

### 安装FastDFS

在2台服务器上同时安装FastDFS

```shell
 sudo mv FastDFS /usr/local/src/
 cd /usr/local/src/FastDFS
 ./make.sh
 sudo ./make.sh install
 
 cd /etc/fdfs/
 sudo cp client.conf.sample client.conf
 sudo cp storage.conf.sample storage.conf
 sudo cp tracker.conf.sample tracker.conf
 sudo chown -R zuihou:zuihou /etc/fdfs/
```

### 配置Tracker

```shell
vim tracker.conf

base_path=/home/zuihou/fastdfs/tracker
reserved_storage_space = 10%  # 注意这里，若虚拟机硬盘小于4g，则需要手动指定小一点的空间， 否则启动会报错说硬盘空间不足
http.server_port=6080

vim client.conf

base_path=/home/zuihou/fastdfs/tracker
tracker_server=192.168.65.129:22122  # 这里若有多台，则配置多个 不能配置127.0.0.1
http.tracker_server_port=6080
```

### 配置storage

```shell
vim storage.conf

disabled=false            #启用配置文件
group_name=group1
port=23000     #设置storage的端口号，默认是23000，同一个组的storage端口号必须一致
base_path=/home/zuihou/fastdfs/storage
store_path_count=1   #存储路径个数，需要和store_path个数匹配
store_path0=/home/zuihou/fastdfs/storage
tracker_server=192.168.65.129:22122 #tracker服务器的IP地址和端口号 这里若有多台，则配置多个  不能配置127.0.0.1
http.server_port=7888
```
### 启动tracker

在服务器：192.168.65.129

 ```shell
 /usr/bin/fdfs_trackerd  /etc/fdfs/tracker.conf  restart
 ```

### 启动storage

在服务器：192.168.65.130

```shell
/usr/bin/fdfs_storaged  /etc/fdfs/storage.conf  restart
```

### 验证

启动完毕后，可以通过以下两个方法查看FastDFS是否启动成功

* 查看`22122/23000`端口监听情况 

  ```shell
  netstat -unltp|grep fdfs
  ```

* 通过以下命令查看tracker的启动日志，看是否有错误:

  ```shell
  tail -100f  /home/zuihou/fastdfs/tracker/logs/trackerd.log
  ```

* 通过以下命令查看storage的启动日志，看是否有错误:

  ```shell
  tail -100f  /home/zuihou/fastdfs/storage/logs/storaged.log
  ```

### 设置开机启动

如果启动没有问题，可以通过以下步骤，将tracker的启动添加到服务器的开机启动中:

* 打开文件rc.local

  ```shell
   vi /etc/rc.d/rc.local
  ```

* 将如下命令添加到该文件中

  ```shell
  /usr/bin/fdfs_trackerd  /etc/fdfs/tracker.conf  restart
  ```

* 将如下命令添加到该文件中

  ```shell
  /usr/bin/fdfs_storaged  /etc/fdfs/storage.conf  restart
  ```

### 创建服务

```shell
ln -s /usr/bin/fdfs_trackerd /usr/local/bin
ln -s /usr/bin/stop.sh /usr/local/bin
ln -s /usr/bin/restart.sh /usr/local/bin

ln -s /usr/bin/fdfs_storaged /usr/local/bin
```
通过命令启动Tracker服务器：`service fdfs_trackerd start`
通过命令启动Storage服务器：`service fdfs_storaged start`

### 常见问题

1. 启动storage报错

   ```shell
   [2014-05-30 16:22:21] ERROR - file: fdht_client/fdht_func.c, line: 361, invalid group count: 0 <= 0!
   [2014-05-30 16:22:21] CRIT - exit abnormally!
   ```

   答: check_file_duplicate=0  # 先将这个设置成0， 在安装了FastDHT后，才将它设置为1，否则启动会报错

### 配置客户端

测试时需要设置客户端的配置文件，编辑/etc/fdfs/client.conf 文件，打开文件后依次做以下修改：

```shell
vim /etc/fdfs/client.conf

base_path=/home/zuihou/fastdfs/tracker #tracker服务器文件路径
tracker_server=192.168.65.129:22122 #tracker服务器IP地址和端口号
http.tracker_server_port=6080 # tracker 服务器的 http 端口号，必须和tracker的设置对应起来
```
### 执行上传

```shell
/usr/bin/fdfs_upload_file  /etc/fdfs/client.conf  /home/zuihou/tools/fastdfs/logo.jpg
```

执行上面的命令若返回一个url地址，说明FastDFS已经安装成功:

```shell
http://192.168.65.129:6080/group1/M00/00/00/e_lMd1kgST-AQAodAAATIDVcVxc531.jpg
```

### 访问


上面返回地址是无法直接访问的，因为FastDFS目前已不支持http协议，我们在FastDFS 5.0.5的版本更新日志中可以看到这样一条信息

```properties
* remove embed HTTP support
```
作者提供了nginx上使用FastDFS的模块fastdfs-nginx-module来解决访问的问题。



## 安装nginx和fastdfs-nginx-module

### 安装fastdfs-nginx-module模块 

```shell
cd /usr/local/src/fastdfs-nginx-module
vim config # 修改如下2行代码
CORE_INCS="$CORE_INCS /usr/include/fastdfs /usr/include/fastcommon/"
CORE_LIBS="$CORE_LIBS -L/usr/lib64 -lfastcommon -lfdfsclient"
```

### 安装Nginx

::: tip

若你的nginx安装了fastdfs-nginx-module，当fastdfs没有启动时，nginx也无法启动。

:::

```shell
cd /usr/local/src/nginx-1.10.3

./configure --user=zuihou --group=zuihou --prefix=/usr/local/nginx --add-module=/usr/local/src/fastdfs-nginx-module/src --add-module=/usr/local/src/ngx_cache_purge-2.1
./configure --user=zuihou --group=zuihou --prefix=/usr/local/nginx --add-module=/usr/local/src/ngx_cache_purge-2.1
make
sudo make install
```
### 配置Nginx

1. 修改nginx.conf

   vim /usr/local/nginx/conf/nginx.conf   加上下面的配置

   ```sehll
   include ./fastdfs.conf; 
   ```

2. 创建 fastdfs.conf

   vim /usr/local/nginx/conf/fastdfs.conf， 在文件中加入下方配置

   ```shell
   tcp_nopush     on;
   
   server_names_hash_bucket_size 128;
   client_header_buffer_size 32k;
   large_client_header_buffers 4 32k;
   
   client_max_body_size 300m;
   
   proxy_redirect off;
   proxy_set_header Host $http_host;
   proxy_set_header X-Real-IP $remote_addr;
   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
   
   proxy_connect_timeout 90;
   proxy_send_timeout 90;
   proxy_read_timeout 90;
   
   proxy_buffer_size 16k;
   proxy_buffers 4 64k;
   proxy_busy_buffers_size 128k;
   proxy_temp_file_write_size 128k;
   
   proxy_cache_path /opt/cache/nginx/proxy_cache levels=1:2
   keys_zone=http-cache:500m max_size=10g inactive=30d;
   proxy_temp_path /opt/cache/nginx/proxy_cache/tmp;
   
   upstream fdfs_group1 {
           server 192.168.65.129:7888 weight=1 max_fails=2 fail_timeout=30s;
           #server 192.168.65.128:18080 weight=1 max_fails=2 fail_timeout=30s;
   }
   upstream fdfs_group2 {
           server 192.168.65.129:7888 weight=1 max_fails=2 fail_timeout=30s;
           #server 192.168.65.128:18080 weight=1 max_fails=2 fail_timeout=30s;
   }
   
   
   server {
           listen 6080;
           #server_name www.zuihou.com;  # Here to modify the domain name by 
           server_name 192.168.65.129;
           server_tokens off;
   
           location /group1/M00 {
                   access_log /usr/local/nginx/logs/fastdfsstoragegroup1.access.log main;
               proxy_next_upstream http_502 http_504 error timeout invalid_header;
               proxy_cache http-cache;
               proxy_cache_valid  200 304 12h;
               proxy_cache_key $uri$is_args$args;
               proxy_pass http://fdfs_group1;
               expires 30d;
           }
   
           location /group2/M00 {
                   access_log /usr/local/nginx/logs/fastdfsstoragegroup2.access.log main;
               proxy_next_upstream http_502 http_504 error timeout invalid_header;
               proxy_cache http-cache;
               proxy_cache_valid  200 304 12h;
               proxy_cache_key $uri$is_args$args;
               proxy_pass http://fdfs_group2;
               expires 30d;
           }
   
           location ~/group1/M00{
                   access_log /usr/local/nginx/logs/fastdfs.access.log main;
                   root    /home/zuihou/fastdfs/storage/data;
                   ngx_fastdfs_module;
           }
   }
   ```

### 配置

```shell
cp -r /usr/local/src/fastdfs-nginx-module/src/mod_fastdfs.conf /etc/fdfs/
cp -r /usr/local/src/FastDFS/conf/http.conf /etc/fdfs/
cp -r /usr/local/src/FastDFS/conf/mime.types /etc/fdfs/
```

vim /etc/fdfs/mod_fastdfs.conf

```shell
base_path=/home/zuihou/fastdfs/storage
tracker_server=123.249.91.119:22122 #tracker服务器的IP地址以及端口号
storage_server_port=23000 #storage服务器的端口号
url_have_group_name = true #文件 url 中是否有 group 名
store_path0=/home/zuihou/fastdfs/storage # 存储路径
group_count = 1 #设置组的个数，事实上这次只使用了group1
```
建立软连接
```shell
ln  -s  /home/zuihou/fastdfs/storage/data  /home/zuihou/fastdfs/storage/M00
```

### 启动nginx

```shell
# 启动
/usr/local/nginx/sbin/nginx

# 重新加载配置
/usr/local/nginx/sbin/nginx -s reload
```

### 访问文件

```shell
http://192.168.65.129:6080/group1/M00/00/00/e_lMd1kgST-AQAodAAATIDVcVxc531.jpg
```



## FastDHT

FastDFS本身支持文件的排重处理机制，需要FastDHT作为文件hash的索引存储，FastDHT是FastDFS同一个作者的开源key-value数据库，专门解决文件去重问题。

### 安装db-6.2.32

```shell
 mv db-6.2.32 /usr/local/src
 cd /usr/local/src/db-6.2.32/build_unix
 ../dist/configure --prefix=/usr/local/db-6.2.32
 make
 make install
```

### 安装FastDHT

```shell
 mv fastdht-master /usr/local/src
 cd /usr/local/src/fastdht-master
 vim make.sh
 CFLAGS='-Wall -D_FILE_OFFSET_BITS=64 -D_GNU_SOURCE -I/usr/local/db-6.2.32/include/ -L/usr/local/db-6.2.32/lib/'
 ./make.sh
 ./make.sh install
```
###  配置FastDHT

```shell
vim /etc/fdht/fdht_servers.conf
group_count = 1
group0 = 192.168.65.129:11411
```
### 配置fdhtd.conf文件

```shell
vim /etc/fdht/fdhtd.conf
port=11411
base_path=/home/zuihou/fastdht （该目录必须是已经存在的）
cache_size = 32MB
#include /etc/fdhtd/fdht_servers.conf -> (本行前有#表示打开，如果想关闭此选项，则应该为##开头)
```
### 配置storaged.conf文件

```shell
vim /etc/fdfs/storage.conf
#是否检测上传文件已经存在。如果已经存在，则建立一个索引链接以节省磁盘空间 
check_file_duplicate=1 
#当上个参数设定为1时 ， 在FastDHT中的命名空间
key_namespace=FastDFS 
#长连接配置选项，如果为0则为短连接 1为长连接 
keep_alive=1 
#此处特别需要注意配置
#include /etc/fdht/fdht_servers.conf
```

### 启动

```shell
fdhtd /etc/fdht/fdhtd.conf 
fdhtd /etc/fdht/fdhtd.conf restart
```
### 常见报错

fdhtd: error while loading shared libraries: libdb-6.2.so: cannot open shared object file: No such file or directory

* sudo cp /usr/local/db-6.2.32/lib/libdb-6.2.so /usr/lib/
* 编辑/etc/ld.so.conf文件，在新的一行中加入库文件所在目录；
* 运行ldconfig，以更新/etc/ld.so.cache文件；

### 常用命令

| 命令                                                         | 解释                                                         |
| :----------------------------------------------------------- | ------------------------------------------------------------ |
| service fdfs_trackerd start/stop/restart                     | tracker启动/停止/重启                                        |
| service fdfs_storaged start/stop/restart                     | storage启动/停止/重启                                        |
| /usr/bin/fdfs_trackerd  /etc/fdfs/tracker.conf  start/stop/restart | tracker启动/停止/重启                                        |
| /usr/bin/fdfs_storaged  /etc/fdfs/storage.conf  start/stop/restart | storage启动/停止/重启                                        |
| /usr/bin/fdfs_monitor /etc/fdfs/storage.conf                 | 看storage服务器是否已经登记到 tracker服务器(192.168.65.129  ACTIVE代表已登记成功) |
| /usr/bin/fdfs_upload_file  /etc/fdfs/client.conf  /home/zuihou/tools/fastdfs/logo.jpg | 测试上传                                                     |


​    
