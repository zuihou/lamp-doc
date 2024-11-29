1. 

2. 由于base_employee表所在的服务，跟base_org、base_position表在同一个服务，但跟def_dict表不在同一个服务 。所以回显岗位和部门可以在@Echo 的 api 字段使用本服务中存在的==ManagerImpl==或==ServiceImpl== ，但回显字典需要在@Echo 的 api 字段使用远程接口 ==Feign== ，以实现跨服务调用。

3. 新增 DictFacade 让它继承LoadService接口，并实现findByIds方法。

   ```java
   public interface DictFacade extends LoadService {
       @Override
       Map<Serializable, Object> findByIds(Set<Serializable> ids);
   }
   ```

4. 在oauth服务添加 DictApi 的实现类

   ```java
   @RequestMapping("/echo")
   public class EchoController {
     	@Resource
     	private DictService dictService;
     	
       @PostMapping("/dict/findByIds")
       public Map<Serializable, Object> findDictByIds(@RequestParam("ids") Set<Serializable> ids) {
         	// findByIds 接口需要自己实现
           return this.dictService.findByIds(ids);
       }
       //....
   }
   ```

5. DictServiceImpl

   ```java
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

6. 其他的 manager 实现 LoadService

   ```java
    public interface BaseOrgManager extends SuperCacheManager<BaseOrg>, LoadService {}
    public interface BasePositionManager extends SuperCacheManager<BasePosition>, LoadService {}
    public interface BaseDictManager extends SuperCacheManager<BaseDict>, LoadService {}
    public interface DefDictManager extends SuperCacheManager<DefDict>, LoadService {}
   ```

11. ManagerImpl 实现具体逻辑

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

    