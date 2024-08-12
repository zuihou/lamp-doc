import { getDirname, path } from "@vuepress/utils";
import { hopeTheme } from "vuepress-theme-hope";
import { zhNavbar } from "./navbar.js";
import { zhSidebar } from "./sidebar.js";

const __dirname = getDirname(import.meta.url);

export const BASE : "/" | `/${string}/` = "/";

export default hopeTheme({
  logo: "/images/logo.png",

  // 项目仓库地址
  repo: "https://github.com/dromara/lamp-cloud",

  // 编辑此页仓库地址
  docsRepo: "http://github.com/zuihou/lamp-doc",
  docsBranch: 'master',
  docsDir: "docs",

  // 开启博客模式
  blog: {
    name: "lamp-cloud",
  },

  copyright: "Apache-2.0 license | Copyright © 2017-2023-present zuihou",
  displayFooter: true,


  // darkmode: "enable",
  fullscreen: true,

  iconAssets: "//at.alicdn.com/t/c/font_3976952_3dzhmey1f2e.css",

  encrypt: {
    config: {
      // 若你能看到这里且看懂这段配置，说明你是一个爱思考、爱探索的人，此文档就送你了。
      "/doc/util/": ["lampniubi"],
      "/doc/advanced/": ["lampniubi"],
      "/doc/deployment/": ["lampniubi"],
      "/doc/development/": ["lampniubi"],
      "/doc/front/": ["lampniubi"],
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

      navbar: zhNavbar(BASE),
      sidebar: zhSidebar,
      metaLocales: {
        lastUpdated: "上次编辑于",
      editLink: "此页有误，帮我改善此页",
    },
    },
  },

  plugins: {
    // 复制页面文字时，版权信息
    copyright: {
      author: '最后'
    },

    git: {
      createdTime: true,
      updatedTime: true,
      contributors: true,
    },

    // feed: {
    //   json: true
    // },

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
      category: "赞助版",
      categoryId: "DIC_kwDOBwUX0s4CVI47",
    },

    components: {
      components: ["Badge", "BiliBili", "SiteInfo"],
      rootComponents: {
        notice: [
          {
            path: "/",
            title: "<b>4.21.0-java17</b>已发布：",
            content:
              '<ul>' +
                '<li>适配sa-token</li>' +
                '<li>重构uri鉴权</li>' +
                '</ul>',
            actions: [
              {
                text: "了解详情→",
                link: "/upgrade/4.x版本升级日志.html",
                type: "primary",
              },
            ],
            showOnce: true,
            key: "4.14.3",
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
      presentation: true,
    },
  },

}, {
  custom: true,
});
