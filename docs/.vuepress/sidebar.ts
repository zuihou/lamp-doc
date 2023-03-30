import { sidebar } from "vuepress-theme-hope";


export const zhSidebar = sidebar({
  "/en/": false,

  "/doc/": [
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
          "text": "微服务数据源模式",
          collapsible: true,
          prefix: "lamp-cloud-pro-datasource-column/",
          "children": [
              "将配置文件导入Nacos",
              "后端启动",
              "前端启动",
              "模式区别",
          ]
        },
        {
          "text": "单体数据源模式",
          collapsible: true,
          prefix: "lamp-boot-pro-datasource-column/",
          "children": [
              "Nacos和Seata启动",
              "后端启动",
              "前端启动",
              "配置文件介绍",
              "微服务和单体区别",
          ]
        },
        {
          "text": "微服务字段模式",
          collapsible: true,
          prefix: "lamp-cloud-pro-column/",
          "children": [
              "将配置文件导入Nacos",
              "后端启动",
              "前端启动"
          ]
        },
        {
          "text": "单体字段模式",
          collapsible: true,
          prefix: "lamp-boot-pro-column/",
          "children": [
              "后端启动",
              "后端启动",
              "前端启动",
              "配置文件介绍",
              "微服务和单体区别",
          ]
        },
        {
          "text": "微服务非租户模式",
          collapsible: true,
          prefix: "lamp-cloud-pro-none/",
          "children": [
              "将配置文件导入Nacos",
              "后端启动",
              "前端启动",
          ]
        },
        {
          "text": "单体非租户模式",
          collapsible: true,
          prefix: "lamp-boot-pro-none/",
          "children": [
              "后端启动",
              "前端启动",
          ]
        },
      ],
    },
  ],
});
