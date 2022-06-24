<template>
    <div class="scan-input" :class="hasVanSwitch ? 'has-key-board' : ''">
        <van-cell-group>
            <van-field
                ref="input-field"
                :id="inputElId"
                v-model="inputData"
                :placeholder="placeholder"
                @update:model-value="handleInput"
                @click="handleClick"
                @keyup.enter="handleConfirm"
                @click-left-icon="handleLeftIconClick"
                @click-right-icon="handkleRightClick"
                :left-icon="leftIcon"
                :right-icon="rightIcon"
                v-bind="$attrs"
                @focus="handleFocus"
            />
        </van-cell-group>
        <template v-if="hasVanSwitch">
            <van-switch
                class="van-switch-text"
                :class="checked ? 'van-switch-text-active' : 'van-switch-text-inactive'"
                v-model="checked"
                active-color="white"
                inactive-color="white"
                @change="sendCheckedStatus"
            />
        </template>
    </div>
</template>

<script>
import {defineComponent, watch, reactive, toRefs, onMounted, getCurrentInstance, nextTick} from 'vue'
import { Switch, Toast } from 'vant'
import leftIcon from '@/assets/img/barCode.png'
import rightIcon from '@/assets/img/keyboard.png'
import { openQrCodeScan } from '@/utils/qrCodeScan'

export default defineComponent({
    name: 'ScanInput',
    components: {
        [Switch.name]: Switch
    },
    props: {
        // 输入的字符串
        inputText: {
            type: String,
            default: ''
        },
        //输入提示信息
        placeholder: {
            type: String,
            default: ''
        },
        // 左边图标
        leftIcon: {
            type: String,
            default: leftIcon
        },
        // 右边图标
        rightIcon: {
            type: String,
            default: rightIcon
        },
        // 是否有标签--物料切换按钮
        hasVanSwitch: {
            type: Boolean,
            default: false
        },
        // 标签--物料切换文字
        vanSwitchText: {
            type: Array,
            default: function () {
                return ['标签', '物料']
            }
        },
        // 右边显示的是否是手机键盘符，控制手机键盘弹出
        hasKeyboardIcon: {
            type: Boolean,
            default: true
        },
        isWhiteBorder: {
            type: Boolean,
            default: false
        },
        // 是否不可编辑，扫描也不可用
        isDisabled: {
            type: Boolean,
            default: false
        },
        // 是否是供应商打印标签
        isSupplierLabel: {
            type: Boolean,
            default: false
        },
        isNeedinputKeyboard: {
          type: Boolean,
          default: false
        }
    },
    emits: ['update:inputText', 'handle-click', 'inputSubmit', 'handle-right-click', 'send-checked-status', 'focus'],
    setup(props, {emit}) {
      const {ctx} = getCurrentInstance()
      const scanInputState = reactive({
        inputData: props.inputText,
        checked: false,
        showKeyboard: false,
        inputElId: `input-${new Date().getTime()}` // 生成不同的id
      })

      /**
      * 处理输入改变的方法
      */
      const handleInput = (value)=> {
        emit('update:inputText', value)
      }

      const handleClick = ()=> {
        if (props.hasKeyboardIcon) {
          if (props.isNeedinputKeyboard) {
            scanInputState.showKeyboard = true
            setInputFocus()
            return
          } else {
            let inputElement = document.getElementById(scanInputState.inputElId)
            if (scanInputState.showKeyboard) {
              inputElement.removeAttribute('readonly')
              scanInputState.showKeyboard = false
            } else {
              inputElement.setAttribute('readonly', 'readonly')
              setInputFocus()
              setTimeout(() => {
                inputElement.removeAttribute('readonly')
              }, 200)
            }
          }
        }
            emit('handle-click')
      }

      /**
      * 监听回车键输入的方法
      */
      const handleConfirm = ()=> {
        emit('inputSubmit', scanInputState.inputData)
        document.activeElement.blur()
      }

      /**
      * 左边icon点击处理方法
      */
      const handleLeftIconClick = ()=> {
        if (props.isDisabled) return
        openQrCodeScan(
          err => {
            Toast.fail(err)
          },
          code => {
            let filterVal = ''
            if (props.isSupplierLabel) {
              const valArr = code.split(']')
              if (valArr.length > 1) {
                filterVal = valArr[valArr.length - 3]
              } else {
                filterVal = code
              }
            } else {
              filterVal = code
            }
            scanInputState.inputData = filterVal
            handleInput(filterVal)
            nextTick(() => {
              handleConfirm()
            })
          }
        )
      }

      const handkleRightClick = ()=> {
        emit('handle-right-click')
        if (props.hasKeyboardIcon) {
          scanInputState.showKeyboard = true
          setInputFocus()
          return
        }
      }

      const sendCheckedStatus = ()=> {
        const vanSwitch = document.querySelector('.van-switch-text')
        const vanSwitchSub = document.querySelector('.van-switch__node')
        if (scanInputState.checked) {
          vanSwitch.setAttribute('switchText', props.vanSwitchText[0])
          vanSwitchSub.setAttribute('switchText', props.vanSwitchText[1])
        } else {
          vanSwitch.setAttribute('switchText', props.vanSwitchText[1])
          vanSwitchSub.setAttribute('switchText', props.vanSwitchText[0])
        }
        emit('send-checked-status', scanInputState.checked)
      }

      /**
      * 触发输入框点击事件
      * 可在pda上聚焦输入框，避免弹出键盘
      */
      const triggerInputClick = ()=> {
        const inputEl = ctx.$refs['input-field'].$vnode.elm
        const e = document.createEvent('HTMLEvents')
        e.initEvent('click', true, true)
        inputEl.dispatchEvent(e)
      }
      /**
      * @desc 自动选中文字
      */
      const chooseAllText = ()=> {
        let inputElement = document.getElementById(scanInputState.inputElId)
        inputElement.select()
      }

      const handleFocus = ()=> {
        emit('focus')
      }

      function setInputFocus () {
        ctx.$refs['input-field'].focus()
      }
      function setInputBlur () {
        ctx.$refs['input-field'].blur()
      }

      watch(()=>props.inputText, (nVal, oVal)=> {
        if (nVal !== oVal) {
          scanInputState.inputData = nVal
        }
      })

      onMounted(()=> {
        nextTick(()=> {
          if (props.isWhiteBorder) {
            ctx.$refs['input-field'].$el.style.borderColor = '#fff' // 设置边框为白色
          }
          if (props.hasVanSwitch) {
            const vanSwitch = document.querySelector('.van-switch-text')
            const vanSwitchSub = document.querySelector('.van-switch__node')
            vanSwitch.setAttribute('switchText', props.vanSwitchText[1])
            vanSwitchSub.setAttribute('switchText', props.vanSwitchText[0])
          }
        })
      })
      return {
        ...toRefs(scanInputState),
        handleInput,
        handleClick,
        handleConfirm,
        handleLeftIconClick,
        handkleRightClick,
        sendCheckedStatus,
        setInputBlur,
        setInputFocus,
        triggerInputClick,
        chooseAllText,
        handleFocus
      }
    }
})
</script>

