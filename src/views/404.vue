<template>
  <div class="wrapper">
    <m-nav-bar></m-nav-bar>
    <section class="con-section">
      404 Not Found Page
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
// @ts-ignore
import mNavBar from '@/components/navBar'
onMounted(()=> {
})
</script>

<style lang="less" scoped>
  .wrapper {
      width: 100%;
      min-height: 100vh;
      background: #fff;
  }
</style>
