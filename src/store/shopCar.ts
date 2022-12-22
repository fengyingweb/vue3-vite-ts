import {defineStore} from 'pinia'
import { addShopCar, queryShopCar, updateShopCarNums, batchDeleteCar} from '../http/mall';
import {
  AddShopCarParams,
  QueryShopCarParams,
  UpdateShopCarParams,
  DeleteCarParams
} from '../interface/index'

const shopCarStore = defineStore('shopCar', {
  state: ()=> {
    return {
      shopCarList: [],
      shopCarCount: 0
    }
  },
  getters: {
    shopCarListG: (state) => state.shopCarList,
    shopCarCountG: (state) => state.shopCarCount
  },
  actions: {
    async addCar(params: AddShopCarParams) {
      try {
        let res = await addShopCar(params)
        return res
      } catch (err) {
        console.log(err)
      }
    },
    async getShopCar(params: QueryShopCarParams) {
      try {
        let res = await queryShopCar(params)
        return res
      } catch (err) {
        console.log(err)
      }
    },
    async updateNums(params: UpdateShopCarParams) {
      try {
        let res = await updateShopCarNums(params)
        return res
      } catch (err) {
        console.log(err)
      }
    },
    async deleteCar(params: DeleteCarParams) {
      try {
        let res = await batchDeleteCar(params)
        return res
      } catch (err) {
        console.log(err)
      }
    }
  }
})

export default shopCarStore