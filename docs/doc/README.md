---
title: 指南
icon: codestring
index: false
category:
  - 介绍
tag:
  - 介绍
---

# 《灯灯》中后台快速开发平台

## 名字由来

在一个夜黑风高的晚上，小孩吵着要出去玩，于是和`程序员老婆`一起带小孩出去放风，路上顺便讨论起项目要换个什么名字，在各自想出的名字都被对方一一否决后，大家陷入了沉思。走着走着，在一盏路灯下，孩砸盯着路灯打破宁静，喊出：灯灯～ 我和媳妇愣了一下，然后对视着一起说：哈哈，这个名字好～



## 简介

她是基于 `jdk11/jdk8`、`SpringCloud`、`SpringBoot`开发的微服务快速开发平台，专注于多租户解决方案。她拥有RBAC、网关统一鉴权、Xss防跨站攻击、代码自动生成、多种存储系统、分布式事务、分布式定时任务等功能，支持多业务系统、多服务并行开发，可以作为Java Web项目的开发脚手架。代码优美，注释齐全，架构清晰，非常适合学习和企业作为基础框架使用。

核心技术采用Spring Cloud Alibaba、SpringBoot、Mybatis、Seata、Sentinel、RabbitMQ、FastDFS/MinIO、SkyWalking等主要框架和中间件。希望能努力打造一套从 `JavaWeb基础框架` - `分布式微服务架构` - `持续集成` - `系统监测` 的解决方案。本项目旨在实现基础能力，不涉及具体业务。



## 项目组成

灯灯(简称灯， 英文名：lamp)，她是一个项目集，由**工具集**、**后端**、**前端**组成，如图：

![](/images/global/4.x项目关系图.png)

为满足高内聚低耦合设计原则，将一个大项目拆解为以下几个子项目：

### 工具集

| 项目           | gitee(3.x 开源版)                                            | github(3.x 开源版)                                         | Gitlab(4.x 企业版)                                      | 备注             |
| -------------- | ------------------------------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------- | ---------------- |
| lamp-util      | [lamp-util](https://gitee.com/zuihou111/lamp-util)           | [lamp-util](https://github.com/zuihou/lamp-util)           | [lamp-util](http://git.tangyh.top/zuihou/lamp-util-pro) | 核心工具集       |
| lamp-generator | [lamp-generator](https://gitee.com/zuihou111/lamp-generator) | [lamp-generator](https://github.com/zuihou/lamp-generator) | 已合并到lamp-cloud-pro和lamp-boot-pro                   | 代码生成器       |
| lamp-job       | [lamp-job](https://gitee.com/zuihou111/lamp-job)             | [lamp-job](https://github.com/zuihou/lamp-job)             | [lamp-job](http://git.tangyh.top/zuihou/lamp-job-pro)   | 分布式定时调度器 |

### 后端

| 项目         | gitee(3.x 开源版)                                      | github(3.x 开源版)                                     | datasource模式(4.x 企业版)                                   | column模式(4.x 企业版)                                       | none模式(4.x 企业版)                                         |
| ------------ | ------------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| lamp-cloud   | [lamp-cloud](https://gitee.com/dromara/lamp-cloud)     | [lamp-cloud](https://github.com/dromara/lamp-cloud)    | [lamp-cloud-pro](http://git.tangyh.top/zuihou/lamp-cloud-pro-datasource-column) | [lamp-cloud-pro](http://git.tangyh.top/zuihou/lamp-cloud-pro-column) | [lamp-cloud-pro](http://git.tangyh.top/zuihou/lamp-cloud-pro-none) |
| lamp-boot    | [lamp-boot](https://gitee.com/zuihou111/lamp-boot)     | [lamp-boot](https://github.com/zuihou/lamp-boot)       | [lamp-boot-pro](http://git.tangyh.top/zuihou/lamp-boot-pro-datasource-column) | [lamp-boot-pro](http://git.tangyh.top/zuihou/lamp-boot-pro-column) | [lamp-boot-pro](http://git.tangyh.top/zuihou/lamp-boot-pro-none) |
| 微服务版示例 | [lamp-samples](https://github.com/zuihou/lamp-samples) | [lamp-samples](https://github.com/zuihou/lamp-samples) | 无                                                           | 无                                                           | 无                                                           |

### 前端

| 项目          | gitee                                                      | github                                                    | 备注                                                         | 演示地址                                                     |
| ------------- | ---------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| lamp-web      | [lamp-web](https://gitee.com/zuihou111/lamp-web)           | [lamp-web](https://github.com/zuihou/lamp-web)            | 3.x 开源版。基于 vue-admin-element (vue2 + element-ui)       | [https://boot.tangyh.top/lamp-web](https://boot.tangyh.top/lamp-web) |
| lamp-web-plus | [lamp-web-plus](https://gitee.com/zuihou111/lamp-web-plus) | [lamp-web-plus](https://github.com/zuihou/lamp-web-plus)  | 3.x 企业版。基于 vue-vben-admin （vue 3 + ant design vue 3） | [https://boot.tangyh.top](https://boot.tangyh.top)           |
| lamp-web-pro  | [lamp-web-pro](http://git.tangyh.top/zuihou/lamp-web-pro)  | [lamp-web-pro](http://git.tangyh.top/zuihou/lamp-web-pro) | 4.x 企业版。基于 vue-vben-admin （vue 3 + ant design vue 3） | [https://datasource.tangyh.top](https://datasource.tangyh.top/) |



## lamp 租户模式介绍

灯灯可以使用租户模式和非租户模式，其中租户模式支持独立数据库(DATASOURCE模式)、共享数据架构(COLUMN模式)。

| 租户模式                                  | 描述                                                         | 优点                                                         | 缺点                                                         | 对应的后端项目                                               |
| ----------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| NONE<br/>非租户模式                       | 没有租户                                                     | 简单、适合独立系统                                           | 缺少租户系统的优点                                           | lamp-cloud-pro-none<br/>lamp-boot-pro-none                   |
| COLUMN<br/>字段模式                       | 租户共用一个数据库，在业务表中增加字段来区分                 | 简单、不复杂、开发无感知                                     | 数据隔离性差、安全性差、数据备份和恢复困难、                 | lamp-cloud-pro-column<br/>lamp-boot-pro-column               |
| DATASOURCE<br/>独立数据源                 | 每个租户独立一个 数据库(数据源)，执行代码时，动态切换数据源  | 可独立部署数据库，数据隔离性好、扩展性高、故障影响小         | 相对复杂、开发需要注意切换数据源时的事务问题、需要较多的数据库 | lamp-cloud-pro-datasource-column<br/>lamp-boot-pro-datasource-column |
| DATASOURCE_COLUMN<br/>独立数据源+字段模式 | 每个租户独立一个 数据库(数据源)，执行代码时，动态切换数据源，在动态拼接 子租户id 二次隔离 | 可独立部署数据库，数据隔离性好、扩展性高、故障影响小、支持大租户小门店形式 | 相对复杂、开发需要注意切换数据源时的事务问题、需要较多的数据库 | lamp-cloud-pro-datasource-column<br/>lamp-boot-pro-datasource-column |

## 4.x 企业版项目演示地址

- 数据源模式，演示地址：   https://datasource.tangyh.top
- 字段模式，演示地址：    https://column.tangyh.top
- 非租户模式，演示地址：   https://none.tangyh.top

## 3.x 会员版项目演示地址

- lamp-web-plus，演示地址： https://boot.tangyh.top
- lamp-web，演示地址： https://boot.tangyh.top/lamp-web
