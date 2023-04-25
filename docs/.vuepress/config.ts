import { defineUserConfig } from "vuepress";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import { getDirname, path } from "@vuepress/utils";
import theme from "./theme.js";

const __dirname = getDirname(import.meta.url);

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
    ["script", { src: "//at.alicdn.com/t/c/font_3976952_f9whvfsrm6l.js" }],
    ["script", { src: "/js/baidu.js" }],
    ["script", { src: "https://cdn.wwads.cn/js/makemoney.js", charset: "UTF-8" }],
    ["script", { src: "/js/ad-whitelist.js" }],
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


  alias: {
    "@theme-hope/components/HomePage": path.resolve(
        __dirname,
        "./components/HomePage.vue"
    ),
    "@theme-hope/components/NormalPage": path.resolve(
        __dirname,
        "./components/NormalPage.vue"
    ),
    "@theme-hope/modules/sidebar/components/Sidebar": path.resolve(
        __dirname,
        "./components/Sidebar.vue"
    ),
  },

  pagePatterns: ["**/*.md", "!*.snippet.md", "!.vuepress", "!node_modules"],
});
