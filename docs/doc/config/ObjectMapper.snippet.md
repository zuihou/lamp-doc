为了统一后端返回数据到前端时，数据格式不规则、长整型数据精度丢失等问题，本项目配置了全局ObjectMapper类实现son序列化和反序列化时。

## 名词解释
1. 序列化：Controller层接口返回值 转成 json 格式的过程
2. 反序列化：前端请求通过json格式提交参数到 Controller 层的过程

## 全局配置

::: tip

配置全局ObjectMapper类后，会和yml配置文件中 spring.jackson.xxx 的配置产生冲突，所以请勿在yml中重复配置

:::

在BaseConfig类配置了全局的 ObjectMapper 实例， 并调整了objectMapper的默认序列化和反序列化规则。

```java
@Bean
@Primary
@ConditionalOnClass(ObjectMapper.class)
@ConditionalOnMissingBean
public ObjectMapper jacksonObjectMapper(Jackson2ObjectMapperBuilder builder) {
    ObjectMapper objectMapper = builder.createXmlMapper(false).build();

    objectMapper
     // 设置当前位置
    .setLocale(Locale.CHINA)
    // 去掉默认的时间戳格式
    .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false)
    // 时区
    .setTimeZone(TimeZone.getTimeZone(ZoneId.systemDefault()))
    // Date参数日期格式
    .setDateFormat(new SimpleDateFormat(DEFAULT_DATE_TIME_FORMAT, Locale.CHINA))
    // 该特性决定parser是否允许JSON字符串包含非引号控制字符（值小于32的ASCII字符，包含制表符和换行符）。 如果该属性关闭，则如果遇到这些字符，则会抛出异常。JSON标准说明书要求所有控制符必须使用引号，因此这是一个非标准的特性
    .configure(JsonReadFeature.ALLOW_UNESCAPED_CONTROL_CHARS.mappedFeature(), true)
    // 忽略不能转义的字符
    .configure(JsonReadFeature.ALLOW_BACKSLASH_ESCAPING_ANY_CHARACTER.mappedFeature(), true)
    // 在使用spring boot + jpa/hibernate，如果实体字段上加有FetchType.LAZY，并使用jackson序列化为json串时，会遇到SerializationFeature.FAIL_ON_EMPTY_BEANS异常
    .configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false)
    // 忽略未知字段
    .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
    // 单引号处理
    .configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);
    // 注册自定义模块
    objectMapper.registerModule(new LampJacksonModule())
    .findAndRegisterModules();
}

public class LampJacksonModule extends SimpleModule {

    public LampJacksonModule() {
        super();
				// 定义LocalDateTime、LocalDate、LocalTime 反序列化规则
        this.addDeserializer(LocalDateTime.class, LampLocalDateTimeDeserializer.INSTANCE);
        this.addDeserializer(LocalDate.class, new LocalDateDeserializer(DateTimeFormatter.ofPattern(DEFAULT_DATE_FORMAT)));
        this.addDeserializer(LocalTime.class, new LocalTimeDeserializer(DateTimeFormatter.ofPattern(DEFAULT_TIME_FORMAT)));
        
				// 定义LocalDateTime、LocalDate、LocalTime 序列化规则
        this.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(DateTimeFormatter.ofPattern(DEFAULT_DATE_TIME_FORMAT)));
        this.addSerializer(LocalDate.class, new LocalDateSerializer(DateTimeFormatter.ofPattern(DEFAULT_DATE_FORMAT)));
        this.addSerializer(LocalTime.class, new LocalTimeSerializer(DateTimeFormatter.ofPattern(DEFAULT_TIME_FORMAT)));
      	
      	// 定义Long、BigInteger、BigDecimal的序列化规则
        this.addSerializer(Long.class, ToStringSerializer.instance);
        this.addSerializer(Long.TYPE, ToStringSerializer.instance);
        this.addSerializer(BigInteger.class, ToStringSerializer.instance);
        this.addSerializer(BigDecimal.class, ToStringSerializer.instance);
    }

}
```



## 序列化配置项

按照上面的代码进行配置后，会将入参和返回值按下面的格式接收和返回。

1. Long -> String

   返回值字段是Long类型，返回给前端的是字符串格式。

   - 实现代码

     ```java
     public LampJacksonModule() {
         this.addSerializer(Long.class, ToStringSerializer.instance);
         this.addSerializer(Long.TYPE, ToStringSerializer.instance);
     }
     ```
    - 最终效果

    ::: code-tabs#xg

    @tab json

    ```json
    {
        "id": "29984253320102284"
    }
    ```

    @tab java

    ```java
    public class User {
      	private Long id;
    }
    
    public class UserController {
      	public User get() {
          return new User().setId(29984253320102284L);
        }
    }
    ```

    :::

    - 解决问题

      解决前端接收Long类型的值，精度丢失问题。

2. BigInteger -> String 

   返回值字段是BigInteger类型，返回给前端的是字符串格式。

   - 实现代码

     ```java
     public LampJacksonModule() {
         this.addSerializer(BigInteger.class, ToStringSerializer.instance);
     }
     ```

   - 最终效果

     ::: code-tabs#xg

     @tab json

     ```json
     {
         "id": "29984253320102284"
     }
     ```

     @tab java

     ```java
     public class User {
       	private BigInteger id;
     }
     
     public class UserController {
       	public User get() {
           return new User().setId(new BigInteger(29984253320102284L));
         }
     }
     ```

     :::

   - 解决问题

     解决前端接收BigInteger类型的值，精度丢失问题。

