import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/css/base.less'
import '@/assets/css/vue2-animate.css'
import '@/assets/css/swiper.min.css'
import { createPinia } from 'pinia'
import router from './router'
import {
  Dialog,
  Toast,
  Popup,
  Icon,
  Field,
  Button,
  Picker,
  CellGroup,
  NavBar,
  Collapse,
  CollapseItem,
  Lazyload,
  Grid,
  GridItem, } from 'vant'
import {displayConvertTo, displayStyleControl, numberFix} from './utils/directive'

const app = createApp(App)
const pinia = createPinia()

router.beforeEach((to, from, next)=> {
  if (to.meta && to.meta.title) {
    document.title = typeof to.meta.title === 'string' ? to.meta.title  : 'Demo';
  }
  if (to.path === '/g6') {
    document.documentElement.style.backgroundColor = 'transparent'
    document.body.style.backgroundColor = 'transparent'
  } else {
    document.documentElement.style.backgroundColor = '#f2f2f2'
    document.body.style.backgroundColor = '#f2f2f2'
  }
  next();
})

// 注册指令
displayConvertTo(app)
displayStyleControl(app)
numberFix(app)

app.use(Dialog).use(Toast).use(Popup).use(Icon).use(Field)
  .use(Button).use(Picker).use(CellGroup).use(NavBar).use(Collapse)
  .use(CollapseItem).use(Lazyload).use(Grid)
  .use(GridItem)

app.use(router).use(pinia)

app.mount('#app')