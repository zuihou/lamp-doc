---
title: lamp-boot
icon: wendang
index: false
category:
  - 工具类
tag:
  - 工具类
  - lamp-boot
---

开源版lamp-util项目中lamp-boot-util模块，就是企业版lamp-util项目中的lamp-boot模块，因为开源版有一个独立的单体项目lamp-boot，为了防止重名特意调整了开源版lamp-util项目中lamp-boot-util模块的名字， 这个模块主要封装了SpringBoot相关的配置和工具类。



## BaseConfig

用于Spring、SpringMVC的全局配置

:::: details ObjectMapper

<!-- @include: ../config/ObjectMapper.snippet.md -->

::::

:::: details Converter

通过配置全局的Converter，解决Controller层方法入参为日期类型且通过@RequestParam接收参数时，日期格式的转换规则。

```java
  /**
   * 解决 @RequestParam(value = "date") Date date
   * date 类型参数 格式问题
   */
  @Bean
  public Converter<String, Date> dateConvert() {
      return new String2DateConverter();
  }

  /**
   * 解决 @RequestParam(value = "time") LocalDate time
   */
  @Bean
  public Converter<String, LocalDate> localDateConverter() {
      return new String2LocalDateConverter();
  }

  /**
   * 解决 @RequestParam(value = "time") LocalTime time
   */
  @Bean
  public Converter<String, LocalTime> localTimeConverter() {
      return new String2LocalTimeConverter();
  }

  /**
   * 解决 @RequestParam(value = "time") LocalDateTime time
   */
  @Bean
  public Converter<String, LocalDateTime> localDateTimeConverter() {
      return new String2LocalDateTimeConverter();
  }
```

::::

:::: details HeaderThreadLocalInterceptor

::: code-tabs

@tab 代码 

```yml
lamp:
  webmvc:
    header: true
```

@tab 配置

```java
		// 用于启用 HeaderThreadLocalInterceptor
		@Bean
    @ConditionalOnClass
    @ConditionalOnProperty(prefix = Constants.PROJECT_PREFIX + ".webmvc", name = "header", havingValue = "true", matchIfMissing = true)
    public GlobalMvcConfigurer getGlobalMvcConfigurer() {
        return new GlobalMvcConfigurer();
    }
```

:::

::::

## AbstractGlobalExceptionHandler 

拦截到指定的异常后，统一使用R对象返回错误信息。



## AbstractGlobalResponseBodyAdvice


:::: details 详情

<!-- @include: ./AbstractGlobalResponseBodyAdvice.snippet.md -->

::::



## HeaderThreadLocalInterceptor

读取请求头中的参数, 放到ContextUtil中

- PATH_HEADER：前端页面的路径
- TENANT_ID_HEADER： 当前用户的租户ID
- TENANT_BASE_POOL_NAME_HEADER： 接下来的SQL，需要访问那个租户base库
- USER_ID_HEADER：当前用户的用户ID
- EMPLOYEE_ID_HEADER：当前用户在某个租户下的员工ID
- APPLICATION_ID_HEADER：当前请求的应用ID
- CURRENT_COMPANY_ID_HEADER：当前用户所属的机构ID
- CURRENT_TOP_COMPANY_ID_HEADER：当前用户所属的顶级机构ID
- CURRENT_DEPT_ID_HEADER：当前用户所属部门ID
- CLIENT_ID_HEADER：客户端ID
- TRACE_ID_HEADER：日志链路Id
- TOKEN_HEADER：当前请求的Token



## UndertowServerFactoryCustomizer 

Undertow 全局配置



## WebUtils

Web 工具类

