<template>
  <div class="wrapper">
    <header class="header-bar">
      <van-row class="header-row" align="center" gutter="10">
        <van-col span="4" class="location-col">
          <van-icon name="location-o" color="#fff" size="20px" />
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
        <van-col span="4" class="login-col" @click="onClickRight">登录</van-col>
      </van-row>
    </header>

    <section class="con-section">
      <!--start banner-->
      <section class="banner-wrapper">
        <van-swipe :autoplay="3000" indicator-color="#07c160" lazy-render>
          <van-swipe-item v-for="item in bannerListsGetters" :key="item.goodsId" @click="clickBanner(item.goodsId)">
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
    </section>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted, getCurrentInstance } from 'vue';
import {useRouter} from 'vue-router';
import {mallStore} from '../store/mall';
import {storeToRefs} from 'pinia';
import { ResData } from '../interface/index';
import { Col, Row, Search, Swipe, SwipeItem, Grid, GridItem } from 'vant';
export default {
  name: 'Home',
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Search.name]: Search,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem
  },
  setup() {
    const {globalProperties} = getCurrentInstance().appContext.config;
    const router = useRouter();
    const mallState = mallStore();
    const homeState = reactive({
      searchVal: ''
    });
    const {
      bannerListsGetters,
      indexCategoryGetters,
      adBannerGetters,
    } = storeToRefs(mallState);

    const searchShop = (val:string)=> {
      console.log(val)
    }
    const clickLeftIcon = ()=> {
      console.log(homeState.searchVal)
    }
    const onClickRight = ()=> {
      router.push({path: '/login'});
    }

    const initData = async ()=> {
      globalProperties.$toast.loading({
        duration: 0,
        message: '加载中...',
        forbidClick: true
      })
      const res:ResData = await mallState.getAllGoodsIndex()
      globalProperties.$toast.clear()
      console.log(res)
      if (res.code === 0) {
        mallState.$patch(()=> {
          mallState.bannerLists = res.data.slides;
          mallState.indexCategory = res.data.category;
          mallState.adBanner = res.data.advertesPicture.PICTURE_ADDRESS;
        })
      }
    }
    
    // 点击banner
    const clickBanner = (goodsId: string)=> {
      console.log(goodsId)
    }

    // 点击grid
    const clickGrid = (mallCategoryId: string)=> {
      console.log(mallCategoryId)
    }
    onMounted(()=> {
      initData()
    })
    return {
      ...toRefs(homeState),
      bannerListsGetters,
      indexCategoryGetters,
      adBannerGetters,
      onClickRight,
      searchShop,
      clickLeftIcon,
      clickBanner,
      clickGrid,
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
