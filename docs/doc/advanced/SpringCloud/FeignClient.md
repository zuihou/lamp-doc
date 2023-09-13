---
title: FeignClient
icon: code
index: false
category:
  - 开发进阶
tag:
  - 开发进阶
  - FeignClient
---

## 原理解析

Feign的英语表示“假装、假装、变形”，是http请求调用的轻量级框架，不像Java那样封装http请求消息并直接调用，而是作为Java接口注释使用http Feign通过处理注释，将请求模板化，在实际被调用时传递参数，根据参数应用于请求，转换为真正的请求，这样的请求比较直观。

![](/images/advanced/feignclient.png)



## 注意事项

1. 当使用@PathVariable时，不能省略value

   :::code-tabs

   @tab 正例

   ```java
   @FeignClient("microservice-provider-user")
   public interface UserFeignClient {
       @RequestMapping(value = "/users/{id}", method = RequestMethod.GET)
       public User findById(@PathVariable("id") Long id);
   }
   ```

   @tab 反例

   ```java
   @FeignClient("microservice-provider-user")
   public interface UserFeignClient {
       @RequestMapping(value = "/users/{id}", method = RequestMethod.GET)
       public User findById(@PathVariable Long id);
   }
   
   ```

   :::

2. 请求头透传

   A服务通过FeignClient接口调用B服务，在A服务中的请求头参数默认情况是不会传递到B服务中的，《灯灯》使用FeignAddHeaderRequestInterceptor拦截器来解决请求头透传的问题。

   ```java
   public class FeignAddHeaderRequestInterceptor implements RequestInterceptor {
     	// 只会将这些请求头传递到下游服务
       public static final List<String> HEADER_NAME_LIST = Arrays.asList(
               ContextConstants.APPLICATION_ID_KEY, ContextConstants.TOKEN_KEY,
               ContextConstants.CLIENT_KEY,
               ContextConstants.TENANT_ID_KEY, ContextConstants.JWT_KEY_USER_ID,
               ContextConstants.JWT_KEY_EMPLOYEE_ID, ContextConstants.JWT_KEY_UUID,
               ContextConstants.TENANT_BASE_POOL_NAME_HEADER, ContextConstants.TENANT_EXTEND_POOL_NAME_HEADER,
               ContextConstants.PATH_HEADER, ContextConstants.CLIENT_ID_HEADER,
               ContextConstants.CURRENT_COMPANY_ID_HEADER,
               ContextConstants.CURRENT_TOP_COMPANY_ID_HEADER,
               ContextConstants.CURRENT_DEPT_ID_HEADER,
               ContextConstants.FEIGN,
               ContextConstants.TRACE_ID_HEADER,
               ContextConstants.GRAY_VERSION,
               ContextConstants.STOP,
               ContextConstants.PROCEED,
               ContextConstants.TRACE_ID_HEADER, "X-Real-IP", "x-forwarded-for"
       );
   
       public FeignAddHeaderRequestInterceptor() {
           super();
       }
   
       @Override
       public void apply(RequestTemplate template) {
           String xid = RootContext.getXID();
           if (StrUtil.isNotEmpty(xid)) {
               template.header(RootContext.KEY_XID, xid);
           }
   
           template.header(ContextConstants.FEIGN, StrPool.TRUE);
           log.info("thread id ={}, name={}", Thread.currentThread().getId(), Thread.currentThread().getName());
           RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();
           if (requestAttributes == null) {
               Map<String, String> localMap = ContextUtil.getLocalMap();
               localMap.forEach((key, value) -> template.header(key, URLUtil.encode(value)));
               return;
           }
   
           HttpServletRequest request = ((ServletRequestAttributes) requestAttributes).getRequest();
           if (request == null) {
               log.warn("path={}, 在FeignClient API接口未配置FeignConfiguration类， 故而无法在远程调用时获取请求头中的参数!", template.path());
               return;
           }
           // 传递请求头
           HEADER_NAME_LIST.forEach(headerName -> {
               String header = request.getHeader(headerName);
               template.header(headerName, ObjectUtil.isEmpty(header) ? URLUtil.encode(ContextUtil.get(headerName)) : header);
           });
       }
   }
   
   ```

