---
title: Nacos和Seata启动
icon: config2
category:
  - 快速启动 
tag:
  - 快速启动 
  - Nacos和Seata启动
---

4.0 版本开始，==DATASOURCE模式==的某些操作已经无法避免需要同时操作 lamp_defaults  和 lamp_base_{TenantId} 库，所以为了保证分布式事务一致性，系统集成了Seata来保证分布式事务准确性。但Seata的配置需要导入Nacos，所以lamp-datasource-max单体版也需要使用Nacos和Seata。

Nacos和Seata的搭建和Seata配置文件的导入可以参考  [单机版Nacos启动](../middleware/单机版Nacos启动.md) 和 [单机版Seata启动](../middleware/单机版Seata启动.md)。



::: tip

- lamp-column-max 和 lamp-cloud(非租户模式) 的微服务版需要使用Nacos

- lamp-column-max和 lamp-cloud(非租户模式) 的单体版无需使用Nacos和Seata。

:::



