import {defineStore} from 'pinia'
import {register, login, queryAllGoodsIndex} from '../http/mall'
import {User} from '../interface/index'
export const mallStore = defineStore('mall', {
  state: ()=> {
    return {
      bannerLists: [], // banner列表
      indexCategory: [], // grid列表
      adBanner: '', // 广告图片
    }
  },
  getters: {
    bannerListsGetters: (state)=> state.bannerLists,
    indexCategoryGetters: (state)=> state.indexCategory,
    adBannerGetters: (state)=> state.adBanner
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