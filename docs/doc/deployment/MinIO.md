---
title: MinIO
index: false
category:
  - 部署
tag:
  - 部署
  - MinIO
---

## 安装

1. [下载](https://www.minio.org.cn/download.shtml#/linux)

   ```shell
   mkdir -p /opt/minio/
   cd /opt/minio/
   wget https://dl.minio.org.cn/server/minio/release/linux-amd64/minio
   chmod +x minio
   ```

2. vim  /usr/lib/systemd/system/minio.service

   ```shell
   [Unit]
   Description=MinIO
   Documentation=https://min.io/docs/minio/linux/index.html
   Wants=network-online.target
   After=network-online.target
   AssertFileIsExecutable=/opt/minio/minio
   
   [Service]
   WorkingDirectory=/opt/minio
   
   #User=minio-user
   #Group=minio-user
   #ProtectProc=invisible
   
   EnvironmentFile=/opt/minio/config.conf
   ExecStartPre=/bin/bash -c "if [ -z \"${MINIO_VOLUMES}\" ]; then echo \"Variable MINIO_VOLUMES not set in /opt/minio/config.conf\"; exit 1; fi"
   ExecStart=/opt/minio/minio server $MINIO_OPTS $MINIO_VOLUMES
   
   # Let systemd restart this service always
   Restart=always
   
   # Specifies the maximum file descriptor number that can be opened by this process
   LimitNOFILE=65536
   
   # Specifies the maximum number of threads this process can create
   TasksMax=infinity
   
   # Disable timeout logic and wait until process is stopped
   TimeoutStopSec=infinity
   SendSIGKILL=no
   
   [Install]
   WantedBy=multi-user.target
   ```

   

3. vim /opt/minio/config.conf

   ```shell
   MINIO_ROOT_USER=admin
   MINIO_ROOT_PASSWORD=ZHadmin123.
   
   MINIO_VOLUMES="/data/minio-data"
   
   MINIO_OPTS="--console-address :9001 --config-dir /opt/minio/configdir"
   ```

   

4. 启动

   ```shell
   # 启动
   sudo systemctl start minio.service
   # 开机启动
   sudo systemctl enable minio.service
   
   # 状态
   sudo systemctl status minio.service
   journalctl -f -u minio.service
   ```


5. 放开防火墙端口

   防火墙放开 9000 和 9001 端口

6. 浏览器访问

http://ip:9001

6. 代码配置

```yaml
lamp:
  file:
    storageType: MIN_IO  #  FAST_DFS LOCAL MIN_IO ALI_OSS HUAWEI_OSS QINIU_OSS
    minIo:
      endpoint: "http://ip:9000"
      accessKey: "xxx"
      secretKey: "xxx"
      bucket: "dev"
```

## 配置Nginx（可选）

参考官网文档： https://www.minio.org.cn/docs/minio/linux/integrations/setup-nginx-proxy-with-minio.html

1. 修改配置文件： vim /opt/minio/config.conf

   ```shell
   MINIO_ROOT_USER=admin
   MINIO_ROOT_PASSWORD=ZHadmin123.
   
   # 配置
   MINIO_BROWSER_REDIRECT_URL=https://static.tangyh.top/minio/ui
   
   MINIO_VOLUMES="/data/minio-data"
   
   MINIO_OPTS="--console-address :9001 --config-dir /opt/minio/configdir"
   ```

   

2. nginx 配置文件

```nginx
upstream minio_console {
    least_conn;
    server 192.168.0.219:9001;
}

upstream minio_server {
    least_conn;
    server 192.168.0.219:9000;
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
  
    location /minio/ui/ {
      rewrite ^/minio/ui/(.*) /$1 break;
      proxy_set_header Host $http_host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header X-NginX-Proxy true;

      real_ip_header X-Real-IP;

      proxy_connect_timeout 300;

      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";

      chunked_transfer_encoding off;

      proxy_pass http://minio_console; 
   }
}
```

3. 重启minio-server 和 nginx

4. 浏览器访问：https://static.tangyh.top/minio/ui/

5. 程序配置：

   ```yaml
   lamp:
     file:
       storageType: MIN_IO  #  FAST_DFS LOCAL MIN_IO ALI_OSS HUAWEI_OSS QINIU_OSS
       minIo:
         endpoint: "https://static.tangyh.top"
         accessKey: "xxx"
         secretKey: "xxx"
         bucket: "dev"
   ```

   
