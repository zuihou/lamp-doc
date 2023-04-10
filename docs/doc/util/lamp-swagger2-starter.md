---
title: lamp-swagger2-starter
icon: wendang
index: false
category:
  - 工具类
tag:
  - 工具类
  - lamp-swagger2-starter
---

本模块只是对springfox、swagger、knife4j的增强, 并没有修改他们的原生使用方式. 可以调整下面的配置来满足项目在线文档的不同需求

```yaml
lamp: 
  swagger:
    # 许可证
    license: Powered By zuihou
    licenseUrl: https://github.com/zuihou
    # 服务条款
    termsOfServiceUrl: https://github.com/zuihou
  	# 文档版本
    version: 4.13.0
  	# 文档联系人信息
    contact:
      url: https://github.com/zuihou
      name: zuiou
      email: 306479353@qq.com
    # 全局请求参数
    global-operation-parameters: 
      - name: Token   # 参数名
        description: 用户身份token  # 参数描述
        modelRef: String     # 参数字段类型
        parameterType: header  # 参数类型   请求头还是普通参数
        required: true  # 是否必填
        defaultValue: "test"  #默认值
      - name: Authorization
        description: 客户端信息
        modelRef: String
        parameterType: header
        required: true
        defaultValue: "bGFtcF93ZWI6bGFtcF93ZWJfc2VjcmV0"
      - name: TenantId
        description: 租户编码
        modelRef: String
        parameterType: header
        required: true
        defaultValue: "1"
    docket:
      # group 1
      common:
        # 标题
        title: 公共模块
        # 该group 扫描的包
        base-package: top.tangyh.lamp.authority.controller.common
      core:
        title: 组织模块
        # 该group 扫描的包, 支持 ; 号分割多个包
        base-package: top.tangyh.lamp.authority.controller.core;top.tangyh.lamp.authority.controller.auth
    # 鉴权信息
    authorization: 
      name:  # 鉴权策略ID，需要和SecurityReferences ID保持一致
      authRegex:   # 需要开启鉴权URL的正则
      authorizationScopeList:   # 鉴权作用域列表
        - scope:  #作用域
          description: # 描述
      tokenUrlList:   
    apiKeys:
      - name:
        keyname:
        passAs: 
    # 包含路径
    incluedPath:
    # 排除路径
    excludePath: 
   

# knife4j 官方的 全局配置, 参考knife4j官方文档
knife4j:
  enable: true
  setting:
    enableReloadCacheParameter: true
    enableVersion: true
    enableDynamicParameter: true
    enableFooter: false
    enableFooterCustom: true
    footerCustomContent: Apache License 2.0 | Copyright 2020 [lamp-cloud](https://github.com/zuihou)
```



通常情况下，在common.yml中配置全局信息，在单个服务中，配置这个服务需要扫描那些包即可

::: code-tabs

@tab common.yml

```yaml
lamp:
	swagger:  # 详情看: SwaggerProperties
    license: Powered By zuihou
    licenseUrl: https://github.com/zuihou
    termsOfServiceUrl: https://github.com/zuihou
    contact:  # 联系人信息
      url: https://github.com/zuihou
      name: zuiou
      email: 306479353@qq.com
    global-operation-parameters:  # 全局参数
      - name: Token
        description: 用户信息
        modelRef: String
        parameterType: header
        required: true
        # 默认值只是方便本地开发时，少填参数，生产环境请禁用swagger或者禁用默认参数
        defaultValue: "test"
      - name: Authorization
        description: 客户端信息
        modelRef: String
        parameterType: header
        required: true
        defaultValue: "bGFtcF93ZWI6bGFtcF93ZWJfc2VjcmV0"
      - name: TenantId
        description: 租户ID
        modelRef: String
        parameterType: header
        required: true
        defaultValue: "1"
      - name: ApplicationId
        description: 应用ID
        modelRef: String
        parameterType: header
        required: true
        defaultValue: "1"
```

@tab lamp-base-server.yml

```yaml
lamp:
  swagger:
    enabled: true
    docket:
    	# 分组1
      common:
        title: 基础服务-公共模块
        base-package: top.tangyh.lamp.base.controller.common
      # 分组2  
      user:
        title: 基础服务-用户模块
        base-package: top.tangyh.lamp.base.controller.user
      # 分组3  
      system:
        title: 基础服务-系统模块
        base-package: top.tangyh.lamp.base.controller.system
      # 分组4        
      file:
        title: 基础服务-文件模块
        base-package: top.tangyh.lamp.file.controller
      # 分组5        
      msg:
        title: 基础服务-消息模块
        base-package: top.tangyh.lamp.msg.controller;top.tangyh.lamp.sms.controller        
```

@tab lamp-oauth-server.yml

```yaml
lamp:
  swagger:
  	# 默认分组
    title: 认证服务
    base-package: top.tangyh.lamp
```

:::



按上面的方式配置后，lamp-base-server 会将lamp-base-server.yml、common.yml 的配置合并， lamp-oauth-server会将lamp-oauth-server.yml、common.yml的配置合并，最终lamp-base-server的swagger文档中会生成 5个group、lamp-oauth-server的swagger文档只有1个分组。
