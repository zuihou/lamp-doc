---
title: lamp-cache-starter
icon: wendang
index: false
category:
  - 工具类
tag:
  - 工具类
  - lamp-cache-starter
---

本模块将 ==分布式缓存redis== 和 ==内存缓存caffeine== 的一些基础方法抽象出来，达到平滑切换缓存的目的。业务系统需要操作缓存时，注入 CacheOps 类调用其方法即可。但这样做有几个缺陷： redis 的一些特殊方法将无法使用 list、set、hash 高级功能, 故特意新增一个CacheOpsPlus 类支持redis全部接口，使用caffeine + CacheOpsPlus时，list、set、hash等接口不会生效。

建议: 在caffeine实现是为了解决开发环境没有部署redis时应急使用, 生产环境请使用redis 实现.

## 使用lamp-cache-starter后想用redis的特殊方法怎么用？
配置文件配置lamp.cache.type=redis后，注入CacheOpsPlus即可， 只要你能保证系统必须依赖redis即可。
但CacheOpsPlus基于内存等实现不能保证代码的正确性!!! (开发环境没有部署redis时,将配置调整成caffeine应急使用)

## 为啥要在封装一次？
1. 项目比较小（基本都是CRUD功能），而且团队中会优雅使用redis的比较少，而且会频繁的复制代码到N个项目，每个项目随时都可能会重新部署或者迁移一套环境用于演示，
   这里就是想让一些部署去演示的项目，直接用内存缓存即可，少部署一个redis。
- 开发电脑配置比较低，启动太多中间件会很卡，对于专心编码的用户来说，少启动一个中间件，对开发的体验比较好

## 本模块核心API
- CacheResult：缓存返回对象

  封装了key、field、过期时间、真实的缓存值、是否缓存的空值等属性，方便调用者判断查询的值是不存在还是缓存的空值。

- CacheOps : 基础缓存操作类

- CachePlusOps : 增强缓存操作类, 包含了redis常用的方法

- RedisOps：redis专用缓存操作类，对redisTemplate进行了二次封装

  `top.tangyh.basic.cache.redis.RedisOps`和`top.tangyh.basic.cache.redis2.RedisOps`的区别在于查询类方法的返回值不同。后者的返回值使用CacheResult类进行包装

- CacheKey  (为了解耦, 已经移动到你lamp-core模块下) : 封装缓存 key 和 过期时间

- RedisDistributedLock : 分布式锁的简单实现

## 注意事项
1. 本模块虽然实现了SpringCache管理器重写, 但不建议在项目中使用. (原因: 使用this调用方法时, @Cache不生效) 

2. CAFFEINE模式==请勿在生产使用==, 仅仅支持本地环境没有redis环境时应急使用.

3. 通过`lamp.cache.cacheNullVal` 全局配置是否缓存空值

4. 通过`lamp.cache.serializerType`  配置redis类型的缓存序列化的方式。 

   ::: warning

   修改序列化类型后，需要先清空redis的所有缓存，并重启项目。 生产环境请勿轻易、经常切换序列化类型！

   :::

   ```yml
   lamp:
     cache:
       type: REDIS
       cacheNullVal: true  #是否缓存空值
       serializerType:  ProtoStuff # 序列化类型 支持：JACK_SON、ProtoStuff、JDK
       # def:   # 不推荐使用。 用来配置Spring提供的@Cache的，自行阅读源码
       # configs:  # 不推荐使用。 用来配置Spring提供的@Cache的，自行阅读源码
   ```
5. serializerType使用 JACK_SON 类型时，直接存储Long类型的值，从redis中取出数据时，需要手动强制转换成Long才行，否则会报错！
6. lamp-cloud 不能使用内存缓存，否则无法登录，lamp-boot可以。

## 新服务中如何接入
1. 在pom.xml中加依赖

   ```xml
   <dependency>
       <groupId>top.tangyh.basic</groupId>
       <artifactId>lamp-cache-starter</artifactId>
   </dependency>
   ```

2. 在 redis.yml 中加入配置

   ```yml
   lamp:
     redis:
       ip: 127.0.0.1
       port: 16379
       password: SbtyMveYNfLzTks7H0apCmyStPzWJqjy
       database: 0
     cache:
       type: REDIS    # CAFFEINE
       cacheNullVal:  true   # 是否缓存null值
       serializerType:  ProtoStuff # 序列化类型 支持：JACK_SON、ProtoStuff、JDK
   spring:
     redis:
       host: ${lamp.redis.ip}
       password: ${lamp.redis.password}
       port: ${lamp.redis.port}
       database: ${lamp.redis.database}
   ```

3. 若缓存想使用CAFFEINE缓存（lamp.cache.type=CAFFEINE）, 需要在依赖中排除redis

   ::: warning

   cloud模式不建议使用CAFFEINE缓存，因为跨服务使用同一缓存时，无法同步不同服务之间的数据。

   :::

   ```xml
   <dependency>
       <groupId>top.tangyh.basic</groupId>
       <artifactId>lamp-cache-starter</artifactId>
       <exclusions>
           <exclusion>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-starter-data-redis</artifactId>
           </exclusion>
       </exclusions>
   </dependency>
   ```

