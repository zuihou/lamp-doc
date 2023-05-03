---
title: Swagger文档
index: false
category:
  - 开发进阶
tag:
  - 开发进阶
  - Swagger文档
---

## 简介

本项目的Swagger文档UI使用[knife4j](https://xiaoym.gitee.io/knife4j)，后端注解使用Springfox和Swagger相关注解。

对于lamp-cloud项目，访问每个服务的 http://ip:端口/doc.html 都能直接访问服务的文档。 而 http://ip:18760/api/doc.html 是访问网关聚合后的文档，区别在于：
1. 网关聚合文档可以聚合项目所有正常启动服务的文档，调试时请求会通过网关转发，所以必须携带Token、TenantId、Authorition、ApplicationId等请求头。

   请求通过lamp-gateway-server的过滤器TokenContextFilter时，会将请求头中的 Token 解析成UserId、EmployeeId，在封装到请求头中供后台服务使用。

2. 服务自己的文档，需要携带UserId、EmployeeId、TenentId、ApplicationId等请求头  

   

lamp-cloud全部项目启动成功后，会有几个swagger地址：

- 认证服务文档：http://127.0.0.1:18773/doc.html
- 系统服务文档：http://127.0.0.1:18778/doc.html
- 基础服务文档：http://127.0.0.1:18764/doc.html
- 代码生成服务文档：http://127.0.0.1:18780/doc.html
- gateway网关聚合文档：http://127.0.0.1:18760/api/doc.html



## 接口请求流程

每个接口请求时，请求头中都要携带封装了用户身份的token请求头，请求通过网关路由到后端具体的服务，并在网关的系统会将请求头中的token信息解析成用户信息(userId, orgId, name, account 等信息)，再次封装到请求头中。
1. 大致流程

   ```sequence
   lamp-web-pro ->> lamp-gateway-server: 1 使用账号密码登录
   lamp-gateway-server ->> lamp-oauth-server: 2 路由请求到认证服务，验证账号密码
   lamp-oauth-server -->> lamp-web-pro: 3 返回Token、用户基本信息
   lamp-web-pro ->> lamp-gateway-server:  4 请求头中携带Token、TenantId、ApplicationId、Authorization发起任意请求
   Note Right of lamp-gateway-server:  5 gateway将请求头中参数封装到请求头 
   lamp-gateway-server -->> lamp-web-pro: 6 验证失败，直接返回无权限
   lamp-gateway-server ->> lamp-base-server: 7 验证通过，路由请求到后端服务
   Note Right of lamp-base-server:  后端拦截器解析请求头中的用户信息，封装到ThreadLocal
   lamp-base-server -->> lamp-web-pro: 8 返回数据
   ```

2. 详细流程

     ![](/images/start/lamp-cloud调用流程.drawio.png)
     
     

由上图可知，每个经过TokenContextFilter的请求，默认都会携带Token、TenantId、ApplicationId、Authorization4个请求头，他们的用途如下：

1. Token：当前请求来自那个用户（UserId）、员工（EmployeeId）

   主要用途：封装用户信息，鉴别请求是谁发起的，请求头中携带了Token参数，才能进行**URI鉴权**。

   Token设置了8小时的有效期，有效期结束表示用户登录失效。

2. TenantId：当前请求来自那个租户ID

   主要用途：用于切换数据源。请求头中携带了TenantId参数，才能操作**租户库**和**URI鉴权**

3. ApplicationId：当前请求来自那个应用ID

   主要用途：请求头中携带了ApplicationId参数，才能进行**应用鉴权**和**URI鉴权**

4. Authorization：当前请求来自那个客户端

   目前仅在登录时校验是否携带了正确的客户端信息

TokenContextFilter将Token中封装的userId、employeeId、currentCompanyId、currentTopCompanyId、currentDeptId等参数解析出来封装到请求头中，并将请求转发到业务服务。

请求到达业务服务后，先执行HeaderThreadLocalInterceptor拦截器，该拦截器会将请求头的上述参数封装到线程变量 ContextUtil 中。请求调用到Controller、Service、Mapper 层时，程序就能通过ContextUtil获取当前登录人的信息和租户ID等信息用于切换数据源和业务处理了。

::: warning

由上可知，ContextUtil中的值是在HeaderThreadLocalInterceptor拦截器中设置的。所以，定时任务、异步调用等场景ContextUtil中没有参数的，需要手动调用ContextUtil.setXxx()  方法设置参数。

:::




## 通过网关聚合的swagger文档调用接口
需要先调用**登录接口**获取封装了用户Id和员工Id的Token，然后调用业务接口时，传递Token、TenantId、base64加密的Authorization和ApplicationId。
1. 生成Authorization

   在def_client表中查询client_id和client_secret参数，然后调用下方方法生成Authorization。

   ::: code-tabs

   @tab 前端调用

   ```typescript
   Base64.encode('lamp_web_pro:lamp_web_pro_secret')  的值为  bGFtcF93ZWI6bGFtcF93ZWJfc2VjcmV0
   ```

   @tab 后端调用

   ```java
   Base64.getEncoder().encodeToString(new String("lamp_web_pro:lamp_web_pro_secret").getBytes())
   ```

   :::

2. 打开网关聚合文档：http://127.0.0.1:18760/api/doc.html 

   如图所示点击 `oauth-认证服务` - `登录接口` - `登录接口` - `调试` - `填写请求头` - `填写账号密码` - 点击`发送` 

   ![](/images/advanced/swagger文档登录.png)

   

3. 复制“登录接口”返回的`token` ，将它作为调用其他接口的请求头部参数。

4. 获取TenantId

   在def_tenant表中获取租户ID

5. 获取ApplicationId

   在def_application表中获取应用ID

6.  调用其他接口时，在请求头设置 Authorization、TenantId、ApplicationId、Token 4个参数。 

   ![](/images/advanced/swagger文档调用任意接口.png)



## 直接调用业务服务的swagger文档

阅读[接口请求流程](#接口请求流程)后可知，直接调用业务服务的接口时，无需传递Token 和 Authorization，但需要传递 TenantId、UserId、EmployeeId、ApplicationId等参数

1. 访问以下任意服务文档

   - 认证服务文档：http://127.0.0.1:18773/doc.html
   - 系统服务文档：http://127.0.0.1:18778/doc.html
   - 基础服务文档：http://127.0.0.1:18764/doc.html
   - 代码生成服务文档：http://127.0.0.1:18780/doc.html

2. 调用接口时，先在`请求头部` 页面, 设置TenantId、UserId、EmployeeId、ApplicationId 等请求头参数

   ![](/images/advanced/swagger服务文档调用任意接口.png)



## 新服务如何接入swagger文档

1.  server 模块加入依赖

    ```xml
    <dependency>
        <groupId>top.tangyh.basic</groupId>
        <artifactId>lamp-swagger2-starter</artifactId>
    </dependency>
    ```

2.  SwaggerProperties 提供了动态配置docket文档的能力, 修改 lamp-xxx-server.yml 配置文件配置多个文档group

    ```yaml
    lamp:
      swagger:
        docket:
          xxx:
            title: xxx模块接口
            base-package: top.tangyh.lamp.xxx.controller
          yyy:
            title: yyy模块
            base-package: top.tangyh.lamp.yyy.controller
    ```

3.  启动项目, 访问新建服务的swagger文档地址：http://ip:port/doc.html

4.  在网关配置文件中加入新服务的路由即可使用网关聚合文档。

    ```yaml
      - id: xxx
        uri: lb://lamp-xxx-server   // 新服务名
        predicates:
          - Path=/xxx/**
        filters:
          - StripPrefix=1
    ```

5.  访问 http://ip:port/api/doc.html 时, 网关通过 SwaggerResourceConfig 类进行聚合。

    这个类的实现原理是通过读取网关的路由配置，然后通过restTemplate请求后端服务的文档数据，所以当后端服务未启动时，是无法聚合文档的
## 

## 更多配置

[点我阅读](/doc/util/lamp-swagger2-starter.html)



