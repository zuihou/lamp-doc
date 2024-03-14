import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  {
    text: "首页",
    link: "/",
    icon: "start1",
  },
  {
    text: "企业版文档",
    link: "/doc/简介",
    icon: "featuresNew",
  },
  {
    text: "开源版文档",
    link: "/opendoc/简介",
    icon: "featuresNew",
  },
  {
    text: "3.x文档",
    link: "https://www.kancloud.cn/zuihou/zuihou-admin-cloud",
    icon: "featuresNew",
  },
  {
    text: "企业授权",
    link: "/vip/授权费用",
    icon: "code-box-fill",
  },
  {
    text: "在线演示",
    children:[
      {text: "数据源模式(企业版)", link: "https://datasource.tangyh.top/"},
      {text: "字段模式(企业版)", link: "https://column.tangyh.top/"},
      {text: "非租户模式(开源版)", link: "https://none.tangyh.top/"},
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
  {
    text: "历史文档",
    children:[
      { text: "4.17.0",link: "https://tangyh.top/4.17.0/" }
    ]
  },
  {
    text: "常见问题",
    link: "/doc/常见问题",
  },
]);
