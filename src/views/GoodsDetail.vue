<template>
  <div class="wrapper">
    <m-nav-bar :fixed="false"></m-nav-bar>
    <section class="con-section">
      <div class="detail-banner">
        <img class="banner-img" v-lazy="goodsDetail.IMAGE1" :alt="goodsDetail.NAME" />
      </div>
      <div class="goods-info">
        <div class="goods-title">{{goodsDetail.NAME}}</div>
        <div class="goods-prize">￥{{moneyFilter(goodsDetail.PRESENT_PRICE)}}</div>
      </div>
      <div class="goods-tab">
        <van-tabs v-model:active="activeTab" border sticky swipeable>
          <van-tab title="商品详情">
            <div class="detail-img-wrapper" v-html="goodsDetail.DETAIL"></div>
          </van-tab>
          <van-tab title="评论">
            <div class="comment-wrapper">
              <h3>评论制作中...</h3>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </section>
    <footer class="goods-footer">
      <div class="flex-row justify-between align-center goods-tabbar">
        <div class="flex-row align-center tabbar-left">
          <div class="flex-column align-center">
            <van-icon name="service-o" size="20px" color="#333" />
            <span class="tabbar-left-tip">客服</span>
          </div>
          <div class="flex-column align-center mr-l" @click="goShopCar">
            <van-icon name="shopping-cart-o" size="20px" color="#333" />
            <span class="tabbar-left-tip">购物车</span>
          </div>
        </div>
        <div class="flex-row justify-between align-center tabbar-right">
          <van-button class="tabbar-right-btn" round size="small" color="linear-gradient(to right, #ff6034, #ee0a24)">加入购物车</van-button>
          <van-button class="tabbar-right-btn" round size="small" color="linear-gradient(to right, #ff6034, #ee0a24)">立即购买</van-button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { ref, reactive, toRefs, onMounted, getCurrentInstance, } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { queryDetailGoodsInfo, } from '../http/mall';
import { DetailParams, ResData, } from '../interface';
import mNavBar from '@/components/navBar';
import { Tab, Tabs, } from 'vant';

export default {
  components: {
    mNavBar,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
  },
  setup() {
    const {globalProperties} = getCurrentInstance().appContext.config;
    const router = useRouter();
    const route = useRoute();
    const activeTab = ref(0);
    const detailState = reactive({
      goodsDetail: {}
    })
    const goodsId:string = route.query.goodsId

    // 初始化数据
    const initData = async ()=> {
      globalProperties.$toast.loading({
        duration: 0,
        message: '加载中...',
        forbidClick: true
      });
      const params:DetailParams = {
        goodsId,
      };
      const detailRes:ResData = await queryDetailGoodsInfo(params);
      globalProperties.$toast.clear();
      if (detailRes.code === 0) {
        detailState.goodsDetail = detailRes.data;
      }
    }

    const moneyFilter = (money = 0)=> {
      return money.toFixed(2)
    }

    const goShopCar = ()=> {
        router.push({path: '/shopcar'})
    }

    onMounted(()=> {
      initData();
    })
    return {
      ...toRefs(detailState),
      activeTab,
      moneyFilter,
      goShopCar,
    }
  }
}
</script>

<style lang="less" scoped>
  .wrapper {
      width: 750px;
  }
  .con-section {
      width: 100%;
  }
  .detail-banner {
      margin-bottom: 20px;
      width: 100%;
  }
  .banner-img {
      display: block;
      width: 100%;
  }
  .goods-info {
      border-bottom: 2px solid #eee;
      padding: 20px 32px;
      width: 100%;
      background: #fff;
      font-size: 28px;
      color: #333;
  }
  .goods-title {
      line-height: 48px;
      font-size: 32px;
  }
  .goods-prize {
      color: #f56;
  }
  .goods-tab {
      width: 100%;
  }
  .detail-img-wrapper {
      width: 100%;
  }
  .comment-wrapper {
      padding: 20px 32px;
      width: 100%;
      height: 100vh;
  }
  .goods-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
  }
  .goods-tabbar {
      padding: 0 24px;
      width: 100%;
      height: 100px;
      background: #fff;
      &>div {
          flex-basis: 50%;
      }
  }
  .tabbar-right-btn {
      padding-left: 26px;
      padding-right: 26px;
  }
  .tabbar-left-tip {
      font-size: 24px;
      color: #333;
  }
  .mr-l {
      margin-left: 20px;
  }
</style>