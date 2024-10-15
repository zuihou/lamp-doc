---
title: 集群版Nacos启动
icon: config2
category:
  - 快速启动
tag:
  - 快速启动
  - 集群版Nacos启动
---

## 部署

![](/images/start/nacosVIP.png)

1. 环境准备： 准备3台或3台以上CentOS8 服务器用于部署nacos（ip1、ip2、ip3）， 1台CentOS8 服务器用于部署nginx

2. 在nacos(ip1)、nacos(ip2)、nacos(ip3)3台服务器上同时下载nacos压缩包并解压。在nacos的解压目录 conf 目录下，有配置文件cluster.conf，请将每行配置成ip:port。（请配置3个或3个以上节点）

   ```properties
   # ip:port  ip1、ip2、ip3 需要替换为3台服务器的真实内网IP
   ip1:8848
   ip2:8848
   ip3:8848
   ```

3. 在nacos(ip1)、nacos(ip2)、nacos(ip3)3台服务器上同时修改application.properties文件

   ```properties
   spring.datasource.platform=mysql
   db.num=1
   db.url.0=jdbc:mysql://127.0.0.1:3306/lamp_nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
   db.user=root
   db.password=root
   
   nacos.core.auth.enabled=true
   nacos.core.auth.server.identity.key=nacos
   nacos.core.auth.server.identity.value=nacos
   nacos.core.auth.plugin.nacos.token.secret.key=lamp012345678901234567890123456789012345678901234567890123456789
   nacos.console.ui.enabled=true
   ```

4. 在nginx(ip4)服务器上，安装nginx。

   ::: warning

   安装Nginx时，一定要添加 stream 模块， 如图所示：

   不懂什么是 stream 模式？ [点我](https://www.baidu.com/s?tn=28114124_2_dg&wd=nginx%20%E5%AE%89%E8%A3%85%20stream)

   ![](/images/start/nginx_v.png)

   :::

5. 在nginx(ip4)服务器上，配置nginx.conf

   ```nginx
   stream {
     # ip1、ip2、ip3 需要替换为3台服务器的真实内网IP
     upstream nacos_stream_8848 {
           server ip1:8848;
           server ip2:8848;
           server ip3:8848;
     }
   
     upstream nacos_stream_9848 {
           server ip1:9848;
           server ip2:9848;
           server ip3:9848;
     }
   
     upstream nacos_stream_9849 {
           server ip1:9849;
           server ip2:9849;
           server ip3:9849;
     }
   
     server {
            listen 8848;
            proxy_pass nacos_stream_8848;
     }
   
     server {
            listen 9848;
            proxy_pass nacos_stream_9848;
     }
   
    server {
            listen 9849;
            proxy_pass nacos_stream_9849;
    }       
   }
   ```

6. 在4台服务器上同时配置防火墙规则

   ```shell
   sudo firewall-cmd --permanent --zone=public --add-port=7848/tcp
   sudo firewall-cmd --permanent --zone=public --add-port=8848/tcp
   sudo firewall-cmd --permanent --zone=public --add-port=9848/tcp
   sudo firewall-cmd --permanent --zone=public --add-port=9849/tcp
   sudo firewall-cmd --reload
   ```

7. 启动nginx，并同时启动3台nacos

8. 通过nginx负载均衡方式访问： [http://ip4:8848/nacos](http://ip4:8848/nacos)

   ![](/images/start/nacos集群验证.png)

9. 配置lamp-datasource-max： 修改`src/main/filters/config-dev.properties`

   ```properties
   nacos.ip=ip4    # (一定是配置nginx 的ip)
   nacos.port=8848
   ```



## 云环境部署

1. 有条件的直接购买阿里云现成的nacos集群服务
2. 云环境可以将nginx换成内网 slb （阿里云） 或 elb（华为云） ，并将上面的第4、5步操作，换成在 slb 或 elb 上去配置TCP端口映射
   ![](/images/start/华为云ELB.png)
3. 云环境除了要配置服务器的防火墙规则外，还需要在安全组开通 7848、8848、9848、9849等端口！
