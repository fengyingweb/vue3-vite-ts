import {createRouter, createWebHashHistory} from 'vue-router'

const Home = ()=> import('../views/Home.vue')
const MaterialDelivery = ()=> import('../views/materialDelivery.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {title: '首页', keepAlive: true}
  },
  {
    path: '/materialDelivery',
    name: 'MaterialDelivery',
    component: MaterialDelivery,
    meta: {title: '呼叫1', keepAlive: false}
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router
