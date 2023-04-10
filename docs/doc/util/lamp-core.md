---
title: lamp-core
icon: wendang
index: false
category:
  - 工具类
tag:
  - 工具类
  - lamp-core
---

该模块定义项目中最核心、最常用的工具类、特殊Bean、自定义异常、自定义转换器等。

## 源码介绍

```java
├── com
│   └── fasterxml
│       └── jackson
│           └── databind
│               └── deser
│                   └── std
│                       └── EnumDeserializer.java							# 覆盖 jackson 官方EnumDeserializer           
└── top
    └── tangyh
        └── basic
            ├── base
            │   ├── R.java																		# 全局统一返回
            │   └── entity
            │       ├── Entity.java														# 公共实体父类
            │       ├── SuperEntity.java
            │       └── TreeEntity.java
            ├── constant
            │   └── Constants.java														# 常量类	
            ├── context
            │   ├── ContextConstants.java											# 上下文常量
            │   └── ContextUtil.java													# 上下文工具类
            ├── converter
            │   ├── BaseDateConverter.java										# 日期转换器
            │   ├── EnumSerializer.java												# 枚举序列化处理器
            │   ├── LampLocalDateTimeDeserializer.java				# LocalDateTime 反序列化处理器
            │   ├── String2DateConverter.java									# 日期转换器
            │   ├── String2LocalDateConverter.java
            │   ├── String2LocalDateTimeConverter.java
            │   └── String2LocalTimeConverter.java
            ├── exception																			# 自定义异常
            │   ├── ArgumentException.java
            │   ├── BaseCheckedException.java
            │   ├── BaseException.java
            │   ├── BaseUncheckedException.java
            │   ├── BizException.java
            │   ├── CommonException.java
            │   ├── ForbiddenException.java
            │   ├── UnauthorizedException.java
            │   └── code
            │       ├── BaseExceptionCode.java
            │       └── ExceptionCode.java
            ├── function
            │   ├── CheckedFunction.java
            │   └── Either.java
            ├── interfaces																		# 常用接口
            │   ├── BaseEnum.java
            │   ├── echo
            │   │   ├── EchoService.java
            │   │   ├── EchoVO.java
            │   │   └── LoadService.java
            │   └── validator
            │       └── IValidatable.java
            ├── jackson																				# json 工具类
            │   ├── JsonUtil.java
            │   └── LampJacksonModule.java
            ├── model
            │   ├── Kv.java
            │   ├── cache
            │   │   ├── CacheHashKey.java
            │   │   ├── CacheKey.java
            │   │   └── CacheKeyBuilder.java
            │   └── log
            │       └── OptLogDTO.java
            └── utils																					# 常用工具类	
                ├── AntiSqlFilterUtils.java
                ├── ArgumentAssert.java
                ├── Arith.java
                ├── BeanPlusUtil.java
                ├── ClassUtils.java
                ├── CollHelper.java
                ├── DateUtils.java
                ├── DbPlusUtil.java
                ├── DefValueHelper.java
                ├── PingYinUtil.java
                ├── SpringUtils.java
                ├── StrHelper.java
                ├── StrPool.java
                ├── TreeUtil.java
                └── ValidatorUtil.java
```

## 基础Bean
1. R:   全局返回类. 定义了统一的返回格式

   ```json
   {
   	"code": 0,  // 状态码  0表示请求成功 其他请求失败
   	"data": {   //  业务数据
   	},
   	"errorMsg": "", //错误消息
   	"extra": {}, // 扩展数据
   	"isSuccess": true,  // 是否请求成功
   	"msg": "",  // 响应消息
   	"path": "",  // 访问失败时的请求路径
   	"timestamp": 0  // 后端响应时的时间戳
   }
   ```
2. SuperEntity:  超级父类, 继承它的表至少需要3个字段id、created_time、created_by

   其中id字段标记了 `@TableId(value = "id", type = IdType.INPUT)`  ，表示在调用保存方法时，id字段的值mybait-plus不负责赋值，灯灯系统为了方便开发调用，在lamp-util模块  `LampMetaObjectHandler` 类，统一为id字段自动赋值。  所以，业务开发过程中调用保存方法，无需给对象设置ID字段参数。当然，若您在保存某对象时，需要设置指定的id值，当你调用`entity.setId(xxx)` 后，`LampMetaObjectHandler` 会保留你设置的ID。

3. Entity: 通用父类, 继承它的表至少需要5个字段id、created_time、created_by、updated_time、updated_by

