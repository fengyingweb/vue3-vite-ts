<template>
  <div class="wrapper">
    <m-nav-bar :fixed="false" ref="navBar"></m-nav-bar>
    <section class="con-section">
      <van-tabs v-model:active="activeTab" @change="changeTabs" ref="tabs" swipeable>
        <van-tab
          v-for="category in categoryGetters"
          :key="category._id"
          :title="category.MALL_CATEGORY_NAME">
          <van-row>
            <van-col span="6">
              <ul class="col-left" :style="heightStyle">
                <li
                  v-for="subItem in categorySubGetters"
                  :key="subItem._id"
                  :class="['left-item', categorySubId === subItem.ID && 'active-left']"
                  @click="clickCategorySub(subItem.ID)">
                  {{subItem.MALL_SUB_NAME}}
                </li>
              </ul>
            </van-col>
            <van-col span="18">
              <transition
                name="fade"
                mode="out-in">
                <div v-if="goodListGetters.length > 0" class="goods-wrapper" :style="heightStyle">
                  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                    <van-list
                      v-model:loading="loadingList"
                      :finished="finished"
                      finished-text="没有更多了"
                      :immediate-check="false"
                      offset="100"
                      @load="onLoad"
                    >
                      <van-grid :column-num="2">
                        <van-grid-item
                          v-for="goodsItem in goodListGetters"
                          :key="goodsItem.ID"
                          class="goods-item"
                          @click="clickGoods(goodsItem.SHOP_ID)">
                          <template #icon>
                            <img class="goods-img" v-lazy="goodsItem.IMAGE1" alt="图片不存在" />
                          </template>
                          <template #text>
                            <div class="goods-desc">{{goodsItem.NAME}}</div>
                            <div>￥{{moneyFilter(goodsItem.PRESENT_PRICE)}}</div>
                          </template>
                        </van-grid-item>
                      </van-grid>
                    </van-list>
                  </van-pull-refresh>
                </div>
              </transition>
            </van-col>
          </van-row>
        </van-tab>
      </van-tabs>
    </section>
  </div>
</template>

<script lang="ts">
import { computed, ref, onMounted, getCurrentInstance, nextTick, } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { categoryStore } from '../store/category';
import { ResData, CategorySubParams, CategorySubLimitParams } from '../interface/index';
import mNavBar from '@/components/navBar';
import { Col, Row, Tab, Tabs, PullRefresh, List, } from 'vant';

