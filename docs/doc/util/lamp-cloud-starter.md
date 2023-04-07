---
title: lamp-cloud-starter
icon: wendang
index: false
category:
  - 工具类
tag:
  - 工具类
  - lamp-cloud-starter
---

这个模块主要封装SpringCloud相关的全局配置，lamp-boot项目无需使用此模块，需要在pom中排除。主要有以下功能：

1. SentinelFeignBuilder、LampSentinelInvocationHandler

   作用是全局配置FeignClient的fallback。在写FeignClient接口时，通常需要配置fallback或fallbackFactory，以实现容错降级，但做了全局配置后，会自动为所有feignClient自动添加fallback

   ```java
   // 配置全局fallback后，相当于 @FeignClient(name = "${" + Constants.PROJECT_PREFIX + ".feign.oauth-server:lamp-oauth-server}", fallback = HelperApiFallback.class)
   @FeignClient(name = "${" + Constants.PROJECT_PREFIX + ".feign.oauth-server:lamp-oauth-server}")
   public interface HelperApi {
   
       /**
        * 根据参数键查询参数值
        *
        * @param keys
        * @return 参数值
        */
       @PostMapping("/anyUser/parameter/findParamMapByKey")
       R<Map<String, String>> findParams(@RequestBody List<String> keys);
   }
   ```

2. GrayscaleVersionRoundRobinLoadBalancer

   OpenFeign默认是通过 RoundRobinLoadBalancer 实现负载均衡，该类重写了RoundRobinLoadBalancer，在原有逻辑的基础上做了增强。在负载均衡器选择节点时，优先查找==元数据==中配置的gray_version参数等于==ContextUtil==中配置的gray_version参数一致的节点，若找不到相同的节点，则按RoundRobinLoadBalancer默认规则实现负载。在实际使用过程中，我们有以下场景可以使用：

   - 灰度发布

   - 开发人员只启动某个业务服务，蹭其他人的其他服务。

     开发人员张三开发项目时，启动全部服务费时费电脑资源，若只想测试A服务的部分功能，无需在自己的电脑上启动全部服务。假设测试环境启动了全部服务，此时张三仅需启动单个服务注册到测试环境，前端调用接口时，就能指定调用测试环境的服务还是张三的服务。

     ::: code-tabs

     @tab yml

     ```yaml{6}
     spring:
       cloud:
         nacos:
           discovery:
             metadata: # 元数据，用于权限服务实时获取各个服务的所有接口
               gray_version: zhangsan   # 测试环境配置为test， 每个开发人员配置为自己的名字
     ```

     @tab web

     ```typescript
       /**
        * @description: 请求拦截器处理
        */
       requestInterceptors: (config, options) => {
     
         // 灰度参数，前端传什么值，就访问后端那个节点
         (config as Recordable).headers['gray_version'] = 'zhangsan';
     
         return config;
       },
     ```

     :::

3. DateFormatRegister: 全局FeignClient 接口中的Date、LocalDate、LocalDateTime、LocalTime等日期参数格式化

   

   ```java{5}
   @FeignClient(name = "${" + Constants.PROJECT_PREFIX + ".feign.oauth-server:lamp-oauth-server}")
   public interface TestApi {
   
       @PostMapping("/test")
       User findParams(@RequestParam Date date, @RequestParam LocalDate date2, @RequestParam LocalDateTime date3, @RequestParam LocalTime date4);
   }
   ```

4. InfoSlf4jFeignLogger、InfoFeignLoggerFactory

   配置全局FeignClient调用日志

   ```java
   @ConditionalOnClass(okhttp3.OkHttpClient.class)
   @AllArgsConstructor
   public class RestTemplateConfiguration {
     	// 具体打印日志的实现类 (slf4j)
   		@Bean
       @ConditionalOnMissingBean(FeignLoggerFactory.class)
       public FeignLoggerFactory getInfoFeignLoggerFactory() {
           return new InfoFeignLoggerFactory();
       }
   
       // 开发、测试环境启用日志级别： FULL
       @Bean
       @Profile({"dev", "test"})
       Logger.Level devFeignLoggerLevel() {
           return Logger.Level.FULL;
       }
   
        // docker、uat、prod环境启用日志级别: BASIC
       @Bean
       @Profile({"docker", "uat", "prod"})
       Logger.Level prodFeignLoggerLevel() {
           return Logger.Level.BASIC;
       }
   }
   ```

   

5. FeignAddHeaderRequestInterceptor : 全局FeignClient 请求头和线程变量 透传

6. RestTemplateHeaderInterceptor : 全局RestTemplate 请求头和线程变量 透传




