---
title: sdk封装
icon: wendang
index: false
order: 3
category:
  - 开放平台
tag:
  - sdk封装
---

## sdk 模块介绍

在lamp-openapi服务或自建的其他服务中将接口开发完成后，一般需要开发对应的sdk，提供给第三方开发者（即ISV）。

灯灯开放平台提供了一个基础的SDK开发包，你可以在此基础上进行sdk的开发。

```shell
├── lamp-sdk-core             // 基础 sdk，封装了 请求方法、入参签名算法、返回参数解析、异常处理等逻辑
│   ├── src/main/java/top.tangyh.lamp.sdk.client
│   │   ├── client						// http 请求工具类
│   │   ├── common						// 公共方法
│   │   ├── exception					// 异常
│   │   ├── param	  					// 公共请求参数
│   │   ├── sign							// 签名算法
│   │   ├── util 							// 工具类
└── lamp-simple-sdk           // 示例 sdk，基于lamp-sdk-core封装了几个简单的接口调用示例。
│   ├── src/main/java/top.tangyh.lamp.sdk
│   │   ├── param							// 请求响应参数
│   │   ├── request						// 业务请求参数
│   │   ├── response					// 业务响应参数
```

## 编写开放接口

假设我们在lamp-openapi服务新写了如下接口，我们以这个接口为例，演示如何编写sdk

::: code-tabs

@tab 接口

```java
/**
 * 演示 - 支付接口
 *
 * @author zuihou
 */
public interface OpenPayment {

    /**
     * 手机网站支付接口
     *
     * @apiNote 该接口是页面跳转接口，用于生成用户访问跳转链接。
     * 请在服务端执行SDK中pageExecute方法，读取响应中的body()结果。
     * 该结果用于跳转到页面，返回到用户浏览器渲染或重定向跳转到页面。
     * 具体使用方法请参考 <a href="https://torna.cn" target="_blank">接入指南</a>
     *
     *
     * @param request 请求参数
     * @param context 上下文参数
     */
    @Open("openapi.wap.pay")
    PayTradeWapPayResponse tradeWapPay(PayTradeWapPayRequest request, OpenContext context);
}
```

@tab 入参

```java
/**
 * alipay.trade.wap.pay(手机网站支付接口)
 *
 * @author zuihou
 * https://opendocs.alipay.com/open/29ae8cb6_alipay.trade.wap.pay?pathHash=1ef587fd&ref=api&scene=21
 */
@Data
public class PayTradeWapPayRequest {
    /**
     * 商户网站唯一订单号
     *
     * @mock 70501111111S001111119
     */
    @Length(max = 64)
    @NotBlank(message = "商户网站唯一订单号必填")
    private String outTradeNo;
}
```



@tab 出参

```java
/**
 * 返回值
 */
@Data
public class PayTradeWapPayResponse {

    /**
     * 用于跳转支付平台页面的信息，POST和GET方法生成内容不同：使用POST方法执行，结果为html form表单，在浏览器渲染即可<br>使用GET方法会得到支付平台URL，需要打开或重定向到该URL。建议使用POST方式。
     *
     * @mock 请参考响应示例
     */
    @NotNull
    private String pageRedirectionData;
}
```

:::

## 封装开放接口

接下来介绍如何新建一个sdk，并在sdk中封装开放接口。

1. 新建 lamp-simple-sdk

2. 配置依赖

   ```xml
   <dependencies>
       <!-- http请求 -->
       <dependency>
           <groupId>top.tangyh.lamp</groupId>
           <artifactId>lamp-sdk-core</artifactId>
           <version>${project.version}</version>
       </dependency>
   </dependencies>
   ```

3. 在request包新建业务入参类

   ```java
   /**
    * 这个类的类名可以随意命名，但建议以Request结尾
    * 这个类的字段以及字段类型需要与开放接口中 PayTradeWapPayRequest 类中的字段完全一致。
    */
   @Data
   public class PayTradeWapPayRequest {
   
       private String outTradeNo;
   }
   ```

   

4. 在response包新建业务出参类

   ```java
   /**
    * 这个类的类名可以随意命名，但建议以Request结尾
    * 这个类的字段以及字段类型需要与开放接口中 PayTradeWapPayResponse 类中的字段完全一致。
    */
   @Data
   public class PayTradeWapPayResponse {
   
       private String pageRedirectionData;
   
   }
   ```

5. 在param包新建 请求响应参数，继承 BaseParam

   ```java
   @EqualsAndHashCode(callSuper = true)
   @Data
   public class PayTradeWapPayParam extends BaseParam<PayTradeWapPayRequest, PayTradeWapPayResponse> {
       @Override
       protected String method() {
           return "openapi.wap.pay";
       }
   }
   ```

   - 继承BaseParam后，需要指定2个泛型，第一个表示开放接口的业务入参，第二个表示开放接口的业务出参。

   - 重写method方法，并编写接口名。方法名必须与开放接口中@Open(value = "") 的value一致

   - 可以重写version方法，填写接口版本号。（前提是你的开放接口有也有多个版本的接口）

   - 可以重写requestMethod方法，指定http的请求类型，默认是post请求

     建议读请求用get，写请求用post

## sdk使用

接下来介绍如何基于刚才封装的sdk进行调用。

```java
public class SdkTest extends TestCase {
  	// sop-gatweay-server 的访问地址, http://ip:${server.port}/${gateway.path}
    String url = "http://localhost:18750/api";
    // 分配给第三方的 应用id
    String appId = "2019032617262200001";
    // 分配给第三方的 开发者私钥
    String privateKeyIsv = "xxx";
    // 开放平台提供的公钥:前往SOP-ADMIN，ISV管理--秘钥管理，生成平台提供的公私钥，然后把【平台公钥】放到这里
    String publicKeyPlatform = "";

    // 接口请求客户端
    OpenClient client = new OpenClient(url, appId, privateKeyIsv, publicKeyPlatform);

    /**
     * 测试 - 手机网站支付接口
     */
    public void testTradeWapPay() {
      	// 请求参数
        PayTradeWapPayParam param = new PayTradeWapPayParam();
      
      	// 业务入参
        PayTradeWapPayRequest model = new PayTradeWapPayRequest();
        model.setOutTradeNo("70501111111S001111119");
        model.setTotalAmount(new BigDecimal("1000"));
        model.setSubject("衣服");
        model.setProductCode("QUICK_WAP_WAY");
      
        Result<PayTradeWapPayResponse> result = client.execute(param);
        if (result.isSuccess()) {
            // 业务出参
            PayTradeWapPayResponse response = result.getData();
            System.out.println(response);
        } else {
            System.out.println(result);
        }
    }
}
```

