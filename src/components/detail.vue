<template>
  <div class="detail-wrapper">
    <p v-for="item in detailConfig" :key="item.name" class="detail-item">
      <span class="detail-label">{{item.label}}：</span>
      <span class="detail-value">{{detail[item.name]}}</span>
    </p>
  </div>
</template>

<script>
import {defineComponent, reactive, toRefs} from 'vue'
export default defineComponent({
  name: 'DetailCon',
  props: {
    detail: {
      type: Object,
      default: ()=> {
        return {}
      }
    }
  },
  setup() {
    const detailState = reactive({
      detailConfig: [
        {label: '物料编码', name: 'itemCode'},
        {label: '物料描述', name: 'itemDesc'},
        {label: '条码号', name: 'containerBarcode'},
        {label: '数量', name: 'qty'},
        {label: '单位', name: 'uom'},
        {label: '来源货位', name: 'sourceGoodsLocationCode'},
        {label: '目标货位', name: 'destinationGoodsLocationCode'}
      ]
    })
    return {
      ...toRefs(detailState)
    }
  }
}) 
</script>

<style lang="less" scoped>
  .detail-wrapper {
    margin-top: 32px;
    padding: 20px 28px;
    font-size: 28px;
    color: #666;
    background: #fff;
    border-radius: 10px;
  }
  .detail-item {
    margin-bottom: 24px;
  }
  .detail-label {
    color: #646efa;
  }
</style>
