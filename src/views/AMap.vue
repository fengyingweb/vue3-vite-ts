<template>
  <div class="wrapper">
    <m-nav-bar></m-nav-bar>
    <section class="con-section">
      <div id="container-map"></div>
    </section>
  </div>
</template>

<script lang="ts">
import AMapLoader from "@amap/amap-jsapi-loader"
import { onMounted } from 'vue'
import mNavBar from '@/components/navBar';

export default {
  components: {
    mNavBar
  },
  setup() {
    let map = null;

    const initMap = async ()=> {
      try {
        const AMap = await AMapLoader.load({
          key: 'dc19cd106e428c03ccf019eab62d9ca1',  //设置您的key
          version: '2.0',
          plugins: ['AMap.ToolBar','AMap.Driving'],
          AMapUI:{
            version: '1.1',
            plugins: [],

          },
          Loca:{
            version: '2.0.0'
          },
        })
        console.log(AMap);
        map = new AMap.Map('container-map', {
          viewMode: '3D',
          zoom: 5,
          zooms: [2,22],
          center: [105.602725, 37.076636],
          mapStyle: 'amap://styles/whitesmoke',
          features: ['bg', 'road', 'building', 'point'],
          layers: [], // 图层
        });
        let positionArr = [
            [113.357224, 34.977186],
            [114.555528, 37.727903],
            [112.106257, 36.962733],
            [109.830097, 31.859027],
            [116.449181, 39.98614],
        ];
        for(let item of positionArr){
            let marker = new AMap.Marker({
                position:[item[0],item[1]],
            });
            map.add(marker);
        }
      } catch (e) {
        console.log(e);
      }
    }
    onMounted(()=> {
      initMap()
    })
    return{
    }
  }
}
</script>

<style lang="less" scoped>
  .wrapper {
      width: 100%;
  }
  .con-section {
      padding: 32px;
      width: 100%;
      background: #fff;
  }
  #container-map {
      width: 100%;
      height: calc(100vh - 156px);
  }
</style>
