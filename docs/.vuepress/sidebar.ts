import { sidebar } from "vuepress-theme-hope";


export const zhSidebar = sidebar({
  "/en/": false,

  "/doc/": [
    "简介",
    {
      text: "快速了解",
      icon: "leibie",
      prefix: "info/",
      collapsible: true,
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
      icon: "featuresNew",
      prefix: "start/",
      collapsible: true,
      children: [
        "如何高效提问",
        "服务介绍",
        "环境要求",
        "项目导入",
        "单机版Nacos启动",
        "集群版Nacos启动",
        "单机版Seata启动",
        {
          "text": "微服务版",
          collapsible: true,
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
          collapsible: true,
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
      collapsible: true,
      children: [
        "登录",
        "注册",
        {
          "text": "开发运营系统",
          collapsible: true,
          prefix: "devOperation/",
          "children": [
            {
              "text": "租户管理",
              prefix: "tenant/",
              "children": [
                "数据源维护",
                "租户维护",
                "用户维护",
              ]
            },
            {
              "text": "应用管理",
              prefix: "application/",
              "children": [
                "应用维护",
                "资源维护",
                "应用授权管理",
                "应用授权记录",
              ]
            },
            {
              "text": "系统管理",
              prefix: "system/",
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
          collapsible: true,
          prefix: "basic/",
          "children": [
            "我的应用",
            {
              "text": "应用管理",
              prefix: "application/",
              "children": [
                "已购应用",
              ]
            },
            {
              "text": "消息中心",
              prefix: "msg/",
              "children": [
                "我的消息",
                "消息管理",
                "个性消息模板",
              ]
            },
            {
              "text": "用户中心",
              prefix: "user/",
              "children": [
                "员工维护",
                "组织机构",
                "岗位维护",
              ]
            },
            {
              "text": "基础配置",
              prefix: "base/",
              "children": [
                "个性字典",
                "个性参数",
              ]
            },
            {
              "text": "系统功能",
              prefix: "system/",
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
              "children": [
                "流程管理",
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
      icon: "featuresNew",
      prefix: "util/",
      collapsible: true,
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
