---
title: lamp-all
icon: wendang
index: false
category:
  - 工具类
tag:
  - 工具类
  - lamp-all
---

该模块主要用于包含整个lamp-util工程的依赖，便于利用maven的依赖传递性传递依赖。所以lamp-all仅仅是在pom.xml中引入lamp-util中的其他模块，没有业务代码。

lamp-cloud项目需要用到lamp-util项目的全部模块，lamp-boot项目需要用到除了lamp-cloud-starter外的其他所有模块。所以，在lamp-cloud的各个服务的server层，都需要加入lamp-all的依赖，在lamp-boot的server层加入lamp-all依赖后需排除lamp-cloud-starter。



::: code-tabs

@tab lamp-cloud

```xml
<dependency>
    <groupId>top.tangyh.basic</groupId>
    <artifactId>lamp-all</artifactId>
</dependency>
```

@tab lamp-boot

```xml
<dependency>
  <groupId>top.tangyh.basic</groupId>
  <artifactId>lamp-all</artifactId>
  <exclusions>
      <exclusion>
          <groupId>top.tangyh.basic</groupId>
          <artifactId>lamp-cloud-starter</artifactId>
      </exclusion>
  </exclusions>
</dependency>
```

:::
