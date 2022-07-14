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
    </section>
  </div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted, getCurrentInstance } from 'vue';
import {useRouter} from 'vue-router';
import {mallStore} from '../store/mall';
import {storeToRefs} from 'pinia';
import { ResData } from '../interface/index';
import { Col, Row, Search, Swipe, SwipeItem } from 'vant';
export default {
  name: 'Home',
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Search.name]: Search,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
  },
  setup() {
    const {globalProperties} = getCurrentInstance().appContext.config;
    const router = useRouter();
    const mallState = mallStore();
    const homeState = reactive({
      searchVal: ''
    });
    const {_allGoodsList} = storeToRefs(mallState);

    const searchShop = (val:string)=> {
      console.log(val)
    }
    const clickLeftIcon = ()=> {
      console.log(homeState.searchVal)
    }
    const onClickRight = ()=> {
      router.push({path: '/login'});
    }

    async function initData() {
      globalProperties.$toast.loading({
        duration: 0,
        message: '加载中...',
        forbidClick: true
      })
      const res:ResData = await mallState.getAllGoodsInfo()
      globalProperties.$toast.clear()
      if (res.code === 0) {
        mallState.$patch(()=> {
          mallState.allGoodsList = res.data
        })
      }
    }
    onMounted(()=> {
      initData()
    })
    return {
      ...toRefs(homeState),
      onClickRight,
      searchShop,
      clickLeftIcon,
    }
  },
}
</script>

<style lang="less" scoped>
  .wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
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
        width: 750px;
      }
  }
</style>
