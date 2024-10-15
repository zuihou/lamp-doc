---
title: 将配置文件导入Nacos
icon: config2
category:
  - 快速启动
tag:
  - 快速启动
  - 将配置文件导入Nacos
---

## 将配置文件导入Nacos

1. 登录nacos控制台，[http://localhost:8848/nacos/](http://localhost:8848/nacos/)，访问 ==命名空间== 页面，点击表格右上角 ==新建命名空间== 按钮

   ::: tabs#tenantType

   @tab lamp-datasource-max

   - 命名空间ID： 2d09714b-5693-46bc-83ab-8c8d0e192f76

   - 命名空间名称：  lamp-datasource-max

   - 描述： lamp-datasource-max

   @tab lamp-column-max

   - 命名空间ID： 52721b73-260b-4fee-bb2a-561ea12f1a7f

   - 命名空间名称： lamp-column-max

   - 描述：lamp-column-max

   @tab lamp-cloud

   - 命名空间ID： 2b3d2475-cea6-4c4b-8047-fec9985a2f9c

   - 命名空间名称： lamp-none

   - 描述：lamp-none

   :::

   ![新建命名空间](/images/start/Nacos新建命名空间.png)

2. 修改项目配置文件  [config-dev.properties](http://git.tangyh.top/zuihou/lamp-datasource-max/blob/java17/5.x/src/main/filters/config-dev.properties)  中的  ==nacos.namespace== 为上一步新建的==命名空间ID==

   ![修改项目NacosId](/images/start/Nacos修改项目NacosId.png)

3. 修改   [config-dev.properties](http://git.tangyh.top/zuihou/lamp-datasource-max/blob/java17/5.x/src/main/filters/config-dev.properties)  中 `nacos.xxx`  、 `database.type`

   ```shell
   nacos.ip=127.0.0.1
   nacos.port=8848
   nacos.namespace=52721b73-260b-4fee-bb2a-561ea12f1a7f
   nacos.username=nacos
   nacos.password=nacos
   
   # mysql.yml  oracle.yml sqlserver.yml
   database.type=mysql.yml
   ```

   

4. 将项目的配置文件导入Nacos的 配置管理 - 配置列表

  将 [nacos_config_export.zip](http://git.tangyh.top/zuihou/docs/blob/master/%E8%B5%84%E6%BA%90%E6%96%87%E4%BB%B6/02nacos%E9%85%8D%E7%BD%AE/lamp-cloud-pro-datasource-column)  压缩包一次性导入nacos。

  ::: warning 敲黑板

  -  这里导入的文件必须是nacos中导出压缩包, 自己解压zip修改里面的配置后在压缩成zip后导入可能会报错！
  - 一定要将配置文件导入或新建到第一步新建的命名空间下，千万不要导入public空间了！

  :::

  ![](/images/start/Nacos导入压缩包.png)

 

5. 在 nacos 中，修改 mysql.yml、 oracle.yml 或 sqlserver.yml 的 数据库配置信息。

::: tip

datasource模式和column、none 模式，该配置文件有区别。 因为datasource使用dynamic代理数据源，column、none直接使用druid数据源

:::

- lamp-datasource-max

  :::code-tabs#db

     @tab mysql

     ```yaml
     lamp:
       mysql: &db-mysql
         username: 'root'
         password: 'root'
         driverClassName: com.mysql.cj.jdbc.Driver
         url: jdbc:mysql://127.0.0.1:3306/lamp_ds_c_defaults?serverTimezone=Asia/Shanghai&characterEncoding=utf8&useUnicode=true&useSSL=false&autoReconnect=true&zeroDateTimeBehavior=convertToNull&allowMultiQueries=true&nullCatalogMeansCurrent=true
       database:  
         multiTenantType: DATASOURCE_COLUMN   # 可选值 DATASOURCE_COLUMN COLUMN
     ```

     @tab oracle

     ```yaml
     lamp:
       # 你使用什么数据库，就修改对应数据库的账号密码
       oracle: &db-oracle
         username: 'lamp_ds_c_defaults'
         password: 'lamp_ds_c_defaults'
         driverClassName: oracle.jdbc.driver.OracleDriver
         url: jdbc:oracle:thin:@172.26.3.67:1521:helowin
       database:  
         multiTenantType: DATASOURCE_COLUMN   # 可选值 DATASOURCE_COLUMN COLUMN    
     ```

     @tab sqlserver

     ```yaml
     lamp:
       sqlserver: &db-sqlserver
         username: 'sa'
         password: '1234@abcd'
         driverClassName: com.microsoft.sqlserver.jdbc.SQLServerDriver
         url: jdbc:sqlserver://172.26.3.67:1433;DatabaseName=lamp_ds_c_defaults
         init:
           separator: GO
       database:  
         multiTenantType: DATASOURCE_COLUMN   # 可选值 DATASOURCE_COLUMN COLUMN      
     ```

     :::

- lamp-column-max

  :::code-tabs#db

     @tab mysql

     ```yaml
     lamp:
       mysql: &db-mysql
         db-type: mysql
         validation-query: SELECT 'x'
         filters: stat,wall
         username: 'root'
         password: 'root' 
         driverClassName: com.p6spy.engine.spy.P6SpyDriver
         url: jdbc:p6spy:mysql://127.0.0.1:3306/lamp_column?serverTimezone=Asia/Shanghai&characterEncoding=utf8&useUnicode=true&useSSL=false&autoReconnect=true&zeroDateTimeBehavior=convertToNull&allowMultiQueries=true&nullCatalogMeansCurrent=true
       database:  
         multiTenantType: COLUMN  # 固定填 COLUMN
     ```
  
     @tab oracle
  
     ```yaml
     lamp:
       oracle: &db-oracle
         db-type: oracle
         validation-query: SELECT 'x' FROM DUAL
         filters: stat,wall,slf4j       # druid不支持使用p6spy打印日志，所以采用druid 的 slf4j 过滤器来打印可执行日志
         username: 'lamp_column'
         password: 'lamp_column'
         driverClassName: oracle.jdbc.driver.OracleDriver
         url: jdbc:oracle:thin:@172.26.3.67:1521:helowin
       database:  
         multiTenantType: COLUMN  # 固定填 COLUMN
     ```
  
     @tab sqlserver
  
     ```yaml
     lamp:
       sqlserver: &db-sqlserver
         username: 'sa'
         password: '1234@abcd'
         driverClassName: com.microsoft.sqlserver.jdbc.SQLServerDriver
         url: jdbc:sqlserver://172.26.3.67:1433;DatabaseName=lamp_column
         db-type: sqlserver
         validation-query: SELECT 'x'
         filters: stat,wall
       database:  
         multiTenantType: COLUMN  # 固定填 COLUMN
     ```
  
     :::
  
- lamp-cloud

  :::code-tabs#db

     @tab mysql

     ```yaml
     lamp:
       mysql: &db-mysql
         filters: stat,wall
         db-type: mysql
         validation-query: SELECT 'x'
         username: 'root'
         password: 'root'
         driverClassName: com.p6spy.engine.spy.P6SpyDriver
         url: jdbc:p6spy:mysql://127.0.0.1:3306/lamp_none?serverTimezone=Asia/Shanghai&characterEncoding=utf8&useUnicode=true&useSSL=false&autoReconnect=true&zeroDateTimeBehavior=convertToNull&allowMultiQueries=true&nullCatalogMeansCurrent=true
       database:  
           multiTenantType: NONE  # 固定填 NONE
     
     ```
  
     @tab oracle
  
     ```yaml
     lamp:
       oracle: &db-oracle
         db-type: oracle
         validation-query: SELECT 'x' FROM DUAL
         filters: stat,wall,slf4j    # druid不支持使用p6spy打印日志，所以采用druid 的 slf4j 过滤器来打印可执行日志
         username: 'lamp_none'
         password: 'lamp_none'
         driverClassName: oracle.jdbc.driver.OracleDriver
         url: jdbc:oracle:thin:@172.26.3.67:1521:helowin
       database:  
           multiTenantType: NONE  # 固定填 NONE
     ```
  
     @tab sqlserver
  
     ```yaml
     lamp:
       sqlserver: &db-sqlserver
         username: 'sa'
         password: '1234@abcd'
         driverClassName: com.p6spy.engine.spy.P6SpyDriver
         url: jdbc:p6spy:sqlserver://172.26.3.67:1433;DatabaseName=lamp_none
         db-type: sqlserver
         validation-query: SELECT 'x'
         filters: stat,wall
       database:  
           multiTenantType: NONE   # 固定填 NONE
     ```
  
     :::

::: tip &db-mysql、&db-sqlserver、&db-oracle 是什么意思？ 

 yml 中的锚点引用。  [点我了解锚点引用](https://www.baidu.com/s?wd=yml%20%E9%94%9A%E7%82%B9%E5%BC%95%E7%94%A8)

:::

6. 在 nacos 中，修改 redis.yml 的IP、端口、账号密码。 

   ```yaml
   lamp:
     cache:
       type: REDIS   # 本地不想启动redis，可以修改为  CAFFEINE
     redis:
        ip: 127.0.0.1
        port: 16379
        password: 'SbtyMveYNfLzTks7H0apCmyStPzWJqjy'    # redis 的密码，没有配置密码的改成单引号的空字符串: ''（这个密码是明文，没有加密）
        database: 0
   ```

7. 在 nacos 中，修改 rabbitmq.yml 的IP、端口、账号密码。

   ```yaml
   lamp:
     rabbitmq:
        # 系统默认没有使用rabbitmq， 所以enabled设置为false就不用配置。
        enabled: false
        ip: 127.0.0.1
        port: 5672
        username: lamp
        password: lamp
   ```

   

****

至此, 项目需要调整的配置全部完成, 其他参数用默认的即可, 二次开发建议理解清楚每个配置的含义。

****


<!-- #region config -->
## 配置文件介绍

本项目4.0+版本有11个配置文件，分成2类：

```
common.yml
mysql.yml
oracle.yml
sqlserver.yml
redis.yml
rabbitmq.yml
lamp-oauth-server.yml
lamp-base-server.yml
lamp-gateway-server.yml
lamp-system-server.yml
lamp-monitor.yml
```

1. 通用配置：common.yml、redis.yml、mysql.yml、sqlserver.yml、oracle.yml、rabbitmq.yml

  - common.yml： ==所有的服务== 和 ==所有的环境== 公共的配置，如果有个别服务或者个别环境需要个性化配置， 只需要在每个服务的配置文件中单独修改即可。
  - mysql.yml、sqlserver.yml、oracle.yml： 配置 数据库链接信息、Mybatis Plus 配置信息等
  - redis.yml： 配置 redis 链接信息
- rabbitmq.yml：配置 rabbtit 链接信息
2. 项目配置：lamp-xxx-server.yml （如：lamp-base-server.yml、lamp-system-server.yml等)
   在lamp-xxx-server.yml 里面配置每个服务的特有配置。比如lamp-oauth-server.yml里面会配置swagger扫描路径、项目启动端口、token有效期等信息。

::: tip 小技巧

1. 若一个项目有不同的开发环境、不同的开发人员共用一个nacos, 可以采用命名空间隔离、Group隔离、配置文件隔离等3种方式来实现。
2. 配置文件的加载优先级为： bootstrap-dev.yml -> bootstrap.yml -> application-dev.yml ->application.yml -> lamp-xxx-server-dev.yml -> lamp-xxx-server.yml
3. 配置文件的覆盖规则与加载优先级刚好相反。

:::

<!-- #endregion config -->
