<template>
    <div class="order-search-card">
        <FormCard
          :item="searchCondition"
          :settings="cardConfig"
          uniqueKey="id"
          :hasAutoFocus="true"
          @fieldEdit="fieldEdit"
          @inputChange="inputChange"
          @inputEnter="inputEnter"
          @clickInputRightIcon="clickInputRightIcon"
          @scanInputSubmit="scanInputSubmit"
          @scanInputRightIconClick="scanInputRightIconClick" />
    </div>
</template>

<script>
import {defineComponent, reactive, toRefs} from 'vue'
import FormCard from './formCard'
/**
 * 呼叫AGV 头部搜索卡片
 */
export default defineComponent({
    name: 'MaterialDeliverySearchCard',
    components: {
        FormCard
    },
    props: {
        searchCondition: {
            type: Object,
            required: true
        }
    },
    emits: ['fieldEdit', 'inputChange', 'inputEnter', 'clickInputRightIcon', 'scanInputSubmit', 'scanInputRightIconClick'],
    setup(props, {emit}) {
      const searchState = reactive({
        cardConfig: [
          {
              label: '物料编码',
              name: 'itemCode',
              layout: {
                  row: 0,
                  labelSpan: 6,
                  input: true,
                  inputProps: {
                      placeholder: '请选择物料编码',
                      rightIcon: 'search',
                      readonly: true
                  }
              }
          },
          {
              label: '目标货位',
              name: 'destinationGoodsLocationCode',
              className: 'new-scan',
              layout: {
                  row: 1,
                  labelSpan: 6,
                  scanInput: true,
                  scanInputProps: {
                      placeholder: '请输入/选择目标货位',
                      hasKeyboardIcon: false,
                      rightIcon: 'search'
                  }
              }
          },
          {
              label: '载具条码',
              name: 'containerBarcode',
              className: 'new-scan',
              layout: {
                  row: 2,
                  labelSpan: 6,
                  scanInput: true,
                  scanInputProps: {
                      placeholder: '请输入/选择载具条码',
                      hasKeyboardIcon: false,
                      rightIcon: 'search'
                  }
              }
          },
          {
              label: '来源货位',
              name: 'sourceGoodsLocationCode',
              className: 'new-scan',
              layout: {
                  row: 3,
                  labelSpan: 6,
                  scanInput: true,
                  scanInputProps: {
                      placeholder: '请输入/选择来源货位',
                      hasKeyboardIcon: false,
                      rightIcon: 'search'
                  }
              }
          },
        ]
      })

      const fieldEdit = (ev)=> {
          emit('fieldEdit', ev)
      }

      const inputChange = (ev)=> {
          emit('inputChange', ev)
      }

      const inputEnter = (ev)=> {
          emit('inputEnter', ev)
      }

      const clickInputRightIcon = (ev)=> {
          emit('clickInputRightIcon', ev)
      }

      const scanInputSubmit = (ev)=> {
          emit('scanInputSubmit', ev)
      }

      const scanInputRightIconClick = (ev)=> {
          emit('scanInputRightIconClick', ev)
      }
      return {
        ...toRefs(searchState),
        fieldEdit,
        inputChange,
        inputEnter,
        clickInputRightIcon,
        scanInputSubmit,
        scanInputRightIconClick
      }
    }
})
</script>

<style lang="less" scoped>
@import '@/assets/css/list-item.less';
.order-search-card {
    padding: 6px 28px;
    font-size: 28px;
    color: #666;
    background: #fff;
    border-radius: 10px;
    .button-box {
        display: flex;
        justify-content: flex-end;
        .button {
            margin-left: 30px;
            color: #333;
            border-color: #f56;
        }
    }
}
</style>
