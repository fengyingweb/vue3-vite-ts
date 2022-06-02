<template>
  <div>
    <m-nav-bar></m-nav-bar>
    <van-form @submit="clickRegister">
      <van-cell-group class="cell-group" inset>
        <van-field
          v-model="userName"
          name="userName"
          label="用户名"
          placeholder="请输入用户名"
          clearable
          required
          :rules="[{ required: true, message: '请填写用户名' }]"
        ></van-field>
        <van-field
          v-model="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          clearable
          required
          :rules="[{ required: true, message: '请填写密码' }]"
        ></van-field>
      </van-cell-group>
      <div class="btn-wrapper">
        <van-button type="danger" round block :disabled="disabled" native-type="submit">马上注册</van-button>
      </div>
    </van-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, ref, getCurrentInstance } from 'vue'
import {mallStore} from '../store/mall'
import {Form} from 'vant'

export default defineComponent({
  name: 'Register',
  components: {
    mNavBar: defineAsyncComponent(()=> import('@/components/navBar')),
    [Form.name]: Form
  },
  setup() {
    const {globalProperties} = getCurrentInstance().appContext.config
    const userName = ref('');
    const password = ref('');
    const disabled = ref(false);
    const store = mallStore();

    const clickRegister = async (values)=> {
      console.log(values)
      if (!values) return;
      globalProperties.$toast.loading({
        duration: 0,
        message: '加载中...',
        forbidClick: true
      })
      disabled.value = true;
      const res = await store.goRegister(values);
      globalProperties.$toast.clear()
      disabled.value = false;
      console.log(res);
    }
    return {
      userName,
      password,
      disabled,
      clickRegister
    }
  },
})
</script>

<style lang="less" scoped>
  .cell-group {
    margin-top: 16px;
  }
  .btn-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 16px;
    padding: 0 16px;
  }
</style>
