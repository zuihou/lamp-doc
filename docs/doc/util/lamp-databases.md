---
title: lamp-databases
icon: wendang
index: false
category:
  - 工具类
tag:
  - 工具类
  - lamp-databases
---

封装了数据源、Mybatis相关配置类、工具类。

## 源码解释

```sh
└── top
    └── tangyh
        └── basic
            └── database
                ├── datasource
                │   ├── BaseMybatisConfiguration.java               # 全局Mybatias公共配置
                │   └── LampMetaObjectHandler.java								  # 元对象字段(id、created_by等字段)填充控制器
                ├── injector
                │   ├── LampSqlInjector.java												# SQL 注入器（增强SuperMapper中全局接口）
                │   └── method
                │       └── UpdateAllById.java											# 具体注入的方法
                ├── mybatis
                │   ├── WriteInterceptor.java												# 禁止修改、删除重要数据拦截器
                │   ├── conditions
                │   │   ├── Wraps.java															# 对mybatis-plus提供的Wrappers增强
                │   │   ├── query
                │   │   │   ├── LbQueryWrap.java										# 对mybatis-plus提供的LambdaQueryWrapper增强
                │   │   │   └── QueryWrap.java											# 对mybatis-plus提供的QueryWrapper增强
                │   │   └── update
                │   │       └── LbUpdateWrap.java										# 对mybatis-plus提供的LambdaUpdateWrapper增强
                │   ├── handlers
                │   │   └── MybatisEnumTypeHandler.java							# JavaBean字段枚举类型的转换器
                │   └── typehandler
                │       ├── BaseLikeTypeHandler.java								# 模糊查询类型处理器									
                │       ├── FullLikeTypeHandler.java
                │       ├── LeftLikeTypeHandler.java
                │       └── RightLikeTypeHandler.java
                ├── p6spy
                │   └── TenantP6SpyLogger.java											# 控制如何打印 p6spy SQL语句 
                ├── plugins
                │   ├── LampTenantLineInnerInterceptor.java					# DATASOURCE_COLUMN模式 自动拼接SQL拦截器
                │   ├── TenantLineAnnotationRegister.java
                │   └── TenantLineHelper.java
                └── properties																			# 配置类
                    ├── DatabaseProperties.java
                    ├── IdType.java
                    └── MultiTenantType.java
```





## DatabaseProperties配置文件

```yaml
lamp:
  database: # 字段介绍参考 DatabaseProperties
    # COLUMN模式中隔离 租户 的列名  oracle数据库initDatabasePrefix不能超过11个字符
    initDatabasePrefix:
      - lamp_base  
    # COLUMN模式自动拼接租户条件的字段  
    tenantIdColumn: 'created_org_id'      
    # 数据源模式
    multiTenantType: DATASOURCE_COLUMN    
    # 是否不允许写入数据  WriteInterceptor
    isNotWrite: false
    # 是否启用数据权限
    isDataScope: true
    # 是否启用  sql性能规范插件
    isBlockAttack: false
    # 是否启用  sql性能规范插件
    isIllegalSql: false
    # 是否启用分布式事务
    isSeata: false
    # 生产环境请设置p6spy = false
    p6spy: true
    # 单页分页条数限制
    maxLimit: -1
    # 溢出总页数后是否进行处理
    overflow: true
    # 生成 countSql 优化掉 join, 现在只支持 left join
    optimizeJoin: true
    # id生成策略    # 可选值 HU_TOOL、DEFAULT、CACHE
    id-type: CACHE
    # id生成策略 = HU_TOOL时，配置项。参数说明参考：https://hutool.cn/docs/#/core/%E5%B7%A5%E5%85%B7%E7%B1%BB/%E5%94%AF%E4%B8%80ID%E5%B7%A5%E5%85%B7-IdUtil?id=snowflake
    hutoolId:
    	# 终端ID (0-31)      单机配置0 即可。 集群部署，根据情况每个实例自增即可。
      workerId: 0
      # 数据中心ID (0-31)   单机配置0 即可。 集群部署，根据情况每个实例自增即可。
      dataCenterId: 0
    # id生成策略 = DEFAULT时，配置项。参数说明参考：https://github.com/baidu/uid-generator
    default-id:   
      time-bits: 31
      worker-bits: 22
      seq-bits: 10
    # id生成策略 = CACHE时，配置项。
    cache-id:
    	# 当前时间，相对于时间基点"${epochStr}"的增量值，单位：秒，
      time-bits: 31
      # 机器id
      worker-bits: 22
      # 每秒下的并发序列，13 bits可支持每秒8192个并发，即2^13个并发
      seq-bits: 10
      # 客户历元，单位为秒。可以改成你的项目开始开始的时间
      epochStr: '2020-09-15'
      # RingBuffer size扩容参数, 可提高UID生成的吞吐量.
      boost-power: 3              
      # 指定何时向RingBuffer中填充UID, 取值为百分比(0, 100), 默认为50
      padding-factor: 50
```


