<template>
  <div class="wrapper">
    <m-nav-bar></m-nav-bar>
    <section class="con-section">
      404 Not Found Page {{pathMatch[0]}}
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import {useRoute} from 'vue-router'
// @ts-ignore
import mNavBar from '@/components/navBar'

const route = useRoute()
const pathMatch = route.params.pathMatch
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
