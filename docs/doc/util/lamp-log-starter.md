---
title: lamp-log-starter
icon: wendang
index: false
category:
  - 工具类
tag:
  - 工具类
  - lamp-log-starter
---

lamp-log-starter 实现了几个功能: 
1. MDC参数
2. @WebLog 记录操作日志
3. defaults.xml、 defaults-dev.xml、 defaults-prod.xml、 全局的logback 日志基础模版


## MDC参数
logback内置的日志字段不够丰富，如果我们需要打印业务相关的参数，需要借助logback MDC机制，MDC为“Mapped Diagnostic Context”（映射诊断上下文），即将一些运行时的上下文数据通过logback打印出来，此时我们需要借助org.sl4j.MDC类。

MDC类基本原理其实非常简单，其内部持有一个InheritableThreadLocal实例，用于保存context数据，MDC提供了put/get/clear等几个核心接口，用于操作ThreadLocal中的数据；ThreadLocal中的K-V，可以在logback.xml中声明，最终将会打印在日志中。

可以看到本系统中打印的日志参数格式为:
```
[${spring.application.name}:${server.port}:%X{tenant}:%X{userid}] %d{yyyy-MM-dd HH:mm:ss.SSS}[%5p] ${PID} [%X{trace}] [%t:%r] [%logger{50}.%M:%L] %m%n${LOG_EXCEPTION_CONVERSION_WORD:-%wEx}
```

其中 `%X{tenant}`、`%X{userid}`、`%X{trace}`  三个参数就是通过MDC传递给logback的, 他们分别表示 租户编码、用户id、请求ID

实现步骤: 
1. 项目启动时,会加载spring.factories文件中的 LampMdcAdapterInitializer 类, 该类对LampMdcAdapter 进行初始化(执行其static代码库)

2. 在 HeaderThreadLocalInterceptor 拦截器中对每个请求调用MDC.put 方法,对上面的三个参数进行设值

   ```java
   MDC.put(ContextConstants.LOG_TRACE_ID, StrUtil.isEmpty(traceId) ? StrUtil.EMPTY : traceId);
   MDC.put(ContextConstants.JWT_KEY_TENANT, getHeader(request, ContextConstants.JWT_KEY_TENANT));
   MDC.put(ContextConstants.JWT_KEY_USER_ID, getHeader(request, ContextConstants.JWT_KEY_USER_ID));
   ```

   
## @WebLog 记录操作日志
1. 配置文件介绍

   ```yaml
   lamp:
     log:
       enabled: false  # false=禁用操作日志 true=开启
       type: DB   # 日志存储位置   DB=数据库  LOGGER=日志文件
   ```
2. 注解属性介绍详看@WebLog中的注释!  其中value属性是支持SpEL表达式的。

3. 注解使用举例

   ```java
   // 禁用操作日志
   @WebLog(enabled = false)
   
   //  response = false不记录方法的响应参数
   // #params?.current、#params?.size 表示动态获取 方法params参数的current、size字段的值
   @WebLog(value = "'分页列表查询:第' + #params?.current + '页, 显示' + #params?.size + '行'", response = false)
   public R<IPage<ResultVO>> page(@RequestBody @Validated PageParams<PageQuery> params) {
   }
   
   // requestByError = false 表示, 方法报错时, 也不记录请求参数
   @WebLog(value = "'保存订单:订单编码' + #data?.code + ', 订单Id：' + #data?.name", request = false, requestByError = false)
   ```
4. 存储

  ```java{11}
  @Configuration
  public class BaseWebConfiguration extends BaseConfig {
  
      /**
       * lamp.log.enabled = true 并且 lamp.log.type=DB时实例该类
       */
      @Bean
      @ConditionalOnExpression("${lamp.log.enabled:true} && 'DB'.equals('${lamp.log.type:LOGGER}')")
      public SysLogListener sysLogListener(BaseOperationLogService logApi) {
      		// 关键的存储代码为 logApi.save 方法
          return new SysLogListener(data -> logApi.save(BeanPlusUtil.toBean(data, BaseOperationLogSaveVO.class)));
      }
  }
  
  ```

5. 原理
    通过AOP拦截标记了@WebLog 的方法,  拦截后, SysLogAspect 中的方法用于获取被拦截方法的入参和返回值. 然后发布一个SysLogEvent事件 (为了让操作日志尽可能少的影响方法调用时长,采用事件方式来异步处理, 大家也可以改成消息队列之类的), SysLogListener 监听器接收到事件后, 调用`consumer.accept` 方法, 让对操作日志进行存储.



<!-- #region defaults -->

## defaults.xml 全局的logback 日志基础模版

这个logback的配置文件将整个项目中最常用的日志配置抽取到这里.
1. 通过springProperty标签设置的参数,  可以在项目的application.yml配置文件中, 设置source属性对其defaultValue进行覆盖

   ::: code-tabs

   @tab defaults.xml

   ```xml
   <!-- log.path 属性来源于 yml配置中的 logging.file.path 属性, 若yml中没有配置 logging.file.path, 则取默认值/data/projects/logs ,在logback配置文件的任意地方, 都能使用 ${log.path}读取这个参数. -->
   
   <springProperty scope="context" name="log.path" source="logging.file.path" defaultValue="/data/projects/logs"/>
   ```

   @tab bootstrap.yml

   ```yaml
   logging:
     file: 
       path: /root/logs  # 在yml中设置这个参数后, 日志的生成路径就会到 /root/logs
   ```

   :::
2. 文件中有类似 `ASYNC_CONTROLLER_APPENDER `、`CONTROLLER_APPENDER` 之类的Appender, 区别在于 

   - `ASYNC_ ` 开头的Appender采用了`异步输出日志`, 而没有 `ASYNC_ ` 开头的Appender采用了`实时输出日志`.  
   - 异步输出 性能明显好于 实时输出, 
   - 异步输出有一些参数无法记录，所以在生产环境打印的日志文件中, 有很多 `?`. 

   ```shell
   # 2个问号 表示那个方法, 那行 , 但由于使用了异步输出, 所以输出为 ? 
   
   [lamp-authority-server:8760:0000:2] 2020-12-15 17:53:12.191[ INFO] 22531 50b3bd53c2f344e790834b587a7f1891] [task-13961:934466928] [top.tangyh.basic.database.mybatis.WriteInterceptor.?:?] mapper id=top.tangyh.lamp.authority.dao.common.OptLogExtMapper.insert, userId=0
   ```
3. defaults.xml 中配置了如下信息
   - springProperty： spring 环境配置
   - appender： 定义了Controller、Service、Dao、第三方jar、全局异常类、root等appender
4. defaults-dev.xml： 实时配置文件，用于配置项目在`开发环境`的全局日志输出规则。性能低，实时性高。

5. defaults-prod.xml ： 异步配置文件，用于配置项目在`生产环境`的全局日志输出规则。 性能高，实时性低。

6. 项目运行中的业务日志，请在各自项目的resources目录下配置 logback-spring.xml（生产） 或 logback-spring-dev.xml （开发）

<!-- #endregion defaults -->
