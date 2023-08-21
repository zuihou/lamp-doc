---
title: Nginx配置
index: false
category:
  - 部署
tag:
  - 部署
  - Nginx配置
---

`/usr/local/nginx` 目录接口如图 

```shell
./
├── client_body_temp
├── conf
│   ├── conf.d
│   │   ├── column_80.conf
│   │   ├── column_ssl_443.conf
│   │   ├── datasource_80.conf
│   │   ├── datasource_ssl_443.conf
│   │   ├── none_80.conf
│   │   ├── none_ssl_443.conf
│   ├── fastcgi.conf
│   ├── fastcgi.conf.default
│   ├── fastcgi_params
│   ├── fastcgi_params.default
│   ├── koi-utf
│   ├── koi-win
│   ├── mime.types
│   ├── mime.types.default
│   ├── nginx.conf
│   ├── nginx.conf.default
│   ├── scgi_params
│   ├── scgi_params.default
│   ├── uwsgi_params
│   ├── uwsgi_params.default
│   └── win-utf
├── fastcgi_temp
├── html
│   ├── 50x.html
│   ├── index.html
│   └── maintain.html
├── logs
│   ├── access.log
│   ├── error.log
│   ├── fastdfs.access.log
│   └── nginx.pid
├── sbin
│   ├── nginx
│   ├── nginx.bak
│   └── nginx.old
├── scgi_temp
├── ssl
│   ├── column.tangyh.top.crt
│   ├── column.tangyh.top.key
│   ├── datasource.tangyh.top.crt
│   ├── datasource.tangyh.top.key
│   ├── none.tangyh.top.crt
│   ├── none.tangyh.top.key
└── uwsgi_temp

```





## lamp-boot

::: code-tabs

@tab nginx.conf

```nginx

user  root;
worker_processes  1;

error_log  logs/error.log warn;

pid        logs/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  logs/access.log  main;

    sendfile        on;
    tcp_nopush     on;

    keepalive_timeout  65;

    # 文件上传大小限制
    client_max_body_size 512M;
    client_body_buffer_size 256k;

    # 压缩设置
    gzip on;
    gzip_static on;
    gzip_proxied any;
    gzip_min_length  5k;
    gzip_buffers     4 16k;
    gzip_comp_level 4;
    gzip_types       text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
    gzip_vary on;
    gzip_disable "MSIE [1-6]\.";

    proxy_set_header   Host $host:$server_port;
    proxy_redirect off;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_connect_timeout 60;
    proxy_read_timeout 600;
    proxy_send_timeout 600;

  	# 批量引入指定目录下的配置
    include /usr/local/nginx/conf/conf.d/*.conf;

}
```

@tab datasource_ssl_443.conf

```nginx
server {
        listen       443  ssl;

        server_name datasource.tangyh.top;
        root html;
        index index.html index.htm;
        ssl_certificate     ../ssl/datasource.tangyh.top.crt;
        ssl_certificate_key ../ssl/datasource.tangyh.top.key;
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        underscores_in_headers on;

				location /api/wsMsg/ {
    				// lamp-boot 部署的ip和端口
            proxy_pass http://172.30.30.195:18760/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection  "upgrade";
        }
        location /api/system/ {
            proxy_pass http://172.30.30.195:18760/;
        }
        location /api/base/ {
            proxy_pass http://172.30.30.195:18760/;
        }
        location /api/oauth/ {
            proxy_pass http://172.30.30.195:18760/;
        }
        location /api/generator/ {
            proxy_pass http://172.30.30.195:18760/;
        }
        location /api/file/ {
            proxy_pass http://172.30.30.195:18760/;
        }
        location /api/msg/ {
            proxy_pass http://172.30.30.195:18760/;
        }
        location /api/gateway {
            proxy_pass http://172.30.30.195:18760/gateway;
        }

        location /xxl-job-admin {
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto https;
            proxy_pass http://172.30.30.195:8767;
						proxy_redirect http:// https://;
        }

        # 文件访问配置
        location ^~ /file {
            if ($request_uri ~* ^.*\/(.*)\.(apk|java|txt|doc|pdf|rar|gz|zip|docx|exe|xlsx|ppt|pptx|jpg|png)(\?fileName=([^&]+))$) {
                add_header Content-Disposition "attachment;filename=$arg_attname";
            }
            root /data_prod/uploadfile;
            index index.html;
        }

				location ^~ / {
            root /data_prod/webapp/lamp-web-pro-datasource/dist;
            index index.html;
        }

}
```

@tab datasource_80.conf

````nginx
server {
        listen       80;
        server_name  datasource.tangyh.top;
        underscores_in_headers on;

				rewrite ^(.*)$  https://$host$1 permanent;
}
````

:::

## lamp-cloud

::: code-tabs

@tab nginx.conf

```nginx
user  root;
worker_processes  1;

error_log  logs/error.log warn;

pid        logs/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  logs/access.log  main;

    sendfile        on;
    tcp_nopush     on;

    keepalive_timeout  65;

    # 文件上传大小限制
    client_max_body_size 512M;
    client_body_buffer_size 256k;

    # 压缩设置
    gzip on;
    gzip_static on;
    gzip_proxied any;
    gzip_min_length  5k;
    gzip_buffers     4 16k;
    gzip_comp_level 4;
    gzip_types       text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
    gzip_vary on;
    gzip_disable "MSIE [1-6]\.";

    proxy_set_header   Host $host:$server_port;
    proxy_redirect off;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_connect_timeout 60;
    proxy_read_timeout 600;
    proxy_send_timeout 600;

  	# 批量引入指定目录下的配置
    include /usr/local/nginx/conf/conf.d/*.conf;

}
```

@tab datasource_ssl_443.conf

```nginx
server {
        listen       443  ssl;

        server_name datasource.tangyh.top;
        root html;
        index index.html index.htm;
        ssl_certificate     ../ssl/datasource.tangyh.top.crt;
        ssl_certificate_key ../ssl/datasource.tangyh.top.key;
        ssl_session_timeout 5m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on;
        underscores_in_headers on;

        location /api {
    				# 网关的ip和端口
            proxy_pass http://172.30.30.195:18760/api;

            # https + web socket 配置
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection  "upgrade";
            proxy_set_header   Host $host:$server_port;
            proxy_redirect off;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_connect_timeout 60;
            proxy_read_timeout 600;
            proxy_send_timeout 600;
        }

        location /xxl-job-admin {
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto https;
            proxy_pass http://172.30.30.195:8767;
						proxy_redirect http:// https://;
        }

        # 文件访问配置
        location ^~ /file {
            if ($request_uri ~* ^.*\/(.*)\.(apk|java|txt|doc|pdf|rar|gz|zip|docx|exe|xlsx|ppt|pptx|jpg|png)(\?fileName=([^&]+))$) {
                add_header Content-Disposition "attachment;filename=$arg_attname";
            }
            root /data_prod/uploadfile;
            index index.html;
        }

				location ^~ / {
            root /data_prod/webapp/lamp-web-pro-datasource/dist;
            index index.html;
        }

}
```

@tab datasource_80.conf

````nginx
server {
        listen       80;
        server_name  datasource.tangyh.top;
        underscores_in_headers on;

				rewrite ^(.*)$  https://$host$1 permanent;
}
````

:::