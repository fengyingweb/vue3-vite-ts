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
    <van-tabbar v-if="hasTabBar" v-model="activeBar" active-color="#07c160" :safe-area-inset-bottom="true">
      <van-tabbar-item
        v-for="item in tabBarList"
        :key="item.name"
        :name="item.name"
        :icon="item.icon"
        :to="item.to">
        {{item.title}}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script lang="ts">
import { reactive, computed, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import { appStore } from './store';
import { Tabbar, TabbarItem } from 'vant';
export default {
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
  },
  setup() {
    const route = useRoute();
    const store = appStore();
    const tabBarState = reactive({
      tabBarList: [
        {
          name: 'Home',
          icon: 'shop',
          to: '/',
          title: '商城'
        },
        {
          name: 'Category',
          icon: 'bars',
          to: '/category',
          title: '分类'
        },
        {
          name: 'ShopCar',
          icon: 'shopping-cart',
          to: '/shopcar',
          title: '购物车'
        },
        {
          name: 'Members',
          icon: 'vip-card',
          to: '/members',
          title: '会员中心'
        }
      ]
    });
    const activeBar = computed(()=> {
      return route.name
    });
    const hasTabBar = computed(()=> {
      return activeBar.value !== 'Login' && activeBar.value !== 'Register';
    })
    store.initApp()
    return {
      activeBar,
      hasTabBar,
      ...toRefs(tabBarState),
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
