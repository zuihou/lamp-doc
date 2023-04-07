---
title: lamp-echo-starter
icon: wendang
index: false
category:
  - 工具类
tag:
  - 工具类
  - lamp-echo-starter
---

##  使用场景
员工表中存储了岗位id（外键）、职位状态（字典）、性别（枚举）等字段，在员工-部门关系表中存储了员工和部门的关联关系， 但在列表页、详情页回显时，需要显示 岗位名称、职位状态、性别、所属部门名称等。

页面显示效果和数据库数据存储关系如下：

::: tabs

@tab 显示效果

| ID   | 名称   | 岗位名称 | 所属部门名称  | 职位状态 | 性别 |
| ---- | ------ | -------- | ------------- | -------- | ---- |
| 1    | 啊汤哥 | 研发岗   | 研发部,商务部 | 在职     | 男   |

@tab 员工表

| ID   | name   | 岗位id | 职位状态 | 性别 |
| ---- | ------ | ------ | -------- | ---- |
| 1    | 啊汤哥 | 1      | 01       | M    |

@tab 岗位表

| ID   | name   |
| ---- | ------ |
| 1    | 研发岗 |

@tab 部门表

| ID   | name   |
| ---- | ------ |
| 1    | 研发部 |
| 2    | 商务部 |

@tab 员工-部门关系表

| ID   | employee_id | dept_id |
| ---- | ----------- | ------- |
| 1    | 1           | 1       |
| 2    | 1           | 2       |

:::



## 传统的解决思路：

1. 表关联查询
2. 冗余字段
3. 前端自己解决回显问题
4. 先单表查询用户的数据，然后在java代码中，循环提取需要回显的station_id、字典key等, 在批量去查询这些信息后，在循环set到对应的字段中.



## lamp解决方案

本项目提供了lamp-echo-starter模块来**解决思路4**。

1. pom中加入依赖

2. yml 开启配置， 更多更详细的配置参考 `EchoProperties`

   ```yaml
   lamp:
     echo:
       # 是否开启 EchoService 功能
       enabled: true
       # 是否开启EchoResult
       aop-enabled: true
       
   ```

3. EmployeeResultVO实体实现`EchoVO`接口，并在EmployeeResultVO中加入echoMap .

   ```java
   public class EmployeeResultVO extends Entity<Long> implements EchoVO {
       @TableField(exist = false)
       private Map<String, Object> echoMap = new HashMap<>();
   		// ...
   }
   ```

4. 在 positionId, orgIdList, positionStatus 等需要回显的字段上标记注解： @Echo

   ```java
   public class EmployeeResultVO extends Entity<Long> implements EchoVO {
       // 等价于 @Echo(api = "basePositionManagerImpl")
     	@Echo(api = EchoApi.POSITION_ID_CLASS)
       private Long positionId;
   
       // 等价于 @Echo(api = "baseOrgManagerImpl")
     	@Echo(api = EchoApi.ORG_ID_CLASS)
       private List<Long> orgIdList;
   
     	// 等价于 @Echo(api = "top.tangyh.lamp.oauth.api.DictApi", dictType = DictionaryType.Base.POSITION_STATUS)  
     	@Echo(api = EchoApi.DICTIONARY_ITEM_FEIGN_CLASS, dictType = EchoDictType.Base.POSITION_STATUS)
       private String positionStatus;
     
   		@Echo(api = Echo.ENUM_API)
       private String sex;
   }
   ```

   

5. 由于base_employee表所在的服务，跟base_org、base_position表在同一个服务，但跟def_dict表不在同一个服务 。所以回显岗位和部门可以在@Echo 的 api 字段使用本服务中存在的==ManagerImpl==或==ServiceImpl== ，但回显字典需要在@Echo 的 api 字段使用远程接口 ==Feign== ，以实现跨服务调用。

6. 新增 DictApi 让它继承LoadService接口，并实现findByIds方法。

   ```java
   @FeignClient(name="lamp-oauth-server")
   public interface DictApi extends LoadService {
       @Override
   		@PostMapping("/echo/dict/findByIds")
       Map<Serializable, Object> findByIds(@RequestParam(value = "ids") Set<Serializable> ids);
   }
   ```

