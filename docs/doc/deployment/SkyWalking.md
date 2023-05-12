---
title: SkyWalking
index: false
category:
  - 部署
tag:
  - 部署
  - SkyWalking
---

Apache Skywalking 是什么? 如何优化配置?请自行查阅相关资料。下面介绍如何修改配置适配本项目。

## 目录介绍

![](/images/deployment/skywalking文件夹介绍.png)

- webapp: UI 前端（`web` 监控页面）的 `jar` 包和配置文件；
- oap-libs: 后台应用的 `jar` 包，以及它的依赖 `jar` 包，里边有一个 `server-starter-*.jar` 就是启动程序；
- config: 启动后台应用程序的配置文件，是使用的各种配置
- bin: 各种启动脚本，一般使用脚本 `startup.*` 来启动 **`web` 页面** 和对应的 **后台应用**；
  * oapService.\*: 默认使用的后台程序的启动脚本；（使用的是默认模式启动，还支持其他模式）
  * oapServiceInit.\*: 使用 `init` 模式启动；在此模式下，OAP服务器启动以执行初始化工作，然后退出
  * oapServiceNoInit.\*: 使用 `no init`模式启动；在此模式下，OAP服务器不进行初始化。
  * webappService.\*: UI 前端的启动脚本；
  * startup.\*: 组合脚本，同时启动 `oapService.*:`、`webappService.*` 脚本；
  * stop.sh 官方是没有提供的, 是提供发出来方便停止服务的.
- agent:
  * skywalking-agent.jar: 代理服务 `jar` 包
  * config: 代理服务启动时使用的配置文件
  * plugins: 包含多个插件，代理服务启动时会加载改目录下的所有插件（实际是各种 `jar` 包）
  * optional-plugins: 可选插件，当需要支持某种功能时，比如 `SpringCloud Gateway`，则需要把对应的 `jar` 包拷贝到 `plugins` 目录下；

## 启动

1. 下载官方8.2.0安装包: (http://skywalking.apache.org/downloads/ )

2. 修改配置文件`conf/application.yml`

   ```yaml
   # 支持h2、mysql、es 、influxdb 这里使用 mysql, 生产推荐es
   storage:
   selector: ${SW_STORAGE:mysql}
   mysql:
    # 修改下面的 mysql 信息
    properties:
   # 链接ip、端口和数据库
      jdbcUrl: ${SW_JDBC_URL:"jdbc:mysql://localhost:3306/lamp_sw?useSSL=false"}
   # 账号
      dataSource.user: ${SW_DATA_SOURCE_USER:root}
   #密码
      dataSource.password: ${SW_DATA_SOURCE_PASSWORD:root}
   ```

3. 手动创建`lamp_sw`数据库

   ```mysql
   CREATE DATABASE IF NOT EXISTS `lamp_sw` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
   ```

4. `oap-libs`目录下缺少`mysql`的驱动程序，所以还需要下载`mysql-connector-java-*.jar`  放到`oap-libs`目录.  我这里复制 mysql-connector-java-8.0.21.jar 到oap-libs

5. 修改`webapp/webapp.yml` 里面的的端口号

   ```yaml
   server:
     port: 12080  # 默认是8080 
   ```

6. 启动

   ```shell
   cd bin
   # 启动
   $ ./startup.sh
   ```

## 验证

1. 查看端口占用

   ```shell
   $ jps
   93830 OAPServerStartUp
   93835 skywalking-webapp.jar
   93851 Jps
   ```

2. 验证lamp_sw数据库多了很多表

3. 访问UI页面: http://localhost:12080



## 配置客户端

1. 修改`agent/config/agent.config`文件

   ```ini
   # 在UI上显示的服务名称
   agent.service_name=${SW_AGENT_NAME:lamp-cloud}
   ```

2. 将`agent/optional-plugins/`中的如下插件移动到`agent/plugins/`里面去

   ```shell
   apm-quartz-scheduler-2.x-plugin-8.2.0.jar  # 定时任务
   apm-spring-annotation-plugin-8.2.0.jar   # spring注解
   apm-spring-tx-plugin-8.2.0.jar # spring事务
   apm-trace-ignore-plugin-8.2.0.jar # 自定义忽略追踪某些请求 (如nacos、eureka等定时请求)
   apm-spring-cloud-gateway-2.1.x-plugin-8.2.0.jar   # 解决微服务项目 gateway 转发的问题
   apm-spring-webflux-5.x-plugin-8.2.0.jar  
   ```

3.  下载apm-trace-ignore-plugin插件的[配置文件](https://github.com/apache/skywalking/blob/master/apm-sniffer/optional-plugins/trace-ignore-plugin/apm-trace-ignore-plugin.config)，放到 `agent/config/` 目录，取名为: apm-trace-ignore-plugin.config

    ```properties
    #  需要被注入的地址
    #  /path/?   匹配任意单个字符
    #  /path/*   匹配任意数量的字符
    #  /path/**  匹配任意数量的字符并支持多级目录
    #  多个路径使用逗号分隔, 比如: trace.ignore_path=/eureka/**,/consul/**
    trace.ignore_path=${SW_AGENT_TRACE_IGNORE_PATH:/eureka/**}
    ```
4. 若是分布式部署, 将agent文件夹移动到跟spring-boot的jar同一台服务器上的任意目录。

   如: /Users/tangyh/tools/skywalking820/

5. 若你使用IDEA开发，在IDEA中配置每个服务的启动参数

   ` /Users/tangyh/tools/skywalking820/agent/skywalking-agent.jar `要改成你自己的`skywalking-agent.jar`存放路径
   ![](/images/deployment/skywalking客户端配置.png)

   ```shell
   # VM Options:  (虚拟机参数)
   -Xms128M -Xmx192M  -XX:MetaspaceSize=64M -XX:MaxMetaspaceSize=128M -javaagent:/Users/tangyh/tools/skywalking820/agent/skywalking-agent.jar
   
   
   # Environment variables (环境变量)
   SW_AGENT_NAME=lamp-msg-server
   ```


6. 若你使用命令行方式启动java，请用如下命令

   ```shell
   java -javaagent:/Users/tangyh/tools/skywalking820/agent/skywalking-agent.jar -Dskywalking.agent.service_name=lamp-authority-server -jar lamp-authority-server.jar
   ```
7. 依次启动权限、认证、租户、网关等服务, 启动lamp-web后多访问几个页面

8. 访问UI页面: http://localhost:12080 查看结果

   

## 注意事项

### 分布式部署在多台服务器时需要注意

1. 假设有A、B、C 3台服务器. A服务安装nacos、mysql、skywalking等服务
2. B服务器 启动 网关、认证、权限等服务
3. C服务器 启动 消息、文件、租户等服务

那么，需要将 skywalking安装包解压后的文件夹下放在A服务器上, 然后参考前面的`启动服务端 + UI` 一节启动; 然后在B、C服务器上存放 文件夹里面的 `agent` 文件夹即可.

![](/images/deployment/skywalking文件夹介绍.png)



## 效果图

![](/images/deployment/skywalking效果图.png)
