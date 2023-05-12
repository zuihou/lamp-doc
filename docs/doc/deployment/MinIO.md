---
title: MinIO
index: false
category:
  - 部署
tag:
  - 部署
  - MinIO
---

## 安装MinIO

```shell
export MINIO_ROOT_USER=admin
export MINIO_ROOT_PASSWORD="ZHadmin123." 

nohup /opt/minio/minio server --config-dir /opt/minio/config /data > /opt/minio/minio.log 2>&1 &
```

## 访问

http://172.30.30.194:9000



## 配置Nginx（可选）

若MinIO集群部署、想要通过https访问等场景，可以通过Nginx来解决。

```nginx
upstream minio_server {
    least_conn;
    # IP和端口配置为MinIO的地址，集群可配置多个
    server 172.30.30.194:9000;
}

server {
    listen 443 ssl;
    server_name static.tangyh.top;
    root html;
    index index.html index.htm;
  	# ssl 证书需要自己购买, 没有证书换成http也行
    ssl_certificate     ssl/static.tangyh.top.crt;
    ssl_certificate_key ssl/static.tangyh.top.key;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;

    underscores_in_headers on;

    location / {
        proxy_set_header  Host       $http_host;
        proxy_set_header  X-Real-IP    $remote_addr;
        proxy_set_header  X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://minio_server;
    }
}
```
