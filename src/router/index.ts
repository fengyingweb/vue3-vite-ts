import {createRouter, createWebHashHistory} from 'vue-router';

const Home = ()=> import('../views/Home.vue');
const Mall = ()=> import('../views/Mall.vue');
const MaterialDelivery = ()=> import('../views/materialDelivery.vue');
const Register = ()=> import('../views/Register.vue');
const Login = ()=> import('../views/Login.vue');
const Category = ()=> import('../views/Category.vue');
const ShopCar = ()=> import('../views/ShopCar.vue');
const Members = ()=> import('../views/Members.vue');
const GoodsDetail = ()=> import('../views/GoodsDetail.vue');
const AMap = ()=> import('../views/AMap.vue');
const G2 = ()=> import('../views/G2.vue');
const G6 = ()=> import('../views/G6.vue');
const X6 = ()=> import('../views/X6.vue');
const F2 = ()=> import('../views/F2.vue');
const ThreeDemo1 = ()=> import('../views/ThreeDemo1.vue');
const ThreeDemo2 = ()=> import('../views/ThreeDemo2.vue');

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/mall',
    component: Home,
    children: [
      {
        path: 'mall',
        name: 'Mall',
        component: Mall,
        meta: {title: '商城首页', keepAlive: false},
      },
      {
        path: 'category',
        name: 'Category',
        component: Category,
        meta: {title: '商品分类', keepAlive: false}
      },
      {
        path: 'shopcar',
        name: 'ShopCar',
        component: ShopCar,
        meta: {title: '购物车', keepAlive: false}
      },
      {
        path: 'members',
        name: 'Members',
        component: Members,
        meta: {title: '会员中心', keepAlive: false}
      }
    ]
  },
  {
    path: '/materialDelivery',
    name: 'MaterialDelivery',
    component: MaterialDelivery,
    meta: {title: '呼叫1', keepAlive: false}
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {title: '用户注册', keepAlive: false}
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {title: '用户登录', keepAlive: false}
  },
  {
    path: '/goodsDetail',
    name: 'GoodsDetail',
    component: GoodsDetail,
    meta: {title: '商品详情', keepAlive: false}
  },
  {
    path: '/aMap',
    name: 'AMap',
    component: AMap,
    meta: {title: 'JSAPI Vue3地图组件示例', keepAlive: false}
  },
  {
    path: '/g2',
    name: 'G2',
    component: G2,
    meta: {title: '数据可视化工具AntV-G2', keepAlive: false}
  },
  {
    path: '/g6',
    name: 'G6',
    component: G6,
    meta: {title: '数据可视化工具AntV-G6', keepAlive: false}
  },
  {
    path: '/x6',
    name: 'X6',
    component: X6,
    meta: {title: '数据可视化工具AntV-X6', keepAlive: false}
  },
  {
    path: '/f2',
    name: 'F2',
    component: F2,
    meta: {title: '数据可视化工具AntV-F2', keepAlive: false}
  },
  {
    path: '/threeDemo1',
    name: 'ThreeDemo1',
    component: ThreeDemo1,
    meta: {title: 'ThreeJs-demo1', keepAlive: false}
  },
  {
    path: '/threeDemo2',
    name: 'ThreeDemo2',
    component: ThreeDemo2,
    meta: {title: 'ThreeJs-demo2', keepAlive: false}
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router