4. 为需要缓存的数据创建CacheKeyBuilder ，如 `ApplicationCacheKeyBuilder`

   ```java
   public class ApplicationCacheKeyBuilder implements CacheKeyBuilder {
     	// key 是否拼接租户ID
       @Override
       public String getTenant() {
           return null;
       }
   		// key的统一前缀
       @Override
       public String getPrefix() {
           return CacheKeyModular.PREFIX;
       }
   		// key 属于那个服务
       @Override
       public String getModular() {
           return CacheKeyModular.SYSTEM;
       }
   		// key 属于那个表
       @Override
       public String getTable() {
           return CacheKeyTable.System.APPLICATION;
       }
   		// key 根据那个字段缓存
       @Override
       public String getField() {
           return SuperEntity.ID_FIELD;
       }
   		// value 的类型
       @Override
       public ValueType getValueType() {
           return ValueType.obj;
       }
   		// key 的有效期
       @Override
       public Duration getExpire() {
           return Duration.ofHours(24);
       }
   }
   ```

5. 需要操作缓存的地方注入CacheOps

   ```java
   @Autowired  // 普通缓存功能
   private CacheOps cacheOps;
   @Autowired   // 增强功能
   private CachePlusOps cachePlusOps;
   
   public void teset(){
       // 封装一个key
       CacheKey cacheKey = new VerificationCodeCacheKeyBuilder().key(data.getType().name(), data.getMobile());
       // 操作缓存
       cacheOps.set(cacheKey, code);
   }	
   ```

   


## 原理
为什么在pom中引入依赖 `lamp-cache-starter` 后，在项目中就能注入使用了？
```java
@Autowired
private CacheOps cacheOps;
@Autowired
private CacheOpsPlus cacheOpsPlus;
```

1. `lamp-cache-starter/src/main/resources/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` 中有如下配置，该配置会在项目启动时，自动加载 CacheAutoConfigure 类。

   ```properties
   top.tangyh.basic.cache.CacheAutoConfigure
   ```

2. 这个类通过注解启用了缓存， 并导入 Caffeine 自动配置类和 Redis 自动配置类

   ```java
   @EnableCaching
   @Import({
           CaffeineAutoConfigure.class, RedisAutoConfigure.class
   })
   public class CacheAutoConfigure {
   //省略...
   }	
   ```

3. CaffeineAutoConfigure 会读取yml里面的配置，  当 lamp.cache.type=CAFFEINE 时生效，CaffeineAutoConfigure类内部实例化了CaffeineOpsImpl。 RedisAutoConfigure 在lamp.cache.type=REDIS时生效，lamp.cache.type没有配置时，默认使用redis的配置，RedisAutoConfigure内部实例化了RedisOpsImpl。

   ```java
   @Slf4j
   @ConditionalOnProperty(name = "lamp.cache.type", havingValue = "CAFFEINE")
   @EnableConfigurationProperties({CustomCacheProperties.class})
   public class CaffeineAutoConfigure {
       @Bean
       @ConditionalOnMissingBean
       public CacheOps cacheOps() {
           return new CaffeineOpsImpl();
       }
       @Bean
       @ConditionalOnMissingBean
       public CachePlusOps cachePlusOps() {
           return new CaffeineOpsImpl();
       }
   }
   
   @ConditionalOnClass(RedisConnectionFactory.class)
   @ConditionalOnProperty(name = "lamp.cache.type", havingValue = "REDIS", matchIfMissing = true)
   @EnableConfigurationProperties({RedisProperties.class, CustomCacheProperties.class})
   public class RedisAutoConfigure {
       @Bean
       @ConditionalOnMissingBean
       public CacheOps cacheOps(RedisOps redisOps) {
           return new RedisOpsImpl(redisOps);
       }
       @Bean
       @ConditionalOnMissingBean
       public CachePlusOps cachePlusOps(RedisOps redisOps) {
           return new RedisOpsImpl(redisOps);
       }
   }
   ```

4. 在项目中注入CacheOps 或者 CacheOpsPlus 即可。





## 缓存的Key

### CacheKey

k-v类型缓存的key，封装缓存的key和key的有效期。



### CacheHashKey

hash类型缓存的key，封装缓存的key、field以及key的有效期。



### CacheKeyBuilder

key的构造器，用来生成key并构造CacheKey。生成key的规则如下

```java
/**
 * 根据动态参数 拼接key
 * <p>
 * key命名规范：[租户编码:][服务模块名:]业务类型[:业务字段][:value类型][:业务值]
 *
 * @param uniques 动态参数
 * @return
 */
default String getKey(Object... uniques) {
    ArrayList<String> regionList = new ArrayList<>();
    String prefix = this.getPrefix();
    if (StrUtil.isNotEmpty(prefix)) {
        regionList.add(prefix);
    }

    String tenant = this.getTenant();
    // 租户编码：存储默认库的全局缓存，可以重写getTenant并返回null
    if (StrUtil.isNotEmpty(tenant)) {
        regionList.add(tenant);
    }
    // 服务模块名
    String modular = getModular();
    if (StrUtil.isNotEmpty(modular)) {
        regionList.add(modular);
    }
    // 业务类型
    String table = this.getTable();
    ArgumentAssert.notEmpty(table, "缓存业务类型不能为空");
    regionList.add(table);
    // 业务字段
    String field = getField();
    if (StrUtil.isNotEmpty(field)) {
        regionList.add(field);
    }
    // value类型
    ValueType valueType = getValueType();
    if (valueType != null) {
        regionList.add(valueType.name());
    }

    // 业务值
    for (Object unique : uniques) {
        if (ObjectUtil.isNotEmpty(unique)) {
            regionList.add(String.valueOf(unique));
        }
    }
    return CollUtil.join(regionList, StrPool.COLON);
}
```

