---
title: Jenkins部署jar
index: false
category:
  - 部署
tag:
  - 部署
  - Jenkins部署jar
---

## 部署流程

![](/images/deployment/jenkins部署图.png)



## 构建lamp-util-pro

- 点击【新建Item】

  ![新建Item](/images/deployment/新建Item.png)

- 填写【任务名称】，并选择【流水线】

  ![新建任务](/images/deployment/新建任务.png)

- 配置项目参数和流水线

  ![新建任务](/images/deployment/lamp-util-pro任务配置.png)

- 构建项目

  ![新建任务](/images/deployment/构建lamp-util-pro.png)

  参数解释：

  - branch: 分支， 在执行构建任务时，可以根据这个参数选择分支或标签
  - MAVEN_COMMAND： 执行maven编译的命令  

- 在lamp-util-pro代码中添加Jenkinsfile文件

  ```groovy
  #!groovy
  pipeline {
      agent any
  
      stages {
          stage('maven 本地编译lamp-util模块') {
              steps {
                  echo "maven 本地编译lamp-util模块"
                  sh "pwd"
                  sh 'mvn clean ${MAVEN_COMMAND} -T8 -Dmaven.compile.fork=true -Dmaven.test.skip=true'
              }
          }
      }
  }
  ```

  

- 编译util项目

  ![新建任务](/images/deployment/构建项目.png)



## 构建lamp-cloud-pro

- 点击【新建Item】

  ![新建Item](/images/deployment/新建Item.png)

- 填写【任务名称】，并选择【流水线】

  

  ![新建任务](/images/deployment/新建lamp-cloud-pro.png)

- 配置服务器信息

  系统管理(Manage Jenkins) - 系统设置。 Name参数的命名规则为：{任意名称} _{PROFILES}，如 aaa_prod、bbb_prod、ccc_dev 等

  

  ![新建任务](/images/deployment/SSHServer.png)

  

  因为Jenkinsfile中需要根据`_`来截取参数：

  ```shell
    // SERVER_SSH_HOST一定要包含_ 如：ip_dev ip_prod 等格式
    PROFILES_ARR = "${SERVER_SSH_HOST}".split('_')
    PROFILES = PROFILES_ARR[1]
  ```

  

- 配置项目参数和流水线

  ![新建任务](/images/deployment/lamp-cloud-pro任务配置.png)

  参数解释：
  - branch: 分支， 在执行构建任务时，可以根据这个参数选择分支或标签

  - MAVEN_COMMAND： 在jenkins服务器编译代码， package install deploy表示maven的编译命令，none 表示不编译源码，使用上次编译的jar

  - 
    
  - SERVER_NAME：发布那个服务。这里配置的名字一定要代码的目录结构一致。如lamp-authority下一定要有一个lamp-authority-server
    
    
    
    ![新建任务](/images/deployment/代码目录结构.png)
    
    
    
  - IS_PUSH_JAR： 是否将jenkins服务器的编译后的jar，推送到部署服务器。若不勾选，则使用服务器上原来的的jar执行重启等操作。

  - SERVER_SSH_HOST：推送到那台服务器。 这里配置的选项一定是 步骤【配置部署服务器】中的"Name"参数

  - ACTION：在部署服务器执行(停止、启动、重启等)动作，none表示不执行动作

- 在lamp-cloud-pro代码中添加Jenkinsfile文件

- 构建项目

  ![新建任务](/images/deployment/构建lamp-cloud-pro.png)



## 构建lamp-web

- 点击【新建Item】

  ![新建Item](/images/deployment/新建Item.png)

- 填写【任务名称】，并选择【流水线】

- 配置项目参数和流水线

  ![新建任务](/images/deployment/配置lamp-web-pro.png)

  参数解释： 

  - branch: 分支， 在执行构建任务时，可以根据这个参数选择分支或标签 - IS_INSTALL： 是否执行install

- 在项目代码中添加Jenkinsfile文件
