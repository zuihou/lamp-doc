---
title: Nginx
index: false
category:
  - 部署
tag:
  - 部署
  - Nginx
---

## 安装

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
    --with-stream_ssl_preread_modul
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

