<template>
  <div class="wrapper">
    <m-nav-bar></m-nav-bar>
    <section class="con-section">
      <div id="container1-g2"></div>
      <div id="container2-g2"></div>
    </section>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount } from 'vue'
import { Chart } from '@antv/g2'
// @ts-ignore
import mNavBar from '@/components/navBar'

export default {
  components: {
    mNavBar
  },
  setup() {
    let chart1 = null;
    const data1 = [
      { year: '2015 年', sales: 38 },
      { year: '2016 年', sales: 52 },
      { year: '2017 年', sales: 61 },
      { year: '2018 年', sales: 145 },
      { year: '2019 年', sales: 48 },
      { year: '2020 年', sales: 38 },
      { year: '2021 年', sales: 38 },
      { year: '2022 年', sales: 38 },
    ]
    const initChart1 = () => {
      chart1 = new Chart({
        container: 'container1-g2',
        autoFit: true,
        height: 300
      })
      chart1.data(data1);
      chart1.scale('sales', {
        nice: true,
        alias: '销售量',
        ticks: [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200],
      });
      chart1.axis('sales', {
        title: {
          style: {
            fill: '#1890ff'
          }
        }
      })

      chart1.tooltip({
        showMarkers: false
      });

      // chart1.legend({
      //   position: 'bottom'
      // })
      chart1.interaction('active-region');

      chart1.interval().position('year*sales');

      chart1.render();
    }
    let chart2 = null
    const data2 = [
      { item: '事例一', count: 40, percent: 0.4 },
      { item: '事例二', count: 21, percent: 0.21 },
      { item: '事例三', count: 17, percent: 0.17 },
      { item: '事例四', count: 13, percent: 0.13 },
      { item: '事例五', count: 9, percent: 0.09 }
    ]
    const initChart2 = () => {
      chart2 = new Chart({
        container: 'container2-g2',
        autoFit: true,
        height: 500,
      });

      chart2.data(data2);

      chart2.coordinate('theta', {
        radius: 0.85
      });
      chart2.scale('percent', {
        formatter: (val) => {
          val = val * 100 + '%';
          return val;
        },
      });
      chart2.tooltip({
        showTitle: false,
        showMarkers: false,
      });
      chart2.axis(false); // 关闭坐标轴
      const interval = chart2
        .interval()
        .adjust('stack')
        .position('percent')
        .color('item')
        .label('percent', {
          offset: -40,
          style: {
            textAlign: 'center',
            shadowBlur: 2,
            shadowColor: 'rgba(0, 0, 0, .45)',
            fill: '#fff',
          },
        })
        .tooltip('item*percent', (item, percent) => {
          percent = percent * 100 + '%';
          return {
            name: item,
            value: percent,
          };
        })
        .style({
          lineWidth: 1,
          stroke: '#fff',
        });
      chart2.interaction('element-single-selected');
      chart2.render();

      // 默认选择
      interval.elements[0].setState('selected', true);
    }
    onMounted(()=> {
      initChart1()
      initChart2()
    })
    onBeforeUnmount(()=> {
      chart1 && chart1.destroy()
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
  #container1-g2 {
      width: 100%;
  }
  #container2-g2 {
    width: 100%;
  }
</style>
