<template>
  <div class="nav-bar-wrapper">
    <van-nav-bar
      class="m-nav-bar"
      :fixed="true"
      :title="title"
      left-arrow
      v-bind="$attrs"
      @click-left="clickLeft"
      @click-right="onClickRight">
    </van-nav-bar>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import {useRoute, useRouter} from 'vue-router'
export default defineComponent({
  name: 'mNavBar',
  props: {
    navTitle: {
      type: String,
      default: ''
    }
  },
  emits: ['navBack', 'click-right'],
  setup(props, {emit}) {
    const route = useRoute()
    const router = useRouter()

    const title = computed(()=> {
      return props.navTitle || route.meta.title
    })

    const clickLeft = ()=> {
      emit('navBack')
      router.back(-1)
    }
    const onClickRight = (ev)=> {
      emit('click-right', ev)
    }
    return {
      title,
      clickLeft,
      onClickRight
    }
  },
})
</script>

<style lang="less" scoped>
  .nav-bar-wrapper {
    height: 92px;
  }
  .m-nav-bar {
    background-color: #07c160;
  }
</style>

<style lang="less">
  .m-nav-bar {
    .van-icon {
      color: #fff;
    }
    .van-nav-bar__title {
      color: #fff;
    }
    .van-nav-bar__text {
      color: #fff;
    }
  }
</style>
