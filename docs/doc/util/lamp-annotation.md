---
title: lamp-annotation
icon: wendang
index: false
category:
  - 工具类
tag:
  - 工具类
  - lamp-annotation
---

该模块存放lamp-util、lamp-cloud、lamp-boot项目中最核心常用枚举类、对象、自定义类型等，不含任何业务逻辑。拆分的目的是为了让多模块项目(lamp-cloud、lamp-boot) 解耦，使entity、common等模块可以依赖最小化。



- NotEmptyPattern

  对`javax.validation.constraints.Pattern`注解的增强，用于校验字段的==参数不为空时==传递的参数是否符合指定的正则表达式。

  ```java
  public class UserSaveVO{
   		// 无论参数是否为空，都直接校验是否满足{regexp}  （也可以通过写正则来判断不为空时才校验）
   		@javax.validation.constraints.Pattern(regexp="", message="")
     	private String name;
  		// 当code不为空时，才校验是否满足{regexp}
    	@top.tangyh.basic.annotation.constraints.NotEmptyPattern(regexp="", message="")
     	private String code;
  }
  ```

- TenantLine

  租户模式为DATASOURCE_COLUMN模式时，将该类标记在Mapper类或方法上，使得通过该Mapper类执行的SQL语句可以自动拼接==小租户==的条件。

  ```java
  @Repository
  // 类上加了此注解，该类下所有方法都会自动拼接租户的条件，包括继承SuperMapper类的方法
  @TenantLine
  public interface BaseEmployeeTestMapper extends SuperMapper<BaseEmployee> {
      // 标记此注解，并设置为false，表示该方法不需要拼接租户条件
      @TenantLine(false)
      @Select("select * from base_employee where id = #{id}")
      BaseEmployee get(Long id);
  }
  ```

- Echo

  用于字典回显、外键回显、枚举回显。`@Echo`注解标记到实体类、VO类的字段，不负责具体的回显逻辑。

  ```java
  public class BaseEmployee implements Serializable, EchoVO {
    	// 将数据回显到 echoMap
  	  private Map<String, Object> echoMap = MapUtil.newHashMap();
    	
      // 岗位状态：回显字典
  		@Echo(api = EchoApi.DICTIONARY_ITEM_FEIGN_CLASS, dictType = EchoDictType.Base.POSITION_STATUS)
  		private String positionStatus;
    	// 性别：回显枚举
  		@Echo(api = Echo.ENUM_API)
  		private Sex sex;
      // 用户：回显用户
    	@Echo(api = EchoApi.USER_ID_CLASS)
    	private Long userId;
  }
  ```

- EchoResult

  将该注解标记到ServiceImpl方法上，调用该方法时会执行回显逻辑，将方法的返回值执行回显逻辑。

  ```java
  public class EmployeeServiceImpl {
  		// 标记此注解后，返回值 BaseEmployee 字段上标记了 @Echo 的字段将会回显到echoMap中
    	@EchoResult
    	public BaseEmployee getById(Long id) {
        	// 查数据库
        	return baseMapper.getById(id);
      }
  } 
  ```

  ::: tip

  除了@EchoResult注解，还可以通过 `echoService.action(new BaseEmployee())` 

  :::

- WebLog

  该注解标记在Controller层，用于记录请求接口的操作日志。

  ```java
  @WebLog("员工")
  public class BaseEmployeeController
  		
      @PostMapping("/test")
      @WebLog(enabled = false, value = "测试")
      public R<List<Long>> test(@RequestBody BaseEmployeeRoleRelSaveVO employeeRoleSaveVO) {
          return success(superService.test(employeeRoleSaveVO));
      }
  
      @PostMapping("/employeeRole")
      @WebLog("给员工分配角色")
      public R<List<Long>> saveEmployeeRole(@RequestBody BaseEmployeeRoleRelSaveVO employeeRoleSaveVO) {
          return success(superService.saveEmployeeRole(employeeRoleSaveVO));
      }
  }
  ```

  

- IgnoreResponseBodyAdvice

  


<!-- @include: ./AbstractGlobalResponseBodyAdvice.snippet.md -->



- LoginUser

  将该注解标记在Controller层方法的参数SysUser上，为SysUser对象自动注入当前登录人的数据。

  缺点：

  - 不能标记BaseController中封装的公共方法
  - 不能标记在@RequestBody类型的参数上

  :::code-tabs

  @tab 正例

  ```java
  public class BaseEmployeeController extends SuperController<BaseEmployeeService, Long, BaseEmployee, BaseEmployeeSaveVO, BaseEmployeeUpdateVO, BaseEmployeePageQuery, BaseEmployeeResultVO> {
    
    	// 填充所有的 用户信息
      @PostMapping("/save2")
      public R<Boolean> save2(@RequestBody @Validated(SuperEntity.Update.class) ExtendMsgSendVO data,
                                       @ApiIgnore @LoginUser(isFull = true) SysUser sysUser) {
        	return R.success();
      }
    
    	// 填充用户的员工信息
    	@PostMapping("/save3")
      public R<Boolean> save3(@ApiIgnore @LoginUser(isEmployee = true) SysUser sysUser) { return R.success(); }
    
      // 填充用户基本信息
      @PostMapping("/save4")
      public R<Boolean> save4(@ApiIgnore @LoginUser(isUser = true) SysUser sysUser) { return R.success(); }
    
      // 填充用户拥有的资源
      @PostMapping("/save5")
      public R<Boolean> save5(@ApiIgnore @LoginUser(isResource = true) SysUser sysUser) { return R.success(); }
    
      // 填充用户的机构信息
      @PostMapping("/save6")
      public R<Boolean> save6(@ApiIgnore @LoginUser(isOrg = true) SysUser sysUser) { return R.success(); }
            
  }
  ```

  @tab 反例

  ```java{4-6,12}
  public class BaseEmployeeController extends SuperController<BaseEmployeeService, Long, BaseEmployee, BaseEmployeeSaveVO, BaseEmployeeUpdateVO, BaseEmployeePageQuery, BaseEmployeeResultVO> {
    
    	// 无法在重写父类SaveController的save方法时，添加 @LoginUser
  		@Override
      @PostMapping 
      public R<BaseEmployee> save(@RequestBody @Validated SaveVO BaseEmployeeSaveVO, @ApiIgnore @LoginUser(isFull = true) SysUser sysUser) {
        	return R.success();
      }
      
      // 不能标记在 @RequestBody注解标记的参数上
      @PostMapping("/save2")
      public R<Boolean> save2(@ApiIgnore @LoginUser(isFull = true) @RequestBody SysUser sysUser) {
        	return R.success();
      }
            
  }
  ```

  :::
