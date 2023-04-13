<template>
  <NormalPage>
    <template #contentBefore>
      <AdPage />
    </template>
  </NormalPage>
</template>
<script setup lang="ts">
import NormalPage from "vuepress-theme-hope/components/NormalPage.js";
import AdPage from "./AdPage.vue"
</script>
