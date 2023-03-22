<template>
  <div class="wrapper">
    <m-nav-bar></m-nav-bar>
    <section class="con-section">
      <div id="container1-x6"></div>
      <div id="container2-x6"></div>
    </section>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount } from 'vue'
import { Graph } from '@antv/x6';
// @ts-ignore
import mNavBar from '@/components/navBar'

export default {
  components: {
    mNavBar
  },
  setup() {
    let graph1 = null
    const data1 = {
      // 节点
      nodes: [
        {
          id: 'node1', // String，可选，节点的唯一标识
          shape: 'rect',
          x: 200,       // Number，必选，节点位置的 x 值
          y: 40,       // Number，必选，节点位置的 y 值
          width: 80,   // Number，可选，节点大小的 width 值
          height: 40,  // Number，可选，节点大小的 height 值
          // label: 'X1', // String，节点标签
          attrs: {
            body: {
              fill: '#2ECC71',
              stroke: '#8f8f8f',
              strokeDasharray: '10,2',
            },
            label: {
              text: 'X1',
              fill: '#333',
              fontSize: 13,
            }
          },
          tools: ['button-remove']
        },
        {
          id: 'node2', // String，节点的唯一标识
          shape: 'ellipse',
          x: 200,      // Number，必选，节点位置的 x 值
          y: 180,      // Number，必选，节点位置的 y 值
          width: 80,   // Number，可选，节点大小的 width 值
          height: 40,  // Number，可选，节点大小的 height 值
          // label: 'X2', // String，节点标签
          attrs: {
            body: {
              fill: '#F39C12',
              stroke: '#000',
            },
            label: {
              text: 'X2',
              fill: '#333',
              fontSize: 18,
              fontWeight: 'bold',
              fontVariant: 'small-caps',
            },
          },
          tools: ['button-remove']
        },
      ],
      // 边
      edges: [
        {
          source: 'node1', // String，必须，起始节点 id
          target: 'node2', // String，必须，目标节点 id
          attrs: {
            line: {
              stroke: 'orange',
            },
          },
        },
      ],
    };
    const initGraph1 = () => {
      graph1 = new Graph({
        container: document.querySelector('#container1-x6'),
        width: 800,
        height: 600,
        background: {
          color: '#fffbe6' // 设置画布背景颜色
        },
        grid: {
          size: 10,      // 网格大小 10px
          visible: true, // 渲染网格背景
        },
        panning: true
      })
      graph1.fromJSON(data1)
    }
    onMounted(()=> {
      initGraph1()
    })
    onBeforeUnmount(()=> {
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
  #container1-x6 {
      width: 100%;
  }
</style>
