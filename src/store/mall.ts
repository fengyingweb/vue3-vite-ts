import {defineStore} from 'pinia'
import {register} from '../http/mall'
import {User} from '../interface/index'
export const mallStore = defineStore('mall', {
  state: ()=> {
    return {}
  },
  getters: {},
  actions: {
    async goRegister(userInfo: User) {
      let params = {
        ...userInfo
      }
      try {
        const res = await register(params)
        return res
      } catch (err) {}
    }
  }
})