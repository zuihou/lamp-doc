---
title: BasicTitle
index: false
category:
  - 前端
tag:
  - 前端
  - BasicTitle
---

用于显示标题，可以显示帮助按钮及文本

## 使用

```vue{4-6,22-27}
<template>
  <div>
    <!-- 直接使用 -->
    <BasicTitle helpMessage="提示1">标题</BasicTitle>
    <BasicTitle :helpMessage="['提示1', '提示2']">标题</BasicTitle>
    <BasicTitle span line noneSelect dashed style="margin-bottom: 1rem">字典</BasicTitle>
    
    <!-- 在BasicForm中使用 -->
    <BasicForm @register="registerForm" />
  </div>
</template>
<script>
  import { BasicTitle } from '/@/components/Basic/index';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { defineComponent } from 'vue';
  
  export const editFormSchema = (): FormSchema[] => {
  return [
    {
      field: 'divider-selects1',
      label: 'lamp-cloud/lamp-boot 配置',
      component: 'BasicTitle',
      componentProps: {
        line: true,
        span: true,
        //noneSelect: true,
        //dashed: true
      },
      colProps: {
        span: 24,
      },
    },
    ]
  }
  export default defineComponent({
    components: { BasicTitle, BasicForm },
    setup() {
      const [registerForm] = useForm({
        labelWidth: 120,
        schemas: editFormSchema(),
        name: 'project',
        showActionButtonGroup: false,
        baseColProps: { span: 12 },
        actionColOptions: {
          span: 23,
        },
      });
      
      return {
        registerForm
      }
    }
  });
</script>
```

## Props

| 属性        | 类型               | 默认值  | 说明                               |
| ----------- | ------------------ | ------- | ---------------------------------- |
| helpMessage | `string｜string[]` | -       | 标题右侧帮助按钮信息               |
| span        | `boolean`          | `false` | 是否显示标题左侧蓝色色块           |
| normal      | `boolean`          | `true`  | 文字不加粗                         |
| line        | boolean            | false   | 是否显示底部线条【lamp扩展】       |
| dashed      | boolean            | false   | 底部线条是否虚线【lamp扩展】       |
| cursor      | boolean            | false   | 鼠标移上去是否显示光标【lamp扩展】 |
| noneSelect  | boolean            | false   | 是否不能选择【lamp扩展】           |

## Slots

| 名称    | 说明     |
| ------- | -------- |
| default | 标题文本 |