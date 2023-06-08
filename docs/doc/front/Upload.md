---
title: Upload
index: false
category:
  - 前端
tag:
  - 前端
  - Upload
---

## Upload

文件上传组件

### 使用

```vue
<template>
  <BasicUpload :maxSize="20" :maxNumber="10" @change="handleChange" :api="uploadApi" />
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicUpload } from '/@/components/Upload';
  import { uploadApi } from '/@/api/sys/upload';

  export default defineComponent({
    components: { BasicUpload },
    setup() {
      return {
        uploadApi,
        handleChange: (list: string[]) => {
          createMessage.info(`已上传文件${JSON.stringify(list)}`);
        },
      };
    },
  });
</script>
```

### Props

| 属性              | 类型       | 默认值   | 可选值 | 说明                                                         |
| ----------------- | ---------- | -------- | ------ | ------------------------------------------------------------ |
| value             | `string[]` | -        | -      | 已上传的文件列表，支持v-model                                |
| showPreviewNumber | `boolean`  | true     | -      | 是否显示预览数量                                             |
| emptyHidePreview  | `boolean`  | false    | -      | 没有上传文件时是否隐藏预览                                   |
| helpText          | `string`   | -        | -      | 帮助文本                                                     |
| maxSize           | `number`   | 2        | -      | 单个文件最大体积，单位 M                                     |
| maxNumber         | `number`   | Infinity | -      | 最大上传数量，Infinity 则不限制                              |
| accept            | `string[]` | -        | -      | 限制上传格式，可使用文件后缀名(点号可选)或MIME字符串。例如 `['.doc,','docx','application/msword','image/*']` |
| multiple          | `boolean`  | -        | -      | 开启多文件上传                                               |
| uploadParams      | `any`      | -        | -      | 上传携带的参数                                               |
| api               | `Fn`       | -        | -      | 上传接口，为上面配置的接口                                   |
| showPreviewButton | `boolean`  | true     | -      | 【lamp扩展】是否显示预览按钮                                 |
| isDef             | `boolean`  | false    | -      | 【lamp扩展】是否从默认库查询附件. 若api不为空，优先从传入的api中查询；没有传递api，则根据此参数，从内置接口查询 |

### Events

| 事件           | 回调参数             | 返回值 | 说明                                 | 版本  |
| -------------- | -------------------- | ------ | ------------------------------------ | ----- |
| change         | `(fileList)=>void`   |        | 文件列表内容改变触发事件             |       |
| delete         | `(record)=>void`     |        | 在上传列表中删除文件的事件           |       |
| preview-delete | `(url:string)=>void` |        | 在预览列表中删除文件的事件           | 2.5.3 |
| update:value   | `(fileList)=>void`   |        | 【lamp扩展】文件列表内容改变触发事件 |       |



## ThumbUrl

缩略图预览组件

### 使用

```vue
<template>
  <ThumbUrl
    fileId="123"
    fileType="IMAGE"
    imageStyle="{ 'max-height': '104px' }"
    originalFileName="文件名称.md"
  />
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import ThumbUrl from '/@/components/Upload/src/ThumbUrl.vue';

  export default defineComponent({
    components: { ThumbUrl },
    setup() {
      return {
        
      };
    },
  });
</script>
```

### Props

| 属性             | 类型             | 默认值 | 可选值 | 说明                                  |
| ---------------- | ---------------- | ------ | ------ | ------------------------------------- |
| fileUrl          | `string`         | -      | -      | 【lamp扩展】文件预览链接              |
| fileId           | `string`         | -      | -      | 【lamp扩展】文件ID                    |
| width            | `number｜string` | 104    | -      | 【lamp扩展】缩略图宽度                |
| height           | `number｜string` | 104    | -      | 【lamp扩展】缩略图高度                |
| fileType         | `string`         | IMAGE  | -      | 【lamp扩展】预览文件的类型            |
| imageStyle       | `{}`             |        | -      | 【lamp扩展】图片样式                  |
| originalFileName | `string`         | -      | -      | 【lamp扩展】文件原始名称              |
| preview          | `boolean`        | True   | -      | 【lamp扩展】是否支持预览              |
| placeholder      | `boolean`        | -      | -      | 【lamp扩展】                          |
| fallback         | `string`         | Erring | -      | 【lamp扩展】预览失败时显示的图片      |
| isDef            | `boolean`        | False  | -      | 【lamp扩展】api接口是否查询默认库     |
| api              | `Function`       |        | -      | 【lamp扩展】调用后台回显接口的API地址 |