<template>
  <div :class="['main', activeBar === 'Category' && 'category-main']">
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
        :badge="item.badge ? item.badge : undefined"
        @click="clickTabbarItem(item)">
        {{item.title}}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script lang="ts">
import { reactive, computed, toRefs, getCurrentInstance } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import userStore from '../store/user';
import shopCarStore from '../store/shopCar';
import {storeToRefs} from 'pinia';
import { Tabbar, TabbarItem } from 'vant';

interface BarItem {
  name: string
  icon: string
  to: string
  title: string
  [key: string]: any
}
export default {
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
  },
  setup() {
    // @ts-ignore
    const {globalProperties} = getCurrentInstance().appContext.config;
    const route = useRoute();
    const router = useRouter();
    const {userInfo} = userStore();
    const shopCarState = shopCarStore();
    const {shopCarCountG} = storeToRefs(shopCarState)
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
          title: '购物车',
          badge: shopCarCountG
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

    const clickTabbarItem = (item: BarItem) => {
      if ((item.name === 'ShopCar' || item.name === 'Members') && !userInfo?.userName) {
        globalProperties.$dialog.confirm({
          title: '温馨提示',
          message: '您还没有登录，请先登录!',
          confirmButtonText: '去登录'
        }).then(()=> {
          router.push({path: '/login'})
        }).catch(()=> {})
        return
      }
      router.push({path: item.to})
    }
    return {
      ...toRefs(tabBarState),
      activeBar,
      clickTabbarItem
    }
  }
}
</script>

<style lang="less" scoped>
  .main {
      padding-bottom: 132px;
      min-height: 100vh;
  }
  .category-main {
      height: 100vh;
      overflow: hidden;
  }
</style>