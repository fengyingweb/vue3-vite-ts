<template>
  <div class="wrapper">
    <m-nav-bar></m-nav-bar>
    <section class="con-section">
      <h3>购物车制作中...</h3>
    </section>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import mNavBar from '@/components/navBar';
import shopCarStore from '../store/shopCar';
import {storeToRefs} from 'pinia';
export default {
  components: {
    mNavBar
  },
  setup() {
    const shopCarState = shopCarStore();
    const initData = () => {
      shopCarState.$patch(()=> {
        shopCarState.shopCarCount = 3
      })
    }
    // initData()
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