## LampMetaObjectHandler

MyBatis Plus 元数据处理类，用于自动 注入 id, createdTime, updatedTime, createdBy, updatedBy 等字段

### 判断逻辑

- insert 方法，自动填充 id, createdTime, updatedTime, createdBy, updatedBy 字段，字段为空时==自动生成==，不为空时使用==原始值==。

- update 方法，自动填充 id, updatedTime, updatedBy 字段，字段为空时==自动生成==，不为空时使用==原始值==。

### 注入值

- id

  ::: tip

  不知道从那个版本开始，mybatis-plus 的id字段 INPUT 类型的赋值方式不受 ==@TableId(type = IdType.INPUT)== 决定，若你的实体类总只有id字段，没有createdBy、createdTime等字段，LampMetaObjectHandler类的代码不会执行，请参考[mybaits-plus官方](https://baomidou.com/pages/e131bd/)寻找解决方案。

  :::

  ::: code-tabs

  @tab 配置

  ```java
  @Slf4j
  public class LampMetaObjectHandler implements MetaObjectHandler {
    	private void fillId(MetaObject metaObject) {
          if (uidGenerator == null) {
              // 这里使用SpringUtils的方式"异步"获取对象，防止启动时，报循环注入的错
              uidGenerator = SpringUtils.getBean(UidGenerator.class);
          }
          // 根据 lamp.database.id-type 决定实现类
          Long id = uidGenerator.getUid();
  
          //1. 继承了SuperEntity 若 ID 中有值，就不设置
          if (metaObject.getOriginalObject() instanceof SuperEntity) {
              Object oldId = ((SuperEntity) metaObject.getOriginalObject()).getId();
              if (oldId != null) {
                  return;
              }
              // 判断id字段的类型是字符串还是Long
              Object idVal = StrPool.STRING_TYPE_NAME.equals(metaObject.getGetterType(SuperEntity.ID_FIELD).getName()) ? String.valueOf(id) : id;
              this.setFieldValByName(SuperEntity.ID_FIELD, idVal, metaObject);
              return;
          }
  
          // 2. 没有继承SuperEntity， 但主键的字段名为：  id
          if (metaObject.hasGetter(SuperEntity.ID_FIELD)) {
              Object oldId = metaObject.getValue(SuperEntity.ID_FIELD);
              if (oldId != null) {
                  return;
              }
  
              Object idVal = StrPool.STRING_TYPE_NAME.equals(metaObject.getGetterType(SuperEntity.ID_FIELD).getName()) ? String.valueOf(id) : id;
              this.setFieldValByName(SuperEntity.ID_FIELD, idVal, metaObject);
              return;
          }
  
          // 3. 实体没有继承 Entity 和 SuperEntity，且 主键名为其他字段
          TableInfo tableInfo = TableInfoHelper.getTableInfo(metaObject.getOriginalObject().getClass());
          if (tableInfo == null) {
              return;
          }
          // 主键类型
          Class<?> keyType = tableInfo.getKeyType();
          if (keyType == null) {
              return;
          }
          // id 字段名
          String keyProperty = tableInfo.getKeyProperty();
          Object oldId = metaObject.getValue(keyProperty);
          if (oldId != null) {
              return;
          }
  
          // 反射得到 主键的值
          Field idField = ReflectUtil.getField(metaObject.getOriginalObject().getClass(), keyProperty);
          Object fieldValue = ReflectUtil.getFieldValue(metaObject.getOriginalObject(), idField);
          // 若 ID 中有值，就不设置
          if (ObjectUtil.isNotEmpty(fieldValue)) {
              return;
          }
          Object idVal = keyType.getName().equalsIgnoreCase(StrPool.STRING_TYPE_NAME) ? String.valueOf(id) : id;
          this.setFieldValByName(keyProperty, idVal, metaObject);
      }
  }
  ```

  @tab 实体类

  ```java
  public class SuperEntity<T> implements Serializable {
    	@TableId(value = "id", type = IdType.INPUT)
      protected T id;
  }
  ```

  @tab uid实现类

  ```java
  public abstract class BaseMybatisConfiguration {
  		/**
       * lamp.database.id-type = DEFAULT 或 lamp.database.id-type 未设置时启用。
       */
      @Bean
      @ConditionalOnMissingBean
      @ConditionalOnProperty(prefix = DatabaseProperties.PREFIX, name = "id-type", havingValue = "DEFAULT", matchIfMissing = true)
      public UidGenerator getDefaultUidGenerator(DisposableWorkerIdAssigner disposableWorkerIdAssigner) {
          DefaultUidGenerator uidGenerator = new DefaultUidGenerator();
          BeanUtil.copyProperties(databaseProperties.getDefaultId(), uidGenerator);
          uidGenerator.setWorkerIdAssigner(disposableWorkerIdAssigner);
          return uidGenerator;
      }
      /**
       * lamp.database.id-type = CACHE 时启用。
       */
      @Bean
      @ConditionalOnMissingBean
      @ConditionalOnProperty(prefix = DatabaseProperties.PREFIX, name = "id-type", havingValue = "CACHE")
      public UidGenerator getCacheUidGenerator(DisposableWorkerIdAssigner disposableWorkerIdAssigner) {
          CachedUidGenerator uidGenerator = new CachedUidGenerator();
          DatabaseProperties.CacheId cacheId = databaseProperties.getCacheId();
          BeanUtil.copyProperties(cacheId, uidGenerator);
          if (cacheId.getRejectedPutBufferHandlerClass() != null) {
              RejectedPutBufferHandler rejectedPutBufferHandler = ReflectUtil.newInstance(cacheId.getRejectedPutBufferHandlerClass());
              uidGenerator.setRejectedPutBufferHandler(rejectedPutBufferHandler);
          }
          if (cacheId.getRejectedTakeBufferHandlerClass() != null) {
              RejectedTakeBufferHandler rejectedTakeBufferHandler = ReflectUtil.newInstance(cacheId.getRejectedTakeBufferHandlerClass());
              uidGenerator.setRejectedTakeBufferHandler(rejectedTakeBufferHandler);
          }
          uidGenerator.setWorkerIdAssigner(disposableWorkerIdAssigner);
          return uidGenerator;
      }
      /**
       * lamp.database.id-type = HU_TOOL 时启用。
       */
      @Bean
      @ConditionalOnMissingBean
      @ConditionalOnProperty(prefix = DatabaseProperties.PREFIX, name = "id-type", havingValue = "HU_TOOL")
      public UidGenerator getHuToolUidGenerator() {
          DatabaseProperties.HutoolId id = databaseProperties.getHutoolId();
          return new HuToolUidGenerator(id.getWorkerId(), id.getDataCenterId());
      }
  }
  ```

  

  :::

- createdTime

  字段为空时，赋值为LocalDateTime.now()，不为空时使用==原始值==。

- updatedTime

  字段为空时，赋值为LocalDateTime.now()，不为空时使用==原始值==。

- createdBy

  字段为空时，赋值为ContextUtil.getUserId()，不为空时使用==原始值==。

- updatedBy

  字段为空时，赋值为ContextUtil.getUserId()，不为空时使用==原始值==。



## SuperMapper增强

- LampSqlInjector

  SuperMapper的自定义sql 注入器

- UpdateAllById

  增强Mapper功能，使得SuperMapper拥有修改所有字段等方法.



## Wraps

对MybatisPlus的Wrappers类的增强，若你不想使用下列功能，可以直接使用Wrappers。

- LbqWrapper

  相比 LambdaQueryWrapper 的增强如下：
  * new LbQueryWrap(T entity)时， 对 entity 中的string字段 %和_ 符号进行转义，便于模糊查询
  * 对nested、eq、ne、gt、ge、lt、le、in、like等方法 进行条件判断，null 或 "" 字段不加入查询
  * 对like方法的参数 %和_ 符号进行转义，便于模糊查询
  * 增加 leFooter 方法， 将日期参数值，强制转换成当天 23：59：59
  * 增加 geHeader 方法， 将日期参数值，强制转换成当天 00：00：00
- QueryWrap

  相比 QueryWrapper 的增强如下：

  * new QueryWrapper(T entity)时， 对entity 中的string字段 %和_ 符号进行转义，便于模糊查询
  * 对nested、eq、ne、gt、ge、lt、le、in、like 等方法 进行条件判断，null 或 "" 字段不加入查询
  * 对like方法的参数 %和_ 符号进行转义，便于模糊查询
  * 增加 leFooter 方法， 将日期参数值，强制转换成当天 23：59：59
  * 增加 geHeader 方法， 将日期参数值，强制转换成当天 00：00：00

- LbuWrapper
  - 对nested、eq、ne、gt、ge、lt、le、in、like等方法 进行条件判断，null 或 "" 字段不加入查询
  - 对like方法的参数 %和_ 符号进行转义，便于模糊查询

::: code-tabs

@tab 代码

```java
BaseEmployee entity = new BaseEmployee();
entity.setRealName("ls");
LbQueryWrap<BaseEmployee> wrap1 = Wraps.<BaseEmployee>lbQ(entity);

LbQueryWrap<BaseEmployee> wrap2 = Wraps.<BaseEmployee>lbQ().like(BaseEmployee::getRealName, "zs").eq(BaseEmployee::getId, null)
        .in(BaseEmployee::getUserId, Collections.emptyList());

// 模糊查询 realName 字段为  zs_1  和  ls% 的
LbQueryWrap<BaseEmployee> wrap3 = Wraps.<BaseEmployee>lbQ().like(BaseEmployee::getRealName, "zs_1").like(BaseEmployee::getRealName, "ls%");

LbQueryWrap<BaseEmployee> wrap4 =  Wraps.<BaseEmployee>lbQ().leFooter(BaseEmployee::getCreatedTime, LocalDateTime.now()).geHeader(BaseEmployee::getCreatedTime, LocalDateTime.now());
```

@tab 输出

```sql
-- wrap1
select * from base_employee where (real_name LIKE '%ls%')

-- wrap2 空参数不拼接到sql中
select * from base_employee where (real_name LIKE '%zs%')

-- wrap3 特殊字符自动转义： _ 和 % 转义为  \_ 和 \%
select * from base_employee where (real_name LIKE '%zs\_1%' AND real_name LIKE '%ls\%')

-- wrap4 日期字段转换
select * from base_employee where (created_time <= '2023-04-07 23:59:59' AND created_time >= '2023-04-07 00:00:00')
```

:::



## TypeHandler

自定义模糊查询处理器，在xml中使用 like 关键字模糊查询时，无需自己拼接`%`了

- FullLikeTypeHandler

- LeftLikeTypeHandler

- RightLikeTypeHandler

  ::: code-tabs

  @tab xml

  ```xml
  <select id="get">
  select * from user where 1=1
  and name like #{name, typeHandler=fullLike} 
  and code like #{code, typeHandler=leftLike}  
  and describe like #{describe, typeHandler=rightLike}  
  </select>
  ```

  @tab sql

  ```sql
  select * from user where 1=1
  and name like '%name%'
  and code like '%code'
  and describe like 'describe%' 
  ```

  :::

-  MybatisEnumTypeHandler

  自定义枚举属性转换器。若枚举中有 value 字段，存取数据库时，按照value字段的值来匹配；若没有value字段，存取数据库时，按照name()的值来匹配。

  ```java
  public enum AgeEnum implements IEnum<Integer> {
      ONE(1, "一岁"),
      TWO(2, "二岁"),
      THREE(3, "三岁");
  
    	// 映射到数据库中的值  实际存取的值为 1、2、3 ；若没有value字段，且没有 getValue()， 实际存取的值为ONE、TWO、THREE
      private int value;
      private String desc;
  
      @Override
      public Integer getValue() {
          return this.value;
      }
  }
  ```

  

## TenantP6SpyLogger

p6spy SQL日志打印类。可以自己调整该类实现控制台打印的红色SQL日志样式。

### 常见问题

1. 输出的sql中 null 时什么意思？

   ```shell
   lamp_base: null TenantId: null UserId: null 
    Consume Time：65 ms 2023-04-07 15:12:52 
    url: jdbc:mysql://127.0.0.1:3306/lamp_ds_c_defaults?serverTimezone=Asia/Shanghai&characterEncoding=utf8&useUnicode=true&useSSL=false&autoReconnect=true&zeroDateTimeBehavior=convertToNull&allowMultiQueries=true&nullCatalogMeansCurrent=true 
    Execute SQL：INSERT INTO worker_node( host_name,port, type, launch_date,modified,created) VALUES ('192.168.1.181','1680851571522-78666',2,'2023-04-07T15:12:51.500+0800','2023-04-07T15:12:51.534+0800', '2023-04-07T15:12:51.534+0800') 
   ```

   - lamp_base： 当前待操作SQL的租户库ID
   - TenantId：当前请求的租户ID
   - UserId：当前请求的用户ID

   若ContextUtil工具类中获取不到上述参数，就会打印为null。  

2. 输出的sql为什么是红色的？

   ::: code-tabs

   @tab p6spy.properties

   ```properties
   #日志输出到控制台  可以修改为自己的实现类
   appender=com.baomidou.mybatisplus.extension.p6spy.StdoutLogger
   ```

   @tab java

   ```java
   public class StdoutLogger extends com.p6spy.engine.spy.appender.StdoutLogger {
   
       @Override
       public void logText(String text) {
           // 打印红色 SQL 日志
           System.err.println(text);
       }
   }
   ```

   :::



## LampTenantLineInnerInterceptor

DATASOURCE_COLUMN模式专用的 小租户SQL处理拦截器，自动拦截SQL语句，并拼接小租户的条件。

::: code-tabs

@tab 配置

```java{16,36}
public class MybatisAutoConfiguration extends BaseMybatisConfiguration {
    public MybatisAutoConfiguration(DatabaseProperties databaseProperties) {
        super(databaseProperties);
    }

    @Override
    protected List<InnerInterceptor> getPaginationBeforeInnerInterceptor() {
        List<InnerInterceptor> list = new ArrayList<>();
        if (MultiTenantType.DATASOURCE_COLUMN.eq(databaseProperties.getMultiTenantType())) {
            log.info("检查到配置了:{}模式，已加载 column 部分插件", databaseProperties.getMultiTenantType());
            // COLUMN 模式 多租户插件
            LampTenantLineInnerInterceptor tli = new LampTenantLineInnerInterceptor();
            tli.setTenantLineHandler(new TenantLineHandler() {
                @Override
                public String getTenantIdColumn() {
                    return databaseProperties.getTenantIdColumn();
                }

                @Override
                public boolean ignoreTable(String tableName) {
                    // 这里可以自己在ContextUtil 中加入一个 isIgnore、setIgnore、clearIgnore 方法，动态控制是否需要排除
//                    if (ContextUtil.isIgnore()) {
//                    ContextUtil.clearIgnore();
//                        return true;
//                    }

                    boolean ignoreTable = databaseProperties.getIgnoreTable() != null && databaseProperties.getIgnoreTable().contains(tableName);

                    boolean ignoreTablePrefix = databaseProperties.getIgnoreTablePrefix() != null &&
                            databaseProperties.getIgnoreTablePrefix().stream().anyMatch(prefix -> tableName.startsWith(prefix));
                    return ignoreTable || ignoreTablePrefix;
                }

                @Override
                public Expression getTenantId() {
                    return new LongValue(ContextUtil.getCurrentCompanyId());
                }
            });
          
            list.add(tli);
        }

        return list;
    }
}
```

@tab Mapper

```java
@Repository
@TenantLine  // 加了@TenantLine注解，该类下的所有方法都会被拦截器拦截，并自动拼接 小租户SQL条件
public interface BaseEmployeeTestMapper extends SuperMapper<BaseEmployee> {
    /**
     * @TenantLine(false) 表示该方法不被拦截
     */
    @TenantLine(false)
    @Select("select * from base_employee where id = #{id}")
    BaseEmployee get(Long id);

}
```

:::

## TenantLineInnerInterceptor

mybatis-plus 提供的租户拦截器，在COLUMN模式中使用。

### 区别

1. TenantLineInnerInterceptor 会将默认将所有的Mapper查询都动态拼接上条件

2. LampTenantLineInnerInterceptor 则默认不会拼接

3. TenantLineInnerInterceptor 可以通过在Mapper类上加 `@InterceptorIgnore(tenantLine = "true")` ，防止拦截器拼接条件

4. LampTenantLineInnerInterceptor 则需要在Mapper类上加 `@TenantLine` ，在会动态拼接条件

5. 无其他区别，拼接SQL的代码完全一致

   

```
```

