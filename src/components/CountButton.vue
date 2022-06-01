<template>
  <div class="btn-wrapper">
    <button @click="handleClick">修改数量</button>
    <button @click="handleClickPatch">修改数量($patch)</button>
    <button @click="handleClickMethod">修改数量(method)</button>
    <button @click="handleClickAction">修改数量(action)</button>
  </div>
</template>

<script lang="ts">
import {demoStore} from '../store/demo'
export default {
  setup() {
    const store = demoStore();
    const handleClick = ()=> {
      store.count++
    };
    const handleClickPatch = ()=> {
      store.$patch({
        count: store.count + 2,
        msg: store.msg === 'Hello World' ? 'JS Pang' : 'Hello World'
      })
    };
    const handleClickMethod = ()=> {
      store.$patch(()=> {
        store.count++;
        store.msg = store.msg === 'Hello World' ? 'JS Pang' : 'Hello World'
      })
    };
    const handleClickAction = ()=> {
      store.changeState()
    };
    return {
      handleClick,
      handleClickPatch,
      handleClickMethod,
      handleClickAction
    }
  },
}
</script>

<style lang="less" scoped>
  .btn-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  button {
    margin: 10px auto;
    border: 1px solid #267aff;
    padding: 5px 12px;
    font-size: 14px;
    border-radius: 4px;
  }
</style>