7. 在oauth服务添加 DictApi 的实现类

   ```java
   public class EchoController {
     	@Resource
     	private DictService dictService;
     	
       @PostMapping("/echo/dict/findByIds")
       public Map<Serializable, Object> findDictByIds(@RequestParam("ids") Set<Serializable> ids) {
         	// findByIds 接口需要自己实现
           return this.dictService.findByIds(ids);
       }
   //....
   }
   ```

8. DictServiceImpl

   ```java{5}
   @Service
   @RequiredArgsConstructor
   public class DictServiceImpl implements DictService {
     
     // 这个方法就是需要开发者自行实现的业务逻辑
     @Override
       public Map<Serializable, Object> findByIds(Set<Serializable> dictKeys) {
           if (CollUtil.isEmpty(dictKeys)) {
               return Collections.emptyMap();
           }
   
           if (ContextUtil.isEmptyTenantId()) {
               return defDictManager.findByIds(dictKeys);
           }
   
           Map<Serializable, Object> baseMap = baseDictManager.findByIds(dictKeys);
   //        dictKeys 数量和 baseMap.key 数量相同，说明所有的字典在base库都自定义了
           if (baseMap != null && baseMap.keySet().size() == dictKeys.size()) {
               return baseMap;
           }
   
           // 查询不在base的字典
           Set<Serializable> nonExistKeys = dictKeys.stream().filter(dictKey -> !baseMap.containsKey(dictKey)).collect(Collectors.toSet());
           Map<Serializable, Object> defMap = defDictManager.findByIds(nonExistKeys);
   
           HashMap<Serializable, Object> map = MapUtil.newHashMap();
           map.putAll(defMap);
           map.putAll(baseMap);
   
           return map;
       }
   }
   ```

9. 其他的 manager 实现 LoadService

   ```java
   public interface BaseOrgManager extends SuperCacheManager<BaseOrg>, LoadService {}
   public interface BasePositionManager extends SuperCacheManager<BasePosition>, LoadService {}
   public interface BaseDictManager extends SuperCacheManager<BaseDict>, LoadService {}
   public interface DefDictManager extends SuperCacheManager<DefDict>, LoadService {}
   ```

10. ManagerImpl 实现具体逻辑

    ```java
    public class BaseOrgManagerImpl extends SuperCacheManagerImpl<BaseOrgMapper, BaseOrg> implements BaseOrgManager {
        @Override
        @Transactional(readOnly = true)
        @DS(DsConstant.BASE_TENANT)
        public Map<Serializable, Object> findByIds(Set<Serializable> params) {
            if (CollUtil.isEmpty(params)) {
                return Collections.emptyMap();
            }
            Set<Serializable> ids = new HashSet<>();
            params.forEach(item -> {
                if (item instanceof Collection) {
                    ids.addAll((Collection<? extends Serializable>) item);
                } else {
                    ids.add(item);
                }
            });
    
            List<BaseOrg> list = findByIds(ids,
                    missIds -> super.listByIds(missIds.stream().filter(Objects::nonNull).map(Convert::toLong).collect(Collectors.toList()))
            );
            return CollHelper.uniqueIndex(list, BaseOrg::getId, BaseOrg::getName);
        }
    }
    
    // 其他的 managerImpl 实现参考源码
    ```

11. 然后在BaseEmployeeController的page方法中，调用echoService.action  

    ```java{3}
    public class BaseEmployeeController {
        public R<IPage<BaseEmployeeResultVO>> page(@RequestBody @Validated PageParams<BaseEmployeePageQuery> params) {
             IPage<BaseEmployeeResultVO> page = baseEmployeeBiz.findPageResultVO(params);
             echoService.action(page);
             return R.success(page);
         }
     }
    ```

12. 调用该接口后，会在User的echoMap中put需要显示的值。

    ![](/images/util/echo回显效果.png)



## 实现原理

1. 项目启动时，EchoService构造方法通过策略模式注入Map<String, LoadService> strategyMap

   ::: tip

   注意： 实现LoadService的类，必须被Spring 加载，即加了@Service、@Component、@FeignClient等注解

   :::

   ```java
   public EchoServiceImpl(EchoProperties ips, Map<String, LoadService> strategyMap) {
       /*
       项目启动时，会利用Spring的构造器主动注入方式，将所有LoadService的实现类注入到strategyMap。
       如：前面提到的： DictionaryApi、BaseOrgManagerImpl、BasePositionManagerImpl等
   
       strategyMap的key是 @Echo注解中的api属性
       strategyMap的value是 所有实现了LoadService接口的实现类 或 OpenFeign。
       */
       this.strategyMap.putAll(strategyMap);
   }
   ```

