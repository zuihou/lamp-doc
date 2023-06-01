---
title: AppLogo
index: false
category:
  - 前端
tag:
  - 前端
  - AppLogo
---

用于显示系统Logo

## 使用

```vue
<template>
  <div>
    <AppLogo :alwaysShowTitle="true" :applicationTitle="false" />
  </div>
</template>
<script>
  import { AppLogo } from '/@/components/Application';
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    components: { AppLogo },
    setup() {
      return {
      }
    }
  });
</script>
```

## Props

| 属性             | 类型      | 默认值  | 说明                             |
| ---------------- | --------- | ------- | -------------------------------- |
| theme            | `string`  | -       | 当前父组件的主题                 |
| showTitle        | `boolean` | `true`  | 是否显示标题                     |
| alwaysShowTitle  | `boolean` | `false` | 折叠菜单时也会显示标题           |
| applicationTitle | boolean   | true    | 显示为当前应用的名称【lamp扩展】 |
