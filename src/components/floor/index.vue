<template>
  <div class="floor">
    <h4 class="floor-title">{{floorTitle}}</h4>
    <div v-if="floorData.length > 0" class="floor-body">
      <div class="flex-row floor-top">
        <div class="floor-item right-b" @click="clickFloor(floorData[0].goodsId)">
          <img class="floor-img" v-lazy="floorData[0].image" alt="图片不存在" />
        </div>
        <div class="floor-item">
          <div class="floor-item" @click="clickFloor(floorData[1].goodsId)">
            <img class="floor-img" v-lazy="floorData[1].image" alt="图片不存在" />
          </div>
          <div class="floor-item" @click="clickFloor(floorData[2].goodsId)">
            <img class="floor-img" v-lazy="floorData[2].image" alt="图片不存在" />
          </div>
        </div>
      </div>
      <div class="flex-row floor-bottom">
        <div
          v-for="(item, ind) in floorData.slice(3)"
          :key="item.goodsId"
          :class="['floor-item', ind === 0 && 'right-b']"
          @click="clickFloor(item.goodsId)">
          <img class="floor-img" v-lazy="item.image" alt="图片不存在" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits, computed } from 'vue'
  import { FloorData } from '../../interface'
  
  const props = defineProps<{
    floorTitle: string;
    floorData: FloorData[]
  }>()

  const emit = defineEmits<{
    (e: 'click', id: string): void
  }>()

  const floorTitle = computed(()=> props.floorTitle);
  const floorData = computed(()=> props.floorData);
  const clickFloor = (id: string)=> {
    emit('click', id);
  }
</script>

<style lang="less" scoped>
  .floor {
      width: 100%;
  }
  .floor-title {
      line-height: 72px;
      text-align: center;
      color: #333;
  }
  .floor-body {
      width: 100%;
      background: #fff;
  }
  .floor-item {
    flex: 1;
    border-bottom: 2px solid #eee;
  }
  .right-b {
    border-right: 2px solid #eee;
  }
  .floor-img {
    display: block;
    width: 100%;
  }
</style>
