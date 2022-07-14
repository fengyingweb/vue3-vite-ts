<template>
  <div>
    <router-view v-slot="{ Component }">
      <transition
        name="slide"
        mode="out-in"
        enter-active-class="slideInRight"
        leave-active-class="slideOutLeft">
        <keep-alive v-if="$route.meta.keepAlive">
          <component :is="Component"></component>
        </keep-alive>
        <component v-else :is="Component"></component>
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import { appStore } from './store';
export default {
  setup() {
    const store = appStore();
    store.initApp()
    return {
      
    }
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
