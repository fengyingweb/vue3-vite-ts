import {defineStore} from 'pinia'

const shopCarStore = defineStore('shopCar', {
  state: ()=> {
    return {
      shopCarList: [],
      shopCarCount: 0
    }
  },
  getters: {
    shopCarCountG: (state) => state.shopCarCount
  },
  actions: {}
})

export default shopCarStore