<style lang="less" scoped>
.scan-input {
    .van-cell-group {
        background-color: transparent;
    }
    .van-cell {
        padding: 14px 32px 10px 32px;
        font-size: 30px;
        background: #fff;
        border: 2px solid #646efa;
        border-radius: 8px;
        align-items: center;
    }
    .van-hairline--top-bottom::after {
        border-width: 0;
    }
}
</style>
<style lang="less">
.scan-input {
    position: relative;
    .van-field__left-icon {
        margin-right: 8px;
        > .van-icon {
            font-size: 32px;
        }
    }
    &.has-key-board > .van-switch-text {
        right: 130px;
    }
    .van-switch-text {
        position: fixed;
        top: 110px;
        right: 60px;
    }
    .van-switch-text-active {
        width: 160px;
        height: 40px;
        line-height: 40px;
        &::before {
            content: attr(switchText);
            width: 70px;
            font-size: 20px;
            text-align: center;
            letter-spacing: 4px;
            color: #999999;
            position: absolute;
            top: 50%;
            left: 6px;
            transform: translate(0, -50%);
        }
        .van-switch__node {
            width: 84px;
            height: 44px;
            border-radius: 22px;
            top: -2px;
            background: #f56;
            color: white;
            &::after {
                content: attr(switchText);
                width: 70px;
                font-size: 20px;
                text-align: center;
                letter-spacing: 4px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }
    .van-switch-text-inactive {
        width: 160px;
        height: 40px;
        line-height: 40px;
        &::before {
            content: attr(switchText);
            width: 70px;
            font-size: 20px;
            text-align: center;
            letter-spacing: 4px;
            color: #999999;
            position: absolute;
            top: 50%;
            right: 6px;
            transform: translate(0, -50%);
        }
        .van-switch__node {
            width: 84px;
            height: 44px;
            border-radius: 22px;
            top: -2px;
            left: -4px;
            background: #646efa;
            color: white;
            letter-spacing: 4px;
            &::after {
                content: attr(switchText);
                width: 70px;
                font-size: 20px;
                text-align: center;
                letter-spacing: 4px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }
    .van-switch--on .van-switch__node {
        transform: translateX(1.5em);
    }
    .van-field__right-icon {
        .van-icon__image {
            height: 36px;
            width: 36px;
        }
    }
    .van-field--disabled {
        background-color: #ddd !important;
    }
}
</style>
