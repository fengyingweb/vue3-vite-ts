<template>
  <div class="wrapper">
    <m-nav-bar :right-text="rTextC" @click-right="clickNavRight"></m-nav-bar>
    <section class="con-section">
      <div v-if="shopCarListG.length" class="car-list-wrapper">
        <van-checkbox-group v-model="checked">
          <div
            v-for="item in shopCarListG"
            :key="item.shopCarId"
            class="car-list-item">
            <div class="car-item-top">
              <van-checkbox
              :name="item.shopCarId"
              checked-color="#ee0a24"/>
              <img class="car-goods-img" v-lazy="item.image" :alt="item.name" />
              <div class="car-goods-info">
                <div class="car-goods-desc">{{item.name}}</div>
                <div class="car-goods-other">
                  <div class="goods-prize">￥{{item.price}}</div>
                  <van-stepper
                    v-model="item.goodsNums"
                    theme="round"
                    button-size="22"
                    disable-input
                    @change="changeGoodsNums(item)" />
                </div>
              </div>
            </div>
          </div>
        </van-checkbox-group>
      </div>
      <div v-else class="no-car">
        <van-button type="default" round @click="goToHome">挑点喜欢的装进购物车</van-button>
      </div>
      <hot-goods title="为你推荐" :hot-goods-list="hotGoodsGetters" @click="clickGoods"></hot-goods>
    </section>

    <div v-if="shopCarListG.length" class="pay-footer">
      <div class="pay-inner">
        <div class="pay-left">
          <van-checkbox v-model="checkedAll" checked-color="#ee0a24" @click="clickAll">全选</van-checkbox>
          <div v-if="!clickedRight" class="pay-price">合计:￥{{payPrice}}</div>
        </div>
        <div class="pay-right">
          <van-button
            v-if="!clickedRight"
            round
            size="small"
            color="linear-gradient(to right, #ff6034, #ee0a24)"
            @click="goPay">
            去结算({{checked.length}})
          </van-button>
          <van-button
            v-else
            round
            :loading="loadingDel"
            size="small"
            color="linear-gradient(to right, #ff6034, #ee0a24)"
            @click="clickDel">
            删除
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, getCurrentInstance, watch } from 'vue';
import { useRouter } from 'vue-router'
// @ts-ignore
import mNavBar from '@/components/navBar';
import {mallStore} from '../store/mall';
import userStore from '../store/user';
import shopCarStore from '../store/shopCar';
import {storeToRefs} from 'pinia';
import { ResData, AddShopCarParams } from '../interface';
// @ts-ignore
import HotGoods from '../components/hotGoods/index';
import { Checkbox, CheckboxGroup, Stepper } from 'vant'

