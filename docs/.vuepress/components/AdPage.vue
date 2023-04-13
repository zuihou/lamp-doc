<template>
  <div :class="`wwads-cn wwads-${mode} page-wwads`" data-id="231"></div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    mode: {
      type: String,
      default: 'horizontal',
    },
  }

});

</script>
<style>
.page-wwads{
  width:100%!important;
  min-height: 0;
  margin: 0;
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
