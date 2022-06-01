import { defineStore } from 'pinia';
import config from '../config';
import { convertAppLangToCookieLang } from '../utils'
interface AppData {
  orgId: string;
  currentOrgName: string;
  userInfo: object;
  serverUrl: string;
  workcenterCode: string;
  workcenterName: string;
  language: string;
}
export const appStore = defineStore('app', {
  state: ():AppData => {
    return {
      // 组织id，通过android基座获取
      orgId: '',
      // 组织名，通过android基座获取
      currentOrgName: '',
      // 用户信息，通过android基座获取
      userInfo: {},
      // 接口服务器地址，通过android基座获取
      serverUrl: '',
      // 选择的工作中心
      workcenterCode: '',
      // 选择的工作中心名称
      workcenterName: '',
      // app选择的语言
      language: ''
    }
  },

  getters: {
    orgIdParse: state => state.orgId,
    currentOrgNameParse: state => state.currentOrgName,
    userInfoParse: state => state.userInfo,
    currentOrgCode: state=> state.currentOrgName.split('_')[1]
  },

  actions: {
    initApp() {
      // 本地调试模拟基座环境
      this.orgId = config.orgId;
      this.currentOrgName = config.orgName;
      this.userInfo = {
        userName: config.userName,
        userDisplayName: config.userDisplayName
      };
      this.workcenterCode = config.workcenterCode;
      this.workcenterName = config.workcenterName;
      const langStr = convertAppLangToCookieLang(config && config.language)
      localStorage.setItem('lang', langStr) // 语言配置放到localstorage
      localStorage.removeItem('ssoToken') // 基座没有ssoToken
    }
  }
})
