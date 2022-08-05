import {defineStore} from 'pinia'
import {register, login, queryAllGoodsIndex} from '../http/mall'
import {User} from '../interface/index'
import '../mock'
export const mallStore = defineStore('mall', {
  state: ()=> {
    return {
      bannerLists: [], // banner列表
      indexCategory: [], // grid列表
      adBanner: '', // 广告图片
      recommendGoods: [], // 推荐商品
      floor1: [],
      floor2: [],
      floor3: [],
      floorName: {},
      hotGoods: []
    }
  },
  getters: {
    bannerListsGetters: (state)=> state.bannerLists,
    indexCategoryGetters: (state)=> state.indexCategory,
    adBannerGetters: (state)=> state.adBanner,
    recommendGoodsGetters: (state)=> state.recommendGoods,
    floor1Getters: (state)=> state.floor1,
    floor2Getters: (state)=> state.floor2,
    floor3Getters: (state)=> state.floor3,
    floorNameGetters: (state)=> state.floorName,
    hotGoodsGetters: (state)=> state.hotGoods,
  },
  actions: {
    async goRegister(userInfo: User) {
      let params = {
        ...userInfo
      }
      try {
        const res = await register(params)
        return res
      } catch (err) {
        console.log(err)
      }
    },
    
    async goLogin(userInfo: User) {
      const params = {
        ...userInfo
      }
      try {
        const res = await login(params)
        return res
      } catch (err) {
        console.log(err)
      }
    },

    async getAllGoodsIndex() {
      try {
        const res = await queryAllGoodsIndex();
        return res
      } catch(err) {
        console.log(err)
      }
    }
  }
})