interface ShopCarData extends AddShopCarParams {
  shopCarId: string
}
export default {
  components: {
    mNavBar,
    HotGoods,
    [CheckboxGroup.name]: CheckboxGroup,
    [Checkbox.name]: Checkbox,
    [Stepper.name]: Stepper
  },
  setup() {
    // @ts-ignore
    const {globalProperties} = getCurrentInstance().appContext.config;
    const router = useRouter();
    const mallState = mallStore();
    const {userInfo} = userStore();
    const shopCarState = shopCarStore();
    const {
      hotGoodsGetters,
    } = storeToRefs(mallState);
    const {
      shopCarListG
    } = storeToRefs(shopCarState)
    const checked = ref<string[]>([])
    const checkedAll = ref(false)
    const rightText = ref('编辑')
    const rTextC = computed(()=> {
      return shopCarListG.value.length ? rightText.value : ''
    })
    const payPrice = computed(()=> {
      let checkedList = shopCarListG.value.filter((item: ShopCarData)=> {
        return checked.value.includes(item.shopCarId)
      })
      let sum = checkedList.reduce((acc: number, cur:ShopCarData)=> {
        acc = acc + cur.price * cur.goodsNums
        return acc
      }, 0)
      return sum.toFixed(2)
    })
    const loadingDel = ref(false)
    const goToHome = ()=> {
      router.replace({path: '/'})
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

    let loadingUpdate = false
    const changeGoodsNums = async (item: ShopCarData) => {
      const params = {
        goodsId: item.goodsId,
        userId: item.userId,
        goodsNums: item.goodsNums
      }
      if (loadingUpdate) return
      loadingUpdate = true
      // @ts-ignore
      const res: ResData = await shopCarState.updateNums(params)
      loadingUpdate = false
      if (res.code === 0 && res.data) {
        console.log(res.msg)
      }
    }
    
    const clickedRight = ref(false)
    const clickNavRight = ()=> {
      clickedRight.value = !clickedRight.value
      rightText.value = clickedRight.value ? '完成' : '编辑'
    }

    const clickAll = ()=> {
        checked.value = checkedAll.value ? shopCarListG.value.map((item:ShopCarData)=> item.shopCarId) : []
    }

    const goPay = ()=> {
      if (!checked.value.length) {
        globalProperties.$toast('您还没有选择商品哟！')
        return
      }
    }

    const clickDel = ()=> {
      if (!checked.value.length) {
        globalProperties.$toast('您还没有选择商品哟！')
        return
      }
      globalProperties.$dialog.confirm({
        title: '温馨提示',
        message: `确定要删除这${checked.value.length}种商品吗？`
      }).then(async ()=> {
        const params = {
          shopCarIdList: checked.value
        }
        if (loadingDel.value) return
        loadingDel.value = true
        // @ts-ignore
        const res: ResData = await shopCarState.deleteCar(params)
        loadingDel.value = false
        if (res.code === 0 && res.data) {
          checked.value = []
          initData()
        }
      }).catch(()=> {
        console.log('取消')
      })
    }

    const initData = async () => {
      globalProperties.$toast.loading({
        duration: 0,
        message: '加载中...',
        forbidClick: true
      })
      const params = {
        id: userInfo.userId
      }
      // @ts-ignore
      const res:ResData = await shopCarState.getShopCar(params)
      globalProperties.$toast.clear();
      if (res.code === 0 && res.data) {
        shopCarState.$patch(()=> {
          shopCarState.shopCarList = res.data.list
          shopCarState.shopCarCount = res.data.total
        })
      }
    }
    initData()
    watch(checked, (nval)=> {
      checkedAll.value = nval.length === shopCarListG.value.length ? true : false
    })
    return {
      shopCarListG,
      hotGoodsGetters,
      checked,
      checkedAll,
      rTextC,
      clickedRight,
      payPrice,
      loadingDel,
      goToHome,
      clickGoods,
      changeGoodsNums,
      clickNavRight,
      clickAll,
      goPay,
      clickDel
    }
  },
}
</script>

<style lang="less" scoped>
  .wrapper {
      width: 100%;
  }
  .no-car {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 750px;
    height: 200px;
    background: #fff;
  }
  .car-list-wrapper {
    width: 750px;
    background: #fff;
  }
  .car-list-item {
    border-bottom: 1px solid #e8e8e8;
    padding: 32px;
    width: 750px;
  }
  .car-item-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .car-goods-img {
    // margin-right: 20px;
    border: 2px solid #e8e8e8;
    width: 200px;
    height: 200px;
    border-radius: 10px;
    overflow: hidden;
  }
  .car-goods-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 400px;
    height: 200px;
    font-size: 28px;
    color: #333;
  }
  .car-goods-desc {
    line-height: 32px;
  }
  .car-goods-other {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  .goods-prize {
    color: #f56;
  }
  .pay-footer {
    position: fixed;
    bottom: 100px;
    right: 0;
    left: 0;
    background: #fff;
    overflow: hidden;
    z-index: 999;
  }
  .pay-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 2px solid #e8e8e8;
    padding: 0 32px;
    width: 100%;
    height: 80px;
  }
  .pay-left {
    display: flex;
    align-items: center;
    color: #333
  }
  .pay-price {
    margin-left: 20px;
    vertical-align: middle;
  }
</style>
