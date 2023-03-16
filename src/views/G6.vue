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
      G6.registerNode(
        'background-animate',
        {
          afterDraw(cfg, group) {
            let r = cfg.size / 2;
            if (isNaN(r)) {
              r = cfg.size[0] / 2;
            }
            // 第一个背景圆
            const back1 = group.addShape('circle', {
              zIndex: -3,
              attrs: {
                x: 0,
                y: 0,
                r,
                fill: cfg.color,
                opacity: 0.6,
              },
              // must be assigned in G6 3.3 and later versions. it can be any value you want
              name: 'circle-shape1',
            });
            // 第二个背景圆
            const back2 = group.addShape('circle', {
              zIndex: -2,
              attrs: {
                x: 0,
                y: 0,
                r,
                fill: 'blue', // 为了显示清晰，随意设置了颜色
                opacity: 0.6,
              },
              // must be assigned in G6 3.3 and later versions. it can be any value you want
              name: 'circle-shape2',
            });
            // 第三个背景圆
            const back3 = group.addShape('circle', {
              zIndex: -1,
              attrs: {
                x: 0,
                y: 0,
                r,
                fill: 'green',
                opacity: 0.6,
              },
              // must be assigned in G6 3.3 and later versions. it can be any value you want
              name: 'circle-shape3',
            });
            group.sort(); // 排序，根据 zIndex 排序

            // 第一个背景圆逐渐放大，并消失
            back1.animate(
              {
                r: r + 10,
                opacity: 0.1,
              },
              {
                repeat: true, // 循环
                duration: 3000,
                easing: 'easeCubic',
                delay: 0, // 无延迟
              },
            );

            // 第二个背景圆逐渐放大，并消失
            back2.animate(
              {
                r: r + 10,
                opacity: 0.1,
              },
              {
                repeat: true, // 循环
                duration: 3000,
                easing: 'easeCubic',
                delay: 1000, // 1 秒延迟
              },
            ); // 1 秒延迟

            // 第三个背景圆逐渐放大，并消失
            back3.animate(
              {
                r: r + 10,
                opacity: 0.1,
              },
              {
                repeat: true, // 循环
                duration: 3000,
                easing: 'easeCubic',
                delay: 2000, // 2 秒延迟
              },
            );
          },
        },
        'circle',
      );
      G6.registerEdge(
        'circle-running',
        {
          afterDraw(cfg, group) {
            // get the first shape in the group, it is the edge's path here=
            const shape = group.get('children')[0];
            // the start position of the edge's path
            const startPoint = shape.getPoint(0);

            // add red circle shape
            const circle = group.addShape('circle', {
              attrs: {
                x: startPoint.x,
                y: startPoint.y,
                fill: '#1890ff',
                r: 3,
              },
              name: 'circle-shape',
            });

            // animation for the red circle
            circle.animate(
              (ratio) => {
                // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
                // get the position on the edge according to the ratio
                const tmpPoint = shape.getPoint(ratio);
                // returns the modified configurations here, x and y here
                return {
                  x: tmpPoint.x,
                  y: tmpPoint.y,
                };
              },
              {
                repeat: true, // Whether executes the animation repeatly
                duration: 3000, // the duration for executing once
              },
            );
          },
        },
        'cubic', // extend the built-in edge 'cubic'
      )
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
            node.type = 'background-animate';
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
      const minimap = new G6.Minimap({
        size: [100, 100],
        className: 'minimap',
        type: 'delegate'
      })
      const grid = new G6.Grid()
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
          type: 'circle-running',
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
        animate: true,
        layout: {
          type: 'force', // 指定为力导向布局
          preventOverlap: true, // 防止节点重叠
          linkDistance: 150 // 指定边距离为100
        },
        modes: {
          default: [
            'drag-canvas',
            'zoom-canvas',
            'drag-node',
            {
              type: 'tooltip', // 提示框
              formatText(model) {
                // 提示框文本内容
                const text = 'label: ' + model.label + '<br/> class: ' + model.class;
                return text;
              }
            },
            {
              type: 'edge-tooltip', // 边提示框
              formatText(model) {
                // 边提示框文本内容
                const text =
                  'source: ' +
                  model.source +
                  '<br/> target: ' +
                  model.target +
                  '<br/> weight: ' +
                  model.weight;
                return text;
              }
            }
          ], // 允许拖拽画布、放缩画布、拖拽节点
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
        plugins: [minimap, grid]
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
  }
  #container1-g6 {
      width: 100%;
  }
  /* 提示框的样式 */
  :deep(.g6-tooltip) {
      border: 1px solid #e2e2e2;
      border-radius: 4px;
      font-size: 12px;
      color: #545454;
      background-color: rgba(255, 255, 255, 0.9);
      padding: 10px 8px;
      box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  }
</style>