4. TreeEntity: 树型父类, 继承它的表至少需要8个字段id、created_time、created_by、updated_time、updated_by、parent_id、sort_value



## RedisKey
1. CacheKey: 封装k-v缓存的key和有效期
2. CacheHashKey: 封装hash结构缓存的key和有效期
3. CacheKeyBuilder:  缓存key的构造器

:::: details 示例

::: code-tabs

@tab 定义

```java
public class BaseDictCacheKeyBuilder implements CacheKeyBuilder {
    // 构造方法
    public static CacheHashKey builder(Serializable dictKey) {
        return new BaseDictCacheKeyBuilder().hashKey(dictKey);
    }
		// 构造方法
    public static CacheHashKey builder(String dictKey, String field) {
        return new BaseDictCacheKeyBuilder().hashFieldKey(field, dictKey);
    }
		// 前缀，用来区分同一个公司，不同的项目
    @Override
    public String getPrefix() {
        return CacheKeyModular.PREFIX;
    }
		// 缓存那张表的数据
    @Override
    public String getTable() {
        return CacheKeyTable.Base.BASE_DICT;
    }
		// 缓存那个模块的数据
    @Override
    public String getModular() {
        return CacheKeyModular.BASE;
    }
		// 缓存的key包含那个字段
    @Override
    public String getField() {
        return SuperEntity.ID_FIELD;
    }
		// 缓存值的类型
    @Override
    public ValueType getValueType() {
        return ValueType.string;
    }
}
```

@tab 使用

```java{12-13,25,26}
public class BaseDictItemServiceImpl {
  
      public BaseDict save(BaseDictItemSaveVO saveVO) {
        BaseDict model = BeanUtil.toBean(saveVO, BaseDict.class);
        ArgumentAssert.isFalse(checkItemByKey(model.getKey(), model.getParentId(), null), "字典[{}]已经存在，请勿重复创建", model.getKey());
        BaseDict parent = getById(model.getParentId());
        ArgumentAssert.notNull(parent, "字典不存在");
        model.setParentKey(parent.getKey());
        model.setClassify(DictClassifyEnum.BUSINESS.getCode());
        superManager.save(model);
        
        CacheHashKey hashKey = BaseDictCacheKeyBuilder.builder(model.getParentKey(), model.getKey());
        cachePlusOps.hSet(hashKey, model.getName());
        return model;
    }
  
    @Transactional(rollbackFor = Exception.class)
    public boolean removeByIds(Collection<Long> idList) {
        List<BaseDict> list = superManager.listByIds(idList);
        if (CollUtil.isEmpty(list)) {
            return false;
        }
        boolean flag = superManager.removeByIds(idList);

        CacheHashKey[] hashKeys = list.stream().map(model -> BaseDictCacheKeyBuilder.builder(model.getParentKey(), model.getKey())).toArray(CacheHashKey[]::new);
        cachePlusOps.del(hashKeys);
        return flag;
    }
}
```

@tab 效果

```shell
// 最终生成的key
lc:1:base:base_dict:id:string:TENANT_APPLICATION_TYPE
```

:::

::::



## 上下文信息

1. ContextConstants :  上下文常量类。封装在请求头、上下文中的参数的Key名称。
3. ContextUtil : 上下文参数工具类。



## 转换类

1. EnumDeserializer : 枚举类 jackson 自定义反序列化策略

   > 这个类的目的是为了配合 EnumSerializer 类使用。

   这个类所在包为`com.fasterxml.jackson.databind.deser.std` ，目的是覆盖 jackson 同包名下的同名类。实现了反序列化的规则的增强功能。

   ```java
   public enum Sex implements BaseEnum {
       M("男"),
       W("女"),
       N("未知"),;
   }
   
   public class User {
     Integer id;
     Sex sex;
   }
   ```

   对于User类，使用jackson官方原始的EnumDeserializer类时，支持以下2种方式传递参数（反序列化）：

   ```json
   {"sex": "W"}  // 可选值：W、M、N
   
   {"sex": 1}   // 可选值： 0、1、2，对应的是Sex 枚举值的索引。 （M对应0、W对应1、N对应2）
   ```

   使用《灯灯》提供的EnumDeserializer类时，除了支持上面的方式，还支持下面的方式：

   ```json
   {"sex": { "code": "M" }	}
   ```

   

