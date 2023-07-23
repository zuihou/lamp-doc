---
title: lamp-mvc
icon: wendang
index: false
category:
  - 工具类
tag:
  - 工具类
  - lamp-mvc
---

本模块用于封装MVC模型分层。



3.x 应用分层采用 Controller -> Service -> Mapper ，领域模型采用DTO、Entity。

4.x 应用分层借鉴阿里规范，调整成适合本项目的分层模型，采用 Controller -> Biz -> Service -> Manager -> Mapper ，领域模式采用VO、DTO、Query、Entity等。

::: tip

3.x 的分层是最简单，最易于理解的分层，但随着不断的出现复杂的业务，所有逻辑都放在Service层已经不在合适，故而对其改造。3.x和4.x的分层，并没有绝对的谁好谁坏，对于业务极其简单，只为快速交付的项目，3.x的分层更加便捷；而4.x的分层更适合于长期迭代、业务复杂、对接第三方的系统。

:::



1. 应用分层 
   
   图中默认上层依赖于下层，箭头关系表示可直接依赖，如：开放接口层可以依赖于 
   
   Controller 层，也可以直接依赖于 Biz、Service 层，依此类推。 
   
   ![](/images/info/应用分层.drawio.png)
   
   - 开放接口层：开放给其他第三方调用的接口，可直接封装Service方法暴露成PRC接口；通过Web封装成HTTP接口等
   
   - 终端显示层：各个端的默认渲染层。如：模板引擎渲染、移动端展示、Vue展示等
   
   - 请求处理层（Controller）：主要是对访问控制进行转发，各类基本参数校验，或者不复用的业务简单处理等 。
   
   - 分布式事务业务逻辑层（Biz）**（可选）**：具于分布式事务、跨库操作（查询和写入）的业务逻辑服务层。
   
     若业务无分布式事务或跨库操作Controller可以直接调用Service层；若要在Biz层切换租户，Biz层一定不能加`@Transactional`注解，否则动态数据源跨库操作将会失效。
   
   - 业务逻辑层（Service）：相对具体的业务逻辑服务层，只保证单个数据源本地事务。对多个Manager的组合复用。
   
   - 通用处理层（Manager）：通用业务处理层， 它有如下特征： 
     
     1）  对 Service 层通用能力的下沉，如缓存方案、中间件通用处理。 
     
     2）  与 DAO 层交互，对多个 DAO 的组合复用。 
     
     3） 继承Mybatis-plus的ServiceImpl接口，封装了单表的业务操作。
   
   - 数据持久层（Mapper/Dao）：数据访问层，与底层 MySQL、Oracle、Hbase、OB 等进行数据交互。  
   
   - 缓存或第三方接口：包括其它部门 RPC 开放接口，基础平台，其它公司的 HTTP 接口。
   
     ::: warning
   
     - biz的方法都是跨数据源或跨服务的且需要保证分布式事务的
     - service的方法更加匹配实际业务，可操作多个表，对多个表的逻辑进行组合
     - manager 的方法只负责单个表的操作(如：可以对字段进行一些默认值设置)
     -  mapper 的方法只负责原封不动的将操作数据库。
   
     - 调用只能从上往下，不能反着调用，最好也不要平层调用，严禁平层交叉调用。
   
     :::
   
2. 领域模型
   
   - Entity： 跟数据库表一一对应
   - DTO：数据传输对象，Service或Manager 使用的对象
   - Query：数据查询对象，各层接收上层的查询请求。建议超过3个参数的查询进行封装。
   - VO：显示层对象，Controller层接收和返回参数。



## 源码

