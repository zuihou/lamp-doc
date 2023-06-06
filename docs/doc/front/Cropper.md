---
title: Cropper
index: false
category:
  - 前端
tag:
  - 前端
  - Cropper
---

## CropperImage

图片裁剪组件

### Usage

```vue
<template>
  <CropperImage ref="refCropper" :src="img" @cropend="handleCropend" style="width: 40vw" />
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { CropperImage } from '/@/components/Cropper';
  import img from '/@/assets/images/header.jpg';

  export default defineComponent({
    components: {
      CropperImage,
    },
    setup() {
      const info = ref('');
      const cropperImg = ref('');

      function handleCropend({ imgBase64, imgInfo }) {
        info.value = imgInfo;
        cropperImg.value = imgBase64;
      }

      return {
        img,
        info,
        cropperImg,
        handleCropend,
      };
    },
  });
</script>
```

### Props

| 属性            | 类型      | 默认值           | 说明             |
| --------------- | --------- | ---------------- | ---------------- |
| src             | `string`  | -                | 图片源           |
| alt             | `string`  | -                | 图片 alt         |
| circled         | `boolean` | `false`          | 圆形裁剪框       |
| realTimePreview | `boolean` | `true`           | 实时触发预览     |
| height          | `string`  | `360px`          | 高度             |
| crossorigin     | `string`  | -                | crossorigin      |
| imageStyle      | `object`  | ``               | 图片样式         |
| options         | `object`  | `DefaultOptions` | corpperjs 配置项 |

#### DefaultOptions

```json
{
  aspectRatio: 1,
  zoomable: true,
  zoomOnTouch: true,
  zoomOnWheel: true,
  cropBoxMovable: true,
  cropBoxResizable: true,
  toggleDragModeOnDblclick: true,
  autoCrop: true,
  background: true,
  highlight: true,
  center: true,
  responsive: true,
  restore: true,
  checkCrossOrigin: true,
  checkOrientation: true,
  scalable: true,
  modal: true,
  guides: true,
  movable: true,
  rotatable: true,
}
```



## CropperAvatar

头像裁剪组件

### Usage

```vue
<template>
  <CropperAvatar :uploadApi="uploadApi" />
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { CropperAvatar } from '/@/components/Cropper';
  import { uploadApi } from '/@/api/sys/upload';

  export default defineComponent({
    components: {
      CropperAvatar,
    },
  });
</script>
```

### Props

| 属性      | 类型                                              | 默认值  | 说明                  | 版本  |
| --------- | ------------------------------------------------- | ------- | --------------------- | ----- |
| width     | `string,number`                                   | `200px` | 图片源                |       |
| uploadApi | `({ file: Blob, name: string }) => Promise<void>` | -       | 图片上传接口          |       |
| value     | `String`                                          | -      | 回显值 | 2.5.3 |
| showBtn   | `Boolean`                                         | true    | 是否显示按钮          | 2.5.3 |
| btnText   | `String`                                          | -       | 按钮文案              | 2.5.3 |
| btnProps  | `ButtonProps`                                     | -       | 按钮的其它属性        | 2.5.3 |
| alt       | `String` |         | 【lamp扩展】鼠标移上去显示的文字 |       |
| circled   | `Boolean` |         | 【lamp扩展】圆形裁剪框 |       |
| isDef     | `Boolean` |         | 【lamp扩展】是否上传到到默认库。 设置为true，文件将调用 asyncFindDefUrlById 加载异步文件 |       |
| uploadParams | `Object` |         | 【lamp扩展】调用uploadApi接口时传递的参数 |       |


### Events

| 名称         | 参数                 | 说明                 | 版本  |
| ------------ | -------------------- | -------------------- | ----- |
| change       | `data: FileResultVO` | 当头像上传完成时触发 | 2.5.3 |
| update:value | `data: FileResultVO` | 当头像上传完成时触发 |       |



### Methods

| 名称       | 定义       | 说明          | 版本  |
| ---------- | ---------- | ------------- | ----- |
| openModal  | `()=>void` | 打开上传Modal | 2.5.3 |
| closeModal | `()=>void` | 关闭上传Modal | 2.5.3 |