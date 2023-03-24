<template>
  <div class="wrapper">
    <m-nav-bar></m-nav-bar>
    <section class="spt-wrapper">
      <div>两帧渲染时间间隔(毫秒)：<span class="spt">{{spt}}</span></div>
      <div>帧率FPS：<span class="spt">{{1000/spt}}</span></div>
    </section>
    <section ref="canvasRef" class="con-section">
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
// @ts-ignore
import mNavBar from '@/components/navBar'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// console.log(OrbitControls)
// console.log(THREE)

const canvasRef = ref(null)
const spt = ref(0)

const initThree = ()=> {
  // 创建3D场景对象
  const scene = new THREE.Scene()
  // console.log(scene)

  // 创建一个长方体几何对象Geometry
  const geometry = new THREE.BoxGeometry(80, 80, 80)
  // console.log(geometry)

  // 创建一个材质对象Material MeshLambertMaterial :网格漫反射材质
  const material = new THREE.MeshLambertMaterial({
    color: 0xff5566, // 设置材质颜色
    transparent: true,//开启透明
    opacity: 0.5,//设置透明度
  })
  // console.log(material)

  // 创建物体：网格模型Mesh, 两个参数分别为几何体geometry、材质material
  const mesh = new THREE.Mesh(geometry, material)
  // console.log(mesh)

  // 设置网格模型在三维空间中的位置坐标，默认是坐标原点
  mesh.position.set(0, 0, 0)

  // 把网格模型mesh添加到三维场景scene中
  scene.add(mesh)

  // AxesHelper：辅助观察的坐标系
  const axesHelper = new THREE.AxesHelper(120)
  scene.add(axesHelper)

  /**
   * 光源设置
  **/
  // 点光源
  const point = new THREE.PointLight(0xffffff)
  point.position.set(400, 200, 300) // 点光源位置
  scene.add(point) // 点光源添加到场景中

  // 光源辅助观察
  const pointLightHelper = new THREE.PointLightHelper(point, 10);
  scene.add(pointLightHelper)

  // 环境光
  const ambient = new THREE.AmbientLight(0x444444)
  scene.add(ambient) // 环境光添加到场景中

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
  camera.position.set(200, 300, 200)

  // 相机观察目标指向Threejs 3D空间中某个位置 .lookAt()
  // camera.lookAt(0, 0, 0) // 坐标原点
  // camera.lookAt(0, 50, 0) // y轴上位置50
  camera.lookAt(mesh.position) // 指向物体mesh的位置或者scene场景的位置

  // 创建渲染器对象
  const renderer = new THREE.WebGLRenderer()
  // console.log(renderer)

  // 设置像素比
  renderer.setPixelRatio(window.devicePixelRatio)

  // 设置three.js渲染区域的尺寸(像素px) .setSize()
  renderer.setSize(width, height)

  // 设置背景颜色
  renderer.setClearColor(0xb9d3ff, 1)

  // 执行渲染操作 .render()
  // renderer.render(scene, camera)

  // 把canvas画布插入到HTML元素中
  canvasRef.value.appendChild(renderer.domElement)

  // 设置相机控件轨道控制器 OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement)

  controls.addEventListener('change', ()=> {
    renderer.render(scene, camera)
  })

  window.addEventListener('resize', ()=> {
    const width = canvasRef.value.clientWidth
    const height = canvasRef.value.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }, false)

  // 渲染循环
  const clock = new THREE.Clock()

  // 动画渲染
  function animateRender() {
    spt.value = clock.getDelta()*1000 //毫秒
    renderer.render(scene, camera) //执行渲染操作
    mesh.rotateY(0.01) //每次绕y轴旋转0.01弧度
    requestAnimationFrame(animateRender) //请求再次执行渲染函数render，渲染下一帧
  }

  animateRender()
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
      width: 100%;
      height: 500px;
  }
</style>
