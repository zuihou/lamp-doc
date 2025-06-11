import { sidebar } from "vuepress-theme-hope";

const COLLAPSIBLE = true;

export const zhSidebar = sidebar({
  "/en/": false,

  "/doc/": [
    "简介",
    "概念解释",
    "如何让作者积极帮助你",
    {
      text: "快速了解",
      icon: "lejie",
      prefix: "info/",
      collapsible: COLLAPSIBLE,
      children: [
        "同步代码",
        "功能介绍",
        "项目介绍",
        "架构介绍",
        "租户模式介绍",
        "3.x和4.x区别",
        "4.x和5.x区别",
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
        {
          "text": "中间件启动",
          collapsible: COLLAPSIBLE,
          prefix: "middleware/",
          "children": [
            "单机版Nacos启动",
            "集群版Nacos启动",
            "单机版Seata启动",
          ]
        },
        {
          "text": "后端(微服务模式)",
          collapsible: COLLAPSIBLE,
          prefix: "cloud/",
          "children": [
              "将配置文件导入Nacos",
              "后端启动",
              "模式区别",
          ]
        },
        {
          "text": "后端(单体模式)",
          collapsible: COLLAPSIBLE,
          prefix: "boot/",
          "children": [
              "Nacos和Seata启动",
              "后端启动",
              "配置文件介绍",
          ]
        },
        {
          "text": "前端",
          collapsible: COLLAPSIBLE,
          prefix: "front/",
          "children": [
              "前端启动_vben5",
              "前端启动",
              "前端启动_soybean",
          ]
        },
        {
          "text": "定时任务",
          collapsible: COLLAPSIBLE,
          prefix: "job/",
          "children": [
              "调度器启动",
              "执行器启动",
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
      text: "开始开发",
      icon: "kuaisukaifa-05",
      prefix: "development/",
      collapsible: COLLAPSIBLE,
      children: [
        "新建应用",
        "新建服务",
        "新建表",
        "生成代码",
        "重写代码",
        "定时任务",
        "配置文件",
        "分布式事务",
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
        "lamp-echo-starter",
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
      text: "开放平台",
      icon: "wrench",
      prefix: "open/",
      collapsible: COLLAPSIBLE,
      children: [
        "简介",
        "接口接入开放平台",
        "生成开放文档",
        "sdk封装",
        {
          "text": "开放平台进阶",
          collapsible: COLLAPSIBLE,
          icon: "wendang",
          prefix: "advanced/",
          "children": [
              "公共参数",
              "签名算法",
              "获取上下文信息",
              "文件上传下载",
              "网关配置",
          ]
        }
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
        {
          "text": "SpringCloud",
          collapsible: COLLAPSIBLE,
          prefix: "SpringCloud/",
          "children": [
            "FeignClient",
            "灰度发布"
          ]
        },
        "持久层",
        "缓存",
        "文件存储",
        "消息发送",
        "如何同步最新代码",
      ],
    },
    {
      text: "前端（vben2.x版）",
      icon: "antdesign",
      prefix: "front/",
      collapsible: COLLAPSIBLE,
      children: [
        "介绍",
        "BasicTitle",
        "AppLogo",
        "Authority",
        "AvatarPreview",
        "CodeEditor",
        "Cropper",
        "Form",
        "Upload",
        "Axios",
        "默认参数",
        "配置项",
      ],
    },
    {
      text: "部署",
      icon: "deploymentunit",
      prefix: "deployment/",
      collapsible: COLLAPSIBLE,
      children: [
        "基础安装",
        "安装Docker",
        "Mysql",
        "Redis",
        "Nacos",
        "Seata",
        "Nginx",
        "MinIO",
        "FastDFS",
        "SkyWalking",
        "手动部署",
        "docker部署",
        "Jenkins",
        "Jenkins部署",
        "阿里云云效部署",
        "上线必看",
      ],
    },
    "常见问题",
  ],
  "/opendoc/": [
    "简介",
    {
      text: "快速启动",
      icon: "playcircle",
      prefix: "start/",
      collapsible: COLLAPSIBLE,
      children: [
        "项目导入",
        "单机版Nacos启动",
        {
          "text": "微服务版",
          collapsible: COLLAPSIBLE,
          prefix: "cloud/",
          "children": [
            "将配置文件导入Nacos",
            "后端启动",
            "前端启动",
          ]
        },
        {
          "text": "单体版",
          collapsible: COLLAPSIBLE,
          prefix: "boot/",
          "children": [
            "后端启动",
            "前端启动",
            "配置文件介绍",
          ]
        },
      ],
    },
  ],
  "/upgrade/": [
    "5.x版本升级日志",
    "4.x版本升级日志",
    "3.x版本升级日志",
    "功能蓝图",
  ],
  "/vip/": [
    "如何赞助",
    "交付物",
    "赞助须知",
    "立即赞助",
    "功能对比",
    "广告位",
    "赏金猎人",
  ]
});
