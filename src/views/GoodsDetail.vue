<template>
  <div class="wrapper">
    <m-nav-bar :fixed="false"></m-nav-bar>
    <section class="con-section">
      <div class="detail-banner">
        <img class="banner-img" v-lazy="goodsDetail.IMAGE1" :alt="goodsDetail.NAME" />
        <transition name="trans-s" mode="out-in">
          <img v-show="animate" class="animate-img" v-lazy="goodsDetail.IMAGE1" :alt="goodsDetail.NAME">
        </transition>
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
            <div :class="{'shop-car': animate}" @webkitTransitionEnd="transitionEnd">
              <van-icon
              name="shopping-cart-o"
              size="20px"
              color="#333"
              :badge="shopCarCountG ? shopCarCountG : undefined" />
            </div>
            <span class="tabbar-left-tip">购物车</span>
          </div>
        </div>
        <div class="flex-row justify-between align-center tabbar-right">
          <van-button
            class="tabbar-right-btn"
            round
            size="small"
            color="linear-gradient(to right, #ff6034, #ee0a24)"
            @click="addShopCar">
            加入购物车
          </van-button>
          <van-button
            class="tabbar-right-btn"
            round
            size="small"
            color="linear-gradient(to right, #ff6034, #ee0a24)"
            @click="goShopping">
            立即购买
          </van-button>
        </div>
      </div>
    </footer>
    <van-popup
      v-model:show="showPopup"
      closeable
      round
      position="bottom"
      :safe-area-inset-bottom="true">
      <div class="popup-content">
        <div class="popup-goods-info">
          <img class="popup-goods-img" v-lazy="goodsDetail.IMAGE1" :alt="goodsDetail.NAME" />
          <div class="popup-goods-desc">
            <div class="goods-title">{{goodsDetail.NAME}}</div>
            <div class="goods-prize">￥{{moneyFilter(goodsDetail.PRESENT_PRICE)}}</div>
          </div>
        </div>
        <div class="popup-goods-nums">
          <div class="num-title">数量</div>
          <van-stepper v-model="goodsNums" theme="round" button-size="22" disable-input />
        </div>
        <div class="popup-btn">
          <van-button
            color="linear-gradient(to right, #ff6034, #ee0a24)"
            round
            block
            :loading="loadingConfirm"
            @click="confirmAddCar">确定</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { ref, reactive, toRefs, onMounted, getCurrentInstance, } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import userStore from '../store/user';
import shopCarStore from '../store/shopCar';
import {storeToRefs} from 'pinia';
import { queryDetailGoodsInfo, } from '../http/mall';
import { DetailParams, ResData, GoodsDetail} from '../interface';
// @ts-ignore
import mNavBar from '@/components/navBar';
import { Tab, Tabs, Stepper} from 'vant';

export default {
  components: {
    mNavBar,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Stepper.name]: Stepper
  },
  setup() {
    // @ts-ignore
    const {globalProperties} = getCurrentInstance().appContext.config;
    const router = useRouter();
    const route = useRoute();
    const activeTab = ref(0);
    const {userInfo} = userStore();
    const shopCarState = shopCarStore();
    const {shopCarCountG} = storeToRefs(shopCarState)
    const goodsDetail = ref<GoodsDetail>({
      ID: '',
      NAME: '',
      PRESENT_PRICE: 0,
      IMAGE1: ''
    })
    const animate = ref(false)
    const showPopup = ref(false)
    const goodsNums = ref(1)
    const loadingConfirm = ref(false)
    // @ts-ignore
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
      // @ts-ignore
      const detailRes:ResData = await queryDetailGoodsInfo(params);
      globalProperties.$toast.clear();
      if (detailRes.code === 0) {
        goodsDetail.value = detailRes.data;
      }
    }

    const moneyFilter = (money = 0)=> {
      return money.toFixed(2)
    }

    const goShopCar = ()=> {
      if (userInfo?.userName) {
        router.push({path: '/shopcar'})
      } else {
        globalProperties.$dialog.confirm({
          title: '温馨提示',
          message: '您还没有登录，请先登录!',
          confirmButtonText: '去登录'
        }).then(()=> {
          router.push({path: '/login'})
        }).catch(()=> {})
      }
    }

    const addShopCar = ()=> {
      if (!userInfo?.userName) {
        globalProperties.$dialog.confirm({
          title: '温馨提示',
          message: '您还没有登录，请先登录!',
          confirmButtonText: '去登录'
        }).then(()=> {
          router.push({path: '/login'})
        }).catch(()=> {})
        return
      }
      showPopup.value = true
    }

    const confirmAddCar = async ()=> {
      const params = {
        goodsId: goodsDetail.value?.ID,
        name: goodsDetail.value?.NAME,
        price: goodsDetail.value?.PRESENT_PRICE,
        image: goodsDetail.value?.IMAGE1,
        goodsNums: goodsNums.value,
        userId: userInfo.userId
      }
      loadingConfirm.value = true
      // @ts-ignore
      const res:ResData = await shopCarState.addCar(params)
      loadingConfirm.value = false
      if (res.code === 0 && res.data) {
        shopCarState.$patch(()=> {
          shopCarState.shopCarCount = res.data.total
          showPopup.value = false
          animate.value = true
        })
      }
    }

    const transitionEnd = () => {
      console.log('transitionEnd')
      animate.value = false;
    }

    const goShopping = ()=> {
      if (!userInfo?.userName) {
        globalProperties.$dialog.confirm({
          title: '温馨提示',
          message: '您还没有登录，请先登录!',
          confirmButtonText: '去登录'
        }).then(()=> {
          router.push({path: '/login'})
        }).catch(()=> {})
        return
      }
    }
    
    initData();
    onMounted(()=> {
      console.log('mounted')
    })
    return {
      goodsDetail,
      activeTab,
      shopCarCountG,
      animate,
      showPopup,
      goodsNums,
      loadingConfirm,
      moneyFilter,
      goShopCar,
      addShopCar,
      transitionEnd,
      goShopping,
      confirmAddCar
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
  .shop-car {
    transition: transform .8s;
    transform: rotate(-30deg);
  }
  .animate-img {
    position: fixed;
    top: 240px;
    left: 50%;
    width: 200px;
    height: 200px;
    margin-left: -100px;
    border-radius: 100px;
    z-index: 999;
  }
  .trans-s-enter-from {
    transform: translate(0, 0) scale(1.5);
    opacity: 0;
  }
  .trans-s-enter-active,
  .trans-s-leave-active {
    transition: all .8s;
  }
  .trans-s-leave-to {
    transform: translate(-246px, 920px) scale(0.1);
    opacity: 0;
  }
  .popup-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
  }
  .popup-goods-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 32px;
      width: 100%;
  }
  .popup-goods-img {
    border: 2px solid #e8e8e8;
    width: 200px;
    height: 200px;
    border-radius: 10px;
    overflow: hidden;
  }
  .popup-goods-desc {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-left: 32px;
    height: 200px;
  }
  .popup-goods-nums {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 32px 32px;
      width: 100%;
  }
  .num-title {
    font-weight: bold;
    font-size: 28px;
    color: #333;
  }
  .popup-btn {
      margin-top: 120px;
      padding: 32px;
      width: 100%;
  }
</style>