---
title: Nginx
index: false
category:
  - 部署
tag:
  - 部署
  - Nginx
---

nginx 或 openresty 任选其一

## 安装Nginx

- 下载

  ```shell
  wget http://nginx.org/download/nginx-1.22.1.tar.gz
  ```

- 依赖

  ```shell
  yum -y install gcc gcc-c++ pcre pcre-devel zlib zlib-devel openssl openssl-devel  
  ```

- 编译

  ```shell
  ./configure \
    --prefix=/usr/local/nginx \
    --with-file-aio \
    --with-threads \
    --with-http_addition_module \
    --with-http_auth_request_module \
    --with-http_dav_module \
    --with-http_flv_module \
    --with-http_gunzip_module \
    --with-http_gzip_static_module \
    --with-http_mp4_module \
    --with-http_random_index_module \
    --with-http_realip_module \
    --with-http_secure_link_module \
    --with-http_slice_module \
    --with-http_ssl_module \
    --with-http_stub_status_module \
    --with-http_sub_module \
    --with-http_v2_module \
    --with-mail \
    --with-mail_ssl_module \
    --with-stream \
    --with-stream_realip_module \
    --with-stream_ssl_module \
    --with-stream_ssl_preread_module
  ```

- 安装

  ```shell
  make && make install
  ```

- 服务方式启动 vi /lib/systemd/system/nginx.service

  ```properties
  [Unit]
  Description=nginx
  After=network.target
  
  [Service]
  Type=forking
  ExecStart=/usr/local/nginx/sbin/nginx
  ExecReload=/usr/local/nginx/sbin/nginx -s reload
  ExecStop=/usr/local/nginx/sbin/nginx -s quit
  PrivateTmp=true
  
  [Install]
  WantedBy=multi-user.target
  ```

- 启动

  ```shell
  systemctl start nginx
  ```

- 设置开机启动

  ```shell
  systemctl enable nginx
  ```

## 安装 openresty

- 下载

  ```shell
  wget https://openresty.org/download/openresty-1.25.3.1.tar.gz
  ```

- 依赖

  ```shell
  sudo yum install -y wget gcc make unzip git readline-devel pcre-devel openssl-devel zlib-devel
  ```

- 编译安装Lua

  在Lua官网选择需要的版本：[https://www.lua.org/ftp/](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fwww.lua.org%2Fftp%2F&source=article&objectId=2413443)，本次我们选择5.1.5版本

  ```shell
  # 下载&解压Lua源码
  wget https://www.lua.org/ftp/lua-5.4.6.tar.gz
  tar zxvf lua-5.4.6.tar.gz
  cd lua-5.4.6.tar.gz
  
  # 编译&安装Lua到/usr/local
  sed -i 's/INSTALL_TOP=.*/INSTALL_TOP= \/usr\/local/' Makefile
  make linux && sudo make install
  ```

  使编译安装的Lua生效

  ```shell
  # 替换原有lua
  sudo mv /usr/bin/lua /usr/bin/lua.bak
  sudo ln -sf /usr/local/bin/lua /usr/bin/lua
  
  # 验证安装
  lua -v
  ```

- 编译安装LuaJit

  ```shell
  # git迁出LuaJit仓库
  cd /root/downloads
  git clone -b v2.1 https://luajit.org/git/luajit.git luajit-2.1
  cd luajit-2.1
  
  # 编译&安装LuaJit
  make && sudo make install
  
  # 验证LuaJit安装
  luajit -v
  ```

  

- 编译安装LuaRocks

  在LuaRocks官网选择需要的版本：[https://luarocks.org/releases](https://cloud.tencent.com/developer/tools/blog-entry?target=https%3A%2F%2Fluarocks.org%2Freleases&source=article&objectId=2413443)，本次我们选择3.11.0版本

  ```shell
  # 下载&解压LuaRocks源码
  cd /root/downloads
  wget https://luarocks.org/releases/luarocks-3.11.0.tar.gz
  tar zxvf luarocks-3.11.0.tar.gz
  cd luarocks-3.11.0
  
  # 编译&安装
  ./configure && make && sudo make install
  ```

  LuaRocks安装验证&测试

  ```shell
  # luarocks安装luasocket包
  luarocks install luasocket
  
  # 在lua中引用安装的luasocket测试
  lua
  require "socket"
  ```

- 编译

  ```shell
  ./configure \
    --prefix=/usr/local/openresty \
    --with-file-aio \
    --with-threads \
    --with-http_addition_module \
    --with-http_auth_request_module \
    --with-http_dav_module \
    --with-http_flv_module \
    --with-http_gunzip_module \
    --with-http_gzip_static_module \
    --with-http_mp4_module \
    --with-http_random_index_module \
    --with-http_realip_module \
    --with-http_secure_link_module \
    --with-http_slice_module \
    --with-http_ssl_module \
    --with-http_stub_status_module \
    --with-http_sub_module \
    --with-http_v2_module \
    --with-mail \
    --with-mail_ssl_module \
    --with-stream \
    --with-stream_realip_module \
    --with-stream_ssl_module \
    --with-stream_ssl_preread_module
  ```

- 安装

  ```shell
  gmake && gmake install
  ```

- 服务方式启动 vim /lib/systemd/system/openresty.service

  ```properties
  [Unit]
  Description=openresty
  After=network.target
  
  [Service]
  Type=forking
  ExecStart=/usr/local/openresty/nginx/sbin/nginx
  ExecReload=/usr/local/openresty/nginx/sbin/nginx -s reload
  ExecStop=/usr/local/openresty/nginx/sbin/nginx -s quit
  PrivateTmp=true
  
  [Install]
  WantedBy=multi-user.target
  ```

- 启动

  ```shell
  systemctl restart openresty
  ```

- 设置开机启动

  ```shell
  systemctl enable openresty
  ```

