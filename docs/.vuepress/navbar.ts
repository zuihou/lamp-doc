import { navbar, NavbarOptions } from "vuepress-theme-hope";
export function zhNavbar(base: string) {
  const flag = base === "/";
  const list: NavbarOptions = [
    {
      text: "首页",
      link: "/",
      icon: "start1",
    },
    {
      text: "赞助版文档",
      link: "/doc/简介",
      icon: "featuresNew",
    },
    {
      text: "开源版文档",
      link: "/opendoc/简介",
      icon: "featuresNew",
    },
  ];
  if (flag) {
    list.push({ text: "立即获取", link: "/vip/如何赞助", icon: "code-box-fill" });
  }
  list.push({
    text: "在线演示",
    children:[
      {text: "赞助版数据源模式(vben)", link: "https://datasource.tangyh.top/"},
      {text: "赞助版字段模式(vben)", link: "https://column.tangyh.top/"},
      {text: "赞助版数据源模式(soybean)", link: "https://soy-datasource.tangyh.top/"},
      {text: "赞助版字段模式(soybean)", link: "https://soy-column.tangyh.top/"},
      {text: "开源版非租户模式(vben)", link: "https://none.tangyh.top/"},
    ]
  });
  if (flag) {
    list.push({
      text: "升级日志",
      children:[
        "/upgrade/4.x版本升级日志",
        "/upgrade/3.x版本升级日志",
        "/upgrade/4.x功能蓝图" ]
    });
  }
  list.push({
    text: "历史文档",
    children:[
      { text: "最新文档", link: "https://tangyh.top" },
      { text: "4.20.0", link: "https://tangyh.top/4.20.0/" },
      { text: "4.19.0", link: "https://tangyh.top/4.19.0/" },
      { text: "4.18.0", link: "https://tangyh.top/4.18.0/" },
      { text: "4.17.0", link: "https://tangyh.top/4.17.0/" },
      { text: "3.x", link: "https://www.kancloud.cn/zuihou/zuihou-admin-cloud" }
    ]
  });
  if (flag) {
    list.push({ text: "常见问题", link: "/doc/常见问题" });
  }
  return navbar(list);
}
