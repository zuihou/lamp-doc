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
  docsRepo: "http://github.com/zuihou/lamp-doc",
  docsBranch: 'dev',
  docsDir: "docs",

  // 开启博客模式
  blog: {
    name: "lamp-cloud",
  },

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

  iconAssets: "//at.alicdn.com/t/c/font_3976952_jdnlf3brve.css",

  encrypt: {
    config: {
      // 若你能看到这里且看懂这段配置，文档就当送你了。
      "/doc/util/": ["lampniubi"],
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
      author: '最后'
    },

    // git: true,

    blog: {
      excerptLength: 0,
    },
    // 代码复制
    copyCode: {
      showInMobile: true,
      duration: 1000
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
            title: "<b>4.13.0</b>即将发布：",
            content:
              '<ul>' +
                '<li>全新视频</li>' +
                '<li>全新文档</li>' +
                '</ul>',
            actions: [
              {
                text: "了解详情→",
                link: "/upgrade/4.x功能蓝图",
                type: "primary",
              },
            ],
            showOnce: true,
            key: "4.13.0",
          }
        ],
      },
    },

    mdEnhance: {
      align: true,
      chart: true,
      tabs: true,
      codetabs: true,
      container: true,
      mermaid: true,
      flowchart: true,
      // 启用 figure
      figure: true,
      // 启用图片懒加载
      imgLazyload: true,
      // 启用图片标记
      imgMark: true,
      // 启用图片大小
      imgSize: true,
      include: {
        resolvePath: (file) =>
          file.startsWith("@src")
            ? file.replace("@src", path.resolve(__dirname, ".."))
            : file,
      },
      demo: true,
      mark: true,
      footnote: true,
      tasklist: true,
      // 启用下角标功能
      sub: true,
      // 启用上角标
      sup: true,
    },
  },
});
