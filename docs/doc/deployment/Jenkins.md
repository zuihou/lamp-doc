---
title: Jenkins
index: false
category:
  - 部署
tag:
  - 部署
  - Jenkins
---

## 安装

启用Jenkins存储库。运行以下命令下载并导入GPG密钥

```shell
sudo wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins-ci.org/redhat-stable/jenkins.repo
sudo rpm --import https://jenkins-ci.org/redhat/jenkins-ci.org.key
sudo dnf install jenkins
sudo systemctl daemon-reload
```

### 修改端口

vim /etc/sysconfig/jenkins

```properties
JENKINS_PORT="8080"  # 修改成自己需要的端口
```

### 查看安装目录

```shell
rpm -q l jenkins
```

### jenkins权限

```shell
gpasswd -a jenkins root
```

### 修改/etc/sysconfig/jenkins文件

vim /etc/sysconfig/jenkins

```properties
JENKINS_USER=root
JENKINS_GROUP=root
```

### 常用命令

```shell
sudo systemctl start jenkins
sudo systemctl restart jenkins
sudo systemctl enable jenkins
systemctl status jenkins
```

### 配置防火墙

```shell
sudo firewall-cmd --permanent --zone=public --add-port=8080/tcp
sudo firewall-cmd --reload
```



## 插件安装

### 镜像加速

- cd /var/lib/jenkins/
- vim hudson.model.UpdateCenter.xml
- 将 url 修改为 清华大学官方镜像：https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json

### 浏览器访问

http://127.0.0.1:8080

### 获取初始密码，并在浏览器中输入密码

- vi /var/lib/jenkins/secrets/initialAdminPassword

### 安装必要的插件

- pipeline
- Git Parameter
- Localization: Chinese (Simplified)
- Publish Over SSH



## 三方组件安装

### 安装maven

- 下载maven 3.5+
- 解压到/opt/maven
- 配置环境变量 vim /etc/profile

```shell
export MAVEN_HOME=/opt/maven
export PATH=$PATH:$MAVEN_HOME/bin
```

- source /etc/profile

### 安装node

```shell
curl -fsSL https://rpm.nodesource.com/setup_16.x | bash -
sudo yum install -y gcc-c++ make nodejs

node -v
npm -v
```

### 安装pnpm

```shell
npm install pnpm -g --registry=https://registry.npmmirror.com

pnpm --version
```

### 安装 git

```shell
yum install -y git
```



## 配置

在jenkins配置Jdk、Maven、Node

- 系统管理(Manage Jenkins) - 全局工具配置
  
  ![系统管理](/images/deployment/系统管理.png)
  
- 设置服务器上自己安装的jdk maven node 的路径
  
  

  ![Maven配置](/images/deployment/Maven配置.png)
  
  
  
  ![jdk配置](/images/deployment/jdk配置.png)
  
  
  
- 在Jenkins部署服务器输出一下PATH路径

  ```shell
  echo $PATH
  ```

- 系统管理(Manage Jenkins) - 系统设置 - 环境变量，配置上一步输出的PATH路径
  
  ![全局属性](/images/deployment/全局属性.png)



## 常见问题
1. jobs强制停止
```
Jenkins.instance.getItemByFullName("lamp-web-pro")
    .getBuildByNumber(5)   // job id
    .finish(
        hudson.model.Result.ABORTED,
        new java.io.IOException("Aborting build")
    );
```
