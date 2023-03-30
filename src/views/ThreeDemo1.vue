<template>
  <div class="wrapper">
    <!-- <m-nav-bar></m-nav-bar> -->
    <section class="spt-wrapper">
      <div>两帧渲染时间间隔(毫秒)：<span class="spt">{{spt}}</span></div>
      <div>帧率FPS：<span class="spt">{{1000/spt}}</span></div>
    </section>
    <section ref="canvasRef" class="con-section">
    </section>
    <section ref="canvasRef2" class="con-section"></section>
    <section ref="canvasRef3" class="con-section"></section>
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
// console.log(OrbitControls)
// console.log(THREE)

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

const initThree = ()=> {
  // 创建3D场景对象
  const scene = new THREE.Scene()
  // console.log(scene)

  // 创建一个长方体几何对象Geometry
  const geometry = new THREE.BoxGeometry(80, 80, 80)
  // 球体
  // const geometry = new THREE.SphereGeometry(50)
  // 圆柱
  // const geometry = new THREE.CylinderGeometry(50, 50, 100)

  // 创建一个材质对象Material MeshLambertMaterial :网格漫反射材质
  // const material = new THREE.MeshLambertMaterial({
  //   color: 0xff5566, // 设置材质颜色
  //   transparent: true,//开启透明
  //   opacity: 0.8,//设置透明度
  // })
  // 高光材质 MeshPhongMaterial
  const material = new THREE.MeshPhongMaterial({
    color: 0xff5566,
    transparent: true,
    opacity: 0.8,
    shininess: 20, //高光部分的亮度，默认30
    specular: 0x444444, //高光部分的颜色
  })
  // console.log(material)

  // 创建物体：网格模型Mesh, 两个参数分别为几何体geometry、材质material
  const mesh = new THREE.Mesh(geometry, material)
  // console.log(mesh)

  // 克隆.clone() 模型
  const mesh2 = mesh.clone()
  const mesh3 = mesh.clone()
  // 设置网格模型在三维空间中的位置坐标，默认是坐标原点
  mesh2.position.set(0, -50, 0)

  // 复制.copy()位置
  mesh.position.copy(mesh2.position)
  mesh.position.y += 150
  mesh3.position.copy(mesh.position)
  mesh3.position.y += 150

  // 把网格模型mesh添加到三维场景scene中
  scene.add(mesh)
  scene.add(mesh2)
  scene.add(mesh3)

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
  camera.position.set(500, 600, 500)

  // 相机观察目标指向Threejs 3D空间中某个位置 .lookAt()
  // camera.lookAt(0, 0, 0) // 坐标原点
  // camera.lookAt(0, 50, 0) // y轴上位置50
  camera.lookAt(scene.position) // 指向物体mesh的位置或者scene场景的位置

  // 创建渲染器对象
  const renderer = new THREE.WebGLRenderer({
    antialias: true, // 锯齿属性
  })
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
  const {x, y, z} = mesh.position
  controls.target.set(x, y, z) // 相机目标观察点
	controls.update() // update()函数内会执行camera.lookAt(controls.targe)
	controls.enablePan = false
	controls.enableDamping = true

  // 采用了循环渲染，就不用调用change事件了
  // controls.addEventListener('change', ()=> {
  //   renderer.render(scene, camera)
  // })

  const obj = {
    bool: true
  }
  const gui = new GUI()
  gui.domElement.style.position = 'absolute'
  gui.domElement.style.right = 0
  canvasRef.value.appendChild(gui.domElement)

  gui.add(obj, 'bool').name('是否旋转')

  // 物体坐标可视化 .addFolder()增加分组
  const meshPosition = gui.addFolder('物体坐标')
  meshPosition.close()
  meshPosition.add(mesh.position, 'x', 0, 200).name('x坐标').step(1)
  meshPosition.add(mesh.position, 'y', [-100, 0, 100]).name('y坐标')
  meshPosition.add(mesh.position, 'z', {left: -100, center: 0, right: 100}).name('z坐标')

  // 光照强度可视化
  const pointLightFolder = gui.addFolder('Point Light(点光源)')
  pointLightFolder.close()
  pointLightFolder.add(point, 'intensity', 0, 5.0).name('点光源强度').step(0.1)

  // 材质可视化
  const materialFolder = gui.addFolder('THREE.Material(材质公共属性)')
  materialFolder.close()
  materialFolder.addColor(material, 'color').name('材质颜色').onChange(handleColorChange(material.color))
  materialFolder.add(material, 'transparent').name('是否透明')
  materialFolder.add(material, 'opacity', 0, 1).name('透明度').step(0.01)

  const phongMaterialFolder = gui.addFolder('THREE.MeshPhongMaterial(高光材质)')
  phongMaterialFolder.close()
  phongMaterialFolder.addColor(material, 'specular').name('高光颜色')
  phongMaterialFolder.add(material, 'shininess', 0, 100).name('高光亮度').step(1)

  window.addEventListener('resize', ()=> {
    const width = canvasRef.value.clientWidth
    const height = canvasRef.value.clientHeight
    camera.aspect = width / height
    // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }, false)

  // 渲染循环
  const clock = new THREE.Clock()

  const stats = new Stats()
  stats.domElement.style.position = 'absolute'
  canvasRef.value.appendChild(stats.domElement)

  // 动画渲染
  function animateRender() {
    spt.value = clock.getDelta()*1000 //毫秒
    if (obj.bool) {
      mesh.rotateY(0.01) //每次绕y轴旋转0.01弧度
      mesh2.rotation.copy(mesh.rotation) // 复制mesh旋转角度，保持和mesh的动作一致
      mesh3.rotation.copy(mesh.rotation)
    } 
    controls.update()
    stats.update()
    renderer.render(scene, camera) //执行渲染操作
    requestAnimationFrame(animateRender) //请求再次执行渲染函数render，渲染下一帧
  }

  animateRender()
}

const initThree2 = () => {
  const scene = new THREE.Scene()
  const geometry = new THREE.BoxGeometry(100, 100, 100)
  const material = new THREE.MeshLambertMaterial({
    color: 0x67c23a,
    transparent: true,
    opacity: 1
  })
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(i*200, 0, j*200)
      scene.add(mesh)
    }
  }
  
  const pointLight = new THREE.PointLight(0xffffff)
  pointLight.position.set(2200, 1900, 2100)
  scene.add(pointLight)

  const ambient = new THREE.AmbientLight(0x444444)
  scene.add(ambient)
  const width = canvasRef2.value.clientWidth
  const height = canvasRef2.value.clientHeight

  const camera = new THREE.PerspectiveCamera(30, width / height, 1, 8000)
  camera.position.set(2000, 2000, 2000)
  camera.lookAt(1000, 0, 1000)

  const renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  renderer.setClearColor(0xb9d3ff, 1)
  renderer.render(scene, camera)

  canvasRef2.value.appendChild(renderer.domElement)

  // 设置相机控件轨道控制器 OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(1000, 0, 1000) // 相机目标观察点
	controls.update() // update()函数内会执行camera.lookAt(controls.targe)
	controls.enablePan = false
	controls.enableDamping = true

  // 采用了循环渲染，就不用调用change事件了
  controls.addEventListener('change', ()=> {
    renderer.render(scene, camera)
  })
}

