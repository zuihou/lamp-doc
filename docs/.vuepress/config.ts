import { defineUserConfig } from "vuepress";
import { searchProPlugin } from "vuepress-plugin-search-pro";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  title: "灯灯",
  description: "微服务中后台快速开发平台",

  head: [
    [
      "link",
      {
        rel: "icon",
        // 谷歌浏览器 标题栏 icon
        href: "/images/logo.png",
      },
    ],
    ["script", { src: "//at.alicdn.com/t/c/font_3976952_jdnlf3brve.js" }],
    ["script", { src: "/js/baidu.js" }],
  ],

  markdown: {
    code: {
      lineNumbers: 10,
    },
  },

  locales: {
    "/": {
      lang: "zh-CN",
    },
  },

  theme,

  plugins: [
    searchProPlugin({
      indexContent: true,
      locales: {
        "/": {
          // 覆盖 placeholder
          placeholder: "开始搜索",
        },
      },
    }),
  ],

  pagePatterns: ["**/*.md", "!*.snippet.md", "!.vuepress", "!node_modules"],
});
