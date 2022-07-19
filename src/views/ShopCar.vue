<template>
  <div class="wrapper">
    <m-nav-bar></m-nav-bar>
    <section class="con-section">
      <h3>购物车制作中...</h3>
    </section>
  </div>
</template>

<script lang="ts">
import mNavBar from '@/components/navBar';

export default {
  components: {
    mNavBar
  },
  setup() {
    return {}
  },
}
</script>

<style lang="less" scoped>
  .wrapper {
      width: 100%;
  }
  .con-section {
      padding: 32px;
  }
</style>
