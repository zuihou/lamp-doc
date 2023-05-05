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

   <!-- @include: ../advanced/SpringCloud/灰度发布.md#gray -->

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



