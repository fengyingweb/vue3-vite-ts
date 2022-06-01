import {reactive} from 'vue'
import {storeToRefs} from 'pinia'
import {appStore} from '../store'

export default function commonData () {
  const store = appStore()
  const commonState = reactive({
    searchCondition: {
      itemCode: '',
      destinationGoodsLocationCode: '',
      containerBarcode: '',
      sourceGoodsLocationCode: ''
    }, // 头部搜索条件
    workcenterData: {},
    detailData: {
      itemCode: '',
      itemDesc: '',
      containerBarcode: '',
      qty: '',
      uom: '',
      sourceGoodsLocationCode: '',
      destinationGoodsLocationCode: ''
    },
    showWKCDialog: false,
    showItemCodeDialog: false,
    showTargetDialog: false,
    showBarcodeDialog: false,
    showSourceDialog: false,
    errMsg: ''
  })

  const setSearchCondition = (payload = {})=> {
    commonState.searchCondition = Object.assign(commonState.searchCondition, payload)
  }

  const clearAppStore = ()=> {
    commonState.searchCondition = {
      itemCode: '',
      destinationGoodsLocationCode: '',
      containerBarcode: '',
      sourceGoodsLocationCode: ''
    }
    commonState.workcenterData = {}
    commonState.detailData = {
      itemCode: '',
      itemDesc: '',
      containerBarcode: '',
      qty: '',
      uom: '',
      sourceGoodsLocationCode: '',
      destinationGoodsLocationCode: ''
    }
  }
  return {
    commonState,
    ...storeToRefs(store),
    clearAppStore,
    setSearchCondition
  }
}