3. 分布式事务

   当前 `Spring` 的事务只能支持应用内回滚，当涉及到跨应用调用时，就存在分布式事务问题。当你在《灯灯》中使用feignClient且存在分布式事务时，需要注意以下几点：

   1. 被调用方遇到异常时，需要将异常抛出来，不能try catch

   2. 全局异常捕获时，状态码不能返回200

      ```java{4}
      public abstract class AbstractGlobalExceptionHandler {
      
          @ExceptionHandler(BizException.class)
          @ResponseStatus(HttpStatus.BAD_REQUEST)
          public R<?> bizException(BizException ex) {
              log.warn("BizException:", ex);
              return R.result(ex.getCode(), null, ex.getMessage())
                      .setErrorMsg(getErrorMsg(ex)).setPath(getPath());
          }
      }
      ```

4. 文件上传

   ::: code-tabs

   @tab api

   ```java
   @FeignClient(name = "${" + Constants.PROJECT_PREFIX + ".feign.base-server:lamp-base-server}")
   public interface FileApi {
   
       /**
        * 通过feign-form 实现文件 跨服务上传
        *
        * @param file        文件
        * @param bizType     业务类型
        * @param bucket      桶
        * @param storageType 存储类型
        * @return 文件信息
        */
       @PostMapping(value = "/file/anyone/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
       R<FileResultVO> upload(
               @RequestPart(value = "file") MultipartFile file,
               @RequestParam(value = "bizType") String bizType,
               @RequestParam(value = "bucket", required = false) String bucket,
               @RequestParam(value = "storageType", required = false) FileStorageType storageType);
   
   }
   
   ```

   @tab controller

   ```java
   @Slf4j
   @Validated
   @RestController
   @RequiredArgsConstructor
   @RequestMapping("/file/anyone")
   @Api(value = "FileAnyoneController", tags = "租户库-文件实时上传")
   public class FileAnyoneController {
       private final FileService fileService;
   
   
       /**
        * 上传小文件到租户库
        * <p>
        * 适用于非租户请求的文件上传
        *
        * @param file         文件
        * @param fileUploadVO 附件信息
        */
       @PostMapping(value = "/upload")
       public R<FileResultVO> upload(@RequestParam(value = "file") MultipartFile file,
                                     @Validated FileUploadVO fileUploadVO) {
           // 忽略路径字段,只处理文件类型
           if (file.isEmpty()) {
               return R.validFail(BASE_VALID_PARAM.build("请上传有效文件"));
           }
           if (ContextUtil.isEmptyTenantId()) {
               return R.validFail(BASE_VALID_PARAM.build("请携带租户信息"));
           }
           return R.success(fileService.upload(file, fileUploadVO));
       }
   }
   ```

   :::

5. 多个参数

   如果想要请求target-servername 服务，并且参数有多个例如：[http://target-servername/query-by?id=1&username=](https://link.jianshu.com?t=http://target-servername/query-by?id=1&username=)张三 ，要怎么办呢？

   不能构造一个复杂的对象去接收，必须一个一个接收参数

   :::code-tabs

   @tab 正例

   ```java
   @FeignClient("target-servername")
   public interface UserFeignClient {
   
      @RequestMapping(value = "/query-by", method = RequestMethod.GET)
      public Object queryBy(@RequestParam("id")Long id, @RequestParam("username")String username);
   
     
      	@RequestMapping(value = "/query-by2", method = RequestMethod.POST)
    		public Object queryBy2(@RequestBody User user);
   
   }
   
   public class User {
     private Long id;
     private String username;
   }
   ```

   @tab 反例

   ```java
   @FeignClient("target-servername")
   public interface UserFeignClient {
       @RequestMapping(value = "/query-by", method = RequestMethod.GET)
       public Object queryBy(User user);
   }
   ```

   :::

   

## 常见问题

## 报错：Method has too many Body parameters

异常原因：

- 当使用Feign时，如果发送的是get请求，那么**需要在请求的所有参数前加上@RequestParam注解修饰**
- @RequestParam是用来修饰参数，不能用来修饰整个对象。
- **Feign中可以有多个@RequestParam，但只能有不超过一个@RequestBody**
- 既有@RequestBody也有@RequestParam，那么参数就要放在请求的url中，@RequestBody修饰的就要放在提交对象中。
