---
title: Authority
index: false
category:
  - 前端
tag:
  - 前端
  - Authority
---

用于项目权限的组件，一般用于按钮级等细粒度权限管理

## 使用

```vue
<template>
  <div>
    <Authority :value="RoleEnum.ADMIN" mode="PermModeEnum.Has">
      <a-button type="primary" block> 只有admin角色可见 </a-button>
    </Authority>
    
    <Authority :value="['add', 'edit']" mode="PermModeEnum.Has">
      <a-button type="primary" block> 必须同时拥有 add、edit权限可见 </a-button>
    </Authority>
  </div>
</template>
<script>
  import { Authority } from '/@/components/Authority';
  import { PermModeEnum, RoleEnum } from '/@/enums/roleEnum';
  import { defineComponent } from 'vue';
  export default defineComponent({
    components: { Authority },
  });
</script>
```

## Props

| 属性  | 类型                                  | 默认值           | 说明                                     |
| ----- | ------------------------------------- | ---------------- | ---------------------------------------- |
| value | `RoleEnum,RoleEnum[],string,string[]` | -                | 角色信息或者权限编码。会自动区分权限模式 |
| mode  | `PermModeEnum`                        | PermModeEnum.Has | 权限模式【lamp扩展】                     |



## 类型

::: code-tabs

@tab PermModeEnum

```tsx
export enum PermModeEnum {
  // 拥有所有
  Has = 'Has',
  // 拥有任意一个
  HasAny = 'HasAny',
  // 没有所有
  Without = 'Without',
  // 没有任意一个
  WithoutAny = 'WithoutAny',
}
```

@tab RoleEnum

```tsx
export enum RoleEnum {
  // super admin
  SUPER = 'super',

  // 数据源维护
  TENANT_DATASOURCE_CONFIG_ADD = 'tenant:tenant:datasourceConfig:add',
  TENANT_DATASOURCE_CONFIG_EDIT = 'tenant:tenant:datasourceConfig:edit',
  // ...
}
```

:::