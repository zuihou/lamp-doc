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

lamp-all模块主要用于包含整个lamp-util工程的依赖，便于利用maven的依赖传递性传递依赖。所以lamp-all仅仅是在pom.xml中引入lamp-util中的其他模块，没有业务代码。

微服务模式需要用到lamp-util项目的全部模块，单体模式需要用到除了lamp-cloud-starter外的其他所有模块。所以，在微服务server层，都需要加入lamp-all的依赖，在单体版的server层加入lamp-all依赖后需排除lamp-cloud-starter。



::: code-tabs

@tab 微服务版

```xml
<dependency>
    <groupId>top.tangyh.basic</groupId>
    <artifactId>lamp-all</artifactId>
</dependency>
```

@tab 单体版

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
