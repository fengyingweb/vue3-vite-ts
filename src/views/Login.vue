<template>
  <div>
    <m-nav-bar></m-nav-bar>
    <van-cell-group class="cell-group" inset>
      <van-field
        v-model="userName"
        label="用户名"
        placeholder="请输入用户名"
        clearable
        required
        autocomplete="off"
        :error-message="nameTips"
      ></van-field>
      <van-field
        v-model="password"
        label="密码"
        :type="inputType"
        placeholder="请输入密码"
        clearable
        required
        autocomplete="off"
        :error-message="passTips"
        :right-icon="rightIconName"
        @click-right-icon="clickRightIcon"
      ></van-field>
    </van-cell-group>
    <div class="btn-wrapper">
      <van-button type="success" round block :loading="loading" loading-type="spinner" @click="clickLogin">登录</van-button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, reactive, toRefs, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import { mallStore } from '../store/mall';
import { ResData } from '../interface/index';
// @ts-ignore
import mNavBar from '@/components/navBar';

export default {
  name: 'Login',
  components: {
    mNavBar
  },
  setup() {
    // @ts-ignore
    const { globalProperties } = getCurrentInstance().appContext.config;
    const router = useRouter();
    const userName = ref('');
    const password = ref('');
    const inputType = ref('password');
    const rightIconName = ref('closed-eye');
    const loading = ref(false);
    const tipMsg = reactive({
      nameTips: '',
      passTips: '',
    });
    const store = mallStore();
    
    const clickRightIcon = ()=> {
      if (rightIconName.value === 'closed-eye') {
        rightIconName.value = 'eye-o';
        inputType.value = 'text';
      } else {
        rightIconName.value = 'closed-eye';
        inputType.value = 'password';
      }
    }
    const clickLogin = async ()=> {
      if (userName.value.trim() === '') {
        tipMsg.nameTips = '用户名不能为空';
        return;
      }
      tipMsg.nameTips = '';
      if (password.value.trim() === '') {
        tipMsg.passTips = '密码不能为空';
        return;
      }
      tipMsg.passTips = '';
      loading.value = true;
      const params = {
        userName: userName.value,
        password: password.value
      }
      // @ts-ignore
      const res:ResData = await store.goLogin(params);
      if (res.code === 0) {
        if (res.data) {
          globalProperties.$toast('登录成功');
          router.go(-1);
        }
      } else if (res.code === 2) {
        globalProperties.$dialog.confirm({
          message: res.msg,
          confirmButtonText: '去注册'
        }).then(()=> {
          router.push({path: '/register'})
        })
      }
      loading.value = false;
    }
    return {
      userName,
      password,
      loading,
      inputType,
      rightIconName,
      ...toRefs(tipMsg),
      clickRightIcon,
      clickLogin,
    }
  }
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