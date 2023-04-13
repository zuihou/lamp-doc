<template>
  <div :class="`wwads-cn wwads-${mode} page-wwads page-wwads-${content}`" data-id="231"></div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    mode: {
      type: String,
      default: 'horizontal',
    },
    content: {
      type: String,
      default: '',
    },
  }

});

</script>
<style>
@use "vuepress-shared/styles/wrapper";

.page-wwads {
  width:100%!important;
  min-height: 0;
  margin: 0;

}
.page-wwads-content {
  max-width: var(--content-width, 740px);
  margin: 0 auto;
}
.page-wwads .wwads-img img {
  width:80px!important;
}
.page-wwads .wwads-poweredby {

  width: 40px;
  position: absolute;
  right: 25px;
  bottom: 3px;
}
.wwads-content .wwads-text, .page-wwads .wwads-text {
  height: 100%;
  padding-top: 5px;
  display: block;
}
</style>
