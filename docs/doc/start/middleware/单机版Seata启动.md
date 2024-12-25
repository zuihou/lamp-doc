---
title: 单机版Seata启动
icon: config2
category:
  - 快速启动
tag:
  - 快速启动
  - 单机版Seata启动
---
<!-- #region base -->
Seata官方文档： [https://seata.io/](https://seata.io/)

4.0 版本开始，DATASOURCE模式的(lamp-cloud-pro-datasource-column项目)某些操作已经无法避免同时操作 lamp_defaults 库 和 lamp_base_{TenantId} ，所以为了保证分布式事务准确性，lamp-cloud-pro-datasource-column项目集成了Seata来保证分布式事务准确性，其他模式默认没有集成Seata。

::: tip

seata官方仅支持MySQL、Oracle、Postgresql，不支持SQL Server，所以导致灯灯项目的DATASOURCE模式也不支持SQL Server，column和none模式不受影响。

:::



## 安装步骤

1. [官网](https://github.com/seata/seata/releases) 或 [视频软件下载](../info/视频软件下载.md)下载 1.7.1 版 或者  , 解压到 /Users/tangyh/tools/seata171`（群文件里面的配置已经调整过了） 。

   ::: tip

   seata 版本一定要一致！ 经测试seata 1.5.2、1.6.0、1.6.2 均有bug！

   :::

   ![](/images/start/Seata目录结构.png)

2. 创建数据库

   ```sql
   CREATE DATABASE `lamp_seata` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
   ```

3. 向lamp_seata库 导入  [script/server/db/mysql.sql](https://github.com/seata/seata/blob/develop/script/server/db/mysql.sql) 

   ![创表结构就在压缩包中](/images/start/Seata目录结构.png)

4. 修改 `/Users/tangyh/tools/seata171/conf/application.yml ` 文件： 

   ```yaml{28-33,42-48,59-62}
   server:
     port: 7091
   
   spring:
     application:
       name: seata-server
   
   logging:
     config: classpath:logback-spring.xml
     file:
       path: ${log.home:${user.home}/logs/seata}
     extend:
       logstash-appender:
         destination: 127.0.0.1:4560
       kafka-appender:
         bootstrap-servers: 127.0.0.1:9092
         topic: logback_to_logstash
   
   console:
     user:
       username: seata
       password: seata
   seata:
     config:
       # support: nacos, consul, apollo, zk, etcd3
       type: nacos
       nacos:      
         server-addr: 127.0.0.1:8848
         namespace: 5b51e46a-4aeb-4d40-8398-8a9d33e2f0ad
         group: SEATA_GROUP
         username: nacos
         password: nacos
         data-id: seataServer.properties
         context-path:
         ##if use MSE Nacos with auth, mutex with username/password attribute
         #access-key:
         #secret-key:
     registry:
       # support: nacos, eureka, redis, zk, consul, etcd3, sofa
       type: nacos
       nacos:
         application: seata-server
         server-addr: 127.0.0.1:8848
         group: SEATA_GROUP
         namespace: 5b51e46a-4aeb-4d40-8398-8a9d33e2f0ad
         cluster: default
         username: nacos
         password: nacos
         context-path:
         ##if use MSE Nacos with auth, mutex with username/password attribute
         #access-key:
         #secret-key:
     store:
       # support: file 、 db 、 redis
       mode: db
       db:
         datasource: druid
         db-type: mysql
         driver-class-name: com.mysql.jdbc.Driver
         url: jdbc:mysql://127.0.0.1:3306/lamp_seata?useUnicode=true&rewriteBatchedStatements=true&serverTimezone=GMT
         user: root
         password: root
         min-conn: 10
         max-conn: 100
         global-table: global_table
         branch-table: branch_table
         lock-table: lock_table
         distributed-lock-table: distributed_lock
         query-limit: 1000
         max-wait: 5000  
   #  server:
   #    service-port: 8091 #If not configured, the default is '${server.port} + 1000'
     security:
       secretKey: SeataSecretKey0c382ef121d778043159209298fd40bf3850a017
       tokenValidityInMilliseconds: 1800000
       ignore:
         urls: /,/**/*.css,/**/*.js,/**/*.html,/**/*.map,/**/*.svg,/**/*.png,/**/*.jpeg,/**/*.ico,/api/v1/auth/login
   ```

5. 将 [https://github.com/seata/seata/blob/develop/script/config-center/config.txt](https://github.com/seata/seata/blob/develop/script/config-center/config.txt)  文件下载下来，并调整config.txt文件中的下列参数，其他参数保持默认值：

   ```properties
    # seata service 信息
    service.vgroupMapping.lamp_cloud_seata_tx_group=default
    service.default.grouplist=192.168.1.190:8091
   
    # 数据库信息
    store.db.dbType=mysql
    store.db.driverClassName=com.mysql.jdbc.Driver
    store.db.url=jdbc:mysql://172.26.3.32:3306/lamp_seata?useUnicode=true&rewriteBatchedStatements=true
    store.db.user=root
    store.db.password=root
   
    # 修改序列化方式， 使seata支持LocalDateTime字段
    client.undo.logSerialization=protostuff
   ```

6. 在naocs中新建命名空间

   - 命名空间ID：`5b51e46a-4aeb-4d40-8398-8a9d33e2f0ad` 
   - 命名空间名: lamp-seata
   - 描述: lamp-cloud 分布式事务

   ![](/images/start/新建seata命名空间.png)

7. 在新建的命名空间中新增配置：   `seataServer.properties`， 将修改后的 config.txt 文件中的内容复制进来。

   ![](/images/start/新建seataServer.png)

8. 修改后`seataServer.properties` 的全部内容： 

   ```properties
   #For details about configuration items, see https://seata.io/zh-cn/docs/user/configurations.html
   #Transport configuration, for client and server
   transport.type=TCP
   transport.server=NIO
   transport.heartbeat=true
   transport.enableTmClientBatchSendRequest=false
   transport.enableRmClientBatchSendRequest=true
   transport.enableTcServerBatchSendResponse=false
   transport.rpcRmRequestTimeout=30000
   transport.rpcTmRequestTimeout=30000
   transport.rpcTcRequestTimeout=30000
   transport.threadFactory.bossThreadPrefix=NettyBoss
   transport.threadFactory.workerThreadPrefix=NettyServerNIOWorker
   transport.threadFactory.serverExecutorThreadPrefix=NettyServerBizHandler
   transport.threadFactory.shareBossWorker=false
   transport.threadFactory.clientSelectorThreadPrefix=NettyClientSelector
   transport.threadFactory.clientSelectorThreadSize=1
   transport.threadFactory.clientWorkerThreadPrefix=NettyClientWorkerThread
   transport.threadFactory.bossThreadSize=1
   transport.threadFactory.workerThreadSize=default
   transport.shutdown.wait=3
   transport.serialization=seata
   transport.compressor=none
   
   #Transaction routing rules configuration, only for the client
   # 待修改 start
   service.vgroupMapping.lamp_cloud_seata_tx_group=default
   #If you use a registry, you can ignore it
   service.default.grouplist=192.168.1.190:8091
   # 待修改 end
   
   service.enableDegrade=false
   service.disableGlobalTransaction=false
   
   #Transaction rule configuration, only for the client
   client.rm.asyncCommitBufferLimit=10000
   client.rm.lock.retryInterval=10
   client.rm.lock.retryTimes=30
   client.rm.lock.retryPolicyBranchRollbackOnConflict=true
   client.rm.reportRetryCount=5
   client.rm.tableMetaCheckEnable=true
   client.rm.tableMetaCheckerInterval=60000
   client.rm.sqlParserType=druid
   client.rm.reportSuccessEnable=false
   client.rm.sagaBranchRegisterEnable=false
   client.rm.sagaJsonParser=fastjson
   client.rm.tccActionInterceptorOrder=-2147482648
   client.tm.commitRetryCount=5
   client.tm.rollbackRetryCount=5
   client.tm.defaultGlobalTransactionTimeout=60000
   client.tm.degradeCheck=false
   client.tm.degradeCheckAllowTimes=10
   client.tm.degradeCheckPeriod=2000
   client.tm.interceptorOrder=-2147482648
   client.undo.dataValidation=true
   # 待修改 start
   client.undo.logSerialization=protostuff
   # 待修改 end
   client.undo.onlyCareUpdateColumns=true
   server.undo.logSaveDays=7
   server.undo.logDeletePeriod=86400000
   client.undo.logTable=undo_log
   client.undo.compress.enable=true
   client.undo.compress.type=zip
   client.undo.compress.threshold=64k
   #For TCC transaction mode
   tcc.fence.logTableName=tcc_fence_log
   tcc.fence.cleanPeriod=1h
   
   #Log rule configuration, for client and server
   log.exceptionRate=100
   
   #Transaction storage configuration, only for the server. The file, db, and redis configuration values are optional.
   store.mode=db
   store.lock.mode=file
   store.session.mode=file
   #Used for password encryption
   store.publicKey=
   
   #If `store.mode,store.lock.mode,store.session.mode` are not equal to `file`, you can remove the configuration block.
   store.file.dir=file_store/data
   store.file.maxBranchSessionSize=16384
   store.file.maxGlobalSessionSize=512
   store.file.fileWriteBufferCacheSize=16384
   store.file.flushDiskMode=async
   store.file.sessionReloadReadSize=100
   
   #These configurations are required if the `store mode` is `db`. If `store.mode,store.lock.mode,store.session.mode` are not equal to `db`, you can remove the configuration block.
   store.db.datasource=druid
   store.db.dbType=mysql
   # 待修改 start
   store.db.driverClassName=com.mysql.jdbc.Driver
   store.db.url=jdbc:mysql://127.0.0.1:3306/lamp_seata?useUnicode=true&rewriteBatchedStatements=true
   store.db.user=root
   store.db.password=root
   # 待修改 end
   store.db.minConn=5
   store.db.maxConn=30
   store.db.globalTable=global_table
   store.db.branchTable=branch_table
   store.db.distributedLockTable=distributed_lock
   store.db.queryLimit=100
   store.db.lockTable=lock_table
   store.db.maxWait=5000
   
   #These configurations are required if the `store mode` is `redis`. If `store.mode,store.lock.mode,store.session.mode` are not equal to `redis`, you can remove the configuration block.
   store.redis.mode=single
   store.redis.single.host=127.0.0.1
   store.redis.single.port=6379
   store.redis.sentinel.masterName=
   store.redis.sentinel.sentinelHosts=
   store.redis.maxConn=10
   store.redis.minConn=1
   store.redis.maxTotal=100
   store.redis.database=0
   store.redis.password=
   store.redis.queryLimit=100
   
   #Transaction rule configuration, only for the server
   server.recovery.committingRetryPeriod=1000
   server.recovery.asynCommittingRetryPeriod=1000
   server.recovery.rollbackingRetryPeriod=1000
   server.recovery.timeoutRetryPeriod=1000
   server.maxCommitRetryTimeout=-1
   server.maxRollbackRetryTimeout=-1
   server.rollbackRetryTimeoutUnlockEnable=false
   server.distributedLockExpireTime=10000
   server.xaerNotaRetryTimeout=60000
   server.session.branchAsyncQueueSize=5000
   server.session.enableBranchAsyncRemove=false
   server.enableParallelRequestHandle=false
   
   #Metrics configuration, only for the server
   metrics.enabled=false
   metrics.registryType=compact
   metrics.exporterList=prometheus
   metrics.exporterPrometheusPort=9898
   ```

9. 导入成功后，确认命名空间： `5b51e46a-4aeb-4d40-8398-8a9d33e2f0ad` 下是否有1个配置文件

    ![](/images/start/seataServer新建成功.png)

10. 启动seata-server：

    ```shell
    # 参数解释： 
    -p 指定端口
    -h 指定ip，  需要修改成`自己的ip ,切记，不能使用127.0.0.1 和localhost ！！！
    -m db  存储到数据库
    -m file 存储到文件
    
    # linux 或 mac
    sh bin/seata-server.sh -p 8091 -h 192.168.1.34 -m db -n 1
    
    # window: 双击或者cmd下面执行：
    bin/seata-server.bat -p 8091 -h 192.168.1.34 -m db -n 1
    ```

11. 验证是否启动成功：打开nacos， 【服务管理】 -> 【服务列表】 ->【lamp-seata】-> 有一个服务名为 `server-server` 的服务 即表示成功

     ![](/images/start/seata启动成功.png)

12. 访问控制台： http://localhost:7091/

     ![](/images/start/seata控制台.png)

     <!-- #endregion base -->
