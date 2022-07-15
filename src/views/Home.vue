<template>
  <div class="main">
    <router-view v-slot="{ Component }">
      <transition
        name="fade"
        mode="out-in">
        <component :is="Component"></component>
      </transition>
    </router-view>
    <van-tabbar v-model="activeBar" active-color="#07c160" :safe-area-inset-bottom="true">
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
import { Tabbar, TabbarItem } from 'vant';
export default {
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
  },
  setup() {
    const route = useRoute();
    const tabBarState = reactive({
      tabBarList: [
        {
          name: 'Mall',
          icon: 'shop',
          to: '/mall',
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
    return {
      activeBar,
      ...toRefs(tabBarState),
    }
  }
}
</script>

<style lang="less" scoped>
  .main {
    padding-bottom: 132px;
    min-height: 100vh;
  }
</style>
