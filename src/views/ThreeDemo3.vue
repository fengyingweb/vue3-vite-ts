<template>
  <div class="wrapper">
    <!-- <m-nav-bar></m-nav-bar> -->
    <section ref="canvasRef" class="con-section">
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
// @ts-ignore
// import mNavBar from '@/components/navBar'
import * as THREE from 'three'
// 引入相机控制器
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
//引入性能监视器stats.js
import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'; // gui.js库可视化改变三维场景, 建立一种思想，就是threejs三维空间的很多参数，不是心算出来的，往往需要可视化的方式调试出来。

const canvasRef = ref(null)

const handleColorChange = ( color, converSRGBToLinear = false )=> {

	return function ( value ) {
    console.log(value)
		if ( typeof value === 'string' ) {
      value = value.replace( '#', '0x' )
		}
		console.log(color.getHex( value ))
    // color.setHex(value)
    color.set(value)
		if ( converSRGBToLinear === true ) color.convertSRGBToLinear()
	}

}

const initThree = async ()=> {
  // 创建3D场景对象
  const scene = new THREE.Scene()
  // console.log(scene)
  const geometry = new THREE.BufferGeometry() // 创建一个空的几何体
  const R = 100; //圆弧半径
  const N = 50; //分段数量
  const sp = 2 * Math.PI / N;//两个相邻点间隔弧度
  // 批量生成圆弧上的顶点数据
  const arr = [];
  for (let i = 0; i < N; i++) {
      const angle =  sp * i;//当前点弧度
      // 以坐标原点为中心，在XOY平面上生成圆弧上的顶点数据
      const x = R * Math.cos(angle);
      const y = R * Math.sin(angle);
      arr.push(x, y, 0);
  }

  //类型数组创建顶点数据
  const vertices = new Float32Array(arr);
  // 创建属性缓冲区对象
  //3个为一组，表示一个顶点的xyz坐标
  const attribue = new THREE.BufferAttribute(vertices, 3); 
  // 设置几何体attributes属性的位置属性
  geometry.attributes.position = attribue;
  // 线材质
  const material = new THREE.LineBasicMaterial({
      color: 0xff0000 //线条颜色
  });
  // 创建线模型对象   构造函数：Line、LineLoop、LineSegments
  // const line = new THREE.Line(geometry, material); 
  const line = new THREE.LineLoop(geometry, material);//线条模型对象
  scene.add(line)
  // 定义相机输出画布的尺寸(单位:像素px)
  const width = canvasRef.value.clientWidth
  const height = canvasRef.value.clientHeight

  /**
   * 透视投影相机的四个参数fov, aspect, near, far构成一个四棱台3D空间，被称为视锥体，
   * 只有视锥体之内的物体，才会渲染出来，视锥体范围之外的物体不会显示在Canvas画布上。
  **/

  // 30(fov):视场角度, width / height(aspect):Canvas画布宽高比, 1(near):近裁截面, 3000(far)：远裁截面
  // 实例化一个透视投影相机对象
  const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000)
  // console.log(camera)

  // 相机在Three.js三维坐标系中的位置
  // 根据需要设置相机位置具体值 .position
  camera.position.set(-28, -43, 902)

  // 相机观察目标指向Threejs 3D空间中某个位置 .lookAt()
  camera.lookAt(0, 0, 0) // 坐标原点
  // camera.lookAt(0, 50, 0) // y轴上位置50

  // 创建渲染器对象
  const renderer = new THREE.WebGLRenderer({
    antialias: true, // 锯齿属性
  })

  // 设置像素比
  renderer.setPixelRatio(window.devicePixelRatio)

  // 设置three.js渲染区域的尺寸(像素px) .setSize()
  renderer.setSize(width, height)

  // 设置背景颜色
  renderer.setClearColor(0xb9d3ff, 1)

  // 执行渲染操作 .render()
  renderer.render(scene, camera)

  // 把canvas画布插入到HTML元素中
  canvasRef.value.appendChild(renderer.domElement)

  // 设置相机控件轨道控制器 OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 0, 0) // 相机目标观察点
	controls.update() // update()函数内会执行camera.lookAt(controls.targe)
	controls.enablePan = true // 启用或禁用摄像机平移
	controls.enableDamping = true // 是否启用阻尼（惯性）

  // 采用了循环渲染，就不用调用change事件了
  controls.addEventListener('change', ()=> {
    // console.log(camera.position)
    renderer.render(scene, camera)
  })

  window.addEventListener('resize', ()=> {
    const width = canvasRef.value.clientWidth
    const height = canvasRef.value.clientHeight
    camera.aspect = width / height
    // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }, false)

  const stats = new Stats()
  stats.domElement.style.position = 'absolute'
  canvasRef.value.appendChild(stats.domElement)

  // 动画渲染
  function animateRender() {
    controls.update()
    stats.update()
    renderer.render(scene, camera) //执行渲染操作
    requestAnimationFrame(animateRender) //请求再次执行渲染函数render，渲染下一帧
  }
}

const initThree2 = () => {
}

const initThree3 = () => {
}

onMounted(()=> {
  initThree()
})
</script>

<style lang="less" scoped>
  .wrapper {
      width: 100%;
      min-height: 100vh;
      background: #fff;
  }
  .con-section {
      position: relative;
      width: 100%;
      height: 100vh;
  }
  .con-section1 {
      position: relative;
      margin-bottom: 16px;
      width: 100%;
      height: 800px;
  }
</style>
