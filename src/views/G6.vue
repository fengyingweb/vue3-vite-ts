<template>
  <div class="wrapper">
    <m-nav-bar></m-nav-bar>
    <section class="con-section">
      <div id="container1-g6"></div>
      <div id="container2-g6"></div>
    </section>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount } from 'vue'
import G6 from '@antv/g6'
// @ts-ignore
import mNavBar from '@/components/navBar'

export default {
  components: {
    mNavBar
  },
  setup() {
    let graph1 = null;
    const data1 = {
      nodes: [
        {
          id: "node1",
          label: "起始点",
          x: 100,
          y: 100
        },
        {
          id: "node2",
          label: "目标点",
          x: 400,
          y: 80
        }
      ],
      edges: [
        {
          source: "node1",
          target: "node2",
          label: '我是连线'
        }
      ]
    }
    const initGraph1 = () => {
      graph1 = new G6.Graph({
        container: "container1-g6",
        height: 200,
        defaultNode: {
          shape: "circle",
          size: [80],
          color: "#5B8FF9",
          style: {
            fill: "#9EC9FF",
            lineWidth: 3
          },
          labelCfg: {
            style: {
              fill: "#fff",
              fontSize: 16
            }
          }
        },
        defaultEdge: {
          style: {
            stroke: "#f56"
          },
          labelCfg: {
            autoRotate: true, // 边上的标签文本根据边的方向旋转
            style: {
              fontSize: 14
            }
          }
        }
      });
      graph1.data(data1);
      graph1.render();
      
    }

    let graph2 = null
    const initGraph2 = async ()=> {
      const response = await fetch('https://gw.alipayobjects.com/os/basement_prod/6cae02ab-4c29-44b2-b1fd-4005688febcb.json');
      const resData = await response.json()
      const nodes = resData.nodes
      const edges = resData.edges
      nodes.forEach((node)=> {
        if (!node.style) {
          node.style = {}
        }
        switch(node.class) {
          case 'c0':
            node.type = 'circle';
            break;
          case 'c1':
            node.type = 'rect';
            node.size = [40, 25];
            break;
          case 'c2':
            node.type = 'ellipse';
            node.size = [40, 25];
            break;
        }
      })
      edges.forEach(edge=> {
        if (!edge.style) {
          edge.style = {}
        }
        edge.style.lineWidth = edge.weight
        edge.style.opacity = 0.6
      })
      graph2 = new G6.Graph({
        container: "container2-g6",
        width: 800,
        height: 500,
        defaultNode: {
          shape: 'circle',
          size: [40],
          color: "#5B8FF9",
          style: {
            fill: "#9EC9FF",
            lineWidth: 3
          },
          labelCfg: {
            style: {
              fill: "#fff",
              fontSize: 14
            }
          }
        },
        defaultEdge: {
          style: {
            stroke: "#f56"
          },
          labelCfg: {
            autoRotate: true,
            style: {
              fontSize: 12
            }
          }
        },
        // fitView: true,
        // fitViewPadding: [20, 40, 50, 20],
        // animate: true,
        layout: {
          type: 'force', // 指定为力导向布局
          preventOverlap: true, // 防止节点重叠
          linkDistance: 150 // 指定边距离为100
        },
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'drag-node'], // 允许拖拽画布、放缩画布、拖拽节点
          edit: []
        },
        nodeStateStyles: {
          hover: {
            fill: '#f56'
          },
          click: {
            stroke: '#000'
          }
        },
        edgeStateStyles: {
          // 鼠标点击边，即 click 状态为 true 时的样式
          click: {
            stroke: 'steelblue',
          },
        },
      });
      graph2.data(resData);
      graph2.render();
      graph2.on('node:mouseenter', (e)=> {
        const nodeItem = e.item
        graph2.setItemState(nodeItem, 'hover', true)
      })
      graph2.on('node:mouseleave', (e)=> {
        const nodeItem = e.item
        graph2.setItemState(nodeItem, 'hover', false)
      })
      graph2.on('node:click', (e)=> {
        const clickNodes = graph2.findAllByState('node', 'click')
        clickNodes.forEach(cn=> {
          graph2.setItemState(cn, 'click', false)
        })
        const nodeItem = e.item
        graph2.setItemState(nodeItem, 'click', true)
      })
      graph2.on('edge:click', (e)=> {
        const clickEdges = graph2.findAllByState('edge', 'click')
        clickEdges.forEach(ce=> {
          graph2.setItemState(ce, 'click', false)
        })
        const edgeItem = e.item
        graph2.setItemState(edgeItem, 'click', true)
      })
    }
    
    onMounted(()=> {
      initGraph1()
      initGraph2()
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
  #container1-g6 {
      width: 100%;
  }
</style>
