import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  {
    text: "首页",
    link: "/",
    icon: "start1",
  },
  {
    text: "4.x文档",
    link: "/doc",
    icon: "featuresNew",
  },
  {
    text: "3.x文档",
    link: "https://www.kancloud.cn/zuihou/zuihou-admin-cloud",
    icon: "featuresNew",
  },
  {
    text: "企业授权",
    link: "/vip",
    icon: "code-box-fill",
  },
  {
    text: "在线演示",
    children:[
      {text: "4.x企业版(数据源模式)", link: "https://datasource.tangyh.top/"},
      {text: "4.x企业版(字段模式)", link: "https://column.tangyh.top/"},
      {text: "4.x企业版(非租户模式)", link: "https://none.tangyh.top/"},
      {text: "3.x企业版", link: "https://boot.tangyh.top/"},
      {text: "3.x开源版", link: "https://boot.tangyh.top/lamp-web/"}
    ]
  },
  {
    text: "升级日志",
    children:[
        "/upgrade/4.x版本升级日志",
        "/upgrade/3.x版本升级日志",
        "/upgrade/4.x功能蓝图",
    ]
  },
]);
