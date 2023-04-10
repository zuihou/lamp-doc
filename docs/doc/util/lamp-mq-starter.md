---
title: lamp-mq-starter
icon: wendang
index: false
category:
  - 工具类
tag:
  - 工具类
  - lamp-mq-starter
---

这个模块功能很简单, 只是实现了通过配置控制启动时是否加载rabbitmq配置类。
```yaml
lamp:
  rabbitmq: 
    enabled: false # false表示启动时,项目会排除 RabbitAutoConfiguration 类的加载
```
