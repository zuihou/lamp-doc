---
title: Oss配置
icon: wendang
order: 1
category:
  - 配置 
  - Oss配置
tag:
  - Oss配置
---

- 单体版配置位于：oss.yml 
- 微服务版配置位于：lamp-base-server.yml
- lamp.file前缀的配置参考：FileServerProperties

```yaml
lamp:
  file:
    storageType: LOCAL  #  FAST_DFS LOCAL MIN_IO ALI_OSS HUAWEI_OSS QINIU_OSS
    delFile: false
    suffix: doc,docx,gif,jpeg,jpg,pdf,png,rar,zip,xls,xlsx,txt,file,bin,egp,egpx,apk,xml,rpx,rpg,html,htm,wps,xbid,db
    publicBucket:
      - public
    local:
      pathPatterns: /anyTenant/file
      # 文件存储路径  （ 某些版本的 window 需要改成  D:\\data\\projects\\uploadfile\\file\\  ）
      storage-path: /Users/tangyh/data/projects/uploadfile/${lamp.file.local.pathPatterns}/
      bucket: dev
      # 文件访问 （部署nginx后，配置nginx的ip，并配置nginx静态代理storage-path地址的静态资源）
      urlPrefix: http://127.0.0.1:${server.port}${lamp.file.local.pathPatterns}/
      #  内网的url前缀
      innerUrlPrefix: null
    fastDfs:
      urlPrefix: http://fastdfs.tangyh.top/
    ali:
      # 请填写自己的阿里云存储配置
      urlPrefix: "http://zuihou-admin-cloud.oss-cn-beijing.aliyuncs.com/"
      bucket: "zuihou-admin-cloud"
      endpoint: "oss-cn-beijing.aliyuncs.com"
      access-key-id: "填写你的id"
      access-key-secret: "填写你的秘钥"
    minIo:
      endpoint: "https://static.tangyh.top"
      accessKey: "LqxYSZg4cCwfGcDVgGPt"
      secretKey: "2UdR59Osqm3clHMSiA6vvuU1eoQHcmalnBq9tibH"
      bucket: "dev"
    huawei:
      urlPrefix: "dev.obs.cn-southwest-2.myhuaweicloud.com"
      endpoint: "obs.cn-southwest-2.myhuaweicloud.com"
      accessKey: "1"
      secretKey: "2"
      location: "cn-southwest-2"
      bucket: "dev"
    qiNiu:
      zone: "z0"
      accessKey: "1"
      secretKey: "2"
      bucket: "zuihou_admin_cloud"

#FAST_DFS配置
fdfs:
  soTimeout: 1500
  connectTimeout: 600
  thumb-image:
    width: 150
    height: 150
  tracker-list:
    - 39.108.109.234:22122
  pool:
    #从池中借出的对象的最大数目
    max-total: 153
    max-wait-millis: 102
    jmx-name-base: 1
    jmx-name-prefix: 1
```

