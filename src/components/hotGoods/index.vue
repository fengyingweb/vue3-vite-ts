<template>
  <section class="hot-wrapper">
    <h4 v-once class="hot-title">{{hotTitle}}</h4>
    <section class="hot-body">
      <van-grid :column-num="2">
        <van-grid-item
          v-for="item in hotGoodsData"
          :key="item.goodsId"
          class="hot-item"
          @click="clickHots(item.goodsId)">
          <template #icon>
            <img class="hot-img" v-lazy="item.image" alt="图片不存在" />
          </template>
          <template #text>
            <div class="hot-desc">{{item.name}}</div>
            <div>￥{{moneyFilter(item.price)}}</div>
          </template>
        </van-grid-item>
      </van-grid>
    </section>
  </section>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits, computed } from 'vue'

  const props = defineProps<{
    title: string;
    hotGoodsList: any[]
  }>()

  const emit = defineEmits<{
    (e: 'click', id: string): void
  }>()

  const hotTitle = computed(()=> props.title);
  const hotGoodsData = computed(()=> props.hotGoodsList);
  const clickHots = (id:string)=> {
    emit('click', id);
  }
  const moneyFilter = (money = 0)=> {
    return money.toFixed(2)
  }
</script>

<style lang="less" scoped>
  .hot-wrapper {
      width: 100%;
  }
  .hot-title {
      line-height: 72px;
      text-align: center;
      color: #333;
  }
  .hot-body {
      width: 100%;
  }
  .hot-item {
      width: 375px;
  }
  .hot-img {
      display: block;
      width: 320px;
  }
  .hot-desc {
      width: 320px;
      line-height: 48px;
      text-align: center;
      font-size: 28px;
      color: #333;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
  }
</style>