2. 项目启动时，会触发EchoServiceImpl类的afterPropertiesSet方法，将扫描指定包路径下标记了@ApiModel注解的类，并将这些类下标记了@Echo注解的字段，缓存到ClassManager#CACHE中。

3. 项目运行时， 调用 `echoService.action(obj)`  方法并正常执行`action`方法后，会将`obj`中的`echoMap`填充。

4. `echoService.action`方法逻辑如下：

   ```java
   /**
    * 回显数据的3个步骤：（出现回显失败时，认真debug该方法）
    * <p>
    * 1. parse: 遍历obj对象的所有字段，并将标记了@Echo注解的字段存储到typeMap
    * 2. load: 遍历typeMap，依次查询待回显的数据。此方法实际就是调用 LoadService.findByIds 方法查询数据。
    * 3. write: 遍历obj对象的所有字段，将查询出来的结果通过反射写入 echoMap 
    * <p>
    * 注意：若对象中需要回显的字段之间出现循环引用，很可能发生异常，所以请保证不要出现循环引用！！！
    * 注意：若传入的参数是集合或IPage，并不会在循环中调用 LoadService.findByIds 方法。
    *
    * @param obj          需要回显的参数，支持 自定义对象(User)、集合(List<User>、Set<User>)、IPage<User>
    * @param ignoreFields 忽略obj对象中的那些字段
    */
   public void action(Object obj, String... ignoreFields)  {
       // 1
       this.parse(obj, typeMap, 1, ignoreFields);
       // 2
       this.load(typeMap, isUseCache);
       // 3
       this.write(obj, typeMap, 1);
   }
   ```

4. 最后要自己实现LoadService的findByIds方法



## 性能

假设TestResultVO中有5个字段标记@Echo，分别是：orgIdList、orgIdList2、positionId、positionStatus、sex。 其中`orgIdList`和`orgIdList2` 都是查询 `baseOrgManagerImpl` ，`positionStatus`和`sex`都是查询 `top.tangyh.lamp.oauth.api.DictionaryApi` 

```java
public class TestResultVO implements EchoVO{
    private Map<String, Object> echoMap = MapUtil.newHashMap();
		// 其他字段 有8个...
  
    @Echo(api = "basePositionManagerImpl")
    private Long positionId;

    @Echo(api = "baseOrgManagerImpl")
    private List<Long> orgIdList;
  
    @Echo(api = "baseOrgManagerImpl")
    private List<Long> orgIdList2;

    @Echo(api = "top.tangyh.lamp.oauth.api.DictApi", dictType = DictionaryType.Base.POSITION_STATUS) 
    private String positionStatus;

    @Echo(api = "top.tangyh.lamp.oauth.api.DictApi", dictType = DictionaryType.Base.SEX) 
    private String sex;
}
```

在`action`方法中的循环次数为：

- parse：首次循环字段数，本例中是5次

  每个对象首次回显时，循环遍历ClassManager#CACHE中缓存的字段，并将字段的值写入 `typeMap`。

- load：循环标记了@Echo的字段，并将api去重合并后的次数，本例中是3次

  循环`typeMap`，依次调用`basePositionManagerImpl#findByIds`、`baseOrgManagerImpl#findByIds`、`top.tangyh.lamp.oauth.api.DictApi#findByIds` 3个方法，每个方法传入多个Id或key，并将返回的数据存入 `typeMap`，待下一步写入回显数据

- write：（循环标记了@Echo的字段数，本例中是5次）

  取`ClassManager#CACHE`中缓存的字段来循环，写入需要回显的数据。




## 常见问题
1. 跨服务回显时，@Echo中的api需要指定为 FeignClient 的全类名。

   如：消息服务，需要回显权限服务的 用户名：@Echo(api="top.tangyh.lamp.oauth.api.UserApi")
2. 单个服务回显时，@Echo中的api需要指定为 ServiceImpl 的Spring id。

   如：权限服务，需要回显权限服务的 用户名：@Echo(api="userServiceImpl")
