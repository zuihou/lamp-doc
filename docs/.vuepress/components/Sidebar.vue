<template>
  <Sidebar>
    <template #top>
      <div id="sidebar-slot-top" style="padding: 1rem 0;width:100%;margin:0 auto;display:flex;flex-direction: column;">
        <a style="margin: 0px auto; width: 100%;" href="https://www.jnpfsoft.com/index.html?from=tangyh" target="_blank" data-date="2025-03-29">
          <img className="no-zoom" height="60" style="width: 100%;" src="/images/adv/jnpf.jpg">
        </a>
        <div style="margin-top: 1.5rem; order: 9999;">
          <span style='color: gray;font-size: smaller;'></span>
          <span style='color: #E01E5A;font-size: smaller;font-weight: bolder;float: right'>📢📢📢<a href='/vip/广告位.html'>免费加入此广告位</a></span>
        </div>
        <div style="order: 100000;background-color: rgba(0,0,0,.15);width:100%;height:1px;margin: 1rem 0 0 0; position:relative;">
          <button style='border-radius: 100%;padding: 0;text-align: center;border: none;background-color: #ff3861;cursor: pointer;position: absolute;left: calc(50% - 15px);top: -15px;height: 30px;width: 30px;color: #fff;' onclick='document.getElementById("sidebar-slot-top").style.display="none"'>收起</button>
        </div>
      </div>
    </template>
  </Sidebar>
</template>
<script setup lang="ts">
import Sidebar from "vuepress-theme-hope/modules/sidebar/components/Sidebar.js";
import AdPage from "./AdPage.vue"
</script>
<style lang="scss">
.sidebar-group {
  .sidebar-group {
    padding-inline-start: 1em;
  }
}

.sidebar-heading {
  font-size: 1em;
}

</style>
