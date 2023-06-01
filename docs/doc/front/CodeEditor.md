---
title: CodeEditor
index: false
category:
  - 前端
tag:
  - 前端
  - CodeEditor
---

vben作者原本在该模块下封装了2个组件：`JsonPreview`和`CodeMirror`。 

## CodeMirror

该组件的功能是在线代码编辑器，lamp已将CodeMirror组件删除，并将`codemirror`组件的依赖由`5.x` 升级到 `6.x`。

6.x的`codemirror`官方已经提供了vue版本的封装`vue-codemirror`，无需再次做无用的封装。所以在项目中需要使用`codemirror`来实现==在线代码编辑器==功能时，直接使用vue-codemirror即可。



## JsonPreview

json预览器，vben作者只是对`vue-json-pretty`做了及其简单的封装，若你有一些特殊需求，完全可以直接在业务代码中直接使用`vue-json-pretty`组件。