```shell
└── top
    └── tangyh
        └── basic
            └── base
                ├── controller
                │   ├── BaseController.java														# 基础Contrller 接口
                │   ├── DeleteController.java													# 删除Controller 接口
                │   ├── DownloadController.java												# 下载Controller 接口
                │   ├── PageController.java														# 分页Contrller 接口
                │   ├── PoiController.java														# 导入导出Controller 接口
                │   ├── QueryController.java													# 查询Controller 接口
                │   ├── SaveController.java														# 保存Controller 接口
                │   ├── SuperCacheController.java											# 缓存+CURD Controller
                │   ├── SuperController.java													# CRUD Controller
                │   ├── SuperPoiController.java												# CRUD + 导入导出 Controller
                │   ├── SuperReadController.java											# 查询方法 Controller
                │   ├── SuperSimpleController.java										# 没有任何方法的 Controller
                │   ├── SuperWriteController.java											# 保存、修改、删除方法 Controller
                │   └── UpdateController.java													# 修改 Controller
                ├── manager
                │   ├── SuperCacheManager.java												# 缓存 Manager
                │   ├── SuperManager.java															# 普通 Manager
                │   └── impl
                │       ├── SuperCacheManagerImpl.java
                │       └── SuperManagerImpl.java
                ├── mapper
                │   └── SuperMapper.java															# Mapper
                ├── package-info.java
                ├── request
                │   ├── DownloadVO.java
                │   ├── PageParams.java
                │   └── PageUtil.java
                ├── service
                │   ├── SuperCacheService.java												#	缓存 Service	
                │   ├── SuperService.java
                │   └── impl
                │       ├── SuperCacheServiceImpl.java
                │       └── SuperServiceImpl.java
```



## Controller

主要是对访问控制进行转发，各类基本参数校验或者不复用的简单业务等。lamp-mvc封装的Contrller，分为接口和抽象类。业务开发过程中，可以根据自己的业务需求选择继承抽象类还是实现接口。抽象类只能继承1个，接口可以实现多个进行组合。

### 接口

- PageController

  封装了分页查询方法，并暴露了一些方法供子类扩展。

  :::: details 代码

  ```java
  
  /**
   * 分页控制器
   *
   * @param <Entity>    实体
   * @param <PageQuery> 分页参数
   * @author zuihou
   * @date 2020年03月07日22:06:35
   */
  public interface PageController<Id extends Serializable, Entity extends SuperEntity<Id>, SaveVO, UpdateVO, PageQuery, ResultVO>
          extends BaseController<Id, Entity, SaveVO, UpdateVO, PageQuery, ResultVO> {
  
      /**
       * 处理查询参数
       *
       * @param params 前端传递的参数
       * @author tangyh
       * @date 2021/7/3 3:25 下午
       * @create [2021/7/3 3:25 下午 ] [tangyh] [初始创建]
       */
      default void handlerQueryParams(PageParams<PageQuery> params) {
      }
  
      /**
       * 执行分页查询
       * <p>
       * 子类可以覆盖后重写查询逻辑
       *
       * @param params 分页参数
       * @return 分页信息
       */
      default IPage<Entity> query(PageParams<PageQuery> params) {
          // 处理查询参数，如：覆盖前端传递的 current、size、sort 等参数 以及 model 中的参数 【提供给子类重写】【无默认实现】
          handlerQueryParams(params);
  
          // 构建分页参数(current、size)和排序字段等
          IPage<Entity> page = params.buildPage(getEntityClass());
          Entity model = BeanUtil.toBean(params.getModel(), getEntityClass());
  
          // 根据前端传递的参数，构建查询条件【提供给子类重写】【有默认实现】
          QueryWrap<Entity> wrapper = handlerWrapper(model, params);
  
          // 执行单表分页查询
          getSuperService().page(page, wrapper);
  
          return page;
      }
  
      /**
       * 处理对象中的非空参数和扩展字段中的区间参数，可以覆盖后处理组装查询条件
       *
       * @param model  实体类
       * @param params 分页参数
       * @return 查询构造器
       */
      default QueryWrap<Entity> handlerWrapper(Entity model, PageParams<PageQuery> params) {
          return Wraps.q(model, params.getExtra(), getEntityClass());
      }
  
      /**
       * 获取echo Service
       *
       * @return
       */
      default EchoService getEchoService() {
          return null;
      }
  
      /**
       * 处理查询后的数据
       * <p>
       * 如：执行@Echo回显
       *
       * @param page 分页对象
       */
      default void handlerResult(IPage<ResultVO> page) {
          EchoService echoService = getEchoService();
          if (echoService != null) {
              echoService.action(page);
          }
      }
  
      /**
       * 分页查询
       *
       * @param params 分页参数
       * @return 分页数据s
       */
      @ApiOperation(value = "分页列表查询")
      @PostMapping(value = "/page")
      @WebLog(value = "'分页列表查询:第' + #params?.current + '页, 显示' + #params?.size + '行'", response = false)
      default R<IPage<ResultVO>> page(@RequestBody @Validated PageParams<PageQuery> params) {
          IPage<Entity> page = query(params);
          IPage<ResultVO> voPage = BeanPlusUtil.toBeanPage(page, getResultVOClass());
          // 处理查询后的分页结果， 如：调用EchoService回显字典、关联表数据等 【提供给子类重写】【有默认实现】
          handlerResult(voPage);
          return success(voPage);
      }
  }
  
  ```

  ::::

