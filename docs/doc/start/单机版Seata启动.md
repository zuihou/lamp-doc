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

1. [官网](https://github.com/seata/seata/releases) 或 [视频软件下载](../info/视频软件下载.md)下载 1.4.2 版 或者  , 解压到 `D:\developer\seata-server-1.4.2`（群文件里面的配置已经调整过了） 。
   
   ::: tip
   
   seata 版本一定要一致！ 经测试seata 1.5.2、1.6.0、1.6.2 均有bug！

   :::
   
   ![](/images/start/Seata目录结构.png)
   
2. 创建数据库
   
   ```sql
   CREATE DATABASE `lamp_seata` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
   ```

3. 向lamp_seata库 导入  [script/server/db/mysql.sql](https://github.com/seata/seata/blob/develop/script/server/db/mysql.sql) 
   
   ```sql
   -- -------------------------------- The script used when storeMode is 'db' --------------------------------
   -- the table to store GlobalSession data
   CREATE TABLE IF NOT EXISTS `global_table`
   (
    `xid`                       VARCHAR(128) NOT NULL,
    `transaction_id`            BIGINT,
    `status`                    TINYINT      NOT NULL,
    `application_id`            VARCHAR(32),
    `transaction_service_group` VARCHAR(32),
    `transaction_name`          VARCHAR(128),
    `timeout`                   INT,
    `begin_time`                BIGINT,
    `application_data`          VARCHAR(2000),
    `gmt_create`                DATETIME,
    `gmt_modified`              DATETIME,
    PRIMARY KEY (`xid`),
    KEY `idx_gmt_modified_status` (`gmt_modified`, `status`),
    KEY `idx_transaction_id` (`transaction_id`)
   ) ENGINE = InnoDB
   DEFAULT CHARSET = utf8;
   
    -- the table to store BranchSession data
    CREATE TABLE IF NOT EXISTS `branch_table`
    (
        `branch_id`         BIGINT       NOT NULL,
        `xid`               VARCHAR(128) NOT NULL,
        `transaction_id`    BIGINT,
        `resource_group_id` VARCHAR(32),
        `resource_id`       VARCHAR(256),
        `branch_type`       VARCHAR(8),
        `status`            TINYINT,
        `client_id`         VARCHAR(64),
        `application_data`  VARCHAR(2000),
        `gmt_create`        DATETIME(6),
        `gmt_modified`      DATETIME(6),
        PRIMARY KEY (`branch_id`),
        KEY `idx_xid` (`xid`)
    ) ENGINE = InnoDB
      DEFAULT CHARSET = utf8;
   
    -- the table to store lock data
    CREATE TABLE IF NOT EXISTS `lock_table`
    (
        `row_key`        VARCHAR(128) NOT NULL,
        `xid`            VARCHAR(128),
        `transaction_id` BIGINT,
        `branch_id`      BIGINT       NOT NULL,
        `resource_id`    VARCHAR(256),
        `table_name`     VARCHAR(32),
        `pk`             VARCHAR(36),
        `gmt_create`     DATETIME,
        `gmt_modified`   DATETIME,
        PRIMARY KEY (`row_key`),
        KEY `idx_branch_id` (`branch_id`)
    ) ENGINE = InnoDB
      DEFAULT CHARSET = utf8;
   
    CREATE TABLE IF NOT EXISTS `distributed_lock`
    (
        `lock_key`       CHAR(20) NOT NULL,
        `lock_value`     VARCHAR(20) NOT NULL,
        `expire`         BIGINT,
        primary key (`lock_key`)
    ) ENGINE = InnoDB
      DEFAULT CHARSET = utf8mb4;
   
    INSERT INTO `distributed_lock` (lock_key, lock_value, expire) VALUES ('AsyncCommitting', ' ', 0);
    INSERT INTO `distributed_lock` (lock_key, lock_value, expire) VALUES ('RetryCommitting', ' ', 0);
    INSERT INTO `distributed_lock` (lock_key, lock_value, expire) VALUES ('RetryRollbacking', ' ', 0);
    INSERT INTO `distributed_lock` (lock_key, lock_value, expire) VALUES ('TxTimeoutCheck', ' ', 0);
   ```

4. 修改安装包 `D:\developer\seata-server-1.4.2\conf/registry.conf ` 文件内容: 
   
   ```js
   registry {
     type = "nacos"
     nacos {
       application = "seata-server"
       serverAddr = "localhost:8848"            # nacos 地址
       group = "SEATA_GROUP"
       namespace = "3cca7d98-3b1c-44d3-90e5-86abaaf0048a"    # 命名空间不要和lamp-cloud项目使用的混淆了
       cluster = "default"
       username = "nacos"
       password = "nacos"
     }
   }
   config {
     type = "nacos"
     nacos {
       serverAddr = "localhost:8848"              # nacos 地址
       namespace = "3cca7d98-3b1c-44d3-90e5-86abaaf0048a"
       group = "SEATA_GROUP"
       username = "nacos"
       password = "nacos"
       dataId = "seataServer.properties"
     }
   }
   ```

5. 将 [https://github.com/seata/seata/blob/develop/script/config-center/config.txt](https://github.com/seata/seata/blob/develop/script/config-center/config.txt)  文件下载下来，并调整config.txt文件中的下列参数，其他参数保持默认值：
   
   ```properties
    # seata service 信息
    service.vgroupMapping.lamp_cloud_seata_tx_group=default
    service.default.grouplist=127.0.0.1:8091
   
    # 数据库信息
    store.db.dbType=mysql
    store.db.driverClassName=com.mysql.cj.jdbc.Driver
    store.db.url=jdbc:mysql://172.26.3.32:3306/lamp_seata?useUnicode=true&rewriteBatchedStatements=true
    store.db.user=root
    store.db.password=root
   
    # 修改序列化方式， 使seata支持LocalDateTime字段
    client.undo.logSerialization=protostuff
   ```

6. 在naocs中新建命名空间
   
   - 命名空间ID：`3cca7d98-3b1c-44d3-90e5-86abaaf0048a` 
   - 命名空间名: lamp-seata
   - 描述: lamp-cloud 分布式事务

7. 在新建的命名空间中新增配置：   `seataServer.properties`， 将修改后的 config.txt 文件中的内容复制进来。
   
   ![](/images/start/新建seataServer.png)
   
8. 修改后`seataServer.properties` 的全部内容： 
   
   ```properties
   transport.type=TCP
   transport.server=NIO
   transport.heartbeat=true
   transport.enableClientBatchSendRequest=true
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
   service.vgroupMapping.lamp_cloud_seata_tx_group=default
   service.default.grouplist=127.0.0.1:8091
   service.enableDegrade=false
   service.disableGlobalTransaction=false
   client.rm.asyncCommitBufferLimit=10000
   client.rm.lock.retryInterval=10
   client.rm.lock.retryTimes=30
   client.rm.lock.retryPolicyBranchRollbackOnConflict=true
   client.rm.reportRetryCount=5
   client.rm.tableMetaCheckEnable=false
   client.rm.tableMetaCheckerInterval=60000
   client.rm.sqlParserType=druid
   client.rm.reportSuccessEnable=false
   client.rm.sagaBranchRegisterEnable=false
   client.rm.tccActionInterceptorOrder=-2147482648
   client.tm.commitRetryCount=5
   client.tm.rollbackRetryCount=5
   client.tm.defaultGlobalTransactionTimeout=60000
   client.tm.degradeCheck=false
   client.tm.degradeCheckAllowTimes=10
   client.tm.degradeCheckPeriod=2000
   client.tm.interceptorOrder=-2147482648
   store.mode=db
   store.lock.mode=file
   store.session.mode=file
   store.publicKey=
   store.file.dir=file_store/data
   store.file.maxBranchSessionSize=16384
   store.file.maxGlobalSessionSize=512
   store.file.fileWriteBufferCacheSize=16384
   store.file.flushDiskMode=async
   store.file.sessionReloadReadSize=100
   store.db.datasource=druid
   store.db.dbType=mysql
   store.db.driverClassName=com.mysql.cj.jdbc.Driver
   store.db.url=jdbc:mysql://127.0.0.1:3306/lamp_seata?useUnicode=true&rewriteBatchedStatements=true
   store.db.user=root
   store.db.password=root
   store.db.minConn=5
   store.db.maxConn=30
   store.db.globalTable=global_table
   store.db.branchTable=branch_table
   store.db.distributedLockTable=distributed_lock
   store.db.queryLimit=100
   store.db.lockTable=lock_table
   store.db.maxWait=5000
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
   server.recovery.committingRetryPeriod=1000
   server.recovery.asynCommittingRetryPeriod=1000
   server.recovery.rollbackingRetryPeriod=1000
   server.recovery.timeoutRetryPeriod=1000
   server.maxCommitRetryTimeout=-1
   server.maxRollbackRetryTimeout=-1
   server.rollbackRetryTimeoutUnlockEnable=false
   server.distributedLockExpireTime=10000
   client.undo.dataValidation=true
   client.undo.logSerialization=jackson
   client.undo.onlyCareUpdateColumns=true
   server.undo.logSaveDays=7
   server.undo.logDeletePeriod=86400000
   client.undo.logTable=undo_log
   client.undo.compress.enable=true
   client.undo.compress.type=zip
   client.undo.compress.threshold=64k
   log.exceptionRate=100
   transport.serialization=seata
   transport.compressor=none
   metrics.enabled=false
   metrics.registryType=compact
   metrics.exporterList=prometheus
   metrics.exporterPrometheusPort=9898
   ```

9. 导入成功后，确认命名空间： `3cca7d98-3b1c-44d3-90e5-86abaaf0048a` 下是否有1个配置文件
   
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
    <!-- #endregion base -->
