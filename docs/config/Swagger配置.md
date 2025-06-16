---
title: Swagger配置
icon: wendang
order: 2
category:
  - 配置 
  - 公共配置
tag:
  - Swagger配置
---

- lamp.swagger 前缀参考： SwaggerProperties
- knife4j 前缀参考：Knife4jProperties
- springdoc 前缀参考：SpringDocConfigProperties

```yaml
# 灯灯 自定义配置
lamp:
  swagger:
    # 标题
    title: 在线文档
    # 描述
    description: lamp-cloud 在线文档
    # 许可证
    license: Powered By zuihou
    # 许可证URL
    licenseUrl: https://github.com/zuihou
    # 服务条款URL
    termsOfServiceUrl: https://github.com/zuihou
    # 版本
    version: '@project.version@'
    contact: # 联系人信息
      url: https://github.com/zuihou
      name: zuihou
      email: 306479353@qq.com
    global-operation-parameters: # 全局参数
      - name: Token
        description: 用户信息
        modelRef: String
        parameterType: header
        required: true
        # 默认值只是方便本地开发时，少填参数，生产环境请禁用swagger或者禁用默认参数
        defaultValue: "xxx"
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


# knife4j 文档通用配置 详情看: Knife4jProperties
knife4j:
  enable: true
  # 是否生产环境，设置为true将无法访问文档
  production: false
  setting:
    # 默认语言
    language: zh_cn
    # 重命名 Swagger 模型名称
    swagger-model-name: 实体类列表
    #     是否在每个Debug调试栏后显示刷新变量按钮,默认不显示
    enableReloadCacheParameter: true
    #    是否开启界面中对某接口的版本控制,如果开启，后端变化后Ui界面会存在小蓝点
    enableVersion: true
    #    针对RequestMapping的接口请求类型,在不指定参数类型的情况下,如果不过滤,默认会显示7个类型的接口地址参数,如果开启此配置,默认展示一个Post类型的接口地址
    enableFilterMultipartApis: false
    #    是否开启动态参数调试功能
    enableDynamicParameter: true
    #    是否显示Footer
    enableFooter: false
    # 自定义页面尾部
    enableFooterCustom: true
    # 页面尾部内容
    footerCustomContent: Apache License 2.0 | Copyright  2020 [lamp-cloud](https://github.com/zuihou)



springdoc:
  # 默认是false，需要设置为true
  default-flat-param-object: true
  swagger-ui:
    path: /swagger-ui.html
    tags-sorter: alpha
    operations-sorter: alpha
    enabled: ${knife4j.enable}
  api-docs:
    enabled: ${knife4j.enable}
    path: /v3/api-docs
  group-configs:
    # @lamp.generator auto insert springdoc.groupconfigs
    - group: 'oauth_auth'
      displayName: '认证服务'
      paths-to-match: '/**'
      packages-to-scan: top.tangyh.lamp.oauth
    - group: 'base_base'
      displayName: 'base-基础模块'
      paths-to-match: '/**'
      packages-to-scan: top.tangyh.lamp.base
    - group: 'base_file'
      paths-to-match: '/**'
      displayName: 'base-文件模块'
      packages-to-scan: top.tangyh.lamp.file
    - group: 'base_msg'
      paths-to-match: '/**'
      displayName: 'base-消息模块'
      packages-to-scan:
        - top.tangyh.lamp.msg
        - top.tangyh.lamp.sms
    - group: 'system'
      displayName: '系统管理'
      paths-to-match: '/**'
      packages-to-scan: top.tangyh.lamp.system.controller
    - group: 'generator'
      displayName: '代码生成器'
      paths-to-match: '/**'
      packages-to-scan:
        - top.tangyh.lamp.generator
        - top.tangyh.lamp.test.controller
    - group: 'sop'
      displayName: '开放平台'
      paths-to-match: '/**'
      packages-to-scan: top.tangyh.lamp.sop.controller
```

