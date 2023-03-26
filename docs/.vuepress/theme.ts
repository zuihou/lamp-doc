import { getDirname, path } from "@vuepress/utils";
import { hopeTheme } from "vuepress-theme-hope";
import { zhNavbar } from "./navbar.js";
import { zhSidebar } from "./sidebar.js";

const __dirname = getDirname(import.meta.url);

export default hopeTheme({
  logo: "/images/logo.png",

  // 项目仓库地址
  repo: "https://github.com/dromara/lamp-cloud",

  // 编辑此页仓库地址
  docsRepo: "http://git.tangyh.top/zuihou/docs",
  docsBranch: 'dev',
  blog: {
    name: "lamp-cloud",
  },

  docsDir: "docs",

  copyright: "Apache-2.0 license | Copyright © 2017-2023-present zuihou",
  displayFooter: true,

  // pageInfo: false,

  // darkmode: "enable",
  themeColor: {
    blue: "#2196f3",
    red: "#f26d6d",
    green: "#3eaf7c",
    orange: "#fb9b5f",
  },

  fullscreen: true,

  iconAssets: "//at.alicdn.com/t/c/font_3976952_q2kdlqa3ryd.css",

  encrypt: {
    config: {
      // 这会加密整个 guide 目录，并且两个密码都是可用的
      // "/doc/info/": ["1234", "5678"],
      // 这只会加密 config/page.html
      // "/doc/info/如何高效提问.html": "1234",
    },
  },

  // outlookLocales: {
  //   themeColor: '主题色',
  //   darkmode: '外观',
  //   fullscreen: '全屏',
  // },
  locales: {
    "/": {
      footer:
        "主题使用 <a target='blank' href='https://theme-hope.vuejs.press/zh/'>vuepress-theme-hope</a>",

      navbar: zhNavbar,
      sidebar: zhSidebar,
    },
  },

  plugins: {
    // 复制页面文字时，版权信息
    copyright: {
      author: 'zui'
    },

    blog: {
      excerptLength: 0,
    },

    comment: {
      provider: "Giscus",
      comment: true,
      repo: "dromara/lamp-cloud",
      repoId: "MDEwOlJlcG9zaXRvcnkxMTc3NzQyOTA=",
      category: "企业版",
      categoryId: "DIC_kwDOBwUX0s4CVI47",
    },

    components: {
      components: ["Badge", "BiliBili", "SiteInfo"],
      rootComponents: {
        notice: [
          {
            path: "/",
            title: "将在新版本<b>2023.1.3</b>中推出",
            content:
              '<ul><li>重量级更新：团队协作</li></ul>',
            actions: [
              {
                text: "了解详情→",
                link: "/guide/history.html#_2023-1-3",
                type: "primary",
              },
            ],
            showOnce: true,
            key: "2023.1.3",
          }
        ],
      },
    },

    mdEnhance: {
      align: true,
      chart: true,
      codetabs: true,
      container: true,
      flowchart: true,
      imgLazyload: true,
      include: {
        resolvePath: (file) =>
          file.startsWith("@src")
            ? file.replace("@src", path.resolve(__dirname, ".."))
            : file,
      },
      mark: true,
      tasklist: true,
    },
  },
});