3. BigDecimal -> String

   返回值字段是BigDecimal类型，返回给前端的是字符串格式。

   - 实现代码

     ```java
     public LampJacksonModule() {
         this.addSerializer(BigDecimal.class, ToStringSerializer.instance);
     }
     ```

     
   - 最终效果

      

     ::: code-tabs#xg

     @tab json

     ```json
     {
         "id": "123.23"
     }
     ```

     @tab java

     ```java
     public class User {
       	private BigDecimal id;
     }
     
     public class UserController {
       	public User get() {
           return new User().setId(new BigDecimal(123.23));
         }
     }
     ```

     :::

   - 解决问题

     解决前端接收BigDecimal类型的值，精度丢失问题。

4. Date -> String

   返回值字段是Date类型，返回给前端的是字符串格式。

   - 实现代码

     ```java
     public class BaseConfig {
         public ObjectMapper jacksonObjectMapper(Jackson2ObjectMapperBuilder builder) {
       	  objectMapper
           // Date参数日期格式
           .setDateFormat(new SimpleDateFormat(DEFAULT_DATE_TIME_FORMAT, Locale.CHINA))
           // ...
         }
     }
     ```
   - 最终效果

   - ::: code-tabs#xg

     @tab json

     ```json
     {
         "date": "yyyy-MM-dd HH:mm:ss"  // 这里的格式由上面的 DEFAULT_DATE_TIME_FORMAT 决定
     }
     ```

     @tab java

     ```java
     public class User {
       	private Date date;
     }
     
     public class UserController {
       	public User get() {
           return new User().setDate(new Date());
         }
     }
     ```

     :::

    - 解决问题

      统一日期参数的格式

5. LocalDateTime -> String

   返回值字段是LocalDateTime类型，返回给前端的是字符串格式。

   - 实现代码

     ```java
     public LampJacksonModule() {
         this.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(DateTimeFormatter.ofPattern(DEFAULT_DATE_TIME_FORMAT)));
     }
     ```

     

    - 最终效果
    Controller层接口返回参数中，LocalDateTime类型的字段，会转成字符串。
    
    @tab json
    
    ```json
    {
        "date": "yyyy-MM-dd HH:mm:ss"   
    }
    ```
    
    @tab java
    
    ```java
    public class User {
      	private LocalDateTime date;
    }
    
    public class UserController {
      	public User get() {
          return new User().setDate(LocalDateTime.now());
        }
    }
    ```
    
    :::
    
    
   - 解决问题

     统一日期参数的格式

6. LocalDate -> String 

    返回值字段是LocalDate类型，返回给前端的是字符串格式。

    - 实现代码

      ```java
      public LampJacksonModule() {
          this.addSerializer(LocalDate.class, new LocalDateSerializer(DateTimeFormatter.ofPattern(DEFAULT_DATE_FORMAT)));
      }
      ```

      

     - 最终效果
       Controller层接口返回参数中，LocalDateTime类型的字段，会转成字符串。

       @tab json

       ```json
       {
           "date": "yyyy-MM-dd"  
       }
       ```

       @tab java

       ```java
       public class User {
         	private LocalDate date;
       }
       
       public class UserController {
         	public User get() {
             return new User().setDate(LocalDate.now());
           }
       }
       ```

       :::

       

    - 解决问题

      统一日期参数的格式

7. LocalTime -> String 

   返回值字段是LocalTime类型，返回给前端的是字符串格式。

   - 实现代码

     ```java
     public LampJacksonModule() {
         this.addSerializer(LocalTime.class, new LocalTimeSerializer(DateTimeFormatter.ofPattern(DEFAULT_TIME_FORMAT)));
     }
     ```

     

    - 最终效果
      Controller层接口返回参数中，LocalTime类型的字段，会转成字符串。

      @tab json

      ```json
      {
          "date": "HH:mm:ss"  
      }
      ```

      @tab java

      ```java
      public class User {
        	private LocalTime date;
      }
      
      public class UserController {
        	public User get() {
            return new User().setDate(LocalTime.now());
          }
      }
      ```

      :::

      

   - 解决问题

     统一日期参数的格式

   

## 反序列化配置项

反序列化跟序列化刚好相反，是将前端传递的json数据转换为JavaBean的过程。

1. String -> Long
   字符串类型的长整型数字，会转换为Long
   
3. String -> BaseEnum
   符合枚举值的字符串，可以转换为BaseEnum
   
4. String -> LocalDate, 支持前端传递格式：
   - `yyyy-MM-dd`: 如：2021-11-11
   
5. String -> LocalDateTime, 支持前端传递格式： 
   - `yyyy-MM-dd`:  如：2021-11-11
   - `yyyy/MM/dd`:  如：2021/11/11
   - `yyyy年MM月dd日`:  如：2021年11月11日
   - `yyyy-MM-dd HH:mm:ss`:  如：2021-11-11 11:11:11
   - `yyyy/MM/dd HH:mm:ss`:  如：2021/11/11 11:11:11
   - `yyyy年MM月dd日HH时mm分ss秒`:  如：2021年11月11日11时11分11秒
   
6. String -> LocalTime

   支持前端传递格式： `HH:mm:ss`