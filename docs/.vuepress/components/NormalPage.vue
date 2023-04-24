<template>
  <NormalPage>
    <template #contentBefore>
      <AdPage content="content" />
    </template>
    <template #bottom>
      <div class="page-wwads-content" style="margin-bottom: 2.5rem;">
        👆🏻👆🏻👆🏻上面是评论区，对系统或本页文档什么疑问，可以在评论区留言。<br/>
        ❗️❗️❗️若评论区无法显示，请使用"手机热点"或"科学上网"。
      </div>
    </template>
  </NormalPage>
</template>
<script setup lang="ts">
import NormalPage from "vuepress-theme-hope/components/NormalPage.js";
import AdPage from "./AdPage.vue"
</script>
