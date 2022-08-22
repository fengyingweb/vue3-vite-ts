import {createRouter, createWebHashHistory} from 'vue-router';

const Home = ()=> import('../views/Home.vue');
const Mall = ()=> import('../views/Mall.vue');
const Register = ()=> import('../views/Register.vue');
const Login = ()=> import('../views/Login.vue');
const Category = ()=> import('../views/Category.vue');
const ShopCar = ()=> import('../views/ShopCar.vue');
const Members = ()=> import('../views/Members.vue');
const GoodsDetail = ()=> import('../views/GoodsDetail.vue');
const AMap = ()=> import('../views/AMap.vue');

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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router