const initThree3 = () => {
  const scene = new THREE.Scene()
  // 创建一个空的几何体对象 缓冲类型几何体BufferGeometry
  const geometry1 = new THREE.BufferGeometry()
  // 类型化数组创建顶点数据
  const vertices1 = new Float32Array([
    0, 0, 0, //顶点1坐标
    50, 0, 0, //顶点2坐标
    0, 50, 0, //顶点3坐标
    0, 0, 10, //顶点4坐标
    0, 0, 100, //顶点5坐标
    50, 0, 10, //顶点6坐标
  ])
  // 创建属性缓冲区对象
  //3个为一组，表示一个顶点的xyz坐标
  const attribue1 = new THREE.BufferAttribute(vertices1, 3)
  // 设置几何体attributes属性的位置属性
  geometry1.attributes.position = attribue1
  // 点渲染模式
  const pointMaterial = new THREE.PointsMaterial({
      color: 0xffff00,
      size: 10.0 //点对象像素尺寸
  })
  // 点模型对象
  const points = new THREE.Points(geometry1, pointMaterial)
  scene.add(points)

  // 线材质对象
  const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xff0000 //线条颜色
  })
  // 创建线模型对象
  const line = new THREE.Line(geometry1, lineMaterial)

  // 非连续的线条
  // const line = new THREE.LineSegments(geometry, lineMaterial)

  // 闭合线条
  // const line = new THREE.LineLoop(geometry, lineMaterial)
  scene.add(line)

  const boxGeometry = new THREE.BoxGeometry(50, 50, 50)

  // 网格材质
  const meshMaterial = new THREE.MeshBasicMaterial({
    color: 0x409eff,
    side: THREE.DoubleSide // FrontSide 默认正面可见 DoubleSide 两面可见 BackSide 只有背面可见
  })
  
  const mesh = new THREE.Mesh(geometry1, meshMaterial)
  // mesh.position.set(0, 150, 0)
  scene.add(mesh)

  const geometry2 = new THREE.BufferGeometry()
  const vertices2 = new Float32Array([
    0, 60, 0, //顶点1坐标
    80, 60, 0, //顶点2坐标
    80, 140, 0, //顶点3坐标
    // 0, 60, 0, //顶点4坐标
    // 80, 140, 0, //顶点5坐标
    0, 140, 0, //顶点6坐标
  ])
  // Uint16Array类型数组创建顶点索引数据
  const indexes = new Uint16Array([
      // 下面索引值对应顶点位置数据中的顶点坐标
      0, 1, 2, 0, 2, 3,
  ])
  // 索引数据赋值给几何体的index属性
  geometry2.index = new THREE.BufferAttribute(indexes, 1) //1个为一组

  const attribute2 = new THREE.BufferAttribute(vertices2, 3)
  geometry2.attributes.position = attribute2

  // 设置几何体的顶点法线属性.attributes.normal
  // geometry2.attributes.normal = attribute2

  const points2 = new THREE.Points(geometry2, pointMaterial)
  scene.add(points2)

  const line2 = new THREE.LineLoop(geometry2, lineMaterial)
  scene.add(line2)

  const mesh2 = new THREE.Mesh(geometry2, meshMaterial)
  scene.add(mesh2)

  //矩形几何体PlaneGeometry的参数3,4表示细分数，默认是1,1
  const geometry3 = new THREE.PlaneGeometry(100, 60, 2, 2)
  geometry3.scale(2, 2, 2) // xyz缩放
  geometry3.translate(80, 0, 0) // 沿着X轴平移
  geometry3.rotateY(Math.PI / 3) // 沿着Y轴旋转
  console.log('顶点位置数据', geometry3.attributes.position)

  const lambertMaterial = new THREE.MeshLambertMaterial({
    color: 0xff5566, 
    wireframe: true,//线条模式渲染mesh对应的三角形数据
  })
  const mesh3 = new THREE.Mesh(geometry3, lambertMaterial)
  mesh3.position.set(0, -120, 0)
  scene.add(mesh3)

  const pointLight = new THREE.PointLight(0xffffff)
  pointLight.position.set(400, 200, 300)
  scene.add(pointLight)

  const ambient = new THREE.AmbientLight(0x444444)
  scene.add(ambient)

  const width = canvasRef3.value.clientWidth
  const height = canvasRef3.value.clientHeight

  const camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000)
  camera.position.set(500, 500, 500)
  camera.lookAt(scene.position)

  const renderer = new THREE.WebGLRenderer({
    antialias: true
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  renderer.setClearColor(0x000000, 1)
  renderer.render(scene, camera)

  canvasRef3.value.appendChild(renderer.domElement)
}

onMounted(()=> {
  initThree()
  initThree2()
  initThree3()
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
      margin-top: 32px;
      width: 100%;
      height: 500px;
  }
  .con-section1 {
      position: relative;
      margin-top: 32px;
      width: 100%;
      height: 800px;
  }
</style>
