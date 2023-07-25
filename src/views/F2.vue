<script lang="jsx">
import { toRaw, ref, reactive, toRefs, computed, onMounted, watch } from 'vue';
import Canvas from '@antv/f2-vue';
import { Chart, Interval, Axis, Legend, Tooltip } from '@antv/f2';
// @ts-ignore
import MNavBar from '@/components/navBar'

const data1 = [
  { genre: 'Sports', sold: 275 },
  { genre: 'Strategy', sold: 115 },
  { genre: 'Action', sold: 120 },
  { genre: 'Shooter', sold: 350 },
  { genre: 'Other', sold: 150 },
];
const data2 = [
  { genre: 'Sports', sold: 275 },
  { genre: 'Strategy', sold: 115 },
  { genre: 'Action', sold: 20 },
  { genre: 'Shooter', sold: 50 },
  { genre: 'Other', sold: 50 },
];
const data3 = [
  {
    name: '长津湖',
    percent: 40,
    a: '100',
  },
  {
    name: '我和我的父辈',
    percent: 20,
    a: '100',
  },
  {
    name: '失控玩家',
    percent: 18,
    a: '100',
  },
  {
    name: '宝可梦',
    percent: 15,
    a: '100',
  },
  {
    name: '峰爆',
    percent: 5,
    a: '100',
  },
  {
    name: '其他',
    percent: 2,
    a: '100',
  },
];
export default {
  name: 'F2',
  setup(props, ctx) {
    const year = ref('2021')
    const f2Data = reactive({
      chartData: data1,
      polarData: data3
    })
    const comData = computed(()=> {
      return f2Data.chartData
    })
    onMounted(()=> {
      setTimeout(()=> {
        year.value = '2022'
        f2Data.chartData = data2
      }, 5000)
    })
    return ()=> {
      const {chartData, polarData} = f2Data
      return (
        <div class="wrapper">
          <MNavBar/>
          <div class="con-section">
            <div>{JSON.stringify(comData.value, null, 2)}</div>
            <div>{year.value}</div>
            <div class="container1-f2">
              <Canvas pixelRatio={window.devicePixelRatio}>
                <Chart data={toRaw(chartData)}>
                  <Tooltip showTooltipMarker={true} />
                  <Axis field="genre" />
                  <Axis field="sold" />
                  <Interval
                    x="genre"
                    y="sold"
                    color="genre"
                    animation={{
                      update: {
                        easing: 'linear',
                        duration: 200,
                        property: ['x', 'y', 'width', 'height'],
                      },
                    }}
                    selection={{
                      selectedStyle: (record) => {
                        const { xMin, xMax } = record;
                        const width = xMax - xMin;
                        const offset = width * 0.2;
                        return {
                          x: xMin - offset,
                          width: width + offset * 2,
                          fillOpacity: 1,
                        };
                      },
                      unSelectedStyle: {
                        fillOpacity: 0.4,
                      },
                    }}
                  />
                </Chart>
              </Canvas>
            </div>
            <div class="container2-f2">
              <Canvas pixelRatio={window.devicePixelRatio}>
                <Chart
                  data={toRaw(polarData)}
                  coord={{
                    transposed: true,
                    type: 'polar',
                  }}
                >
                  <Legend position="right" />
                  <Interval
                    x="a"
                    y="percent"
                    adjust="stack"
                    color={{
                      field: 'name',
                      range: ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0'],
                    }}
                    selection={{
                      selectedStyle: (record) => {
                        const { yMax, yMin } = record;
                        return {
                          // 半径放大 1.1 倍
                          r: (yMax - yMin) * 1.1,
                        };
                      }
                    }}
                  />
                </Chart>
              </Canvas>
            </div>
          </div>
        </div>
      )
    }
  }
};
</script>

<style lang="less" scoped>
  .wrapper {
      width: 100%;
      min-height: 100vh;
      background: #fff;
  }
  .con-section {
      padding: 32px;
      width: 100%;
  }
  .container1-f2 {
      width: 100%;
      height: 300px;
  }
  .container2-f2 {
    width: 100%;
    height: 500px;
  }
</style>
