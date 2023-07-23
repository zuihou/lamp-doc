---
title: lamp-validator-starter
icon: wendang
index: false
category:
  - 工具类
tag:
  - 工具类
  - lamp-validator-starter
---

## 简介

>  Hibernate Validator是 Bean Validation 的实现类。Hibernate Validator 提供了 JSR 303 规范中所有内置 constraint 的实现，除此之外还有一些附加的 constraint。Bean Validation为 JavaBean 验证定义了相应的元数据模型和API。缺省的元数据是 Java Annotations，通过使用 XML 可以对原有的元数据信息进行覆盖和扩展。Bean Validation 是一个运行时的数据验证框架，在验证之后验证的错误信息会被马上返回。

参数校验是web项目必不可少的一环，但是参数校验写在业务代码中，使业务代码显得十分臃肿。Hibernate Validator 框架刚好解决了这个问题，可以用优雅的方式实现参数的校验，解耦业务代码和校验逻辑。



## 作用

Hibernate Validator 的作用：

*   验证逻辑与业务逻辑之间进行了分离，降低了程序耦合度；

*   统一且规范的验证方式，无需你再次编写重复的验证代码；

*   你将更专注于你的业务，将这些繁琐的事情统统丢在一边。

    

## 疑问

1. Hibernate Validator 这么好，为啥我还要重复造轮子？ 

   NO！NO！NO！灯灯并没有重复造轮子，而是在Hibernate Validator的基础上扩展更强的功能。

2. 那灯灯封装的`lamp-validator-starter` 到底是个啥东西？

   严谨的参数校验无疑需要同时支持==前端表单验证==和==后端接口验证==，但绝大多数的JavaWeb项目，都是前端和后端各做各的表单验证，校验规则变更，还得前端和后端同时修改。那么， 有没有一种方式能让前端和后端的验证规则保持一致？一边修改了校验规则另一边也自动更改了呢？



## 诞生

基于上面的场景，灯灯基于hibernate-validator的基础上封装了lamp-validator-starter模块，提供一个通用接口/form/validator，调用该接口用于获取需要校验的后端接口的校验规则，前端对该通用接口返回的校验规则进行解析，解析成前端插件的校验规则。若校验规则改变，只需要后端修改规则即可。

::: tip

实际上，我使用的表单验证组件还是Hibernate Validator，灯灯没有修改它的任何一个方法和注解，只是在它基础上写了一个通用接口，通过该接口返回后端某个接口的具体的校验规则，前端校验时，也使用同样的规则，即能达到统一校验的效果。

:::

## 增强
1. 本系统新增了一个自定义注解：  NotEmptyPattern， 用于在参数不为空时，才判断正则表达式。它的约束实现类参考： NotEmptyPatternConstraintValidator



## 使用

::: code-tabs

@tab vue

```tsx{23-26}
import { getValidateRules } from '/@/api/lamp/common/formValidateService';

export const VALIDATE_API = {
  [ActionEnum.ADD]: 'Save',
  [ActionEnum.EDIT]: 'Update',
  [ActionEnum.COPY]: 'Save',
};

async function setData(data: Recordable) {
  await resetFields();
  type.value = data?.type;

  const { record = {}, parent = {} } = data;
  record['parentName'] = parent?.name;
  record['parentId'] = parent?.id;

  await setFieldsValue({ ...record });

  if (unref(type) !== ActionEnum.VIEW) {
  	// 新增、复制页面 = Api.Save  编辑页面 = Api.Update
    let validateApi = Api[VALIDATE_API[unref(type)]];
    // 通过getValidateRules方法，调用后端 /form/valiator/xxx 接口，获取 /xxx 接口的校验规则
    getValidateRules(validateApi, customFormSchemaRules(type)).then(async (rules) => {
    	// 将后端返回的 rules ，更新到前端表单检验组件
      rules && rules.length > 0 && (await updateSchema(rules));
    });
  }
}
```

@tab json

