<template>
  <div class="wrapper">
    <header class="header-bar">
      <van-row class="header-row" align="center" gutter="10">
        <van-col span="4" class="location-col">
          <van-icon name="location-o" color="#fff" size="20px" @click="goAmap" />
        </van-col>
        <van-col span="16">
          <van-search
            v-model="searchVal"
            placeholder="请输入搜索关键词"
            shape="round"
            background="transparent"
            class="search-bar"
            @search="searchShop"
            @click-left-icon="clickLeftIcon">
          </van-search>
        </van-col>
        <van-col v-if="!userInfo" span="4" class="login-col" @click="onClickRight">登录</van-col>
        <van-col v-else span="4" class="user-col" @click="goMembers">
          <van-icon name="user-circle-o" color="#fff" size="20px" />
          <span>{{userInfo.userName}}</span>
        </van-col>
      </van-row>
    </header>

    <section class="con-section">
      <!--start banner-->
      <section class="banner-wrapper">
        <van-swipe :autoplay="3000" indicator-color="#07c160" lazy-render>
          <van-swipe-item v-for="item in bannerListsGetters" :key="item.goodsId" @click="clickGoods(item.goodsId)">
            <img class="swipe-img" :src="item.image" alt="图片不存在" />
          </van-swipe-item>
        </van-swipe>
      </section>
      <!--end banner-->

      <!--start grid-->
      <section class="grid-wrapper">
        <van-grid :gutter="10" :column-num="5" :border="false">
          <van-grid-item v-for="item in indexCategoryGetters"
            :key="`${item.mallCategoryName}_${item.mallCategoryId}`"
            class="grid-item"
            @click="clickGrid(item.mallCategoryId)">
            <div class="flex-column align-center">
              <img class="grid-img" v-lazy="item.image" :alt="item.mallCategoryName">
              <span class="grid-text">{{item.mallCategoryName}}</span>
            </div>
          </van-grid-item>
        </van-grid>
      </section>
      <!--end grid-->

      <!--start 公告-->
      <section class="ad-banner-wrapper">
        <img class="ad-img" v-lazy="adBannerGetters" alt="图片不存在"/>
      </section>
      <!--end 公告-->

      <!--start recommend-->
      <section class="recommend-wrapper">
        <h3 class="recommend-title">商品推荐</h3>
        <div class="recommend-body">
          <swiper
            :slides-per-view="3">
            <swiper-slide v-for="item in recommendGoodsGetters " :key="item.goodsId" @click="clickGoods(item.goodsId)">
              <div class="recommend-item">
                <img class="recommend-img" :src="item.image" :alt="item.goodsName" />
                <div>{{item.goodsName}}</div>
                <div>￥{{moneyFilter(item.price)}}(￥{{moneyFilter(item.mallPrice)}})</div>
              </div>
            </swiper-slide> 
          </swiper>
        </div>
      </section>
      <!---end recommend-->
      <!--start floor-->
      <section class="floor-wrapper">
        <floor :floor-title="floorNameGetters.floor1" :floor-data="floor1Getters" @click="clickGoods"></floor>
        <floor :floor-title="floorNameGetters.floor2" :floor-data="floor2Getters" @click="clickGoods"></floor>
        <floor :floor-title="floorNameGetters.floor3" :floor-data="floor3Getters" @click="clickGoods"></floor>
      </section>
      <!--end floor-->

      <!--start hot goods-->
      <hot-goods title="热卖商品" :hot-goods-list="hotGoodsGetters" @click="clickGoods"></hot-goods>
      <!--end hot goods-->
    </section>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted, getCurrentInstance } from 'vue';
