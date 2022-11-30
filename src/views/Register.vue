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
          autocomplete="off"
          :rules="[{ required: true, message: '请填写用户名' }]"
        ></van-field>
        <van-field
          v-model="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          clearable
          required
          autocomplete="off"
          :rules="[{ required: true, message: '请填写密码' }]"
        ></van-field>
      </van-cell-group>
      <div class="btn-wrapper">
        <van-button type="success" round block :loading="loading" loading-type="spinner" native-type="submit">马上注册</van-button>
      </div>
    </van-form>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, ref, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import { mallStore } from '../store/mall';
import { ResData } from '../interface/index';
import { Form } from 'vant';

export default {
  name: 'Register',
  components: {
    // @ts-ignore
    mNavBar: defineAsyncComponent(()=> import('@/components/navBar')),
    [Form.name]: Form
  },
  setup() {
    // @ts-ignore
    const { globalProperties } = getCurrentInstance().appContext.config;
    const router = useRouter();
    const userName = ref('');
    const password = ref('');
    const loading = ref(false);
    const store = mallStore();
    
    // @ts-ignore
    const clickRegister = async (values)=> {
      console.log(values)
      if (!values) return;
      loading.value = true;
      // @ts-ignore
      const res: ResData = await store.goRegister(values);
      loading.value = false;
      if (res.code === 0) {
        globalProperties.$toast('注册成功');
        router.replace({path: '/'});
      } else {
        globalProperties.$toast.fail(res.msg)
      }
    }
    return {
      userName,
      password,
      loading,
      clickRegister
    }
  },
}
</script>

<style lang="less" scoped>
  .cell-group {
    margin-top: 32px;
  }
  .btn-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 32px;
    padding: 0 32px;
  }
</style>
