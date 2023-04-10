---
title: lamp-xss-starter
icon: wendang
index: false
category:
  - 工具类
tag:
  - 工具类
  - lamp-xss-starter
---

XSS攻击通常指的是通过利用网页开发时留下的漏洞，通过巧妙的方法注入恶意指令代码到网页，使用户加载并执行攻击者恶意制造的网页程序。这些恶意网页程序通常是JavaScript，但实际上也可以包括Java、 VBScript、ActiveX、 Flash 或者甚至是普通的HTML。攻击成功后，攻击者可能得到包括但不限于更高的权限（如执行一些操作）、私密网页内容、会话和cookie等各种内容。

本项目中，解决跨站攻击使用了工具类：AntiSamy。 AntiSamy是OWASP的一个开源项目，通过对用户输入的 HTML / CSS / JavaScript 等内容进行检验和清理，确保输入符合应用规范。AntiSamy被广泛应用于Web服务对存储型和反射型XSS的防御中。

## AntiSamy

AntiSamy对“恶意代码”的过滤依赖于策略文件。策略文件规定了AntiSamy对各个标签、属性的处理方法，策略文件定义的严格与否，决定了AntiSamy对XSS漏洞的防御效果。在AntiSamy的jar包中，包含了几个常用的策略文件:

- antisamy.xml
- antisamy-anythinggoes.xml
- antisamy-ebay.xml
- antisamy-myspace.xml
- antisamy-slashdot.xml
- antisamy-tinymce.xml

我们可以自定义策略文件来过滤用户输入，但更多的会是基于现有的策略文件进行稍微的调整，以使其更贴合项目的实际需求。要描述某种特定规则，XML无疑是个不错的选择，而AntiSamy策略文件也正是采用了XML格式。如图所示，除去文件头的AntiSamy策略文件可以分为八个部分:

1. directives

   全局配置，对AntiSamy的过滤验证规则、输入及输出的格式进行全局性的控制

   ```xml
   <directives>
     <directive name="omitXmlDeclaration" value="true"/>
     <directive name="omitDoctypeDeclaration" value="true"/>
     <directive name="maxInputSize" value="200000"/>
     <directive name="useXHTML" value="true"/>
     <directive name="formatOutput" value="true"/>
     <directive name="nofollowAnchors" value="true" />
     <directive name="validateParamAsEmbed" value="true" />
   
     <!--
     remember, this won't work for relative URIs - AntiSamy doesn't
     know anything about the URL or your web structure
     -->
     <directive name="embedStyleSheets" value="false"/> 
     <directive name="connectionTimeout" value="5000"/>
     <directive name="maxStyleSheetImports" value="3"/>
   
   </directives>
   ```

2. common-regexps
   公用正则表达式，需要使用正则的时候可以通过name直接引用:

   ```xml
   <common-regexps>
     <regexp name="numberOrPercent" value="(\d)+(%{0,1})"/>
     <regexp name="paragraph" value="([\p{L}\p{N},'\.\s\-_\(\)\?]|&amp;[0-9]{2};)*"/>  
     <regexp name="htmlId" value="[a-zA-Z0-9\:\-_\.]+"/>
   </common-regexps>
   ```

   假设后文需要使用”htmlId”这一正则时，直接根据对应的name属性进行引用即可

   ```xml
   <!-- Common to all HTML tags  -->
   <attribute name="id" description="The 'id' of any HTML attribute should not contain anything besides letters and numbers">
       <regexp-list>
           <!-- 直接根据正则的名称进行引用 -->
           <regexp name="htmlId"/>
       </regexp-list>
   </attribute>	
   ```

3. common-attributes
   通用的属性需要满足的输入规则，其中包括了标签和css的属性；在tag和css的处理规则中会引用到这些属性:

   ```xml
   <common-attributes>
     <attribute name="classid">
       <regexp-list>
           <regexp name="anything" />
       </regexp-list>
     </attribute>
     <attribute name="autocomplete">
       <literal-list>
         <literal value="on"/>
         <literal value="off"/>
       </literal-list>
     </attribute>
   </common-attributes>
   ```

4. global-tag-attributes
   所有标签的默认属性需要遵守的规则

   ```xml
   <global-tag-attributes>
       <!-- Not valid in base, head, html, meta, param, script, style, and title elements. -->
       <attribute name="id"/>
       <attribute name="style"/>
       <attribute name="title"/>
       <attribute name="class"/>
       <!-- Not valid in base, br, frame, frameset, hr, iframe, param, and script elements.  -->
       <attribute name="lang"/>
   </global-tag-attributes>
   ```

5. tags-to-encode
   需要进行编码处理的标签:

   ```xml
   <tags-to-encode>
     <tag>g</tag>
     <tag>grin</tag>
   </tags-to-encode>
   ```

6. tag-rules

   tag的处理规则，共有三种处理方式

   - remove
     对应的标签直接删除，如script标签处理规则为删除

     ```xml
     <tag name="script" action="remove"/>
     ```

   - truncate
     对应的标签进行缩短处理，直接删除所有属性，只保留标签和值
     如标题只保留标签和值

     ```xml
     <tag name="title" action="truncate"/>
     ```

   - validate
     对应的标签的属性进行验证，如果tag中定义了属性的验证规则，按照tag中的规则执行；如果标签中未定义属性，则按照`<global-tag-attributes>`中定义的处理

     ```xml
     <tag name="title" action="truncate"/>
     ```

