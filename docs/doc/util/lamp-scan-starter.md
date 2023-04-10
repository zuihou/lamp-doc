---
title: lamp-scan-starter
icon: wendang
index: false
category:
  - 工具类
tag:
  - 工具类
  - lamp-scan-starter
---

本模块的作用是在启动时，扫描各个服务指定包下的所有Controller层接口，方便【开发运营系统】-【资源维护】页面配置资源所关联的接口地址。默认是扫描top.tangyh包下的接口。

```yaml
lamp:
  scan:
    basePackage: "top.tangyh"
```



![请求接口](/images/util/scan.png)

在lamp-cloud项目中，各个服务的接口地址经过网关访问时，都必须加上前缀`/api/{各个服务的路由前缀}`才能正常访问。默认情况下，lamp-scan-starter扫描==后端服务接口==（上图黄色）是不含==网关前缀==和==路由前缀==的，在微服务架构下，不同服务的后端服务接口可以命名相同，为了便于区分不同服务的同名接口，lamp-scan-starter在扫描时，给每个接口拼接了==网关前缀==。通过在bootstrap.yml中增加`spring.application.path`实现。

```yaml
spring:
  application:
    path: /base
```

