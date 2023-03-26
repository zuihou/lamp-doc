import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  {
    text: "首页",
    link: "/",
    icon: "start1",
  },
  {
    text: "文档",
    link: "/doc",
    icon: "featuresNew",
  },
  {
    text: "常见问题",
    link: "/doc/常见问题",
    icon: "code-box-fill",
  },
  {
    text: "更多",
    children:["/doc/link"]
  },
]);