2. EnumSerializer : 枚举类 jackson 自定义序列化策略

   > 这个类的目的是枚举字段返回数据到前端时，前端方便回显中文描述。

   继承了`BaseEnum`接口的枚举值，将会按照以下格式序列化：

   ```json
   {"sex": { "code": "M", "desc": "男"} }	
   ```

   ::: tip

   4.6.0 版本后，不在采用 EnumDeserializer、EnumSerializer 类实现枚举字段的回显，需要回显在字段上标记@Enum(api = Echo.ENUM_API)

   :::

3. LampLocalDateTimeDeserializer : LocalDateTime类 jackson 自定义反序列化策略

   JavaBean的字段类型为LocalDateTime时，支持以下6种格式进行反序列化：

    * yyyy-MM-dd
    * yyyy年MM月dd日
    * yyyy/MM/dd
    * yyyy-MM-dd HH:mm:ss
    * yyyy年MM月dd日HH时mm分ss秒
    * yyyy/MM/dd HH:mm:ss

4. String2DateConverter :  字符串 转 Date (解决 @RequestParam 标记的 Date 类型的入参，参数转换问题)。支持以下格式：

    * yyyy
    * yyyy-MM
    * yyyy-MM-dd
    * yyyy-MM-dd HH
    * yyyy-MM-dd HH:mm
    * yyyy-MM-dd HH:mm:ss
    * yyyy/MM
    * yyyy/MM/dd
    * yyyy/MM/dd HH
    * yyyy/MM/dd HH:mm
    * yyyy/MM/dd HH:mm:ss
    * yyyy年MM月
    * yyyy年MM月dd日
    * yyyy年MM月dd日HH时mm分ss秒

5. String2LocalDateConverter : 字符串 转 LocalDate (解决 @RequestParam 标记的 LocalDate 类型的入参，参数转换问题)。支持以下格式：

    * yyyy-MM-dd
    * yyyy/MM/dd
    * yyyy年MM月dd日

6. String2LocalDateTimeConverter : 字符串 转 LocalDateTime (解决 @RequestParam 标记的 LocalDateTime 类型的入参，参数转换问题)。支持以下格式：

   - yyyy-MM-dd HH:mm:ss
   - yyyy/MM/dd HH:mm:ss
   - yyyy年MM月dd日HH时mm分ss秒

7. String2LocalTimeConverter : 字符串 转 LocalTime (解决 @RequestParam 标记的 LocalTime 类型的入参，参数转换问题)。支持以下格式：

   - HH:mm:ss
   - HH时mm分ss秒

8. LampJacksonModule： jackson 自定义序列化 & 反序列化 规则

   这个类用于定制Jsonson的序列化和反序列化规则，然后在`JsonUtil`工具类、SpringMvc全局`ObjectMapper`（BaseConfig类）、redis序列化规则 `RedisObjectSerializer`（lamp-cache-starter）

:::: details 参考

<!-- @include: ../config/ObjectMapper.snippet.md -->

::::

## 自定义异常

1. ExceptionCode

   自定义异常错误码，常用错误码为

   - 0：操作成功
   - 200：操作成功，为了兼容xxl-job，200也表示成功，lamp系统中推荐使用0表示成功
   - -1~-13：系统常用的异常编码，详情见 AbstractGlobalExceptionHandler 中方法的返回值
   - 401：登录未授权。 客户端在访问请求的资源之前，对token进行验证，token无法正常解析时，返回此错误码，可以简单的理解为没有登录此站。
   - 403：访问资源被禁止。 资源不可用，服务器理解客户的请求，但拒绝处理它。通常由于服务器上文件或目录的权限设置导致，可以简单的理解为没有权限访问此站。

2. ArgumentException

   业务参数异常。用于在业务中，检测到非法参数时，进行抛出的异常。

3. BizException

   业务异常。用于在处理业务逻辑遇到问题时，抛出此异常。

4. ForbiddenException

   无权限访问某资源时，抛出此异常。

5. UnauthorizedException

   没有登录此系统时，抛出此异常。

## 工具类

1. JsonUtil : 全局的 Jackson 工具类
2. DistributedLock : 分布式锁接口
3. AntiSqlFilterUtils : sql注入过滤工具
4. ArgumentAssert : 业务参数断言
5. CollHelper : 集合帮助类
6. DateUtils : 日期工具类
7. DefValueHelper : 默认值帮助类
8. PingYinUtil : 拼音工具类
9. SpringUtils : Spring工具类
10. StrHelper : 字符串帮助类
11. StrPool : 字符串常量
12. TreeUtil : 树型结构工具类
13. ValidatorUtil : 正则验证工具类
14. DbUtil：数据库相关工具类
15. ClassUtils：class文件工具
16. BeanPlusUtil：糊涂的BeanUtil增强类
