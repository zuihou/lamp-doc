import { defineUserConfig } from "vuepress";
import { docsearchPlugin } from "@vuepress/plugin-docsearch";
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
    ["script", { src: "//at.alicdn.com/t/c/font_3976952_q2kdlqa3ryd.js" }],
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
    docsearchPlugin({
      appId: "8FRYEU6KK8",
      apiKey: "84f513df1e83406ba42179da778d87b4",
      indexName: "dromara-lamp-cloud",
      locales: {
        "/": {
          placeholder: "搜索文档",
          translations: {
            button: {
              buttonText: "搜索文档",
            },
          },
        },
        "/en": {
          placeholder: "Search Documentation",
          translations: {
            button: {
              buttonText: "Search Documentation",
            },
          },
        },
      },
    }),
  ],

  pagePatterns: ["**/*.md", "!*.snippet.md", "!.vuepress", "!node_modules"],
});
