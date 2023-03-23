<template>
  <div class="wrapper">
    <m-nav-bar></m-nav-bar>
    <section class="con-section">
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
// @ts-ignore
import mNavBar from '@/components/navBar'
// import * as THREE from 'three'
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// console.log(OrbitControls)
// console.log(THREE)
</script>

<style lang="less" scoped>
  .wrapper {
      width: 100%;
      min-height: 100vh;
      background: #fff;
  }
  .con-section {
      padding: 32px;
      width: 100%;
  }
</style>
