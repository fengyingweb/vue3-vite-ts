<script lang="jsx">
import { toRaw } from 'vue';
import Canvas from '@antv/f2-vue';
import { Chart, Interval, Axis } from '@antv/f2';
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
export default {
  name: 'F2',
  data() {
    return {
      year: '2021',
      chartData: data1,
    };
  },
  mounted() {
    setTimeout(() => {
      this.year = '2022';
      this.chartData = data2;
    }, 5000);
  },
  render() {
    const { year, chartData } = this;
    return (
      <div className="wrapper">
        <MNavBar/>
        <div className="con-section">
          <div className="container1-f2">
            <Canvas pixelRatio={window.devicePixelRatio}>
              <Chart data={toRaw(chartData)}>
                <Axis field="genre" />
                <Axis field="sold" />
                <Interval x="genre" y="sold" color="genre" />
              </Chart>
            </Canvas>
          </div>
        </div>
      </div>
    );
  },
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
</style>
