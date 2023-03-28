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
      ],
    },
  ],
});