```json
// 通过getValidateRules方法，调用后端 /form/valiator/xxx 接口，返回的新增机构的校验规则
{
    "code": 0,
    "data": [
        {
            "field": "shortName",
            "fieldType": "String",
            "constraints": [
                {
                    "type": "Range",
                    "attrs": {
                        "min": 0,
                        "max": 255,
                        "message": "简称长度不能超过{max}"
                    }
                }
            ]
        },
        {
            "field": "remarks",
            "fieldType": "String",
            "constraints": [
                {
                    "type": "Range",
                    "attrs": {
                        "min": 0,
                        "max": 255,
                        "message": "备注长度不能超过{max}"
                    }
                }
            ]
        },
        {
            "field": "type",
            "fieldType": "String",
            "constraints": [
                {
                    "type": "Range",
                    "attrs": {
                        "min": 0,
                        "max": 2,
                        "message": "类型长度不能超过{max}"
                    }
                },
                {
                    "type": "NotNull",
                    "attrs": {
                        "message": "请填写类型"
                    }
                }
            ]
        },
        {
            "field": "name",
            "fieldType": "String",
            "constraints": [
                {
                    "type": "Range",
                    "attrs": {
                        "min": 0,
                        "max": 255,
                        "message": "名称长度不能超过{max}"
                    }
                },
                {
                    "type": "NotNull",
                    "attrs": {
                        "message": "请填写名称"
                    }
                }
            ]
        },
        {
            "field": "treePath",
            "fieldType": "String",
            "constraints": [
                {
                    "type": "Range",
                    "attrs": {
                        "min": 0,
                        "max": 255,
                        "message": "树路径长度不能超过{max}"
                    }
                }
            ]
        }
    ],
    "msg": "ok",
    "path": null,
    "extra": null,
    "timestamp": "1681045002724",
    "errorMsg": "",
    "isSuccess": true
}
```

@tab entity

```java{4-5,7-8,10}
public class BaseOrgSaveVO implements Serializable {
    private static final long serialVersionUID = 1L;

    @NotEmpty(message = "请填写名称")
    @Size(max = 255, message = "名称长度不能超过{max}")
    private String name;
    @Size(max = 2, message = "类型长度不能超过{max}")
    @NotEmpty(message = "请填写类型")
    private String type;
    @Size(max = 255, message = "简称长度不能超过{max}")
    private String shortName;
    private Long parentId;
    private Integer treeGrade;
    @Size(max = 255, message = "树路径长度不能超过{max}")
    private String treePath;
    private Integer sortValue;
    private Boolean state;
    @Size(max = 255, message = "备注长度不能超过{max}")
    private String remarks;

}
```

@tab controller

```java{2,7}
@RestController
@Validated
@RequestMapping("/baseOrg")
public class BaseOrgController {
  	// 新增机构的后端方法
	  @PostMapping("/save")
    public R<Boolean> save(@RequestBody @Validated BaseEmployee baseEmployee) {
        return R.success(baseEmployeeTestService.save(baseEmployee));
    }
}
```

:::

getValidateRules 方法的作用是动态获取==validateApi==接口的==校验规则==，以机构维护页面为例：

| 类型     | validateApi | 业务接口                | 校验规则接口                           |
| -------- | ----------- | ----------------------- | -------------------------------------- |
| 新增机构 | Api.Save    | /api/base/org<br />POST | /api/base/form/validator/org<br />POST |
| 复制机构 | Api.Save    | /api/base/org<br />POST | /api/base/form/validator/org<br />POST |
| 修改机构 | Api.Update  | /api/base/org<br />PUT  | /api/base/form/validator/org<br />PUT  |



前端请认真阅读formValidateService.ts源码，主要逻辑如下：

- 根据将入参==validateApi==替换为==校验规则接口==
- 从内存Map中查找规则缓存
- 请求==校验规则接口==
- 将后端返回的规则json，转换为前端能识别的json格式
- 将后端返回的规则和前端自定义规则合并