import {useRouter} from 'vue-router';
import {mallStore} from '../store/mall';
import userStore from '../store/user';
import {storeToRefs} from 'pinia';
import { ResData } from '../interface/index';
// @ts-ignore
import Floor from '../components/floor/index';
// @ts-ignore
import HotGoods from '../components/hotGoods/index';
import { Col, Row, Search, Swipe, SwipeItem, } from 'vant';
import {Swiper , SwiperSlide} from 'vue-awesome-swiper';
export default {
  name: 'Home',
  components: {
    Swiper,
    SwiperSlide,
    Floor,
    HotGoods,
    [Row.name]: Row,
    [Col.name]: Col,
    [Search.name]: Search,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
  },
  setup() {
    // @ts-ignore
    const {globalProperties} = getCurrentInstance().appContext.config;
    const router = useRouter();
    const mallState = mallStore();
    const userState = userStore();
    const homeState = reactive({
      searchVal: ''
    });
    const {
      bannerListsGetters,
      indexCategoryGetters,
      adBannerGetters,
      recommendGoodsGetters,
      floor1Getters,
      floor2Getters,
      floor3Getters,
      floorNameGetters,
      hotGoodsGetters,
    } = storeToRefs(mallState);
    const {userInfo} = storeToRefs(userState);
    console.log(userInfo)
    const searchShop = (val:string)=> {
      console.log(val)
    }
    const clickLeftIcon = ()=> {
      console.log(homeState.searchVal)
    }
    const onClickRight = ()=> {
      router.push({path: '/login'});
    }
    const goMembers = ()=> {
      router.push({path: '/members'});
    }
    const initData = async ()=> {
      globalProperties.$toast.loading({
        duration: 0,
        message: '加载中...',
        forbidClick: true
      })
      // @ts-ignore
      const res:ResData = await mallState.getAllGoodsIndex()
      globalProperties.$toast.clear()
      console.log(res)
      if (res.code === 0) {
        mallState.$patch(()=> {
          mallState.bannerLists = res.data.slides;
          mallState.indexCategory = res.data.category;
          mallState.adBanner = res.data.advertesPicture.PICTURE_ADDRESS;
          mallState.recommendGoods = res.data.recommend;
          mallState.floor1 = res.data.floor1;
          mallState.floor2 = res.data.floor2;
          mallState.floor3 = res.data.floor3;
          mallState.floorName = res.data.floorName;
          mallState.hotGoods = res.data.hotGoods;
        })
      }
    }
    
    // 点击商品
    const clickGoods = (goodsId: string)=> {
      console.log(goodsId);
      router.push({
        path: '/goodsDetail',
        query: {
          goodsId,
        }
      });
    }
    // 点击grid
    const clickGrid = (mallCategoryId: string)=> {
      console.log(mallCategoryId)
      router.push({
        path: '/category',
        query: {
          categoryId: mallCategoryId
        }
      })
    }
    const moneyFilter = (money = 0)=> {
      return money.toFixed(2)
    }
    // 点击定位
    const goAmap = ()=> {
      router.push({path: '/aMap'})
    }
    onMounted(()=> {
      initData()
    })
    return {
      ...toRefs(homeState),
      bannerListsGetters,
      indexCategoryGetters,
      adBannerGetters,
      recommendGoodsGetters,
      floor1Getters,
      floor2Getters,
      floor3Getters,
      floorNameGetters,
      hotGoodsGetters,
      userInfo,
      onClickRight,
      goMembers,
      searchShop,
      clickLeftIcon,
      clickGoods,
      clickGrid,
      moneyFilter,
      goAmap,
    }
  },
}
</script>

<style lang="less" scoped>
  .wrapper {
       width: 750px;
      .header-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 750px;
          height: 92px;
          background: #07c160;
          overflow: hidden;
          z-index: 999;
      }
      .header-row {
          height: 100%;
      }
      .location-col {
          text-align: center;
      }
      .login-col {
          height: 100%;
          line-height: 92px;
          text-align: center;
          color: #fff;
          font-size: 28px;
      }
      .user-col {
        text-align: center;
        font-size: 28px;
        color: #fff;
      }
      .search-bar {
          padding: 0;
      }
      .con-section {
          padding-top: 92px;
          width: 100%;
      }
      .banner-wrapper {
          width: 750px;
      }
      .swipe-img {
          display: block;
          width: 750px;
      }
      .grid-wrapper {
          background: #fff;
      }
      .grid-img {
          display: block;
          margin-bottom: 10px;
          width: 93px;
      }
      .ad-banner-wrapper {
          margin: 10px 0;
          width: 100%;
          background: #fff;
      }
      .ad-img {
          display: block;
          width: 100%;
      }
      .recommend-wrapper {
          width: 100%;
      }
      .recommend-title {
          border-bottom: 2px solid #eee;
          padding-top: 16px;
          padding-bottom: 16px;
          padding-left: 32px;
          width: 100%;
          background: #fff;
          color: #f56;
      }
      .recommend-body {
          border-bottom: 2px solid #eee;
          width: 100%;
          background: #fff;
      }
      .recommend-item{
          width: 99%;
          border-right: 2px solid #eee;
          padding-left: 10px;
          padding-right: 10px;
          font-size: 24px;
          text-align: center;
      }
      .recommend-img {
          width: 80%;
      }
      .floor-wrapper {
          width: 100%;
      }
  }
</style>

<style lang="less">
  .grid-item {
      font-size: 28px;
      color: #333;
      .van-grid-item__content {
          padding: 20px 0;
      }
  }
</style>