- QueryController

  封装了单体查询、详情查询、列表查询等方法。单体查询和详情查询的区别在于后者执行了@Echo回显。

  ::: details 代码

  ```java
  
  /**
   * 查询Controller
   *
   * @param <Entity>    实体
   * @param <Id>        主键
   * @param <PageQuery> 分页参数
   * @param <ResultVO>  实体返回VO
   * @author zuihou
   * @date 2020年03月07日22:06:35
   */
  public interface QueryController<Id extends Serializable, Entity extends SuperEntity<Id>, SaveVO, UpdateVO, PageQuery, ResultVO>
          extends PageController<Id, Entity, SaveVO, UpdateVO, PageQuery, ResultVO> {
  
      /**
       * 单体查询
       *
       * @param id 主键id
       * @return 查询结果
       */
      @ApiImplicitParams({
              @ApiImplicitParam(name = "id", value = "主键", dataType = "long", paramType = "path"),
      })
      @ApiOperation(value = "单体查询", notes = "单体查询")
      @GetMapping("/{id}")
      @WebLog("'查询:' + #id")
      default R<ResultVO> get(@PathVariable Id id) {
          Entity entity = getSuperService().getById(id);
          return success(BeanPlusUtil.toBean(entity, getResultVOClass()));
      }
  
      /**
       * 详情查询
       *
       * @param id 主键id
       * @return 查询结果
       */
      @ApiImplicitParams({
              @ApiImplicitParam(name = "id", value = "主键", dataType = "long", paramType = "path"),
      })
      @ApiOperation(value = "查询单体详情", notes = "查询单体详情")
      @GetMapping("/detail")
      @WebLog("'查询:' + #id")
      default R<ResultVO> getDetail(@RequestParam("id") Id id) {
          Entity entity = getSuperService().getById(id);
          ResultVO resultVO = BeanPlusUtil.toBean(entity, getResultVOClass());
          EchoService echoService = getEchoService();
          if (echoService != null) {
              echoService.action(resultVO);
          }
          return success(resultVO);
      }
  
      /**
       * 批量查询
       *
       * @param data 批量查询
       * @return 查询结果
       */
      @ApiOperation(value = "批量查询", notes = "批量查询")
      @PostMapping("/query")
      @WebLog("批量查询")
      default R<List<ResultVO>> query(@RequestBody PageQuery data) {
          Entity entity = BeanPlusUtil.toBean(data, getEntityClass());
          QueryWrap<Entity> wrapper = Wraps.q(entity);
          List<Entity> list = getSuperService().list(wrapper);
          return success(BeanPlusUtil.toBeanList(list, getResultVOClass()));
      }
  
  }
  
  ```

  

  :::

- PoiController

  封装了简单的导入导出功能。通常情况下，导入导出功能的业务都比较复杂，所以在实际开发过程中，通常都需要重写本类中的方法才能达到自己的实际效果。

- SaveController

  封装了保存和复制方法，并预留了 handlerSave 接口，供子类重写。

- UpdateController

  封装了修改方法，并预留了 handlerUpdate 接口，供子类重写。

