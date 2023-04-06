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
// 引入gltf模型加载库GLTFLoader.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
// import logoImg from '../assets/logo.png'

const canvasRef = ref(null)
const spt = ref(0)
const canvasRef2 = ref(null)
const canvasRef3 = ref(null)

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

  // 创建GLTF加载器对象
  const gltfLoader = new GLTFLoader()
  const rgbeLoader = new RGBELoader()
  // console.log(gltfLoader)
  // 采用URL构造函数结合import.meta.url引入gltf glb文件路径
  const gltfUrl = new URL('../assets/gltf/demoLamp.glb', import.meta.url).href
  const rgbeUrl = new URL('../assets/textures/demoTexture1.hdr', import.meta.url).href
  const [gltf, texture] = await Promise.all([
    gltfLoader.loadAsync(gltfUrl),
    rgbeLoader.loadAsync(rgbeUrl)
  ])
  // console.log(gltf.scene)
  texture.encoding = THREE.sRGBEncoding
  texture.mapping = THREE.EquirectangularReflectionMapping
  // texture.flipY = false
  // console.log(texture)
  scene.background = texture
	scene.environment = texture
  gltf.scene.traverse((item)=> {
    if (item.isMesh) {
      console.log('模型节点:', item)
      console.log('模型节点名称:', item.name)
    }
  })
  
  // const lampMesh = gltf.scene.getObjectByName('lamp')
  // lampMesh.material.map = texture.clone()

  scene.add(gltf.scene)
  // 定义相机输出画布的尺寸(单位:像素px)
  const width = canvasRef.value.clientWidth
  const height = canvasRef.value.clientHeight

  /**
   * 透视投影相机的四个参数fov, aspect, near, far构成一个四棱台3D空间，被称为视锥体，
   * 只有视锥体之内的物体，才会渲染出来，视锥体范围之外的物体不会显示在Canvas画布上。
  **/

  // 30(fov):视场角度, width / height(aspect):Canvas画布宽高比, 1(near):近裁截面, 3000(far)：远裁截面
  // 实例化一个透视投影相机对象
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.25, 20)
  // console.log(camera)

  // 相机在Three.js三维坐标系中的位置
  // 根据需要设置相机位置具体值 .position
  camera.position.set(1, 1, 1)

  // 相机观察目标指向Threejs 3D空间中某个位置 .lookAt()
  camera.lookAt(0, 0, 0) // 坐标原点
  // camera.lookAt(0, 50, 0) // y轴上位置50

  // 创建渲染器对象
  const renderer = new THREE.WebGLRenderer({
    antialias: true, // 锯齿属性
  })
  // console.log(renderer)
  // 解决加载gltf格式模型纹理贴图和原图不一样问题
  renderer.outputEncoding = THREE.sRGBEncoding

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
  .spt-wrapper {
    padding: 32px;
    color: #333;
    &> div {
        width: 100%;
        line-height: 36px;
    }
  }
  .spt {
    display: inline-block;
    width: 300px;
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
