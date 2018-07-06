import Vue from 'vue'
import App from './App'
import router from './router'
import VueAxios from 'vue-axios'
import axios from './utils/request'
import VueMoment from 'vue-moment'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss'
import '@/assets/css/iconfont/iconfont.css'
import store from './store'
import 'babel-polyfill'
import * as filters from './filters' //全局filter
import './permission' // 权限

Vue.config.productionTip = false

Vue.use(ElementUI, { size: 'medium' })
Vue.use(VueMoment)
Vue.use(VueAxios, axios)

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
