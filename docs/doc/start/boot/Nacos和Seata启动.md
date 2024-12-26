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

| 是否集成了seata？               | 微服务版 | 单体版 |
| ------------------------------- | -------- | ------ |
| lamp-datasource-max(数据源模式) | 是       | 是     |
| lamp-column-max(字段模式)       | 否       | 否     |
| lamp-cloud(单体模式)            | 否       | 否     |

Nacos和Seata的搭建和Seata配置文件的导入可以参考  [单机版Nacos启动](../middleware/单机版Nacos启动.md) 和 [单机版Seata启动](../middleware/单机版Seata启动.md)。



## lamp-datasource-max单体版 如何启用/禁用seata

1. 修改 `lamp-boot-server/src/main/resources/config/dev/mysql.yml`

   ```yaml
   lamp:
     database: 
       isSeata: true   # true 启用， false 禁用。 禁用后无需配置seata其他参数
   ```

2. 修改 `src/main/filters/config-dev.properties`

   ```properties
   ## 单体版中 seata 使用的nacos信息
   nacos.ip=127.0.0.1
   nacos.port=8848
   nacos.username=nacos
   nacos.password=nacos
   
   # seata 客户端从 nacos 拉取配置和注册的命名空间 跟 nacos.namespace 区分出来，原因是 seata
   seata.namespace=5b51e46a-4aeb-4d40-8398-8a9d33e2f0ad
   # seata 的 grouplist ip
   seata.ip=127.0.0.1
   # seata 的 grouplist 端口
   seata.port=8091
   ```

   

## lamp-datasource-max 微服务版 如何启用/禁用seata

1. 修改 nacos 中的 mysql.yml

   ```yaml
   lamp:
     database: 
       isSeata: true   # true 启用， false 禁用。 禁用后无需配置seata其他参数
   ```

2. 修改 `src/main/filters/config-dev.properties`

   ```properties
   ## 单体版中 seata 使用的nacos信息
   nacos.ip=127.0.0.1
   nacos.port=8848
   nacos.username=nacos
   nacos.password=nacos
   
   # seata 客户端从 nacos 拉取配置和注册的命名空间 跟 nacos.namespace 区分出来，原因是 seata
   seata.namespace=5b51e46a-4aeb-4d40-8398-8a9d33e2f0ad
   # seata 的 grouplist ip
   seata.ip=127.0.0.1
   # seata 的 grouplist 端口
   seata.port=8091
   ```

   