7. css-rules
   CSS的处理规则

   ```xml
   <css-rules>
     <property name="bottom" default="auto" description="">
       <category-list>
           <category value="visual"/>
       </category-list>
       <literal-list>
           <literal value="auto"/>
           <literal value="inherit"/>
       </literal-list>
       <regexp-list>
           <regexp name="length"/>
           <regexp name="percentage"/>
       </regexp-list>
     </property>
     <property name="color" description="">
       <category-list>
           <category value="visual"/>
       </category-list>
       <literal-list>
           <literal value="inherit"/>
       </literal-list>
       <regexp-list>
           <regexp name="colorName"/>
           <regexp name="colorCode"/>
           <regexp name="rgbCode"/>
           <regexp name="systemColor"/>
       </regexp-list>
     </property>
   </css-rules>
   ```

8. allowed-empty-tags
   允许没有内容的标签:

   ```xml
   <allowed-empty-tags>
     <literal-list>
       <literal value="br"/>
       <literal value="hr"/>
       <literal value="a"/>
       <literal value="img"/>
       <literal value="link"/>
       <literal value="iframe"/>
       <literal value="script"/>
       <literal value="object"/>
       <literal value="applet"/>
       <literal value="frame"/>
       <literal value="base"/>
       <literal value="param"/>
       <literal value="meta"/>
       <literal value="input"/>
       <literal value="textarea"/>
       <literal value="embed"/>
       <literal value="basefont"/>
       <literal value="col"/>
       <literal value="div"/>
     </literal-list>
   </allowed-empty-tags>
   ```

弄清楚了每个标签代表的意义，便能够很容易地写出符合自己需求的策略文件了。AntiSamy的jar中提供了几个常见策略文件可以参考：

- antisamy-anythinggoes.xml
  允许所有有效的HTML和CSS元素输入（但能拒绝JavaScript或跟CSS相关的网络钓鱼攻击），因为它包含了对于每个元素的基本规则，所以你在裁剪其它策略文件的时候可以把它作为一个知识库，一般不建议使用。
- antisamy-ebay.xml
  eBay 是当下最流行的在线拍卖网站之一。它是一个面向公众的站点，因此它允许任何人发布一系列富HTML的内容，允许输入的内容列表包含了比 Slashdot 更多的富文本内容，所以它的受攻击面也要大得多。
  该策略相对安全，适用于电子商务网站。
- antisamy-myspace.xml
  MySpace 是最流行的一个社交网站之一。用户允许提交除了JavaScript之外的几乎所有他们想用的HTML和CSS。
  MySpace现在用一个黑名单来验证用户输入的HTML，相对较危险，不建议使用。
- antisamy-slashdot.xml
  Slashdot 是一个提供技术新闻的网站，其安全策略非常严格。用户只能提交下列的HTML标签：`<b>、<u>、<i>、<a>、<blockquote>`，并且还不支持CSS。
  该策略文件来实现了类似的功能，允许所有文本格式的标签来直接修饰字体、颜色或者强调作用，适用于新闻网站的评论过滤。
- antisamy-tinymce.xml
  只允许文本格式通过，相对较安全
- antisamy.xml
  默认规则，允许大部分HTML通过



## 项目接入

1. maven依赖

   在本项目中，任何需要防跨站攻击的服务，都只需要引入如下依赖即可：

   ```xml
   <dependency>
       <groupId>top.tangyh.basic</groupId>
       <artifactId>lamp-xss-starter</artifactId>
       <version>${最新版本}</version>
   </dependency>
   ```

2. 策略文件

   配置AntiSamy策略文件：antisamy-slashdot-1.4.4.xml

3. 如何使用

- 调用 `XssUtils.xssClean` 方法，传入想要过滤的参数，其返回值就是过滤后的值

- 全局过滤： 参考：`XssAuthConfiguration` 类

  ```java
  /**
   * 配置跨站攻击 反序列化处理器
   */
  @Bean
  @ConditionalOnProperty(prefix = XssProperties.PREFIX, name = "requestBodyEnabled", havingValue = "true")
  public Jackson2ObjectMapperBuilderCustomizer jackson2ObjectMapperBuilderCustomizer2() {
      return builder -> builder.deserializerByType(String.class, new XssStringJsonDeserializer());
  }
  
  /**
   * 配置跨站攻击过滤器
   */
  @Bean
  @ConditionalOnProperty(prefix = XssProperties.PREFIX, name = "enabled", havingValue = "true", matchIfMissing = true)
  public FilterRegistrationBean filterRegistrationBean() {
      FilterRegistrationBean filterRegistration = new FilterRegistrationBean();
      filterRegistration.setFilter(new XssFilter());
      filterRegistration.setEnabled(xssProperties.getEnabled());
      filterRegistration.addUrlPatterns(xssProperties.getPatterns().toArray(new String[0]));
      filterRegistration.setOrder(xssProperties.getOrder());
  
      Map<String, String> initParameters = new HashMap<>(4);
      initParameters.put(IGNORE_PATH, CollUtil.join(xssProperties.getIgnorePaths(), ","));
      initParameters.put(IGNORE_PARAM_VALUE, CollUtil.join(xssProperties.getIgnoreParamValues(), ","));
      filterRegistration.setInitParameters(initParameters);
      return filterRegistration;
  }
  ```

4. 通过配置文件 修改配置

   ```yaml
   lamp:
     xss: 
   		# 是否启用 @RequestParam
       enabled: true
   		# 是否启用 RequestBody 注解标记的参数 反序列化时过滤XSS
       requestBodyEnabled: false
       order: 1  # xss过滤器顺序
       patterns:   # xss过滤器拦截的路径
       ignorePaths: # xss过滤器忽略的路径
       ignoreParamValues: # 忽略的参数值
   ```

   