export default {
  components: {
    mNavBar,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Col.name]: Col,
    [Row.name]: Row,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
  },
  setup() {
    const {globalProperties} = getCurrentInstance().appContext.config;
    const router = useRouter();
    const route = useRoute();
    const categoryState = categoryStore();
    const categoryId = ref(route.query.categoryId);
    const categorySubId = ref('');
    const activeTab = ref(0);
    const height = ref(window.innerHeight);
    const navBar = ref();
    const tabs = ref();
    const refreshing = ref(false);
    const loadingList = ref(false);
    const finished = ref(false);

    let loadingSub = false;
    let loadingGoods = false;
    const {
      categoryGetters,
      categorySubGetters,
      goodListGetters,
    } = storeToRefs(categoryState);

    const heightStyle = computed(()=> {
      return {
        height: `${height.value}px`
      }
    })

    const page = {
      pageNo: 1,
      pageSize: 8
    }

    // 根据商品类别获取商品列表,分页查询
    const getGoodsListByCategorySubID = async (categorySubId:string)=> {
      if (loadingGoods) return;
      loadingGoods = true;
      const params:CategorySubLimitParams = {
        categorySubId,
        ...page
      }
      const goodsRes:ResData = await categoryState.getLimitByCategorySubID(params);
      globalProperties.$toast.clear();
      loadingGoods = false;
      loadingList.value = false;
      if (goodsRes.code === 0) {
        finished.value = goodsRes.data.list.length <=0 ? true : false;
        categoryState.$patch(()=> {
          if (refreshing.value) {
            categoryState.goodList = [
              ...goodsRes.data.list,
              ...categoryState.goodList
            ]
            refreshing.value = false;
          } else {
            categoryState.goodList = [
              ...categoryState.goodList,
              ...goodsRes.data.list
            ]
          }
        })
      } else {
        refreshing.value = false;
      }
    }

    // 获取商品小类数据
    const getCategorySubList = async (params:CategorySubParams)=> {
      if (loadingSub) return;
      loadingSub = true;
      globalProperties.$toast.loading({
        duration: 0,
        message: '加载中...',
        forbidClick: true
      });
      const subRes:ResData = await categoryState.getCategorySubData(params);
      loadingSub = false;
      if (subRes.code === 0) {
        categorySubId.value = subRes.data[0].ID;
        categoryState.$patch(()=> {
          categoryState.categorySub = subRes.data || [];
          getGoodsListByCategorySubID(categoryState.categorySub[0].ID);
        })
      }
    }

    // 初始化
    const initData = async ()=> {
      globalProperties.$toast.loading({
        duration: 0,
        message: '加载中...',
        forbidClick: true
      });
      activeTab.value = categoryId.value ? (Number(categoryId.value) - 1) : 0;
      categoryState.$patch(()=> {
          categoryState.goodList = []
      })
      // 获取商品大类列表
      const categoryRes:ResData = await categoryState.getCategoryData();

      if (categoryRes.code === 0) {
        categoryState.$patch(()=> {
          categoryState.category = categoryRes.data || []
          getCategorySubList({categoryId: categoryId.value ? categoryId.value : categoryState.category[0].ID})
        })
      }
      nextTick(()=> {
        const navBarHeight = navBar.value.$el.offsetHeight;
        const tabsHeight = tabs.value.$el.firstElementChild.offsetHeight
        height.value = window.innerHeight - (navBarHeight + tabsHeight);
      })
    }

    // 点击tabs
    const changeTabs = (val:number)=> {
      categoryId.value = categoryState.category[val].ID;
      page.pageNo = 1;
      categoryState.$patch(()=> {
          categoryState.goodList = []
      });
      getCategorySubList({categoryId: categoryId.value});
    }

    // 点击子类
    const clickCategorySub = (id:string)=> {
      categorySubId.value = id;
      page.pageNo = 1;
      categoryState.$patch(()=> {
          categoryState.goodList = []
      });
      globalProperties.$toast.loading({
        duration: 0,
        message: '加载中...',
        forbidClick: true
      });
      getGoodsListByCategorySubID(categorySubId.value);
    }

    // 上拉加载
    const onLoad = ()=> {
      page.pageNo += 1;
      getGoodsListByCategorySubID(categorySubId.value);
    }

    // 下拉刷新
    const onRefresh = ()=> {
      // 清空列表数据
      finished.value = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      loadingList.value = true;
      onLoad();
    }

    const moneyFilter = (money = 0)=> {
      return money.toFixed(2)
    }

    // 点击商品
    const clickGoods = (goodsId:string)=> {
      console.log(goodsId);
      router.push({
        path: '/goodsDetail',
        query: {
          goodsId,
        }
      })
    }

    onMounted(()=> {
      initData();
    })
    return {
      activeTab,
      categorySubId,
      categoryGetters,
      categorySubGetters,
      goodListGetters,
      heightStyle,
      navBar,
      tabs,
      refreshing,
      loadingList,
      finished,
      changeTabs,
      clickCategorySub,
      onRefresh,
      onLoad,
      moneyFilter,
      clickGoods,
    }
  },
}
</script>

<style lang="less" scoped>
  .wrapper {
      width: 750px;
      height: 100vh;
      overflow: hidden;
  }
  .con-section {
      width: 100%;
  }
  .col-left {
      border-right: 2px solid #eee;
      padding-bottom: 100px;
      width: 100%;
      background: #fff;
  }
  .left-item {
      border-bottom: 2px solid #eee;
      width: 100%;
      line-height: 72px;
      text-align: center;
      font-size: 28px;
      color: #333;
      transition: all .5s;
  }
  .active-left {
      border-bottom-color: #07c160;
      background: #07c160;
      color: #fff;
  }
  .goods-wrapper {
      padding-bottom: 100px;
      width: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
  }
  .goods-item {
      width: 281px;
  }
  .goods-img {
      display: block;
      width: 80%;
  }
  .goods-desc {
      width: 80%;
      line-height: 48px;
      text-align: center;
      font-size: 28px;
      color: #333;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
  }
</style>
