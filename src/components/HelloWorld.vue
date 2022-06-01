<template>
  <h4>{{msg}}</h4>
  <h4>{{mobileParse}}</h4>
  <h4>{{count}}</h4>
</template>

<script setup lang="ts">
import {demoStore} from '../store/demo'
import {storeToRefs} from 'pinia'

const store = demoStore();
const {msg, count, mobileParse} = storeToRefs(store);
</script>

<style lang="less" scoped>

</style>
