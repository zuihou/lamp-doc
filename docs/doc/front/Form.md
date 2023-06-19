---
title: Form
index: false
category:
  - 前端
tag:
  - 前端
  - Form
---

BaiscForm组件是vben官方封装得很好的插件之一，在官方的基础上lamp做出了一些增强，建议大家先阅读[vben文档](https://doc.vvbin.cn/components/form.html)，在结合本文档进行理解。本文档仅列出lamp做出的修改。

## BasicForm.vue

getSchema 方法存在2问题或修改

1. cloneDeep 会导致bug： https://github.com/vbenjs/vue-vben-admin/pull/1935
2. 返回值需要过滤 `Divider` 和 `BasicTitle`组件

::: code-tabs#BasicForm

@tab lamp

```typescript
if (unref(getProps).showAdvancedButton) {
  return schemas.filter(
    (schema) => !simpleComponents.includes(schema.component),
  ) as FormSchema[];
} else {
  return schemas as FormSchema[];
}
```

@tab vben

```typescript
if (unref(getProps).showAdvancedButton) {
  return cloneDeep(
    schemas.filter((schema) => schema.component !== 'Divider') as FormSchema[],
  );
} else {
  return cloneDeep(schemas as FormSchema[]);
}
```

:::

## FormItem.vue

1. 新增：支持全局readonly
2. 新增：支持全局disabled
3. 新增：支持渲染BasicTitle组件
4. 修复：同时存在rules和dynamicRules时，根据ruleType属性**覆盖**或**替换**校验规则

## componentMap.ts

新增了以下组件：

- [ApiAutoComplete](https://www.antdv.com/components/auto-complete-cn)
- [BasicTitle](./BasicTitle.md)
- [Transfer](https://www.antdv.com/components/transfer-cn)
- [CropperAvatar](./Cropper.md)

## ApiAutoComplete

### 使用

```tsx{6}
export const baseEditFormSchema = (): FormSchema[] => {
  return [
  	{
      label: '服务名',
      field: 'serviceName',
      component: 'ApiAutoComplete',
      componentProps: ({ formActionType }) => {
        return {
          allowClear: true,
          getPopupContainer: () => document.body,
          filterOption: (input: string, option) => {
            return option.value.toUpperCase().indexOf(input.toUpperCase()) >= 0;
          },
          api: findOnlineService,
          labelField: 'value',
          onChange: (value: string) => {
            if (value) {
              const { setFieldsValue, getFieldsValue } = formActionType;
              if (!getFieldsValue().moduleName) {
                setFieldsValue({
                  moduleName: value,
                });
              }
            }
          },
        };
      },
    },  
  ]
};
```

### Props

| 属性           | 类型               | 默认值  | 说明                               |
| -------------- | ------------------ | ------- | ---------------------------------- |
| value          | `Array, Object, String, Number` | -       | 回显值       |
| numberToString | `boolean`          | `false` | 是否将 value 为`number`的值全部转化为`string` |
| api            | `Function`  | - | 请求后台的API                 |
| afterFetch     | Function    | false   | 调用api请求前的回调函数 |
| params         | `[Object, String] as PropType<Recordable |string>` | `() => ({})` | 调用api请求时，传递的参数 |
| resultField    | `string` | '' | 若api返回值不是list，可以指定返回值中的字段 |
| labelField     | `string`    | 'label' | AutoComplete的label从api返回值的那个字段取值 |
| valueField     | `string` | 'value' | AutoComplete的value从api返回值的那个字段取值 |
| immediate      | `boolean` | `true` | 是否立即请求接口 |
| alwaysLoad      | `boolean` | `false` | 始终加载 |

## ApiCascader

增强功能：支持表单页面通过value属性回显数据。

新增代码如下：

```typescript
watch(
  () => props.value,
  (data) => {
    emitData.value = data as any[];
  },
  { deep: true },
);
```

## ApiSelect

### 增强Props

| 属性       | 类型       | 默认值 | 说明                                     |
| ---------- | ---------- | ------ | ---------------------------------------- |
| afterFetch | `Function` | -      | api 请求后端前的回调                     |
| allData    | `boolean`  | `true` | 是否将后端返回的数据都绑定到option选项上 |

## ApiTreeSelect

### 增强Props

| 属性          | 类型     | 默认值     | 说明                                          |
| ------------- | -------- | ---------- | --------------------------------------------- |
| labelField    | `string` | `label`    | TreeSelect的label从api返回值的那个字段取值    |
| valueField    | `string` | `value`    | TreeSelect的value从api返回值的那个字段取值    |
| childrenField | `string` | `children` | TreeSelect的children从api返回值的那个字段取值 |

## RadioButtonGroup

### 增强Props

| 属性  | 类型      | 默认值 | 说明                      |
| ----- | --------- | ------ | ------------------------- |
| isBtn | `boolean` | `true` | radio选项是否显示为button |

