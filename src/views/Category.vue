<template>
  <div class="wrapper">
    <m-nav-bar></m-nav-bar>
    <section class="con-section">
      <div>{{activeTab}}</div>
      <div style="margin-bottom: 15px">{{JSON.stringify(categoryGetters, null, 2)}}</div>
      <div style="margin-bottom: 15px">{{JSON.stringify(categorySubGetters, null, 2)}}</div>
      <div style="margin-bottom: 15px">{{JSON.stringify(goodListGetters, null, 2)}}</div>
    </section>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { categoryStore } from '../store/category';
import { ResData, CategorySubParams, CategorySubLimitParams } from '../interface/index';
import mNavBar from '@/components/navBar';

export default {
  components: {
    mNavBar
  },
  setup() {
    const {globalProperties} = getCurrentInstance().appContext.config;
    const router = useRouter();
    const route = useRoute();
    const categoryState = categoryStore();
    const activeTab = ref(route.query.categoryId)
    const {
      categoryGetters,
      categorySubGetters,
      goodListGetters,
    } = storeToRefs(categoryState);

    const page = {
      pageNo: 1,
      pageSize: 10
    }

    // 根据商品类别获取商品列表,分页查询
    const getGoodsListByCategorySubID = async (categorySubId:string)=> {
      const params:CategorySubLimitParams = {
        categorySubId,
        ...page
      }
      const goodsRes:ResData = await categoryState.getLimitByCategorySubID(params); 
      globalProperties.$toast.clear();
      if (goodsRes.code === 0) {
        categoryState.$patch(()=> {
          categoryState.goodList = goodsRes.data.list || []
        })
      }
    }

    // 获取商品小类数据
    const getCategorySubList = async (params:CategorySubParams)=> {
      const subRes:ResData = await categoryState.getCategorySubData(params);
      if (subRes.code === 0) {
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

      // 获取商品大类列表
      const categoryRes:ResData = await categoryState.getCategoryData();

      if (categoryRes.code === 0) {
        categoryState.$patch(()=> {
          categoryState.category = categoryRes.data || []
          getCategorySubList({categoryId: activeTab.value ? activeTab.value : categoryState.category[0].ID})
        })
      }
    }

    onMounted(()=> {
      initData();
    })
    return {
      activeTab,
      categoryGetters,
      categorySubGetters,
      goodListGetters,
    }
  },
}
</script>

<style lang="less" scoped>
  .wrapper {
      width: 750px;
  }
  .con-section {
      width: 100%;
  }
</style>
