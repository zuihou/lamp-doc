若系统启用了AbstractGlobalResponseBodyAdvice类，系统会将Controller层所有方法的返回值自动包装为`R`对象。该注解用于局部禁用此功能。

::: code-tabs

@tab AbstractGlobalResponseBodyAdvice

```java{5-7,10,15-21}
public class AbstractGlobalResponseBodyAdvice implements ResponseBodyAdvice<Object> {
    @Override
    public boolean supports(MethodParameter methodParameter, Class aClass) {
        // 类上如果被 IgnoreResponseBodyAdvice 标识就不拦截
        if (methodParameter.getDeclaringClass().isAnnotationPresent(IgnoreResponseBodyAdvice.class)) {
            return false;
        }

        // 方法上被标注也不拦截
        return !Objects.requireNonNull(methodParameter.getMethod()).isAnnotationPresent(IgnoreResponseBodyAdvice.class);
    }

    @Override
    public Object beforeBodyWrite(Object o, MethodParameter methodParameter, MediaType mediaType, Class aClass, ServerHttpRequest serverHttpRequest, ServerHttpResponse serverHttpResponse) {
        if (o == null) {
            return null;
        }
        if (o instanceof R) {
            return o;
        }
        return R.success(o);
    }
}
```

@tab json格式

```json{3-4}
{
	"code": 0,  // 状态码  0表示请求成功 其他请求失败
	"data": {   //  将controller层的返回值包装到data字段
	},
	"errorMsg": "", //错误消息
	"extra": {}, // 扩展数据
	"isSuccess": true,  // 是否请求成功
	"msg": "",  // 响应消息
	"path": "",  // 访问失败时的请求路径
	"timestamp": 0  // 后端响应时的时间戳
}
```

@tab 示例

```java
public class CaptchaController {
  	/* 
  	 * 若服务通过配置，启用了AbstractGlobalResponseBodyAdvice类，默认情况下Controller层所有的方法都会按照 R 的格式返回
  	 */
    @GetMapping(value = "/captcha", produces = "image/png")
    @IgnoreResponseBodyAdvice
    public void captcha(@RequestParam(value = "key") String key, HttpServletResponse response) throws IOException {
        this.captchaService.createImg(key, response);
    }
  
  	// 虽然方法只返回了User对象，但前端接收到的实际上是 R.success(user)
  	@GetMapping(value = "/test")
    public User test() throws IOException {
        return new User().setId(1);
    }
}
```

:::