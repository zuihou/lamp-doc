---
title: lamp-jwt-starter
icon: wendang
index: false
category:
  - 工具类
tag:
  - 工具类
  - lamp-jwt-starter
---

这个模块功能主要是生成 token 和 解析token

1. 修改token有效期

   修改配置文件中配置的token有效期

   ```yaml
   # lamp-oauth-server.yml
   lamp:
     authentication:
       expire: 28800               # token有效期为8小时
       refreshExpire: 86400        # 刷新token有效期为24小时
       allowedClockSkewSeconds: 60L  # 设置解析token时，允许的误差 单位：s
   ```

2.  Base64Util 类用解析请求头传递过来的Authorization参数

3. JwtUtil 类是对JWT生成和解析方法进行封装

4. TokenHelper 是对JwtUtil在进行了一次包装,  用于根据步骤1中对配置和需要封装进token的参数调用jwtUtil 进行生成token 和解析token

5. TokenHelper 是对项目业务友好的，而JwtUtil 是单纯的无业务工具类

6. 如何修改token的加密签名？  (修改之后, 其他基于本项目开发的人, 就无法解密你的项目生成的token了)

   ```yaml
   # 同时修改 lamp-gateway-server.yml 和 lamp-oauth-server.yml
   lamp:
     authentication:
       # jwt 签名，长度至少32位。 建议每个公司都修改一下这个字符串。 lamp-oauth-server.yml 和 lamp-gateway-server.yml 中这个配置必须一样
       jwtSignKey: 'lamp-cloud_is_a_fantastic_project'
   ```

   
