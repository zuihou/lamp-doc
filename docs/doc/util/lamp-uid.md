---
title: lamp-uid
icon: wendang
index: false
category:
  - 工具类
tag:
  - 工具类
  - lamp-uid
---

## 说明

本模块参考 uid-generator， 由于该项目没有发布正式版本，故将该项目源码复制过来方便使用。 

## 改动

在原生代码的基础上，修改了以下地方：

1. WorkerNodeDAO 从 com.baidu.fsg.uid.worker.dao.WorkerNodeDAO 移动到 top.tangyh.basic.uid.dao.WorkerNodeDAO。并将SQL语句从XML中调整到代码中。
2. WorkerNodeDAO 的SQL语句从XML中调整到` @Insert `注解。
3. WorkerNodeDAO 支持oracle。
4. DisposableWorkerIdAssigner 类的assignWorkerId方法，事务增加了：`@Transactional(rollbackFor = Exception.class)`
5. 新增了 HuToolUidGenerator。

参考地址： [https://github.com/baidu/uid-generator](https://github.com/baidu/uid-generator)

原理参考： [https://www.cnblogs.com/csonezp/p/12088432.html](https://www.cnblogs.com/csonezp/p/12088432.html)



## 关于UID比特分配的建议

对于并发数要求不高、期望长期使用的应用, 可增加timeBits位数, 减少seqBits位数. 例如节点采取用完即弃的WorkerIdAssigner策略,
重启频率为12次/天，那么配置成`{"workerBits":23,"timeBits":31,"seqBits":9}`时，可支持28个节点以整体并发量14400 UID/s的速度持续运行68年。

计算过程：

```shell
已知参数：
重启频率为12次/天, 配置 {"workerBits":23,"timeBits":31,"seqBits":9}

计算过程：
可用时间：
2^31 = 2147483648 s 
2147483648/60/60/24/365 ≈ 68 年
（总秒数/一分60秒/一小时60分/一天24小时/一年365天）

服务重启次数：
2^23 = 8388608次 ≈ 840万次

68 * 365 * 12 = 297840次
这68年总计重启次数： 68年*365天*12次/天 = 297840次 

8388608/(68 * 365 * 12) ≈ 28 节点
能重启的总次数/一个节点在68年重启的总次数 = 最多支撑多少个节点

并发量：
单台节点的并发量为：
2^9 = 512 uid/秒 
28节点的并发量为：
28*512 ≈ 14400 uid/秒 
```



对于节点重启频率频繁、期望长期使用的应用, 可增加workerBits和timeBits位数, 减少seqBits位数. 例如节点采取用完即弃的WorkerIdAssigner策略，重启频率为24*12次/天, 那么配置成`{"workerBits":27,"timeBits":30,"seqBits":6}`时, 可支持37个节点以整体并发量2400 UID/s的速度持续运行34年。



## 结构图

![百度UID结构](/images/util/baidu-uid.png)

![hutool工具类UID接口](/images/util/hutool-uid.jpg)

### 1. 时间戳

百度算法：相对于时间基点**"${epochStr}"**的增量值，单位：秒。==字节位数可以自己调整。==

hutool算法：相对于时间基点***Thu, 04 Nov 2010 01:42:54***的增量值，单位：秒。

### 2. 机器码

百度算法： 支持服务重启的次数，支持约420w次重启，即**2^22**。==字节位数可以自己调整。==

重启是指某个服务(jar)重启的次数，并非服务器重启次数！

hutool算法：支持的节点数， 就是workerId、dataCenterId，最多1024节点，即**2^10**。==字节位数可以自己调整。==

### 3.序列号

单位时间内的并发序列。

百度算法：**13 bits**可支持每秒**8192**个并发，即**2^13**个并发。==字节位数可以自己调整。==

hutool算法：**12 bits**可支持每毫秒**4096**个并发，即**2^12**个并发。



## 常见问题

### 1. 生成的 id 重复？

```yaml
# database.yml
lamp:
  database:
    # id生成策略  # HU_TOOL  DEFAULT
    id-type: CACHE
    hutoolId:
      workerId: 0
      dataCenterId: 0
    cache-id:
      time-bits: 31			# 时间戳？	
      worker-bits: 22   # 最多22个节点
      seq-bits: 10      # 每秒最多生成1024个id
      epochStr: '2020-09-15'    # 系统开始使用时设置为为开始使用的时间 ，后期就严禁修改。
      boost-power: 3
      padding-factor: 50
```

- id-type = HUTOOL 时

  - 若不同的节点 wordId、dataCenterId都重复，则可能会造成ID重复
  - ~~每毫秒产生超过4096个ID，则可能会造成ID重复（已修复）~~
  - 使用时长从`Thu, 04 Nov 2010 01:42:54 GMT`算，超过69年，则可能ID重复。
  - 同一节点服务器的时钟回拨，在2秒内，则可能会造成ID重复 
  - 自己new的Snowflake必须保证单例，则可能会造成ID重复 

- id-type = CACHE 或 DEFAULT 时

  - 不同的服务在启动时自动递增的worker_node表id重复，则可能ID重复。
  - 重启次数超过 2^worker-bits 次，启动时程序直接报错。
  - ~~每秒产生超过 2^seq-bits 个ID，则可能会造成ID重复 （已修复）~~
  - 使用时长超过 2^time-bits 秒，获取id时直接报错。
  - 同一节点服务器的时钟回拨，直接报错。
  - 多次修改 epochStr 参数

  ```java{6-7}
  @Override
  public void afterPropertiesSet() throws Exception {
      // initialize bits allocator
      bitsAllocator = new BitsAllocator(timeBits, workerBits, seqBits);
  
      // 启动时，查看不用节点的 workerId， 若不同节点的 workerId 重复，则并发情况下可能造成ID重复！
      workerId = workerIdAssigner.assignWorkerId();
      if (workerId > bitsAllocator.getMaxWorkerId()) {
          throw new RuntimeException("Worker id " + workerId + " exceeds the max " + bitsAllocator.getMaxWorkerId());
      }
  
      LOGGER.info("Initialized bits(1, {}, {}, {}) for workerID:{}", timeBits, workerBits, seqBits, workerId);
  }
  ```

  

###  2. id 全部是偶数？

- id-type = HUTOOL 时

  需要自己修改 HuToolUidGenerator 类的代码，并自行传递 `randomSequenceLimit` 参数， 取值范围为0-4095

  ```java
  // HuToolUidGenerator
  public HuToolUidGenerator(long workerId, long datacenterId) {
      this.snowflake = Singleton.get(Snowflake.class, workerId, datacenterId,
              false, Snowflake.DEFAULT_TIME_OFFSET, randomSequenceLimit);
  		// this.snowflake = IdUtil.getSnowflake(workerId, datacenterId);
  }
  ```

- id-type =  DEFAULT 时

  ::: code-tabs

  @tab database.yml

  ```yml
  lamp:
    database:
      default-id:
        randomSequenceLimit: 10
      cache-id:
        randomSequenceLimit: 10     
  ```

  @tab DefaultUidGenerator

  ```java{23-29}
  protected synchronized long nextId() {
      long currentSecond = getCurrentSecond();
  
      // Clock moved backwards, refuse to generate uid
      // 时钟回拨问题待解决
      if (currentSecond < lastSecond) {
          long refusedSeconds = lastSecond - currentSecond;
          throw new UidGenerateException("Clock moved backwards. Refusing for %d seconds", refusedSeconds);
      }
  
      // At the same second, increase sequence
      //同一秒内的，本次发号请求不是本秒的第一次, sequence 加一
      if (currentSecond == lastSecond) {
          sequence = (sequence + 1) & bitsAllocator.getMaxSequence();
          // Exceed the max sequence, we wait the next second to generate uid
          // 号发完了，等到下一秒
          if (sequence == 0) {
              currentSecond = getNextSecond(lastSecond);
          }
  
      // 在不同的秒，序列从零重新启动
      } else {
          // 新的一秒，重新开始发号
          // 低频使用时生成的id总是偶数问题 https://gitee.com/dromara/hutool/issues/I51EJY
          if (randomSequenceLimit > 1) {
              sequence = RandomUtil.randomLong(randomSequenceLimit);
          } else {
              sequence = 0L;
          }
      }
  
      lastSecond = currentSecond;
  
      // Allocate bits for UID
      return bitsAllocator.allocate(currentSecond - epochSeconds, workerId, sequence);
  }
  ```

  :::

  - id-type =  CACHE 时

    程序启动时，会提前初始化id到数组中。需要id时，直接从数组中取。 

    ```java{6-8}
    protected List<Long> nextIdsForOneSecond(long currentSecond) {
        // Initialize result list size of (max sequence + 1)
        int listSize = (int) bitsAllocator.getMaxSequence() + 1;
        List<Long> uidList = new ArrayList<>(listSize);
    
        // 第三个参数为0L，会导致每次生成的第一个id永远是偶数
        long firstSeqUid = bitsAllocator.allocate(currentSecond - epochSeconds, workerId, 0L);
        // 但后续id是通过 firstSeqUid 递增的，所以能避免全部id都是偶数的情况
        for (int offset = 0; offset < listSize; offset++) {
            uidList.add(firstSeqUid + offset);
        }
    
        return uidList;
    }
    ```

    

###  3. 生成的id为负数？

正常情况下id都是正数，出现负数的情况，请调试代码：

```java
// BitsAllocator.java
public long allocate(long deltaSeconds, long workerId, long sequence) {
    return (deltaSeconds << timestampShift) | (workerId << workerIdShift) | sequence;
}
```

