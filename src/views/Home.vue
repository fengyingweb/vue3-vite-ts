<template>
  <div class="wrapper">
    <m-nav-bar right-text="注册" class="m-bar" @click-right="onClickRight"></m-nav-bar>

    <div class="content">
      <div class="btn-wrapper" v-display-style-control="{styleMap: {0: 'background: yellow'}, value: 0}"></div>
      <van-grid :border="false" :column-num="2" :gutter="16">
        <van-grid-item
          v-for="item in distributeType"
          :key="item.type"
          :text="item.name"
          class="grid-item"
          @click="handleGridClick(item.type)">
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, reactive, toRefs, onMounted, getCurrentInstance } from 'vue'
import {useRouter} from 'vue-router'
import {mallStore} from '../store/mall'
import {storeToRefs} from 'pinia'
import { Grid, GridItem } from 'vant'
export default defineComponent({
  components: {
    mNavBar: defineAsyncComponent(()=> import('@/components/navBar')),
    [Grid.name]: Grid,
    [GridItem.name]: GridItem
  },
  setup() {
    const {globalProperties} = getCurrentInstance().appContext.config
    const router = useRouter();
    const mallState = mallStore();
    const homeState = reactive({
      distributeType: [
        {
          name: '呼叫1',
          icon: "",
          type: 'materialDelivery'
        },
        {
          name: "呼叫2",
          icon: "",
          type: 'receiveWarehousing'
        },
        {
          name: '呼叫3',
          icon: "",
          type: 'callEmptyCar'
        },
        {
          name: "呼叫4",
          icon: "",
          type: 'pointToPointCall'
        }
      ]
    })
    const {_allGoodsList} = storeToRefs(mallState)

    const handleGridClick = (type)=> {
      console.log('handleGridClick type = ', type)
      router.push({ path: `/${type}`})
    }

    const onClickRight = (ev)=> {
      router.push({path: '/register'});
    }

    async function initData() {
      globalProperties.$toast.loading({
        duration: 0,
        message: '加载中...',
        forbidClick: true
      })
      let res = await mallState.getAllGoodsInfo()
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
      allGoodsList: _allGoodsList,
      handleGridClick,
      onClickRight
    }
  },
})
</script>

<style lang="less" scoped>
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    .btn-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 40px auto;
      width: 240px;
      height: 72px;
      background: #f56;
      border-radius: 8px;
      font-size: 28px;
      color: #fff;
      position: sticky;
      position: -webkit-sticky;
      top: 0px;
      z-index: 100;
    }
  }
</style>

<style lang="less">
  .grid-item {
      .van-grid-item__content {
        background: #f56;
      }
      .van-grid-item__text {
        color: #fff;
      }
  }
</style>
