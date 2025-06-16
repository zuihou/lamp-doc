---
title: Redis配置
icon: wendang
order: 1
category:
  - 配置 
  - Redis配置
tag:
  - Redis配置
---

- 配置位于redis.yml
- lamp.cache前缀的配置参考：CustomCacheProperties
- spring.data.redis 前缀的配置参考：RedisProperties

```yaml
lamp:
  cache:
    # 启动缓存的类型
    type: REDIS
    # 序列化类型
    serializerType: jack_son
  redis:
    ip: 127.0.0.1
    port: 16379
    password: 'SbtyMveYNfLzTks7H0apCmyStPzWJqjy'
    database: 0

spring:
  cache:
    type: GENERIC
  data:
    redis:
      host: ${lamp.redis.ip}
      password: ${lamp.redis.password}
      port: ${lamp.redis.port}
      database: ${lamp.redis.database}
	
```

