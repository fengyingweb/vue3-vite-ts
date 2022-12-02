import {defineStore} from 'pinia'

const userStore = defineStore('user', {
  state: ()=> {
    return {
      userInfo: sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo') as string) : null
    }
  },
  actions: {
    setUserInfo(playLoad: {userId: string, userName: string}) {
      this.userInfo = {
        ...playLoad
      }
    }
  }
})
export default userStore