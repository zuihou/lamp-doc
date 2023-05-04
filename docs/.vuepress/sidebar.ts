import { sidebar } from "vuepress-theme-hope";

const COLLAPSIBLE = true;

export const zhSidebar = sidebar({
  "/en/": false,

  "/doc/": [
    "简介",
    "如何让作者积极帮助你",
    {
      text: "快速了解",
      icon: "lejie",
      prefix: "info/",
      collapsible: COLLAPSIBLE,
      children: [
        "功能介绍",
        "项目介绍",
        "架构介绍",
        "租户模式介绍",
        "3.x和4.x区别",
        "微服务版和单体版区别",
        "代码地址",
        "开发规范",
        "文档内容反馈",
        "视频软件下载",
      ],
    },
    {
      text: "快速启动",
      icon: "playcircle",
      prefix: "start/",
      collapsible: COLLAPSIBLE,
      children: [
        "服务介绍",
        "环境要求",
        "项目导入",
        "单机版Nacos启动",
        "集群版Nacos启动",
        "单机版Seata启动",
        {
          "text": "微服务版",
          collapsible: COLLAPSIBLE,
          prefix: "cloud/",
          "children": [
              "将配置文件导入Nacos",
              "后端启动",
              "前端启动",
              "模式区别",
          ]
        },
        {
          "text": "单体版",
          collapsible: COLLAPSIBLE,
          prefix: "boot/",
          "children": [
              "Nacos和Seata启动",
              "后端启动",
              "前端启动",
              "配置文件介绍",
          ]
        },
      ],
    },
    {
      text: "功能介绍",
      icon: "introduction",
      prefix: "intro/",
      collapsible: COLLAPSIBLE,
      children: [
        "概览",
        "登录",
        "注册",
        {
          "text": "开发运营系统",
          collapsible: COLLAPSIBLE,
          prefix: "devOperation/",
          "children": [
            {
              "text": "租户管理",
              prefix: "tenant/",
              collapsible: COLLAPSIBLE,
              "children": [
                "数据源维护",
                "租户维护",
                "用户维护",
              ]
            },
            {
              "text": "应用管理",
              prefix: "application/",
              collapsible: COLLAPSIBLE,
              "children": [
                "应用维护",
                "资源维护",
                "应用资源授权",
                "应用授权记录",
              ]
            },
            {
              "text": "系统管理",
              prefix: "system/",
              collapsible: COLLAPSIBLE,
              "children": [
                "字典维护",
                "参数维护",
                "地区维护",
                "客户端维护",
                "登录日志",
                "附件管理",
              ]
            },
            {
              "text": "开发者管理",
              prefix: "developer/",
              collapsible: COLLAPSIBLE,
              "children": [
                "代码生成",
                "项目生成",
                "开发示例",
                "其他",
              ]
            },
            {
              "text": "运维平台",
              prefix: "ops/",
              collapsible: COLLAPSIBLE,
              "children": [
                "接口管理",
                "接口日志",
                "消息模板",
              ]
            },
            "静态示例"
          ]
        },
        {
          "text": "基础平台",
          collapsible: COLLAPSIBLE,
          prefix: "basic/",
          "children": [
            "我的应用",
            {
              "text": "应用管理",
              prefix: "application/",
              collapsible: COLLAPSIBLE,
              "children": [
                "已购应用",
              ]
            },
            {
              "text": "消息中心",
              prefix: "msg/",
              collapsible: COLLAPSIBLE,
              "children": [
                "我的消息",
                "消息管理",
                "个性消息模板",
              ]
            },
            {
              "text": "用户中心",
              prefix: "user/",
              collapsible: COLLAPSIBLE,
              "children": [
                "员工维护",
                "组织机构",
                "岗位维护",
              ]
            },
            {
              "text": "基础配置",
              prefix: "base/",
              collapsible: COLLAPSIBLE,
              "children": [
                "个性字典",
                "个性参数",
              ]
            },
            {
              "text": "系统功能",
              prefix: "system/",
              collapsible: COLLAPSIBLE,
              "children": [
                "角色权限维护",
                "附件管理",
                "操作日志",
                "登录日志",
              ]
            },
            {
              "text": "工作流",
              prefix: "activiti/",
              collapsible: COLLAPSIBLE,
              "children": [
                "流程部署",
                "模型管理",
              ]
            },
            "我的企业",
          ]
        },
      ],
    },
    {
      text: "工具包",
      icon: "wrench",
      prefix: "util/",
      collapsible: COLLAPSIBLE,
      children: [
        "lamp-all",
        "lamp-annotation",
        "lamp-boot",
        "lamp-cache-starter",
        "lamp-cloud-starter",
        "lamp-core",
        "lamp-databases",
        "lamp-dozer-starter",
        "lamp-echo-starter",
        "lamp-jwt-starter",
        "lamp-log-starter",
        "lamp-mq-starter",
        "lamp-mvc",
        "lamp-parent",
        "lamp-scan-starter",
        "lamp-swagger2-starter",
        "lamp-uid",
        "lamp-validator-starter",
        "lamp-xss-starter"
      ],
    },
    {
      text: "开发进阶",
      icon: "code",
      prefix: "advanced/",
      collapsible: COLLAPSIBLE,
      children: [
        "表结构梳理",
        "项目结构",
        "依赖关系",
        "调用流程",
        {
          "text": "租户体系",
          collapsible: COLLAPSIBLE,
          prefix: "tenant/",
          "children": [
            "创建租户",
            "数据源模式",
            "字段模式",
            "常用配置",
            "常见问题",
          ]
        },
        {
          "text": "权限体系",
          collapsible: COLLAPSIBLE,
          prefix: "authority/",
          "children": [
            "权限模型",
            "配置应用",
            "配置菜单",
            "配置视图",
            "配置按钮",
            "配置字段",
            "配置数据",
          ]
        },
        {
          "text": "SpringBoot",
          collapsible: COLLAPSIBLE,
          prefix: "SpringBoot/",
          "children": [
            "跨域",
            "序列化与反序列化",
            "swagger",
            "参数校验",
            "分页",
            "全局返回",
            "全局异常",
            "系统日志"
          ]
        },
        "持久层",
      ],
    },
    "常见问题",
  ],
  "/upgrade/": [
    "4.x版本升级日志",
    "3.x版本升级日志",
    "4.x功能蓝图",
  ],
  "/vip/": [
    "授权费用",
    "交付物",
    "授权须知",
    "立即购买",
    "功能对比",
    "赏金猎人",
  ]
});
