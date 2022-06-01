import {defineStore} from 'pinia';
interface APPSTATE {
  msg: string;
  count: number;
  mobile: string;
}
export const demoStore = defineStore('demo', {
  state: ():APPSTATE => {
    return {
      msg: 'Hello World',
      count: 0,
      mobile: '13600003996'
    }
  },
  getters: {
    mobileParse(state) {
      return state.mobile.toString().replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
    }
  },
  actions: {
    changeState() {
      this.count += 2;
      this.msg = 'JS Pang';
      let random = Math.ceil(Math.random() * 9);
      this.mobile = `1360000399${random}`;
    }
  }
})