- DeleteController

  封装了删除方法，并预留了 handlerDelete 接口，供子类重写。

- DownloadController

  提供了write方法。

### 抽象类

- SuperSimpleController

  最简单的父类，没有任何的CRUD方法。

- SuperReadController

  实现了QueryController、PageController。

- SuperWriteController

  实现了SaveController、UpdateController、DeleteController。

- SuperController

  实现了SaveController、UpdateController、DeleteController、QueryController、PageController。

- SuperPoiController

  实现了SaveController、UpdateController、DeleteController、QueryController、PageController、PoiController。

- SuperCacheController

  实现了SaveController、UpdateController、DeleteController、QueryController、PageController、PoiController。并将get、save、update、delete等方法用SuperCacheService实现。



## Service

相对具体的业务逻辑服务层，只保证单个数据源本地事务。对多个Manager的组合复用。

SuperCacheService和SuperService的区别在于，前者的save、saveBatch、saveOrUpdateBatch、updateAllById、updateById、updateBatchById、removeById、removeByIds、getByIdCache等方法封装了缓存。

save、updateById、updateAllById等方法也提供了方法供子类重写。

```java
@Override
    @Transactional(rollbackFor = Exception.class)
    public Entity save(SaveVO saveVO) {
        Entity entity = saveBefore(saveVO);
        this.getSuperManager().save(entity);
        saveAfter(saveVO, entity);
        return entity;
    }
    /**
     * 保存之前处理参数等操作
     *
     * @param saveVO 保存VO
     */
    protected Entity saveBefore(SaveVO saveVO) {
        return BeanUtil.toBean(saveVO, getEntityClass());
    }

    /**
     * 保存之后设置参数值，淘汰缓存等操作
     *
     * @param saveVO 保存VO
     * @param entity 实体
     */
    protected void saveAfter(SaveVO saveVO, Entity entity) {
    }


    @Override
    @Transactional(rollbackFor = Exception.class)
    public Entity updateById(UpdateVO updateVO) {
        Entity entity = updateBefore(updateVO);
        getSuperManager().updateById(entity);
        updateAfter(updateVO, entity);
        return entity;
    }

    /**
     * 修改之前处理参数等操作
     *
     * @param updateVO 修改VO
     */
    protected Entity updateBefore(UpdateVO updateVO) {
        return BeanUtil.toBean(updateVO, getEntityClass());
    }

    /**
     * 修改之后设置参数值，淘汰缓存等操作
     *
     * @param updateVO 修改VO
     * @param entity   实体
     */
    protected void updateAfter(UpdateVO updateVO, Entity entity) {
    }

		@Override
    @Transactional(rollbackFor = Exception.class)
    public Entity updateAllById(UpdateVO updateVO) {
        Entity entity = updateAllBefore(updateVO);
        getSuperManager().updateAllById(entity);
        updateAllAfter(updateVO, entity);
        return entity;
    }

    /**
     * 修改之前处理参数等操作
     *
     * @param updateVO 修改VO
     */
    protected Entity updateAllBefore(UpdateVO updateVO) {
        return BeanUtil.toBean(updateVO, getEntityClass());
    }

    /**
     * 修改之后设置参数值，淘汰缓存等操作
     *
     * @param updateVO 修改VO
     * @param entity   实体
     */
    protected void updateAllAfter(UpdateVO updateVO, Entity entity) {
    }
```



## Manager

通用业务处理层。

SuperCacheManager和SuperManager的区别在于，前者的save、saveBatch、saveOrUpdateBatch、updateAllById、updateById、updateBatchById、removeById、removeByIds、getByIdCache等方法封装了缓存。

若你继承了SuperCacheManager，子类必须重写cacheKeyBuilder方法，返回缓存key构造器。如：

```java
@Override
protected CacheKeyBuilder cacheKeyBuilder() {
    return new EmployeeCacheKeyBuilder();
}
```



## Mapper

数据访问层。

相对于BaseMapper，增强了updateAllById、insertBatchSomeColumn方法。

::: tip

若你也想扩展SuperMapper中的方法，可以参考： LampSqlInjector

:::
