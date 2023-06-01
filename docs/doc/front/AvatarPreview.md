---
title: AvatarPreview
index: false
category:
  - 前端
tag:
  - 前端
  - AvatarPreview
---

预览头像，该组件完全是lamp新增的，vben官方没有。

## 使用

```vue
<template>
  <div>
    <AvatarPreview
      :errorTxt="getUserInfo?.nickName?.substring(0, 1)"
      :fileId="getUserInfo?.avatarId"
      :isDef="true"
      :style="{ 'margin-right': '0.5rem' }"
    />
  </div>
</template>
<script>
  import { AvatarPreview } from '/@/components/AvatarPreview';
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    components: { AvatarPreview },
    setup() {
      return {
      }
    }
  });
</script>
```

## Props

| 属性     | 类型     | 默认值 | 说明                                      |
| -------- | -------- | ------ | ----------------------------------------- |
| src      | `string` | ‘’     | 图片地址。必须以http开头或data:开头       |
| fileId   | `string` | ‘’     | 附件ID。 com_file表的id                   |
| errorTxt | `string` | ‘’     | 通过src或fileId无法显示图片时，显示的文本 |
| isDef    | boolean  | false  | 时候查询                                  |
