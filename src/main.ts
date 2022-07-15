import { createApp } from 'vue'
import App from './App.vue'
import '@/assets/css/base.less'
import '@/assets/css/vue2-animate.css'
import '@/assets/css/swiper.min.css'
import { createPinia } from 'pinia'
import router from './router'
import { Dialog, Toast, Popup, Icon, Field, Button, Picker, CellGroup, NavBar, Collapse, CollapseItem, Lazyload } from 'vant'
import {displayConvertTo, displayStyleControl, numberFix} from './utils/directive'
import './mock'

const app = createApp(App)
const pinia = createPinia()

router.beforeEach((to, from, next)=> {
  if (to.meta && to.meta.title) {
    document.title = typeof to.meta.title === 'string' ? to.meta.title  : 'Demo';
  }
  next();
})

// 注册指令
displayConvertTo(app)
displayStyleControl(app)
numberFix(app)

app.use(Dialog).use(Toast).use(Popup).use(Icon).use(Field)
  .use(Button).use(Picker).use(CellGroup).use(NavBar).use(Collapse)
  .use(CollapseItem).use(Lazyload)

app.use(router).use(pinia)

app.mount('#app')
